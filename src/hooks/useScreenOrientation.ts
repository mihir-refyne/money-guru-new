import { useEffect, useState } from "react";

function getScreenOrientationType(): OrientationType | null {
  if (typeof window === "undefined") return null;
  return window?.screen?.orientation?.type ?? null;
}

export default function useScreenOrientation(): OrientationType | null {
  const [screenOrientationType, setScreenOrientationType] =
    useState<OrientationType | null>(null);

  function handleScreenOrientationChange() {
    setScreenOrientationType(getScreenOrientationType());
  }

  useEffect(() => {
    setScreenOrientationType(getScreenOrientationType());
    window?.screen?.orientation?.addEventListener(
      "change",
      handleScreenOrientationChange
    );
    return () => {
      window?.screen?.orientation?.removeEventListener(
        "change",
        handleScreenOrientationChange
      );
    };
  }, []);

  return screenOrientationType;
}
