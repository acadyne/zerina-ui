import type React from "react";

import type {
  NavigationNode,
  NavigationNodeEntry,
  NavigationPresentation,
  NavigationSide,
} from "./navigation.types";

import {
  getNavigationNodeEntries,
  getNavigationNodePath,
  isNavigationNodeDestination,
} from "./navigation.utils";


export type NavigationCompactPresentation =
  Extract<
    NavigationPresentation,
    "bottom" | "rail"
  >;


export interface NavigationCompactProjection<
  TMeta = unknown
> {
  destinations:
    NavigationNodeEntry<TMeta>[];

  visible:
    NavigationNodeEntry<TMeta>[];

  overflow:
    NavigationNodeEntry<TMeta>[];

  activeEntry:
    NavigationNodeEntry<TMeta> | null;

  activePath:
    NavigationNode<TMeta>[];

  activeInOverflow:
    boolean;

  hasOverflow:
    boolean;

  maxVisible:
    number;
}


export interface NavigationCompactPolicy {
  maxVisible?: Partial<
    Record<
      NavigationCompactPresentation,
      number
    >
  >;

  overflowLabel?:
    React.ReactNode;

  overflowAriaLabel?:
    string;

  overflowIcon?:
    React.ReactNode;

  drawerTitle?:
    React.ReactNode;

  drawerSide?:
    NavigationSide;
}


export const DEFAULT_NAVIGATION_COMPACT_MAX_VISIBLE:
  Readonly<
    Record<
      NavigationCompactPresentation,
      number
    >
  > = {
    bottom:
      5,

    rail:
      7,
  };


function normalizeCompactLimit(
  value:
    number | undefined,
  fallback:
    number
): number {
  if (
    value === undefined ||
    !Number.isFinite(
      value
    )
  ) {
    return fallback;
  }

  return Math.max(
    2,
    Math.floor(
      value
    )
  );
}


export function projectCompactNavigation<
  TMeta = unknown
>({
  items,
  activeId,
  presentation,
  policy,
}: {
  items:
    NavigationNode<TMeta>[];

  activeId?:
    string | null;

  presentation:
    NavigationCompactPresentation;

  policy?:
    NavigationCompactPolicy;
}): NavigationCompactProjection<TMeta> {
  const destinations =
    getNavigationNodeEntries(
      items
    ).filter(
      ({ node }) =>
        isNavigationNodeDestination(
          node
        )
    );

  const maxVisible =
    normalizeCompactLimit(
      policy
        ?.maxVisible
        ?.[
          presentation
        ],

      DEFAULT_NAVIGATION_COMPACT_MAX_VISIBLE[
        presentation
      ]
    );

  const hasOverflow =
    destinations.length >
    maxVisible;

  const directLimit =
    hasOverflow
      ? maxVisible - 1
      : maxVisible;

  const visible =
    destinations.slice(
      0,
      directLimit
    );

  const overflow =
    hasOverflow
      ? destinations.slice(
          directLimit
        )
      : [];

  const activeEntry =
    activeId
      ? destinations.find(
          ({ node }) =>
            node.id ===
            activeId
        ) ??
        null
      : null;

  const activePath =
    getNavigationNodePath(
      items,
      activeId
    ) ??
    [];

  const activeInOverflow =
    Boolean(
      activeId &&
      overflow.some(
        ({ node }) =>
          node.id ===
          activeId
      )
    );

  return {
    destinations,
    visible,
    overflow,
    activeEntry,
    activePath,
    activeInOverflow,
    hasOverflow,
    maxVisible,
  };
}
