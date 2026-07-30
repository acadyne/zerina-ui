import React, {
  forwardRef,
} from "react";

import {
  usePress,
  type UIPressEvent,
} from "../../core/interaction";

import {
  useInputGroupContext,
  useInputGroupDescendantState,
} from "./input-group-context";

import {
  getActionControlStateAttributes,
} from "./action-control-state";

import type {
  ActionControlSize,
} from "./action-control-types";

export type ControlActionSize =
  Extract<
    ActionControlSize,
    "sm" |
    "md"
  >;

export interface ControlActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?:
    ControlActionSize;

  onPress?: (
    event:
      UIPressEvent<HTMLButtonElement>
  ) => void;
}

export const ControlAction =
  forwardRef<
    HTMLButtonElement,
    ControlActionProps
  >(
    (
      {
        children,

        className,
        style,

        size =
          "md",

        type =
          "button",

        disabled =
          false,

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

        onClick,

        ...rest
      },
      ref
    ) => {
      const inputGroupContext =
        useInputGroupContext();

      const resolvedDisabled =
        disabled ||
        Boolean(
          inputGroupContext
            ?.disabled
        );

      const press =
        usePress<HTMLButtonElement>({
          disabled:
            resolvedDisabled,

          nativeInteractive:
            true,

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

          onClick,
        });

      const descendantContext =
        useInputGroupDescendantState({
          focused:
            press.state.focused,

          focusVisible:
            press.state
              .focusVisible,
        });

      return (
        <button
          {...rest}
          {...press.pressProps}

          ref={ref}

          type={type}

          disabled={
            resolvedDisabled
          }

          className={
            className
          }

          style={
            style
          }

          data-ui="control-action"

          data-size={
            size
          }

          data-in-group={
            descendantContext
              ? ""
              : undefined
          }

          {...getActionControlStateAttributes(
            press.state,
            {
              disabled:
                resolvedDisabled,
            }
          )}
        >
          {children}
        </button>
      );
    }
  );

ControlAction.displayName =
  "ControlAction";
