-- First, let's see what categories exist
SELECT id, name, type, icon, color FROM transaction_categories ORDER BY type, name;

-- Update all categories to use lucide-react icon names
-- This will work regardless of current icon values

-- Income categories
UPDATE transaction_categories SET icon = 'Briefcase'
WHERE LOWER(TRIM(name)) = 'lương' AND type = 'income';

UPDATE transaction_categories SET icon = 'Gift'
WHERE LOWER(TRIM(name)) = 'thưởng' AND type = 'income';

UPDATE transaction_categories SET icon = 'Coins'
WHERE LOWER(TRIM(name)) LIKE '%thu nhập%' AND type = 'income';

-- Expense categories
UPDATE transaction_categories SET icon = 'Utensils'
WHERE LOWER(TRIM(name)) LIKE '%ăn%' AND type = 'expense';

UPDATE transaction_categories SET icon = 'Car'
WHERE LOWER(TRIM(name)) LIKE '%di chuyển%' AND type = 'expense';

UPDATE transaction_categories SET icon = 'ShoppingCart'
WHERE LOWER(TRIM(name)) LIKE '%mua sắm%' AND type = 'expense';

UPDATE transaction_categories SET icon = 'Home'
WHERE LOWER(TRIM(name)) LIKE '%nhà%' AND type = 'expense';

UPDATE transaction_categories SET icon = 'Gamepad2'
WHERE LOWER(TRIM(name)) LIKE '%giải trí%' AND type = 'expense';

UPDATE transaction_categories SET icon = 'HeartPulse'
WHERE LOWER(TRIM(name)) LIKE '%sức khỏe%' OR LOWER(TRIM(name)) LIKE '%suc khoe%' AND type = 'expense';

UPDATE transaction_categories SET icon = 'GraduationCap'
WHERE LOWER(TRIM(name)) LIKE '%giáo dục%' AND type = 'expense';

UPDATE transaction_categories SET icon = 'Wallet'
WHERE LOWER(TRIM(name)) LIKE '%chi phí%' AND type = 'expense';

-- Verify the changes
SELECT id, name, type, icon, color FROM transaction_categories ORDER BY type, name;
