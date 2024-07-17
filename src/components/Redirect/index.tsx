import { useEffect } from "react";
import { useRouter } from "next/router";

interface RedirectProps {
  replace?: boolean;
  to: string;
  preserveCurrentQueryParams?: boolean;
  query?: Record<string, string>;
}

export default function Redirect({
  replace = true,
  to,
  preserveCurrentQueryParams = true,
  query,
}: RedirectProps) {
  const router = useRouter();
  useEffect(() => {
    const _query = preserveCurrentQueryParams
      ? { ...router.query, ...query }
      : query;
    const navigationPayload = {
      pathname: to,
      query: _query,
    };
    if (replace) {
      router.replace(navigationPayload);
      return;
    }
    router.push(navigationPayload);
  }, []);
  return null;
}
