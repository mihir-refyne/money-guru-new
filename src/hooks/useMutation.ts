import { useCallback, useState } from "react";

export default function useMutation<T, E extends Error, A extends unknown[]>(
  mutator: (...args: A) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const mutate = useCallback(
    async (...args: A) => {
      setError(null);
      setIsLoading(true);
      try {
        const resp = await mutator(...args);
        setData(resp);
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [mutator]
  );

  return { isLoading, data, error, mutate };
}
