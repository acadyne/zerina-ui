// src/components/feedback/Spinner.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type SpinnerSlot = "root";

export type SpinnerStyles = SlotStyleMap<SpinnerSlot>;

export type SpinnerSlotProps = SlotPropsMap<SpinnerSlot>;

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl" | number;
  color?: string;
  className?: string;
  thickness?: number;
  style?: React.CSSProperties;

  styles?: SpinnerStyles;
  slotProps?: SpinnerSlotProps;
}

const sizeMap: Record<string, number> = {
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = "md",
      color = "var(--ui-text)",
      thickness = 4,
      className = "",
      style,
      styles,
      slotProps,
    },
    ref
  ) => {
    const px = typeof size === "number" ? size : sizeMap[size] ?? 32;

    const rootSlot = resolveSlot<SpinnerSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-spinner": "true",
        role: "status",
        "aria-label": "Cargando",
      },
      baseStyle: {
        width: px,
        height: px,
        minWidth: px,
        minHeight: px,
        border: `${thickness}px solid ${color}`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "ui-spin var(--ui-spinner-duration, 0.9s) linear infinite",
        flexShrink: 0,
      },
    });

    return <div {...rootSlot} ref={ref} />;
  }
);

Spinner.displayName = "Spinner";