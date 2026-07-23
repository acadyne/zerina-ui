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
} from "../../../primitives/navigation";
import { Scaffold } from "../Scaffold";
import { TopAppBar } from "../TopAppBar";
import type {
  AdaptiveScaffoldProps,
  AdaptiveScaffoldRenderContext,
  AdaptiveScaffoldSlot,
} from "./adaptiveScaffold.types";

import type {
  NavigationNode,
} from "../../navigation";
import {
  cssSize,
  resolveAdaptiveScaffoldMode,
  resolveAdaptiveValue,
} from "./adaptiveScaffold.utils";

import {
  findNavigationNode,
  getFirstSelectableNavigationNode,
  isNavigationNodeSelectable,
} from "../../navigation";

function getModeContentSlot<TMeta = unknown>(
  mode: AdaptiveScaffoldRenderContext<TMeta>["mode"]
): AdaptiveScaffoldSlot {
  if (mode === "mobile") return "mobileContent";
  if (mode === "tablet") return "tabletContent";

  return "desktopContent";
}

function getContentSlot<TMeta = unknown>(
  mode: AdaptiveScaffoldRenderContext<TMeta>["mode"],
  styles: AdaptiveScaffoldProps<TMeta>["styles"],
  slotProps: AdaptiveScaffoldProps<TMeta>["slotProps"]
) {
  const modeSlot = getModeContentSlot(mode);

  return resolveMergedSlot({
    slots: ["content", modeSlot],
    styles,
    slotProps,
  });
}

export function AdaptiveScaffold<
  TMeta = unknown
>({
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

  navigationWidth = 284,
  styles,
  slotProps,

}: AdaptiveScaffoldProps<TMeta>) {
  const viewportInfo = useOptionalUIViewport();
  const [, rootSize] = useElementSize<HTMLDivElement>();

  const fallbackItem = React.useMemo(
    () => getFirstSelectableNavigationNode(items),
    [items]
  );

  const initialActiveIdRef = React.useRef<string>(
    activeId ?? defaultActiveId ?? fallbackItem?.id ?? ""
  );

  const isControlled = activeId !== undefined;

  const [internalActiveId, setInternalActiveId] = React.useState(
    initialActiveIdRef.current
  );

  const internalActiveItem = React.useMemo(
    () =>
      findNavigationNode(
        items,
        internalActiveId
      ),
    [
      internalActiveId,
      items,
    ]
  );

  const resolvedInternalActiveId =
    internalActiveItem &&
      isNavigationNodeSelectable(
        internalActiveItem
      )
      ? internalActiveId
      : fallbackItem?.id ?? "";

  const currentActiveId = isControlled
    ? activeId ?? fallbackItem?.id ?? ""
    : resolvedInternalActiveId;

  const activeItem = React.useMemo(
    () => findNavigationNode(items, currentActiveId),
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

  React.useEffect(() => {
    if (
      isControlled ||
      internalActiveId === resolvedInternalActiveId
    ) {
      return;
    }

    setInternalActiveId(
      resolvedInternalActiveId
    );
  }, [
    internalActiveId,
    isControlled,
    resolvedInternalActiveId,
  ]);

  const setActiveItem = React.useCallback(
    (
      item: NavigationNode<TMeta>
    ) => {
      if (!isNavigationNodeSelectable(item)) return;

      if (!isControlled) {
        setInternalActiveId(item.id);
      }

      onActiveIdChange?.(item.id, item);
    },
    [isControlled, onActiveIdChange]
  );

  const setActiveId = React.useCallback(
    (nextId: string) => {
      const item = findNavigationNode(items, nextId);
      if (!item) return;

      setActiveItem(item);
    },
    [items, setActiveItem]
  );

  const context = React.useMemo<
    AdaptiveScaffoldRenderContext<TMeta>
  >(
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
      width: cssSize(navigationWidth),
      minWidth: cssSize(navigationWidth),
      maxWidth: cssSize(navigationWidth),
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

  const content =
    typeof children === "function"
      ? children(context)
      : children;


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
        onValueChange={(
          next,
          _event,
          selection
        ) => {
          if (
            selection.reason ===
            "change"
          ) {
            setActiveId(next);
          }
        }}
      >
        {items.map((item) => (
          <BottomNavigation.Item
            key={item.id}
            value={item.id}
            icon={item.icon}
            badge={item.badge}
            disabled={
              item.disabled ||
              !isNavigationNodeSelectable(item)
            }
            aria-label={item.ariaLabel}
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
        onValueChange={(
          next,
          _event,
          selection
        ) => {
          if (
            selection.reason ===
            "change"
          ) {
            setActiveId(next);
          }
        }}
      >
        {items.map((item) => (
          <NavigationRail.Item
            key={item.id}
            value={item.id}
            icon={item.icon}
            badge={item.badge}
            disabled={
              item.disabled ||
              !isNavigationNodeSelectable(item)
            }
            aria-label={item.ariaLabel}
          >
            {item.label}
          </NavigationRail.Item>
        ))}
      </NavigationRail>
    ) : null;

  const handleNavigationListSelect = React.useCallback(
    (
      item: NavigationNode<TMeta>
    ) => {
      setActiveItem(item);
    },
    [
      setActiveItem,
    ]
  );

  if (resolvedMode === "mobile") {
    return (
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
        width: cssSize(navigationWidth),
        minWidth: cssSize(navigationWidth),
        maxWidth: cssSize(navigationWidth),

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
          items={items}
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
    <Scaffold
      viewport={viewport}

      appBar={appBar}

      footer={
        showTabletBottom
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
    </Scaffold>
  );
}

AdaptiveScaffold.displayName = "AdaptiveScaffold";