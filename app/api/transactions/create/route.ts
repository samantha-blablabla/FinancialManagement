import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { spaceId, type, amount, currency = 'VND', description, date, categoryId, notes, planId } = await request.json();

    // Validate required fields
    if (!spaceId || !type || !amount || !description || !date || !categoryId) {
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
      .insert({
        space_id: spaceId,
        type,
        amount,
        currency, // Add currency field
        description,
        date,
        category_id: categoryId,
        plan_id: planId || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Transaction creation error:', error);
      return NextResponse.json(
        { error: 'Không thể tạo giao dịch' },
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
