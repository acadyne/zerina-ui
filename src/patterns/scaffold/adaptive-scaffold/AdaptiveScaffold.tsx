// src/patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx
import React from "react";

import {
  useAdaptiveViewport,
} from "../../../core/viewport";

import {
  hasRenderableNode,
} from "../../../core/react/nodePresence";

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
  NavigationPresenter,
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
  AdaptiveScaffoldSlot,
} from "./adaptiveScaffold.types";

import {
  resolveAdaptiveNavigation,
  resolveAdaptiveValue,
} from "./adaptiveScaffold.utils";


function getModeContentSlot<
  TMeta = unknown,
>(
  mode:
    AdaptiveScaffoldRenderContext<TMeta>["mode"],
): AdaptiveScaffoldSlot {
  if (mode === "mobile") {
    return "mobileContent";
  }

  if (mode === "tablet") {
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
    AdaptiveScaffoldProps<TMeta>["slotProps"],
) {
  return resolveMergedSlot({
    slots: [
      "content",
      getModeContentSlot(
        mode,
      ),
    ],

    styles,
    slotProps,
  });
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

    navigation,

    title,
    subtitle,

    leading,
    actions,
    floating,

    showAppBar = true,

    topAppBarProps,

    sidebarWidth = 284,

    className = "",
    style,

    styles,
    slotProps,

    ...scaffoldRootProps
  }: AdaptiveScaffoldProps<TMeta>,
  ref:
    React.ForwardedRef<HTMLDivElement>,
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
          | null,
      ) => {
        rootRef.current =
          node;

        setRef(
          ref,
          node,
        );
      },
      [
        ref,
        rootRef,
      ],
    );

  const fallbackItem =
    React.useMemo(
      () =>
        getFirstSelectableNavigationNode(
          items,
        ),
      [
        items,
      ],
    );

  const initialActiveIdRef =
    React.useRef<string>(
      activeId ??
      defaultActiveId ??
      fallbackItem?.id ??
      "",
    );

  const isControlled =
    activeId !==
    undefined;

  const [
    internalActiveId,
    setInternalActiveId,
  ] =
    React.useState(
      initialActiveIdRef.current,
    );

  const internalActiveItem =
    React.useMemo(
      () =>
        findNavigationNode(
          items,
          internalActiveId,
        ),
      [
        internalActiveId,
        items,
      ],
    );

  const resolvedInternalActiveId =
    internalActiveItem &&
    isNavigationNodeSelectable(
      internalActiveItem,
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
          currentActiveId,
        ),
      [
        currentActiveId,
        items,
      ],
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
        resolvedInternalActiveId,
      );
    },
    [
      internalActiveId,
      isControlled,
      resolvedInternalActiveId,
    ],
  );

  const setActiveItem =
    React.useCallback(
      (
        item:
          NavigationNode<TMeta>,
      ) => {
        if (
          !isNavigationNodeSelectable(
            item,
          )
        ) {
          return;
        }

        if (
          !isControlled
        ) {
          setInternalActiveId(
            item.id,
          );
        }

        onActiveIdChange?.(
          item.id,
          item,
        );
      },
      [
        isControlled,
        onActiveIdChange,
      ],
    );

  const setActiveId =
    React.useCallback(
      (
        nextId:
          string,
      ) => {
        const item =
          findNavigationNode(
            items,
            nextId,
          );

        if (!item) {
          return;
        }

        setActiveItem(
          item,
        );
      },
      [
        items,
        setActiveItem,
      ],
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
      ],
    );

  const resolvedTitle =
    resolveAdaptiveValue(
      title,
      context,
    ) ??
    activeItem?.label ??
    currentActiveId;

  const resolvedSubtitle =
    resolveAdaptiveValue(
      subtitle,
      context,
    );

  const resolvedNavigation =
    resolveAdaptiveNavigation({
      mode:
        resolvedMode,

      navigation,
    });

  const customNavigation =
    resolvedNavigation.content;

  const hasCustomNavigation =
    hasRenderableNode(
      customNavigation
    );

  const presentation =
    resolvedNavigation.presentation;

  const customPlacement =
    resolvedNavigation.placement;

  const sideNavigationPlacement =
    customPlacement ===
    "end"
      ? "end"
      : "start";

  const builtInPlacement =
    resolvedMode ===
    "mobile"
      ? (
          customPlacement ===
          "top"
            ? "top"
            : "bottom"
        )
      : presentation ===
        "bottom"
        ? "bottom"
        : sideNavigationPlacement;

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
            sidebarWidth,
          ),

        minWidth:
          cssSize(
            sidebarWidth,
          ),

        maxWidth:
          cssSize(
            sidebarWidth,
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
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface) 94%, transparent), color-mix(in srgb, var(--ui-surface-container) 94%, transparent))",
      },
    });

  const contentSlot =
    getContentSlot(
      resolvedMode,
      styles,
      slotProps,
    );

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
              context,
            )
          }
          actions={
            resolveAdaptiveValue(
              actions,
              context,
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
          context,
        )
      : children;

  const handleNavigationSelect =
    React.useCallback(
      (
        item:
          NavigationNode<TMeta>,
      ) => {
        setActiveItem(
          item,
        );
      },
      [
        setActiveItem,
      ],
    );

  const builtInNavigation =
    !hasCustomNavigation &&
    presentation !==
      "none" ? (
      <NavigationPresenter
        items={items}
        presentation={
          presentation
        }
        activeId={
          currentActiveId
        }
        side={
          sideNavigationPlacement
        }
        onSelect={
          handleNavigationSelect
        }
        compactPolicy={
          navigation?.compact
        }
        bottomProps={
          navigation?.bottom
        }
        railProps={
          navigation?.rail
        }
        listProps={
          navigation?.list
        }
        drawerProps={
          navigation?.drawer
        }
      />
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

  if (
    resolvedMode ===
    "mobile"
  ) {
    const mobileNavigationNode =
      hasCustomNavigation ? (
        <Box
          {...mobileNavigationSlot}
          data-ui-adaptive-scaffold-custom-navigation=""
          data-ui-adaptive-scaffold-mobile-navigation=""
          data-ui-adaptive-scaffold-navigation-placement={
            customPlacement ===
            "top"
              ? "top"
              : "bottom"
          }
        >
          {customNavigation}
        </Box>
      ) : builtInNavigation ? (
        <Box
          {...mobileNavigationSlot}
          data-ui-adaptive-scaffold-mobile-navigation=""
          data-ui-adaptive-scaffold-navigation-placement={
            builtInPlacement
          }
        >
          {builtInNavigation}
        </Box>
      ) : null;

    const mobilePlacement =
      hasCustomNavigation
        ? (
            customPlacement ===
            "top"
              ? "top"
              : "bottom"
          )
        : builtInPlacement;

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
            context,
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

  const builtInSideNavigation =
    !hasCustomNavigation &&
    (
      presentation ===
      "rail" ||
      presentation ===
      "sidebar"
    );

  const builtInBottomNavigation =
    !hasCustomNavigation &&
    presentation ===
      "bottom";

  const defaultSideNavigationNode =
    builtInSideNavigation ? (
      presentation ===
      "rail" ? (
        <Box
          {...(
            resolvedMode ===
            "tablet"
              ? tabletRailSlot
              : desktopRailSlot
          )}
          data-ui-adaptive-scaffold-rail=""
          data-ui-adaptive-scaffold-tablet-navigation={
            resolvedMode ===
              "tablet"
              ? ""
              : undefined
          }
          data-ui-adaptive-scaffold-desktop-navigation={
            resolvedMode ===
              "desktop"
              ? ""
              : undefined
          }
        >
          {builtInNavigation}
        </Box>
      ) : resolvedMode ===
        "desktop" ? (
        <Box
          {...desktopSidebarSlot}
          data-ui-adaptive-scaffold-sidebar=""
          data-ui-adaptive-scaffold-desktop-navigation=""
        >
          {builtInNavigation}
        </Box>
      ) : null
    ) : null;

  const customSideNavigationNode =
    hasCustomNavigation &&
    customPlacement !==
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

  const footerNavigation =
    hasCustomNavigation &&
    customPlacement ===
      "bottom" ? (
      <Box
        {...tabletBottomNavigationSlot}
        data-ui-adaptive-scaffold-custom-navigation=""
        data-ui-adaptive-scaffold-tablet-navigation={
          resolvedMode ===
            "tablet"
            ? ""
            : undefined
        }
        data-ui-adaptive-scaffold-navigation-placement="bottom"
      >
        {customNavigation}
      </Box>
    ) : builtInBottomNavigation ? (
      <Box
        {...tabletBottomNavigationSlot}
        data-ui-adaptive-scaffold-tablet-navigation={
          resolvedMode ===
            "tablet"
            ? ""
            : undefined
        }
        data-ui-adaptive-scaffold-navigation-placement="bottom"
      >
        {builtInNavigation}
      </Box>
    ) : null;

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
        footerNavigation
      }
      floating={
        resolveAdaptiveValue(
          floating,
          context,
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


const AdaptiveScaffoldWithRef =
  React.forwardRef(
    AdaptiveScaffoldImpl,
  ) as unknown as
    AdaptiveScaffoldComponent & {
      displayName?:
        string;
    };


AdaptiveScaffoldWithRef.displayName =
  "AdaptiveScaffold";


export const AdaptiveScaffold =
  AdaptiveScaffoldWithRef;
