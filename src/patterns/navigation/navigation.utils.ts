import type {
  NavigationNode,
} from "./navigation.types";


export function isNavigationNodeSelectable<
  TMeta = unknown
>(
  node: NavigationNode<TMeta>
): boolean {
  if (node.disabled) {
    return false;
  }

  if (node.selectable !== undefined) {
    return node.selectable;
  }

  return !node.children?.length;
}


export function flattenNavigationNodes<
  TMeta = unknown
>(
  nodes: NavigationNode<TMeta>[]
): NavigationNode<TMeta>[] {
  return nodes.flatMap((node) => [
    node,
    ...flattenNavigationNodes(
      node.children ?? []
    ),
  ]);
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

  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    const child =
      findNavigationNode(
        node.children ?? [],
        id
      );

    if (child) {
      return child;
    }
  }

  return null;
}


export function getFirstSelectableNavigationNode<
  TMeta = unknown
>(
  nodes: NavigationNode<TMeta>[]
): NavigationNode<TMeta> | null {
  for (const node of flattenNavigationNodes(nodes)) {
    if (isNavigationNodeSelectable(node)) {
      return node;
    }
  }

  return nodes[0] ?? null;
}