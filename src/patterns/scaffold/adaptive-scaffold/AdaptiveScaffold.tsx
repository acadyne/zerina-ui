// src/patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx
import React from "react";
import {
  cx,
  getSlotProps,
  getSlotStyle,
  type SlotElementProps,
} from "../../../helpers/css";
import { useOptionalUIViewport } from "../../../core/viewport";
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
  AdaptiveScaffoldSlot,
  AdaptiveScaffoldSlotProps,
  AdaptiveScaffoldStyles,
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

interface ResolvedSlotProps {
  className?: string;
  style?: React.CSSProperties;
  rest: Omit<SlotElementProps, "className" | "style">;
}

const FALLBACK_VIEWPORT_BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
};

function resolveSlotProps(
  slotProps: AdaptiveScaffoldSlotProps | undefined,
  slot: AdaptiveScaffoldSlot
): ResolvedSlotProps {
  const { className, style, ...rest } = getSlotProps(slotProps, slot);

  return {
    className,
    style,
    rest,
  };
}

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

function getModeContentSlot(
  mode: AdaptiveScaffoldRenderContext["mode"]
): AdaptiveScaffoldSlot {
  if (mode === "mobile") return "mobileContent";
  if (mode === "tablet") return "tabletContent";

  return "desktopContent";
}

function getContentSlotStyles({
  styles,
  slotProps,
  mode,
}: {
  styles?: AdaptiveScaffoldStyles;
  slotProps?: AdaptiveScaffoldSlotProps;
  mode: AdaptiveScaffoldRenderContext["mode"];
}) {
  const modeSlot = getModeContentSlot(mode);
  const contentSlot = resolveSlotProps(slotProps, "content");
  const modeContentSlot = resolveSlotProps(slotProps, modeSlot);

  return {
    className: cx(contentSlot.className, modeContentSlot.className),
    rest: {
      ...contentSlot.rest,
      ...modeContentSlot.rest,
    },
    style: {
      ...getSlotStyle(styles, "content"),
      ...contentSlot.style,
      ...getSlotStyle(styles, modeSlot),
      ...modeContentSlot.style,
    } satisfies React.CSSProperties,
  };
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

  styles,
  slotProps,

  ...rest
}: AdaptiveScaffoldProps) {
  const viewportInfo = useOptionalUIViewport();
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

  const responsiveWidth =
    viewport === "contained"
      ? measuredWidth
      : viewportInfo?.width ?? measuredWidth;

  const resolvedMode = resolveAdaptiveScaffoldMode({
    mode,
    width: responsiveWidth,
    fallbackKind: viewportInfo?.kind ?? "mobile",
    breakpoints: viewportInfo?.breakpoints ?? FALLBACK_VIEWPORT_BREAKPOINTS,
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

  const rootSlot = resolveSlotProps(slotProps, "root");
  const appBarSlot = resolveSlotProps(slotProps, "appBar");
  const bodySlot = resolveSlotProps(slotProps, "body");
  const sidebarSlot = resolveSlotProps(slotProps, "sidebar");
  const railSlot = resolveSlotProps(slotProps, "rail");

  const contentSlot = getContentSlotStyles({
    styles,
    slotProps,
    mode: resolvedMode,
  });

  const appBar = showAppBar ? (
    <Box
      className={appBarSlot.className}
      data-ui-adaptive-scaffold-app-bar=""
      {...appBarSlot.rest}
      style={{
        width: "100%",
        minWidth: 0,
        flexShrink: 0,
        ...getSlotStyle(styles, "appBar"),
        ...appBarSlot.style,
      }}
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
        className={cx(className, rootSlot.className)}
        data-ui-adaptive-scaffold=""
        data-ui-adaptive-scaffold-mode={resolvedMode}
        data-ui-adaptive-scaffold-viewport={viewport}
        {...rootSlot.rest}
        {...rest}
        style={{
          width: "100%",
          height: viewport === "contained" ? "100%" : "100dvh",
          minHeight: viewport === "contained" ? 0 : "100dvh",
          minWidth: 0,
          overflow: "hidden",
          background: "var(--ui-bg)",
          color: "var(--ui-text)",
          ...getSlotStyle(styles, "root"),
          ...rootSlot.style,
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
            className={contentSlot.className}
            data-ui-adaptive-scaffold-content=""
            data-ui-adaptive-scaffold-mobile-content=""
            {...contentSlot.rest}
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
        </MobileScaffold>
      </Box>
    );
  }

  const showTabletRail = resolvedMode === "tablet" && tabletNavigation === "rail";
  const showTabletBottom =
    resolvedMode === "tablet" && tabletNavigation === "bottom";

  const showDesktopSidebar =
    resolvedMode === "desktop" && desktopNavigation === "sidebar";
  const showDesktopRail =
    resolvedMode === "desktop" && desktopNavigation === "rail";

  return (
    <Box
      ref={rootRef}
      className={cx(className, rootSlot.className)}
      data-ui-adaptive-scaffold=""
      data-ui-adaptive-scaffold-mode={resolvedMode}
      data-ui-adaptive-scaffold-viewport={viewport}
      {...rootSlot.rest}
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
        ...getSlotStyle(styles, "root"),
        ...rootSlot.style,
        ...style,
      }}
    >
      {appBar}

      <Box
        className={bodySlot.className}
        data-ui-adaptive-scaffold-body=""
        {...bodySlot.rest}
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          overflow: "hidden",
          ...getSlotStyle(styles, "body"),
          ...bodySlot.style,
        }}
      >
        {showTabletRail || showDesktopRail ? (
          <Box
            className={railSlot.className}
            data-ui-adaptive-scaffold-rail=""
            {...railSlot.rest}
            style={{
              flex: "0 0 auto",
              minHeight: 0,
              borderRight: "1px solid var(--ui-border)",
              ...getSlotStyle(styles, "rail"),
              ...railSlot.style,
            }}
          >
            {railNavigation}
          </Box>
        ) : null}

        {showDesktopSidebar ? (
          <Box
            className={sidebarSlot.className}
            data-ui-adaptive-scaffold-sidebar=""
            {...sidebarSlot.rest}
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
              ...getSlotStyle(styles, "sidebar"),
              ...sidebarSlot.style,
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
          className={contentSlot.className}
          data-ui-adaptive-scaffold-content=""
          data-ui-adaptive-scaffold-tablet-content={
            resolvedMode === "tablet" || undefined
          }
          data-ui-adaptive-scaffold-desktop-content={
            resolvedMode === "desktop" || undefined
          }
          {...contentSlot.rest}
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
      </Box>

      {showTabletBottom ? bottomNavigation : null}
    </Box>
  );
}

AdaptiveScaffold.displayName = "AdaptiveScaffold";