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
    radius + (percentageValue > 0.75 ? -(indicatorWidth / 2) : indicatorWidth / 2);
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
          d="M265.795 134.912C266.79 134.924 267.608 134.127 267.606 133.132C267.576 112.178 262.608 91.5247 253.103 72.8499C252.652 71.9632 251.561 71.6253 250.68 72.0886C249.8 72.5518 249.463 73.6408 249.914 74.5277C259.14 92.6719 263.966 112.733 264.003 133.088C264.005 134.083 264.8 134.9 265.795 134.912Z"
          //   TODO: Maybe update color based on the Array provided
          fill="#0C7057"
        />
        <path
          d="M249.2 69.3536C250.07 68.8697 250.383 67.7719 249.887 66.9091C245.905 59.9772 241.307 53.4175 236.15 47.3093C235.508 46.5491 234.369 46.4693 233.617 47.1215C232.866 47.7736 232.786 48.9107 233.428 49.6712C238.423 55.5913 242.878 61.9469 246.739 68.6618C247.235 69.5244 248.331 69.8376 249.2 69.3536Z"
          fill="#2C9E82"
        />
        <path
          d="M208.196 24.5345C208.755 23.7114 208.541 22.5899 207.711 22.0419C202.019 18.286 196.047 14.9724 189.848 12.1303C188.943 11.7156 187.879 12.1282 187.476 13.0382C187.074 13.9482 187.486 15.011 188.39 15.426C194.391 18.18 200.173 21.3882 205.686 25.0226C206.517 25.5703 207.636 25.3575 208.196 24.5345Z"
          fill="#8A5006"
        />
        <path
          d="M231.036 44.2341C231.768 43.5601 231.816 42.4194 231.132 41.6966C225.757 36.0149 219.892 30.8172 213.605 26.1637C212.806 25.5717 211.679 25.7564 211.098 26.5641C210.517 27.3717 210.701 28.4965 211.501 29.0888C217.59 33.5995 223.272 38.635 228.481 44.1376C229.165 44.8602 230.304 44.9081 231.036 44.2341Z"
          fill="#EC9527"
        />
        <path
          d="M184.511 11.77C184.891 10.8504 184.454 9.79563 183.529 9.4281C163.646 1.52484 142.143 -1.47995 120.838 0.67981C98.9349 2.90017 77.9228 10.5099 59.6775 22.8294C41.4321 35.149 26.5215 51.795 16.2768 71.2812C6.31179 90.2355 1.06323 111.303 0.963365 132.7C0.958721 133.695 1.77372 134.494 2.76869 134.485V134.485C3.76367 134.477 4.56182 133.663 4.56683 132.668C4.67172 111.866 9.77803 91.3857 19.4662 72.9579C29.434 53.9984 43.9416 37.8023 61.6938 25.8157C79.4461 13.8291 99.8903 6.42506 121.201 4.26471C141.914 2.16496 162.819 5.08235 182.153 12.7586C183.078 13.1258 184.131 12.6896 184.511 11.77V11.77Z"
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
