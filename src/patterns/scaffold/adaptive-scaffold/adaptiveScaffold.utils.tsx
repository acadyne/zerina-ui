import React from "react";

import {
  resolveUIViewportKind,
  type UIViewportBreakpoints,
  type UIViewportKind,
  type UIViewportMode,
} from "../../../core/viewport";

import type {
  AdaptiveScaffoldRenderContext,
} from "./adaptiveScaffold.types";

import type {
  NavigationNode,
} from "../../navigation";


export function cssSize(
  value: number | string
): string {
  return typeof value === "number"
    ? `${value}px`
    : value;
}

export function resolveAdaptiveScaffoldMode({
  mode,
  width,
  fallbackKind,
  breakpoints,
}: {
  mode: UIViewportMode;
  width: number;
  fallbackKind: UIViewportKind;
  breakpoints: UIViewportBreakpoints;
}): UIViewportKind {
  return resolveUIViewportKind({
    mode,
    width,
    breakpoints,
    fallbackKind,
  });
}


export function resolveAdaptiveValue<
  TMeta = unknown
>(
  value:
    | React.ReactNode
    | ((
      context: AdaptiveScaffoldRenderContext<TMeta>
    ) => React.ReactNode)
    | undefined,

  context: AdaptiveScaffoldRenderContext<TMeta>
): React.ReactNode {

  if (typeof value === "function") {
    return value(context);
  }

  return value;
}