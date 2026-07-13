// src/primitives/forms/IconButton.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  usePress,
  type UIPressEvent,
} from "../../core/interaction";
import { useOptionalUIMotion } from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type IconButtonSlot = "root" | "icon";

export type IconButtonStyles = SlotStyleMap<IconButtonSlot>;

export type IconButtonSlotProps = SlotPropsMap<IconButtonSlot>;

export interface IconButtonProps
  extends Omit<
    HTMLMotionProps<"button">,
    | "children"
    | "color"
    | "onClick"
    | "ref"
    | "size"
    | "style"
    | "whileTap"
  > {
  icon: React.ReactNode;
  ariaLabel: string;

  variant?: "ghost" | "solid" | "unstyled";
  size?: "sm" | "md" | "lg" | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full" | string;

  onPress?: (event: UIPressEvent<HTMLElement>) => void;

  className?: string;
  style?: React.CSSProperties;

  styles?: IconButtonStyles;
  slotProps?: IconButtonSlotProps;
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

      onPress,

      styles,
      slotProps,

      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();

    const press = usePress<HTMLButtonElement>({
      disabled,
      nativeInteractive: true,
      onPress,
    });

    const pressMotion = press.state.pressed
      ? motionState.getPressMotion(motionState.effectiveLevel)
      : undefined;

    const pxSize = typeof size === "number" ? size : sizeMap[size] ?? 42;
    const borderRadius = radiusMap[rounded] || rounded;
    const variantStyles = variantMap[variant];

    const rootSlot = resolveSlot<IconButtonSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-icon-button": "",
        "data-ui-icon-button-variant": variant,
        "data-disabled": disabled || undefined,
        "data-hovered": press.state.hovered || undefined,
        "data-pressed": press.state.pressed || undefined,
        "data-focused": press.state.focused || undefined,
        "data-focus-visible": press.state.focusVisible || undefined,
      },
      baseStyle: {
        width: pxSize,
        height: pxSize,
        minWidth: pxSize,
        minHeight: pxSize,
        borderRadius,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        background:
          press.state.pressed && !disabled
            ? variantStyles.active
            : press.state.hovered && !disabled
              ? variantStyles.hover
              : variantStyles.bg,

        color: variantStyles.fg,
        border: variantStyles.border,

        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,

        transition:
          "background var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), color var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",

        outline: "none",

        boxShadow: press.state.focusVisible
          ? "0 0 0 3px var(--ui-focus-ring)"
          : "none",

        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        padding: 0,
        flexShrink: 0,
      },
    });

    const iconSlot = resolveSlot<IconButtonSlot>({
      slot: "icon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        flexShrink: 0,
      },
    });

    return (
      <motion.button
        {...rest}
        {...toMotionSlotProps(rootSlot)}
        {...press.pressProps}
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        animate={pressMotion}
        transition={motionState.getTransition(
          motionState.effectiveLevel,
          "press"
        )}
      >
        <span {...iconSlot}>{icon}</span>
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";