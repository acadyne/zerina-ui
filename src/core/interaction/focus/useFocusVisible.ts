// src/core/interaction/focus/useFocusVisible.ts

import React from "react";

export interface UseFocusVisibleOptions<
  TElement extends HTMLElement,
> {
  disabled?: boolean;

  onFocus?: React.FocusEventHandler<TElement>;
  onBlur?: React.FocusEventHandler<TElement>;
}

export interface UseFocusVisibleResult<
  TElement extends HTMLElement,
> {
  focused: boolean;
  focusVisible: boolean;

  focusProps: Pick<
    React.HTMLAttributes<TElement>,
    "onFocus" | "onBlur"
  >;
}

function matchesFocusVisible(element: HTMLElement): boolean {
  try {
    return element.matches(":focus-visible");
  } catch {
    return true;
  }
}

export function useFocusVisible<
  TElement extends HTMLElement,
>({
  disabled = false,
  onFocus,
  onBlur,
}: UseFocusVisibleOptions<TElement> = {}): UseFocusVisibleResult<TElement> {
  const [focused, setFocused] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<TElement>) => {
      onFocus?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      setFocused(true);
      setFocusVisible(matchesFocusVisible(event.currentTarget));
    },
    [disabled, onFocus]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<TElement>) => {
      onBlur?.(event);

      setFocused(false);
      setFocusVisible(false);
    },
    [onBlur]
  );

  return {
    focused,
    focusVisible,

    focusProps: {
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}