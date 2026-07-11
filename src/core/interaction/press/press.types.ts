// src/core/interaction/press/press.types.ts

import type React from "react";

export type UIPointerType =
  | "mouse"
  | "touch"
  | "pen"
  | "keyboard"
  | null;

export interface UIPressState {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
  focusVisible: boolean;
  disabled: boolean;
  pointerType: UIPointerType;
}

export interface UsePressOptions<
  TElement extends HTMLElement,
> {
  disabled?: boolean;

  /**
   * true para button y anchor interactivo.
   * false para div/span con role="button".
   */
  nativeInteractive?: boolean;

  onPress?: React.MouseEventHandler<TElement>;
  onLongPress?: React.PointerEventHandler<TElement>;

  longPressDelay?: number;

  onPointerEnter?: React.PointerEventHandler<TElement>;
  onPointerLeave?: React.PointerEventHandler<TElement>;
  onPointerDown?: React.PointerEventHandler<TElement>;
  onPointerUp?: React.PointerEventHandler<TElement>;
  onPointerCancel?: React.PointerEventHandler<TElement>;
  onLostPointerCapture?: React.PointerEventHandler<TElement>;

  onFocus?: React.FocusEventHandler<TElement>;
  onBlur?: React.FocusEventHandler<TElement>;

  onKeyDown?: React.KeyboardEventHandler<TElement>;
  onKeyUp?: React.KeyboardEventHandler<TElement>;

  onClick?: React.MouseEventHandler<TElement>;
}

export interface UsePressResult<
  TElement extends HTMLElement,
> {
  state: UIPressState;

  pressProps: Pick<
    React.HTMLAttributes<TElement>,
    | "onPointerEnter"
    | "onPointerLeave"
    | "onPointerDown"
    | "onPointerUp"
    | "onPointerCancel"
    | "onLostPointerCapture"
    | "onFocus"
    | "onBlur"
    | "onKeyDown"
    | "onKeyUp"
    | "onClick"
  >;
}