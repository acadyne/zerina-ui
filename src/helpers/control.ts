// src/helpers/control.ts

import React from "react";
import { dataAttr } from "./dom";

export type ControlSize = "sm" | "md" | "lg";

export type ControlVariant =
  | "outline"
  | "unstyled";

export type ControlVisualState = {
  invalid?: boolean;
  disabled?: boolean;
  focused?: boolean;
};

export type ControlSizeStyles = {
  minHeight: React.CSSProperties["minHeight"];
  fontSize: React.CSSProperties["fontSize"];
  borderRadius: React.CSSProperties["borderRadius"];

  paddingX: React.CSSProperties["paddingLeft"];
  paddingY: React.CSSProperties["paddingTop"];
  paddingTop: React.CSSProperties["paddingTop"];
  paddingBottom: React.CSSProperties["paddingBottom"];
  paddingLeft: React.CSSProperties["paddingLeft"];
  paddingRight: React.CSSProperties["paddingRight"];
};

export const CONTROL_SIZE_STYLES: Record<
  ControlSize,
  ControlSizeStyles
> = {
  sm: {
    minHeight: "var(--ui-control-h-sm)",
    fontSize: "var(--ui-font-size-sm)",
    borderRadius: "var(--ui-radius-sm)",

    paddingX: "0.75rem",
    paddingY: "0.45rem",
    paddingTop: "0.45rem",
    paddingBottom: "0.45rem",
    paddingLeft: "0.75rem",
    paddingRight: "0.75rem",
  },

  md: {
    minHeight: "var(--ui-control-h-md)",
    fontSize: "var(--ui-font-size-md)",
    borderRadius: "var(--ui-radius-md)",

    paddingX: "0.9rem",
    paddingY: "0.6rem",
    paddingTop: "0.6rem",
    paddingBottom: "0.6rem",
    paddingLeft: "0.9rem",
    paddingRight: "0.9rem",
  },

  lg: {
    minHeight: "var(--ui-control-h-lg)",
    fontSize: "var(--ui-font-size-lg)",
    borderRadius: "var(--ui-radius-lg)",

    paddingX: "1rem",
    paddingY: "0.75rem",
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
};

export function getControlSizeStyles(
  size: ControlSize
): ControlSizeStyles {
  return CONTROL_SIZE_STYLES[size];
}

export function getControlVariantStyles(
  variant: ControlVariant,
  sizeStyle: ControlSizeStyles,
  state: ControlVisualState = {}
): React.CSSProperties {
  const { invalid = false } = state;

  if (variant === "unstyled") {
    return {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      borderRadius: 0,
    };
  }

  return {
    background: "var(--ui-surface)",
    border: `1px solid ${
      invalid
        ? "var(--ui-danger)"
        : "var(--ui-border)"
    }`,
    borderRadius: sizeStyle.borderRadius,
    boxShadow: "none",
  };
}

export function getControlBaseStyles(
  size: ControlSize,
  variant: ControlVariant,
  state: ControlVisualState = {}
): React.CSSProperties {
  const sizeStyle =
    getControlSizeStyles(size);

  const {
    disabled = false,
  } = state;

  return {
    boxSizing: "border-box",
    outline: "none",
    minWidth: 0,
    color: "var(--ui-text)",
    minHeight: sizeStyle.minHeight,
    fontSize: sizeStyle.fontSize,

    paddingTop: sizeStyle.paddingTop,
    paddingBottom: sizeStyle.paddingBottom,
    paddingLeft: sizeStyle.paddingLeft,
    paddingRight: sizeStyle.paddingRight,

    opacity: disabled
      ? "var(--ui-state-disabled-opacity, 0.65)"
      : 1,

    cursor: disabled
      ? "not-allowed"
      : "text",

    transition:
      "border-color var(--ui-duration-normal) var(--ui-ease-standard), " +
      "box-shadow var(--ui-duration-normal) var(--ui-ease-standard), " +
      "background var(--ui-duration-normal) var(--ui-ease-standard), " +
      "opacity var(--ui-duration-normal) var(--ui-ease-standard), " +
      "color var(--ui-duration-normal) var(--ui-ease-standard)",

    ...getControlVariantStyles(
      variant,
      sizeStyle,
      state
    ),
  };
}

export function getControlDataAttributes(
  state: ControlVisualState = {}
) {
  return {
    "data-focus": dataAttr(state.focused),
    "data-invalid": dataAttr(state.invalid),
    "data-disabled": dataAttr(state.disabled),
  } as const;
}