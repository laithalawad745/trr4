// app/api/prices/gold/route.ts

import { NextResponse } from 'next/server';
import { getGoldPrice } from '@/lib/oanda';

export async function GET() {
  try {
    const price = await getGoldPrice();
    
    // حفظ السعر في الكاش لتقليل استهلاك API
    return NextResponse.json({
      ...price,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gold price' },
      { status: 500 }
    );
  }
}
