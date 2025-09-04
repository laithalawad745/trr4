// app/page.tsx
import GoldPriceChart from '@/components/charts/AdvancedTradingViewWidget';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">مجتمع تداول الذهب</h1>
      
      {/* الرسم البياني */}
      <GoldPriceChart />
      
      {/* باقي المحتوى */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* أفضل المحللين */}
        {/* آخر الصفقات */}
      </div>
    </div>
  );
}