import React from "react";

import {
  markTriggerPressTarget,
} from "../../core/interaction/trigger";

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
  getSpinnerTransition,
  getSpinnerVariants,
  shouldAnimateSpinner,
  useOptionalUIMotion,
} from "../../core/motion";

import {
  type SizeProps,
  type SpaceProps,
  getSizeStyles,
  getSpacingStyles,
} from "../../helpers";

import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  getButtonActionRecipe,
} from "./action-control-recipe";

import {
  getActionControlStateAttributes,
} from "./action-control-state";

import type {
  ActionControlColorScheme,
  ActionControlSize,
  ActionControlVariant,
} from "./action-control-types";

export type ButtonSize =
  ActionControlSize;

export type ButtonVariant =
  ActionControlVariant;

export type ButtonColorScheme =
  ActionControlColorScheme;

export type ButtonSlot =
  | "root"
  | "spinner"
  | "content"
  | "leftIcon"
  | "rightIcon";

export type ButtonStyles =
  SlotStyleMap<ButtonSlot>;

export type ButtonSlotProps =
  SlotPropsMap<ButtonSlot>;

export interface ButtonProps
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
  >,
  SizeProps,
  SpaceProps {
  children?:
    React.ReactNode;

  colorScheme?:
    ButtonColorScheme;

  variant?:
    ButtonVariant;

  size?:
    ButtonSize;

  isLoading?:
    boolean;

  loadingText?:
    React.ReactNode;

  fullWidth?:
    boolean;

  leftIcon?:
    React.ReactNode;

  rightIcon?:
    React.ReactNode;

  onPress?: (
    event:
      UIPressEvent<HTMLElement>
  ) => void;

  style?:
    React.CSSProperties;

  styles?:
    ButtonStyles;

  slotProps?:
    ButtonSlotProps;
}

export const Button =
  React.forwardRef<
    HTMLButtonElement,
    ButtonProps
  >(
    (
      {
        children,

        colorScheme =
          "primary",

        variant =
          "solid",

        size =
          "md",

        isLoading =
          false,

        loadingText =
          "Cargando...",

        disabled =
          false,

        type =
          "button",

        className =
          "",

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

        fullWidth =
          false,

        leftIcon,
        rightIcon,

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

      const isDisabled =
        disabled ||
        isLoading;

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
          disabled:
            isDisabled,

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

      const spinnerAnimated =
        shouldAnimateSpinner(
          motionState.effectiveLevel
        );

      const recipe =
        getButtonActionRecipe({
          size,
          variant,
          colorScheme,
        });

      const rootSlot =
        resolveSlot<ButtonSlot>({
          slot:
            "root",

          styles,
          slotProps,
          className,
          style,

          baseProps: {
            "data-ui":
              "button",

            "data-variant":
              variant,

            "data-color-scheme":
              colorScheme,

            "data-size":
              size,

            ...getActionControlStateAttributes(
              press.state,
              {
                disabled:
                  isDisabled,

                loading:
                  isLoading,
              }
            ),
          },

          baseStyle: {
            ...recipe.root,

            ...getSizeStyles({
              w,
              h,
              minW,
              maxW,

              minH:
                minH ??
                recipe.metrics
                  .minHeight,

              maxH,
            }),

            ...getSpacingStyles({
              p,

              px:
                px ??
                recipe.metrics
                  .paddingInline,

              py:
                py ??
                recipe.metrics
                  .paddingBlock,

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

            width:
              fullWidth
                ? "100%"
                : w,

            minWidth:
              fullWidth
                ? 0
                : minW,
          },
        });

      const spinnerSlot =
        resolveSlot<ButtonSlot>({
          slot:
            "spinner",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,

            "data-ui":
              "button-spinner",

            "data-animated":
              spinnerAnimated ||
              undefined,
          },

          baseStyle:
            recipe.spinner,
        });

      const contentSlot =
        resolveSlot<ButtonSlot>({
          slot:
            "content",

          styles,
          slotProps,

          baseProps: {
            "data-ui":
              "button-content",
          },

          baseStyle:
            recipe.content,
        });

      const leftIconSlot =
        resolveSlot<ButtonSlot>({
          slot:
            "leftIcon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,

            "data-ui":
              "button-left-icon",
          },

          baseStyle:
            recipe.leftIcon,
        });

      const rightIconSlot =
        resolveSlot<ButtonSlot>({
          slot:
            "rightIcon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,

            "data-ui":
              "button-right-icon",
          },

          baseStyle:
            recipe.rightIcon,
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

          disabled={
            isDisabled
          }

          aria-busy={
            isLoading ||
            undefined
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
          {isLoading ? (
            <>
              <motion.span
                {...toMotionSlotProps(
                  spinnerSlot
                )}

                variants={
                  getSpinnerVariants(
                    motionState.effectiveLevel
                  )
                }

                initial="initial"

                animate="animate"

                transition={
                  getSpinnerTransition(
                    motionState.effectiveLevel
                  )
                }
              />

              <span
                {...contentSlot}
              >
                {loadingText}
              </span>
            </>
          ) : (
            <>
              {leftIcon ? (
                <span
                  {...leftIconSlot}
                >
                  {leftIcon}
                </span>
              ) : null}

              <span
                {...contentSlot}
              >
                {children}
              </span>

              {rightIcon ? (
                <span
                  {...rightIconSlot}
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

Button.displayName =
  "Button";

markTriggerPressTarget(
  Button
);
