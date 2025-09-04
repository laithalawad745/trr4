// lib/oanda.ts

import axios from 'axios';

const OANDA_API_URL = 'https://api-fxpractice.oanda.com/v3';
const OANDA_ACCOUNT_ID = process.env.OANDA_ACCOUNT_ID!;
const OANDA_API_KEY = process.env.OANDA_API_KEY!;

export const oandaClient = axios.create({
  baseURL: OANDA_API_URL,
  headers: {
    'Authorization': `Bearer ${OANDA_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// جلب سعر الذهب الحالي
export async function getGoldPrice() {
  try {
    const response = await oandaClient.get(
      `/accounts/${OANDA_ACCOUNT_ID}/pricing`,
      {
        params: {
          instruments: 'XAU_USD',
        },
      }
    );
    
    const price = response.data.prices[0];
    return {
      bid: parseFloat(price.closeoutBid),
      ask: parseFloat(price.closeoutAsk),
      mid: (parseFloat(price.closeoutBid) + parseFloat(price.closeoutAsk)) / 2,
      time: price.time,
    };
  } catch (error) {
    console.error('Error fetching gold price:', error);
    throw error;
  }
}

// جلب بيانات تاريخية للذهب
export async function getGoldCandles(granularity = 'M5', count = 100) {
  try {
    const response = await oandaClient.get(
      `/instruments/XAU_USD/candles`,
      {
        params: {
          granularity, // M1, M5, M15, H1, D
          count,
        },
      }
    );
    
    return response.data.candles.map((candle: any) => ({
      time: candle.time,
      open: parseFloat(candle.mid.o),
      high: parseFloat(candle.mid.h),
      low: parseFloat(candle.mid.l),
      close: parseFloat(candle.mid.c),
      volume: candle.volume,
    }));
  } catch (error) {
    console.error('Error fetching gold candles:', error);
    throw error;
  }
}