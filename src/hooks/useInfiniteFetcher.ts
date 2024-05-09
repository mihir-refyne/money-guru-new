import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type InfiniteFetcher<T> = (
  setData: Dispatch<SetStateAction<T | undefined>>,
  setNextToken: Dispatch<SetStateAction<string | undefined>>,
  setIsDone: Dispatch<SetStateAction<boolean>>,
  nextToken?: string
) => Promise<void>;

export default function useInfiniteFetcher<T>(fetcher: InfiniteFetcher<T>) {
  const [data, setDataInternal] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [nextToken, setNextTokenInternal] = useState<string | undefined>("");
  const [isDone, setIsDoneInternal] = useState(false);

  async function* createInfiniteGen() {
    while (true) {
      if (isDone) {
        return;
      }
      setIsFetching(true);
      await fetcher(
        setDataInternal,
        setNextTokenInternal,
        setIsDoneInternal,
        nextToken
      );
      setIsFetching(false);
      if (isLoading) {
        setIsLoading(false);
      }
      setIsFetching(false);
      yield;
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
