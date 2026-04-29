// src/components/feedback/Skeleton.tsx
import React from "react";

export type SkeletonVariant = "rect" | "text" | "circle";

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactNode;
  loading?: boolean;

  variant?: SkeletonVariant;

  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  rounded?: React.CSSProperties["borderRadius"];

  animated?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

function getVariantStyles(
  variant: SkeletonVariant,
  rounded?: React.CSSProperties["borderRadius"]
): React.CSSProperties {
  if (variant === "circle") {
    return {
      borderRadius: rounded ?? "var(--ui-radius-full)",
      aspectRatio: "1 / 1",
    };
  }

  if (variant === "text") {
    return {
      borderRadius: rounded ?? "var(--ui-radius-sm)",
      minHeight: "0.85em",
    };
  }

  return {
    borderRadius: rounded ?? "var(--ui-radius-md)",
  };
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
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
      ...rest
    },
    ref
  ) => {
    if (!loading) {
      return <>{children}</>;
    }

    return (
      <div
        ref={ref}
        className={className}
        aria-hidden="true"
        data-ui-skeleton="true"
        data-ui-skeleton-static={!animated || undefined}
        style={{
          position: "relative",
          overflow: "hidden",
          width,
          height,
          minWidth: 0,
          background: "var(--ui-skeleton-bg)",
          ...getVariantStyles(variant, rounded),
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";