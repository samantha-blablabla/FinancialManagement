-- Transaction Management Schema
-- Run this in Supabase SQL Editor after 001_rls_policies_simple.sql

-- =====================================================
-- TRANSACTION CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS transaction_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES transaction_categories(id) ON DELETE SET NULL,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PLANS (for project-based budgeting)
-- =====================================================

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  budget_amount DECIMAL(15, 2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TRANSACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES transaction_categories(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_transaction_categories_space_id ON transaction_categories(space_id);
CREATE INDEX IF NOT EXISTS idx_plans_space_id ON plans(space_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
CREATE INDEX IF NOT EXISTS idx_transactions_space_id ON transactions(space_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_plan_id ON transactions(plan_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_space_date ON transactions(space_id, date DESC);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read transaction categories" ON transaction_categories;
DROP POLICY IF EXISTS "Anyone can insert transaction categories" ON transaction_categories;
DROP POLICY IF EXISTS "Anyone can update transaction categories" ON transaction_categories;
DROP POLICY IF EXISTS "Anyone can delete transaction categories" ON transaction_categories;
DROP POLICY IF EXISTS "Anyone can read plans" ON plans;
DROP POLICY IF EXISTS "Anyone can insert plans" ON plans;
DROP POLICY IF EXISTS "Anyone can update plans" ON plans;
DROP POLICY IF EXISTS "Anyone can delete plans" ON plans;
DROP POLICY IF EXISTS "Anyone can read transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can update transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can delete transactions" ON transactions;

-- Enable RLS
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Transaction Categories Policies
CREATE POLICY "Anyone can read transaction categories"
  ON transaction_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert transaction categories"
  ON transaction_categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update transaction categories"
  ON transaction_categories FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete transaction categories"
  ON transaction_categories FOR DELETE
  USING (true);

-- Plans Policies
CREATE POLICY "Anyone can read plans"
  ON plans FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert plans"
  ON plans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update plans"
  ON plans FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete plans"
  ON plans FOR DELETE
  USING (true);

-- Transactions Policies
CREATE POLICY "Anyone can read transactions"
  ON transactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update transactions"
  ON transactions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete transactions"
  ON transactions FOR DELETE
  USING (true);

-- =====================================================
-- DEFAULT CATEGORIES
-- =====================================================

-- Note: Default categories will be inserted when a space is created
-- This is handled in the application code
