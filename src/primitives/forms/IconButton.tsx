// src/primitives/forms/IconButton.tsx
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { usePress, type UIPressEvent } from "../../core/interaction";
import { composeEventHandlers } from "../../core/interaction/events/composeEventHandlers";
import { useOptionalUIMotion } from "../../core/motion";
import {
  defineSlotRecipe,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

type IconButtonVariant =
  | "ghost"
  | "solid"
  | "unstyled";

type IconButtonSize =
  | "sm"
  | "md"
  | "lg"
  | number;

type IconButtonRounded =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "full"
  | string;

export type IconButtonSlot =
  | "root"
  | "icon";

export type IconButtonStyles =
  SlotStyleMap<IconButtonSlot>;

export type IconButtonSlotProps =
  SlotPropsMap<IconButtonSlot>;

export interface IconButtonProps
  extends Omit<
    HTMLMotionProps<"button">,
    | "children"
    | "color"
    | "onClick"
    | "ref"
    | "size"
    | "style"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
    | "custom"
    | "whileTap"
    | "whileHover"
    | "whileFocus"
    | "whileDrag"
    | "whileInView"
  > {
  icon: React.ReactNode;
  ariaLabel: string;

  variant?: IconButtonVariant;
  size?: IconButtonSize;
  rounded?: IconButtonRounded;

  onPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;

  className?: string;
  style?: React.CSSProperties;

  styles?: IconButtonStyles;
  slotProps?: IconButtonSlotProps;
}

const sizeMap: Record<
  Exclude<IconButtonSize, number>,
  number
> = {
  sm: 34,
  md: 42,
  lg: 50,
};

const radiusMap: Record<
  "none" | "sm" | "md" | "lg" | "full",
  string
> = {
  none: "0px",
  sm: "var(--ui-radius-sm)",
  md: "var(--ui-radius-md)",
  lg: "var(--ui-radius-lg)",
  full: "var(--ui-radius-full)",
};

const variantMap: Record<
  IconButtonVariant,
  {
    background: string;
    color: string;
    hoverBackground: string;
    activeBackground: string;
    border: string;
  }
> = {
  ghost: {
    background: "transparent",
    color: "var(--ui-text)",
    hoverBackground:
      "var(--ui-surface-hover)",
    activeBackground:
      "var(--ui-surface-hover)",
    border:
      "1px solid var(--ui-border)",
  },

  solid: {
    background: "var(--ui-primary)",
    color: "var(--ui-primary-contrast)",
    hoverBackground:
      "var(--ui-primary-hover)",
    activeBackground:
      "var(--ui-primary-hover)",
    border:
      "1px solid transparent",
  },

  unstyled: {
    background: "transparent",
    color: "inherit",
    hoverBackground: "transparent",
    activeBackground: "transparent",
    border:
      "1px solid transparent",
  },
};

function resolveIconButtonSize(
  size: IconButtonSize
): number {
  return typeof size === "number"
    ? size
    : sizeMap[size];
}

function resolveIconButtonRadius(
  rounded: IconButtonRounded
): React.CSSProperties["borderRadius"] {
  if (
    rounded === "none" ||
    rounded === "sm" ||
    rounded === "md" ||
    rounded === "lg" ||
    rounded === "full"
  ) {
    return radiusMap[rounded];
  }

  return rounded;
}

type IconButtonRecipeVariants = {
  variant: IconButtonVariant;
};

type IconButtonRecipeState = {
  size: IconButtonSize;
  rounded: IconButtonRounded;
  hovered: boolean;
  pressed: boolean;
  focusVisible: boolean;
  disabled: boolean;
};

const iconButtonRecipe = defineSlotRecipe<
  IconButtonSlot,
  IconButtonRecipeVariants,
  IconButtonRecipeState
>({
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",

      outline: "none",

      touchAction: "manipulation",
      WebkitTapHighlightColor:
        "transparent",

      padding: 0,
      flexShrink: 0,

      transition:
        "background var(--ui-duration-normal) var(--ui-ease-standard), " +
        "border-color var(--ui-duration-normal) var(--ui-ease-standard), " +
        "color var(--ui-duration-normal) var(--ui-ease-standard), " +
        "opacity var(--ui-duration-normal) var(--ui-ease-standard), " +
        "box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
    },

    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",

      lineHeight: 1,
      flexShrink: 0,
    },
  },

  resolve: ({
    variant,
    size,
    rounded,
    hovered,
    pressed,
    focusVisible,
    disabled,
  }) => {
    const resolvedSize =
      resolveIconButtonSize(size);

    const variantStyles =
      variantMap[variant];

    return {
      root: {
        width: resolvedSize,
        height: resolvedSize,
        minWidth: resolvedSize,
        minHeight: resolvedSize,

        borderRadius:
          resolveIconButtonRadius(
            rounded
          ),

        background:
          pressed && !disabled
            ? variantStyles.activeBackground
            : hovered && !disabled
              ? variantStyles.hoverBackground
              : variantStyles.background,

        color:
          variantStyles.color,

        border:
          variantStyles.border,

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled
          ? "var(--ui-state-disabled-opacity)"
          : 1,

        boxShadow: focusVisible
          ? "0 0 0 3px var(--ui-focus-ring)"
          : "none",
      },
    };
  },
});

