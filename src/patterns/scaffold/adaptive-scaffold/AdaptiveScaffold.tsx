// src/patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx
import React from "react";
import { Box } from "../../../primitives/layout";
import {
  BottomNavigation,
  NavigationList,
  NavigationRail,
  type NavigationItemDef,
} from "../../../primitives/navigation";
import { MobileScaffold } from "../MobileScaffold";
import { ScreenContent } from "../ScreenContent";
import { TopAppBar } from "../TopAppBar";
import type {
  AdaptiveScaffoldItem,
  AdaptiveScaffoldProps,
  AdaptiveScaffoldRenderContext,
} from "./adaptiveScaffold.types";
import {
  adaptiveItemToNavigationItem,
  cssSize,
  findAdaptiveScaffoldItem,
  getFirstSelectableAdaptiveScaffoldItem,
  isAdaptiveScaffoldItemSelectable,
  navigationItemToAdaptiveItem,
  resolveAdaptiveScaffoldMode,
  resolveAdaptiveValue,
} from "./adaptiveScaffold.utils";

function useElementWidth<TElement extends HTMLElement>() {
  const ref = React.useRef<TElement | null>(null);
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      setWidth(node.getBoundingClientRect().width);
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);

      return () => {
        window.removeEventListener("resize", update);
      };
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, width] as const;
}

