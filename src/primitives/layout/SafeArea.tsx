// src/primitives/layout/SafeArea.tsx
import React from "react";
import { Box, type BoxProps } from "./Box";

type SafeEdges = {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
};

export type SafeAreaProps<E extends React.ElementType = "div"> = BoxProps<E> & {
  children?: React.ReactNode;
  edges?: SafeEdges;
  minScreenHeight?: boolean;
};

export function SafeArea<E extends React.ElementType = "div">(
  props: SafeAreaProps<E>
) {
  const {
    children,
    edges = { top: true, right: true, bottom: true, left: true },
    minScreenHeight = false,
    style,
    ...rest
  } = props;

  return (
    <Box
      {...(rest as BoxProps<E>)}
      style={{
        paddingTop: edges.top ? "var(--safe-top-offset)" : undefined,
        paddingRight: edges.right ? "var(--safe-right-offset)" : undefined,
        paddingBottom: edges.bottom ? "var(--safe-bottom-offset)" : undefined,
        paddingLeft: edges.left ? "var(--safe-left-offset)" : undefined,
        minHeight: minScreenHeight ? "100dvh" : undefined,
        height: minScreenHeight ? "100dvh" : undefined,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </Box>
  );
}