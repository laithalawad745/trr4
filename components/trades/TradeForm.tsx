// components/trades/TradeForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';

const tradeSchema = z.object({
  entryPrice: z.number().positive(),
  targetPrice: z.number().positive(),
  stopLoss: z.number().positive(),
}).refine((data) => {
  // التأكد من أن الهدف أعلى من سعر الدخول
  // وأن وقف الخسارة أقل من سعر الدخول
  return data.targetPrice > data.entryPrice && data.stopLoss < data.entryPrice;
}, {
  message: "يجب أن يكون الهدف أعلى من سعر الدخول ووقف الخسارة أقل منه",
});

type TradeFormData = z.infer<typeof tradeSchema>;

export function TradeForm() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
  });
  
  // جلب السعر الحالي للذهب
  const { data: priceData } = useQuery({
    queryKey: ['goldPrice'],
    queryFn: async () => {
      const res = await fetch('/api/prices/gold');
      return res.json();
    },
    refetchInterval: 5000, // تحديث كل 5 ثواني
  });
  
  useEffect(() => {
    if (priceData?.mid) {
      setCurrentPrice(priceData.mid);
      setValue('entryPrice', priceData.mid);
    }
  }, [priceData, setValue]);
  
  const createTrade = useMutation({
    mutationFn: async (data: TradeFormData) => {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create trade');
      return res.json();
    },
    onSuccess: () => {
      alert('تم إضافة الصفقة بنجاح!');
    },
  });
  
  const onSubmit = (data: TradeFormData) => {
    createTrade.mutate(data);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">صفقة جديدة - الذهب</h2>
      
      {currentPrice && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">السعر الحالي</p>
          <p className="text-2xl font-bold text-yellow-600">${currentPrice.toFixed(2)}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سعر الدخول
          </label>
          <input
            type="number"
            step="0.01"
            {...register('entryPrice', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {errors.entryPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.entryPrice.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الهدف (Take Profit)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('targetPrice', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={currentPrice ? `مثال: ${(currentPrice * 1.01).toFixed(2)}` : ''}
          />
          {errors.targetPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.targetPrice.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وقف الخسارة (Stop Loss)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('stopLoss', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={currentPrice ? `مثال: ${(currentPrice * 0.99).toFixed(2)}` : ''}
          />
          {errors.stopLoss && (
            <p className="text-red-500 text-sm mt-1">{errors.stopLoss.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={createTrade.isPending}
          className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {createTrade.isPending ? 'جاري الإضافة...' : 'إضافة الصفقة'}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-500">
          ⚠️ تنبيه: لا يمكن تعديل الصفقة بعد إضافتها. تأكد من البيانات قبل الإرسال.
        </p>
      </div>
    </div>
  );
}