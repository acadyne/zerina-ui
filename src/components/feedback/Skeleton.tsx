// src/components/feedback/Skeleton.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type SkeletonVariant =
  | "rect"
  | "text"
  | "circle";

export type SkeletonSlot = "root";

export type SkeletonStyles =
  SlotStyleMap<SkeletonSlot>;

export type SkeletonSlotProps =
  SlotPropsMap<SkeletonSlot>;

export interface SkeletonProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  children?: React.ReactNode;
  loading?: boolean;

  variant?: SkeletonVariant;

  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  rounded?: React.CSSProperties["borderRadius"];

  animated?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: SkeletonStyles;
  slotProps?: SkeletonSlotProps;
}

function getVariantStyles(
  variant: SkeletonVariant,
  rounded?: React.CSSProperties["borderRadius"]
): React.CSSProperties {
  if (variant === "circle") {
    return {
      borderRadius:
        rounded ??
        "var(--ui-radius-full)",
      aspectRatio: "1 / 1",
    };
  }

  if (variant === "text") {
    return {
      borderRadius:
        rounded ??
        "var(--ui-radius-sm)",
      minHeight: "0.85em",
    };
  }

  return {
    borderRadius:
      rounded ??
      "var(--ui-radius-md)",
  };
}

export const Skeleton = React.forwardRef<
  HTMLDivElement,
  SkeletonProps
>(
  (
    {
      children,
      loading = true,
      variant = "rect",
      width,
      height,
      rounded,
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

    const rootSlot = resolveSlot<SkeletonSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,

      baseProps: {
        "aria-hidden": true,
        "data-ui-skeleton": "true",
        "data-ui-skeleton-variant": variant,
        "data-ui-skeleton-static":
          !animated ||
          undefined,
      },

      baseStyle: {
        position: "relative",
        overflow: "hidden",
        width,
        height,
        minWidth: 0,
        background:
          "var(--ui-skeleton-bg)",
        ...getVariantStyles(
          variant,
          rounded
        ),
      },
    });

    return (
      <div
        {...rootSlot}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";