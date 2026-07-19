// src/patterns/app-shell/UncontrolledAppShell.tsx
import React from "react";

import type {
  AppShellCommonProps,
} from "./AppShell.types";

import type {
  NavigationContentMeta,
  NavigationLinkMeta,
  NavigationNode,
} from "../navigation";

import { AppShell } from "./AppShell";

type UncontrolledAppShellNavigationMeta =
  NavigationLinkMeta &
  NavigationContentMeta;

export interface UncontrolledAppShellProps
  extends AppShellCommonProps {
  defaultActiveId?: string;

  renderNode?: (
    context: {
      node: NavigationNode<UncontrolledAppShellNavigationMeta>;
      activeId: string | null;
    }
  ) => React.ReactNode;

  fallback?: React.ReactNode;
}

function renderNavigationNodeContent(
  node: NavigationNode<UncontrolledAppShellNavigationMeta>
): React.ReactNode {
  const meta =
    node.meta;

  if (
    !meta ||
    typeof meta !== "object"
  ) {
    return null;
  }

  if (
    "element" in meta &&
    meta.element
  ) {
    return meta.element as React.ReactNode;
  }

  if (
    "component" in meta &&
    meta.component
  ) {
    const Component =
      meta.component as React.ComponentType<
        Record<never, never>
      >;

    return (
      <Component />
    );
  }

  return null;
}

export function UncontrolledAppShell({
  navigation,
  defaultActiveId,
  renderNode,
  fallback,
  activeId: controlledActiveId,
  ...rest
}: UncontrolledAppShellProps) {
  const firstNode =
    React.useMemo(
      () =>
        navigation.find(
          (node) =>
            Boolean(
              node.meta &&
              typeof node.meta === "object" &&
              (
                "component" in node.meta ||
                "element" in node.meta
              )
            )
        ) ?? navigation[0] ?? null,
      [
        navigation,
      ]
    );

  const [
    internalActiveId,
    setInternalActiveId,
  ] =
    React.useState<string | null>(
      () =>
        defaultActiveId ??
        firstNode?.id ??
        null
    );

  const activeId =
    controlledActiveId ??
    internalActiveId;

  const activeNode =
    React.useMemo(
      () =>
        navigation.find(
          (node) =>
            node.id === activeId
        ) ??
        firstNode,
      [
        activeId,
        firstNode,
        navigation,
      ]
    );

  const handleNavigate = React.useCallback(
    (
      node: NavigationNode<UncontrolledAppShellNavigationMeta>
    ) => {
      if (!node.id) {
        return;
      }

      setInternalActiveId(
        node.id
      );
    },
    []
  );

  const content =
    activeNode
      ? renderNode
        ? renderNode({
          node: activeNode,
          activeId,
        })
        : renderNavigationNodeContent(
          activeNode
        )
      : fallback;

  return (
    <AppShell
      {...rest}
      navigation={navigation}
      activeId={activeId}
      onNavigate={handleNavigate}
    >
      {
        content ??
        fallback ??
        null
      }
    </AppShell>
  );
}

UncontrolledAppShell.displayName =
  "UncontrolledAppShell";