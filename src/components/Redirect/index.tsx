import { useEffect } from "react";
import { useRouter } from "next/router";

interface RedirectProps {
  replace?: boolean;
  to: string;
  query?: Record<string, string>;
}

export default function Redirect({ replace = true, to, query }: RedirectProps) {
  const router = useRouter();
  useEffect(() => {
    const _query = { ...router.query, ...query };
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
