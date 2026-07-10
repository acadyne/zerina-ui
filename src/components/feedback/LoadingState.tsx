// src/components/feedback/LoadingState.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Spinner } from "./Spinner";
import { SkeletonCard } from "./SkeletonCard";
import { SkeletonTable } from "./SkeletonTable";
import { SkeletonText } from "./SkeletonText";

export type LoadingStateVariant = "spinner" | "text" | "card" | "table";

export type LoadingStateSlot = "root" | "content" | "spinner" | "label";

export type LoadingStateStyles = SlotStyleMap<LoadingStateSlot>;

export type LoadingStateSlotProps = SlotPropsMap<LoadingStateSlot>;

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

  styles?: LoadingStateStyles;
  slotProps?: LoadingStateSlotProps;
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
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    if (!loading) {
      return <>{children}</>;
    }

    const rootSlot = resolveSlot<LoadingStateSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-loading-state": "",
        "data-ui-loading-state-variant": variant,
      },
      baseStyle:
        variant === "spinner"
          ? {
              width: "100%",
              minWidth: 0,
              display: "flex",
              alignItems: centered ? "center" : "flex-start",
              justifyContent: centered ? "center" : "flex-start",
              padding: centered ? "1.5rem" : undefined,
            }
          : {
              width: "100%",
              minWidth: 0,
            },
    });

    if (variant === "table") {
      return (
        <div {...rootSlot} ref={ref} {...rest}>
          <SkeletonTable rows={rows} columns={columns} animated={animated} />
        </div>
      );
    }

    if (variant === "card") {
      return (
        <div {...rootSlot} ref={ref} {...rest}>
          <SkeletonCard lines={lines} animated={animated} />
        </div>
      );
    }

    if (variant === "text") {
      return (
        <div {...rootSlot} ref={ref} {...rest}>
          <SkeletonText lines={lines} animated={animated} />
        </div>
      );
    }

    const contentSlot = resolveSlot<LoadingStateSlot>({
      slot: "content",
      styles,
      slotProps,
      baseStyle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      },
    });

    const spinnerSlot = resolveSlot<LoadingStateSlot>({
      slot: "spinner",
      styles,
      slotProps,
    });

    const labelSlot = resolveSlot<LoadingStateSlot>({
      slot: "label",
      styles,
      slotProps,
      baseStyle: {
        margin: 0,
        fontSize: "var(--ui-font-size-sm)",
        lineHeight: 1.45,
        color: "var(--ui-text-muted)",
        textAlign: "center",
      },
    });

    return (
      <div
        {...rootSlot}
        ref={ref}
        role="status"
        aria-live="polite"
        {...rest}
      >
        <div {...contentSlot}>
          <Spinner
            size="md"
            className={spinnerSlot.className}
            style={spinnerSlot.style}
          />

          {label ? <div {...labelSlot}>{label}</div> : null}
        </div>
      </div>
    );
  }
);

LoadingState.displayName = "LoadingState";