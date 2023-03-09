import React from "react";
import styles from "./styles.module.css";
import deviceRotateIllustrationUrl from "@/images/device-rotate.svg";
import Image from "next/image";

interface DeviceRotatePromptOverlayProps {
  active: boolean;
}

export default function DeviceRotatePromptOverlay({
  active,
}: DeviceRotatePromptOverlayProps) {
  if (!active) return null;
  return (
    <div className={styles.DeviceRotatePromptOverlay}>
      <figure className="mb-6">
        <Image src={deviceRotateIllustrationUrl} alt="Rotate Device" />
      </figure>
      <h3 className="text-heading mb-3">Please Rotate Your Phone</h3>
      <p className="clr-text-secondary">
        Please use your phone in portrait to resume reading R-Shorts
      </p>
    </div>
  );
}
