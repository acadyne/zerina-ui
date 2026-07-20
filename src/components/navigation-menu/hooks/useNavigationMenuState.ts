import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type {
    NavigationMenuCloseReason,
    NavigationMenuItemId,
    NavigationMenuItemOpenChangeContext,
    NavigationMenuItemSelectContext,
    NavigationMenuOpenReason,
} from "../navigationMenu.types";
import {
    closeNavigationMenuAfterDepth,
    closeNavigationMenuFromDepth,
    createNavigationMenuOpenPath,
    setNavigationMenuOpenItemAtDepth,
} from "../navigationMenu.utils";
import {
  useTreeState,
} from "../../tree/hooks";

export interface UseNavigationMenuStateOptions<TItem> {
    items: readonly TItem[];

    getItemId: (item: TItem) => NavigationMenuItemId;

    isItemBranch: (item: TItem) => boolean;

    getItemChildren?: (
        item: TItem
    ) => readonly TItem[] | undefined;

    loadChildren?: (
        context: {
            node: TItem;
            nodeId: NavigationMenuItemId;
            signal: AbortSignal;
        }
    ) => Promise<readonly TItem[]>;

    isItemDisabled?: (item: TItem) => boolean;

    openPath?: readonly NavigationMenuItemId[];
    defaultOpenPath?: readonly NavigationMenuItemId[];
    onOpenPathChange?: (
        openPath: readonly NavigationMenuItemId[]
    ) => void;

    onItemOpenChange?: (
        context: NavigationMenuItemOpenChangeContext<TItem>
    ) => void;

    activeId?: NavigationMenuItemId | null;
    defaultActiveId?: NavigationMenuItemId | null;
    onActiveIdChange?: (
        activeId: NavigationMenuItemId | null
    ) => void;

    focusedId?: NavigationMenuItemId | null;
    defaultFocusedId?: NavigationMenuItemId | null;
    onFocusedIdChange?: (
        focusedId: NavigationMenuItemId | null
    ) => void;

    onItemSelect?: (
        context: NavigationMenuItemSelectContext<TItem>
    ) => void | Promise<void>;

    openOnHover?: boolean;
    hoverOpenDelay?: number;
    hoverCloseDelay?: number;

    loadOnOpen?: boolean;
    preserveChildrenOnReload?: boolean;

    activateOnSelect?: boolean;
    closeOnSelect?: boolean;
}

export interface UseNavigationMenuStateResult<TItem> {
    tree: ReturnType<typeof useTreeState<TItem>>;

    openPath: readonly NavigationMenuItemId[];
    activeId: NavigationMenuItemId | null;
    focusedId: NavigationMenuItemId | null;

    getItem: (
        itemId: NavigationMenuItemId
    ) => TItem | undefined;

    isOpen: (
        itemId: NavigationMenuItemId
    ) => boolean;

    isActive: (
        itemId: NavigationMenuItemId
    ) => boolean;

    isFocused: (
        itemId: NavigationMenuItemId
    ) => boolean;

    isDisabled: (
        itemId: NavigationMenuItemId
    ) => boolean;

    openItem: (
        itemId: NavigationMenuItemId,
        reason?: NavigationMenuOpenReason
    ) => Promise<void>;

    closeItem: (
        itemId: NavigationMenuItemId,
        reason?: NavigationMenuCloseReason
    ) => void;

    toggleItem: (
        itemId: NavigationMenuItemId,
        reason?: NavigationMenuOpenReason
    ) => Promise<void>;

    closeFromDepth: (
        depth: number,
        reason?: NavigationMenuCloseReason
    ) => void;

    closeAfterDepth: (
        depth: number,
        reason?: NavigationMenuCloseReason
    ) => void;

    closeAll: (
        reason?: NavigationMenuCloseReason
    ) => void;

    focusItem: (
        itemId: NavigationMenuItemId
    ) => void;

    selectItem: (
        itemId: NavigationMenuItemId
    ) => Promise<void>;

    scheduleOpen: (
        itemId: NavigationMenuItemId
    ) => void;

    scheduleCloseFromDepth: (
        depth: number
    ) => void;

    cancelHoverOpen: () => void;
    cancelHoverClose: () => void;
    cancelHoverTimers: () => void;
}

