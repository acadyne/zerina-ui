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


export function isNavigationNodeSelectable(
  node: NavigationNode
): boolean {
  if (node.disabled) return false;

  if (node.selectable !== undefined) {
    return node.selectable;
  }

  return !node.children?.length;
}


export function flattenNavigationNodes(
  nodes: NavigationNode[]
): NavigationNode[] {
  return nodes.flatMap((node) => [
    node,
    ...flattenNavigationNodes(
      node.children ?? []
    ),
  ]);
}


export function findNavigationNode(
  nodes: NavigationNode[],
  id: string | null | undefined
): NavigationNode | null {
  if (!id) return null;

  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    const child = findNavigationNode(
      node.children ?? [],
      id
    );

    if (child) {
      return child;
    }
  }

  return null;
}


export function getFirstSelectableNavigationNode(
  nodes: NavigationNode[]
): NavigationNode | null {
  for (const node of flattenNavigationNodes(nodes)) {
    if (isNavigationNodeSelectable(node)) {
      return node;
    }
  }

  return nodes[0] ?? null;
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


export function resolveAdaptiveValue(
  value:
    | React.ReactNode
    | ((
      context: AdaptiveScaffoldRenderContext
    ) => React.ReactNode)
    | undefined,

  context: AdaptiveScaffoldRenderContext
): React.ReactNode {

  if (typeof value === "function") {
    return value(context);
  }

  return value;
}