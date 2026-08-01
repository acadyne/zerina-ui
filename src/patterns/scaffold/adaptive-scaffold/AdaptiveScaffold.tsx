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
import {
  setRef,
} from "../../../core/interaction/events";
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

function AdaptiveScaffoldImpl<
  TMeta = unknown
>(
  {
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

    className = "",
    style,

    styles,
    slotProps,

    ...rest
  }: AdaptiveScaffoldProps<TMeta>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const viewportInfo =
    useOptionalUIViewport();

  const [
    rootRef,
    rootSize,
  ] =
    useElementSize<HTMLDivElement>();

  const setRootRefs =
    React.useCallback(
      (
        node:
          | HTMLDivElement
          | null
      ) => {
        /*
         * El ref público y la medición deben observar el mismo nodo propietario.
         * Separarlos permitiría que el modo contenido mida un layout distinto
         * del que recibe id, eventos, estilos y atributos públicos.
         */
        rootRef.current = node;
        setRef(ref, node);
      },
      [
        ref,
        rootRef,
      ]
    );

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
    fallbackKind:
      viewport === "contained"
        ? "mobile"
        : viewportInfo?.kind ??
          "mobile",
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

  const resolvedSubtitle =
    resolveAdaptiveValue(
      subtitle,
      context
    );

  const rootSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot: "root",
      styles,
      slotProps,
    });

  const {
    className:
      adaptiveRootClassName = "",

    style:
      adaptiveRootStyle,

    ...adaptiveRootRest
  } = rootSlot;

  /*
   * Precedencia del root:
   * scaffoldProps aporta la base, slotProps.root adapta el patrón y las props
   * HTML directas son el contrato final del consumidor.
   *
   * Todo se entrega al slot root de Scaffold porque Scaffold lo aplica después
   * de sus props generales sobre el mismo Screen que posee el layout.
   */
  const rootClassName = [
    scaffoldProps?.className,
    adaptiveRootClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: React.CSSProperties = {
    ...scaffoldProps?.style,
    ...adaptiveRootStyle,
    ...style,
  };

  const rootScaffoldSlotProps = {
    ...scaffoldProps?.slotProps,

    root: {
      ...scaffoldProps?.slotProps?.root,
      ...adaptiveRootRest,
      ...rest,

      "data-ui-adaptive-scaffold-root":
        "",

      "data-ui-adaptive-scaffold-mode":
        resolvedMode,
    },
  };

  const appBarSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot: "appBar",
      styles,
      slotProps,
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

  /*
   * El slot estructural se resuelve primero y el slot específico del modo
   * después. Así tabletNavigation/desktopNavigation pueden especializar
   * rail/sidebar sin añadir wrappers ni duplicar ownership del nodo.
   */
  const tabletRailSlot =
    resolveMergedSlot<AdaptiveScaffoldSlot>({
      slots: [
        "rail",
        "tabletNavigation",
      ],

      styles,
      slotProps,

      baseStyle: {
        flex: "0 0 auto",
        minHeight: 0,
        borderRight:
          "1px solid var(--ui-border)",
      },
    });

  const desktopRailSlot =
    resolveMergedSlot<AdaptiveScaffoldSlot>({
      slots: [
        "rail",
        "desktopNavigation",
      ],

      styles,
      slotProps,

      baseStyle: {
        flex: "0 0 auto",
        minHeight: 0,
        borderRight:
          "1px solid var(--ui-border)",
      },
    });

  const desktopSidebarSlot =
    resolveMergedSlot<AdaptiveScaffoldSlot>({
      slots: [
        "sidebar",
        "desktopNavigation",
      ],

      styles,
      slotProps,

      baseStyle: {
        width:
          cssSize(
            navigationWidth
          ),

        minWidth:
          cssSize(
            navigationWidth
          ),

        maxWidth:
          cssSize(
            navigationWidth
          ),

        minHeight: 0,
        overflow: "auto",
        padding: "0.75rem",
        boxSizing: "border-box",

        borderRight:
          "1px solid var(--ui-border)",

        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface) 94%, transparent), color-mix(in srgb, var(--ui-surface-2) 94%, transparent))",
      },
    });

  const contentSlot =
    getContentSlot(
      resolvedMode,
      styles,
      slotProps
    );

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

  const mobileNavigationSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot: "mobileNavigation",
      styles,
      slotProps,

      baseStyle: {
        width: "100%",
        minWidth: 0,
        flexShrink: 0,
      },
    });

  const tabletBottomNavigationSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot: "tabletNavigation",
      styles,
      slotProps,

      baseStyle: {
        width: "100%",
        minWidth: 0,
        flexShrink: 0,
      },
    });

  const mobileNavigationNode =
    hasCustomNavigation ? (
      <Box
        {...mobileNavigationSlot}

        data-ui-adaptive-scaffold-mobile-navigation=""
        data-ui-adaptive-scaffold-navigation-placement={
          navigationPlacement
        }
      >
        {customNavigation}
      </Box>
    ) : mobileNavigation ===
      "bottom" ? (
      <Box
        {...mobileNavigationSlot}

        data-ui-adaptive-scaffold-mobile-navigation=""
        data-ui-adaptive-scaffold-navigation-placement="bottom"
      >
        {bottomNavigation}
      </Box>
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
        {...scaffoldProps}

        ref={setRootRefs}

        viewport={viewport}

        appBar={appBar}

        footer={
          navigationPlacement ===
          "bottom"
            ? mobileNavigationNode
            : undefined
        }

        floating={
          resolveAdaptiveValue(
            floating,
            context
          )
        }

        scrollable={false}

        className={
          rootClassName
        }

        style={
          rootStyle
        }

        slotProps={
          rootScaffoldSlotProps
        }
      >
        {
          navigationPlacement ===
          "top"
            ? mobileNavigationNode
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
    showTabletRail ? (
      <Box
        {...tabletRailSlot}

        data-ui-adaptive-scaffold-rail=""
        data-ui-adaptive-scaffold-tablet-navigation=""
      >
        {railNavigation}
      </Box>
    ) : showDesktopRail ? (
      <Box
        {...desktopRailSlot}

        data-ui-adaptive-scaffold-rail=""
        data-ui-adaptive-scaffold-desktop-navigation=""
      >
        {railNavigation}
      </Box>
    ) : showDesktopSidebar ? (
      <Box
        {...desktopSidebarSlot}

        data-ui-adaptive-scaffold-sidebar=""
        data-ui-adaptive-scaffold-desktop-navigation=""
      >
        <NavigationList
          items={items}
          activeId={currentActiveId}
          activeBehavior="contains"
          openActiveParents

          {...navigationListProps}

          onSelect={(item) => {
            handleNavigationListSelect(
              item
            );
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

  const tabletBottomNavigationNode =
    showTabletBottom ? (
      <Box
        {...tabletBottomNavigationSlot}

        data-ui-adaptive-scaffold-tablet-navigation=""
        data-ui-adaptive-scaffold-navigation-placement="bottom"
      >
        {bottomNavigation}
      </Box>
    ) : undefined;

  return (
    <Scaffold
      {...scaffoldProps}

      ref={setRootRefs}

      viewport={viewport}

      appBar={appBar}

      footer={
        tabletBottomNavigationNode
      }

      floating={
        resolveAdaptiveValue(
          floating,
          context
        )
      }

      scrollable={false}

      className={
        rootClassName
      }

      style={
        rootStyle
      }

      slotProps={
        rootScaffoldSlotProps
      }
    >
      <Box
        {...bodySlot}

        data-ui-adaptive-scaffold-body=""
      >
        {sideNavigationPlacement ===
        "start"
          ? navigationNode
          : null}

        {contentNode}

        {sideNavigationPlacement ===
        "end"
          ? navigationNode
          : null}
      </Box>
    </Scaffold>
  );
}

type AdaptiveScaffoldComponent = <
  TMeta = unknown,
>(
  props:
    AdaptiveScaffoldProps<TMeta> &
    React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;

/*
 * React.forwardRef borra la firma genérica de TMeta.
 * El cast restaura únicamente la API pública validada por la implementación.
 */
const AdaptiveScaffoldWithRef =
  React.forwardRef(
    AdaptiveScaffoldImpl
  ) as unknown as
    AdaptiveScaffoldComponent & {
      displayName?: string;
    };

AdaptiveScaffoldWithRef.displayName =
  "AdaptiveScaffold";

export const AdaptiveScaffold =
  AdaptiveScaffoldWithRef;