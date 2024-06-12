import { ReactNode } from "react";
import { BoxLoader, CardLoader, GridLoader } from "./LoaderComponents";

interface LoaderWrapperProps {
  children?: ReactNode;
  isLoading: boolean;
  cardCount?: number;
  columnCount?: number;
  rowCount?: number;
  loaderType?: LoaderType;
  className?: string;
  height?: string;
  width?: string;
  borderRadius?: number;
  background?: string;
}

export enum LoaderType {
  CARD = "CARD",
  GRID = "GRID",
  CUSTOM_BOX = "CUSTOM_BOX",
}

export default function LoaderWrapper({
  children,
  isLoading,
  loaderType = LoaderType.CARD,
  cardCount = 1,
  columnCount = 3,
  rowCount = 1,
  ...rest
}: LoaderWrapperProps) {
  if (isLoading) {
    if (LoaderType.CARD === loaderType)
      return <CardLoader cardCount={cardCount} {...rest} />;
    if (LoaderType.GRID === loaderType)
      return (
        <GridLoader columnCount={columnCount} rowCount={rowCount} {...rest} />
      );
    if (LoaderType.CUSTOM_BOX === loaderType) return <BoxLoader {...rest} />;
  }
  return <>{children}</>;
}
