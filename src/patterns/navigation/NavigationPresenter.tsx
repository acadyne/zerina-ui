import React from "react";

import type {
  UIPressEvent,
} from "../../core/interaction";

import {
  BottomNavigation,
  NavigationList,
  NavigationRail,
  type NavigationSelectionContext,
} from "../../primitives/navigation";

import type {
  BottomNavigationProps,
} from "../../primitives/navigation/bottom-navigation";

import type {
  NavigationListProps,
} from "../../primitives/navigation/NavigationList";

import type {
  NavigationRailProps,
} from "../../primitives/navigation/navigation-rail";

import {
  DrawerNavigation,
} from "../drawer-navigation";

import type {
  DrawerNavigationProps,
} from "../drawer-navigation";

import type {
  NavigationNode,
  NavigationPresentation,
  NavigationSide,
} from "./navigation.types";

import {
  findNavigationNode,
  getNavigationNodeAriaLabel,
  isNavigationNodeSelectable,
} from "./navigation.utils";

import {
  projectCompactNavigation,
  type NavigationCompactPolicy,
} from "./navigationProjection";


export type NavigationPresenterBottomProps =
  Omit<
    BottomNavigationProps,
    | "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "position"
    | "safeArea"
  >;


export type NavigationPresenterRailProps =
  Omit<
    NavigationRailProps,
    | "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "position"
    | "placement"
    | "safeArea"
  >;


export type NavigationPresenterListProps<
  TMeta = unknown,
> =
  Omit<
    NavigationListProps<TMeta>,
    | "items"
    | "activeId"
    | "onSelect"
  >;


export type NavigationPresenterDrawerProps<
  TMeta = unknown,
> =
  Omit<
    DrawerNavigationProps<TMeta>,
    | "items"
    | "activeId"
    | "onSelect"
    | "open"
    | "onOpenChange"
  >;


export interface NavigationPresenterProps<
  TMeta = unknown,
> {
  items:
    NavigationNode<TMeta>[];

  presentation:
    NavigationPresentation;

  activeId?:
    string | null;

  onSelect?:
    (
      item:
        NavigationNode<TMeta>,
      event:
        UIPressEvent<HTMLElement>,
    ) => void;

  side?:
    NavigationSide;

  compactPolicy?:
    NavigationCompactPolicy;

  bottomProps?:
    NavigationPresenterBottomProps;

  railProps?:
    NavigationPresenterRailProps;

  listProps?:
    NavigationPresenterListProps<TMeta>;

  drawerProps?:
    NavigationPresenterDrawerProps<TMeta>;

  drawerOpen?:
    boolean;

  onDrawerOpenChange?:
    (
      open: boolean,
    ) => void;
}


function NavigationPresenterImpl<
  TMeta = unknown,
