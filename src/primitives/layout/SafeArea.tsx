// src/primitives/layout/SafeArea.tsx
import React from "react";
import {
  getSafeAreaPadding,
  type SafeAreaEdges,
} from "../../helpers/safeArea";
import { Box, type BoxProps } from "./Box";

export type { SafeAreaEdges } from "../../helpers/safeArea";

export type SafeAreaProps<E extends React.ElementType = "div"> = BoxProps<E> & {
  children?: React.ReactNode;
  edges?: SafeAreaEdges;
  minScreenHeight?: boolean;
};

export function SafeArea<E extends React.ElementType = "div">(
  props: SafeAreaProps<E>
) {
  const {
    children,
    edges = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    },
    minScreenHeight = false,
    style,
    ...rest
  } = props;

  return (
    <Box
      {...(rest as BoxProps<E>)}
      style={{
        ...getSafeAreaPadding(edges),
        minHeight:
          minScreenHeight
            ? "100dvh"
            : undefined,
        height:
          minScreenHeight
            ? "100dvh"
            : undefined,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
