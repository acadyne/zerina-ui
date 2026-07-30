import React from "react";

import {
  usePress,
  type UIPressEvent,
  type UIPressState,
} from "../../core/interaction";

import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

import {
  useOptionalUIMotion,
} from "../../core/motion";

import {
  resolveSlot,
  type SlotElementProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  getActionControlStateAttributes,
} from "./action-control-state";

export type PressableRenderState =
  UIPressState;

export type PressableChildren =
  | React.ReactNode
  | ((
      state:
        PressableRenderState
    ) => React.ReactNode);

export type PressableTouchAction =
  | "auto"
  | "none"
  | "manipulation"
  | "pan-x"
  | "pan-y"
  | "pan-x pan-y";

export type PressableSlot =
  "root";

export type PressableStyles =
  SlotStyleMap<PressableSlot>;

export type PressableSlotProps =
  SlotPropsMap<PressableSlot>;

export type PressableElement =
  | "button"
  | "div"
  | "span"
  | "a";

type PressableElementInstance<
  TAs extends PressableElement,
> =
  React.ComponentRef<TAs> extends
    HTMLElement
      ? React.ComponentRef<TAs>
      : HTMLElement;

interface PressableOwnProps<
  TElement extends HTMLElement =
    HTMLElement,
> {
  children?:
    PressableChildren;

  disabled?:
    boolean;

  onPress?: (
    event:
      UIPressEvent<TElement>
  ) => void;

  onLongPress?: (
    event:
      UIPressEvent<TElement>
  ) => void;

  longPressDelay?:
    number;

  pressEffect?:
    boolean;

  touchAction?:
    PressableTouchAction;

  styles?:
    PressableStyles;

  slotProps?:
    PressableSlotProps;
}

export type PressableProps<
  TAs extends PressableElement =
    "button",
> =
  PressableOwnProps<
    PressableElementInstance<TAs>
  > & {
    as?:
      TAs;
  } & Omit<
    React.ComponentPropsWithoutRef<TAs>,
    | keyof PressableOwnProps
    | "as"
    | "children"
    | "disabled"
    | "onClick"
  >;

type PressableImplementationProps =
  PressableOwnProps<HTMLElement> &
  Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" |
    "onClick"
  > & {
    as?:
      PressableElement;

    href?:
      string;

    target?:
      React.HTMLAttributeAnchorTarget;

    rel?:
      string;

    download?:
      boolean |
      string;

    type?:
      | "button"
      | "submit"
      | "reset";
  };

export interface PressableComponent {
  <
    TAs extends PressableElement =
      "button",
  >(
    props:
      PressableProps<TAs> &
      React.RefAttributes<
        React.ComponentRef<TAs>
      >
  ):
    React.ReactElement |
    null;

  displayName?:
    string;
}

function isNativeInteractiveElement({
  as,
  href,
}: {
  as:
    PressableElement;

  href?:
    unknown;
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

const PressableImpl = (
  {
    as =
      "button",

    children,

    disabled =
      false,

    onPress,
    onLongPress,
    longPressDelay,

    pressEffect =
      true,

    touchAction =
      "manipulation",

    type =
      "button",

    tabIndex,
    role,

    className =
      "",

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
  }:
    PressableImplementationProps,

  forwardedRef:
    React.ForwardedRef<HTMLElement>
) => {
  const Component =
    as;

  const motion =
    useOptionalUIMotion();

  const href =
    rest.href;

  const nativeInteractive =
    isNativeInteractiveElement({
      as,
      href,
    });

  const resolvedRole =
    role ??
    (
      !nativeInteractive
        ? "button"
        : undefined
    );

  const resolvedTabIndex =
    disabled
      ? -1
      : tabIndex ??
        (
          !nativeInteractive
            ? 0
            : undefined
        );

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
    usePress<HTMLElement>({
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

      onClick:
        slotOnClick,
    });

  const pressMotion =
    pressEffect &&
    press.state.pressed
      ? motion.getPressMotion(
          motion.effectiveLevel
        )
      : undefined;

  const rootSlot =
    resolveSlot<PressableSlot>({
      slot:
        "root",

      styles,
      slotProps,
      className,
      style,

      baseProps: {
        role:
          resolvedRole,

        tabIndex:
          resolvedTabIndex,

        "aria-disabled":
          disabled ||
          undefined,

        "data-ui":
          "pressable",

        ...getActionControlStateAttributes(
          press.state,
          {
            disabled,
          }
        ),
      },

      baseStyle: {
        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        minWidth:
          0,

        minHeight:
          0,

        userSelect:
          "none",

        WebkitTapHighlightColor:
          "transparent",

        touchAction,

        scale:
          pressMotion?.scale !==
          undefined
            ? String(
                pressMotion.scale
              )
            : undefined,

        translate:
          pressMotion?.y !==
          undefined
            ? `0 ${pressMotion.y}px`
            : undefined,
      },
    });

  const renderedChildren =
    typeof children ===
    "function"
      ? children(
          press.state
        )
      : children;

  const elementProps:
    SlotElementProps & {
      disabled?:
        boolean;

      type?:
        | "button"
        | "submit"
        | "reset";
    } = {
      ...rest,
      ...rootSlot,
      ...press.pressProps,
  };

  if (as === "button") {
    elementProps.disabled =
      disabled;

    elementProps.type =
      type;
  }

  return React.createElement(
    Component,
    {
      ...elementProps,
      ref:
        forwardedRef,
    },
    renderedChildren
  );
};

export const Pressable =
  React.forwardRef(
    PressableImpl
  ) as PressableComponent;

Pressable.displayName =
  "Pressable";
