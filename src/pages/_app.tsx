import { getPreferredLocale } from "@/lib/locale";
import "@/styles/globals.css";
import { Work_Sans } from "@next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const workSans = Work_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const locale = getPreferredLocale();
    if (locale) {
      router.replace(router.asPath, router.asPath, { locale });
    }
    setIsMounted(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        * {
          font-family: ${workSans.style.fontFamily};
        }
      `}</style>
      {isMounted && <Component {...pageProps} />}
    </>
  );
}
