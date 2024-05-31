import { useEffect, useState } from "react";

export default function useFetcher<T, E extends Error>(
  fetcher: () => Promise<T> | null
) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  async function fetchData(requiresLoading: boolean = true) {
    requiresLoading && setIsLoading(true);
    try {
      const resp = await fetcher();
      setData(resp);
    } catch (error: any) {
      setError(error);
    } finally {
      requiresLoading && setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, data, error, refetch: fetchData };
}
