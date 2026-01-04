-- Financial Management Application - Database Functions
-- Created: 2026-01-04

-- =====================================================
-- BUDGET FUNCTIONS
-- =====================================================

-- Calculate budget usage
CREATE OR REPLACE FUNCTION calculate_budget_usage(budget_uuid UUID)
RETURNS DECIMAL(15, 2) AS $$
DECLARE
  usage DECIMAL(15, 2);
  budget_record RECORD;
BEGIN
  SELECT * INTO budget_record FROM budgets WHERE id = budget_uuid;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  SELECT COALESCE(SUM(amount), 0) INTO usage
  FROM transactions
  WHERE space_id = budget_record.space_id
    AND category_id = budget_record.category_id
    AND type = 'expense'
    AND date >= budget_record.start_date
    AND (budget_record.end_date IS NULL OR date <= budget_record.end_date);

  RETURN usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SAVINGS FUNCTIONS
-- =====================================================

-- Update savings goal amount when contribution is added/updated/deleted
CREATE OR REPLACE FUNCTION update_savings_goal_amount()
RETURNS TRIGGER AS $$
DECLARE
  goal_uuid UUID;
BEGIN
  -- Get the goal_id from OLD or NEW depending on operation
  IF TG_OP = 'DELETE' THEN
    goal_uuid := OLD.goal_id;
  ELSE
    goal_uuid := NEW.goal_id;
  END IF;

  -- Update the savings goal current amount
  UPDATE savings_goals
  SET
    current_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM savings_contributions
      WHERE goal_id = goal_uuid
    ),
    updated_at = NOW()
  WHERE id = goal_uuid;

  -- Check if goal is completed
  UPDATE savings_goals
  SET status = 'completed'
  WHERE id = goal_uuid
    AND current_amount >= target_amount
    AND status = 'active';

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_savings_goal_on_contribution
AFTER INSERT OR UPDATE OR DELETE ON savings_contributions
FOR EACH ROW EXECUTE FUNCTION update_savings_goal_amount();

-- =====================================================
-- NOTIFICATION FUNCTIONS
-- =====================================================

-- Check budget alerts and create notifications
CREATE OR REPLACE FUNCTION check_budget_alerts()
RETURNS void AS $$
DECLARE
  budget_record RECORD;
  usage DECIMAL(15, 2);
  usage_percentage DECIMAL(5, 2);
  member_record RECORD;
BEGIN
  FOR budget_record IN
    SELECT * FROM budgets WHERE is_active = TRUE
  LOOP
    usage := calculate_budget_usage(budget_record.id);

    IF budget_record.amount > 0 THEN
      usage_percentage := (usage / budget_record.amount) * 100;

      -- Only create alert if usage exceeds threshold
      IF usage_percentage >= budget_record.alert_threshold THEN
        -- Check if alert already exists for this budget (to avoid spam)
        IF NOT EXISTS (
          SELECT 1 FROM notifications
          WHERE related_entity_type = 'budget'
            AND related_entity_id = budget_record.id
            AND created_at > NOW() - INTERVAL '1 day'
        ) THEN
          -- Create notification for all space members
          FOR member_record IN
            SELECT user_id FROM space_members
            WHERE space_id = budget_record.space_id
          LOOP
            INSERT INTO notifications (
              space_id,
              user_id,
              type,
              title,
              message,
              severity,
              related_entity_type,
              related_entity_id
            ) VALUES (
              budget_record.space_id,
              member_record.user_id,
              'budget_alert',
              'Cảnh báo ngân sách: ' || budget_record.name,
              'Bạn đã sử dụng ' || ROUND(usage_percentage, 1) || '% ngân sách (' ||
                usage || '/' || budget_record.amount || ' VNĐ)',
              CASE
                WHEN usage_percentage >= 100 THEN 'error'
                WHEN usage_percentage >= 90 THEN 'warning'
                ELSE 'info'
              END,
              'budget',
              budget_record.id
            );
          END LOOP;
        END IF;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check budget after transaction insert/update
