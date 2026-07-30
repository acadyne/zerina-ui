import React from "react";

import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";

import {
  usePress,
  type UIPressEvent,
} from "../../core/interaction";

import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

import {
  useOptionalUIMotion,
} from "../../core/motion";

import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  getIconButtonActionRecipe,
} from "./action-control-recipe";

import {
  getActionControlStateAttributes,
} from "./action-control-state";

import type {
  ActionControlSize,
} from "./action-control-types";

export type IconButtonVariant =
  | "ghost"
  | "solid"
  | "unstyled";

export type IconButtonSize =
  ActionControlSize;

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
  icon:
    React.ReactNode;

  ariaLabel:
    string;

  variant?:
    IconButtonVariant;

  size?:
    IconButtonSize;

  onPress?: (
    event:
      UIPressEvent<HTMLElement>
  ) => void;

  className?:
    string;

  style?:
    React.CSSProperties;

  styles?:
    IconButtonStyles;

  slotProps?:
    IconButtonSlotProps;
}

export const IconButton =
  React.forwardRef<
    HTMLButtonElement,
    IconButtonProps
  >(
    (
      {
        icon,
        ariaLabel,

        variant =
          "ghost",

        size =
          "md",

        disabled =
          false,

        type =
          "button",

        className =
          "",

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

          nativeInteractive:
            true,

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

      const recipe =
        getIconButtonActionRecipe({
          size,
          variant,
        });

      const rootSlot =
        resolveSlot<IconButtonSlot>({
          slot:
            "root",

          styles,
          slotProps,
          className,
          style,

          baseProps: {
            "data-ui":
              "icon-button",

            "data-variant":
              variant,

            "data-color-scheme":
              "primary",

            "data-size":
              size,

            ...getActionControlStateAttributes(
              press.state,
              {
                disabled,
              }
            ),
          },

          baseStyle:
            recipe.root,
        });

      const iconSlot =
        resolveSlot<IconButtonSlot>({
          slot:
            "icon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,

            "data-ui":
              "icon-button-icon",
          },

          baseStyle:
            recipe.icon,
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

          aria-label={
            ariaLabel
          }

          disabled={
            disabled
          }

          animate={
            pressMotion
          }

          transition={
            motionState.getTransition(
              motionState.effectiveLevel,
              "press"
            )
          }
        >
          <span
            {...iconSlot}
          >
            {icon}
          </span>
        </motion.button>
      );
    }
  );

IconButton.displayName =
  "IconButton";
