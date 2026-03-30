import { useQueries, useQuery } from "@tanstack/react-query";
import { getAssetPrice } from "../services/api";

export function usePrices(symbol: string) {
  return useQuery({
    queryKey: ["prices", symbol],
    queryFn: () => getAssetPrice(symbol),
    enabled: !!symbol,
    select: (data) => ({
      ...data,
      sources: data?.sources ?? [],
      history: [], // TODO: Fetch historical price data for charting
    }),
  });
}

export function usePricesForSymbols(symbols: string[]) {
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["prices", symbol],
      queryFn: () => getAssetPrice(symbol),
      enabled: !!symbol,
      select: (data: Awaited<ReturnType<typeof getAssetPrice>>) => ({
        ...data,
        sources: data?.sources ?? [],
        history: [],
      }),
    })),
  });
}
