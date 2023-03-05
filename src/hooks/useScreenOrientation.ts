import { useEffect, useState } from "react";

function getScreenOrientationType(
  type?: OrientationType
): OrientationType | null {
  if (!type) return null;
  return type;
}

export default function useScreenOrientation(): OrientationType | null {
  const [screenOrientationType, setScreenOrientationType] =
    useState<OrientationType | null>(() =>
      getScreenOrientationType(window?.screen?.orientation?.type)
    );

  function handleScreenOrientationChange() {
    setScreenOrientationType(
      getScreenOrientationType(window?.screen?.orientation?.type)
    );
  }

  useEffect(() => {
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
