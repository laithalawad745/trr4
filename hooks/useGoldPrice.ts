// hooks/useGoldPrice.ts

import { useQuery } from '@tanstack/react-query';

export function useGoldPrice(refetchInterval = 5000) {
  return useQuery({
    queryKey: ['goldPrice'],
    queryFn: async () => {
      const response = await fetch('/api/prices/gold');
      if (!response.ok) {
        throw new Error('Failed to fetch gold price');
      }
      return response.json();
    },
    refetchInterval,
    staleTime: 3000,
  });
}