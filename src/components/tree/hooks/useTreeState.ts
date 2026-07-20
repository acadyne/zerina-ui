
// src/components/tree/hooks/useTreeState.ts

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  TreeLoadChildren,
  TreeNodeId,
  TreeNodeLoadState,
  TreeSelectionMode,
} from "../tree.types";
import {
  addTreeNodeId,
  buildTreeNodeIndex,
  buildVisibleTreeNodes,
  createSingleTreeSelection,
  createTreeNodeIdSet,
  isAbortError,
  removeTreeNodeId,
  type TreeIndexedNode,
  type TreeVisibleNode,
} from "../tree.utils";

const EMPTY_TREE_NODE_IDS: ReadonlySet<TreeNodeId> = new Set();

interface InternalTreeNodeLoadState<TNode>
  extends TreeNodeLoadState<TNode> {
  requestId: number;
}

export interface UseTreeStateOptions<TNode> {
  nodes: readonly TNode[];

  getNodeId: (node: TNode) => TreeNodeId;

  isNodeBranch: (node: TNode) => boolean;

  getNodeChildren?: (
    node: TNode
  ) => readonly TNode[] | undefined;

  loadChildren?: TreeLoadChildren<TNode>;

  isNodeDisabled?: (node: TNode) => boolean;

  expandedIds?: ReadonlySet<TreeNodeId>;
  defaultExpandedIds?: Iterable<TreeNodeId>;
  onExpandedIdsChange?: (
    expandedIds: ReadonlySet<TreeNodeId>
  ) => void;

  selectedIds?: ReadonlySet<TreeNodeId>;
  defaultSelectedIds?: Iterable<TreeNodeId>;
  selectionMode?: TreeSelectionMode;
  onSelectedIdsChange?: (
    selectedIds: ReadonlySet<TreeNodeId>
  ) => void;

  focusedId?: TreeNodeId | null;
  defaultFocusedId?: TreeNodeId | null;
  onFocusedIdChange?: (
    focusedId: TreeNodeId | null
  ) => void;

  loadOnExpand?: boolean;
  preserveChildrenOnReload?: boolean;
}

export interface UseTreeStateResult<TNode> {
  expandedIds: ReadonlySet<TreeNodeId>;
  selectedIds: ReadonlySet<TreeNodeId>;
  focusedId: TreeNodeId | null;

  nodeIndex: ReadonlyMap<
    TreeNodeId,
    TreeIndexedNode<TNode>
  >;

  visibleNodes: readonly TreeVisibleNode<TNode>[];

  getNode: (nodeId: TreeNodeId) => TNode | undefined;

  getNodeChildren: (
    node: TNode,
    nodeId: TreeNodeId
  ) => readonly TNode[] | undefined;

  getLoadState: (
    nodeId: TreeNodeId
  ) => TreeNodeLoadState<TNode>;

  isExpanded: (nodeId: TreeNodeId) => boolean;
  isSelected: (nodeId: TreeNodeId) => boolean;
  isDisabled: (nodeId: TreeNodeId) => boolean;

  expand: (nodeId: TreeNodeId) => Promise<void>;
  collapse: (nodeId: TreeNodeId) => void;
  toggle: (nodeId: TreeNodeId) => Promise<void>;

  select: (nodeId: TreeNodeId) => void;
  deselect: (nodeId: TreeNodeId) => void;
  clearSelection: () => void;

  focus: (nodeId: TreeNodeId) => void;

  load: (nodeId: TreeNodeId) => Promise<void>;
  reload: (nodeId: TreeNodeId) => Promise<void>;

  invalidate: (nodeId: TreeNodeId) => void;
  invalidateAll: () => void;

  setChildren: (
    nodeId: TreeNodeId,
    children: readonly TNode[]
  ) => void;
}

function createIdleLoadState<TNode>(): TreeNodeLoadState<TNode> {
  return {
    status: "idle",
    children: [],
    error: null,
  };
}

