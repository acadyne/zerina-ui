import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import {
  resolveSlot,
} from "../../helpers/css";
import type {
  TreeActivationContext,
  TreeExpandedChangeContext,
  TreeFocusChangeContext,
  TreeNodeId,
  TreeNodeKeyDownContext,
  TreeNodeRenderContext,
  TreeSelectionChangeContext,
  TreeSelectionMode,
  TreeSlotProps,
  TreeStyles,
  TreeToggleRenderContext,
} from "./tree.types";
import {
  getTreeErrorMessage,
  getTreeNodeLevel,
} from "./tree.utils";
import type {
  UseTreeStateResult,
} from "./hooks/useTreeState";

export interface TreeItemProps<TNode> {
  node: TNode;
  nodeId: TreeNodeId;
  depth: number;
  positionInSet: number;
  setSize: number;

  tree: UseTreeStateResult<TNode>;

  getNodeId: (node: TNode) => TreeNodeId;
  getNodeLabel: (node: TNode) => ReactNode;
  isNodeBranch: (node: TNode) => boolean;

  selectionMode: TreeSelectionMode;
  selectOnActivate: boolean;
  toggleOnBranchActivate: boolean;

  onNodeExpandedChange?: (
    context: TreeExpandedChangeContext<TNode>
  ) => void;

  onNodeSelectionChange?: (
    context: TreeSelectionChangeContext<TNode>
  ) => void;

  onNodeActivate?: (
    context: TreeActivationContext<TNode>
  ) => void | Promise<void>;

  onNodeFocus?: (
    context: TreeFocusChangeContext<TNode>
  ) => void;

  onNodeKeyDown?: (
    context: TreeNodeKeyDownContext<TNode>
  ) => void;

  onItemKeyDown: (
    context: TreeNodeKeyDownContext<TNode>
  ) => void;

  renderNodeIcon?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  renderToggle?: (
    context: TreeToggleRenderContext<TNode>
  ) => ReactNode;

  renderNodeActions?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  renderNodeContent?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  renderLoading?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  renderEmpty?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  renderError?: (
    context: TreeNodeRenderContext<TNode> & {
      error: unknown;
    }
  ) => ReactNode;

  styles?: TreeStyles;
  slotProps?: TreeSlotProps;

  registerItemRef: (
    nodeId: TreeNodeId,
    element: HTMLDivElement | null
  ) => void;
}

