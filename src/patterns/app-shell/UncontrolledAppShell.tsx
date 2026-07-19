// src/patterns/app-shell/UncontrolledAppShell.tsx
import React from "react";
import type {
  AppShellCommonProps,
} from "./AppShell.types";
import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../navigation";
import { AppShell } from "./AppShell";

export interface UncontrolledAppShellProps
  extends AppShellCommonProps {
  defaultActiveId?: string;

  renderNode?: (
    context: {
      node: NavigationNode<NavigationLinkMeta>;
      activePath: string;
    }
  ) => React.ReactNode;

  fallback?: React.ReactNode;
}

function renderNavigationNodeContent(
  node: NavigationNode<NavigationLinkMeta>
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
  activeRouteId: controlledActiveId,
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

  const activePath =
    activeNode?.meta?.href ??
    "/";

  const handleNavigate = React.useCallback(
    (
      node: NavigationNode<NavigationLinkMeta>
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
          activePath,
        })
        : renderNavigationNodeContent(
          activeNode
        )
      : fallback;

  return (
    <AppShell
      {...rest}
      navigation={navigation}
      activePath={activePath}
      activeRouteId={
        activeNode?.id ?? null
      }
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