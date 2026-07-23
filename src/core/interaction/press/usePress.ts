// src/core/interaction/press/usePress.ts

import React from "react";
import { composeEventHandlers } from "../events/composeEventHandlers";
import { useFocusVisible } from "../focus";
import type {
  UIPressEvent,
  UIPressNativeEvent,
  UIPressPointerType,
  UsePressOptions,
  UsePressResult,
} from "./press.types";

const DEFAULT_LONG_PRESS_DELAY = 450;

function normalizePointerType(
  pointerType: string
): Exclude<UIPressPointerType, "keyboard"> {
  if (pointerType === "touch") {
    return "touch";
  }

  if (pointerType === "pen") {
    return "pen";
  }

  return "mouse";
}

function createPressEvent<TElement extends HTMLElement>(
  nativeEvent: UIPressNativeEvent<TElement>,
  pointerType: UIPressPointerType
): UIPressEvent<TElement> {
  const target = nativeEvent.target;
  const currentTarget = nativeEvent.currentTarget;

  return {
    pointerType,
    target,
    currentTarget,
    nativeEvent,

    get defaultPrevented() {
      return nativeEvent.defaultPrevented;
    },

    preventDefault() {
      nativeEvent.preventDefault();
    },

    stopPropagation() {
      nativeEvent.stopPropagation();
    },
  };
}

function releasePointerCapture<TElement extends HTMLElement>(
  event: React.PointerEvent<TElement>
): void {
  try {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  } catch {
    // El pointer puede haberse liberado previamente.
  }
}

export function usePress<TElement extends HTMLElement>({
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
    React.useState<UIPressPointerType | null>(null);

  const lastPointerTypeRef =
    React.useRef<Exclude<UIPressPointerType, "keyboard"> | null>(null);

  const keyboardActivationRef = React.useRef(false);
  const longPressTriggeredRef = React.useRef(false);

  const pointerPressActiveRef =
    React.useRef(false);

  const pressCancelledRef =
    React.useRef(false);
  const longPressTimerRef =
    React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPressTimer = React.useCallback((): void => {
    if (longPressTimerRef.current === null) {
      return;
    }

    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }, []);

  const resetPress = React.useCallback((): void => {
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
    setPointerType(null);

    keyboardActivationRef.current = false;
    longPressTriggeredRef.current = false;
    pointerPressActiveRef.current = false;
    pressCancelledRef.current = false;

    clearLongPressTimer();
  }, [clearLongPressTimer, disabled]);

  const focus = useFocusVisible<TElement>({
    disabled,
    onFocus,

    onBlur: (event) => {
      resetPress();
      keyboardActivationRef.current = false;
      onBlur?.(event);
    },
  });

  const internalPointerEnter = React.useCallback(
    (event: React.PointerEvent<TElement>): void => {
      if (disabled) {
        return;
      }

      const nextPointerType = normalizePointerType(event.pointerType);

      lastPointerTypeRef.current = nextPointerType;
      setPointerType(nextPointerType);

      if (nextPointerType === "mouse") {
        setHovered(true);
      }
    },
    [disabled]
  );

  const internalPointerLeave = React.useCallback((): void => {
    setHovered(false);

    if (pointerPressActiveRef.current) {
      pressCancelledRef.current = true;
      pointerPressActiveRef.current = false;
    }

    resetPress();
  }, [resetPress]);

  const internalPointerDown = React.useCallback(
    (event: React.PointerEvent<TElement>): void => {
      if (disabled) {
        return;
      }

      const nextPointerType = normalizePointerType(event.pointerType);

      if (nextPointerType === "mouse" && event.button !== 0) {
        return;
      }

      lastPointerTypeRef.current = nextPointerType;
      keyboardActivationRef.current = false;
      longPressTriggeredRef.current = false;
      pointerPressActiveRef.current = true;
      pressCancelledRef.current = false;

      setPointerType(nextPointerType);
      setPressed(true);

      if (onLongPress) {
        clearLongPressTimer();

        const pressEvent = createPressEvent(event, nextPointerType);

        longPressTimerRef.current = setTimeout(() => {
          longPressTimerRef.current = null;
          longPressTriggeredRef.current = true;

          onLongPress(pressEvent);
        }, Math.max(0, longPressDelay));
      }

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // No todos los elementos permiten pointer capture.
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
    (event: React.PointerEvent<TElement>): void => {
      pointerPressActiveRef.current = false;

      resetPress();
      releasePointerCapture(event);
    },
    [resetPress]
  );

  const internalPointerCancel = React.useCallback(
    (event: React.PointerEvent<TElement>): void => {
      pointerPressActiveRef.current = false;
      pressCancelledRef.current = true;
      longPressTriggeredRef.current = false;

      resetPress();
      releasePointerCapture(event);
    },
    [resetPress]
  );

  const internalLostPointerCapture = React.useCallback((): void => {
    if (pointerPressActiveRef.current) {
      pressCancelledRef.current = true;
    }

    pointerPressActiveRef.current = false;

    resetPress();
  }, [resetPress]);

  const internalClick = React.useCallback(
    (event: React.MouseEvent<TElement>): void => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (pressCancelledRef.current) {
        pressCancelledRef.current = false;
        event.preventDefault();
        return;
      }

      if (longPressTriggeredRef.current) {
        longPressTriggeredRef.current = false;
        event.preventDefault();
        return;
      }

      const nextPointerType: UIPressPointerType =
        keyboardActivationRef.current || event.detail === 0
          ? "keyboard"
          : lastPointerTypeRef.current ?? "mouse";

      keyboardActivationRef.current = false;

      setPointerType(nextPointerType);
      setPressed(false);

      onPress?.(createPressEvent(event, nextPointerType));
    },
    [disabled, onPress]
  );

  const internalKeyDown = React.useCallback(
    (event: React.KeyboardEvent<TElement>): void => {
      if (
        disabled ||
        event.repeat ||
        (event.key !== "Enter" && event.key !== " ")
      ) {
        return;
      }

      pressCancelledRef.current = false;
      pointerPressActiveRef.current = false;
      keyboardActivationRef.current = true;

      setPointerType("keyboard");
      setPressed(true);

      if (nativeInteractive) {
        return;
      }

      event.preventDefault();

      if (event.key === "Enter") {
        onPress?.(createPressEvent(event, "keyboard"));
        setPressed(false);
        keyboardActivationRef.current = false;
      }
    },
    [disabled, nativeInteractive, onPress]
  );

  const internalKeyUp = React.useCallback(
    (event: React.KeyboardEvent<TElement>): void => {
      if (
        disabled ||
        (event.key !== "Enter" && event.key !== " ")
      ) {
        return;
      }

      setPressed(false);

      if (nativeInteractive) {
        return;
      }

      event.preventDefault();

      if (event.key === " ") {
        onPress?.(createPressEvent(event, "keyboard"));
      }

      keyboardActivationRef.current = false;
    },
    [disabled, nativeInteractive, onPress]
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
