-- Remove "Đầu tư" from income categories as it will be a separate feature
DELETE FROM transaction_categories
WHERE name = 'Đầu tư' AND type = 'income' AND is_system = true;
