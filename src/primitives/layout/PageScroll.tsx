import React from "react";
import { Box, type BoxProps } from "./Box";

export type PageScrollProps = BoxProps<"div"> & {
  children?: React.ReactNode;
  fillParent?: boolean;
};

export function PageScroll({
  children,
  fillParent = true,
  style,
  ...rest
}: PageScrollProps) {
  return (
    <Box
      {...rest}
      style={{
        width: "100%",
        minWidth: 0,
        minHeight: 0,
        height: fillParent ? "100%" : undefined,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        touchAction: "pan-y",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </Box>
  );
}