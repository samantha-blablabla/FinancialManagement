import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
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

    // Fetch all spaces with basic info (no password hash)
    const { data: spaces, error } = await supabase
      .from('spaces')
      .select('id, name, currency, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Spaces list error:', error);
      return NextResponse.json(
        { error: 'Không thể lấy danh sách không gian' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      spaces: spaces || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi không mong muốn' },
      { status: 500 }
    );
  }
}
