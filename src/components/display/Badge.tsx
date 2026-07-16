// src/components/display/Badge.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

type BadgeVariant = "solid" | "subtle" | "outline";
type BadgeScheme =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type BadgeSlot = "root" | "content";

export type BadgeStyles = SlotStyleMap<BadgeSlot>;

export type BadgeSlotProps = SlotPropsMap<BadgeSlot>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  colorScheme?: BadgeScheme;
  rounded?: React.CSSProperties["borderRadius"];
  className?: string;
  style?: React.CSSProperties;

  styles?: BadgeStyles;
  slotProps?: BadgeSlotProps;
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
    outlineBorder:
      "color-mix(in srgb, var(--ui-secondary) 40%, var(--ui-border))",
  },
  success: {
    solidBg: "var(--ui-success-strong)",
    solidText: "var(--ui-success-contrast)",
    subtleBg:
      "color-mix(in srgb, var(--ui-success) 16%, transparent)",
    subtleText: "var(--ui-success)",
    outlineText: "var(--ui-success)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-success) 35%, var(--ui-border))",
  },
  warning: {
    solidBg: "var(--ui-warning-strong)",
    solidText: "var(--ui-warning-contrast)",
    subtleBg:
      "color-mix(in srgb, var(--ui-warning) 16%, transparent)",
    subtleText: "var(--ui-warning)",
    outlineText: "var(--ui-warning)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-warning) 35%, var(--ui-border))",
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
      className = "",
      style,
      styles,
      slotProps,
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

    const rootSlot = resolveSlot<BadgeSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-badge": "",
        "data-ui-badge-variant": variant,
        "data-ui-badge-color-scheme": colorScheme,
      },
      baseStyle: {
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
      },
    });

    const contentSlot = resolveSlot<BadgeSlot>({
      slot: "content",
      styles,
      slotProps,
      baseStyle: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    });

    return (
      <span {...rootSlot} ref={ref} {...rest}>
        <span {...contentSlot}>{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";