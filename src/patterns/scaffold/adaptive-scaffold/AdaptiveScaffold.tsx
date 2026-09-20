// src/patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx
import React from "react";

import {
  useAdaptiveViewport,
} from "../../../core/viewport";

import {
  setRef,
} from "../../../core/interaction/events";

import {
  cssSize,
  resolveMergedSlot,
  resolveSlot,
} from "../../../helpers/css";

import {
  Box,
} from "../../../primitives/layout";

import {
  BottomNavigation,
  NavigationList,
  NavigationRail,
} from "../../../primitives/navigation";

import {
  findNavigationNode,
  getFirstSelectableNavigationNode,
  isNavigationNodeSelectable,
  type NavigationNode,
} from "../../navigation";

import {
  Scaffold,
} from "../Scaffold";

import {
  TopAppBar,
} from "../TopAppBar";

import type {
  AdaptiveScaffoldProps,
  AdaptiveScaffoldRenderContext,
  AdaptiveScaffoldResolvedMode,
  AdaptiveScaffoldSlot,
} from "./adaptiveScaffold.types";

import {
  resolveAdaptiveValue,
} from "./adaptiveScaffold.utils";

function getModeContentSlot<
  TMeta = unknown,
>(
  mode:
    AdaptiveScaffoldRenderContext<TMeta>["mode"]
): AdaptiveScaffoldSlot {
  if (
    mode ===
    "mobile"
  ) {
    return "mobileContent";
  }

  if (
    mode ===
    "tablet"
  ) {
    return "tabletContent";
  }

  return "desktopContent";
}

function getContentSlot<
  TMeta = unknown,
>(
  mode:
    AdaptiveScaffoldRenderContext<TMeta>["mode"],
  styles:
    AdaptiveScaffoldProps<TMeta>["styles"],
  slotProps:
    AdaptiveScaffoldProps<TMeta>["slotProps"]
) {
  return resolveMergedSlot({
    slots: [
      "content",
      getModeContentSlot(
        mode
      ),
    ],

    styles,
    slotProps,
  });
}

function getDefaultCustomNavigationPlacement({
  mode,
  tabletNavigation,
}: {
  mode:
    AdaptiveScaffoldResolvedMode;

  tabletNavigation:
    NonNullable<
      AdaptiveScaffoldProps["tabletNavigation"]
    >;
}) {
  if (
    mode ===
    "mobile"
  ) {
    return "bottom" as const;
  }

  if (
    mode ===
      "tablet" &&
    tabletNavigation ===
      "bottom"
  ) {
    return "bottom" as const;
  }

  return "start" as const;
}

function AdaptiveScaffoldImpl<
  TMeta = unknown,
