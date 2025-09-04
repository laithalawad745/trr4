// components/charts/AdvancedTradingViewWidget.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Settings, Maximize2 } from 'lucide-react';

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
  width?: string | number;
  height?: string | number;
  locale?: string;
  timezone?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  studies?: string[];
  style?: string;
}

export default function AdvancedTradingViewWidget({
  symbol = "OANDA:XAUUSD",
  interval = "5",
  theme = "dark",
  autosize = true,
  width = "100%", 
  height = "600",
  locale = "ar",
  timezone = "Asia/Riyadh",
  toolbar_bg = "rgba(0, 0, 0, 0.8)",
  enable_publishing = false,
  hide_top_toolbar = false,
  hide_legend = false,
  save_image = true,
  studies = [
    "RSI@tv-basicstudies",
    "MACD@tv-basicstudies", 
    "MASimple@tv-basicstudies",
    "BollingerBands@tv-basicstudies"
  ],
  style = "1" // 1=شموع، 2=هايكين آشي، 3=خط، 8=منطقة، 9=خط قاعدي
}: TradingViewWidgetProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStyle, setCurrentStyle] = useState(style);

  useEffect(() => {
    if (!containerRef.current) return;

    // تنظيف المحتوى السابق
    containerRef.current.innerHTML = '';
    setIsLoading(true);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    const widgetConfig = {
      // إعدادات أساسية
      "autosize": autosize,
      "width": width,
      "height": height,
      "symbol": symbol,
      "interval": interval,
      "timezone": timezone,
      "theme": theme,
      "style": currentStyle,
      "locale": locale,
      "enable_publishing": enable_publishing,
      "withdateranges": true,
      "range": "YTD",
      "hide_side_toolbar": false,
      "hide_top_toolbar": hide_top_toolbar,
      "hide_legend": hide_legend,
      "save_image": save_image,
      "calendar": false,
      "support_host": "https://www.tradingview.com",

      // تخصيص الألوان والمظهر  
      "backgroundColor": "rgba(0, 0, 0, 0.1)",
      "gridColor": "rgba(255, 255, 255, 0.06)",
      "toolbar_bg": toolbar_bg,

      // المؤشرات الفنية المحملة تلقائياً
      "studies": studies,

      // إعدادات متقدمة
      "show_popup_button": true,
      "popup_width": "1200",
      "popup_height": "720",
      "container_id": "tradingview_container",

      // تفعيل جميع أدوات الرسم والتحليل
      "drawings_access": {
        "type": "black", // السماح لجميع الأدوات
        "tools": [
          // خطوط الاتجاه والدعم والمقاومة
          { "name": "Trend Line", "grayed": false },
          { "name": "Horizontal Line", "grayed": false },
          { "name": "Vertical Line", "grayed": false },
          { "name": "Cross Line", "grayed": false },
          { "name": "Parallel Channel", "grayed": false },
          { "name": "Disjoint Channel", "grayed": false },
          
          // أدوات فيبوناتشي الكاملة
          { "name": "Fib Retracement", "grayed": false },
          { "name": "Fib Extension", "grayed": false },
          { "name": "Fib Fan", "grayed": false },
          { "name": "Fib Arc", "grayed": false },
          { "name": "Fib Time Zone", "grayed": false },
          { "name": "Fib Spiral", "grayed": false },
          { "name": "Fib Speed Resistance Fan", "grayed": false },
          { "name": "Fib Wedge", "grayed": false },
          { "name": "Fib Channel", "grayed": false },

          // الأشكال الهندسية
          { "name": "Rectangle", "grayed": false },
          { "name": "Rotated Rectangle", "grayed": false },
          { "name": "Ellipse", "grayed": false },
          { "name": "Circle", "grayed": false },
          { "name": "Triangle", "grayed": false },
          { "name": "Polyline", "grayed": false },
          { "name": "Path", "grayed": false },

          // أدوات جان (Gann)
          { "name": "Gann Square", "grayed": false },
          { "name": "Gann Fan", "grayed": false },
          { "name": "Gann Box", "grayed": false },

          // أدوات القياس والتحليل
          { "name": "Pitchfork", "grayed": false },
          { "name": "Schiff Pitchfork", "grayed": false },
          { "name": "Modified Schiff Pitchfork", "grayed": false },
          { "name": "Inside Pitchfork", "grayed": false },
          { "name": "Pitchfan", "grayed": false },

          // الموجات والدورات
          { "name": "Elliott Wave", "grayed": false },
          { "name": "Elliott Impulse Wave", "grayed": false },
          { "name": "Elliott Triangle Wave", "grayed": false },
          { "name": "Elliott Triple Combo Wave", "grayed": false },
          { "name": "Elliott Correction Wave", "grayed": false },
          { "name": "Elliott Double Combo Wave", "grayed": false },
          { "name": "Cyclic Lines", "grayed": false },

          // أدوات السعر والحجم
          { "name": "Price Range", "grayed": false },
          { "name": "Date Range", "grayed": false },
          { "name": "Date and Price Range", "grayed": false },
          { "name": "Bars Pattern", "grayed": false },
          { "name": "Ghost Feed", "grayed": false },
          { "name": "Projection", "grayed": false },

          // التسميات والنصوص
          { "name": "Text", "grayed": false },
          { "name": "Anchored Text", "grayed": false },
          { "name": "Note", "grayed": false },
          { "name": "Anchored Note", "grayed": false },
          { "name": "Callout", "grayed": false },
          { "name": "Price Label", "grayed": false },
          { "name": "Arrow", "grayed": false },
          { "name": "Arrow Mark Down", "grayed": false },
          { "name": "Arrow Mark Up", "grayed": false },
          { "name": "Flag Mark", "grayed": false },

          // الأنماط والنماذج
          { "name": "Head and Shoulders", "grayed": false },
          { "name": "Triangle Pattern", "grayed": false },
          { "name": "Flag", "grayed": false },
          { "name": "Pennant", "grayed": false },
          { "name": "Wedge", "grayed": false },
          { "name": "ABCD Pattern", "grayed": false },
          { "name": "xABCD Pattern", "grayed": false },
          { "name": "Cypher Pattern", "grayed": false },
          { "name": "Butterfly Pattern", "grayed": false },
          { "name": "Bat Pattern", "grayed": false },
          { "name": "Gartley Pattern", "grayed": false },
          { "name": "Crab Pattern", "grayed": false },
          { "name": "Shark Pattern", "grayed": false },
          { "name": "5-0 Pattern", "grayed": false },
          { "name": "Wolf Wave", "grayed": false },

          // أدوات متقدمة أخرى
          { "name": "Long Position", "grayed": false },
          { "name": "Short Position", "grayed": false },
          { "name": "Forecast", "grayed": false },
          { "name": "Signpost", "grayed": false },
          { "name": "Balloon", "grayed": false }
        ]
      },

      // تخصيصات متقدمة للألوان والمظهر
      "overrides": {
        // ألوان الشموع
        "candle.hollowUpBody.color": "#00D4AA",
        "candle.hollowDownBody.color": "#FB4570", 
        "candle.solidUpBody.color": "#00D4AA",
        "candle.solidDownBody.color": "#FB4570",
        "candle.hollowUpBody.borderColor": "#00D4AA",
        "candle.hollowDownBody.borderColor": "#FB4570",
        "candle.solidUpBody.borderColor": "#00D4AA", 
        "candle.solidDownBody.borderColor": "#FB4570",
        "candle.hollowUpBody.wickColor": "#00D4AA",
        "candle.hollowDownBody.wickColor": "#FB4570",
        "candle.solidUpBody.wickColor": "#00D4AA",
        "candle.solidDownBody.wickColor": "#FB4570",

        // ألوان الخلفية والشبكة
        "paneProperties.background": "#0D1421",
        "paneProperties.backgroundType": "solid",
        "paneProperties.gridProperties.color": "rgba(255, 255, 255, 0.05)",
        "paneProperties.gridProperties.style": 0,
        "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.05)",
        "paneProperties.vertGridProperties.style": 0,
        "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.05)",
        "paneProperties.horzGridProperties.style": 0,

        // ألوان النص والمؤشرات
        "scalesProperties.textColor": "#B2B5BE",
        "scalesProperties.backgroundColor": "#0D1421",
        
        // ألوان الحجم
        "volume.volume.color.0": "#FB4570",
        "volume.volume.color.1": "#00D4AA",
        "volume.volume.transparency": 65,

        // ألوان الخطوط
        "mainSeriesProperties.style": 1,
        "mainSeriesProperties.showCountdown": false,
        "mainSeriesProperties.visible": true,

        // تخصيص شريط الأدوات
        "timeScale.rightOffset": 5,
        "timeScale.barSpacing": 6,
        "timeScale.fixLeftEdge": false,
        "timeScale.lockVisibleTimeRangeOnResize": true,
        "timeScale.rightBarStaysOnScroll": true,
        "timeScale.borderVisible": false,
        "timeScale.borderColor": "#2962FF",
        "timeScale.visible": true,
        
        // إعدادات الرسم البياني
        "chartProperties.background.type": "solid", 
        "chartProperties.background.color": "#0D1421",
        "chartProperties.lineStyle.color": "#2962FF",
        "chartProperties.lineStyle.linestyle": 0,
        "chartProperties.lineStyle.linewidth": 2,

        // تخصيص الصفقات
        "tradingProperties.showPositions": true,
        "tradingProperties.showOrders": true,
        "tradingProperties.showExecutions": true,

        // المؤشرات
        "symbolWatermarkProperties.transparency": 95,
        "volumePaneSize": "medium"
      },

      // خيارات متقدمة للميزات
      "details": true,
      "hotlist": false,
      "calendar": false,
      "news": ["headlines"],
      "show_popup_button": true,
      "popup_width": "1200", 
      "popup_height": "720",
      "no_referral_id": true,
      "ask_fundamental_question": false,
      "fundamental_question_only": false
    };

    script.innerHTML = JSON.stringify(widgetConfig);

    script.onload = () => {
      setIsLoading(false);
    };

    containerRef.current.appendChild(script);

    // تنظيف عند إلغاء التثبيت
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval, theme, currentStyle, studies.join(',')]);

  // تبديل نوع الرسم البياني
  const changeChartStyle = (newStyle: string) => {
    setCurrentStyle(newStyle);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700">
      {/* شريط التحكم العلوي */}
      <div className="relative top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm border-b border-gray-700/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-white">XAUUSD - الذهب مقابل الدولار</span>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">مباشر</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* أزرار تبديل نوع الرسم */}
            <div className="flex items-center bg-gray-800/50 rounded-lg p-1 gap-1">
              <button
                onClick={() => changeChartStyle('1')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  currentStyle === '1' 
                    ? 'bg-yellow-500 text-black font-semibold' 
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
                title="الشموع اليابانية"
              >
                شموع
              </button>
              <button
                onClick={() => changeChartStyle('2')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  currentStyle === '2' 
                    ? 'bg-yellow-500 text-black font-semibold' 
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
                title="شموع هايكين آشي"
              >
                هايكين آشي
              </button>
              <button
                onClick={() => changeChartStyle('3')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  currentStyle === '3' 
                    ? 'bg-yellow-500 text-black font-semibold' 
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
                title="الرسم الخطي"
              >
                خط
              </button>
              <button
                onClick={() => changeChartStyle('8')}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  currentStyle === '8' 
                    ? 'bg-yellow-500 text-black font-semibold' 
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
                title="رسم المنطقة"
              >
                منطقة
              </button>
            </div>

            <button className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all">
              <Maximize2 className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* مؤشر التحميل */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-20">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-yellow-400 animate-pulse" />
            <p className="text-gray-300 font-medium">جاري تحميل الرسم البياني المتقدم...</p>
            <p className="text-gray-500 text-sm mt-1">يتم تحميل جميع أدوات التحليل الفني</p>
          </div>
        </div>
      )}

      {/* شريط الميزات السفلي */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm border-t border-gray-700/50 p-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <span className="text-gray-300">فيبوناتشي Retracement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded"></div>
              <span className="text-gray-300">خطوط الاتجاه</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded"></div>
              <span className="text-gray-300">نماذج هارمونيك</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded"></div>
              <span className="text-gray-300">مؤشرات RSI & MACD</span>
            </div>
          </div>
          
          <div className="text-gray-400">
            TradingView - أدوات احترافية مجانية
          </div>
        </div>
      </div>

      {/* حاوي الرسم البياني */}
      <div 
        ref={containerRef}
        className="tradingview-widget-container w-full h-full"
        style={{ minHeight: height }}
      >
        <div className="tradingview-widget-container__widget w-full h-full"></div>
      </div>
    </div>
  );
}