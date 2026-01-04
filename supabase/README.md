# Supabase Database Setup

## Hướng dẫn Setup Supabase

### 1. Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập
3. Tạo project mới
4. Chọn region gần nhất (Singapore cho Việt Nam)
5. Đặt database password (lưu lại an toàn)

### 2. Lấy API Keys

Sau khi project được tạo:

1. Vào Settings > API
2. Copy các giá trị sau:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (giữ bí mật!)

3. Tạo file `.env.local` ở root project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Chạy Migrations

Có 2 cách:

#### Cách 1: Sử dụng Supabase Dashboard (Đơn giản nhất)

1. Vào Supabase Dashboard
2. Chọn SQL Editor
3. Copy nội dung từng file migration và chạy theo thứ tự:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_functions.sql`

#### Cách 2: Sử dụng Supabase CLI

```bash
# Cài đặt Supabase CLI
npm install -g supabase

# Login
supabase login

# Link với project
supabase link --project-ref your-project-ref

# Chạy migrations
supabase db push
```

### 4. Kiểm tra Database

Sau khi chạy migrations, kiểm tra:

1. Vào Table Editor - Phải thấy 15 tables
2. Vào Database > Policies - Mỗi table phải có RLS policies
3. Vào Database > Functions - Phải có các functions helper

### 5. Setup Email Templates (Optional)

Supabase gửi email cho auth. Bạn có thể customize:

1. Vào Authentication > Email Templates
2. Chỉnh sửa các template:
   - Confirm signup
   - Magic link
   - Change email address
   - Reset password

### 6. Storage Setup (Optional - cho avatar)

Nếu muốn cho phép user upload avatar:

1. Vào Storage
2. Tạo bucket mới tên `avatars`
3. Set public hoặc private tùy ý
4. Tạo RLS policies cho bucket

## Database Schema Overview

### Core Tables
- `profiles` - User profiles
- `spaces` - Financial workspaces
- `space_members` - Space membership

### Transactions
- `transaction_categories` - Income/expense categories
- `plans` - Financial plans (trips, events)
- `transactions` - Income/expense records

### Investments
- `investment_portfolios` - Investment portfolios
- `stock_holdings` - Vietnamese stocks
- `stock_transactions` - Stock buy/sell history
- `crypto_holdings` - Cryptocurrency
- `real_estate_holdings` - Real estate

### Savings & Budgets
- `savings_goals` - Savings targets
- `savings_contributions` - Savings deposits
- `budgets` - Budget limits
- `notifications` - User notifications

## Security

- ✅ Row Level Security enabled trên tất cả tables
- ✅ Space-based isolation: User chỉ xem được data của space họ tham gia
- ✅ Helper function `is_space_member()` để check quyền
- ✅ Automatic triggers cho updated_at
- ✅ Budget alerts tự động
- ✅ Savings milestone notifications

## Helpful SQL Queries

### Xem tất cả spaces của user
```sql
SELECT s.*
FROM spaces s
LEFT JOIN space_members sm ON s.id = sm.space_id
WHERE s.owner_id = auth.uid() OR sm.user_id = auth.uid();
```

### Tổng thu chi tháng này
```sql
SELECT
  get_monthly_summary(
    'space-uuid'::uuid,
    EXTRACT(YEAR FROM CURRENT_DATE)::int,
    EXTRACT(MONTH FROM CURRENT_DATE)::int
  );
```

### Check budget usage
```sql
SELECT calculate_budget_usage('budget-uuid'::uuid);
```

## Troubleshooting

### Lỗi "permission denied"
- Check RLS policies đã enable chưa
- Verify user đang login và có quyền access space

### Migrations failed
- Chạy lại từng file một theo thứ tự
- Check syntax errors trong SQL Editor

### Functions không hoạt động
- Verify `SECURITY DEFINER` được set
- Check function permissions trong dashboard
