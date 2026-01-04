import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { spaceId, newPassword } = await request.json();

    if (!spaceId || !newPassword) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

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

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error } = await supabase
      .from('spaces')
      .update({ password_hash: passwordHash })
      .eq('id', spaceId);

    if (error) {
      console.error('Password reset error:', error);
      return NextResponse.json(
        { error: 'Không thể đặt lại mật khẩu' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã đặt lại mật khẩu thành công',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi không mong muốn' },
      { status: 500 }
    );
  }
}
