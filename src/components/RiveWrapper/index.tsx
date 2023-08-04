import { type CSSProperties, useEffect } from "react";
import {
  type Rive,
  useRive,
  type UseRiveParameters,
  type Fit,
  type Alignment,
  Layout,
  RuntimeLoader,
} from "@rive-app/react-canvas";
// INFO: This loads base64 url
import riveWasmUrl from "@rive-app/canvas/rive.wasm";

RuntimeLoader.setWasmUrl(riveWasmUrl);

type Position = `${Fit}_${Alignment}`;

function getLayoutFromPositionIfAvailable(
  position?: Position
): Layout | undefined {
  if (!position) return;
  const [fit, alignment] = position.split("_") as [Fit, Alignment];
  return new Layout({
    fit,
    alignment,
  });
}

interface RiveWrapperProps extends NonNullable<UseRiveParameters> {
  className?: string;
  width?: string;
  height?: string;
  style?: CSSProperties;
  position?: Position;
  onRiveLoad?: (rive: Rive) => void;
}

export default function RiveWrapper({
  className,
  width,
  height,
  style,
  position,
  layout,
  onRiveLoad,
  autoplay = true,
  ...restProps
}: RiveWrapperProps) {
  const _layout = layout ?? getLayoutFromPositionIfAvailable(position);
  const { rive, RiveComponent } = useRive({
    layout: _layout,
    autoplay,
    ...restProps,
  });

  useEffect(() => {
    if (!rive) return;
    onRiveLoad?.(rive);
  }, [rive]);

  return (
    <RiveComponent
      className={className}
      width={width}
      height={height}
      style={style}
    />
  );
}
