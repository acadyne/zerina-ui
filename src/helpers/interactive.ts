// src/helpers/interactive.ts

import React from "react";

export interface InteractiveStateOptions {
  disabled?: boolean;
  hoverBackground?: string;
  activeBackground?: string;
  baseBackground?: string;
  focusRing?: string;
  pressEffect?: boolean;
  hoverBorderColor?: string;
  restoreBorderColor?: string;
  activeBorderColor?: string;
  hoverBoxShadow?: string;
  restoreBoxShadow?: string;
  activeBoxShadow?: string;
  pressTransform?: string;
}

type InteractiveExternalHandlers<T extends HTMLElement> = Pick<
  React.HTMLAttributes<T>,
  | "onMouseEnter"
  | "onMouseLeave"
  | "onFocus"
  | "onBlur"
  | "onMouseDown"
  | "onMouseUp"
  | "onTouchStart"
  | "onTouchEnd"
  | "onTouchCancel"
>;

function setBackground(el: HTMLElement, value?: string) {
  if (value === undefined) return;
  el.style.background = value;
  el.style.backgroundColor = value;
}

function setBorderColor(el: HTMLElement, value?: string) {
  if (value === undefined) return;
  el.style.borderColor = value;
}

function setBoxShadow(el: HTMLElement, value?: string) {
  if (value === undefined) return;
  el.style.boxShadow = value;
}

function setTransform(el: HTMLElement, value?: string) {
  if (value === undefined) return;
  el.style.transform = value;
}

function applyPressedState(
  el: HTMLElement,
  options: {
    activeBackground?: string;
    activeBorderColor?: string;
    activeBoxShadow?: string;
    pressEffect?: boolean;
    pressTransform?: string;
  }
) {
  setBackground(el, options.activeBackground);
  setBorderColor(el, options.activeBorderColor);
  setBoxShadow(el, options.activeBoxShadow);

  if (options.pressEffect) {
    setTransform(el, options.pressTransform ?? "translateY(1px) scale(0.985)");
  }
}

function applyRestingState(
  el: HTMLElement,
  options: {
    baseBackground?: string;
    restoreBorderColor?: string;
    restoreBoxShadow?: string;
    pressEffect?: boolean;
  }
) {
  setBackground(el, options.baseBackground);
  setBorderColor(el, options.restoreBorderColor);

  if (options.restoreBoxShadow !== undefined) {
    setBoxShadow(el, options.restoreBoxShadow);
  } else {
    el.style.boxShadow = "none";
  }

  if (options.pressEffect) {
    setTransform(el, "translateY(0) scale(1)");
  }
}

export function getInteractiveHandlers<T extends HTMLElement>(
  options: InteractiveStateOptions,
  handlers?: InteractiveExternalHandlers<T>
) {
  const {
    disabled = false,
    hoverBackground,
    activeBackground,
    baseBackground,
    focusRing,
    pressEffect = false,
    hoverBorderColor,
    restoreBorderColor,
    activeBorderColor,
    hoverBoxShadow,
    restoreBoxShadow,
    activeBoxShadow,
    pressTransform,
  } = options;

  return {
    onMouseEnter: (e: React.MouseEvent<T>) => {
      if (!disabled) {
        setBackground(e.currentTarget, hoverBackground);
        setBorderColor(e.currentTarget, hoverBorderColor);
        setBoxShadow(e.currentTarget, hoverBoxShadow);
      }

      handlers?.onMouseEnter?.(e);
    },

    onMouseLeave: (e: React.MouseEvent<T>) => {
      applyRestingState(e.currentTarget, {
        baseBackground,
        restoreBorderColor,
        restoreBoxShadow,
        pressEffect,
      });

      handlers?.onMouseLeave?.(e);
    },

    onFocus: (e: React.FocusEvent<T>) => {
      setBoxShadow(e.currentTarget, focusRing);
      handlers?.onFocus?.(e);
    },

    onBlur: (e: React.FocusEvent<T>) => {
      if (restoreBoxShadow !== undefined) {
        setBoxShadow(e.currentTarget, restoreBoxShadow);
      } else {
        e.currentTarget.style.boxShadow = "none";
      }

      if (pressEffect) {
        setTransform(e.currentTarget, "translateY(0) scale(1)");
      }

      handlers?.onBlur?.(e);
    },

    onMouseDown: (e: React.MouseEvent<T>) => {
      if (!disabled) {
        applyPressedState(e.currentTarget, {
          activeBackground,
          activeBorderColor,
          activeBoxShadow,
          pressEffect,
          pressTransform,
        });
      }

      handlers?.onMouseDown?.(e);
    },

    onMouseUp: (e: React.MouseEvent<T>) => {
      if (!disabled) {
        setBackground(e.currentTarget, hoverBackground ?? baseBackground);
        setBorderColor(e.currentTarget, hoverBorderColor ?? restoreBorderColor);
        setBoxShadow(e.currentTarget, hoverBoxShadow ?? restoreBoxShadow);

        if (pressEffect) {
          setTransform(e.currentTarget, "translateY(0) scale(1)");
        }
      }

      handlers?.onMouseUp?.(e);
    },

    onTouchStart: (e: React.TouchEvent<T>) => {
      if (!disabled) {
        applyPressedState(e.currentTarget, {
          activeBackground,
          activeBorderColor,
          activeBoxShadow,
          pressEffect,
          pressTransform,
        });
      }

      handlers?.onTouchStart?.(e);
    },

    onTouchEnd: (e: React.TouchEvent<T>) => {
      if (!disabled) {
        applyRestingState(e.currentTarget, {
          baseBackground,
          restoreBorderColor,
          restoreBoxShadow,
          pressEffect,
        });
      }

      handlers?.onTouchEnd?.(e);
    },

    onTouchCancel: (e: React.TouchEvent<T>) => {
      if (!disabled) {
        applyRestingState(e.currentTarget, {
          baseBackground,
          restoreBorderColor,
          restoreBoxShadow,
          pressEffect,
        });
      }

      handlers?.onTouchCancel?.(e);
    },
  };
}

export const getInteractiveCardHandlers = getInteractiveHandlers;