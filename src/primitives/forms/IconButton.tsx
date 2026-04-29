// src/primitives/forms/IconButton.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useOptionalUIMotion } from "../../core/motion";

export interface IconButtonProps
  extends Omit<
    HTMLMotionProps<"button">,
    "children" | "color" | "ref" | "size" | "style"
  > {
  icon: React.ReactNode;
  ariaLabel: string;

  variant?: "ghost" | "solid" | "unstyled";
  size?: "sm" | "md" | "lg" | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full" | string;

  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<string, number> = {
  sm: 34,
  md: 42,
  lg: 50,
};

const radiusMap: Record<string, string> = {
  none: "0px",
  sm: "var(--ui-radius-sm)",
  md: "var(--ui-radius-md)",
  lg: "var(--ui-radius-lg)",
  full: "var(--ui-radius-full)",
};

const variantMap = {
  ghost: {
    bg: "transparent",
    fg: "var(--ui-text)",
    hover: "var(--ui-surface-hover)",
    active: "var(--ui-surface-hover)",
    border: "1px solid var(--ui-border)",
  },
  solid: {
    bg: "var(--ui-primary)",
    fg: "var(--ui-primary-contrast)",
    hover: "var(--ui-primary-hover)",
    active: "var(--ui-primary-hover)",
    border: "1px solid transparent",
  },
  unstyled: {
    bg: "transparent",
    fg: "inherit",
    hover: "transparent",
    active: "transparent",
    border: "1px solid transparent",
  },
} as const;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      ariaLabel,
      variant = "ghost",
      size = "md",
      rounded = "full",
      disabled = false,
      type = "button",
      className = "",
      style,

      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,

      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();
    const pressMotion = motionState.getPressMotion(motionState.effectiveLevel);

    const pxSize = typeof size === "number" ? size : sizeMap[size] ?? 42;
    const borderRadius = radiusMap[rounded] || rounded;
    const v = variantMap[variant];

    return (
      <motion.button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        className={className}
        whileTap={!disabled && pressMotion ? pressMotion : undefined}
        transition={motionState.getTransition(
          motionState.effectiveLevel,
          "press"
        )}
        style={{
          width: pxSize,
          height: pxSize,
          minWidth: pxSize,
          minHeight: pxSize,
          borderRadius,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: v.bg,
          color: v.fg,
          border: v.border,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          transition:
            "background-color var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), color var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
          outline: "none",
          boxShadow: "none",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          padding: 0,
          flexShrink: 0,
          ...style,
        }}
        onMouseEnter={(event) => {
          if (!disabled) {
            event.currentTarget.style.background = v.hover;
          }

          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = v.bg;
          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          event.currentTarget.style.boxShadow = "0 0 0 3px var(--ui-focus-ring)";
          onFocus?.(event);
        }}
        onBlur={(event) => {
          event.currentTarget.style.boxShadow = "none";
          onBlur?.(event);
        }}
        {...rest}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";