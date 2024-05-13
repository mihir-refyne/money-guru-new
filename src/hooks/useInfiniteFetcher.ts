import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export type InfiniteFetcher<T> = (
  setData: Dispatch<SetStateAction<T | undefined>>,
  setIsDone: Dispatch<SetStateAction<boolean>>,
  nextToken?: string
) => Promise<string | undefined>;

export default function useInfiniteFetcher<T>(fetcher: InfiniteFetcher<T>) {
  const [data, setDataInternal] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const nextTokenRef = useRef<string | undefined>();
  const [isDone, setIsDoneInternal] = useState(false);

  async function* createInfiniteGen() {
    try {
      while (true) {
        if (isDone) {
          return;
        }
        if (isFetching) {
          yield;
        }
        setIsFetching(true);
        nextTokenRef.current = await fetcher(
          setDataInternal,
          setIsDoneInternal,
          nextTokenRef.current
        );
        setIsFetching(false);
        if (isLoading) {
          setIsLoading(false);
        }
        setIsFetching(false);
        yield;
      }
    } catch (e) {
      console.error(e);
      return;
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }

  const infiniteGen = createInfiniteGen();
  let next = infiniteGen.next.bind(infiniteGen);

  useEffect(() => {
    setIsLoading(true);
    next();
  }, []);

  return {
    isLoading,
    next,
    isFetching,
    data,
  };
}
