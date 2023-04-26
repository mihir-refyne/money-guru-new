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
          d="M265.805 133.322C266.8 133.322 267.608 132.515 267.594 131.52C267.145 98.2802 254.292 66.4038 231.559 42.1497C230.878 41.4237 229.736 41.4023 229.02 42.0925C228.303 42.7827 228.283 43.9231 228.963 44.6493C251.05 68.2317 263.542 99.2124 263.991 131.52C264.004 132.515 264.81 133.322 265.805 133.322Z"
          fill="#0C7057"
        />
        <path
          d="M219.105 32.8077C219.746 32.0473 220.884 31.9501 221.635 32.602C223.892 34.5594 226.083 36.5922 228.204 38.6969C228.91 39.3978 228.898 40.5394 228.187 41.2361C227.477 41.9328 226.337 41.9207 225.631 41.22C223.59 39.1959 221.482 37.2401 219.311 35.356C218.56 34.7038 218.463 33.5681 219.105 32.8077Z"
          fill="#2C9E82"
        />
        <path
          d="M202.855 21.0918C203.374 20.2427 203.107 19.1327 202.251 18.6254C182.761 7.07629 160.649 0.683828 138.004 0.0518893C137.009 0.0241336 136.191 0.820333 136.176 1.81525C136.162 2.81016 136.957 3.627 137.952 3.65513C159.952 4.27732 181.433 10.4874 200.372 21.7005C201.228 22.2074 202.337 21.9409 202.855 21.0918Z"
          fill="#8A5006"
        />
        <path
          d="M204.76 22.2781C205.293 21.438 206.407 21.1881 207.24 21.7326C210.91 24.1318 214.459 26.7106 217.875 29.4595C218.65 30.0834 218.756 31.22 218.122 31.9867C217.488 32.7533 216.353 32.8596 215.577 32.2361C212.278 29.583 208.852 27.0931 205.309 24.7752C204.477 24.2304 204.227 23.1182 204.76 22.2781Z"
          fill="#EC9527"
        />
        <path
          d="M134.284 1.80164C134.284 0.80662 133.477 -0.00127242 132.483 0.0121727C115.588 0.240485 98.8843 3.67838 83.2639 10.1486C67.0885 16.8486 52.3912 26.6691 40.0111 39.0492C27.631 51.4293 17.8105 66.1266 11.1105 82.302C4.64029 97.9224 1.2024 114.626 0.974087 131.521C0.960642 132.516 1.76853 133.322 2.76355 133.322C3.75857 133.322 4.56388 132.516 4.5777 131.521C4.80578 115.099 8.15036 98.8641 14.4394 83.6809C20.9584 67.9427 30.5135 53.6426 42.559 41.5971C54.6045 29.5516 68.9046 19.9965 84.6428 13.4775C99.826 7.18846 116.061 3.84387 132.483 3.61578C133.477 3.60196 134.284 2.79665 134.284 1.80164Z"
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
