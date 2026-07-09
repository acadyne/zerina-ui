// src/primitives/forms/Pressable.tsx
import React from "react";

export type PressableRenderState = {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
  disabled: boolean;
};

export type PressableChildren =
  | React.ReactNode
  | ((state: PressableRenderState) => React.ReactNode);

export type PressableTouchAction =
  | "auto"
  | "none"
  | "manipulation"
  | "pan-x"
  | "pan-y"
  | "pan-x pan-y";

export interface PressableProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onClick"> {
  as?: "button" | "div" | "span" | "a";

  children?: PressableChildren;

  disabled?: boolean;

  onPress?: (event: React.MouseEvent<HTMLElement>) => void;

  onLongPress?: (event: React.PointerEvent<HTMLElement>) => void;

  longPressDelay?: number;

  pressedScale?: number;

  pressEffect?: boolean;

  touchAction?: PressableTouchAction;

  disableButtonRole?: boolean;

  type?: "button" | "submit" | "reset";

  style?: React.CSSProperties;
}

const LONG_PRESS_DELAY = 450;

function isNativeInteractiveElement(as: PressableProps["as"]) {
  return as === "button" || as === "a";
}

function getPressTransform(options: {
  pressed: boolean;
  pressEffect: boolean;
  pressedScale: number;
  userTransform?: React.CSSProperties["transform"];
}): React.CSSProperties["transform"] {
  const { pressed, pressEffect, pressedScale, userTransform } = options;

  if (!pressed || !pressEffect) {
    return userTransform;
  }

  const pressTransform = `scale(${pressedScale})`;

  if (!userTransform) {
    return pressTransform;
  }

  return `${userTransform} ${pressTransform}`;
}

export const Pressable = React.forwardRef<HTMLElement, PressableProps>(
  (
    {
      as = "button",
      children,
      disabled = false,

      onPress,
      onLongPress,
      longPressDelay = LONG_PRESS_DELAY,

      pressedScale = 0.985,
      pressEffect = true,
      touchAction = "manipulation",
      disableButtonRole = false,
      type = "button",

      tabIndex,
      role,
      className = "",
      style,

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
    ref
  ) => {
    const Component = as;

    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const longPressTimerRef = React.useRef<number | null>(null);
    const longPressTriggeredRef = React.useRef(false);

    const clearLongPressTimer = React.useCallback(() => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }, []);

    const resetPressState = React.useCallback(() => {
      setPressed(false);
      clearLongPressTimer();
    }, [clearLongPressTimer]);

    React.useEffect(() => {
      return () => {
        clearLongPressTimer();
      };
    }, [clearLongPressTimer]);

    const state = React.useMemo<PressableRenderState>(
      () => ({
        pressed,
        hovered,
        focused,
        disabled,
      }),
      [pressed, hovered, focused, disabled]
    );

    const isNativeInteractive = isNativeInteractiveElement(as);

    const resolvedRole =
      role ??
      (!disableButtonRole && !isNativeInteractive ? "button" : undefined);

    const resolvedTabIndex =
      tabIndex ?? (!disabled && !isNativeInteractive ? 0 : undefined);

    const renderedChildren =
      typeof children === "function" ? children(state) : children;

    const resolvedStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 0,
      minHeight: 0,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.62 : undefined,
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
      touchAction,
      outline: "none",
      transition:
        "transform var(--ui-duration-fast) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard), background-color var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
      ...style,
      transform: getPressTransform({
        pressed,
        pressEffect,
        pressedScale,
        userTransform: style?.transform,
      }),
    };

    const elementProps: React.HTMLAttributes<HTMLElement> & {
      disabled?: boolean;
      type?: "button" | "submit" | "reset";
    } = {
      ...rest,
      className,
      role: resolvedRole,
      tabIndex: resolvedTabIndex,
      "aria-disabled": disabled || undefined,
      style: resolvedStyle,

      onPointerEnter: (event) => {
        if (!disabled) {
          setHovered(true);
        }

        onPointerEnter?.(event);
      },

      onPointerLeave: (event) => {
        setHovered(false);
        resetPressState();

        onPointerLeave?.(event);
      },

      onPointerDown: (event) => {
        if (!disabled) {
          setPressed(true);
          longPressTriggeredRef.current = false;

          if (onLongPress) {
            clearLongPressTimer();

            event.persist?.();

            longPressTimerRef.current = window.setTimeout(() => {
              longPressTriggeredRef.current = true;
              onLongPress(event);
            }, longPressDelay);
          }

          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            // Algunos browsers/elementos pueden no permitir pointer capture.
          }
        }

        onPointerDown?.(event);
      },

      onPointerUp: (event) => {
        resetPressState();

        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Puede fallar si el elemento no tenía capture activo.
        }

        onPointerUp?.(event);
      },

      onPointerCancel: (event) => {
        resetPressState();

        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Puede fallar si el elemento no tenía capture activo.
        }

        onPointerCancel?.(event);
      },

      onLostPointerCapture: (event) => {
        resetPressState();
        onLostPointerCapture?.(event);
      },

      onFocus: (event) => {
        if (!disabled) {
          setFocused(true);
          event.currentTarget.style.boxShadow =
            "0 0 0 3px var(--ui-focus-ring)";
        }

        onFocus?.(event);
      },

      onBlur: (event) => {
        setFocused(false);
        resetPressState();
        event.currentTarget.style.boxShadow = "none";

        onBlur?.(event);
      },

      onClick: (event) => {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (longPressTriggeredRef.current) {
          longPressTriggeredRef.current = false;
          return;
        }

        onPress?.(event);
      },

      onKeyDown: (event) => {
        if (!disabled && !isNativeInteractive) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setPressed(true);
          }
        }

        onKeyDown?.(event);
      },

      onKeyUp: (event) => {
        if (!disabled && !isNativeInteractive) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setPressed(false);

            onPress?.(event as unknown as React.MouseEvent<HTMLElement>);
          }
        }

        onKeyUp?.(event);
      },
    };

    if (as === "button") {
      elementProps.disabled = disabled;
      elementProps.type = type;
    }

    return (
      <Component ref={ref as any} {...(elementProps as any)}>
        {renderedChildren}
      </Component>
    );
  }
);

Pressable.displayName = "Pressable";