import React from "react";
import { resolveSlot } from "../../helpers/css";
import type { FloatingPlacement } from "../../core/overlay";
import { NavigationMenuPanel } from "./NavigationMenuPanel";
import type {
  NavigationMenuItemId,
  NavigationMenuItemKeyDownContext,
  NavigationMenuItemRenderContext,
  NavigationMenuOrientation,
  NavigationMenuSemantics,
  NavigationMenuSlot,
  NavigationMenuSlotProps,
  NavigationMenuStyles,
} from "./navigationMenu.types";
import { getNavigationMenuErrorMessage } from "./navigationMenu.utils";
import { UseNavigationMenuStateResult } from "./hooks/useNavigationMenuState";

export interface NavigationMenuItemProps<TItem> {
  item: TItem;
  itemId: NavigationMenuItemId;
  depth: number;

  menu: UseNavigationMenuStateResult<TItem>;

  getItemId: (item: TItem) => NavigationMenuItemId;
  getItemLabel: (item: TItem) => React.ReactNode;
  isItemBranch: (item: TItem) => boolean;

  orientation: NavigationMenuOrientation;
  semantics: NavigationMenuSemantics;
  rootPlacement: FloatingPlacement;
  submenuPlacement: FloatingPlacement;
  panelOffset: number;

  onItemFocus?: (context: {
    item: TItem;
    itemId: NavigationMenuItemId;
    depth: number;
  }) => void;

  onItemKeyDown?: (
    context: NavigationMenuItemKeyDownContext<TItem>
  ) => void;

  onInternalKeyDown: (
    context: NavigationMenuItemKeyDownContext<TItem>
  ) => void;

  renderItemIcon?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => React.ReactNode;

  renderIndicator?: (
    context: NavigationMenuItemRenderContext<TItem> & {
      defaultIndicator: React.ReactNode;
    }
  ) => React.ReactNode;

  renderItemLeading?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => React.ReactNode;

  renderItemLabel?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => React.ReactNode;

  renderItemTrailing?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => React.ReactNode;

  renderLoading?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => React.ReactNode;

  renderEmpty?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => React.ReactNode;

  renderError?: (
    context: NavigationMenuItemRenderContext<TItem> & {
      error: unknown;
    }
  ) => React.ReactNode;

  styles?: NavigationMenuStyles;
  slotProps?: NavigationMenuSlotProps;

  registerItemRef: (
    itemId: NavigationMenuItemId,
    element: HTMLButtonElement | null
  ) => void;
}

