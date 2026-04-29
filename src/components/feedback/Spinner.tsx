// src/components/feedback/Spinner.tsx
import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl" | number;
  color?: string;
  className?: string;
  thickness?: number;
  style?: React.CSSProperties;
}

const sizeMap: Record<string, number> = {
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "var(--ui-text)",
  thickness = 4,
  className = "",
  style,
}) => {
  const px = typeof size === "number" ? size : sizeMap[size] ?? 32;

  return (
    <div
      data-ui-spinner="true"
      className={className}
      role="status"
      aria-label="Cargando"
      style={{
        width: px,
        height: px,
        minWidth: px,
        minHeight: px,
        border: `${thickness}px solid ${color}`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "ui-spin var(--ui-spinner-duration, 0.9s) linear infinite",
        flexShrink: 0,
        ...style,
      }}
    />
  );
};