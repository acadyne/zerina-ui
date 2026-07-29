import React, {
  forwardRef,
} from "react";

import {
  usePress,
  type UIPressEvent,
} from "../../core/interaction";

import {
  dataAttr,
} from "../../helpers";

import {
  useInputGroupContext,
  useInputGroupDescendantState,
} from "./input-group-context";


export type ControlActionSize =
  | "sm"
  | "md";


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
          inputGroupContext?.disabled
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

          style={style}

          data-ui="control-action"

          data-size={size}

          data-in-group={
            dataAttr(
              Boolean(
                descendantContext
              )
            )
          }

          data-hovered={
            dataAttr(
              press.state.hovered
            )
          }

          data-pressed={
            dataAttr(
              press.state.pressed
            )
          }

          data-focused={
            dataAttr(
              press.state.focused
            )
          }

          data-focus-visible={
            dataAttr(
              press.state
                .focusVisible
            )
          }

          data-disabled={
            dataAttr(
              resolvedDisabled
            )
          }
        >
          {children}
        </button>
      );
    }
  );


ControlAction.displayName =
  "ControlAction";
