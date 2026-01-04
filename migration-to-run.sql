-- Migration: Add Multi-Currency Support
-- This migration changes the currency field from single currency to array of currencies
-- Created: 2026-01-04

-- =====================================================
-- STEP 1: Add new currencies array column
-- =====================================================

-- Add new column for multiple currencies (array)
ALTER TABLE spaces
ADD COLUMN IF NOT EXISTS currencies TEXT[] DEFAULT ARRAY['VND'];

-- =====================================================
-- STEP 2: Migrate existing data
-- =====================================================

-- Copy existing single currency to currencies array
UPDATE spaces
SET currencies = ARRAY[currency]
WHERE currency IS NOT NULL AND currencies = ARRAY['VND'];

-- For spaces where currency is NULL, set default to VND
UPDATE spaces
SET currencies = ARRAY['VND']
WHERE currency IS NULL;

-- =====================================================
-- STEP 3: Add currency field to transactions table
-- =====================================================

-- Add currency field to transactions to track which currency each transaction uses
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'VND';

-- Set existing transactions to use the space's primary currency
-- (We'll use the first currency in the array as the primary one)
UPDATE transactions t
SET currency = s.currencies[1]
FROM spaces s
WHERE t.space_id = s.id AND t.currency = 'VND';

-- =====================================================
-- STEP 4: Create index for better performance
-- =====================================================

-- Index for currency queries
CREATE INDEX IF NOT EXISTS idx_transactions_currency ON transactions(currency);
CREATE INDEX IF NOT EXISTS idx_transactions_space_currency ON transactions(space_id, currency);

-- =====================================================
-- STEP 5: Add constraint to ensure currency is valid
-- =====================================================

-- Add check constraint to ensure transaction currency is in space's currencies list
-- Note: This will be enforced at application level for now
-- Future: Add trigger to validate

-- =====================================================
-- NOTES FOR FUTURE IMPLEMENTATION:
-- =====================================================
-- 1. Keep old 'currency' column for backward compatibility (can remove later)
-- 2. Application should validate that transaction.currency exists in space.currencies
-- 3. When displaying statistics, group by currency
-- 4. Add exchange rate table later for currency conversion
-- 5. Primary currency = currencies[1] (first element)
