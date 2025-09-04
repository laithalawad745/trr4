// استبدال الصفحة app/dashboard/trades/new/page.tsx بالكامل

'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, StopCircle, AlertCircle, CheckCircle, Settings, BarChart3 } from 'lucide-react';
import AdvancedTradingViewWidget from '@/components/charts/AdvancedTradingViewWidget';

export default function NewTradePage() {
  const [currentPrice, setCurrentPrice] = useState(2052.45);
  const [priceChange, setPriceChange] = useState(2.35);
  const [priceChangePercent, setPriceChangePercent] = useState(0.11);
  
  // حالة النموذج
  const [formData, setFormData] = useState({
    entryPrice: 2052.45,
    targetPrice: 2062.45,
    stopLoss: 2042.45,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // محاكاة تحديث السعر كل 5 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 2;
      const newPrice = parseFloat((currentPrice + change).toFixed(2));
      const changeAmount = newPrice - currentPrice;
      
      setCurrentPrice(newPrice);
      setPriceChange(parseFloat(changeAmount.toFixed(2)));
      setPriceChangePercent(parseFloat(((changeAmount / currentPrice) * 100).toFixed(2)));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentPrice]);

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.targetPrice <= formData.entryPrice) {
      newErrors.targetPrice = 'يجب أن يكون الهدف أعلى من سعر الدخول';
    }
    
    if (formData.stopLoss >= formData.entryPrice) {
      newErrors.stopLoss = 'يجب أن يكون وقف الخسارة أقل من سعر الدخول';
    }
    
    const riskRewardRatio = (formData.targetPrice - formData.entryPrice) / (formData.entryPrice - formData.stopLoss);
    if (riskRewardRatio < 1.5) {
      newErrors.riskReward = 'نسبة المخاطرة للعائد يجب أن تكون 1.5 على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // هنا يمكنك إضافة استدعاء API الحقيقي
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create trade');
      }
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          entryPrice: currentPrice,
          targetPrice: currentPrice + 10,
          stopLoss: currentPrice - 10,
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error creating trade:', error);
      setErrors({ submit: 'حدث خطأ في إضافة الصفقة. حاول مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // حساب نسبة المخاطرة والعائد
  const calculateRiskReward = () => {
    const risk = formData.entryPrice - formData.stopLoss;
    const reward = formData.targetPrice - formData.entryPrice;
    const ratio = reward / risk;
    return {
      risk: risk.toFixed(2),
      reward: reward.toFixed(2),
      ratio: ratio.toFixed(2),
      riskPercent: ((risk / formData.entryPrice) * 100).toFixed(2),
      rewardPercent: ((reward / formData.entryPrice) * 100).toFixed(2),
    };
  };
  
  const riskReward = calculateRiskReward();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-full mx-auto h-screen flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg">
                  <BarChart3 size={24} className="text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-yellow-400">صفقة جديدة - الذهب</h1>
                  <p className="text-gray-400 text-sm">تحليل فني متقدم مع جميع أدوات فيبوناتشي</p>
                </div>
              </div>
            </div>
            
            {/* معلومات السعر */}
            <div className="text-right">
              <p className="text-3xl font-bold">${currentPrice.toFixed(2)}</p>
              <div className={`flex items-center gap-2 text-lg ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* الرسم البياني المتقدم */}
          <div className="flex-1 relative p-4">
            <AdvancedTradingViewWidget 
              symbol="OANDA:XAUUSD"
              interval="5"
              theme="dark" 
              height="100%"
              locale="ar"
              timezone="Asia/Riyadh"
              studies={[
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies", 
                "MASimple@tv-basicstudies",
                "BollingerBands@tv-basicstudies"
              ]}
              style="1" // شموع يابانية افتراضياً
            />
          </div>

          {/* نموذج الصفقة */}
          <div className="w-80 bg-black/40 backdrop-blur-sm border-l border-gray-700 overflow-y-auto">
            <div className="p-6">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">تم إضافة الصفقة!</h3>
                  <p className="text-gray-400">سيتم متابعة صفقتك تلقائياً</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Settings size={20} className="text-yellow-400" />
                    <h2 className="text-xl font-bold text-yellow-400">بيانات الصفقة</h2>
                  </div>
                  
                  {/* سعر الدخول */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      سعر الدخول
                    </label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-3 text-gray-500" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.entryPrice}
                        onChange={(e) => setFormData({...formData, entryPrice: parseFloat(e.target.value)})}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => setFormData({...formData, entryPrice: currentPrice})}
                      className="text-xs text-yellow-400 hover:text-yellow-300 mt-1 transition-colors"
                    >
                      استخدم السعر الحالي
                    </button>
                  </div>
                  
                  {/* الهدف */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      الهدف (Take Profit)
                    </label>
                    <div className="relative">
                      <Target size={16} className="absolute left-3 top-3 text-green-500" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.targetPrice}
                        onChange={(e) => setFormData({...formData, targetPrice: parseFloat(e.target.value)})}
                        className={`w-full bg-gray-800 border rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none transition-colors ${
                          errors.targetPrice ? 'border-red-500' : 'border-gray-600 focus:border-green-500'
                        }`}
                      />
                    </div>
                    {errors.targetPrice && (
                      <p className="text-red-400 text-xs mt-1">{errors.targetPrice}</p>
                    )}
                  </div>
                  
                  {/* وقف الخسارة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      وقف الخسارة (Stop Loss)
                    </label>
                    <div className="relative">
                      <StopCircle size={16} className="absolute left-3 top-3 text-red-500" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.stopLoss}
                        onChange={(e) => setFormData({...formData, stopLoss: parseFloat(e.target.value)})}
                        className={`w-full bg-gray-800 border rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none transition-colors ${
                          errors.stopLoss ? 'border-red-500' : 'border-gray-600 focus:border-red-500'
                        }`}
                      />
                    </div>
                    {errors.stopLoss && (
                      <p className="text-red-400 text-xs mt-1">{errors.stopLoss}</p>
                    )}
                  </div>
                  
                  {/* تحليل المخاطرة والعائد */}
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 border border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Activity size={14} />
                      تحليل الصفقة
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">المخاطرة:</span>
                        <span className="text-red-400 font-mono">${riskReward.risk} ({riskReward.riskPercent}%)</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">العائد المحتمل:</span>
                        <span className="text-green-400 font-mono">${riskReward.reward} ({riskReward.rewardPercent}%)</span>
                      </div>
                      
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-600">
                        <span className="text-gray-300">نسبة R:R</span>
                        <span className={`font-mono ${parseFloat(riskReward.ratio) >= 1.5 ? 'text-green-400' : 'text-red-400'}`}>
                          1:{riskReward.ratio}
                        </span>
                      </div>
                    </div>
                    
                    {errors.riskReward && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.riskReward}
                      </p>
                    )}
                  </div>
                  
                  {/* زر الإرسال */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Activity size={16} className="animate-spin" />
                        جاري الإضافة...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        إضافة الصفقة
                      </>
                    )}
                  </button>
                  
                  {/* خطأ عام */}
                  {errors.submit && (
                    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                      <p className="text-xs text-red-300">{errors.submit}</p>
                    </div>
                  )}
                  
                  {/* دليل الأدوات */}
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                    <p className="text-xs text-blue-300 flex items-start gap-2">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>أدوات متاحة:</strong> فيبوناتشي Retracement/Extension، خطوط الاتجاه، النماذج الهارمونيك، موجات إليوت، مؤشرات RSI/MACD
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* إحصائيات مفصلة */}
            <div className="p-6 border-t border-gray-700 space-y-3">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">إحصائيات السوق</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">أعلى 24س</p>
                  <p className="text-sm font-bold text-green-400">$2,058.32</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">أدنى 24س</p>
                  <p className="text-sm font-bold text-red-400">$2,045.18</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">الحجم</p>
                  <p className="text-sm font-bold text-blue-400">1.2M</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">التقلب</p>
                  <p className="text-sm font-bold text-purple-400">2.14%</p>
                </div>
              </div>

              {/* قائمة الأدوات */}
              <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
                <h4 className="text-xs font-semibold text-yellow-400 mb-2">🛠 أدوات الرسم المتاحة:</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• فيبوناتشي: Retracement, Extension, Fan, Arc</div>
                  <div>• النماذج: Head & Shoulders, Triangles, ABCD</div>
                  <div>• الموجات: Elliott Wave, Wolf Wave</div>
                  <div>• الخطوط: Trend Lines, Channels, Support/Resistance</div>
                  <div>• المؤشرات: RSI, MACD, Bollinger Bands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}