// src/components/navigation-menu/NavigationMenu.tsx

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
import { resolveSlot } from "../../helpers/css";
import { NavigationMenuItem } from "./NavigationMenuItem";
import { useNavigationMenuState } from "./hooks/useNavigationMenuState";
import type {
  NavigationMenuApi,
  NavigationMenuItemId,
  NavigationMenuItemKeyDownContext,
  NavigationMenuProps,
  NavigationMenuSlot,
} from "./navigationMenu.types";

interface NavigationMenuLevelEntry<TItem> {
  item: TItem;
  itemId: NavigationMenuItemId;
}

function getFirstEnabledItem<TItem>(
  entries: readonly NavigationMenuLevelEntry<TItem>[],
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuLevelEntry<TItem> | undefined {
  return entries.find(
    ({ item, itemId }) =>
      !isDisabled(item, itemId)
  );
}

function getLastEnabledItem<TItem>(
  entries: readonly NavigationMenuLevelEntry<TItem>[],
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuLevelEntry<TItem> | undefined {
  for (
    let index = entries.length - 1;
    index >= 0;
    index -= 1
  ) {
    const entry = entries[index];

    if (!isDisabled(entry.item, entry.itemId)) {
      return entry;
    }
  }

  return undefined;
}

function getNextEnabledItem<TItem>(
  entries: readonly NavigationMenuLevelEntry<TItem>[],
  currentId: NavigationMenuItemId,
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuLevelEntry<TItem> | undefined {
  if (entries.length === 0) {
    return undefined;
  }

  const currentIndex = entries.findIndex(
    ({ itemId }) => itemId === currentId
  );

  if (currentIndex < 0) {
    return getFirstEnabledItem(
      entries,
      isDisabled
    );
  }

  for (
    let offset = 1;
    offset <= entries.length;
    offset += 1
  ) {
    const nextIndex =
      (currentIndex + offset) % entries.length;

    const entry = entries[nextIndex];

    if (!isDisabled(entry.item, entry.itemId)) {
      return entry;
    }
  }

  return undefined;
}

function getPreviousEnabledItem<TItem>(
  entries: readonly NavigationMenuLevelEntry<TItem>[],
  currentId: NavigationMenuItemId,
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuLevelEntry<TItem> | undefined {
  if (entries.length === 0) {
    return undefined;
  }

  const currentIndex = entries.findIndex(
    ({ itemId }) => itemId === currentId
  );

  if (currentIndex < 0) {
    return getLastEnabledItem(
      entries,
      isDisabled
    );
  }

  for (
    let offset = 1;
    offset <= entries.length;
    offset += 1
  ) {
    const previousIndex =
      (
        currentIndex -
        offset +
        entries.length
      ) % entries.length;

    const entry = entries[previousIndex];

    if (!isDisabled(entry.item, entry.itemId)) {
      return entry;
    }
  }

  return undefined;
}

function NavigationMenuInner<TItem>(
  {
    items,

    getItemId,
    getItemLabel,
    isItemBranch,
    getItemChildren,
    loadChildren,
    isItemDisabled,

    orientation = "horizontal",
    semantics = "navigation",

    openPath,
    defaultOpenPath,
    onOpenPathChange,
    onItemOpenChange,

    activeId,
    defaultActiveId,
    onActiveIdChange,

    focusedId,
    defaultFocusedId,
    onFocusedIdChange,

    onItemSelect,
    onItemFocus,
    onItemKeyDown,

    openOnHover = true,
    hoverOpenDelay = 120,
    hoverCloseDelay = 1200,

    loadOnOpen = true,
    preserveChildrenOnReload = true,

    closeOnSelect = true,
    activateOnSelect = true,

    rootPlacement = "bottom-start",
    submenuPlacement = "right-start",
    panelOffset = 6,

    renderItemIcon,
    renderIndicator,
    renderLoading,
    renderItemLeading,
    renderItemLabel,
    renderItemTrailing,
    renderEmpty,
    renderError,

    emptyContent = "Sin opciones",

    styles,
    slotProps,
    apiRef,

    className = "",
    style,

    ...rest
  }: NavigationMenuProps<TItem>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {

  const usesMenuSemantics = semantics === "menubar";
  const menu = useNavigationMenuState<TItem>({
    items,

    getItemId,
    isItemBranch,
    getItemChildren,
    loadChildren,
    isItemDisabled,

    openPath,
    defaultOpenPath,
    onOpenPathChange,
    onItemOpenChange,

    activeId,
    defaultActiveId,
    onActiveIdChange,

    focusedId,
    defaultFocusedId,
    onFocusedIdChange,

    onItemSelect,

    openOnHover,
    hoverOpenDelay,
    hoverCloseDelay,

    loadOnOpen,
    preserveChildrenOnReload,

    activateOnSelect,
    closeOnSelect,
  });

  const rootTabStopId = useMemo(() => {
    if (!usesMenuSemantics) {
      return null;
    }

    const focusedRootItem =
      items.find((item) => {
        const itemId = getItemId(item);

        return (
          itemId === menu.focusedId &&
          !menu.isDisabled(itemId)
        );
      });

    if (focusedRootItem) {
      return getItemId(focusedRootItem);
    }

    const firstEnabledItem =
      items.find((item) => {
        const itemId = getItemId(item);

        return !menu.isDisabled(itemId);
      });

    return firstEnabledItem
      ? getItemId(firstEnabledItem)
      : null;
  }, [
    getItemId,
    items,
    menu.focusedId,
    menu.isDisabled,
    usesMenuSemantics,
  ]);

  const itemRefs = useRef(
    new Map<
      NavigationMenuItemId,
      HTMLButtonElement
    >()
  );

  const shouldMoveDomFocusRef =
    useRef(false);

  const registerItemRef = useCallback(
    (
      itemId: NavigationMenuItemId,
      element: HTMLButtonElement | null
    ): void => {
      if (element) {
        itemRefs.current.set(
          itemId,
          element
        );

        return;
      }

      itemRefs.current.delete(itemId);
    },
    []
  );

  const moveFocus = useCallback(
    (
      itemId: NavigationMenuItemId
    ): void => {
      shouldMoveDomFocusRef.current = true;
      menu.focusItem(itemId);
    },
    [menu.focusItem]
  );

  useEffect(() => {
    if (!shouldMoveDomFocusRef.current) {
      return;
    }

    shouldMoveDomFocusRef.current = false;

    if (menu.focusedId === null) {
      return;
    }

    itemRefs.current
      .get(menu.focusedId)
      ?.focus();
  }, [menu.focusedId]);

  const isIndexedItemDisabled =
    useCallback(
      (
        item: TItem,
        itemId: NavigationMenuItemId
      ): boolean => {
        if (isItemDisabled?.(item)) {
          return true;
        }

        return menu.isDisabled(itemId);
      },
      [
        isItemDisabled,
        menu.isDisabled,
      ]
    );

  const getLevelEntries = useCallback(
    (
      parentId: NavigationMenuItemId | null
    ): NavigationMenuLevelEntry<TItem>[] => {
      if (parentId === null) {
        return items.map((item) => ({
          item,
          itemId: getItemId(item),
        }));
      }

      const parentEntry =
        menu.tree.nodeIndex.get(parentId);

      if (!parentEntry) {
        return [];
      }

      const children =
        menu.tree.getNodeChildren(
          parentEntry.node,
          parentId
        ) ?? [];

      return children.map((item) => ({
        item,
        itemId: getItemId(item),
      }));
    },
    [
      getItemId,
      items,
      menu.tree.getNodeChildren,
      menu.tree.nodeIndex,
    ]
  );

  const getSiblingEntries = useCallback(
    (
      itemId: NavigationMenuItemId
    ): NavigationMenuLevelEntry<TItem>[] => {
      const indexedItem =
        menu.tree.nodeIndex.get(itemId);

      if (!indexedItem) {
        return [];
      }

      return getLevelEntries(
        indexedItem.parentId
      );
    },
    [
      getLevelEntries,
      menu.tree.nodeIndex,
    ]
  );

  const getChildEntries = useCallback(
    (
      itemId: NavigationMenuItemId
    ): NavigationMenuLevelEntry<TItem>[] => {
      return getLevelEntries(itemId);
    },
    [getLevelEntries]
  );

  const focusFirstChild = useCallback(
    (
      itemId: NavigationMenuItemId
    ): void => {
      const child = getFirstEnabledItem(
        getChildEntries(itemId),
        isIndexedItemDisabled
      );

      if (child) {
        moveFocus(child.itemId);
      }
    },
    [
      getChildEntries,
      isIndexedItemDisabled,
      moveFocus,
    ]
  );

  const focusLastChild = useCallback(
    (
      itemId: NavigationMenuItemId
    ): void => {
      const child = getLastEnabledItem(
        getChildEntries(itemId),
        isIndexedItemDisabled
      );

      if (child) {
        moveFocus(child.itemId);
      }
    },
    [
      getChildEntries,
      isIndexedItemDisabled,
      moveFocus,
    ]
  );

  const openAndFocusFirstChild =
    useCallback(
      async (
        itemId: NavigationMenuItemId
      ): Promise<void> => {
        await menu.openItem(
          itemId,
          "keyboard"
        );

        requestAnimationFrame(() => {
          focusFirstChild(itemId);
        });
      },
      [
        focusFirstChild,
        menu.openItem,
      ]
    );

  const openAndFocusLastChild =
    useCallback(
      async (
        itemId: NavigationMenuItemId
      ): Promise<void> => {
        await menu.openItem(
          itemId,
          "keyboard"
        );

        requestAnimationFrame(() => {
          focusLastChild(itemId);
        });
      },
      [
        focusLastChild,
        menu.openItem,
      ]
    );

  const focusNextSibling = useCallback(
    (
      itemId: NavigationMenuItemId
    ): void => {
      const next = getNextEnabledItem(
        getSiblingEntries(itemId),
        itemId,
        isIndexedItemDisabled
      );

      if (next) {
        moveFocus(next.itemId);
      }
    },
    [
      getSiblingEntries,
      isIndexedItemDisabled,
      moveFocus,
    ]
  );

  const focusPreviousSibling =
    useCallback(
      (
        itemId: NavigationMenuItemId
      ): void => {
        const previous =
          getPreviousEnabledItem(
            getSiblingEntries(itemId),
            itemId,
            isIndexedItemDisabled
          );

        if (previous) {
          moveFocus(previous.itemId);
        }
      },
      [
        getSiblingEntries,
        isIndexedItemDisabled,
        moveFocus,
      ]
    );

  const focusFirstSibling = useCallback(
    (
      itemId: NavigationMenuItemId
    ): void => {
      const first = getFirstEnabledItem(
        getSiblingEntries(itemId),
        isIndexedItemDisabled
      );

      if (first) {
        moveFocus(first.itemId);
      }
    },
    [
      getSiblingEntries,
      isIndexedItemDisabled,
      moveFocus,
    ]
  );

  const focusLastSibling = useCallback(
    (
      itemId: NavigationMenuItemId
    ): void => {
      const last = getLastEnabledItem(
        getSiblingEntries(itemId),
        isIndexedItemDisabled
      );

      if (last) {
        moveFocus(last.itemId);
      }
    },
    [
      getSiblingEntries,
      isIndexedItemDisabled,
      moveFocus,
    ]
  );

  const closeCurrentLevel = useCallback(
    (
      itemId: NavigationMenuItemId
    ): void => {
      const indexedItem =
        menu.tree.nodeIndex.get(itemId);

      if (
        !indexedItem ||
        indexedItem.parentId === null
      ) {
        menu.closeAll("escape");
        return;
      }

      const parentId =
        indexedItem.parentId;

      menu.closeItem(
        parentId,
        "escape"
      );

      requestAnimationFrame(() => {
        moveFocus(parentId);
      });
    },
    [
      menu.closeAll,
      menu.closeItem,
      menu.tree.nodeIndex,
      moveFocus,
    ]
  );

  const handleInternalKeyDown =
    useCallback(
      ({
        event,
        item,
        itemId,
        depth,
      }: NavigationMenuItemKeyDownContext<TItem>): void => {
        const branch =
          isItemBranch(item);

        const open =
          branch &&
          menu.isOpen(itemId);

        switch (event.key) {
          case "Home": {
            event.preventDefault();
            focusFirstSibling(itemId);
            return;
          }

          case "End": {
            event.preventDefault();
            focusLastSibling(itemId);
            return;
          }

          case "ArrowDown": {
            event.preventDefault();

            if (
              depth === 0 &&
              orientation === "horizontal"
            ) {
              if (branch) {
                void openAndFocusFirstChild(
                  itemId
                );
              }

              return;
            }

            focusNextSibling(itemId);
            return;
          }

          case "ArrowUp": {
            event.preventDefault();

            if (
              depth === 0 &&
              orientation === "horizontal"
            ) {
              if (branch) {
                void openAndFocusLastChild(
                  itemId
                );
              }

              return;
            }

            focusPreviousSibling(itemId);
            return;
          }

          case "ArrowRight": {
            event.preventDefault();

            if (
              depth === 0 &&
              orientation === "horizontal"
            ) {
              focusNextSibling(itemId);
              return;
            }

            if (branch) {
              if (open) {
                focusFirstChild(itemId);
              } else {
                void openAndFocusFirstChild(
                  itemId
                );
              }
            }

            return;
          }

          case "ArrowLeft": {
            event.preventDefault();

            if (
              depth === 0 &&
              orientation === "horizontal"
            ) {
              focusPreviousSibling(itemId);
              return;
            }

            closeCurrentLevel(itemId);
            return;
          }

          case "Enter":
          case " ": {
            event.preventDefault();

            if (branch) {
              if (open) {
                menu.closeItem(
                  itemId,
                  "keyboard"
                );
              } else {
                void menu.openItem(
                  itemId,
                  "keyboard"
                );
              }

              return;
            }

            void menu.selectItem(itemId);
            return;
          }

          case "Escape": {
            event.preventDefault();

            if (depth === 0) {
              menu.closeAll("escape");
              return;
            }

            closeCurrentLevel(itemId);
            return;
          }

          default:
            return;
        }
      },
      [
        closeCurrentLevel,
        focusFirstChild,
        focusFirstSibling,
        focusLastSibling,
        focusNextSibling,
        focusPreviousSibling,
        isItemBranch,
        menu.closeAll,
        menu.closeItem,
        menu.isOpen,
        menu.openItem,
        menu.selectItem,
        openAndFocusFirstChild,
        openAndFocusLastChild,
        orientation,
      ]
    );

  const api = useMemo<
    NavigationMenuApi<TItem>
  >(
    () => ({
      getItem: menu.getItem,

      getOpenPath: () =>
        menu.openPath,

      getActiveId: () =>
        menu.activeId,

      getFocusedId: () =>
        menu.focusedId,

      getLoadState:
        menu.tree.getLoadState,

      isOpen: menu.isOpen,

      open: async (itemId) => {
        await menu.openItem(
          itemId,
          "programmatic"
        );
      },

      close: (itemId) => {
        menu.closeItem(
          itemId,
          "programmatic"
        );
      },

      toggle: async (itemId) => {
        await menu.toggleItem(
          itemId,
          "programmatic"
        );
      },

      closeFromDepth: (depth) => {
        menu.closeFromDepth(
          depth,
          "programmatic"
        );
      },

      closeAll: () => {
        menu.closeAll(
          "programmatic"
        );
      },

      focus: moveFocus,

      select: (itemId) => {
        void menu.selectItem(itemId);
      },

      load: menu.tree.load,
      reload: menu.tree.reload,

      invalidate:
        menu.tree.invalidate,

      invalidateAll:
        menu.tree.invalidateAll,

      setChildren:
        menu.tree.setChildren,
    }),
    [
      menu.activeId,
      menu.closeAll,
      menu.closeFromDepth,
      menu.closeItem,
      moveFocus,
      menu.focusedId,
      menu.getItem,
      menu.isOpen,
      menu.openItem,
      menu.openPath,
      menu.selectItem,
      menu.toggleItem,
      menu.tree.getLoadState,
      menu.tree.invalidate,
      menu.tree.invalidateAll,
      menu.tree.load,
      menu.tree.reload,
      menu.tree.setChildren,
    ]
  );

  useImperativeHandle(
    apiRef,
    () => api,
    [api]
  );

  const rootSlot =
    resolveSlot<NavigationMenuSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        role: usesMenuSemantics ? undefined : "navigation",
        "data-ui-navigation-menu": "",
        "data-ui-navigation-menu-orientation":
          orientation,
        "data-ui-navigation-menu-open":
          menu.openPath.length > 0
            ? ""
            : undefined,
        "data-ui-navigation-menu-empty":
          items.length === 0
            ? ""
            : undefined,
      },
      baseStyle: {
        minWidth: 0,
        position: "relative",
      },
    });

  const listSlot =
    resolveSlot<NavigationMenuSlot>({
      slot: "list",
      styles,
      slotProps,
      baseProps: {
        "data-ui-navigation-menu-list":
          "",
      },
      baseStyle: {
        minWidth: 0,
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection:
          orientation === "horizontal"
            ? "row"
            : "column",
        alignItems:
          orientation === "horizontal"
            ? "center"
            : "stretch",
        gap: "0.2rem",
        listStyle: "none",
      },
    });

  const emptySlot =
    resolveSlot<NavigationMenuSlot>({
      slot: "empty",
      styles,
      slotProps,
      baseProps: {
        "data-ui-navigation-menu-root-empty":
          "",
      },
      baseStyle: {
        padding: "0.75rem",
        color: "var(--ui-text-soft)",
        fontSize:
          "var(--ui-font-size-sm)",
        fontStyle: "italic",
      },
    });

  return (
    <div
      {...rootSlot}
      {...rest}
      ref={forwardedRef}
    >
      {items.length === 0 ? (
        <div {...emptySlot}>
          {emptyContent}
        </div>
      ) : (
        <ul
          {...listSlot}
          role={usesMenuSemantics ? "menubar" : undefined}
          aria-orientation={usesMenuSemantics ? orientation : undefined}
          onMouseEnter={() => {
            menu.cancelHoverClose();
          }}
          onMouseLeave={() => {
            menu.scheduleCloseFromDepth(0);
          }}
        >
          {items.map((item) => {
            const itemId =
              getItemId(item);

            return (
              <NavigationMenuItem
                key={itemId}
                item={item}
                itemId={itemId}
                depth={0}
                rootTabStopId={rootTabStopId}
                menu={menu}
                getItemId={getItemId}
                getItemLabel={
                  getItemLabel
                }
                isItemBranch={
                  isItemBranch
                }
                orientation={
                  orientation
                }
                semantics={
                  semantics
                }
                rootPlacement={
                  rootPlacement
                }
                submenuPlacement={
                  submenuPlacement
                }
                panelOffset={
                  panelOffset
                }
                onItemFocus={
                  onItemFocus
                }
                onItemKeyDown={
                  onItemKeyDown
                }
                onInternalKeyDown={
                  handleInternalKeyDown
                }
                renderItemIcon={
                  renderItemIcon
                }
                renderIndicator={
                  renderIndicator
                }
                renderItemLeading={
                  renderItemLeading
                }

                renderItemLabel={
                  renderItemLabel
                }

                renderItemTrailing={
                  renderItemTrailing
                }
                renderLoading={
                  renderLoading
                }
                renderEmpty={
                  renderEmpty
                }
                renderError={
                  renderError
                }
                styles={styles}
                slotProps={slotProps}
                registerItemRef={
                  registerItemRef
                }
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

const ForwardedNavigationMenu =
  forwardRef(NavigationMenuInner);

ForwardedNavigationMenu.displayName =
  "NavigationMenu";

export const NavigationMenu =
  ForwardedNavigationMenu as <TItem>(
    props: NavigationMenuProps<TItem> &
      RefAttributes<HTMLDivElement>
  ) => ReactElement | null;