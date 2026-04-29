// src/components/feedback/LoadingState.tsx
import React from "react";
import { Box, Stack } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";
import { Spinner } from "./Spinner";
import { SkeletonCard } from "./SkeletonCard";
import { SkeletonTable } from "./SkeletonTable";
import { SkeletonText } from "./SkeletonText";

export type LoadingStateVariant = "spinner" | "text" | "card" | "table";

export interface LoadingStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactNode;
  loading?: boolean;

  variant?: LoadingStateVariant;
  label?: React.ReactNode;

  rows?: number;
  columns?: number;
  lines?: number;

  centered?: boolean;
  animated?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

export const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      children,
      loading = true,
      variant = "spinner",
      label = "Cargando...",
      rows = 5,
      columns = 4,
      lines = 3,
      centered = true,
      animated = true,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    if (!loading) {
      return <>{children}</>;
    }

    if (variant === "table") {
      return (
        <Box ref={ref as React.Ref<Element>} className={className} style={style} {...rest}>
          <SkeletonTable rows={rows} columns={columns} animated={animated} />
        </Box>
      );
    }

    if (variant === "card") {
      return (
        <Box ref={ref as React.Ref<Element>} className={className} style={style} {...rest}>
          <SkeletonCard lines={lines} animated={animated} />
        </Box>
      );
    }

    if (variant === "text") {
      return (
        <Box ref={ref as React.Ref<Element>} className={className} style={style} {...rest}>
          <SkeletonText lines={lines} animated={animated} />
        </Box>
      );
    }

    return (
      <Box
        ref={ref as React.Ref<Element>}
        className={className}
        role="status"
        aria-live="polite"
        style={{
          width: "100%",
          minWidth: 0,
          display: "flex",
          alignItems: centered ? "center" : "flex-start",
          justifyContent: centered ? "center" : "flex-start",
          padding: centered ? "1.5rem" : undefined,
          ...style,
        }}
        {...rest}
      >
        <Stack align="center" spacing="0.75rem">
          <Spinner size="md" />

          {label ? (
            <Typography
              size="sm"
              color="var(--ui-text-muted)"
              align="center"
              style={{ margin: 0 }}
            >
              {label}
            </Typography>
          ) : null}
        </Stack>
      </Box>
    );
  }
);

LoadingState.displayName = "LoadingState";