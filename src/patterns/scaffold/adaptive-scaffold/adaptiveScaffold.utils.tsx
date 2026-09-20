// src/patterns/scaffold/adaptive-scaffold/adaptiveScaffold.utils.tsx

import React from "react";

import type {
  AdaptiveScaffoldDesktopPresentation,
  AdaptiveScaffoldNavigation,
  AdaptiveScaffoldRenderContext,
  AdaptiveScaffoldResolvedMode,
  AdaptiveScaffoldTabletPresentation,
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


export type ResolvedAdaptiveNavigationPresentation =
  | "bottom"
  | "rail"
  | "sidebar"
  | "none";


export type ResolvedAdaptiveNavigationPlacement =
  | "top"
  | "bottom"
  | "start"
  | "end";


export interface ResolvedAdaptiveNavigation {
  presentation:
    ResolvedAdaptiveNavigationPresentation;

  placement:
    ResolvedAdaptiveNavigationPlacement;

  content?:
    React.ReactNode;
}


function getTabletDefaultPlacement(
  presentation:
    AdaptiveScaffoldTabletPresentation,
): ResolvedAdaptiveNavigationPlacement {
  return presentation ===
    "bottom"
    ? "bottom"
    : "start";
}


function getDesktopDefaultPlacement(
  _presentation:
    AdaptiveScaffoldDesktopPresentation,
): ResolvedAdaptiveNavigationPlacement {
  return "start";
}


export function resolveAdaptiveNavigation<
  TMeta = unknown
>({
  mode,
  navigation,
}: {
  mode:
    AdaptiveScaffoldResolvedMode;

  navigation?:
    AdaptiveScaffoldNavigation<TMeta>;
}): ResolvedAdaptiveNavigation {
  if (mode === "mobile") {
    const config =
      navigation?.mobile;

    return {
      presentation:
        config?.presentation ??
        "bottom",

      placement:
        config?.placement ??
        "bottom",

      content:
        config?.content,
    };
  }

  if (mode === "tablet") {
    const config =
      navigation?.tablet;

    const presentation =
      config?.presentation ??
      "rail";

    return {
      presentation,

      placement:
        config?.placement ??
        getTabletDefaultPlacement(
          presentation,
        ),

      content:
        config?.content,
    };
  }

  const config =
    navigation?.desktop;

  const presentation =
    config?.presentation ??
    "sidebar";

  return {
    presentation,

    placement:
      config?.placement ??
      getDesktopDefaultPlacement(
        presentation,
      ),

    content:
      config?.content,
  };
}
