import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { spaceName, password } = await request.json();

    // Validate input
    if (!spaceName || !password) {
      return NextResponse.json(
        { error: 'Tên space và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    if (spaceName.length < 3) {
      return NextResponse.json(
        { error: 'Tên space phải có ít nhất 3 ký tự' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Use service role key to bypass RLS for space creation
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate a temporary user ID (we'll use a UUID v4)
    const tempUserId = crypto.randomUUID();

    // Create space
    const { data: space, error: spaceError } = await supabase
      .from('spaces')
      .insert({
        name: spaceName,
        password_hash: passwordHash,
        owner_id: tempUserId,
        currency: 'VND',
      })
      .select()
      .single();

    if (spaceError) {
      console.error('Space creation error:', spaceError);
      return NextResponse.json(
        { error: 'Không thể tạo space. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Create space member entry
    const { error: memberError } = await supabase
      .from('space_members')
      .insert({
        space_id: space.id,
        user_id: tempUserId,
        role: 'owner',
      });

    if (memberError) {
      console.error('Space member creation error:', memberError);
      // Rollback space creation
      await supabase.from('spaces').delete().eq('id', space.id);
      return NextResponse.json(
        { error: 'Không thể tạo space. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Create default transaction categories
    const defaultCategories = [
      // Income categories
      { name: 'Lương', type: 'income', icon: 'Briefcase', color: '#10b981', is_system: true },
      { name: 'Thưởng', type: 'income', icon: 'Gift', color: '#3b82f6', is_system: true },
      { name: 'Thu nhập khác', type: 'income', icon: 'Coins', color: '#06b6d4', is_system: true },

      // Expense categories
      { name: 'Ăn uống', type: 'expense', icon: 'Utensils', color: '#ef4444', is_system: true },
      { name: 'Di chuyển', type: 'expense', icon: 'Car', color: '#f59e0b', is_system: true },
      { name: 'Mua sắm', type: 'expense', icon: 'ShoppingCart', color: '#ec4899', is_system: true },
      { name: 'Nhà cửa', type: 'expense', icon: 'Home', color: '#6366f1', is_system: true },
      { name: 'Giải trí', type: 'expense', icon: 'Gamepad2', color: '#a855f7', is_system: true },
      { name: 'Sức khỏe', type: 'expense', icon: 'HeartPulse', color: '#14b8a6', is_system: true },
      { name: 'Giáo dục', type: 'expense', icon: 'GraduationCap', color: '#0ea5e9', is_system: true },
      { name: 'Chi phí khác', type: 'expense', icon: 'Wallet', color: '#64748b', is_system: true },
    ];

    const categoriesToInsert = defaultCategories.map(cat => ({
      space_id: space.id,
      ...cat,
    }));

    const { error: categoriesError } = await supabase
      .from('transaction_categories')
      .insert(categoriesToInsert);

    if (categoriesError) {
      console.error('Categories creation error:', categoriesError);
      // Don't rollback - categories are optional, space is still usable
    }

    return NextResponse.json({
      success: true,
      space: {
        id: space.id,
        name: space.name,
        currency: space.currency,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi không mong muốn' },
      { status: 500 }
    );
  }
}
