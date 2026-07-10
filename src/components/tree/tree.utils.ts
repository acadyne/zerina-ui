import type { TreeNodeId } from "./tree.types";

export interface TreeIndexedNode<TNode> {
  node: TNode;
  nodeId: TreeNodeId;
  parentId: TreeNodeId | null;
  depth: number;
}

export interface TreeVisibleNode<TNode>
  extends TreeIndexedNode<TNode> {
  position: number;
}

export interface BuildTreeIndexOptions<TNode> {
  nodes: readonly TNode[];
  getNodeId: (node: TNode) => TreeNodeId;
  getNodeChildren: (
    node: TNode,
    nodeId: TreeNodeId
  ) => readonly TNode[] | undefined;
}

export interface BuildVisibleTreeOptions<TNode>
  extends BuildTreeIndexOptions<TNode> {
  isExpanded: (nodeId: TreeNodeId) => boolean;
}

export function createTreeNodeIdSet(
  values?: Iterable<TreeNodeId>
): Set<TreeNodeId> {
  return new Set(values);
}

export function areTreeNodeIdSetsEqual(
  first: ReadonlySet<TreeNodeId>,
  second: ReadonlySet<TreeNodeId>
): boolean {
  if (first === second) {
    return true;
  }

  if (first.size !== second.size) {
    return false;
  }

  for (const value of first) {
    if (!second.has(value)) {
      return false;
    }
  }

  return true;
}

export function addTreeNodeId(
  values: ReadonlySet<TreeNodeId>,
  nodeId: TreeNodeId
): Set<TreeNodeId> {
  if (values.has(nodeId)) {
    return new Set(values);
  }

  const next = new Set(values);
  next.add(nodeId);

  return next;
}

export function removeTreeNodeId(
  values: ReadonlySet<TreeNodeId>,
  nodeId: TreeNodeId
): Set<TreeNodeId> {
  if (!values.has(nodeId)) {
    return new Set(values);
  }

  const next = new Set(values);
  next.delete(nodeId);

  return next;
}

export function toggleTreeNodeId(
  values: ReadonlySet<TreeNodeId>,
  nodeId: TreeNodeId
): Set<TreeNodeId> {
  const next = new Set(values);

  if (next.has(nodeId)) {
    next.delete(nodeId);
  } else {
    next.add(nodeId);
  }

  return next;
}

export function createSingleTreeSelection(
  nodeId: TreeNodeId
): Set<TreeNodeId> {
  return new Set([nodeId]);
}

export function toggleTreeSelection(
  values: ReadonlySet<TreeNodeId>,
  nodeId: TreeNodeId
): Set<TreeNodeId> {
  return toggleTreeNodeId(values, nodeId);
}

export function normalizeTreeChildren<TNode>(
  children: readonly TNode[] | undefined
): readonly TNode[] | undefined {
  if (children === undefined) {
    return undefined;
  }

  return [...children];
}

export function buildTreeNodeIndex<TNode>({
  nodes,
  getNodeId,
  getNodeChildren,
}: BuildTreeIndexOptions<TNode>): Map<
  TreeNodeId,
  TreeIndexedNode<TNode>
> {
  const index = new Map<TreeNodeId, TreeIndexedNode<TNode>>();
  const activePath = new Set<TreeNodeId>();

  const visit = (
    currentNodes: readonly TNode[],
    parentId: TreeNodeId | null,
    depth: number
  ) => {
    for (const node of currentNodes) {
      const nodeId = getNodeId(node);

      if (activePath.has(nodeId)) {
        continue;
      }

      index.set(nodeId, {
        node,
        nodeId,
        parentId,
        depth,
      });

      const children = getNodeChildren(node, nodeId);

      if (!children || children.length === 0) {
        continue;
      }

      activePath.add(nodeId);
      visit(children, nodeId, depth + 1);
      activePath.delete(nodeId);
    }
  };

  visit(nodes, null, 0);

  return index;
}

export function buildVisibleTreeNodes<TNode>({
  nodes,
  getNodeId,
  getNodeChildren,
  isExpanded,
}: BuildVisibleTreeOptions<TNode>): TreeVisibleNode<TNode>[] {
  const visibleNodes: TreeVisibleNode<TNode>[] = [];
  const activePath = new Set<TreeNodeId>();

  const visit = (
    currentNodes: readonly TNode[],
    parentId: TreeNodeId | null,
    depth: number
  ) => {
    for (const node of currentNodes) {
      const nodeId = getNodeId(node);

      if (activePath.has(nodeId)) {
        continue;
      }

      visibleNodes.push({
        node,
        nodeId,
        parentId,
        depth,
        position: visibleNodes.length,
      });

      if (!isExpanded(nodeId)) {
        continue;
      }

      const children = getNodeChildren(node, nodeId);

      if (!children || children.length === 0) {
        continue;
      }

      activePath.add(nodeId);
      visit(children, nodeId, depth + 1);
      activePath.delete(nodeId);
    }
  };

  visit(nodes, null, 0);

  return visibleNodes;
}

export function getPreviousVisibleTreeNode<TNode>(
  visibleNodes: readonly TreeVisibleNode<TNode>[],
  nodeId: TreeNodeId
): TreeVisibleNode<TNode> | undefined {
  const index = visibleNodes.findIndex(
    (entry) => entry.nodeId === nodeId
  );

  if (index <= 0) {
    return undefined;
  }

  return visibleNodes[index - 1];
}

export function getNextVisibleTreeNode<TNode>(
  visibleNodes: readonly TreeVisibleNode<TNode>[],
  nodeId: TreeNodeId
): TreeVisibleNode<TNode> | undefined {
  const index = visibleNodes.findIndex(
    (entry) => entry.nodeId === nodeId
  );

  if (index < 0 || index >= visibleNodes.length - 1) {
    return undefined;
  }

  return visibleNodes[index + 1];
}

export function getFirstVisibleTreeNode<TNode>(
  visibleNodes: readonly TreeVisibleNode<TNode>[]
): TreeVisibleNode<TNode> | undefined {
  return visibleNodes[0];
}

export function getLastVisibleTreeNode<TNode>(
  visibleNodes: readonly TreeVisibleNode<TNode>[]
): TreeVisibleNode<TNode> | undefined {
  return visibleNodes[visibleNodes.length - 1];
}

export function getParentVisibleTreeNode<TNode>(
  visibleNodes: readonly TreeVisibleNode<TNode>[],
  nodeId: TreeNodeId
): TreeVisibleNode<TNode> | undefined {
  const current = visibleNodes.find(
    (entry) => entry.nodeId === nodeId
  );

  if (!current || current.parentId === null) {
    return undefined;
  }

  return visibleNodes.find(
    (entry) => entry.nodeId === current.parentId
  );
}

export function getFirstVisibleTreeChild<TNode>(
  visibleNodes: readonly TreeVisibleNode<TNode>[],
  nodeId: TreeNodeId
): TreeVisibleNode<TNode> | undefined {
  const currentIndex = visibleNodes.findIndex(
    (entry) => entry.nodeId === nodeId
  );

  if (currentIndex < 0) {
    return undefined;
  }

  const next = visibleNodes[currentIndex + 1];

  if (!next || next.parentId !== nodeId) {
    return undefined;
  }

  return next;
}

export function getTreeNodeLevel(depth: number): number {
  return Math.max(1, depth + 1);
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error
  ) {
    return error.name === "AbortError";
  }

  return false;
}

export function getTreeErrorMessage(
  error: unknown,
  fallback = "No se pudieron cargar los elementos."
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}