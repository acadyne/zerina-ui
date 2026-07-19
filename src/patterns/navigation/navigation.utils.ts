import type {
  NavigationNode,
} from "./navigation.types";


export function isNavigationNodeSelectable(
  node: NavigationNode
): boolean {
  if (node.disabled) {
    return false;
  }

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