export function NavigationMenuItem<TItem>({
  item,
  itemId,
  depth,

  menu,

  getItemId,
  getItemLabel,
  isItemBranch,

  orientation,
  semantics,
  rootPlacement,
  submenuPlacement,
  panelOffset,

  onItemFocus,
  onItemKeyDown,
  onInternalKeyDown,

  renderItemIcon,
  renderIndicator,
  renderItemLeading,
  renderItemLabel,
  renderItemTrailing,
  renderLoading,
  renderEmpty,
  renderError,

  styles,
  slotProps,

  registerItemRef,
}: NavigationMenuItemProps<TItem>) {
  const triggerRef =
    React.useRef<HTMLButtonElement | null>(null);

  const branch = isItemBranch(item);
  const open = branch && menu.isOpen(itemId);
  const active = menu.isActive(itemId);
  const focused = menu.isFocused(itemId);
  const disabled = menu.isDisabled(itemId);
  const usesMenuSemantics = semantics === "menubar";
  const loadState = menu.tree.getLoadState(itemId);

  const children = branch
    ? menu.tree.getNodeChildren(item, itemId) ?? []
    : [];

  const loading = loadState.status === "loading";
  const refreshing = loadState.status === "refreshing";
  const loaded = loadState.status === "loaded";
  const failed = loadState.status === "error";
  const empty =
    branch &&
    loaded &&
    children.length === 0;

  const triggerId =
    `navigation-menu-trigger-${String(itemId)}`;

  const panelId =
    `navigation-menu-panel-${String(itemId)}`;

  const openItem = async (): Promise<void> => {
    if (!branch || disabled) {
      return;
    }

    await menu.openItem(itemId, "programmatic");
  };

  const closeItem = (): void => {
    if (!branch || disabled) {
      return;
    }

    menu.closeItem(itemId, "programmatic");
  };

  const toggleItem = async (): Promise<void> => {
    if (!branch || disabled) {
      return;
    }

    await menu.toggleItem(itemId, "click");
  };

  const focusItem = (): void => {
    if (disabled) {
      return;
    }

    menu.focusItem(itemId);

    onItemFocus?.({
      item,
      itemId,
      depth,
    });
  };

  const selectItem = (): void => {
    if (disabled) {
      return;
    }

    if (branch) {
      void toggleItem();
      return;
    }

    void menu.selectItem(itemId);
  };

  const reload = async (): Promise<void> => {
    if (!branch || disabled) {
      return;
    }

    await menu.tree.reload(itemId);
  };

  const renderContext: NavigationMenuItemRenderContext<TItem> = {
    item,
    itemId,
    depth,

    branch,
    open,
    active,
    focused,
    disabled,

    loading,
    refreshing,
    loaded,
    empty,
    failed,

    openItem,
    closeItem,
    toggleItem,

    focusItem,
    selectItem,

    reload,
    retry: reload,
  };

  const itemSlot = resolveSlot<NavigationMenuSlot>({
    slot: depth === 0 ? "item" : "panelItem",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-item": "",
      "data-ui-navigation-menu-item-depth": depth,
      "data-ui-navigation-menu-item-branch":
        branch || undefined,
      "data-ui-navigation-menu-item-open":
        open || undefined,
      "data-ui-navigation-menu-item-active":
        active || undefined,
      "data-ui-navigation-menu-item-focused":
        focused || undefined,
      "data-ui-navigation-menu-item-disabled":
        disabled || undefined,
      "data-ui-navigation-menu-item-loading":
        loading || undefined,
      "data-ui-navigation-menu-item-refreshing":
        refreshing || undefined,
      "data-ui-navigation-menu-item-error":
        failed || undefined,
    },
    baseStyle: {
      position: "relative",
      minWidth: 0,
      listStyle: "none",
    },
  });

  const triggerSlot = resolveSlot<NavigationMenuSlot>({
    slot: depth === 0 ? "trigger" : "panelItemContent",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-trigger": "",
    },
    baseStyle: {
      width: depth === 0 ? "auto" : "100%",
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
      padding:
        depth === 0
          ? "0.5rem 0.7rem"
          : "0.5rem 0.6rem",
      border: 0,
      borderRadius: "var(--ui-radius-md)",
      background: active
        ? "color-mix(in srgb, var(--ui-primary) 12%, transparent)"
        : open
          ? "var(--ui-surface-hover)"
          : "transparent",
      color: active
        ? "var(--ui-text)"
        : "var(--ui-text-muted)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.55 : 1,
      textAlign: "left",
      outline: focused
        ? "2px solid color-mix(in srgb, var(--ui-primary) 45%, transparent)"
        : "none",
      outlineOffset: -2,
    },
  });

  const contentSlot = resolveSlot<NavigationMenuSlot>({
    slot:
      depth === 0
        ? "triggerContent"
        : "panelItemContent",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-item-content": "",
    },
    baseStyle: {
      minWidth: 0,
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "0.45rem",
    },
  });

  const activeSlot = resolveSlot<NavigationMenuSlot>({
    slot:
      depth === 0
        ? "activeTrigger"
        : "panelItemActive",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-active-indicator": "",
    },
    baseStyle: {
      position: "absolute",
      left: depth === 0 ? "0.5rem" : "0.35rem",
      right: depth === 0 ? "0.5rem" : undefined,
      bottom: depth === 0 ? 0 : undefined,
      top: depth === 0 ? undefined : "50%",
      width: depth === 0 ? undefined : 3,
      height: depth === 0 ? 2 : "1.25rem",
      borderRadius: "9999px",
      background: "var(--ui-primary)",
      transform:
        depth === 0
          ? undefined
          : "translateY(-50%)",
      pointerEvents: "none",
    },
  });

  const iconSlot = resolveSlot<NavigationMenuSlot>({
    slot: depth === 0 ? "icon" : "panelIcon",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-icon": "",
    },
    baseStyle: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  });

  const labelSlot = resolveSlot<NavigationMenuSlot>({
    slot: depth === 0 ? "label" : "panelLabel",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-label": "",
    },
    baseStyle: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  });

  const indicatorSlot = resolveSlot<NavigationMenuSlot>({
    slot:
      depth === 0
        ? "indicator"
        : "panelIndicator",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-indicator": "",
    },
    baseStyle: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transform:
        depth === 0 && open
          ? "rotate(180deg)"
          : undefined,
      transition:
        "transform var(--ui-duration-fast) var(--ui-ease-standard)",
    },
  });

  const panelListSlot = resolveSlot<NavigationMenuSlot>({
    slot: "panelList",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-panel-list": "",
    },
    baseStyle: {
      minWidth: 0,
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.15rem",
      listStyle: "none",
    },
  });

  const loadingSlot = resolveSlot<NavigationMenuSlot>({
    slot: "loading",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-loading": "",
    },
    baseStyle: {
      padding: "0.6rem",
      color: "var(--ui-text-soft)",
      fontSize: "var(--ui-font-size-xs)",
    },
  });

  const emptySlot = resolveSlot<NavigationMenuSlot>({
    slot: "empty",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-empty": "",
    },
    baseStyle: {
      padding: "0.6rem",
      color: "var(--ui-text-soft)",
      fontSize: "var(--ui-font-size-xs)",
      fontStyle: "italic",
    },
  });

  const errorSlot = resolveSlot<NavigationMenuSlot>({
    slot: "error",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-error": "",
    },
    baseStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
      padding: "0.6rem",
      color: "var(--ui-danger)",
      fontSize: "var(--ui-font-size-xs)",
    },
  });

  const retrySlot = resolveSlot<NavigationMenuSlot>({
    slot: "retry",
    styles,
    slotProps,
    baseProps: {
      "data-ui-navigation-menu-retry": "",
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
    onMouseEnter: itemOnMouseEnter,
    onMouseLeave: itemOnMouseLeave,
    ...itemSlotRest
  } = itemSlot;

  const {
    onClick: triggerOnClick,
    onFocus: triggerOnFocus,
    onKeyDown: triggerOnKeyDown,
    ...triggerSlotRest
  } = triggerSlot;

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLLIElement>
  ): void => {
    itemOnMouseEnter?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    menu.cancelHoverClose();

    if (branch) {
      menu.scheduleOpen(itemId);
    } else {
      menu.closeAfterDepth(depth - 1, "hover");
    }
  };

  const handleMouseLeave = (
    event: React.MouseEvent<HTMLLIElement>
  ): void => {
    itemOnMouseLeave?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (branch) {
      menu.scheduleCloseFromDepth(depth);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    triggerOnClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    focusItem();

    if (branch) {
      void menu.toggleItem(itemId, "click");
      return;
    }

    void menu.selectItem(itemId);
  };

  const handleFocus = (
    event: React.FocusEvent<HTMLButtonElement>
  ): void => {
    triggerOnFocus?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    focusItem();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ): void => {
    triggerOnKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const context: NavigationMenuItemKeyDownContext<TItem> = {
      event,
      item,
      itemId,
      depth,
    };

    onItemKeyDown?.(context);

    if (event.defaultPrevented) {
      return;
    }

    onInternalKeyDown(context);
  };

  const defaultIndicator = branch ? (
    <span {...indicatorSlot} aria-hidden="true">
      {depth === 0
        ? orientation === "horizontal"
          ? "▾"
          : "▸"
        : "▸"}
    </span>
  ) : null;

  const indicator =
    renderIndicator?.({
      ...renderContext,
      defaultIndicator,
    }) ?? defaultIndicator;

  const icon = renderItemIcon?.(renderContext);

  const leading =
    renderItemLeading?.(
      renderContext
    );

  const label =
    renderItemLabel?.(
      renderContext
    ) ??
    getItemLabel(item);

  const trailing =
    renderItemTrailing?.(
      renderContext
    );

  const loadingContent =
    renderLoading?.(renderContext) ??
    (refreshing ? "Actualizando…" : "Cargando…");

  const emptyContent =
    renderEmpty?.(renderContext) ??
    "Sin opciones";

  const errorContent =
    renderError?.({
      ...renderContext,
      error: loadState.error,
    }) ??
    getNavigationMenuErrorMessage(loadState.error);

  const panelPlacement =
    depth === 0
      ? rootPlacement
      : submenuPlacement;

  return (
    <li
      {...itemSlotRest}
      role={usesMenuSemantics ? "none" : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {active ? <span {...activeSlot} /> : null}

      <button
        {...triggerSlotRest}
        ref={(element) => {
          triggerRef.current = element;
          registerItemRef(itemId, element);
        }}
        id={triggerId}
        type="button"
        role={usesMenuSemantics ? "menuitem" : undefined}
        tabIndex={
          usesMenuSemantics
            ? focused
              ? 0
              : -1
            : undefined
        }
        aria-haspopup={
          branch
            ? usesMenuSemantics
              ? "menu"
              : true
            : undefined
        }
        aria-expanded={branch ? open : undefined}
        aria-controls={
          branch && open ? panelId : undefined
        }
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >

        <>
          <span {...contentSlot}>

            {leading}

            {icon !== undefined ? (
              <span {...iconSlot}>
                {icon}
              </span>
            ) : null}


            <span {...labelSlot}>
              {label}
            </span>

          </span>


          {trailing ?? indicator}

        </>

      </button>

      {branch ? (
        <NavigationMenuPanel
          open={open}
          semantics={semantics}
          depth={depth}
          anchorRef={triggerRef}
          placement={panelPlacement}
          offset={panelOffset}
          panelId={panelId}
          labelledBy={triggerId}
          styles={styles}
          slotProps={slotProps}
          onEscapeDismiss={() => {
            menu.closeItem(itemId, "escape");

            requestAnimationFrame(() => {
              triggerRef.current?.focus();
            });
          }}
          onPointerDownOutsideDismiss={() => {
            menu.closeAll("outside");
          }}
        >
          <ul
            {...panelListSlot}
            role={usesMenuSemantics ? "menu" : undefined}
            aria-labelledby={triggerId}
            onMouseEnter={() => {
              menu.cancelHoverClose();
            }}
            onMouseLeave={() => {
              menu.scheduleCloseFromDepth(depth);
            }}
          >
            {loading && children.length === 0 ? (
              <li role="none">
                <div {...loadingSlot}>
                  {loadingContent}
                </div>
              </li>
            ) : null}

            {children.map((child) => {
              const childId = getItemId(child);

              return (
                <NavigationMenuItem
                  key={childId}
                  item={child}
                  itemId={childId}
                  depth={depth + 1}
                  menu={menu}
                  getItemId={getItemId}
                  getItemLabel={getItemLabel}
                  isItemBranch={isItemBranch}
                  orientation={orientation}
                  semantics={semantics}
                  rootPlacement={rootPlacement}
                  submenuPlacement={submenuPlacement}
                  panelOffset={panelOffset}
                  onItemFocus={onItemFocus}
                  onItemKeyDown={onItemKeyDown}
                  onInternalKeyDown={onInternalKeyDown}
                  renderItemIcon={renderItemIcon}

                  renderItemLeading={
                    renderItemLeading
                  }

                  renderItemLabel={
                    renderItemLabel
                  }

                  renderItemTrailing={
                    renderItemTrailing
                  }

                  renderIndicator={renderIndicator}

                  renderLoading={renderLoading}

                  renderEmpty={renderEmpty}

                  renderError={renderError}
                  styles={styles}
                  slotProps={slotProps}
                  registerItemRef={registerItemRef}
                />
              );
            })}

            {refreshing ? (
              <li role="none">
                <div {...loadingSlot}>
                  {loadingContent}
                </div>
              </li>
            ) : null}

            {empty ? (
              <li role="none">
                <div {...emptySlot}>
                  {emptyContent}
                </div>
              </li>
            ) : null}

            {failed ? (
              <li role="none">
                <div {...errorSlot}>
                  <span>{errorContent}</span>

                  <button
                    {...retrySlot}
                    type="button"
                    onClick={() => {
                      void reload();
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              </li>
            ) : null}
          </ul>
        </NavigationMenuPanel>
      ) : null}
    </li>
  );
}