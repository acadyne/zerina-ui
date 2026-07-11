// src/components/feedback/Progress.tsx
import React from "react";
import { motion } from "framer-motion";
import { useOptionalUIMotion } from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type ProgressSize = "sm" | "md" | "lg";

export type ProgressVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type ProgressSlot =
  | "root"
  | "labelRow"
  | "label"
  | "value"
  | "track"
  | "bar";

export type ProgressStyles = SlotStyleMap<ProgressSlot>;

export type ProgressSlotProps = SlotPropsMap<ProgressSlot>;

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  min?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  indeterminate?: boolean;
  showValue?: boolean;
  label?: React.ReactNode;
  rounded?: React.CSSProperties["borderRadius"];
  trackColor?: React.CSSProperties["backgroundColor"];
  barColor?: React.CSSProperties["backgroundColor"];

  styles?: ProgressStyles;
  slotProps?: ProgressSlotProps;
}

const heightMap: Record<ProgressSize, number> = {
  sm: 6,
  md: 9,
  lg: 12,
};

const variantColorMap: Record<ProgressVariant, string> = {
  primary: "var(--ui-primary)",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "var(--ui-danger)",
  neutral: "var(--ui-text-muted)",
};

function clampProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(max, Math.max(min, value));
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      min = 0,
      size = "md",
      variant = "primary",
      indeterminate = false,
      showValue = false,
      label,
      rounded = "var(--ui-radius-full)",
      trackColor = "var(--ui-surface-3)",
      barColor,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();

    const safeValue = clampProgress(value, min, max);
    const percent = max <= min ? 0 : ((safeValue - min) / (max - min)) * 100;
    const height = heightMap[size];
    const resolvedBarColor = barColor ?? variantColorMap[variant];

    const shouldAnimateIndeterminate =
      motionState.shouldAnimateProgressIndeterminate(
        motionState.effectiveLevel
      );

    const indeterminateTransition =
      motionState.getProgressIndeterminateTransition(
        motionState.effectiveLevel
      );

    const rootSlot = resolveSlot<ProgressSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        role: "progressbar",
        "aria-valuemin": indeterminate ? undefined : min,
        "aria-valuemax": indeterminate ? undefined : max,
        "aria-valuenow": indeterminate ? undefined : safeValue,
        "data-ui-progress": "",
        "data-ui-progress-size": size,
        "data-ui-progress-variant": variant,
        "data-ui-progress-indeterminate": indeterminate || undefined,
      },
      baseStyle: {
        width: "100%",
        minWidth: 0,
      },
    });

    const labelRowSlot = resolveSlot<ProgressSlot>({
      slot: "labelRow",
      styles,
      slotProps,
      baseStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        marginBottom: "0.4rem",
        minWidth: 0,
      },
    });

    const labelSlot = resolveSlot<ProgressSlot>({
      slot: "label",
      styles,
      slotProps,
      baseStyle: {
        margin: 0,
        minWidth: 0,
        fontSize: "var(--ui-font-size-sm)",
        fontWeight: 700,
        color: "var(--ui-text)",
        lineHeight: 1.4,
      },
    });

    const valueSlot = resolveSlot<ProgressSlot>({
      slot: "value",
      styles,
      slotProps,
      baseStyle: {
        margin: 0,
        flexShrink: 0,
        fontSize: "var(--ui-font-size-sm)",
        color: "var(--ui-text-muted)",
        lineHeight: 1.4,
      },
    });

    const trackSlot = resolveSlot<ProgressSlot>({
      slot: "track",
      styles,
      slotProps,
      baseStyle: {
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: rounded,
        background: trackColor,
      },
    });

    const barSlot = resolveSlot<ProgressSlot>({
      slot: "bar",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: indeterminate
        ? {
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "42%",
            borderRadius: rounded,
            background: resolvedBarColor,
          }
        : {
            height: "100%",
            borderRadius: rounded,
            background: resolvedBarColor,
          },
    });

    return (
      <div {...rootSlot} ref={ref} {...rest}>
        {label || showValue ? (
          <div {...labelRowSlot}>
            {label ? <span {...labelSlot}>{label}</span> : <span />}

            {showValue && !indeterminate ? (
              <span {...valueSlot}>{Math.round(percent)}%</span>
            ) : null}
          </div>
        ) : null}

        <div {...trackSlot}>
          {indeterminate ? (
            <motion.div
              {...toMotionSlotProps(barSlot)}
              initial={shouldAnimateIndeterminate ? { x: "-45%" } : false}
              animate={{
                x: shouldAnimateIndeterminate ? "145%" : "0%",
              }}
              transition={indeterminateTransition}
            />
          ) : (
            <motion.div
              {...toMotionSlotProps(barSlot)}
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={motionState.getTransition(
                motionState.effectiveLevel,
                "layout"
              )}
            />
          )}
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";