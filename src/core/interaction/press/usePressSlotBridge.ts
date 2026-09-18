import type React from "react";

import {
  composeEventHandlers,
} from "../events/composeEventHandlers";

import {
  usePress,
} from "./usePress";

import type {
  UIPressEvent,
  UsePressResult,
} from "./press.types";


export type PressSlotEventHandlers<
  TElement extends HTMLElement,
> = Pick<
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


export interface UsePressSlotBridgeOptions<
  TElement extends HTMLElement,
> {
  disabled?:
    boolean;

  nativeInteractive?:
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

  publicHandlers?:
    PressSlotEventHandlers<TElement>;

  slotHandlers?:
    PressSlotEventHandlers<TElement>;
}


/**
 * Adapta handlers públicos + root slot al owner canónico `usePress`.
 *
 * Eventos activos:
 *
 * public prop -> root slot -> usePress internal
 *
 * `preventDefault()` detiene toda capa posterior.
 *
 * Eventos de cleanup:
 *
 * pointerleave / pointerup / pointercancel /
 * lostpointercapture / blur
 *
 * ejecutan public + slot aunque una capa anterior haga preventDefault(),
 * y `usePress` conserva la misma excepción para su cleanup interno.
 */
export function usePressSlotBridge<
  TElement extends HTMLElement,
>({
  disabled,
  nativeInteractive,

  onPress,
  onLongPress,
  longPressDelay,

  publicHandlers,
  slotHandlers,
}: UsePressSlotBridgeOptions<TElement>):
  UsePressResult<TElement> {
  return usePress<TElement>({
    disabled,
    nativeInteractive,

    onPress,
    onLongPress,
    longPressDelay,

    onPointerEnter:
      composeEventHandlers(
        publicHandlers
          ?.onPointerEnter,
        slotHandlers
          ?.onPointerEnter,
      ),

    onPointerLeave:
      composeEventHandlers(
        publicHandlers
          ?.onPointerLeave,
        slotHandlers
          ?.onPointerLeave,
        {
          checkDefaultPrevented:
            false,
        },
      ),

    onPointerDown:
      composeEventHandlers(
        publicHandlers
          ?.onPointerDown,
        slotHandlers
          ?.onPointerDown,
      ),

    onPointerUp:
      composeEventHandlers(
        publicHandlers
          ?.onPointerUp,
        slotHandlers
          ?.onPointerUp,
        {
          checkDefaultPrevented:
            false,
        },
      ),

    onPointerCancel:
      composeEventHandlers(
        publicHandlers
          ?.onPointerCancel,
        slotHandlers
          ?.onPointerCancel,
        {
          checkDefaultPrevented:
            false,
        },
      ),

    onLostPointerCapture:
      composeEventHandlers(
        publicHandlers
          ?.onLostPointerCapture,
        slotHandlers
          ?.onLostPointerCapture,
        {
          checkDefaultPrevented:
            false,
        },
      ),

    onFocus:
      composeEventHandlers(
        publicHandlers
          ?.onFocus,
        slotHandlers
          ?.onFocus,
      ),

    onBlur:
      composeEventHandlers(
        publicHandlers
          ?.onBlur,
        slotHandlers
          ?.onBlur,
        {
          checkDefaultPrevented:
            false,
        },
      ),

    onKeyDown:
      composeEventHandlers(
        publicHandlers
          ?.onKeyDown,
        slotHandlers
          ?.onKeyDown,
      ),

    onKeyUp:
      composeEventHandlers(
        publicHandlers
          ?.onKeyUp,
        slotHandlers
          ?.onKeyUp,
      ),

    onClick:
      slotHandlers
        ?.onClick,
  });
}
