// src/patterns/scaffold/adaptive-scaffold/adaptiveScaffold.utils.tsx
import React from "react";
import type {
  UIViewportBreakpoints,
  UIViewportKind,
  UIViewportMode,
} from "../../../core/viewport";
import type { NavigationItemDef } from "../../../primitives/navigation/NavigationList";
import type {
  AdaptiveScaffoldItem,
  AdaptiveScaffoldRenderContext,
} from "./adaptiveScaffold.types";

export function cssSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export function isAdaptiveScaffoldItemSelectable(
  item: AdaptiveScaffoldItem
): boolean {
  if (item.disabled) return false;
  if (item.selectable !== undefined) return item.selectable;

  return !item.items?.length;
}

export function flattenAdaptiveScaffoldItems(
  items: AdaptiveScaffoldItem[]
): AdaptiveScaffoldItem[] {
  return items.flatMap((item) => [
    item,
    ...flattenAdaptiveScaffoldItems(item.items ?? []),
  ]);
}

export function findAdaptiveScaffoldItem(
  items: AdaptiveScaffoldItem[],
  id: string | null | undefined
): AdaptiveScaffoldItem | null {
  if (!id) return null;

  for (const item of items) {
    if (item.id === id) return item;

    const child = findAdaptiveScaffoldItem(item.items ?? [], id);
    if (child) return child;
  }

  return null;
}

export function getFirstSelectableAdaptiveScaffoldItem(
  items: AdaptiveScaffoldItem[]
): AdaptiveScaffoldItem | null {
  for (const item of flattenAdaptiveScaffoldItems(items)) {
    if (isAdaptiveScaffoldItemSelectable(item)) {
      return item;
    }
  }

  return items[0] ?? null;
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
  if (mode !== "auto") {
    return mode;
  }

  if (width <= 0) {
    return fallbackKind;
  }

  if (width >= breakpoints.desktop) {
    return "desktop";
  }

  if (width >= breakpoints.tablet) {
    return "tablet";
  }

  return "mobile";
}

export function resolveAdaptiveValue(
  value:
    | React.ReactNode
    | ((context: AdaptiveScaffoldRenderContext) => React.ReactNode)
    | undefined,
  context: AdaptiveScaffoldRenderContext
): React.ReactNode {
  if (typeof value === "function") {
    return value(context);
  }

  return value;
}

export function adaptiveItemToNavigationItem(
  item: AdaptiveScaffoldItem
): NavigationItemDef {
  return {
    id: item.id,
    label: item.label,
    icon: item.icon,
    badge: item.badge,
    disabled: item.disabled,
    selectable: item.selectable,
    items: item.items?.map(adaptiveItemToNavigationItem),
    meta: {
      adaptiveItem: item,
    },
  };
}

export function navigationItemToAdaptiveItem(
  item: NavigationItemDef
): AdaptiveScaffoldItem | null {
  const adaptiveItem = item.meta?.adaptiveItem;

  if (!adaptiveItem || typeof adaptiveItem !== "object") {
    return null;
  }

  return adaptiveItem as AdaptiveScaffoldItem;
}