import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ForwardedRef,
  type ReactElement,
  type RefAttributes,
} from "react";
import {
  resolveSlot,
} from "../../helpers/css";
import { TreeItem } from "./TreeItem";
import { useTreeState } from "./hooks/useTreeState";
import type {
  TreeApi,
  TreeNodeId,
  TreeNodeKeyDownContext,
  TreeProps,
  TreeSelectionMode,
  TreeSlot,
} from "./tree.types";
import {
  getFirstVisibleTreeChild,
  getFirstVisibleTreeNode,
  getLastVisibleTreeNode,
  getNextVisibleTreeNode,
  getParentVisibleTreeNode,
  getPreviousVisibleTreeNode,
} from "./tree.utils";

function TreeInner<TNode>(
  {
    nodes,
    getNodeId,
    getNodeLabel,
    isNodeBranch,
    getNodeChildren,
    loadChildren,
    isNodeDisabled,

    expandedIds,
    defaultExpandedIds,
    onExpandedIdsChange,
    onNodeExpandedChange,

    selectedIds,
    defaultSelectedIds,
    selectionMode = "single",
    onSelectedIdsChange,
    onNodeSelectionChange,

    focusedId,
    defaultFocusedId,
    onFocusedIdChange,
    onNodeFocus,

    onNodeActivate,
    onNodeKeyDown,

    loadOnExpand = true,
    preserveChildrenOnReload = true,
    selectOnActivate = true,
    toggleOnBranchActivate = true,

    renderNodeIcon,
    renderToggle,
    renderNodeActions,
    renderNodeContent,
    renderLoading,
    renderEmpty,
    renderError,

    emptyContent = "Sin elementos",

    styles,
    slotProps,
    apiRef,

    className = "",
    style,
    ...rest
  }: TreeProps<TNode>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const tree = useTreeState({
    nodes,
    getNodeId,
    isNodeBranch,
    getNodeChildren,
    loadChildren,
    isNodeDisabled,

    expandedIds,
    defaultExpandedIds,
    onExpandedIdsChange,

    selectedIds,
    defaultSelectedIds,
    selectionMode,
    onSelectedIdsChange,

    focusedId,
    defaultFocusedId,
    onFocusedIdChange,

    loadOnExpand,
    preserveChildrenOnReload,
  });

  const itemRefs = useRef(
    new Map<TreeNodeId, HTMLDivElement>()
  );

  const shouldMoveDomFocusRef = useRef(false);

  const registerItemRef = useCallback(
    (
      nodeId: TreeNodeId,
      element: HTMLDivElement | null
    ): void => {
      if (element) {
        itemRefs.current.set(nodeId, element);
        return;
      }

      itemRefs.current.delete(nodeId);
    },
    []
  );

  const moveFocus = useCallback(
    (nodeId: TreeNodeId): void => {
      shouldMoveDomFocusRef.current = true;
      tree.focus(nodeId);
    },
    [tree]
  );

  useEffect(() => {
    if (!shouldMoveDomFocusRef.current) {
      return;
    }

    shouldMoveDomFocusRef.current = false;

    if (tree.focusedId === null) {
      return;
    }

    itemRefs.current.get(tree.focusedId)?.focus();
  }, [tree.focusedId]);

  const notifyExpansionChange = useCallback(
    (
      node: TNode,
      nodeId: TreeNodeId,
      nextExpanded: boolean
    ): void => {
      onNodeExpandedChange?.({
        node,
        nodeId,
        expanded: nextExpanded,
      });
    },
    [onNodeExpandedChange]
  );

  const notifySelectionChange = useCallback(
    (
      node: TNode,
      nodeId: TreeNodeId,
      nextSelected: boolean
    ): void => {
      onNodeSelectionChange?.({
        node,
        nodeId,
        selected: nextSelected,
      });
    },
    [onNodeSelectionChange]
  );

  const selectNode = useCallback(
    (
      node: TNode,
      nodeId: TreeNodeId
    ): void => {
      if (
        selectionMode === "none" ||
        tree.isDisabled(nodeId)
      ) {
        return;
      }

      const currentlySelected =
        tree.isSelected(nodeId);

      const nextSelected =
        selectionMode === "multiple"
          ? !currentlySelected
          : true;

      tree.select(nodeId);

      notifySelectionChange(
        node,
        nodeId,
        nextSelected
      );
    },
    [
      notifySelectionChange,
      selectionMode,
      tree,
    ]
  );

  const activateNode = useCallback(
    async (
      node: TNode,
      nodeId: TreeNodeId
    ): Promise<void> => {
      if (tree.isDisabled(nodeId)) {
        return;
      }

      if (selectOnActivate) {
        selectNode(node, nodeId);
      }

      if (
        isNodeBranch(node) &&
        toggleOnBranchActivate
      ) {
        const nextExpanded =
          !tree.isExpanded(nodeId);

        await tree.toggle(nodeId);

        notifyExpansionChange(
          node,
          nodeId,
          nextExpanded
        );
      }

      await onNodeActivate?.({
        node,
        nodeId,
      });
    },
    [
      isNodeBranch,
      notifyExpansionChange,
      onNodeActivate,
      selectNode,
      selectOnActivate,
      toggleOnBranchActivate,
      tree,
    ]
  );

  const handleItemKeyDown = useCallback(
    ({
      event,
      node,
      nodeId,
    }: TreeNodeKeyDownContext<TNode>): void => {
      const branch = isNodeBranch(node);
      const expanded =
        branch && tree.isExpanded(nodeId);

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();

          const nextNode =
            getNextVisibleTreeNode(
              tree.visibleNodes,
              nodeId
            );

          if (nextNode) {
            moveFocus(nextNode.nodeId);
          }

          return;
        }

        case "ArrowUp": {
          event.preventDefault();

          const previousNode =
            getPreviousVisibleTreeNode(
              tree.visibleNodes,
              nodeId
            );

          if (previousNode) {
            moveFocus(previousNode.nodeId);
          }

          return;
        }

        case "Home": {
          event.preventDefault();

          const firstNode =
            getFirstVisibleTreeNode(
              tree.visibleNodes
            );

          if (firstNode) {
            moveFocus(firstNode.nodeId);
          }

          return;
        }

        case "End": {
          event.preventDefault();

          const lastNode =
            getLastVisibleTreeNode(
              tree.visibleNodes
            );

          if (lastNode) {
            moveFocus(lastNode.nodeId);
          }

          return;
        }

        case "ArrowRight": {
          event.preventDefault();

          if (!branch) {
            return;
          }

          if (!expanded) {
            void tree.expand(nodeId).then(() => {
              notifyExpansionChange(
                node,
                nodeId,
                true
              );
            });

            return;
          }

          const firstChild =
            getFirstVisibleTreeChild(
              tree.visibleNodes,
              nodeId
            );

          if (firstChild) {
            moveFocus(firstChild.nodeId);
          }

          return;
        }

        case "ArrowLeft": {
          event.preventDefault();

          if (branch && expanded) {
            tree.collapse(nodeId);

            notifyExpansionChange(
              node,
              nodeId,
              false
            );

            return;
          }

          const parentNode =
            getParentVisibleTreeNode(
              tree.visibleNodes,
              nodeId
            );

          if (parentNode) {
            moveFocus(parentNode.nodeId);
          }

          return;
        }

        case "Enter": {
          event.preventDefault();
          void activateNode(node, nodeId);
          return;
        }

        case " ": {
          event.preventDefault();
          selectNode(node, nodeId);
          return;
        }

        default:
          return;
      }
    },
    [
      activateNode,
      isNodeBranch,
      moveFocus,
      notifyExpansionChange,
      selectNode,
      tree,
    ]
  );

  const api = useMemo<TreeApi<TNode>>(
    () => ({
      getNode: tree.getNode,

      getExpandedIds: () =>
        tree.expandedIds,

      getSelectedIds: () =>
        tree.selectedIds,

      getFocusedId: () =>
        tree.focusedId,

      isExpanded: tree.isExpanded,
      isSelected: tree.isSelected,

      getLoadState: tree.getLoadState,

      expand: tree.expand,
      collapse: tree.collapse,
      toggle: tree.toggle,

      select: tree.select,
      deselect: tree.deselect,
      clearSelection: tree.clearSelection,

      focus: tree.focus,

      load: tree.load,
      reload: tree.reload,

      invalidate: tree.invalidate,
      invalidateAll: tree.invalidateAll,

      setChildren: tree.setChildren,
    }),
    [tree]
  );

  useImperativeHandle(
    apiRef,
    () => api,
    [api]
  );

  const rootSlot = resolveSlot<TreeSlot>({
    slot: "root",
    styles,
    slotProps,
    className,
    style,
    baseProps: {
      "data-ui-tree": "",
      "data-ui-tree-selection-mode":
        selectionMode,
      "data-ui-tree-empty":
        nodes.length === 0
          ? ""
          : undefined,
    },
    baseStyle: {
      minWidth: 0,
      outline: "none",
    },
  });

  const groupSlot = resolveSlot<TreeSlot>({
    slot: "group",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-root-group": "",
    },
    baseStyle: {
      minWidth: 0,
    },
  });

  const emptySlot = resolveSlot<TreeSlot>({
    slot: "empty",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-root-empty": "",
    },
    baseStyle: {
      padding: "0.75rem",
      color: "var(--ui-text-soft)",
      fontSize: "var(--ui-font-size-sm)",
      fontStyle: "italic",
    },
  });

  return (
    <div
      {...rootSlot}
      {...rest}
      ref={forwardedRef}
      role="tree"
      aria-multiselectable={
        selectionMode === "multiple"
          ? true
          : undefined
      }
    >
      {nodes.length === 0 ? (
        <div {...emptySlot}>
          {emptyContent}
        </div>
      ) : (
        <div {...groupSlot}>
          {nodes.map((node, index) => {
            const nodeId = getNodeId(node);

            return (
              <TreeItem
                key={nodeId}
                node={node}
                nodeId={nodeId}
                depth={0}
                positionInSet={index + 1}
                setSize={nodes.length}
                tree={tree}
                getNodeId={getNodeId}
                getNodeLabel={getNodeLabel}
                isNodeBranch={isNodeBranch}
                selectionMode={
                  selectionMode as TreeSelectionMode
                }
                selectOnActivate={
                  selectOnActivate
                }
                toggleOnBranchActivate={
                  toggleOnBranchActivate
                }
                onNodeExpandedChange={
                  onNodeExpandedChange
                }
                onNodeSelectionChange={
                  onNodeSelectionChange
                }
                onNodeActivate={
                  onNodeActivate
                }
                onNodeFocus={onNodeFocus}
                onNodeKeyDown={
                  onNodeKeyDown
                }
                onItemKeyDown={
                  handleItemKeyDown
                }
                renderNodeIcon={
                  renderNodeIcon
                }
                renderToggle={renderToggle}
                renderNodeActions={
                  renderNodeActions
                }
                renderNodeContent={
                  renderNodeContent
                }
                renderLoading={
                  renderLoading
                }
                renderEmpty={renderEmpty}
                renderError={renderError}
                styles={styles}
                slotProps={slotProps}
                registerItemRef={
                  registerItemRef
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const ForwardedTree = forwardRef(TreeInner);

ForwardedTree.displayName = "Tree";

export const Tree = ForwardedTree as <TNode>(
  props: TreeProps<TNode> &
    RefAttributes<HTMLDivElement>
) => ReactElement | null;