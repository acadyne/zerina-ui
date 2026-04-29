// src/primitives/forms/Button.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  type SizeProps,
  type SpaceProps,
  getSizeStyles,
  getSpacingStyles,
} from "../../helpers";
import { useOptionalUIMotion } from "../../core/motion";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "solid" | "outline" | "ghost";

export interface ButtonProps
  extends Omit<
      HTMLMotionProps<"button">,
      "children" | "color" | "ref" | "size" | "style"
    >,
    SizeProps,
    SpaceProps {
  children?: React.ReactNode;

  colorScheme?: "primary" | "secondary" | "danger";
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: React.ReactNode;

  rounded?: React.CSSProperties["borderRadius"];
  fullWidth?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  style?: React.CSSProperties;
}

const sizeStyles: Record<
  ButtonSize,
  {
    minHeight: React.CSSProperties["minHeight"];
    fontSize: React.CSSProperties["fontSize"];
    paddingY: string;
    paddingX: string;
    borderRadius: React.CSSProperties["borderRadius"];
  }
> = {
  sm: {
    minHeight: "var(--ui-control-h-sm)",
    fontSize: "var(--ui-font-size-sm)",
    paddingY: "0.45rem",
    paddingX: "0.8rem",
    borderRadius: "var(--ui-radius-sm)",
  },
  md: {
    minHeight: "var(--ui-control-h-md)",
    fontSize: "var(--ui-font-size-md)",
    paddingY: "0.6rem",
    paddingX: "0.95rem",
    borderRadius: "var(--ui-radius-md)",
  },
  lg: {
    minHeight: "var(--ui-control-h-lg)",
    fontSize: "var(--ui-font-size-lg)",
    paddingY: "0.75rem",
    paddingX: "1.1rem",
    borderRadius: "var(--ui-radius-lg)",
  },
};

const schemeMap = {
  primary: {
    solidBg: "var(--ui-primary)",
    solidHover: "var(--ui-primary-hover)",
    solidText: "var(--ui-primary-contrast)",

    outlineText: "var(--ui-primary)",
    outlineBorder: "color-mix(in srgb, var(--ui-primary) 42%, var(--ui-border))",
    outlineHover: "color-mix(in srgb, var(--ui-primary) 10%, transparent)",

    ghostText: "var(--ui-primary)",
    ghostHover: "color-mix(in srgb, var(--ui-primary) 10%, transparent)",
  },
  secondary: {
    solidBg: "var(--ui-secondary)",
    solidHover: "var(--ui-secondary-hover)",
    solidText: "var(--ui-secondary-contrast)",

    outlineText: "var(--ui-secondary)",
    outlineBorder: "color-mix(in srgb, var(--ui-secondary) 42%, var(--ui-border))",
    outlineHover: "color-mix(in srgb, var(--ui-secondary) 10%, transparent)",

    ghostText: "var(--ui-secondary)",
    ghostHover: "color-mix(in srgb, var(--ui-secondary) 10%, transparent)",
  },
  danger: {
    solidBg: "var(--ui-danger)",
    solidHover: "var(--ui-danger-hover)",
    solidText: "var(--ui-danger-contrast)",

    outlineText: "var(--ui-danger)",
    outlineBorder: "color-mix(in srgb, var(--ui-danger) 42%, var(--ui-border))",
    outlineHover: "color-mix(in srgb, var(--ui-danger) 10%, transparent)",

    ghostText: "var(--ui-danger)",
    ghostHover: "color-mix(in srgb, var(--ui-danger) 10%, transparent)",
  },
} as const;

