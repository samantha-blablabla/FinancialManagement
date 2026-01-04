import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function PUT(request: NextRequest) {
  try {
    const { id, name, currency } = await request.json();

    // Validate required fields
    if (!id || !name || !currency) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length === 0 || name.length > 100) {
      return NextResponse.json(
        { error: 'Tên không gian phải từ 1-100 ký tự' },
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

    const { data: space, error } = await supabase
      .from('spaces')
      .update({
        name: name.trim(),
        currency,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Space update error:', error);
      return NextResponse.json(
        { error: 'Không thể cập nhật không gian' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      space,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi không mong muốn' },
      { status: 500 }
    );
  }
}
