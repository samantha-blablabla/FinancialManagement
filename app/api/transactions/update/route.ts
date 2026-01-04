import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function PUT(request: NextRequest) {
  try {
    const { id, type, amount, currency, description, date, categoryId, notes } = await request.json();

    // Validate required fields
    if (!id || !type || !amount || !description || !date || !categoryId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền phải lớn hơn 0' },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Loại giao dịch không hợp lệ' },
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

    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({
        type,
        amount,
        currency,
        description,
        date,
        category_id: categoryId,
        notes: notes || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Transaction update error:', error);
      return NextResponse.json(
        { error: 'Không thể cập nhật giao dịch' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi không mong muốn' },
      { status: 500 }
    );
  }
}
