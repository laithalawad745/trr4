// app/(dashboard)/leaderboard/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

export default function LeaderboardPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await fetch('/api/users?sort=points&order=desc');
      return res.json();
    },
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2 flex items-center">
          <Trophy className="mr-3" size={40} />
          قائمة المتصدرين
        </h1>
        <p className="text-yellow-100">أفضل محللي الذهب في المجتمع</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الترتيب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المحلل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النقاط
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الصفقات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نسبة النجاح
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user: any, index: number) => (
              <tr key={user.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && <span className="text-gray-600 font-medium">{index + 1}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                        {user.name?.[0] || user.username[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || user.username}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.points > 0 ? (
                      <TrendingUp className="text-green-500 ml-1" size={16} />
                    ) : user.points < 0 ? (
                      <TrendingDown className="text-red-500 ml-1" size={16} />
                    ) : null}
                    <span className={`text-lg font-semibold ${
                      user.points > 0 ? 'text-green-600' : 
                      user.points < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {user.points}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user._count?.trades || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {user.winRate ? `${user.winRate.toFixed(1)}%` : '-'}
                    </span>
                    {user.winRate >= 60 && (
                      <span className="mr-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        محترف
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}