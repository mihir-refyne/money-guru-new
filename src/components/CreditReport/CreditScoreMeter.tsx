import { ReactNode } from "react";
import { convertPixelToRem } from "@/lib/utils";

const SVG_VIEWBOX_WIDTH = 268;

interface CreditScoreMeterProps {
  width?: number;
  indicatorRadius?: number;
  indicatorWidth?: number;
  indicatorColors?: Array<{ from: number; to: number; color: string }>;
  value: number;
  min: number;
  max: number;
  children?: ReactNode;
}

// TODO: This is very specific to Credit Score as of now, make it generic
export default function CreditScoreMeter({
  width = 268,
  indicatorRadius = 8,
  indicatorWidth = 4,
  indicatorColors,
  value: _value,
  max,
  min,
  children,
}: CreditScoreMeterProps) {
  const value = _value < min ? min : _value > max ? max : _value;
  const percentageValue = (value - min) / (max - min);
  const valueInAngle = 180 * percentageValue;
  const angle = 180 + valueInAngle;

  const radius = SVG_VIEWBOX_WIDTH / 2;
  const offset =
    radius +
    (percentageValue > 0.75 ? -(indicatorWidth / 2) : indicatorWidth / 2);
  const markerPositionX = Math.cos(degreesToRadians(angle)) * radius + offset;
  const markerPositionY = Math.sin(degreesToRadians(angle)) * radius + offset;

  const indicatorColor = getIndicatorColorByValue(indicatorColors, value);
  const svgViewBoxX = -indicatorRadius * 1.5;
  const svgViewBoxWidth = SVG_VIEWBOX_WIDTH + indicatorRadius * 3;
  const rootElemHeight = width / 2 + indicatorRadius * 3;
  return (
    <div
      style={{
        display: "inline-block",
        height: convertPixelToRem(rootElemHeight),
        overflowY: "hidden",
        position: "relative",
      }}
    >
      <svg
        width={convertPixelToRem(width)}
        height={convertPixelToRem(width)}
        viewBox={`${svgViewBoxX} 0 ${svgViewBoxWidth} 268`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M265.805 133.322C266.8 133.322 267.608 132.515 267.594 131.52C267.233 104.787 258.842 78.7774 243.511 56.8735C242.94 56.0583 241.813 55.8755 241.005 56.4571V56.4571C240.198 57.0386 240.016 58.1641 240.586 58.9795C255.476 80.2698 263.63 105.542 263.991 131.52C264.004 132.515 264.81 133.322 265.805 133.322V133.322Z"
          fill="#0C7057"
        />
        <path
          d="M238.77 53.4445C239.56 52.8402 239.712 51.7087 239.097 50.9264C234.156 44.6415 228.66 38.8137 222.676 33.5135C221.931 32.8538 220.792 32.9392 220.143 33.6929V33.6929C219.493 34.4467 219.578 35.5833 220.323 36.2433C226.12 41.3809 231.445 47.0274 236.234 53.115C236.849 53.897 237.979 54.0488 238.77 53.4445V53.4445Z"
          fill="#2C9E82"
        />
        <path
          d="M192.454 15.365C192.894 14.4726 192.528 13.3912 191.63 12.9632C175.239 5.1537 157.425 0.774281 139.282 0.0937031C138.288 0.0564055 137.462 0.844722 137.438 1.83945V1.83945C137.414 2.83418 138.201 3.65861 139.195 3.69628C156.816 4.36385 174.115 8.61683 190.036 16.1952C190.934 16.6229 192.014 16.2574 192.454 15.365V15.365Z"
          fill="#8A5006"
        />
        <path
          d="M217.496 31.472C218.125 30.7014 218.012 29.5654 217.233 28.9463C211.11 24.08 204.57 19.762 197.689 16.0423C196.814 15.5691 195.725 15.9109 195.263 16.7925V16.7925C194.802 17.6741 195.143 18.7616 196.019 19.2351C202.683 22.8414 209.019 27.0247 214.953 31.737C215.732 32.3558 216.866 32.2425 217.496 31.472V31.472Z"
          fill="#EC9527"
        />
        <path
          d="M134.284 1.80164C134.284 0.80662 133.477 -0.00127242 132.483 0.0121727C115.588 0.240485 98.8843 3.67838 83.2639 10.1486C67.0885 16.8486 52.3912 26.6691 40.0111 39.0492C27.631 51.4293 17.8105 66.1266 11.1105 82.302C4.64029 97.9224 1.2024 114.626 0.974087 131.521C0.960642 132.516 1.76853 133.322 2.76355 133.322V133.322C3.75857 133.322 4.56388 132.516 4.5777 131.521C4.80578 115.099 8.15036 98.8641 14.4394 83.681C20.9584 67.9427 30.5135 53.6426 42.559 41.5971C54.6045 29.5516 68.9046 19.9965 84.6428 13.4775C99.826 7.18846 116.061 3.84387 132.483 3.61578C133.477 3.60196 134.284 2.79665 134.284 1.80164V1.80164Z"
          fill="#F57B7B"
        />
        <circle
          cx={markerPositionX}
          cy={markerPositionY}
          r={indicatorRadius}
          fill="#FFFEFE"
          stroke={indicatorColor}
          strokeWidth={convertPixelToRem(indicatorWidth)}
        />
      </svg>
      <div
        className="text-caption text-medium clr-text-secondary"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
        }}
      >
        {min}
      </div>
      <div
        className="text-caption text-medium clr-text-secondary"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      >
        {max}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          marginBottom: "1.6rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function getIndicatorColorByValue(
  colorsByRange: Array<{ from: number; to: number; color: string }> | undefined,
  value: number
): string {
  const defaultColor = "var(--clr-info-success-default)";
  const color = colorsByRange?.find(
    (el) => value >= el.from && value <= el.to
  )?.color;
  return color ?? defaultColor;
}
