// src/patterns/app-shell/AppShellMobileBar.tsx
import React from "react";
import { getElementRect } from "../../core/dom";
import type { UIPressEvent } from "../../core/interaction";
import { Box } from "../../primitives/layout";
import { BottomNavigation } from "../../primitives/navigation";
import { RecursiveFloatingMenuLayer } from "../../primitives/navigation/RecursiveFloatingMenuLayer";
import type {
  AppShellProcessedRoute,
  AppShellViewport,
} from "./AppShell.types";
import {
  appShellRouteContainsActive,
  getAppShellRouteChildren,
  isAppShellRouteActive,
  isAppShellRouteSelectable,
} from "./AppShellRouteUtils";

export interface AppShellMobileBarProps {
  viewport?: AppShellViewport;

  routes: AppShellProcessedRoute[];

  activePath?: string;
  height?: number;

  onNavigate?: (
    route: AppShellProcessedRoute
  ) => void;

  className?: string;
  style?: React.CSSProperties;
}

function getRouteIcon(
  route: AppShellProcessedRoute
): React.ReactNode {
  return (
    route.icon ??
    route.emoji ??
    "•"
  );
}

function getActiveRootRouteId(
  routes: AppShellProcessedRoute[],
  activePath: string
): string | null {
  return (
    routes.find((route) =>
      appShellRouteContainsActive(
        route,
        {
          activePath,
        }
      )
    )?.id ?? null
  );
}

export function AppShellMobileBar({
  viewport = "window",
  routes,
  activePath = "/",
  height = 68,
  onNavigate,
  className = "",
  style,
}: AppShellMobileBarProps) {
  const containerRef =
    React.useRef<HTMLDivElement | null>(
      null
    );

  const [
    openRouteId,
    setOpenRouteId,
  ] =
    React.useState<string | null>(
      null
    );

  const [
    anchorX,
    setAnchorX,
  ] =
    React.useState(0);

  const isContained =
    viewport === "contained";

  const openRoute =
    React.useMemo(() => {
      return (
        routes.find(
          (route) =>
            route.id ===
            openRouteId
        ) ?? null
      );
    }, [
      routes,
      openRouteId,
    ]);

  const activeRootRouteId =
    React.useMemo(
      () =>
        getActiveRootRouteId(
          routes,
          activePath
        ),
      [
        activePath,
        routes,
      ]
    );

  const updateAnchor =
    React.useCallback(
      (
        event: UIPressEvent<HTMLElement>
      ): void => {
        const triggerRect =
          getElementRect(
            event.currentTarget
          );

        const containerRect =
          getElementRect(
            containerRef.current
          );

        setAnchorX(
          triggerRect.left -
            containerRect.left +
            triggerRect.width / 2
        );
      },
      []
    );

  const handleRootPress =
    React.useCallback(
      (
        route: AppShellProcessedRoute,
        event: UIPressEvent<HTMLElement>
      ): void => {
        if (route.disabled) {
          return;
        }

        updateAnchor(event);

        const children =
          getAppShellRouteChildren(
            route
          );

        if (
          children.length > 0
        ) {
          event.preventDefault();

          setOpenRouteId(
            (current) =>
              current === route.id
                ? null
                : route.id
          );

          return;
        }

        setOpenRouteId(null);

        if (
          isAppShellRouteSelectable(
            route
          )
        ) {
          onNavigate?.(route);
        }
      },
      [
        onNavigate,
        updateAnchor,
      ]
    );

  const renderMobileMenuItem =
    React.useCallback(
      (
        route: AppShellProcessedRoute
      ) => {
        const active =
          isAppShellRouteActive(
            activePath,
            route
          );

        const iconContent =
          getRouteIcon(route);

        return (
          <button
            key={route.id}
            type="button"
            disabled={
              route.disabled
            }
            onClick={() => {
              const children =
                getAppShellRouteChildren(
                  route
                );

              if (
                children.length >
                0
              ) {
                return;
              }

              if (
                !isAppShellRouteSelectable(
                  route
                )
              ) {
                return;
              }

              setOpenRouteId(
                null
              );

              onNavigate?.(
                route
              );
            }}
            style={{
              width: "100%",
              minHeight: 42,

              display: "flex",
              alignItems: "center",

              gap: "0.65rem",

              padding:
                "0.55rem 0.7rem",

              borderRadius:
                "var(--ui-radius-md)",

              border: active
                ? "1px solid color-mix(in srgb, var(--ui-primary) 30%, var(--ui-border))"
                : "1px solid transparent",

              background:
                active
                  ? "color-mix(in srgb, var(--ui-primary) 16%, transparent)"
                  : "transparent",

              color: active
                ? "var(--ui-text)"
                : "var(--ui-text-muted)",

              cursor:
                route.disabled
                  ? "not-allowed"
                  : "pointer",

              opacity:
                route.disabled
                  ? "var(--ui-state-disabled-opacity)"
                  : 1,

              textAlign: "left",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 26,
                height: 26,

                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink: 0,
              }}
            >
              {iconContent}
            </span>

            <span
              style={{
                flex: 1,
                minWidth: 0,

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",

                fontWeight:
                  active
                    ? 800
                    : 700,
              }}
            >
              {route.name}
            </span>
          </button>
        );
      },
      [
        activePath,
        onNavigate,
      ]
    );

  return (
    <Box
      ref={
        containerRef as React.Ref<Element>
      }
      className={
        className
      }
      style={{
        position:
          isContained
            ? "absolute"
            : "fixed",

        left: 0,
        right: 0,
        bottom: 0,

        zIndex: 1400,

        ...style,
      }}
    >
      <Box
        style={{
          position:
            "relative",

          minWidth: 0,
        }}
      >
        <BottomNavigation
          position="static"
          safeArea
          translucent
          height={height}
          value={
            activeRootRouteId
          }
        >
          {routes.map(
            (route) => {
              const children =
                getAppShellRouteChildren(
                  route
                );

              const hasChildren =
                children.length >
                0;

              return (
                <BottomNavigation.Item
                  key={
                    route.id
                  }
                  value={
                    route.id
                  }
                  icon={
                    getRouteIcon(
                      route
                    )
                  }
                  badge={
                    route.badge
                  }
                  disabled={
                    route.disabled
                  }
                  aria-haspopup={
                    hasChildren
                      ? "menu"
                      : undefined
                  }
                  aria-expanded={
                    hasChildren
                      ? openRouteId ===
                        route.id
                      : undefined
                  }
                  onPress={(
                    event
                  ) => {
                    handleRootPress(
                      route,
                      event
                    );
                  }}
                >
                  {route.name}
                </BottomNavigation.Item>
              );
            }
          )}
        </BottomNavigation>

        <RecursiveFloatingMenuLayer
          open={Boolean(
            openRoute
              ?.subroutes
              ?.length
          )}
          level={1}
          anchorX={
            anchorX
          }
          containerRef={
            containerRef
          }
          direction="up"
          onDismiss={() =>
            setOpenRouteId(
              null
            )
          }
          style={{
            minWidth: 220,
          }}
        >
          {openRoute
            ?.subroutes
            ?.map(
              renderMobileMenuItem
            )}
        </RecursiveFloatingMenuLayer>
      </Box>
    </Box>
  );
}

AppShellMobileBar.displayName =
  "AppShellMobileBar";