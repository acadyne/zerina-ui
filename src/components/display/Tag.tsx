// src/components/display/Tag.tsx
import React from "react";

type TagVariant = "solid" | "subtle" | "outline";
type TagScheme =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  variant?: TagVariant;
  colorScheme?: TagScheme;
  rounded?: React.CSSProperties["borderRadius"];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRemove?: () => void;
  removable?: boolean;
  style?: React.CSSProperties;
}

const schemeMap: Record<
  TagScheme,
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

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      variant = "subtle",
      colorScheme = "neutral",
      rounded = "var(--ui-radius-full)",
      leftIcon,
      rightIcon,
      onRemove,
      removable = false,
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

    const showRemove = removable || !!onRemove;

    return (
      <span
        ref={ref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.35rem",
          minHeight: 28,
          maxWidth: "100%",
          padding: "0.28rem 0.7rem",
          fontSize: "0.78rem",
          fontWeight: 600,
          lineHeight: 1,
          whiteSpace: "nowrap",
          borderRadius: rounded,
          letterSpacing: "0.01em",
          ...variantStyle,
          ...style,
        }}
        {...rest}
      >
        {leftIcon ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {leftIcon}
          </span>
        ) : null}

        <span
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {children}
        </span>

        {rightIcon ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {rightIcon}
          </span>
        ) : null}

        {showRemove ? (
          <button
            type="button"
            aria-label="Quitar"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            style={{
              marginLeft: "0.1rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              borderRadius: 9999,
              border: "none",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
              opacity: 0.85,
              flexShrink: 0,
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--ui-surface-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--ui-focus-ring)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ×
          </button>
        ) : null}
      </span>
    );
  }
);

Tag.displayName = "Tag";