export const IconButton =
  React.forwardRef<
    HTMLButtonElement,
    IconButtonProps
  >(
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

        onPointerEnter,
        onPointerLeave,
        onPointerDown,
        onPointerUp,
        onPointerCancel,
        onLostPointerCapture,

        onFocus,
        onBlur,

        onKeyDown,
        onKeyUp,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const motionState =
        useOptionalUIMotion();

      const rootSlotProps =
        slotProps?.root;

      const {
        onPointerEnter:
          slotOnPointerEnter,

        onPointerLeave:
          slotOnPointerLeave,

        onPointerDown:
          slotOnPointerDown,

        onPointerUp:
          slotOnPointerUp,

        onPointerCancel:
          slotOnPointerCancel,

        onLostPointerCapture:
          slotOnLostPointerCapture,

        onFocus:
          slotOnFocus,

        onBlur:
          slotOnBlur,

        onKeyDown:
          slotOnKeyDown,

        onKeyUp:
          slotOnKeyUp,

        onClick:
          slotOnClick,
      } = rootSlotProps ?? {};

      const press =
        usePress<HTMLButtonElement>({
          disabled,
          nativeInteractive: true,
          onPress,

          onPointerEnter:
            composeEventHandlers(
              onPointerEnter,
              slotOnPointerEnter
            ),

          onPointerLeave:
            composeEventHandlers(
              onPointerLeave,
              slotOnPointerLeave,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onPointerDown:
            composeEventHandlers(
              onPointerDown,
              slotOnPointerDown
            ),

          onPointerUp:
            composeEventHandlers(
              onPointerUp,
              slotOnPointerUp,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onPointerCancel:
            composeEventHandlers(
              onPointerCancel,
              slotOnPointerCancel,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onLostPointerCapture:
            composeEventHandlers(
              onLostPointerCapture,
              slotOnLostPointerCapture,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onFocus:
            composeEventHandlers(
              onFocus,
              slotOnFocus
            ),

          onBlur:
            composeEventHandlers(
              onBlur,
              slotOnBlur,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onKeyDown:
            composeEventHandlers(
              onKeyDown,
              slotOnKeyDown
            ),

          onKeyUp:
            composeEventHandlers(
              onKeyUp,
              slotOnKeyUp
            ),

          onClick:
            slotOnClick,
        });

      const pressMotion =
        press.state.pressed
          ? motionState.getPressMotion(
              motionState.effectiveLevel
            )
          : undefined;

      const recipeStyles =
        iconButtonRecipe({
          variant,
          size,
          rounded,

          hovered:
            press.state.hovered,

          pressed:
            press.state.pressed,

          focusVisible:
            press.state.focusVisible,

          disabled,
        });

      const rootSlot =
        resolveSlot<IconButtonSlot>({
          slot: "root",
          styles,
          slotProps,
          className,
          style,

          baseProps: {
            "data-ui-icon-button":
              "",

            "data-ui-icon-button-variant":
              variant,

            "data-ui-icon-button-size":
              typeof size === "number"
                ? size
                : size,

            "data-disabled":
              disabled ||
              undefined,

            "data-hovered":
              press.state.hovered ||
              undefined,

            "data-pressed":
              press.state.pressed ||
              undefined,

            "data-focused":
              press.state.focused ||
              undefined,

            "data-focus-visible":
              press.state.focusVisible ||
              undefined,
          },

          baseStyle:
            recipeStyles.root,
        });

      const iconSlot =
        resolveSlot<IconButtonSlot>({
          slot: "icon",
          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,
          },

          baseStyle:
            recipeStyles.icon,
        });

      return (
        <motion.button
          {...rest}
          {...toMotionSlotProps(
            rootSlot
          )}
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
          <span {...iconSlot}>
            {icon}
          </span>
        </motion.button>
      );
    }
  );

IconButton.displayName =
  "IconButton";