function renderContent({
  children,
  activeItem,
  context,
}: {
  children: AdaptiveScaffoldProps["children"];
  activeItem: AdaptiveScaffoldItem | null;
  context: AdaptiveScaffoldRenderContext;
}) {
  if (typeof children === "function") {
    return children(context);
  }

  if (children !== undefined) {
    return children;
  }

  if (activeItem?.render) {
    return activeItem.render(context);
  }

  if (activeItem?.content !== undefined) {
    return activeItem.content;
  }

  return (
    <ScreenContent centered padded>
      <Box
        style={{
          color: "var(--ui-text-muted)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        AdaptiveScaffold no tiene contenido para el item activo.
      </Box>
    </ScreenContent>
  );
}

export function AdaptiveScaffold({
  children,

  viewport = "window",
  mode = "auto",

  items,

  activeId,
  defaultActiveId,
  onActiveIdChange,

  mobileBreakpoint = 640,
  tabletBreakpoint = 1024,

  mobileNavigation = "bottom",
  tabletNavigation = "rail",
  desktopNavigation = "sidebar",

  title,
  subtitle,

  leading,
  actions,
  floating,

  showAppBar = true,

  topAppBarProps,
  mobileScaffoldProps,
  bottomNavigationProps,
  navigationRailProps,
  navigationListProps,

  sidebarWidth = 284,

  className = "",
  style,

  bodyStyle,
  contentStyle,
  sidebarStyle,
  railContainerStyle,

  ...rest
}: AdaptiveScaffoldProps) {
  const [rootRef, measuredWidth] = useElementWidth<HTMLDivElement>();

  const fallbackItem = React.useMemo(
    () => getFirstSelectableAdaptiveScaffoldItem(items),
    [items]
  );

  const initialActiveIdRef = React.useRef<string>(
    activeId ?? defaultActiveId ?? fallbackItem?.id ?? ""
  );

  const isControlled = activeId !== undefined;

  const [internalActiveId, setInternalActiveId] = React.useState(
    initialActiveIdRef.current
  );

  const currentActiveId = isControlled
    ? activeId ?? fallbackItem?.id ?? ""
    : internalActiveId;

  const activeItem = React.useMemo(
    () => findAdaptiveScaffoldItem(items, currentActiveId),
    [currentActiveId, items]
  );

  const resolvedMode = resolveAdaptiveScaffoldMode({
    mode,
    width: measuredWidth,
    mobileBreakpoint,
    tabletBreakpoint,
  });

  const setActiveItem = React.useCallback(
    (item: AdaptiveScaffoldItem) => {
      if (!isAdaptiveScaffoldItemSelectable(item)) return;

      if (!isControlled) {
        setInternalActiveId(item.id);
      }

      onActiveIdChange?.(item.id, item);
    },
    [isControlled, onActiveIdChange]
  );

  const setActiveId = React.useCallback(
    (nextId: string) => {
      const item = findAdaptiveScaffoldItem(items, nextId);
      if (!item) return;

      setActiveItem(item);
    },
    [items, setActiveItem]
  );

  const context = React.useMemo<AdaptiveScaffoldRenderContext>(
    () => ({
      mode: resolvedMode,
      activeId: currentActiveId,
      activeItem,
      items,
      setActiveId,
    }),
    [activeItem, currentActiveId, items, resolvedMode, setActiveId]
  );

  const resolvedTitle =
    resolveAdaptiveValue(title, context) ?? activeItem?.label ?? currentActiveId;

  const resolvedSubtitle = resolveAdaptiveValue(subtitle, context);

  const appBar = showAppBar ? (
    <TopAppBar
      title={resolvedTitle}
      subtitle={resolvedSubtitle}
      centerTitle={resolvedMode === "mobile"}
      variant="blur"
      leading={resolveAdaptiveValue(leading, context)}
      actions={resolveAdaptiveValue(actions, context)}
      {...topAppBarProps}
    />
  ) : null;

  const content = renderContent({
    children,
    activeItem,
    context,
  });

  const topLevelItems = items;

  const bottomNavigation =
    mobileNavigation === "bottom" || tabletNavigation === "bottom" ? (
      <BottomNavigation
        position="static"
        safeArea={false}
        variant="floating"
        indicator="pill"
        labelBehavior="active"
        density="comfortable"
        {...bottomNavigationProps}
        value={currentActiveId}
        onValueChange={(next) => {
          setActiveId(next);
        }}
      >
        {topLevelItems.map((item) => (
          <BottomNavigation.Item
            key={item.id}
            value={item.id}
            icon={item.icon}
            badge={item.badge}
            disabled={item.disabled || !isAdaptiveScaffoldItemSelectable(item)}
          >
            {item.label}
          </BottomNavigation.Item>
        ))}
      </BottomNavigation>
    ) : null;

  const railNavigation =
    tabletNavigation === "rail" || desktopNavigation === "rail" ? (
      <NavigationRail
        position="static"
        variant="surface"
        indicator="pill"
        labelBehavior="active"
        density="comfortable"
        badgeAnchor="icon"
        badgePlacement="top-end"
        activeIconScale={1.08}
        {...navigationRailProps}
        value={currentActiveId}
        onValueChange={(next) => {
          setActiveId(next);
        }}
      >
        {topLevelItems.map((item) => (
          <NavigationRail.Item
            key={item.id}
            value={item.id}
            icon={item.icon}
            badge={item.badge}
            disabled={item.disabled || !isAdaptiveScaffoldItemSelectable(item)}
          >
            {item.label}
          </NavigationRail.Item>
        ))}
      </NavigationRail>
    ) : null;

  const navigationListItems = React.useMemo(
    () => items.map(adaptiveItemToNavigationItem),
    [items]
  );

  const handleNavigationListSelect = React.useCallback(
    (item: NavigationItemDef) => {
      const adaptiveItem = navigationItemToAdaptiveItem(item);
      if (!adaptiveItem) return;

      setActiveItem(adaptiveItem);
    },
    [setActiveItem]
  );

  if (resolvedMode === "mobile") {
    return (
      <Box
        ref={rootRef}
        className={className}
        data-ui-adaptive-scaffold=""
        data-ui-adaptive-scaffold-mode={resolvedMode}
        data-ui-adaptive-scaffold-viewport={viewport}
        {...rest}
        style={{
          width: "100%",
          height: viewport === "contained" ? "100%" : "100dvh",
          minHeight: viewport === "contained" ? 0 : "100dvh",
          minWidth: 0,
          overflow: "hidden",
          ...style,
        }}
      >
        <MobileScaffold
          viewport={viewport}
          appBar={appBar}
          bottomNavigation={
            mobileNavigation === "bottom" ? bottomNavigation : undefined
          }
          floating={resolveAdaptiveValue(floating, context)}
          scrollable={false}
          padded={false}
          {...mobileScaffoldProps}
        >
          <Box
            style={{
              width: "100%",
              height: "100%",
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              ...contentStyle,
            }}
          >
            {content}
          </Box>
        </MobileScaffold>
      </Box>
    );
  }

  const showTabletRail = resolvedMode === "tablet" && tabletNavigation === "rail";
  const showTabletBottom =
    resolvedMode === "tablet" && tabletNavigation === "bottom";

  const showDesktopSidebar =
    resolvedMode === "desktop" && desktopNavigation === "sidebar";
  const showDesktopRail = resolvedMode === "desktop" && desktopNavigation === "rail";

  return (
    <Box
      ref={rootRef}
      className={className}
      data-ui-adaptive-scaffold=""
      data-ui-adaptive-scaffold-mode={resolvedMode}
      data-ui-adaptive-scaffold-viewport={viewport}
      {...rest}
      style={{
        width: "100%",
        height: viewport === "contained" ? "100%" : "100dvh",
        minHeight: viewport === "contained" ? 0 : "100dvh",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--ui-bg)",
        color: "var(--ui-text)",
        ...style,
      }}
    >
      {appBar}

      <Box
        data-ui-adaptive-scaffold-body=""
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          overflow: "hidden",
          ...bodyStyle,
        }}
      >
        {showTabletRail || showDesktopRail ? (
          <Box
            data-ui-adaptive-scaffold-rail=""
            style={{
              flex: "0 0 auto",
              minHeight: 0,
              borderRight: "1px solid var(--ui-border)",
              ...railContainerStyle,
            }}
          >
            {railNavigation}
          </Box>
        ) : null}

        {showDesktopSidebar ? (
          <Box
            data-ui-adaptive-scaffold-sidebar=""
            style={{
              width: cssSize(sidebarWidth),
              minWidth: cssSize(sidebarWidth),
              maxWidth: cssSize(sidebarWidth),
              minHeight: 0,
              overflow: "auto",
              padding: "0.75rem",
              boxSizing: "border-box",
              borderRight: "1px solid var(--ui-border)",
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface) 94%, transparent), color-mix(in srgb, var(--ui-surface-2) 94%, transparent))",
              ...sidebarStyle,
            }}
          >
            <NavigationList
              items={navigationListItems}
              activeId={currentActiveId}
              activeBehavior="contains"
              openActiveParents
              {...navigationListProps}
              onSelect={(item) => {
                handleNavigationListSelect(item);
              }}
            />
          </Box>
        ) : null}

        <Box
          data-ui-adaptive-scaffold-content=""
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            ...contentStyle,
          }}
        >
          {content}
        </Box>
      </Box>

      {showTabletBottom ? bottomNavigation : null}
    </Box>
  );
}

AdaptiveScaffold.displayName = "AdaptiveScaffold";