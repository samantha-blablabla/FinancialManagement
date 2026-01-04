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