CREATE OR REPLACE FUNCTION trigger_check_budget_after_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check for expense transactions
  IF NEW.type = 'expense' AND NEW.category_id IS NOT NULL THEN
    PERFORM check_budget_alerts();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_budget_after_transaction
AFTER INSERT OR UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION trigger_check_budget_after_transaction();

-- Check savings milestone and create notification
CREATE OR REPLACE FUNCTION check_savings_milestone()
RETURNS TRIGGER AS $$
DECLARE
  member_record RECORD;
  milestone_percentage DECIMAL(5, 2);
BEGIN
  IF NEW.current_amount > OLD.current_amount AND NEW.target_amount > 0 THEN
    milestone_percentage := (NEW.current_amount / NEW.target_amount) * 100;

    -- Notify at 25%, 50%, 75%, 100%
    IF (milestone_percentage >= 100 AND OLD.current_amount / NEW.target_amount * 100 < 100) OR
       (milestone_percentage >= 75 AND OLD.current_amount / NEW.target_amount * 100 < 75) OR
       (milestone_percentage >= 50 AND OLD.current_amount / NEW.target_amount * 100 < 50) OR
       (milestone_percentage >= 25 AND OLD.current_amount / NEW.target_amount * 100 < 25) THEN

      FOR member_record IN
        SELECT user_id FROM space_members
        WHERE space_id = NEW.space_id
      LOOP
        INSERT INTO notifications (
          space_id,
          user_id,
          type,
          title,
          message,
          severity,
          related_entity_type,
          related_entity_id
        ) VALUES (
          NEW.space_id,
          member_record.user_id,
          'savings_milestone',
          'Chúc mừng! Mục tiêu tiết kiệm đạt ' || ROUND(milestone_percentage, 0) || '%',
          NEW.name || ': ' || NEW.current_amount || '/' || NEW.target_amount || ' VNĐ',
          'success',
          'savings_goal',
          NEW.id
        );
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_savings_milestone_trigger
AFTER UPDATE ON savings_goals
FOR EACH ROW EXECUTE FUNCTION check_savings_milestone();

-- =====================================================
-- ANALYTICS FUNCTIONS
-- =====================================================

-- Get monthly transaction summary for a space
CREATE OR REPLACE FUNCTION get_monthly_summary(
  space_uuid UUID,
  year_param INTEGER,
  month_param INTEGER
)
RETURNS TABLE (
  total_income DECIMAL(15, 2),
  total_expense DECIMAL(15, 2),
  net_amount DECIMAL(15, 2),
  transaction_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_amount,
    COUNT(*)::INTEGER as transaction_count
  FROM transactions
  WHERE space_id = space_uuid
    AND EXTRACT(YEAR FROM date) = year_param
    AND EXTRACT(MONTH FROM date) = month_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get portfolio total value
CREATE OR REPLACE FUNCTION get_portfolio_value(portfolio_uuid UUID)
RETURNS DECIMAL(15, 2) AS $$
DECLARE
  total_value DECIMAL(15, 2) := 0;
  portfolio_type TEXT;
BEGIN
  SELECT type INTO portfolio_type FROM investment_portfolios WHERE id = portfolio_uuid;

  IF portfolio_type = 'stocks' THEN
    SELECT COALESCE(SUM(quantity * COALESCE(current_price, average_buy_price)), 0)
    INTO total_value
    FROM stock_holdings
    WHERE portfolio_id = portfolio_uuid;
  ELSIF portfolio_type = 'crypto' THEN
    SELECT COALESCE(SUM(quantity * COALESCE(current_price, average_buy_price)), 0)
    INTO total_value
    FROM crypto_holdings
    WHERE portfolio_id = portfolio_uuid;
  ELSIF portfolio_type = 'real_estate' THEN
    SELECT COALESCE(SUM(COALESCE(current_value, purchase_price)), 0)
    INTO total_value
    FROM real_estate_holdings
    WHERE portfolio_id = portfolio_uuid;
  END IF;

  RETURN total_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
