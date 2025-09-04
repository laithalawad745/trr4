// lib/tradeMonitor.ts

import { PrismaClient } from '@prisma/client';
import { getGoldPrice } from './oanda';

const prisma = new PrismaClient();

// مراقب الصفقات - يعمل كل دقيقة
export async function monitorTrades() {
  try {
    // جلب السعر الحالي
    const currentPrice = await getGoldPrice();
    
    // جلب الصفقات النشطة
    const activeTrades = await prisma.trade.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        user: true,
      },
    });
    
    for (const trade of activeTrades) {
      let shouldClose = false;
      let result: 'WIN' | 'LOSS' | null = null;
      
      // التحقق من الوصول للهدف
      if (currentPrice.mid >= trade.targetPrice) {
        shouldClose = true;
        result = 'WIN';
      }
      // التحقق من الوصول لوقف الخسارة
      else if (currentPrice.mid <= trade.stopLoss) {
        shouldClose = true;
        result = 'LOSS';
      }
      
      if (shouldClose && result) {
        // تحديث الصفقة
        await prisma.trade.update({
          where: { id: trade.id },
          data: {
            status: 'COMPLETED',
            result: result,
            exitPrice: currentPrice.mid,
            exitDate: new Date(),
            profit: ((currentPrice.mid - trade.entryPrice) / trade.entryPrice) * 100,
          },
        });
        
        // تحديث نقاط المستخدم
        const pointChange = result === 'WIN' ? 1 : -1;
        await prisma.user.update({
          where: { id: trade.userId },
          data: {
            points: {
              increment: pointChange,
            },
          },
        });
        
        console.log(`Trade ${trade.id} closed with ${result} for user ${trade.user.username}`);
      }
    }
  } catch (error) {
    console.error('Error monitoring trades:', error);
  }
}

// تشغيل المراقب كل دقيقة
export function startTradeMonitor() {
  setInterval(monitorTrades, 60 * 1000); // كل 60 ثانية
  console.log('Trade monitor started');
}