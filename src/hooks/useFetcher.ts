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

// step 1 -> use this useFetcher function to make api call
// step 2 -> it will return  { isLoading, data, error, refetch: fetchData }; these things
// step 3 -> in a useEffecy check for error if error exists , getTheErrorcode from error
//  step 4 -> create one more map of Error code to errormodal content and use it her set value for the modal
