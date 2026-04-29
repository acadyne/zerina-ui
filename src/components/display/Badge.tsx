// src/components/display/Badge.tsx
import React from "react";

type BadgeVariant = "solid" | "subtle" | "outline";
type BadgeScheme =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  colorScheme?: BadgeScheme;
  rounded?: React.CSSProperties["borderRadius"];
  style?: React.CSSProperties;
}

const schemeMap: Record<
  BadgeScheme,
  {
    solidBg: string;
    solidText: string;
    subtleBg: string;
    subtleText: string;
    outlineText: string;
    outlineBorder: string;
  }
> = {
  primary: {
    solidBg: "var(--ui-primary)",
    solidText: "var(--ui-primary-contrast)",
    subtleBg: "color-mix(in srgb, var(--ui-primary) 18%, transparent)",
    subtleText: "var(--ui-primary)",
    outlineText: "var(--ui-primary)",
    outlineBorder: "color-mix(in srgb, var(--ui-primary) 40%, var(--ui-border))",
  },
  secondary: {
    solidBg: "var(--ui-secondary)",
    solidText: "var(--ui-secondary-contrast)",
    subtleBg: "color-mix(in srgb, var(--ui-secondary) 18%, transparent)",
    subtleText: "var(--ui-secondary)",
    outlineText: "var(--ui-secondary)",
    outlineBorder: "color-mix(in srgb, var(--ui-secondary) 40%, var(--ui-border))",
  },
  success: {
    solidBg: "#15803d",
    solidText: "#ffffff",
    subtleBg: "rgba(22, 163, 74, 0.16)",
    subtleText: "#22c55e",
    outlineText: "#22c55e",
    outlineBorder: "rgba(34, 197, 94, 0.35)",
  },
  warning: {
    solidBg: "#b45309",
    solidText: "#ffffff",
    subtleBg: "rgba(245, 158, 11, 0.16)",
    subtleText: "#f59e0b",
    outlineText: "#f59e0b",
    outlineBorder: "rgba(245, 158, 11, 0.35)",
  },
  danger: {
    solidBg: "var(--ui-danger)",
    solidText: "var(--ui-danger-contrast)",
    subtleBg: "color-mix(in srgb, var(--ui-danger) 16%, transparent)",
    subtleText: "var(--ui-danger)",
    outlineText: "var(--ui-danger)",
    outlineBorder: "color-mix(in srgb, var(--ui-danger) 40%, var(--ui-border))",
  },
  neutral: {
    solidBg: "var(--ui-surface-3)",
    solidText: "var(--ui-text)",
    subtleBg: "var(--ui-surface-2)",
    subtleText: "var(--ui-text-muted)",
    outlineText: "var(--ui-text-muted)",
    outlineBorder: "var(--ui-border)",
  },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "subtle",
      colorScheme = "neutral",
      rounded = "var(--ui-radius-full)",
      style,
      ...rest
    },
    ref
  ) => {
    const scheme = schemeMap[colorScheme];

    const variantStyle: React.CSSProperties =
      variant === "solid"
        ? {
            background: scheme.solidBg,
            color: scheme.solidText,
            border: "1px solid transparent",
          }
        : variant === "outline"
          ? {
              background: "transparent",
              color: scheme.outlineText,
              border: `1px solid ${scheme.outlineBorder}`,
            }
          : {
              background: scheme.subtleBg,
              color: scheme.subtleText,
              border: "1px solid transparent",
            };

    return (
      <span
        ref={ref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.35rem",
          minHeight: 22,
          maxWidth: "100%",
          padding: "0.2rem 0.55rem",
          fontSize: "0.75rem",
          fontWeight: 700,
          lineHeight: 1,
          whiteSpace: "nowrap",
          borderRadius: rounded,
          letterSpacing: "0.02em",
          ...variantStyle,
          ...style,
        }}
        {...rest}
      >
        <span
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {children}
        </span>
      </span>
    );
  }
);

Badge.displayName = "Badge";