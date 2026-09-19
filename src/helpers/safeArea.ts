// src/helpers/safeArea.ts

import type React from "react";
import { cssSize } from "./css";

export type SafeAreaEdge =
  | "top"
  | "right"
  | "bottom"
  | "left";

export interface SafeAreaEdges {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}

export type SafeAreaValue =
  | boolean
  | SafeAreaEdges;

export type ResolvedSafeAreaEdges =
  Required<SafeAreaEdges>;

const SAFE_AREA_OFFSET_VARIABLES: Record<
  SafeAreaEdge,
  string
> = {
  top: "var(--ui-safe-top-offset)",
  right: "var(--ui-safe-right-offset)",
  bottom: "var(--ui-safe-bottom-offset)",
  left: "var(--ui-safe-left-offset)",
};

export function getSafeAreaOffset(
  edge: SafeAreaEdge
): string {
  return SAFE_AREA_OFFSET_VARIABLES[edge];
}

export function resolveSafeAreaEdges(
  safeArea: SafeAreaValue | undefined
): ResolvedSafeAreaEdges {
  if (!safeArea) {
    return {
      top: false,
      right: false,
      bottom: false,
      left: false,
    };
  }

  if (safeArea === true) {
    return {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }

  return {
    top: Boolean(safeArea.top),
    right: Boolean(safeArea.right),
    bottom: Boolean(safeArea.bottom),
    left: Boolean(safeArea.left),
  };
}

export function addSafeAreaOffset(
  value: number | string | undefined,
  edge: SafeAreaEdge,
  enabled: boolean
): string | undefined {
  const base = cssSize(value);

  if (!enabled) {
    return base;
  }

  const inset =
    getSafeAreaOffset(edge);

  if (!base) {
    return inset;
  }

  return `calc(${base} + ${inset})`;
}

export function maxSafeAreaOffset(
  minimum: number | string,
  edge: SafeAreaEdge
): string {
  return `max(${cssSize(minimum)}, ${getSafeAreaOffset(edge)})`;
}

export function getSafeAreaPadding(
  safeArea: SafeAreaValue | undefined,
  base?: number | string
): Pick<
  React.CSSProperties,
  | "paddingTop"
  | "paddingRight"
  | "paddingBottom"
  | "paddingLeft"
> {
  const edges =
    resolveSafeAreaEdges(
      safeArea
    );

  return {
    paddingTop:
      addSafeAreaOffset(
        base,
        "top",
        edges.top
      ),

    paddingRight:
      addSafeAreaOffset(
        base,
        "right",
        edges.right
      ),

    paddingBottom:
      addSafeAreaOffset(
        base,
        "bottom",
        edges.bottom
      ),

    paddingLeft:
      addSafeAreaOffset(
        base,
        "left",
        edges.left
      ),
  };
}
