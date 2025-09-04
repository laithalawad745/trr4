// lib/cron/monitorTrades.ts

import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
import { getGoldPrice } from '../oanda';

const prisma = new PrismaClient();

async function checkAndUpdateTrades() {
  console.log('🔍 Checking trades at', new Date().toISOString());
  
  try {
    // جلب السعر الحالي
    const currentPrice = await getGoldPrice();
    const price = currentPrice.mid;
    
    // جلب جميع الصفقات النشطة
    const activeTrades = await prisma.trade.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
    
    console.log(`Found ${activeTrades.length} active trades`);
    
    for (const trade of activeTrades) {
      let shouldClose = false;
      let result: 'WIN' | 'LOSS' | null = null;
      let exitPrice = price;
      
      // تحقق من الوصول للهدف (صفقة شراء)
      if (price >= trade.targetPrice) {
        shouldClose = true;
        result = 'WIN';
        exitPrice = trade.targetPrice;
        console.log(`✅ Trade ${trade.id} hit target!`);
      }
      // تحقق من الوصول لوقف الخسارة
      else if (price <= trade.stopLoss) {
        shouldClose = true;
        result = 'LOSS';
        exitPrice = trade.stopLoss;
        console.log(`❌ Trade ${trade.id} hit stop loss!`);
      }
      
      if (shouldClose && result) {
        // حساب نسبة الربح/الخسارة
        const profitPercentage = ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100;
        
        // تحديث الصفقة
        await prisma.trade.update({
          where: { id: trade.id },
          data: {
            status: 'COMPLETED',
            result: result,
            exitPrice: exitPrice,
            exitDate: new Date(),
            profit: profitPercentage,
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
        
        // يمكن إضافة إشعار هنا
        console.log(`Trade ${trade.id} closed: ${result} (${profitPercentage.toFixed(2)}%)`);
      }
    }
  } catch (error) {
    console.error('Error monitoring trades:', error);
  }
}

// تشغيل المراقب كل 30 ثانية
export const tradeMonitorJob = new CronJob(
  '*/30 * * * * *', // كل 30 ثانية
  checkAndUpdateTrades,
  null,
  true, // Start the job right now
  'UTC'
);