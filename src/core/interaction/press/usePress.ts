// src/core/interaction/press/usePress.ts

import React from "react";
import { composeEventHandlers } from "../events";
import { useFocusVisible } from "../focus";
import type {
  UIPointerType,
  UsePressOptions,
  UsePressResult,
} from "./press.types";

const DEFAULT_LONG_PRESS_DELAY = 450;

export function usePress<
  TElement extends HTMLElement,
>({
  disabled = false,
  nativeInteractive = false,

  onPress,
  onLongPress,
  longPressDelay = DEFAULT_LONG_PRESS_DELAY,

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
}: UsePressOptions<TElement>): UsePressResult<TElement> {
  const [pressed, setPressed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [pointerType, setPointerType] =
    React.useState<UIPointerType>(null);

  const longPressTimerRef =
    React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const longPressTriggeredRef = React.useRef(false);

  const clearLongPressTimer = React.useCallback(() => {
    if (longPressTimerRef.current === null) {
      return;
    }

    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }, []);

  const resetPress = React.useCallback(() => {
    setPressed(false);
    clearLongPressTimer();
  }, [clearLongPressTimer]);

  React.useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, [clearLongPressTimer]);

  React.useEffect(() => {
    if (!disabled) {
      return;
    }

    setPressed(false);
    setHovered(false);
    clearLongPressTimer();
  }, [clearLongPressTimer, disabled]);

  const focus = useFocusVisible<TElement>({
    disabled,
    onFocus,
    onBlur: (event) => {
      resetPress();
      onBlur?.(event);
    },
  });

  const internalPointerEnter = React.useCallback(
    (event: React.PointerEvent<TElement>) => {
      if (disabled) {
        return;
      }

      setPointerType(event.pointerType as UIPointerType);

      if (event.pointerType === "mouse") {
        setHovered(true);
      }
    },
    [disabled]
  );

  const internalPointerLeave = React.useCallback(() => {
    setHovered(false);
    resetPress();
  }, [resetPress]);

  const internalPointerDown = React.useCallback(
    (event: React.PointerEvent<TElement>) => {
      if (disabled) {
        return;
      }

      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      setPointerType(event.pointerType as UIPointerType);
      setPressed(true);

      longPressTriggeredRef.current = false;

      if (onLongPress) {
        clearLongPressTimer();

        longPressTimerRef.current = setTimeout(() => {
          longPressTimerRef.current = null;
          longPressTriggeredRef.current = true;
          onLongPress(event);
        }, Math.max(0, longPressDelay));
      }

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture no está disponible en todos los elementos.
      }
    },
    [
      clearLongPressTimer,
      disabled,
      longPressDelay,
      onLongPress,
    ]
  );

  const internalPointerUp = React.useCallback(
    (event: React.PointerEvent<TElement>) => {
      resetPress();

      try {
        if (
          event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
          event.currentTarget.releasePointerCapture(
            event.pointerId
          );
        }
      } catch {
        // El pointer pudo haberse liberado previamente.
      }
    },
    [resetPress]
  );

  const internalPointerCancel = React.useCallback(
    (event: React.PointerEvent<TElement>) => {
      resetPress();

      try {
        if (
          event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
          event.currentTarget.releasePointerCapture(
            event.pointerId
          );
        }
      } catch {
        // El pointer pudo haberse liberado previamente.
      }
    },
    [resetPress]
  );

  const internalLostPointerCapture =
    React.useCallback(() => {
      resetPress();
    }, [resetPress]);

  const internalClick = React.useCallback(
    (event: React.MouseEvent<TElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (longPressTriggeredRef.current) {
        longPressTriggeredRef.current = false;
        event.preventDefault();
        return;
      }

      /*
       * Los clicks generados por teclado suelen tener detail === 0.
       * Esto evita convertir KeyboardEvent artificialmente a MouseEvent.
       */
      if (event.detail === 0) {
        setPointerType("keyboard");
      }

      onPress?.(event);
    },
    [disabled, onPress]
  );

  const internalKeyDown = React.useCallback(
    (event: React.KeyboardEvent<TElement>) => {
      if (disabled || nativeInteractive) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        setPointerType("keyboard");
        setPressed(true);

        /*
         * Dispatch real de click.
         * React entregará un MouseEvent válido a onClick/onPress.
         */
        event.currentTarget.click();

        setPressed(false);
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        setPointerType("keyboard");
        setPressed(true);
      }
    },
    [disabled, nativeInteractive]
  );

  const internalKeyUp = React.useCallback(
    (event: React.KeyboardEvent<TElement>) => {
      if (disabled || nativeInteractive) {
        return;
      }

      if (event.key !== " ") {
        return;
      }

      event.preventDefault();
      setPressed(false);
      event.currentTarget.click();
    },
    [disabled, nativeInteractive]
  );

  return {
    state: {
      pressed,
      hovered,
      focused: focus.focused,
      focusVisible: focus.focusVisible,
      disabled,
      pointerType,
    },

    pressProps: {
      onPointerEnter: composeEventHandlers(
        onPointerEnter,
        internalPointerEnter
      ),

      onPointerLeave: composeEventHandlers(
        onPointerLeave,
        internalPointerLeave,
        {
          checkDefaultPrevented: false,
        }
      ),

      onPointerDown: composeEventHandlers(
        onPointerDown,
        internalPointerDown
      ),

      onPointerUp: composeEventHandlers(
        onPointerUp,
        internalPointerUp,
        {
          checkDefaultPrevented: false,
        }
      ),

      onPointerCancel: composeEventHandlers(
        onPointerCancel,
        internalPointerCancel,
        {
          checkDefaultPrevented: false,
        }
      ),

      onLostPointerCapture: composeEventHandlers(
        onLostPointerCapture,
        internalLostPointerCapture,
        {
          checkDefaultPrevented: false,
        }
      ),

      onFocus: focus.focusProps.onFocus,
      onBlur: focus.focusProps.onBlur,

      onKeyDown: composeEventHandlers(
        onKeyDown,
        internalKeyDown
      ),

      onKeyUp: composeEventHandlers(
        onKeyUp,
        internalKeyUp
      ),

      onClick: composeEventHandlers(
        onClick,
        internalClick
      ),
    },
  };
}