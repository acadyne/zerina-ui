// src/patterns/scaffold/adaptive-scaffold/adaptiveScaffold.utils.tsx

import React from "react";

import type {
  AdaptiveScaffoldRenderContext,
} from "./adaptiveScaffold.types";





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