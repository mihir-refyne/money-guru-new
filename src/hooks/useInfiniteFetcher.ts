import { useEffect, useRef, useState } from "react";

type NextToken = string | undefined;
type IsDone = boolean;

export type InfiniteFetcher<T> = (
  nextToken?: string
) => Promise<[T | undefined, NextToken, IsDone]>;

export default function useInfiniteFetcher<T extends Array<unknown>>(
  fetcher: InfiniteFetcher<T>
) {
  const [data, setData] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const nextTokenRef = useRef<string | undefined>();
  const [isDone, setIsDone] = useState(false);

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
        const [newData, nextTokenToSet, isDoneToSet] = await fetcher(
          nextTokenRef.current
        );
        setData((oldData) => {
          if (oldData && newData) {
            return [...oldData, ...newData] as T;
          }
          if (newData) {
            return newData;
          }
          return undefined;
        });
        setIsDone(isDoneToSet);
        nextTokenRef.current = nextTokenToSet;
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
