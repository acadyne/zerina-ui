// src/patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx
import React from "react";
import {
  resolveMergedSlot,
  resolveSlot,
} from "../../../helpers/css";
import {
  DEFAULT_UI_VIEWPORT_BREAKPOINTS,
  useOptionalUIViewport,
} from "../../../core/viewport";
import { useElementSize } from "../../../core/dom";
import { Box } from "../../../primitives/layout";
import {
  BottomNavigation,
  NavigationList,
  NavigationRail,
  type NavigationItemDef,
} from "../../../primitives/navigation";
import { Scaffold } from "../Scaffold";
import { ScreenContent } from "../ScreenContent";
import { TopAppBar } from "../TopAppBar";
import type {
  AdaptiveScaffoldItem,
  AdaptiveScaffoldProps,
  AdaptiveScaffoldRenderContext,
  AdaptiveScaffoldSlot,
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

function getModeContentSlot(
  mode: AdaptiveScaffoldRenderContext["mode"]
): AdaptiveScaffoldSlot {
  if (mode === "mobile") return "mobileContent";
  if (mode === "tablet") return "tabletContent";

  return "desktopContent";
}

function getContentSlot(
  mode: AdaptiveScaffoldRenderContext["mode"],
  styles: AdaptiveScaffoldProps["styles"],
  slotProps: AdaptiveScaffoldProps["slotProps"]
) {
  const modeSlot = getModeContentSlot(mode);

  return resolveMergedSlot({
    slots: ["content", modeSlot],
    styles,
    slotProps,
  });
}

export function AdaptiveScaffold({
  children,

  viewport = "window",
  mode = "auto",

  items,

  activeId,
  defaultActiveId,
  onActiveIdChange,

  mobileNavigation = "bottom",
  tabletNavigation = "rail",
  desktopNavigation = "sidebar",

  navigationSlots,
  title,
  subtitle,

  leading,
  actions,
  floating,

  showAppBar = true,

  topAppBarProps,
  scaffoldProps,
  bottomNavigationProps,
  navigationRailProps,
  navigationListProps,

  sidebarWidth = 284,

  className = "",
  style,

  styles,
  slotProps,

  ...rest
}: AdaptiveScaffoldProps) {
  const viewportInfo = useOptionalUIViewport();
  const [rootRef, rootSize] = useElementSize<HTMLDivElement>();

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

  const responsiveWidth =
    viewport === "contained"
      ? rootSize.width
      : viewportInfo?.width ?? rootSize.width;

  const resolvedMode = resolveAdaptiveScaffoldMode({
    mode,
    width: responsiveWidth,
    fallbackKind: viewportInfo?.kind ?? "mobile",
    breakpoints:
      viewportInfo?.breakpoints ?? DEFAULT_UI_VIEWPORT_BREAKPOINTS,
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
    resolveAdaptiveValue(title, context) ??
    activeItem?.label ??
    currentActiveId;

  const resolvedSubtitle = resolveAdaptiveValue(subtitle, context);

  const rootSlot = resolveSlot({
    slot: "root",
    styles,
    slotProps,
    className,
    baseStyle: {
      width: "100%",
      height: viewport === "contained" ? "100%" : "100dvh",
      minHeight: viewport === "contained" ? 0 : "100dvh",
      minWidth: 0,
      overflow: "hidden",
      background: "var(--ui-bg)",
      color: "var(--ui-text)",
    },
  });

  const appBarSlot = resolveSlot({
    slot: "appBar",
    styles,
    slotProps,
    baseStyle: {
      width: "100%",
      minWidth: 0,
      flexShrink: 0,
    },
  });

  const bodySlot = resolveSlot({
    slot: "body",
    styles,
    slotProps,
    baseStyle: {
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      display: "flex",
      overflow: "hidden",
    },
  });

  const sidebarSlot = resolveSlot({
    slot: "sidebar",
    styles,
    slotProps,
    baseStyle: {
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
    },
  });

  const railSlot = resolveSlot({
    slot: "rail",
    styles,
    slotProps,
    baseStyle: {
      flex: "0 0 auto",
      minHeight: 0,
      borderRight: "1px solid var(--ui-border)",
    },
  });

  const contentSlot = getContentSlot(resolvedMode, styles, slotProps);

  const resolvedNavigation =
    navigationSlots?.[resolvedMode];

  const navigationPlacement =
    resolvedNavigation?.placement ??
    (
      resolvedMode === "mobile"
        ? "bottom"
        : "start"
    );

  const customNavigation =
    resolvedNavigation?.content;

  const hasCustomNavigation =
    customNavigation !== undefined &&
    customNavigation !== null;

  const appBar = showAppBar ? (
    <Box
      {...appBarSlot}
      data-ui-adaptive-scaffold-app-bar=""
    >
      <TopAppBar
        title={resolvedTitle}
        subtitle={resolvedSubtitle}
        centerTitle={resolvedMode === "mobile"}
        variant="blur"
        leading={resolveAdaptiveValue(leading, context)}
        actions={resolveAdaptiveValue(actions, context)}
        {...topAppBarProps}
      />
    </Box>
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
            disabled={
              item.disabled ||
              !isAdaptiveScaffoldItemSelectable(item)
            }
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
            disabled={
              item.disabled ||
              !isAdaptiveScaffoldItemSelectable(item)
            }
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
        {...rootSlot}
        ref={rootRef}
        data-ui-adaptive-scaffold=""
        data-ui-adaptive-scaffold-mode={resolvedMode}
        data-ui-adaptive-scaffold-viewport={viewport}
        {...rest}
        style={{
          ...rootSlot.style,
          ...style,
        }}
      >
        <Scaffold
          viewport={viewport}
          appBar={appBar}
          footer={
            hasCustomNavigation
              ? navigationPlacement === "bottom"
                ? customNavigation
                : undefined
              : mobileNavigation === "bottom"
                ? bottomNavigation
                : undefined
          }
          floating={
            resolveAdaptiveValue(
              floating,
              context
            )
          }
          scrollable={false}
          {...scaffoldProps}
        >
          {
            hasCustomNavigation &&
              navigationPlacement === "top"
              ? customNavigation
              : null
          }

          <Box
            {...contentSlot}
            data-ui-adaptive-scaffold-content=""
            data-ui-adaptive-scaffold-mobile-content=""
            style={{
              width: "100%",
              height: "100%",
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              ...contentSlot.style,
            }}
          >
            {content}
          </Box>

        </Scaffold>
      </Box>
    );
  }

  const showTabletRail =
    resolvedMode === "tablet" &&
    tabletNavigation === "rail";

  const showTabletBottom =
    resolvedMode === "tablet" &&
    tabletNavigation === "bottom";

  const showDesktopSidebar =
    resolvedMode === "desktop" &&
    desktopNavigation === "sidebar";

  const showDesktopRail =
    resolvedMode === "desktop" &&
    desktopNavigation === "rail";

  const sideNavigationPlacement =
    navigationPlacement === "end"
      ? "end"
      : "start";

  const customNavigationSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot:
        resolvedMode === "tablet"
          ? "tabletNavigation"
          : "desktopNavigation",

      styles,
      slotProps,

      baseProps: {
        "data-ui-adaptive-scaffold-custom-navigation":
          "",

        "data-ui-adaptive-scaffold-navigation-placement":
          sideNavigationPlacement,
      },

      baseStyle: {
        width: cssSize(sidebarWidth),
        minWidth: cssSize(sidebarWidth),
        maxWidth: cssSize(sidebarWidth),

        minHeight: 0,
        overflow: "auto",

        padding: "0.75rem",

        boxSizing: "border-box",

        borderRight:
          sideNavigationPlacement === "start"
            ? "1px solid var(--ui-border)"
            : undefined,

        borderLeft:
          sideNavigationPlacement === "end"
            ? "1px solid var(--ui-border)"
            : undefined,

        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface) 94%, transparent), color-mix(in srgb, var(--ui-surface-2) 94%, transparent))",
      },
    });

  const defaultNavigationNode =
    showTabletRail || showDesktopRail ? (
      <Box
        {...railSlot}
        data-ui-adaptive-scaffold-rail=""
      >
        {railNavigation}
      </Box>
    ) : showDesktopSidebar ? (
      <Box
        {...sidebarSlot}
        data-ui-adaptive-scaffold-sidebar=""
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
    ) : null;

  const customNavigationNode =
    hasCustomNavigation ? (
      <Box {...customNavigationSlot}>
        {customNavigation}
      </Box>
    ) : null;

  const navigationNode =
    customNavigationNode ??
    defaultNavigationNode;

  const contentNode = (
    <Box
      {...contentSlot}
      data-ui-adaptive-scaffold-content=""
      data-ui-adaptive-scaffold-tablet-content={
        resolvedMode === "tablet" || undefined
      }
      data-ui-adaptive-scaffold-desktop-content={
        resolvedMode === "desktop" || undefined
      }
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        ...contentSlot.style,
      }}
    >
      {content}
    </Box>
  );

  return (
    <Box
      {...rootSlot}
      ref={rootRef}
      data-ui-adaptive-scaffold=""
      data-ui-adaptive-scaffold-mode={
        resolvedMode
      }
      data-ui-adaptive-scaffold-viewport={
        viewport
      }
      {...rest}
      style={{
        display: "flex",
        flexDirection: "column",
        ...rootSlot.style,
        ...style,
      }}
    >
      {appBar}

      <Box
        {...bodySlot}
        data-ui-adaptive-scaffold-body=""
      >
        {sideNavigationPlacement === "start"
          ? navigationNode
          : null}

        {contentNode}

        {sideNavigationPlacement === "end"
          ? navigationNode
          : null}
      </Box>

      {showTabletBottom
        ? bottomNavigation
        : null}
    </Box>
  );
}

AdaptiveScaffold.displayName = "AdaptiveScaffold";