# Hướng dẫn Setup Database Supabase

## Bước 1: Truy cập Supabase SQL Editor

1. Đăng nhập vào [Supabase](https://supabase.com)
2. Chọn project của bạn: `emrkibqfkjjwpupqfger`
3. Vào menu bên trái, chọn **SQL Editor**

## Bước 2: Chạy Migration Script

Copy toàn bộ nội dung bên dưới và paste vào SQL Editor, sau đó nhấn **Run**:

```sql
-- Simplified Financial Management Schema (Without Auth)
-- Run this in Supabase SQL Editor

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Spaces table (financial workspaces)
CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  password_hash TEXT NOT NULL,
  owner_id UUID NOT NULL,
  currency TEXT DEFAULT 'VND',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Space members (who has access to which space)
CREATE TABLE IF NOT EXISTS space_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_spaces_owner_id ON spaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_space_members_user_id ON space_members(user_id);
CREATE INDEX IF NOT EXISTS idx_space_members_space_id ON space_members(space_id);

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON spaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Bước 3: Kiểm tra

Sau khi chạy script thành công, bạn sẽ thấy thông báo "Success. No rows returned".

Để kiểm tra tables đã được tạo, chạy query sau:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('spaces', 'space_members');
```

Bạn sẽ thấy 2 tables:
- `spaces`
- `space_members`

## Bước 4: Test Space Creation

Sau khi setup xong database:

1. Mở trình duyệt vào: http://localhost:3002
2. Click "Tạo Space Mới"
3. Nhập tên space (ví dụ: "Samantha")
4. Nhập mật khẩu (tối thiểu 6 ký tự)
5. Xác nhận mật khẩu
6. Click "Tạo Space"

Nếu thành công, bạn sẽ được redirect đến dashboard!

## Bước 4: Chạy RLS Policies (Bảo mật - Tùy chọn)

Nếu bạn muốn thêm bảo mật Row Level Security, chạy thêm file này:

Copy nội dung file `supabase/migrations/001_rls_policies_simple.sql` và chạy trong SQL Editor.

RLS sẽ giúp:
- Bảo vệ dữ liệu giữa các spaces
- Chỉ owner mới có thể xóa/sửa space
- Kiểm soát quyền truy cập

**Lưu ý:** Hiện tại app đang chạy OK mà không cần RLS, bạn có thể bỏ qua bước này và chạy sau nếu cần.

## Troubleshooting

Nếu gặp lỗi "Could not find the table 'public.spaces'":
- Đảm bảo đã chạy script SQL ở Bước 2
- Refresh lại page Supabase
- Kiểm tra lại tables đã tồn tại chưa bằng query ở Bước 3

Nếu gặp lỗi khác:
- Check console trong browser (F12) để xem lỗi chi tiết
- Check terminal localhost để xem error logs

## Animated Background

Nếu không thấy animated background:
- Hard refresh browser (Ctrl + Shift + R hoặc Cmd + Shift + R)
- Clear cache của browser
- Background sẽ có gradient chuyển động mượt mà với màu stone palette