>(
  {
    children,

    viewport = "window",
    mode = "auto",

    items,

    activeId,
    defaultActiveId,
    onActiveIdChange,

    mobileNavigation =
      "bottom",

    tabletNavigation =
      "rail",

    desktopNavigation =
      "sidebar",

    navigationSlots,

    title,
    subtitle,

    leading,
    actions,
    floating,

    showAppBar = true,

    topAppBarProps,
    bottomNavigationProps,
    navigationRailProps,
    navigationListProps,

    sidebarWidth = 284,

    className = "",
    style,

    styles,
    slotProps,

    ...scaffoldRootProps
  }: AdaptiveScaffoldProps<TMeta>,
  ref:
    React.ForwardedRef<HTMLDivElement>
) {
  const adaptiveViewport =
    useAdaptiveViewport<HTMLDivElement>({
      source:
        viewport ===
        "contained"
          ? "container"
          : "window",

      mode,
    });

  const rootRef =
    adaptiveViewport.ref;

  const setRootRefs =
    React.useCallback(
      (
        node:
          | HTMLDivElement
          | null
      ) => {
        rootRef.current =
          node;

        setRef(
          ref,
          node
        );
      },
      [
        ref,
        rootRef,
      ]
    );

  const fallbackItem =
    React.useMemo(
      () =>
        getFirstSelectableNavigationNode(
          items
        ),
      [
        items,
      ]
    );

  const initialActiveIdRef =
    React.useRef<string>(
      activeId ??
      defaultActiveId ??
      fallbackItem?.id ??
      ""
    );

  const isControlled =
    activeId !==
    undefined;

  const [
    internalActiveId,
    setInternalActiveId,
  ] =
    React.useState(
      initialActiveIdRef.current
    );

  const internalActiveItem =
    React.useMemo(
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
      : fallbackItem?.id ??
        "";

  const currentActiveId =
    isControlled
      ? activeId ??
        fallbackItem?.id ??
        ""
      : resolvedInternalActiveId;

  const activeItem =
    React.useMemo(
      () =>
        findNavigationNode(
          items,
          currentActiveId
        ),
      [
        currentActiveId,
        items,
      ]
    );

  const resolvedMode =
    adaptiveViewport.kind;

  React.useEffect(
    () => {
      if (
        isControlled ||
        internalActiveId ===
          resolvedInternalActiveId
      ) {
        return;
      }

      setInternalActiveId(
        resolvedInternalActiveId
      );
    },
    [
      internalActiveId,
      isControlled,
      resolvedInternalActiveId,
    ]
  );

  const setActiveItem =
    React.useCallback(
      (
        item:
          NavigationNode<TMeta>
      ) => {
        if (
          !isNavigationNodeSelectable(
            item
          )
        ) {
          return;
        }

        if (
          !isControlled
        ) {
          setInternalActiveId(
            item.id
          );
        }

        onActiveIdChange?.(
          item.id,
          item
        );
      },
      [
        isControlled,
        onActiveIdChange,
      ]
    );

  const setActiveId =
    React.useCallback(
      (
        nextId:
          string
      ) => {
        const item =
          findNavigationNode(
            items,
            nextId
          );

        if (
          !item
        ) {
          return;
        }

        setActiveItem(
          item
        );
      },
      [
        items,
        setActiveItem,
      ]
    );

  const context =
    React.useMemo<
      AdaptiveScaffoldRenderContext<TMeta>
    >(
      () => ({
        mode:
          resolvedMode,

        activeId:
          currentActiveId,

        activeItem,

        items,

        setActiveId,
      }),
      [
        activeItem,
        currentActiveId,
        items,
        resolvedMode,
        setActiveId,
      ]
    );

  const resolvedTitle =
    resolveAdaptiveValue(
      title,
      context
    ) ??
    activeItem?.label ??
    currentActiveId;

  const resolvedSubtitle =
    resolveAdaptiveValue(
      subtitle,
      context
    );

  const rootSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot:
        "root",

      styles,
      slotProps,

      className,
      style,

      baseProps: {
        "data-ui-adaptive-scaffold-root":
          "",

        "data-ui-adaptive-scaffold-mode":
          resolvedMode,
      },
    });

  const appBarSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot:
        "appBar",

      styles,
      slotProps,
    });

  const bodySlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot:
        "body",

      styles,
      slotProps,

      baseStyle: {
        flex:
          1,

        minWidth:
          0,

        minHeight:
          0,

        display:
          "flex",

        overflow:
          "hidden",
      },
    });

  const tabletRailSlot =
    resolveMergedSlot<AdaptiveScaffoldSlot>({
      slots: [
        "rail",
        "tabletNavigation",
      ],

      styles,
      slotProps,

      baseStyle: {
        flex:
          "0 0 auto",

        minHeight:
          0,
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
        flex:
          "0 0 auto",

        minHeight:
          0,
      },
    });

  const contentSlot =
    getContentSlot(
      resolvedMode,
      styles,
      slotProps
    );

  const resolvedNavigation =
    navigationSlots?.[
      resolvedMode
    ];

  const customNavigation =
    resolvedNavigation?.content;

  const hasCustomNavigation =
    customNavigation !==
      undefined &&
    customNavigation !==
      null;

  const defaultCustomPlacement =
    getDefaultCustomNavigationPlacement({
      mode:
        resolvedMode,

      tabletNavigation,
    });

  const navigationPlacement =
    resolvedNavigation?.placement ??
    defaultCustomPlacement;

  const sideNavigationPlacement =
    navigationPlacement ===
    "end"
      ? "end"
      : "start";

  const appBar =
    showAppBar ? (
      <Box
        {...appBarSlot}

        data-ui-adaptive-scaffold-app-bar=""
      >
        <TopAppBar
          title={
            resolvedTitle
          }

          subtitle={
            resolvedSubtitle
          }

          centerTitle={
            resolvedMode ===
            "mobile"
          }

          variant="blur"

          leading={
            resolveAdaptiveValue(
              leading,
              context
            )
          }

          actions={
            resolveAdaptiveValue(
              actions,
              context
            )
          }

          {...topAppBarProps}

          safeAreaTop={
            false
          }
        />
      </Box>
    ) : null;

  const content =
    typeof children ===
    "function"
      ? children(
          context
        )
      : children;

  const builtInBottomNavigationVisible =
    !hasCustomNavigation &&
    (
      (
        resolvedMode ===
          "mobile" &&
        mobileNavigation ===
          "bottom"
      ) ||
      (
        resolvedMode ===
          "tablet" &&
        tabletNavigation ===
          "bottom"
      )
    );

  const bottomNavigation =
    builtInBottomNavigationVisible ? (
      <BottomNavigation
        variant="floating"
        indicator="pill"
        labelBehavior="active"
        density="comfortable"

        {...bottomNavigationProps}

        position="static"
        safeArea={false}

        value={
          currentActiveId
        }

        onValueChange={(
          next,
          _event,
          selection
        ) => {
          if (
            selection.reason ===
            "change"
          ) {
            setActiveId(
              next
            );
          }
        }}
      >
        {items.map(
          (
            item
          ) => (
            <BottomNavigation.Item
              key={
                item.id
              }

              value={
                item.id
              }

              icon={
                item.icon
              }

              badge={
                item.badge
              }

              disabled={
                item.disabled ||
                !isNavigationNodeSelectable(
                  item
                )
              }

              aria-label={
                item.ariaLabel
              }
            >
              {item.label}
            </BottomNavigation.Item>
          )
        )}
      </BottomNavigation>
    ) : null;

  const mobileNavigationSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot:
        "mobileNavigation",

      styles,
      slotProps,

      baseStyle: {
        width:
          "100%",

        minWidth:
          0,

        flexShrink:
          0,
      },
    });

  const tabletBottomNavigationSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot:
        "tabletNavigation",

      styles,
      slotProps,

      baseStyle: {
        width:
          "100%",

        minWidth:
          0,

        flexShrink:
          0,
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
    ) : builtInBottomNavigationVisible ? (
      <Box
        {...mobileNavigationSlot}

        data-ui-adaptive-scaffold-mobile-navigation=""

        data-ui-adaptive-scaffold-navigation-placement={
          navigationPlacement ===
          "top"
            ? "top"
            : "bottom"
        }
      >
        {bottomNavigation}
      </Box>
    ) : null;

  if (
    resolvedMode ===
    "mobile"
  ) {
    const mobilePlacement =
      navigationPlacement ===
      "top"
        ? "top"
        : "bottom";

    return (
      <Scaffold
        {...rootSlot}
        {...scaffoldRootProps}

        ref={
          setRootRefs
        }

        viewport={
          viewport
        }

        appBar={
          appBar
        }

        footer={
          mobilePlacement ===
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
      >
        {mobilePlacement ===
        "top"
          ? mobileNavigationNode
          : null}

        <Box
          {...contentSlot}

          data-ui-adaptive-scaffold-content=""

          data-ui-adaptive-scaffold-mobile-content=""

          style={{
            width:
              "100%",

            height:
              "100%",

            minWidth:
              0,

            minHeight:
              0,

            overflow:
              "hidden",

            ...contentSlot.style,
          }}
        >
          {content}
        </Box>
      </Scaffold>
    );
  }

  const showTabletRail =
    !hasCustomNavigation &&
    resolvedMode ===
      "tablet" &&
    tabletNavigation ===
      "rail";

  const showTabletBottom =
    !hasCustomNavigation &&
    resolvedMode ===
      "tablet" &&
    tabletNavigation ===
      "bottom";

  const showDesktopSidebar =
    !hasCustomNavigation &&
    resolvedMode ===
      "desktop" &&
    desktopNavigation ===
      "sidebar";

  const showDesktopRail =
    !hasCustomNavigation &&
    resolvedMode ===
      "desktop" &&
    desktopNavigation ===
      "rail";

  const showBuiltInRail =
    showTabletRail ||
    showDesktopRail;

  const railNavigation =
    showBuiltInRail ? (
      <NavigationRail
        variant="surface"
        indicator="pill"
        labelBehavior="active"
        density="comfortable"
        badgeAnchor="icon"
        badgePlacement="top-end"

        {...navigationRailProps}

        position="static"

        placement={
          sideNavigationPlacement ===
          "end"
            ? "right"
            : "left"
        }

        safeArea={
          false
        }

        value={
          currentActiveId
        }

        onValueChange={(
          next,
          _event,
          selection
        ) => {
          if (
            selection.reason ===
            "change"
          ) {
            setActiveId(
              next
            );
          }
        }}
      >
        {items.map(
          (
            item
          ) => (
            <NavigationRail.Item
              key={
                item.id
              }

              value={
                item.id
              }

              icon={
                item.icon
              }

              badge={
                item.badge
              }

              disabled={
                item.disabled ||
                !isNavigationNodeSelectable(
                  item
                )
              }

              aria-label={
                item.ariaLabel
              }
            >
              {item.label}
            </NavigationRail.Item>
          )
        )}
      </NavigationRail>
    ) : null;

  const handleNavigationListSelect =
    React.useCallback(
      (
        item:
          NavigationNode<TMeta>
      ) => {
        setActiveItem(
          item
        );
      },
      [
        setActiveItem,
      ]
    );

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
            sidebarWidth
          ),

        minWidth:
          cssSize(
            sidebarWidth
          ),

        maxWidth:
          cssSize(
            sidebarWidth
          ),

        minHeight:
          0,

        overflow:
          "auto",

        padding:
          "0.75rem",

        boxSizing:
          "border-box",

        borderRight:
          sideNavigationPlacement ===
          "start"
            ? "1px solid var(--ui-border)"
            : undefined,

        borderLeft:
          sideNavigationPlacement ===
          "end"
            ? "1px solid var(--ui-border)"
            : undefined,

        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface) 94%, transparent), color-mix(in srgb, var(--ui-surface-2) 94%, transparent))",
      },
    });

  const customSideNavigationSlot =
    resolveSlot<AdaptiveScaffoldSlot>({
      slot:
        resolvedMode ===
        "tablet"
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
        flex:
          "0 0 auto",

        minHeight:
          0,

        overflow:
          "auto",

        boxSizing:
          "border-box",

        borderRight:
          sideNavigationPlacement ===
          "start"
            ? "1px solid var(--ui-border)"
            : undefined,

        borderLeft:
          sideNavigationPlacement ===
          "end"
            ? "1px solid var(--ui-border)"
            : undefined,
      },
    });

  const defaultSideNavigationNode =
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
          items={
            items
          }

          activeId={
            currentActiveId
          }

          activeBehavior="contains"
          openActiveParents

          {...navigationListProps}

          onSelect={
            handleNavigationListSelect
          }
        />
      </Box>
    ) : null;

  const customSideNavigationNode =
    hasCustomNavigation &&
    navigationPlacement !==
      "bottom" ? (
      <Box
        {...customSideNavigationSlot}
      >
        {customNavigation}
      </Box>
    ) : null;

  const sideNavigationNode =
    customSideNavigationNode ??
    defaultSideNavigationNode;

  const contentNode = (
    <Box
      {...contentSlot}

      data-ui-adaptive-scaffold-content=""

      data-ui-adaptive-scaffold-tablet-content={
        resolvedMode ===
          "tablet" ||
        undefined
      }

      data-ui-adaptive-scaffold-desktop-content={
        resolvedMode ===
          "desktop" ||
        undefined
      }

      style={{
        flex:
          1,

        minWidth:
          0,

        minHeight:
          0,

        overflow:
          "hidden",

        ...contentSlot.style,
      }}
    >
      {content}
    </Box>
  );

  const customTabletBottomNode =
    resolvedMode ===
      "tablet" &&
    hasCustomNavigation &&
    navigationPlacement ===
      "bottom" ? (
      <Box
        {...tabletBottomNavigationSlot}

        data-ui-adaptive-scaffold-custom-navigation=""

        data-ui-adaptive-scaffold-tablet-navigation=""

        data-ui-adaptive-scaffold-navigation-placement="bottom"
      >
        {customNavigation}
      </Box>
    ) : null;

  const builtInTabletBottomNode =
    showTabletBottom ? (
      <Box
        {...tabletBottomNavigationSlot}

        data-ui-adaptive-scaffold-tablet-navigation=""

        data-ui-adaptive-scaffold-navigation-placement="bottom"
      >
        {bottomNavigation}
      </Box>
    ) : null;

  const tabletFooterNavigation =
    customTabletBottomNode ??
    builtInTabletBottomNode;

  return (
    <Scaffold
      {...rootSlot}
      {...scaffoldRootProps}

      ref={
        setRootRefs
      }

      viewport={
        viewport
      }

      appBar={
        appBar
      }

      footer={
        tabletFooterNavigation
      }

      floating={
        resolveAdaptiveValue(
          floating,
          context
        )
      }
    >
      <Box
        {...bodySlot}

        data-ui-adaptive-scaffold-body=""
      >
        {sideNavigationPlacement ===
        "start"
          ? sideNavigationNode
          : null}

        {contentNode}

        {sideNavigationPlacement ===
        "end"
          ? sideNavigationNode
          : null}
      </Box>
    </Scaffold>
  );
}

type AdaptiveScaffoldComponent =
  <
    TMeta = unknown,
  >(
    props:
      AdaptiveScaffoldProps<TMeta> &
      React.RefAttributes<HTMLDivElement>
  ) =>
    React.ReactElement |
    null;

/*
 * React.forwardRef borra la firma genérica de TMeta.
 * El cast restaura únicamente la API pública validada por la implementación.
 */
const AdaptiveScaffoldWithRef =
  React.forwardRef(
    AdaptiveScaffoldImpl
  ) as unknown as
    AdaptiveScaffoldComponent & {
      displayName?:
        string;
    };

AdaptiveScaffoldWithRef.displayName =
  "AdaptiveScaffold";

export const AdaptiveScaffold =
  AdaptiveScaffoldWithRef;