export function useNavigationMenuState<TItem>({
    items,
    getItemId,
    isItemBranch,
    getItemChildren,
    loadChildren,
    isItemDisabled,

    openPath: controlledOpenPath,
    defaultOpenPath,
    onOpenPathChange,
    onItemOpenChange,

    activeId: controlledActiveId,
    defaultActiveId = null,
    onActiveIdChange,

    focusedId,
    defaultFocusedId,
    onFocusedIdChange,

    onItemSelect,

    openOnHover = true,
    hoverOpenDelay = 120,
    hoverCloseDelay = 180,

    loadOnOpen = true,
    preserveChildrenOnReload = true,

    activateOnSelect = true,
    closeOnSelect = true,
}: UseNavigationMenuStateOptions<TItem>): UseNavigationMenuStateResult<TItem> {
    const [uncontrolledOpenPath, setUncontrolledOpenPath] =
        useState<NavigationMenuItemId[]>(() =>
            createNavigationMenuOpenPath(defaultOpenPath)
        );

    const [uncontrolledActiveId, setUncontrolledActiveId] =
        useState<NavigationMenuItemId | null>(
            defaultActiveId
        );

    const openPath =
        controlledOpenPath ?? uncontrolledOpenPath;

    const activeId =
        controlledActiveId !== undefined
            ? controlledActiveId
            : uncontrolledActiveId;

    const openPathRef = useRef(openPath);
    const activeIdRef = useRef(activeId);

    openPathRef.current = openPath;
    activeIdRef.current = activeId;

    const expandedIds = useMemo(
        () => new Set(openPath),
        [openPath]
    );

    const selectedIds = useMemo(
        () =>
            activeId === null
                ? new Set<NavigationMenuItemId>()
                : new Set<NavigationMenuItemId>([
                    activeId,
                ]),
        [activeId]
    );

    const tree = useTreeState<TItem>({
        nodes: items,

        getNodeId: getItemId,
        isNodeBranch: isItemBranch,
        getNodeChildren: getItemChildren,
        loadChildren,
        isNodeDisabled: isItemDisabled,

        expandedIds,
        selectedIds,
        selectionMode: "single",

        focusedId,
        defaultFocusedId,
        onFocusedIdChange,

        loadOnExpand: false,
        preserveChildrenOnReload,
    });

    const hoverOpenTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(
            null
        );

    const hoverCloseTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(
            null
        );

    const emitOpenPath = useCallback(
        (
            nextOpenPath: readonly NavigationMenuItemId[]
        ) => {
            const normalized = [...nextOpenPath];

            openPathRef.current = normalized;

            if (controlledOpenPath === undefined) {
                setUncontrolledOpenPath(normalized);
            }

            onOpenPathChange?.(normalized);
        },
        [
            controlledOpenPath,
            onOpenPathChange,
        ]
    );

    const emitActiveId = useCallback(
        (
            nextActiveId: NavigationMenuItemId | null
        ) => {
            activeIdRef.current = nextActiveId;

            if (controlledActiveId === undefined) {
                setUncontrolledActiveId(nextActiveId);
            }

            onActiveIdChange?.(nextActiveId);
        },
        [
            controlledActiveId,
            onActiveIdChange,
        ]
    );

    const getItem = useCallback(
        (
            itemId: NavigationMenuItemId
        ): TItem | undefined => {
            return tree.getNode(itemId);
        },
        [tree]
    );

    const isOpen = useCallback(
        (
            itemId: NavigationMenuItemId
        ): boolean => {
            return openPathRef.current.includes(itemId);
        },
        []
    );

    const isActive = useCallback(
        (
            itemId: NavigationMenuItemId
        ): boolean => {
            return activeIdRef.current === itemId;
        },
        []
    );

    const isFocused = useCallback(
        (
            itemId: NavigationMenuItemId
        ): boolean => {
            return tree.focusedId === itemId;
        },
        [tree.focusedId]
    );

    const isDisabled = useCallback(
        (
            itemId: NavigationMenuItemId
        ): boolean => {
            return tree.isDisabled(itemId);
        },
        [tree]
    );

    const notifyOpenChange = useCallback(
        (
            itemId: NavigationMenuItemId,
            open: boolean,
            reason:
                | NavigationMenuOpenReason
                | NavigationMenuCloseReason
        ) => {
            const indexedItem =
                tree.nodeIndex.get(itemId);

            if (!indexedItem) {
                return;
            }

            onItemOpenChange?.({
                item: indexedItem.node,
                itemId,
                depth: indexedItem.depth,
                open,
                reason,
            });
        },
        [
            onItemOpenChange,
            tree.nodeIndex,
        ]
    );

    const openItem = useCallback(
        async (
            itemId: NavigationMenuItemId,
            reason: NavigationMenuOpenReason =
                "programmatic"
        ): Promise<void> => {
            const indexedItem =
                tree.nodeIndex.get(itemId);

            if (!indexedItem) {
                return;
            }

            const {
                node: item,
                depth,
            } = indexedItem;

            if (
                !isItemBranch(item) ||
                tree.isDisabled(itemId)
            ) {
                return;
            }

            const wasOpen =
                openPathRef.current[depth] === itemId;

            const nextOpenPath =
                setNavigationMenuOpenItemAtDepth(
                    openPathRef.current,
                    depth,
                    itemId
                );

            emitOpenPath(nextOpenPath);

            if (!wasOpen) {
                notifyOpenChange(
                    itemId,
                    true,
                    reason
                );
            }

            if (loadOnOpen) {
                await tree.load(itemId);
            }
        },
        [
            emitOpenPath,
            isItemBranch,
            loadOnOpen,
            notifyOpenChange,
            tree,
        ]
    );

    const closeFromDepth = useCallback(
        (
            depth: number,
            reason: NavigationMenuCloseReason =
                "programmatic"
        ): void => {
            const currentPath =
                openPathRef.current;

            const closingIds =
                currentPath.slice(Math.max(0, depth));

            if (closingIds.length === 0) {
                return;
            }

            const nextOpenPath =
                closeNavigationMenuFromDepth(
                    currentPath,
                    depth
                );

            emitOpenPath(nextOpenPath);

            for (const itemId of closingIds) {
                notifyOpenChange(
                    itemId,
                    false,
                    reason
                );
            }
        },
        [
            emitOpenPath,
            notifyOpenChange,
        ]
    );

    const closeAfterDepth = useCallback(
        (
            depth: number,
            reason: NavigationMenuCloseReason =
                "programmatic"
        ): void => {
            const currentPath =
                openPathRef.current;

            const firstClosingDepth =
                Math.max(0, depth + 1);

            const closingIds =
                currentPath.slice(firstClosingDepth);

            if (closingIds.length === 0) {
                return;
            }

            const nextOpenPath =
                closeNavigationMenuAfterDepth(
                    currentPath,
                    depth
                );

            emitOpenPath(nextOpenPath);

            for (const itemId of closingIds) {
                notifyOpenChange(
                    itemId,
                    false,
                    reason
                );
            }
        },
        [
            emitOpenPath,
            notifyOpenChange,
        ]
    );

    const closeItem = useCallback(
        (
            itemId: NavigationMenuItemId,
            reason: NavigationMenuCloseReason =
                "programmatic"
        ): void => {
            const indexedItem =
                tree.nodeIndex.get(itemId);

            if (!indexedItem) {
                return;
            }

            if (
                openPathRef.current[
                indexedItem.depth
                ] !== itemId
            ) {
                return;
            }

            closeFromDepth(
                indexedItem.depth,
                reason
            );
        },
        [
            closeFromDepth,
            tree.nodeIndex,
        ]
    );

    const closeAll = useCallback(
        (
            reason: NavigationMenuCloseReason =
                "programmatic"
        ): void => {
            closeFromDepth(0, reason);
        },
        [closeFromDepth]
    );

    const toggleItem = useCallback(
        async (
            itemId: NavigationMenuItemId,
            reason: NavigationMenuOpenReason =
                "programmatic"
        ): Promise<void> => {
            if (isOpen(itemId)) {
                closeItem(
                    itemId,
                    reason
                );

                return;
            }

            await openItem(itemId, reason);
        },
        [
            closeItem,
            isOpen,
            openItem,
        ]
    );

    const focusItem = useCallback(
        (
            itemId: NavigationMenuItemId
        ): void => {
            tree.focus(itemId);
        },
        [tree]
    );

    const selectItem = useCallback(
        async (
            itemId: NavigationMenuItemId
        ): Promise<void> => {
            const indexedItem =
                tree.nodeIndex.get(itemId);

            if (!indexedItem) {
                return;
            }

            const {
                node: item,
                depth,
            } = indexedItem;

            if (tree.isDisabled(itemId)) {
                return;
            }

            if (activateOnSelect) {
                emitActiveId(itemId);
            }

            await onItemSelect?.({
                item,
                itemId,
                depth,
            });

            if (closeOnSelect) {
                closeAll("selection");
            }
        },
        [
            activateOnSelect,
            closeAll,
            closeOnSelect,
            emitActiveId,
            onItemSelect,
            tree,
        ]
    );

    const cancelHoverOpen = useCallback(() => {
        if (hoverOpenTimerRef.current === null) {
            return;
        }

        clearTimeout(
            hoverOpenTimerRef.current
        );

        hoverOpenTimerRef.current = null;
    }, []);

    const cancelHoverClose = useCallback(() => {
        if (hoverCloseTimerRef.current === null) {
            return;
        }

        clearTimeout(
            hoverCloseTimerRef.current
        );

        hoverCloseTimerRef.current = null;
    }, []);

    const cancelHoverTimers = useCallback(() => {
        cancelHoverOpen();
        cancelHoverClose();
    }, [
        cancelHoverClose,
        cancelHoverOpen,
    ]);

    const scheduleOpen = useCallback(
        (
            itemId: NavigationMenuItemId
        ): void => {
            if (!openOnHover) {
                return;
            }

            cancelHoverOpen();
            cancelHoverClose();

            hoverOpenTimerRef.current =
                setTimeout(() => {
                    hoverOpenTimerRef.current = null;

                    void openItem(
                        itemId,
                        "hover"
                    );
                }, Math.max(0, hoverOpenDelay));
        },
        [
            cancelHoverClose,
            cancelHoverOpen,
            hoverOpenDelay,
            openItem,
            openOnHover,
        ]
    );

    const scheduleCloseFromDepth =
        useCallback(
            (
                depth: number
            ): void => {
                if (!openOnHover) {
                    return;
                }

                cancelHoverOpen();
                cancelHoverClose();

                hoverCloseTimerRef.current =
                    setTimeout(() => {
                        hoverCloseTimerRef.current = null;

                        closeFromDepth(
                            depth,
                            "hover"
                        );
                    }, Math.max(0, hoverCloseDelay));
            },
            [
                cancelHoverClose,
                cancelHoverOpen,
                closeFromDepth,
                hoverCloseDelay,
                openOnHover,
            ]
        );

    useEffect(() => {
        return () => {
            cancelHoverTimers();
        };
    }, [cancelHoverTimers]);

    useEffect(() => {
        if (!loadOnOpen) {
            return;
        }

        for (const itemId of openPath) {
            const indexedItem =
                tree.nodeIndex.get(itemId);

            if (!indexedItem) {
                continue;
            }

            if (
                !isItemBranch(
                    indexedItem.node
                )
            ) {
                continue;
            }

            if (tree.isDisabled(itemId)) {
                continue;
            }

            const externalChildren =
                getItemChildren?.(
                    indexedItem.node
                );

            if (externalChildren !== undefined) {
                continue;
            }

            const loadState =
                tree.getLoadState(itemId);

            if (loadState.status !== "idle") {
                continue;
            }

            void tree.load(itemId);
        }
    }, [
        getItemChildren,
        isItemBranch,
        loadOnOpen,
        openPath,
        tree.getLoadState,
        tree.isDisabled,
        tree.load,
        tree.nodeIndex,
    ]);

    return {
        tree,

        openPath,
        activeId,
        focusedId: tree.focusedId,

        getItem,

        isOpen,
        isActive,
        isFocused,
        isDisabled,

        openItem,
        closeItem,
        toggleItem,

        closeFromDepth,
        closeAfterDepth,
        closeAll,

        focusItem,
        selectItem,

        scheduleOpen,
        scheduleCloseFromDepth,

        cancelHoverOpen,
        cancelHoverClose,
        cancelHoverTimers,
    };
}