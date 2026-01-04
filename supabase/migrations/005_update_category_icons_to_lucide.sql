-- Update category icons from emoji to lucide-react icon names

-- Income categories
UPDATE transaction_categories SET icon = 'Briefcase' WHERE name = 'Lương' AND type = 'income';
UPDATE transaction_categories SET icon = 'Gift' WHERE name = 'Thưởng' AND type = 'income';
UPDATE transaction_categories SET icon = 'Coins' WHERE name = 'Thu nhập khác' AND type = 'income';

-- Expense categories
UPDATE transaction_categories SET icon = 'Utensils' WHERE name = 'Ăn uống' AND type = 'expense';
UPDATE transaction_categories SET icon = 'Car' WHERE name = 'Di chuyển' AND type = 'expense';
UPDATE transaction_categories SET icon = 'ShoppingCart' WHERE name = 'Mua sắm' AND type = 'expense';
UPDATE transaction_categories SET icon = 'Home' WHERE name = 'Nhà cửa' AND type = 'expense';
UPDATE transaction_categories SET icon = 'Gamepad2' WHERE name = 'Giải trí' AND type = 'expense';
UPDATE transaction_categories SET icon = 'HeartPulse' WHERE name = 'Sức khỏe' AND type = 'expense';
UPDATE transaction_categories SET icon = 'GraduationCap' WHERE name = 'Giáo dục' AND type = 'expense';
UPDATE transaction_categories SET icon = 'Wallet' WHERE name = 'Chi phí khác' AND type = 'expense';
