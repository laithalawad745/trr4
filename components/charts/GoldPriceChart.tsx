//components / charts/goldpricechart
'use client'
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, StopCircle, AlertCircle, CheckCircle } from 'lucide-react';

// محاكاة البيانات
function generateMockData() {
  const data = [];
  const now = new Date();
  const basePrice = 2050;
  
  for (let i = 100; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60000);
    const randomChange = (Math.random() - 0.5) * 10;
    const price = basePrice + randomChange + Math.sin(i / 10) * 5;
    
    data.push({
      time: time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
}

export default function NewTradePage() {
  // حالة الرسم البياني
  const [chartData, setChartData] = useState(generateMockData());
  const [currentPrice, setCurrentPrice] = useState(2052.45);
  const [priceChange, setPriceChange] = useState(2.35);
  const [priceChangePercent, setPriceChangePercent] = useState(0.11);
  const [chartType, setChartType] = useState('line');
  
  // حالة النموذج
  const [formData, setFormData] = useState({
    entryPrice: 2052.45,
    targetPrice: 2062.45,
    stopLoss: 2042.45,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // تحديث السعر كل 5 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        const lastPrice = newData[newData.length - 1].price;
        const change = (Math.random() - 0.5) * 2;
        const newPrice = parseFloat((lastPrice + change).toFixed(2));
        
        newData.push({
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          price: newPrice,
        });
        
        if (newData.length > 100) {
          newData.shift();
        }
        
        setCurrentPrice(newPrice);
        const firstPrice = newData[0].price;
        const changeAmount = newPrice - firstPrice;
        setPriceChange(parseFloat(changeAmount.toFixed(2)));
        setPriceChangePercent(parseFloat(((changeAmount / firstPrice) * 100).toFixed(2)));
        
        return newData;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};
    
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // إعادة تعيين بعد 3 ثواني
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          entryPrice: currentPrice,
          targetPrice: currentPrice + 10,
          stopLoss: currentPrice - 10,
        });
      }, 3000);
    }, 1500);
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
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-bold text-yellow-400">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">📊 صفقة جديدة - الذهب</h1>
          <p className="text-gray-400">أضف صفقتك وراقب الرسم البياني المباشر</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* الرسم البياني - عمودين */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
              {/* Header الرسم */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg">
                      <DollarSign size={20} className="text-black" />
                    </div>
                    <div>
                      <p className="font-semibold">XAU/USD</p>
                      <p className="text-xs text-gray-400">تحديث مباشر كل 5 ثواني</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold">${currentPrice.toFixed(2)}</p>
                    <div className={`flex items-center gap-1 text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {priceChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent}%)</span>
                    </div>
                  </div>
                </div>
                
                {/* أزرار نوع الرسم */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 rounded text-sm ${chartType === 'line' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}
                  >
                    خطي
                  </button>
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-3 py-1 rounded text-sm ${chartType === 'area' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}
                  >
                    منطقة
                  </button>
                </div>
              </div>
              
              {/* الرسم */}
              <div className="p-4">
                <ResponsiveContainer width="100%" height={350}>
                  {chartType === 'area' ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FCD34D" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip content={<CustomTooltip />} />
                      
                      {/* خطوط المرجع للصفقة */}
                      <ReferenceLine y={formData.targetPrice} stroke="#10B981" strokeDasharray="5 5" />
                      <ReferenceLine y={formData.stopLoss} stroke="#EF4444" strokeDasharray="5 5" />
                      <ReferenceLine y={formData.entryPrice} stroke="#3B82F6" strokeDasharray="3 3" />
                      
                      <Area type="monotone" dataKey="price" stroke="#FCD34D" strokeWidth={2} fill="url(#colorPrice)" />
                    </AreaChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip content={<CustomTooltip />} />
                      
                      {/* خطوط المرجع للصفقة */}
                      <ReferenceLine y={formData.targetPrice} stroke="#10B981" strokeDasharray="5 5" />
                      <ReferenceLine y={formData.stopLoss} stroke="#EF4444" strokeDasharray="5 5" />
                      <ReferenceLine y={formData.entryPrice} stroke="#3B82F6" strokeDasharray="3 3" />
                      
                      <Line type="monotone" dataKey="price" stroke="#FCD34D" strokeWidth={2} dot={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
                
                {/* مفتاح الألوان */}
                <div className="flex flex-wrap gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-400">سعر الدخول</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-400">الهدف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-400">وقف الخسارة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* نموذج إضافة الصفقة - عمود واحد */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">تم إضافة الصفقة بنجاح!</h3>
                  <p className="text-gray-400">سيتم متابعة صفقتك تلقائياً</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4 text-yellow-400">بيانات الصفقة</h2>
                  
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
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, entryPrice: currentPrice})}
                      className="text-xs text-yellow-400 hover:text-yellow-300 mt-1"
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
                        className={`w-full bg-gray-800 border rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none ${
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
                        className={`w-full bg-gray-800 border rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none ${
                          errors.stopLoss ? 'border-red-500' : 'border-gray-600 focus:border-red-500'
                        }`}
                      />
                    </div>
                    {errors.stopLoss && (
                      <p className="text-red-400 text-xs mt-1">{errors.stopLoss}</p>
                    )}
                  </div>
                  
                  {/* تحليل المخاطرة والعائد */}
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">تحليل الصفقة</h3>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">المخاطرة:</span>
                      <span className="text-red-400">${riskReward.risk} ({riskReward.riskPercent}%)</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">العائد المحتمل:</span>
                      <span className="text-green-400">${riskReward.reward} ({riskReward.rewardPercent}%)</span>
                    </div>
                    
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-700">
                      <span className="text-gray-300">نسبة R:R</span>
                      <span className={parseFloat(riskReward.ratio) >= 1.5 ? 'text-green-400' : 'text-red-400'}>
                        1:{riskReward.ratio}
                      </span>
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
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      isSubmitting 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700'
                    }`}
                  >
                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة الصفقة'}
                  </button>
                  
                  {/* تنبيه */}
                  <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                    <p className="text-xs text-yellow-300 flex items-start gap-2">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>لا يمكن تعديل الصفقة بعد إضافتها. تأكد من البيانات قبل الإرسال.</span>
                    </p>
                  </div>
                </form>
              )}
            </div>
            
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400">أعلى اليوم</p>
                <p className="text-lg font-bold text-green-400">$2,058.32</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400">أدنى اليوم</p>
                <p className="text-lg font-bold text-red-400">$2,045.18</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}