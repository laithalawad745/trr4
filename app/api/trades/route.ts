// ====================================
// app/api/trades/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { entryPrice, targetPrice, stopLoss } = body;
    
    // التحقق من صحة البيانات
    if (targetPrice <= entryPrice) {
      return NextResponse.json(
        { error: 'Target price must be higher than entry price' },
        { status: 400 }
      );
    }
    
    if (stopLoss >= entryPrice) {
      return NextResponse.json(
        { error: 'Stop loss must be lower than entry price' },
        { status: 400 }
      );
    }
    
    // إنشاء الصفقة
    const trade = await prisma.trade.create({
      data: {
        userId: session.user.id,
        entryPrice,
        targetPrice,
        stopLoss,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });
    
    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    
    const trades = await prisma.trade.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
    
    return NextResponse.json(trades);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    );
  }
}