>({
  items,
  presentation,
  activeId,
  onSelect,

  side = "start",

  compactPolicy,

  bottomProps,
  railProps,
  listProps,
  drawerProps,

  drawerOpen = false,
  onDrawerOpenChange,
}: NavigationPresenterProps<TMeta>) {
  const [
    overflowOpen,
    setOverflowOpen,
  ] =
    React.useState(
      false,
    );

  const reactId =
    React.useId().replace(
      /:/g,
      "",
    );

  const overflowValue =
    `__zerina_navigation_overflow_${reactId}`;

  const compactPresentation =
    presentation ===
      "bottom" ||
    presentation ===
      "rail"
      ? presentation
      : null;

  const compactProjection =
    React.useMemo(
      () =>
        compactPresentation
          ? projectCompactNavigation({
              items,
              activeId,
              presentation:
                compactPresentation,
              policy:
                compactPolicy,
            })
          : null,
      [
        activeId,
        compactPolicy,
        compactPresentation,
        items,
      ],
    );

  React.useEffect(
    () => {
      setOverflowOpen(
        false,
      );
    },
    [
      presentation,
      compactProjection
        ?.hasOverflow,
    ],
  );

  const handleItemSelect =
    React.useCallback(
      (
        item:
          NavigationNode<TMeta>,
        event:
          UIPressEvent<HTMLElement>,
      ): void => {
        if (
          !isNavigationNodeSelectable(
            item,
          )
        ) {
          return;
        }

        onSelect?.(
          item,
          event,
        );
      },
      [
        onSelect,
      ],
    );

  const handleCompactValueChange =
    React.useCallback(
      (
        nextId:
          string,
        event:
          UIPressEvent<HTMLButtonElement>,
        context:
          NavigationSelectionContext,
      ): void => {
        if (
          nextId ===
          overflowValue
        ) {
          setOverflowOpen(
            true,
          );

          return;
        }

        if (
          context.reason !==
          "change"
        ) {
          return;
        }

        const item =
          findNavigationNode(
            items,
            nextId,
          );

        if (
          !item ||
          !isNavigationNodeSelectable(
            item,
          )
        ) {
          return;
        }

        handleItemSelect(
          item,
          event,
        );
      },
      [
        handleItemSelect,
        items,
        overflowValue,
      ],
    );

  if (
    presentation ===
    "drawer"
  ) {
    return (
      <DrawerNavigation
        {...drawerProps}
        items={items}
        activeId={
          activeId
        }
        open={
          drawerOpen
        }
        onOpenChange={
          onDrawerOpenChange
        }
        onSelect={
          handleItemSelect
        }
        placement={
          drawerProps
            ?.placement ??
          (
            side === "end"
              ? "right"
              : "left"
          )
        }
      />
    );
  }

  if (
    presentation ===
    "sidebar"
  ) {
    return (
      <NavigationList
        activeBehavior="contains"
        openActiveParents
        {...listProps}
        items={items}
        activeId={
          activeId
        }
        onSelect={
          handleItemSelect
        }
      />
    );
  }

  if (
    !compactProjection
  ) {
    return null;
  }

  const currentValue =
    compactProjection
      .activeInOverflow
      ? overflowValue
      : compactProjection
          .activeEntry
          ?.node.id ??
        null;

  const overflowLabel =
    compactPolicy
      ?.overflowLabel ??
    "Más";

  const overflowAriaLabel =
    compactPolicy
      ?.overflowAriaLabel ??
    (
      typeof overflowLabel ===
        "string" ||
      typeof overflowLabel ===
        "number"
        ? String(
            overflowLabel,
          )
        : "Más opciones"
    );

  const overflowIcon =
    compactPolicy
      ?.overflowIcon ??
    (
      <span
        aria-hidden="true"
      >
        ⋯
      </span>
    );

  const compactItems =
    compactProjection
      .visible.map(
        ({ node }) => ({
          node,

          ariaLabel:
            getNavigationNodeAriaLabel(
              node,
            ),
        }),
      );

  const overflowDrawer =
    compactProjection
      .hasOverflow ? (
      <DrawerNavigation
        {...drawerProps}
        items={items}
        activeId={
          activeId
        }
        open={
          overflowOpen
        }
        onOpenChange={
          setOverflowOpen
        }
        onSelect={
          handleItemSelect
        }
        title={
          compactPolicy
            ?.drawerTitle ??
          drawerProps
            ?.title ??
          overflowLabel
        }
        placement={
          drawerProps
            ?.placement ??
          (
            (
              compactPolicy
                ?.drawerSide ??
              side
            ) === "end"
              ? "right"
              : "left"
          )
        }
      />
    ) : null;

  if (
    presentation ===
    "bottom"
  ) {
    return (
      <>
        <BottomNavigation
          variant="floating"
          indicator="pill"
          labelBehavior="active"
          density="comfortable"
          {...bottomProps}
          position="static"
          safeArea={
            false
          }
          value={
            currentValue
          }
          onValueChange={
            handleCompactValueChange
          }
        >
          {compactItems.map(
            ({
              node,
              ariaLabel,
            }) => (
              <BottomNavigation.Item
                key={
                  node.id
                }
                value={
                  node.id
                }
                icon={
                  node.icon
                }
                badge={
                  node.badge
                }
                disabled={
                  node.disabled
                }
                aria-label={
                  ariaLabel
                }
              >
                {node.label}
              </BottomNavigation.Item>
            ),
          )}

          {compactProjection
            .hasOverflow ? (
            <BottomNavigation.Item
              value={
                overflowValue
              }
              icon={
                overflowIcon
              }
              aria-label={
                overflowAriaLabel
              }
              data-ui-navigation-presenter-overflow=""
            >
              {overflowLabel}
            </BottomNavigation.Item>
          ) : null}
        </BottomNavigation>

        {overflowDrawer}
      </>
    );
  }

  return (
    <>
      <NavigationRail
        variant="surface"
        indicator="pill"
        labelBehavior="active"
        density="comfortable"
        badgeAnchor="icon"
        badgePlacement="top-end"
        {...railProps}
        position="static"
        placement={
          side === "end"
            ? "right"
            : "left"
        }
        safeArea={
          false
        }
        value={
          currentValue
        }
        onValueChange={
          handleCompactValueChange
        }
      >
        {compactItems.map(
          ({
            node,
            ariaLabel,
          }) => (
            <NavigationRail.Item
              key={
                node.id
              }
              value={
                node.id
              }
              icon={
                node.icon
              }
              badge={
                node.badge
              }
              disabled={
                node.disabled
              }
              aria-label={
                ariaLabel
              }
            >
              {node.label}
            </NavigationRail.Item>
          ),
        )}

        {compactProjection
          .hasOverflow ? (
          <NavigationRail.Item
            value={
              overflowValue
            }
            icon={
              overflowIcon
            }
            aria-label={
              overflowAriaLabel
            }
            data-ui-navigation-presenter-overflow=""
          >
            {overflowLabel}
          </NavigationRail.Item>
        ) : null}
      </NavigationRail>

      {overflowDrawer}
    </>
  );
}


export function NavigationPresenter<
  TMeta = unknown,
>(
  props:
    NavigationPresenterProps<TMeta>,
) {
  return (
    <NavigationPresenterImpl
      {...props}
    />
  );
}

NavigationPresenter.displayName =
  "NavigationPresenter";