function createInternalIdleLoadState<TNode>(): InternalTreeNodeLoadState<TNode> {
  return {
    ...createIdleLoadState<TNode>(),
    requestId: 0,
  };
}

function toPublicLoadState<TNode>(
  state: InternalTreeNodeLoadState<TNode>
): TreeNodeLoadState<TNode> {
  return {
    status: state.status,
    children: state.children,
    error: state.error,
  };
}

export function useTreeState<TNode>({
  nodes,
  getNodeId,
  isNodeBranch,
  getNodeChildren: getExternalNodeChildren,
  loadChildren,
  isNodeDisabled,

  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  onExpandedIdsChange,

  selectedIds: controlledSelectedIds,
  defaultSelectedIds,
  selectionMode = "single",
  onSelectedIdsChange,

  focusedId: controlledFocusedId,
  defaultFocusedId = null,
  onFocusedIdChange,

  loadOnExpand = true,
  preserveChildrenOnReload = true,
}: UseTreeStateOptions<TNode>): UseTreeStateResult<TNode> {
  const [
    uncontrolledExpandedIds,
    setUncontrolledExpandedIds,
  ] = useState<Set<TreeNodeId>>(() =>
    createTreeNodeIdSet(defaultExpandedIds)
  );

  const [
    uncontrolledSelectedIds,
    setUncontrolledSelectedIds,
  ] = useState<Set<TreeNodeId>>(() =>
    createTreeNodeIdSet(defaultSelectedIds)
  );

  const [
    uncontrolledFocusedId,
    setUncontrolledFocusedId,
  ] = useState<TreeNodeId | null>(defaultFocusedId);

  const [loadStates, setLoadStates] = useState<
    Map<TreeNodeId, InternalTreeNodeLoadState<TNode>>
  >(() => new Map());

  const requestSequenceRef = useRef(0);

  const requestControllersRef = useRef<
    Map<TreeNodeId, AbortController>
  >(new Map());

  const expandedIds =
    controlledExpandedIds ?? uncontrolledExpandedIds;

  const selectedIds =
    controlledSelectedIds ?? uncontrolledSelectedIds;

  const focusedId =
    controlledFocusedId !== undefined
      ? controlledFocusedId
      : uncontrolledFocusedId;

  const expandedIdsRef = useRef(expandedIds);
  const selectedIdsRef = useRef(selectedIds);
  const focusedIdRef = useRef(focusedId);
  const loadStatesRef = useRef(loadStates);

  expandedIdsRef.current = expandedIds;
  selectedIdsRef.current = selectedIds;
  focusedIdRef.current = focusedId;
  loadStatesRef.current = loadStates;

  const getNodeChildren = useCallback(
    (
      node: TNode,
      nodeId: TreeNodeId
    ): readonly TNode[] | undefined => {
      const externalChildren =
        getExternalNodeChildren?.(node);

      if (externalChildren !== undefined) {
        return externalChildren;
      }

      return loadStatesRef.current.get(nodeId)?.children;
    },
    [getExternalNodeChildren]
  );

  const nodeIndex = useMemo(
    () =>
      buildTreeNodeIndex({
        nodes,
        getNodeId,
        getNodeChildren,
      }),
    [nodes, getNodeId, getNodeChildren, loadStates]
  );

  const nodeIndexRef = useRef(nodeIndex);
  nodeIndexRef.current = nodeIndex;

  const visibleNodes = useMemo(
    () =>
      buildVisibleTreeNodes({
        nodes,
        getNodeId,
        getNodeChildren,
        isExpanded: (nodeId) =>
          expandedIds.has(nodeId),
      }),
    [
      nodes,
      getNodeId,
      getNodeChildren,
      expandedIds,
      loadStates,
    ]
  );

  const emitExpandedIds = useCallback(
    (nextIds: Set<TreeNodeId>) => {
      expandedIdsRef.current = nextIds;

      if (controlledExpandedIds === undefined) {
        setUncontrolledExpandedIds(nextIds);
      }

      onExpandedIdsChange?.(nextIds);
    },
    [
      controlledExpandedIds,
      onExpandedIdsChange,
    ]
  );

  const emitSelectedIds = useCallback(
    (nextIds: Set<TreeNodeId>) => {
      selectedIdsRef.current = nextIds;

      if (controlledSelectedIds === undefined) {
        setUncontrolledSelectedIds(nextIds);
      }

      onSelectedIdsChange?.(nextIds);
    },
    [
      controlledSelectedIds,
      onSelectedIdsChange,
    ]
  );

  const emitFocusedId = useCallback(
    (nextId: TreeNodeId | null) => {
      focusedIdRef.current = nextId;

      if (controlledFocusedId === undefined) {
        setUncontrolledFocusedId(nextId);
      }

      onFocusedIdChange?.(nextId);
    },
    [
      controlledFocusedId,
      onFocusedIdChange,
    ]
  );

  const getNode = useCallback(
    (nodeId: TreeNodeId): TNode | undefined => {
      return nodeIndexRef.current.get(nodeId)?.node;
    },
    []
  );

  const isExpanded = useCallback(
    (nodeId: TreeNodeId): boolean => {
      return expandedIdsRef.current.has(nodeId);
    },
    []
  );

  const isSelected = useCallback(
    (nodeId: TreeNodeId): boolean => {
      return selectedIdsRef.current.has(nodeId);
    },
    []
  );

  const isDisabled = useCallback(
    (nodeId: TreeNodeId): boolean => {
      const node = getNode(nodeId);

      if (!node) {
        return false;
      }

      return isNodeDisabled?.(node) ?? false;
    },
    [getNode, isNodeDisabled]
  );

  const getLoadState = useCallback(
    (
      nodeId: TreeNodeId
    ): TreeNodeLoadState<TNode> => {
      const internalState =
        loadStatesRef.current.get(nodeId);

      if (internalState) {
        return toPublicLoadState(internalState);
      }

      const node = getNode(nodeId);

      if (!node) {
        return createIdleLoadState<TNode>();
      }

      const externalChildren =
        getExternalNodeChildren?.(node);

      if (externalChildren !== undefined) {
        return {
          status: "loaded",
          children: externalChildren,
          error: null,
        };
      }

      return createIdleLoadState<TNode>();
    },
    [getNode, getExternalNodeChildren]
  );

  const setChildren = useCallback(
    (
      nodeId: TreeNodeId,
      children: readonly TNode[]
    ) => {
      requestControllersRef.current
        .get(nodeId)
        ?.abort();

      requestControllersRef.current.delete(nodeId);

      setLoadStates((current) => {
        const previous =
          current.get(nodeId) ??
          createInternalIdleLoadState<TNode>();

        const next = new Map(current);

        next.set(nodeId, {
          status: "loaded",
          children: [...children],
          error: null,
          requestId: previous.requestId + 1,
        });

        loadStatesRef.current = next;

        return next;
      });
    },
    []
  );

  const performLoad = useCallback(
    async (
      nodeId: TreeNodeId,
      force: boolean
    ): Promise<void> => {
      const indexedNode =
        nodeIndexRef.current.get(nodeId);

      if (!indexedNode) {
        return;
      }

      const { node } = indexedNode;

      if (!isNodeBranch(node)) {
        return;
      }

      if (isNodeDisabled?.(node)) {
        return;
      }

      const externalChildren =
        getExternalNodeChildren?.(node);

      if (
        externalChildren !== undefined &&
        !force
      ) {
        return;
      }

      const currentState =
        loadStatesRef.current.get(nodeId);

      if (
        !force &&
        (currentState?.status === "loading" ||
          currentState?.status === "refreshing" ||
          currentState?.status === "loaded" ||
          currentState?.status === "error")
      ) {
        return;
      }

      if (!loadChildren) {
        if (externalChildren !== undefined) {
          return;
        }

        setChildren(nodeId, []);

        return;
      }

      requestControllersRef.current
        .get(nodeId)
        ?.abort();

      const controller = new AbortController();
      const requestId =
        requestSequenceRef.current + 1;

      requestSequenceRef.current = requestId;

      requestControllersRef.current.set(
        nodeId,
        controller
      );

      const previousChildren =
        externalChildren ??
        currentState?.children ??
        [];

      const nextStatus =
        force && previousChildren.length > 0
          ? "refreshing"
          : "loading";

      setLoadStates((current) => {
        const next = new Map(current);

        next.set(nodeId, {
          status: nextStatus,
          children:
            force && !preserveChildrenOnReload
              ? []
              : previousChildren,
          error: null,
          requestId,
        });

        loadStatesRef.current = next;

        return next;
      });

      try {
        const children = await loadChildren({
          node,
          nodeId,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setLoadStates((current) => {
          const latest = current.get(nodeId);

          if (
            !latest ||
            latest.requestId !== requestId
          ) {
            return current;
          }

          const next = new Map(current);

          next.set(nodeId, {
            status: "loaded",
            children: [...children],
            error: null,
            requestId,
          });

          loadStatesRef.current = next;

          return next;
        });
      } catch (error) {
        if (
          controller.signal.aborted ||
          isAbortError(error)
        ) {
          return;
        }

        setLoadStates((current) => {
          const latest = current.get(nodeId);

          if (
            !latest ||
            latest.requestId !== requestId
          ) {
            return current;
          }

          const next = new Map(current);

          next.set(nodeId, {
            status: "error",
            children:
              preserveChildrenOnReload
                ? latest.children
                : [],
            error,
            requestId,
          });

          loadStatesRef.current = next;

          return next;
        });
      } finally {
        const activeController =
          requestControllersRef.current.get(nodeId);

        if (activeController === controller) {
          requestControllersRef.current.delete(nodeId);
        }
      }
    },
    [
      getExternalNodeChildren,
      isNodeBranch,
      isNodeDisabled,
      loadChildren,
      preserveChildrenOnReload,
      setChildren,
    ]
  );

  const load = useCallback(
    async (nodeId: TreeNodeId) => {
      await performLoad(nodeId, false);
    },
    [performLoad]
  );

  useEffect(() => {
    if (!loadOnExpand) {
      return;
    }

    for (const nodeId of expandedIds) {
      const indexedNode =
        nodeIndex.get(nodeId);

      if (!indexedNode) {
        continue;
      }

      if (!isNodeBranch(indexedNode.node)) {
        continue;
      }

      if (
        isNodeDisabled?.(
          indexedNode.node
        )
      ) {
        continue;
      }

      const externalChildren =
        getExternalNodeChildren?.(
          indexedNode.node
        );

      if (externalChildren !== undefined) {
        continue;
      }

      const loadState =
        getLoadState(nodeId);

      if (loadState.status !== "idle") {
        continue;
      }

      void load(nodeId);
    }
  }, [
    expandedIds,
    getExternalNodeChildren,
    getLoadState,
    isNodeBranch,
    isNodeDisabled,
    load,
    loadOnExpand,
    nodeIndex,
  ]);

  const reload = useCallback(
    async (nodeId: TreeNodeId) => {
      await performLoad(nodeId, true);
    },
    [performLoad]
  );

  const expand = useCallback(
    async (nodeId: TreeNodeId) => {
      const node = getNode(nodeId);

      if (
        !node ||
        !isNodeBranch(node) ||
        isNodeDisabled?.(node)
      ) {
        return;
      }

      if (!expandedIdsRef.current.has(nodeId)) {
        emitExpandedIds(
          addTreeNodeId(
            expandedIdsRef.current,
            nodeId
          )
        );
      }

      if (loadOnExpand) {
        await load(nodeId);
      }
    },
    [
      emitExpandedIds,
      getNode,
      isNodeBranch,
      isNodeDisabled,
      load,
      loadOnExpand,
    ]
  );

  const collapse = useCallback(
    (nodeId: TreeNodeId) => {
      if (!expandedIdsRef.current.has(nodeId)) {
        return;
      }

      emitExpandedIds(
        removeTreeNodeId(
          expandedIdsRef.current,
          nodeId
        )
      );
    },
    [emitExpandedIds]
  );

  const toggle = useCallback(
    async (nodeId: TreeNodeId) => {
      if (expandedIdsRef.current.has(nodeId)) {
        collapse(nodeId);
        return;
      }

      await expand(nodeId);
    },
    [collapse, expand]
  );

  const select = useCallback(
    (nodeId: TreeNodeId) => {
      if (
        selectionMode === "none" ||
        isDisabled(nodeId)
      ) {
        return;
      }

      const current =
        selectedIdsRef.current;

      const next =
        selectionMode === "single"
          ? createSingleTreeSelection(nodeId)
          : addTreeNodeId(current, nodeId);

      emitSelectedIds(next);
    },
    [
      emitSelectedIds,
      isDisabled,
      selectionMode,
    ]
  );

  const deselect = useCallback(
    (nodeId: TreeNodeId) => {
      if (!selectedIdsRef.current.has(nodeId)) {
        return;
      }

      emitSelectedIds(
        removeTreeNodeId(
          selectedIdsRef.current,
          nodeId
        )
      );
    },
    [emitSelectedIds]
  );

  const clearSelection = useCallback(() => {
    if (selectedIdsRef.current.size === 0) {
      return;
    }

    emitSelectedIds(new Set());
  }, [emitSelectedIds]);

  const focus = useCallback(
    (nodeId: TreeNodeId) => {
      if (
        !nodeIndexRef.current.has(nodeId) ||
        isDisabled(nodeId)
      ) {
        return;
      }

      if (focusedIdRef.current === nodeId) {
        return;
      }

      emitFocusedId(nodeId);
    },
    [emitFocusedId, isDisabled]
  );

  const invalidate = useCallback(
    (nodeId: TreeNodeId) => {
      requestControllersRef.current
        .get(nodeId)
        ?.abort();

      requestControllersRef.current.delete(nodeId);

      setLoadStates((current) => {
        if (!current.has(nodeId)) {
          return current;
        }

        const next = new Map(current);
        next.delete(nodeId);

        loadStatesRef.current = next;

        return next;
      });
    },
    []
  );

  const invalidateAll = useCallback(() => {
    for (
      const controller of
      requestControllersRef.current.values()
    ) {
      controller.abort();
    }

    requestControllersRef.current.clear();

    const next = new Map<
      TreeNodeId,
      InternalTreeNodeLoadState<TNode>
    >();

    loadStatesRef.current = next;
    setLoadStates(next);
  }, []);

  useEffect(() => {
    return () => {
      for (
        const controller of
        requestControllersRef.current.values()
      ) {
        controller.abort();
      }

      requestControllersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (
      focusedIdRef.current !== null &&
      nodeIndex.has(focusedIdRef.current)
    ) {
      return;
    }

    const firstVisibleEnabledNode =
      visibleNodes.find(
        (entry) =>
          !(
            isNodeDisabled?.(entry.node) ??
            false
          )
      );

    emitFocusedId(
      firstVisibleEnabledNode?.nodeId ?? null
    );
  }, [
    emitFocusedId,
    isNodeDisabled,
    nodeIndex,
    visibleNodes,
  ]);

  return {
    expandedIds:
      expandedIds ?? EMPTY_TREE_NODE_IDS,

    selectedIds:
      selectedIds ?? EMPTY_TREE_NODE_IDS,

    focusedId,

    nodeIndex,
    visibleNodes,

    getNode,
    getNodeChildren,
    getLoadState,

    isExpanded,
    isSelected,
    isDisabled,

    expand,
    collapse,
    toggle,

    select,
    deselect,
    clearSelection,

    focus,

    load,
    reload,

    invalidate,
    invalidateAll,

    setChildren,
  };
}