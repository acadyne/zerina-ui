// src/core/interaction/press/press.types.ts

import type React from "react";

export type UIPressPointerType =
  | "mouse"
  | "touch"
  | "pen"
  | "keyboard";

export type UIPressNativeEvent<
  TElement extends HTMLElement,
> =
  | React.PointerEvent<TElement>
  | React.KeyboardEvent<TElement>
  | React.MouseEvent<TElement>;

export interface UIPressEvent<
  TElement extends HTMLElement = HTMLElement,
> {
  pointerType: UIPressPointerType;

  target: EventTarget;
  currentTarget: TElement;

  nativeEvent: UIPressNativeEvent<TElement>;

  readonly defaultPrevented: boolean;

  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface UIPressState {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
  focusVisible: boolean;
  disabled: boolean;

  pointerType: UIPressPointerType | null;
}

export interface UsePressOptions<
  TElement extends HTMLElement,
> {
  disabled?: boolean;

  /**
   * Elementos con activación nativa por teclado:
   * button y links con href.
   */
  nativeInteractive?: boolean;

  onPress?: (
    event: UIPressEvent<TElement>
  ) => void;

  onLongPress?: (
    event: UIPressEvent<TElement>
  ) => void;

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