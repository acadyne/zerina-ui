// src/primitives/layout/Content.tsx
import React from "react";
import { Box } from "./Box";

export interface ContentProps {
  children?: React.ReactNode;
  p?: React.CSSProperties["padding"];
  maxW?: React.CSSProperties["maxWidth"];
  center?: boolean;
  fullHeight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Content: React.FC<ContentProps> = ({
  children,
  p = "clamp(12px, 2vw, 20px)",
  maxW = "1200px",
  center = false,
  fullHeight = false,
  className = "",
  style,
}) => {
  return (
    <Box
      className={className}
      style={{
        width: "100%",
        minWidth: 0,
        ...(fullHeight ? { minHeight: "100%" } : null),
        ...style,
      }}
    >
      <Box
        style={{
          width: "100%",
          maxWidth: maxW,
          minWidth: 0,
          marginLeft: center ? "auto" : undefined,
          marginRight: center ? "auto" : undefined,
          padding: p,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};