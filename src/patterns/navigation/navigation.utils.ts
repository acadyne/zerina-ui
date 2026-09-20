import type {
  NavigationActiveBehavior,
  NavigationNode,
  NavigationNodeEntry,
} from "./navigation.types";


export function isNavigationNodeDestination<
  TMeta = unknown
>(
  node: NavigationNode<TMeta>
): boolean {
  if (node.selectable !== undefined) {
    return node.selectable;
  }

  return !node.children?.length;
}


export function isNavigationNodeSelectable<
  TMeta = unknown
>(
  node: NavigationNode<TMeta>
): boolean {
  return (
    !node.disabled &&
    isNavigationNodeDestination(
      node
    )
  );
}


/**
 * Único walker estructural del árbol de navegación.
 *
 * Todos los consumidores que necesitan flattening, ancestry, búsqueda
 * o selección inicial derivan de estas entries.
 */
export function getNavigationNodeEntries<
  TMeta = unknown
>(
  nodes: NavigationNode<TMeta>[]
): NavigationNodeEntry<TMeta>[] {
  const entries:
    NavigationNodeEntry<TMeta>[] = [];

  const visit = (
    current:
      NavigationNode<TMeta>[],
    ancestors:
      NavigationNode<TMeta>[]
  ): void => {
    for (const node of current) {
      entries.push({
        node,
        depth:
          ancestors.length,
        ancestors,
      });

      visit(
        node.children ?? [],
        [
          ...ancestors,
          node,
        ]
      );
    }
  };

  visit(
    nodes,
    []
  );

  return entries;
}


export function getNavigationNodePath<
  TMeta = unknown
>(
  nodes: NavigationNode<TMeta>[],
  id: string | null | undefined
): NavigationNode<TMeta>[] | null {
  if (!id) {
    return null;
  }

  const entry =
    getNavigationNodeEntries(
      nodes
    ).find(
      ({ node }) =>
        node.id === id
    );

  return entry
    ? [
        ...entry.ancestors,
        entry.node,
      ]
    : null;
}


export function navigationNodeContainsId<
  TMeta = unknown
>(
  node: NavigationNode<TMeta>,
  id: string | null | undefined
): boolean {
  return Boolean(
    getNavigationNodePath(
      [
        node,
      ],
      id
    )
  );
}


export function isNavigationNodeActive<
  TMeta = unknown
>({
  node,
  activeId,
  behavior,
}: {
  node:
    NavigationNode<TMeta>;

  activeId?:
    string | null;

  behavior:
    NavigationActiveBehavior;
}): boolean {
  if (!activeId) {
    return false;
  }

  if (behavior === "exact") {
    return node.id === activeId;
  }

  return navigationNodeContainsId(
    node,
    activeId
  );
}


export function findNavigationNode<
  TMeta = unknown
>(
  nodes: NavigationNode<TMeta>[],
  id: string | null | undefined
): NavigationNode<TMeta> | null {
  if (!id) {
    return null;
  }

  return (
    getNavigationNodeEntries(
      nodes
    ).find(
      ({ node }) =>
        node.id === id
    )?.node ??
    null
  );
}


export function getFirstSelectableNavigationNode<
  TMeta = unknown
>(
  nodes: NavigationNode<TMeta>[]
): NavigationNode<TMeta> | null {
  return (
    getNavigationNodeEntries(
      nodes
    ).find(
      ({ node }) =>
        isNavigationNodeSelectable(
          node
        )
    )?.node ??
    null
  );
}


export function getNavigationNodeAriaLabel<
  TMeta = unknown
>(
  node: NavigationNode<TMeta>
): string | undefined {
  if (node.ariaLabel) {
    return node.ariaLabel;
  }

  if (
    typeof node.label === "string" ||
    typeof node.label === "number"
  ) {
    return String(
      node.label
    );
  }

  return undefined;
}
