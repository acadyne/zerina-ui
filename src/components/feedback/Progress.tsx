// src/components/feedback/Progress.tsx
import React from "react";
import { motion } from "framer-motion";
import { Box } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";
import { useOptionalUIMotion } from "../../core/motion";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressVariant = "primary" | "success" | "warning" | "danger" | "neutral";

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
      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();

    const safeValue = clampProgress(value, min, max);
    const percent = max <= min ? 0 : ((safeValue - min) / (max - min)) * 100;
    const height = heightMap[size];
    const resolvedBarColor = barColor ?? variantColorMap[variant];

    return (
      <Box
        ref={ref as React.Ref<Element>}
        className={className}
        role="progressbar"
        aria-valuemin={indeterminate ? undefined : min}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : safeValue}
        style={{
          width: "100%",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {label || showValue ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              marginBottom: "0.4rem",
              minWidth: 0,
            }}
          >
            {label ? (
              <Typography
                as="span"
                size="sm"
                weight={700}
                style={{ margin: 0, minWidth: 0 }}
              >
                {label}
              </Typography>
            ) : (
              <span />
            )}

            {showValue && !indeterminate ? (
              <Typography
                as="span"
                size="sm"
                color="var(--ui-text-muted)"
                style={{ margin: 0, flexShrink: 0 }}
              >
                {Math.round(percent)}%
              </Typography>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            position: "relative",
            width: "100%",
            height,
            overflow: "hidden",
            borderRadius: rounded,
            background: trackColor,
          }}
        >
          {indeterminate ? (
            <motion.div
              aria-hidden="true"
              initial={{ x: "-45%" }}
              animate={{ x: "145%" }}
              transition={{
                duration: motionState.effectiveLevel === "expressive" ? 1.1 : 1.35,
                ease: "linear",
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "42%",
                borderRadius: rounded,
                background: resolvedBarColor,
              }}
            />
          ) : (
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={motionState.getTransition(
                motionState.effectiveLevel,
                "layout"
              )}
              style={{
                height: "100%",
                borderRadius: rounded,
                background: resolvedBarColor,
              }}
            />
          )}
        </div>
      </Box>
    );
  }
);

Progress.displayName = "Progress";