export function TreeItem<TNode>({
  node,
  nodeId,
  depth,
  positionInSet,
  setSize,

  tree,

  getNodeId,
  getNodeLabel,
  isNodeBranch,

  selectionMode,
  selectOnActivate,
  toggleOnBranchActivate,

  onNodeExpandedChange,
  onNodeSelectionChange,
  onNodeActivate,
  onNodeFocus,
  onNodeKeyDown,
  onItemKeyDown,

  renderNodeIcon,
  renderToggle,
  renderNodeActions,
  renderNodeContent,
  renderLoading,
  renderEmpty,
  renderError,

  styles,
  slotProps,

  registerItemRef,
}: TreeItemProps<TNode>) {
  const branch = isNodeBranch(node);
  const expanded = branch && tree.isExpanded(nodeId);
  const selected = tree.isSelected(nodeId);
  const focused = tree.focusedId === nodeId;
  const disabled = tree.isDisabled(nodeId);

  const loadState = tree.getLoadState(nodeId);
  const children = branch
    ? tree.getNodeChildren(node, nodeId) ?? []
    : [];

  const loading = loadState.status === "loading";
  const refreshing = loadState.status === "refreshing";
  const loaded = loadState.status === "loaded";
  const failed = loadState.status === "error";
  const empty = branch && loaded && children.length === 0;

  const expandNode = async (): Promise<void> => {
    if (!branch || disabled || expanded) {
      return;
    }

    await tree.expand(nodeId);

    onNodeExpandedChange?.({
      node,
      nodeId,
      expanded: true,
    });
  };

  const collapseNode = (): void => {
    if (!branch || disabled || !expanded) {
      return;
    }

    tree.collapse(nodeId);

    onNodeExpandedChange?.({
      node,
      nodeId,
      expanded: false,
    });
  };

  const toggleNode = async (): Promise<void> => {
    if (!branch || disabled) {
      return;
    }

    const nextExpanded = !expanded;

    await tree.toggle(nodeId);

    onNodeExpandedChange?.({
      node,
      nodeId,
      expanded: nextExpanded,
    });
  };

  const selectNode = (): void => {
    if (selectionMode === "none" || disabled) {
      return;
    }

    const nextSelected =
      selectionMode === "multiple"
        ? !selected
        : true;

    tree.select(nodeId);

    onNodeSelectionChange?.({
      node,
      nodeId,
      selected: nextSelected,
    });
  };

  const focusNode = (): void => {
    if (disabled) {
      return;
    }

    tree.focus(nodeId);

    onNodeFocus?.({
      node,
      nodeId,
    });
  };

  const activateNode = (): void => {
    if (disabled) {
      return;
    }

    if (selectOnActivate) {
      selectNode();
    }

    if (branch && toggleOnBranchActivate) {
      void toggleNode();
    }

    void onNodeActivate?.({
      node,
      nodeId,
    });
  };

  const reloadNode = async (): Promise<void> => {
    if (!branch || disabled) {
      return;
    }

    await tree.reload(nodeId);
  };

  const renderContext: TreeNodeRenderContext<TNode> = {
    node,
    nodeId,
    depth,

    branch,
    expanded,
    selected,
    focused,
    disabled,

    loadStatus: loadState.status,
    loading,
    refreshing,
    loaded,
    empty,
    failed,

    expand: expandNode,
    collapse: collapseNode,
    toggle: toggleNode,

    select: selectNode,
    focus: focusNode,
    activate: activateNode,

    reload: reloadNode,
    retry: reloadNode,
  };

  const itemSlot = resolveSlot({
    slot: "item",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-item": "",
      "data-ui-tree-item-branch": branch || undefined,
      "data-ui-tree-item-expanded":
        branch && expanded ? "" : undefined,
      "data-ui-tree-item-selected":
        selected ? "" : undefined,
      "data-ui-tree-item-focused":
        focused ? "" : undefined,
      "data-ui-tree-item-disabled":
        disabled ? "" : undefined,
      "data-ui-tree-item-loading":
        loading ? "" : undefined,
      "data-ui-tree-item-refreshing":
        refreshing ? "" : undefined,
      "data-ui-tree-item-error":
        failed ? "" : undefined,
      "data-ui-tree-depth": depth,
    },
    baseStyle: {
      minWidth: 0,
    },
  });

  const rowSlot = resolveSlot({
    slot: "row",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-row": "",
    },
    baseStyle: {
      display: "flex",
      alignItems: "center",
      minWidth: 0,
      gap: "0.375rem",
      padding: "0.375rem 0.5rem",
      paddingLeft: `calc(0.5rem + ${depth * 0.875}rem)`,
      borderRadius: "var(--ui-radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.55 : 1,
      background: selected
        ? "color-mix(in srgb, var(--ui-primary) 10%, transparent)"
        : "transparent",
      color: selected
        ? "var(--ui-text)"
        : "var(--ui-text-muted)",
      outline: focused
        ? "2px solid color-mix(in srgb, var(--ui-primary) 45%, transparent)"
        : "none",
      outlineOffset: -2,
    },
  });

  const toggleSlot = resolveSlot({
    slot: "toggle",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-toggle": "",
    },
    baseStyle: {
      width: "1.125rem",
      height: "1.125rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      padding: 0,
      border: 0,
      background: "transparent",
      color: "inherit",
      cursor: disabled ? "not-allowed" : "pointer",
    },
  });

  const toggleIconSlot = resolveSlot({
    slot: "toggleIcon",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-toggle-icon": "",
    },
    baseStyle: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
      transform: expanded
        ? "rotate(90deg)"
        : "rotate(0deg)",
      transition:
        "transform var(--ui-duration-fast) var(--ui-ease-standard)",
    },
  });

  const nodeIconSlot = resolveSlot({
    slot: "nodeIcon",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-node-icon": "",
    },
    baseStyle: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  });

  const labelSlot = resolveSlot({
    slot: "label",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-label": "",
    },
    baseStyle: {
      minWidth: 0,
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  });

  const actionsSlot = resolveSlot({
    slot: "actions",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-actions": "",
    },
    baseStyle: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
    },
  });

  const childrenSlot = resolveSlot({
    slot: "children",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-children": "",
    },
    baseStyle: {
      minWidth: 0,
    },
  });

  const groupSlot = resolveSlot({
    slot: "group",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-group": "",
    },
    baseStyle: {
      minWidth: 0,
    },
  });

  const loadingSlot = resolveSlot({
    slot: "loading",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-loading": "",
    },
    baseStyle: {
      padding: "0.375rem 0.5rem",
      paddingLeft: `calc(2rem + ${(depth + 1) * 0.875}rem)`,
      color: "var(--ui-text-soft)",
      fontSize: "var(--ui-font-size-xs)",
    },
  });

  const emptySlot = resolveSlot({
    slot: "empty",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-empty": "",
    },
    baseStyle: {
      padding: "0.375rem 0.5rem",
      paddingLeft: `calc(2rem + ${(depth + 1) * 0.875}rem)`,
      color: "var(--ui-text-soft)",
      fontSize: "var(--ui-font-size-xs)",
      fontStyle: "italic",
    },
  });

  const errorSlot = resolveSlot({
    slot: "error",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-error": "",
    },
    baseStyle: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.375rem 0.5rem",
      paddingLeft: `calc(2rem + ${(depth + 1) * 0.875}rem)`,
      color: "var(--ui-danger)",
      fontSize: "var(--ui-font-size-xs)",
    },
  });

  const retrySlot = resolveSlot({
    slot: "retry",
    styles,
    slotProps,
    baseProps: {
      "data-ui-tree-retry": "",
    },
    baseStyle: {
      padding: "0.2rem 0.4rem",
      border: "1px solid currentColor",
      borderRadius: "var(--ui-radius-sm)",
      background: "transparent",
      color: "inherit",
      cursor: "pointer",
      fontSize: "inherit",
    },
  });

  const {
    onFocus: itemSlotOnFocus,
    onKeyDown: itemSlotOnKeyDown,
    ...itemSlotRest
  } = itemSlot;

  const {
    onClick: rowSlotOnClick,
    ...rowSlotRest
  } = rowSlot;

  const {
    onClick: toggleSlotOnClick,
    ...toggleSlotRest
  } = toggleSlot;

  const {
    onClick: actionsSlotOnClick,
    ...actionsSlotRest
  } = actionsSlot;

  const handleFocus = (
    event: FocusEvent<HTMLDivElement>
  ): void => {
    itemSlotOnFocus?.(event);

    if (event.defaultPrevented) {
      return;
    }

    focusNode();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>
  ): void => {
    itemSlotOnKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const context: TreeNodeKeyDownContext<TNode> = {
      event,
      node,
      nodeId,
    };

    onNodeKeyDown?.(context);

    if (event.defaultPrevented) {
      return;
    }

    onItemKeyDown(context);
  };

  const handleRowClick = (
    event: MouseEvent<HTMLDivElement>
  ): void => {
    rowSlotOnClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    focusNode();
    activateNode();
  };

  const handleToggleClick = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    toggleSlotOnClick?.(event);

    event.stopPropagation();

    if (event.defaultPrevented) {
      return;
    }

    focusNode();
    void toggleNode();
  };

  const handleActionsClick = (
    event: MouseEvent<HTMLDivElement>
  ): void => {
    actionsSlotOnClick?.(event);
    event.stopPropagation();
  };

  const defaultToggle = branch ? (
    <span {...toggleIconSlot} aria-hidden="true">
      ▶
    </span>
  ) : (
    <span aria-hidden="true" />
  );

  const toggleContent = renderToggle?.({
    ...renderContext,
    defaultToggle,
  });

  const customNodeContent =
    renderNodeContent?.(renderContext);

  const nodeIcon =
    renderNodeIcon?.(renderContext);

  const nodeActions =
    renderNodeActions?.(renderContext);

  const loadingContent =
    renderLoading?.(renderContext) ??
    "Cargando…";

  const emptyContent =
    renderEmpty?.(renderContext) ??
    "Sin elementos";

  const errorContent =
    renderError?.({
      ...renderContext,
      error: loadState.error,
    });

  return (
    <div
      {...itemSlotRest}
      ref={(element) => {
        registerItemRef(nodeId, element);
      }}
      role="treeitem"
      tabIndex={focused ? 0 : -1}
      aria-level={getTreeNodeLevel(depth)}
      aria-posinset={positionInSet}
      aria-setsize={setSize}
      aria-expanded={branch ? expanded : undefined}
      aria-selected={
        selectionMode !== "none"
          ? selected
          : undefined
      }
      aria-disabled={disabled || undefined}
      aria-busy={
        loading || refreshing
          ? true
          : undefined
      }
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    >
      <div
        {...rowSlotRest}
        onClick={handleRowClick}
      >
        {branch ? (
          <button
            {...toggleSlotRest}
            type="button"
            tabIndex={-1}
            aria-label={
              expanded
                ? "Contraer nodo"
                : "Expandir nodo"
            }
            aria-expanded={expanded}
            disabled={disabled}
            onClick={handleToggleClick}
          >
            {toggleContent ?? defaultToggle}
          </button>
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: "1.125rem",
              flexShrink: 0,
            }}
          />
        )}

        {customNodeContent ?? (
          <>
            {nodeIcon !== undefined ? (
              <span {...nodeIconSlot}>
                {nodeIcon}
              </span>
            ) : null}

            <span {...labelSlot}>
              {getNodeLabel(node)}
            </span>

            {nodeActions !== undefined ? (
              <div
                {...actionsSlotRest}
                onClick={handleActionsClick}
              >
                {nodeActions}
              </div>
            ) : null}
          </>
        )}
      </div>

      {branch && expanded ? (
        <div {...childrenSlot}>
          <div {...groupSlot} role="group">
            {loading && children.length === 0 ? (
              <div {...loadingSlot}>
                {loadingContent}
              </div>
            ) : null}

            {children.map((child, index) => {
              const childId = getNodeId(child);

              return (
                <TreeItem
                  key={childId}
                  node={child}
                  nodeId={childId}
                  depth={depth + 1}
                  positionInSet={index + 1}
                  setSize={children.length}
                  tree={tree}
                  getNodeId={getNodeId}
                  getNodeLabel={getNodeLabel}
                  isNodeBranch={isNodeBranch}
                  selectionMode={selectionMode}
                  selectOnActivate={selectOnActivate}
                  toggleOnBranchActivate={
                    toggleOnBranchActivate
                  }
                  onNodeExpandedChange={
                    onNodeExpandedChange
                  }
                  onNodeSelectionChange={
                    onNodeSelectionChange
                  }
                  onNodeActivate={onNodeActivate}
                  onNodeFocus={onNodeFocus}
                  onNodeKeyDown={onNodeKeyDown}
                  onItemKeyDown={onItemKeyDown}
                  renderNodeIcon={renderNodeIcon}
                  renderToggle={renderToggle}
                  renderNodeActions={
                    renderNodeActions
                  }
                  renderNodeContent={
                    renderNodeContent
                  }
                  renderLoading={renderLoading}
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

            {refreshing ? (
              <div {...loadingSlot}>
                {loadingContent}
              </div>
            ) : null}

            {empty ? (
              <div {...emptySlot}>
                {emptyContent}
              </div>
            ) : null}

            {failed ? (
              <div {...errorSlot}>
                <span>
                  {errorContent ??
                    getTreeErrorMessage(
                      loadState.error
                    )}
                </span>

                <button
                  {...retrySlot}
                  type="button"
                  onClick={() => {
                    void reloadNode();
                  }}
                >
                  Reintentar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}