-- Financial Management Application - Row Level Security Policies
-- Created: 2026-01-04

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- SPACES POLICIES
-- =====================================================

CREATE POLICY "Users can view their spaces"
  ON spaces FOR SELECT
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM space_members
      WHERE space_members.space_id = spaces.id
      AND space_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own spaces"
  ON spaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their spaces"
  ON spaces FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their spaces"
  ON spaces FOR DELETE
  USING (auth.uid() = owner_id);

-- =====================================================
-- SPACE MEMBERS POLICIES
-- =====================================================

CREATE POLICY "Users can view space members"
  ON space_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM space_members sm
      WHERE sm.space_id = space_members.space_id
      AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Space owners can insert members"
  ON space_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_members.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Space owners can delete members"
  ON space_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = space_members.space_id
      AND spaces.owner_id = auth.uid()
    )
  );

-- =====================================================
-- HELPER FUNCTION: Check if user is space member
-- =====================================================

CREATE OR REPLACE FUNCTION is_space_member(space_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM space_members
    WHERE space_id = space_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRANSACTION CATEGORIES POLICIES
-- =====================================================

CREATE POLICY "Users can view space categories"
  ON transaction_categories FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space categories"
  ON transaction_categories FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space categories"
  ON transaction_categories FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space categories"
  ON transaction_categories FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- PLANS POLICIES
-- =====================================================

CREATE POLICY "Users can view space plans"
  ON plans FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space plans"
  ON plans FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space plans"
  ON plans FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space plans"
  ON plans FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- TRANSACTIONS POLICIES
-- =====================================================

CREATE POLICY "Users can view space transactions"
  ON transactions FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space transactions"
  ON transactions FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space transactions"
  ON transactions FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space transactions"
  ON transactions FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- INVESTMENT PORTFOLIOS POLICIES
-- =====================================================

CREATE POLICY "Users can view space portfolios"
  ON investment_portfolios FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space portfolios"
  ON investment_portfolios FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space portfolios"
  ON investment_portfolios FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space portfolios"
  ON investment_portfolios FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- STOCK HOLDINGS POLICIES
-- =====================================================

CREATE POLICY "Users can view space stock holdings"
  ON stock_holdings FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space stock holdings"
  ON stock_holdings FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space stock holdings"
  ON stock_holdings FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space stock holdings"
  ON stock_holdings FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- STOCK TRANSACTIONS POLICIES
-- =====================================================

CREATE POLICY "Users can view space stock transactions"
  ON stock_transactions FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space stock transactions"
  ON stock_transactions FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space stock transactions"
  ON stock_transactions FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space stock transactions"
  ON stock_transactions FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- CRYPTO HOLDINGS POLICIES
-- =====================================================

CREATE POLICY "Users can view space crypto holdings"
  ON crypto_holdings FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space crypto holdings"
  ON crypto_holdings FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space crypto holdings"
  ON crypto_holdings FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space crypto holdings"
  ON crypto_holdings FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- REAL ESTATE HOLDINGS POLICIES
-- =====================================================

CREATE POLICY "Users can view space real estate holdings"
  ON real_estate_holdings FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space real estate holdings"
  ON real_estate_holdings FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space real estate holdings"
  ON real_estate_holdings FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space real estate holdings"
  ON real_estate_holdings FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- SAVINGS GOALS POLICIES
-- =====================================================

CREATE POLICY "Users can view space savings goals"
  ON savings_goals FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space savings goals"
  ON savings_goals FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space savings goals"
  ON savings_goals FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space savings goals"
  ON savings_goals FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- SAVINGS CONTRIBUTIONS POLICIES
-- =====================================================

CREATE POLICY "Users can view space savings contributions"
  ON savings_contributions FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space savings contributions"
  ON savings_contributions FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space savings contributions"
  ON savings_contributions FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space savings contributions"
  ON savings_contributions FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- BUDGETS POLICIES
-- =====================================================

CREATE POLICY "Users can view space budgets"
  ON budgets FOR SELECT
  USING (is_space_member(space_id));

CREATE POLICY "Users can insert space budgets"
  ON budgets FOR INSERT
  WITH CHECK (is_space_member(space_id));

CREATE POLICY "Users can update space budgets"
  ON budgets FOR UPDATE
  USING (is_space_member(space_id));

CREATE POLICY "Users can delete space budgets"
  ON budgets FOR DELETE
  USING (is_space_member(space_id));

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true); -- Will be created by backend/triggers

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());
