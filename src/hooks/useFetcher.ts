import { useEffect, useState } from "react";

export default function useFetcher<T, E extends Error>(
  fetcher: () => Promise<T>
) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  async function fetchData() {
    setIsLoading(true);
    try {
      const resp = await fetcher();
      setData(resp);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, data, error };
}
