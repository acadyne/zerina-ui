// src/primitives/forms/Pressable.tsx

import React from "react";
import {
  usePress,
  type UIPressEvent,
  type UIPressState,
} from "../../core/interaction";
import { composeEventHandlers } from "../../core/interaction/events/composeEventHandlers";
import { useOptionalUIMotion } from "../../core/motion";
import {
  resolveSlot,
  type SlotElementProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type PressableRenderState =
  UIPressState;

export type PressableChildren =
  | React.ReactNode
  | ((
      state: PressableRenderState
    ) => React.ReactNode);

export type PressableTouchAction =
  | "auto"
  | "none"
  | "manipulation"
  | "pan-x"
  | "pan-y"
  | "pan-x pan-y";

export type PressableSlot = "root";

export type PressableStyles =
  SlotStyleMap<PressableSlot>;

export type PressableSlotProps =
  SlotPropsMap<PressableSlot>;

export interface PressableProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "onClick"
  > {
  as?: "button" | "div" | "span" | "a";

  children?: PressableChildren;

  disabled?: boolean;

  onPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;

  onLongPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;

  longPressDelay?: number;

  /**
   * Controla únicamente si se aplica feedback
   * visual de presión.
   *
   * La intensidad procede del Motion System.
   */
  pressEffect?: boolean;

  touchAction?: PressableTouchAction;

  disableButtonRole?: boolean;

  type?: "button" | "submit" | "reset";

  className?: string;
  style?: React.CSSProperties;

  styles?: PressableStyles;
  slotProps?: PressableSlotProps;
}

function isNativeInteractiveElement({
  as,
  href,
}: {
  as: PressableProps["as"];
  href?: unknown;
}): boolean {
  if (as === "button") {
    return true;
  }

  return (
    as === "a" &&
    typeof href === "string" &&
    href.length > 0
  );
}

export const Pressable =
  React.forwardRef<
    HTMLElement,
    PressableProps
  >(
    (
      {
        as = "button",
        children,
        disabled = false,

        onPress,
        onLongPress,
        longPressDelay,

        pressEffect = true,
        touchAction = "manipulation",
        disableButtonRole = false,
        type = "button",

        tabIndex,
        role,
        className = "",
        style,

        styles,
        slotProps,

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

        ...rest
      },
      forwardedRef
    ) => {
      const Component = as;
      const motion = useOptionalUIMotion();

      const href =
        "href" in rest
          ? rest.href
          : undefined;

      const nativeInteractive =
        isNativeInteractiveElement({
          as,
          href,
        });

      const resolvedRole =
        role ??
        (
          !disableButtonRole &&
          !nativeInteractive
            ? "button"
            : undefined
        );

      const resolvedTabIndex =
        tabIndex ??
        (
          disabled
            ? -1
            : !nativeInteractive
              ? 0
              : undefined
        );

      const rootSlot =
        resolveSlot<PressableSlot>({
          slot: "root",
          styles,
          slotProps,
          className,
          style,

          baseProps: {
            role: resolvedRole,
            tabIndex: resolvedTabIndex,
            "aria-disabled":
              disabled || undefined,
            "data-ui-pressable": "",
          },

          baseStyle: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
            minHeight: 0,

            cursor: disabled
              ? "not-allowed"
              : "pointer",

            opacity: disabled
              ? "var(--ui-state-disabled-opacity, 0.62)"
              : undefined,

            userSelect: "none",
            WebkitTapHighlightColor:
              "transparent",

            touchAction,
            outline: "none",

            transition:
              "scale var(--ui-duration-fast) var(--ui-ease-standard), " +
              "translate var(--ui-duration-fast) var(--ui-ease-standard), " +
              "opacity var(--ui-duration-normal) var(--ui-ease-standard), " +
              "background var(--ui-duration-normal) var(--ui-ease-standard), " +
              "border-color var(--ui-duration-normal) var(--ui-ease-standard), " +
              "box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
          },
        });

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

        onFocus: slotOnFocus,
        onBlur: slotOnBlur,

        onKeyDown: slotOnKeyDown,
        onKeyUp: slotOnKeyUp,

        onClick: slotOnClick,

        ...rootSlotRest
      } = rootSlot as SlotElementProps;

      const press = usePress<HTMLElement>({
        disabled,
        nativeInteractive,

        onPress,
        onLongPress,
        longPressDelay,

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

        onClick: slotOnClick,
      });

      const pressMotion =
        pressEffect &&
        press.state.pressed
          ? motion.getPressMotion(
              motion.effectiveLevel
            )
          : undefined;

      const resolvedStyle:
        React.CSSProperties = {
        ...rootSlotRest.style,

        boxShadow:
          press.state.focusVisible
            ? "0 0 0 3px var(--ui-focus-ring)"
            : rootSlotRest.style
                ?.boxShadow,

        /*
         * scale y translate son propiedades
         * individuales. No sobrescriben transform,
         * por lo que placement y feedback no compiten.
         */
        scale:
          pressMotion?.scale !== undefined
            ? String(pressMotion.scale)
            : rootSlotRest.style?.scale,

        translate:
          pressMotion?.y !== undefined
            ? `0 ${pressMotion.y}px`
            : rootSlotRest.style
                ?.translate,
      };

      const renderedChildren =
        typeof children === "function"
          ? children(press.state)
          : children;

      const elementProps:
        SlotElementProps & {
          disabled?: boolean;
          type?:
            | "button"
            | "submit"
            | "reset";
        } = {
        ...rest,
        ...rootSlotRest,

        style: resolvedStyle,

        "data-ui-pressable-pressed":
          press.state.pressed ||
          undefined,

        "data-ui-pressable-hovered":
          press.state.hovered ||
          undefined,

        "data-ui-pressable-focused":
          press.state.focused ||
          undefined,

        "data-ui-pressable-focus-visible":
          press.state.focusVisible ||
          undefined,

        "data-ui-pressable-disabled":
          disabled || undefined,

        "data-ui-pressable-pointer":
          press.state.pointerType ??
          undefined,

        ...press.pressProps,
      };

      if (as === "button") {
        elementProps.disabled = disabled;
        elementProps.type = type;
      }

      return React.createElement(
        Component,
        {
          ...elementProps,
          ref: forwardedRef,
        },
        renderedChildren
      );
    }
  );

Pressable.displayName = "Pressable";