function getVariantStyles(
  colorScheme: NonNullable<ButtonProps["colorScheme"]>,
  variant: ButtonVariant
): {
  backgroundColor: string;
  color: string;
  border: string;
  hoverBackground: string;
  activeBackground: string;
  shadow: string;
  hoverShadow: string;
} {
  const s = schemeMap[colorScheme];

  if (variant === "outline") {
    return {
      backgroundColor: "transparent",
      color: s.outlineText,
      border: `1px solid ${s.outlineBorder}`,
      hoverBackground: s.outlineHover,
      activeBackground: s.outlineHover,
      shadow: "none",
      hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.10)",
    };
  }

  if (variant === "ghost") {
    return {
      backgroundColor: "transparent",
      color: s.ghostText,
      border: "1px solid transparent",
      hoverBackground: s.ghostHover,
      activeBackground: s.ghostHover,
      shadow: "none",
      hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    };
  }

  return {
    backgroundColor: s.solidBg,
    color: s.solidText,
    border: "1px solid transparent",
    hoverBackground: s.solidHover,
    activeBackground: s.solidHover,
    shadow: "0 6px 14px rgba(0, 0, 0, 0.14)",
    hoverShadow: "0 8px 18px rgba(0, 0, 0, 0.18)",
  };
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      colorScheme = "primary",
      variant = "solid",
      size = "md",
      isLoading = false,
      loadingText = "Cargando...",
      disabled = false,
      type = "button",
      className = "",
      style,

      w,
      h,
      minW,
      maxW,
      minH,
      maxH,

      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,

      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,

      rounded,
      fullWidth = false,

      leftIcon,
      rightIcon,

      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();
    const isDisabled = disabled || isLoading;
    const sizeStyle = sizeStyles[size];
    const variantStyle = getVariantStyles(colorScheme, variant);
    const pressMotion = motionState.getPressMotion(motionState.effectiveLevel);

    const spinnerColor =
      variant === "solid" ? "rgba(255,255,255,0.78)" : "currentColor";

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={className}
        aria-busy={isLoading || undefined}
        whileTap={!isDisabled && pressMotion ? pressMotion : undefined}
        transition={motionState.getTransition(
          motionState.effectiveLevel,
          "press"
        )}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.55rem",
          lineHeight: 1.1,
          fontWeight: 700,
          letterSpacing: "0.2px",
          touchAction: "manipulation",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          whiteSpace: "nowrap",
          verticalAlign: "middle",
          opacity: isDisabled ? 0.62 : 1,
          cursor: isDisabled ? "not-allowed" : "pointer",
          outline: "none",
          boxShadow: variantStyle.shadow,
          transition:
            "background-color var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), color var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",

          ...getSizeStyles({
            w,
            h,
            minW,
            maxW,
            minH: minH ?? sizeStyle.minHeight,
            maxH,
          }),

          ...getSpacingStyles({
            p,
            px: px ?? sizeStyle.paddingX,
            py: py ?? sizeStyle.paddingY,
            pt,
            pb,
            pl,
            pr,
            m,
            mx,
            my,
            mt,
            mb,
            ml,
            mr,
          }),

          width: fullWidth ? "100%" : w,
          minWidth: fullWidth ? 0 : minW,

          fontSize: sizeStyle.fontSize,
          borderRadius: rounded ?? sizeStyle.borderRadius,
          backgroundColor: variantStyle.backgroundColor,
          color: variantStyle.color,
          border: variantStyle.border,

          ...style,
        }}
        onMouseEnter={(event) => {
          if (!isDisabled) {
            event.currentTarget.style.backgroundColor =
              variantStyle.hoverBackground;
            event.currentTarget.style.boxShadow = variantStyle.hoverShadow;
          }

          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor =
            variantStyle.backgroundColor;
          event.currentTarget.style.boxShadow = variantStyle.shadow;
          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          event.currentTarget.style.boxShadow = `0 0 0 3px var(--ui-focus-ring), ${variantStyle.shadow}`;
          onFocus?.(event);
        }}
        onBlur={(event) => {
          event.currentTarget.style.boxShadow = variantStyle.shadow;
          onBlur?.(event);
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        {...rest}
      >
        {isLoading ? (
          <>
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                borderRadius: "9999px",
                border: `2px solid ${spinnerColor}`,
                borderTopColor: "transparent",
                animation: "ui-spin 0.8s linear infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
                opacity: 0.95,
              }}
            >
              {loadingText}
            </span>
          </>
        ) : (
          <>
            {leftIcon ? (
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                {leftIcon}
              </span>
            ) : null}

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
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
                  lineHeight: 1,
                }}
              >
                {rightIcon}
              </span>
            ) : null}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";