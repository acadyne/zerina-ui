// src/patterns/app-shell/AppShellSidebar.tsx
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Box, Flex } from "../../primitives/layout";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../primitives/overlay";
import { Typography } from "../../primitives/typography";
import type { AppShellProcessedRoute } from "./AppShell.types";
import {
  appShellRouteContainsActive,
  getAppShellRouteChildren,
  getAppShellRouteId,
  isAppShellRouteSelectable,
} from "./AppShellRouteUtils";

export interface AppShellSidebarProps {
  routes: AppShellProcessedRoute[];

  activeRouteId?: string | null;
  activePath?: string;

  collapsed?: boolean;

  /**
   * Width final ya resuelto desde AppShell.
   */
  width?: number | string;

  /**
   * También se aceptan estos nombres por si se usa directo.
   */
  sidebarExpandedWidth?: number | string;
  sidebarCollapsedWidth?: number | string;
  expandedWidth?: number | string;
  collapsedWidth?: number | string;

  headerHeight?: number | string;

  openRouteIds?: string[];
  onOpenRouteIdsChange?: (ids: string[]) => void;

  onNavigate?: (route: AppShellProcessedRoute) => void;
  onRouteSelect?: (route: AppShellProcessedRoute) => void;

  className?: string;
  style?: React.CSSProperties;
}

function toCssSize(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  return typeof value === "number" ? `${value}px` : value;
}

function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;

  const set = new Set(a);
  return b.every((item) => set.has(item));
}

export const AppShellSidebar: React.FC<AppShellSidebarProps> = ({
  routes,
  activeRouteId,
  activePath,
  collapsed = false,

  width,
  sidebarExpandedWidth,
  sidebarCollapsedWidth,
  expandedWidth,
  collapsedWidth,

  headerHeight = 64,

  openRouteIds,
  onOpenRouteIdsChange,

  onNavigate,
  onRouteSelect,

  className = "",
  style,
}) => {
  const isOpenControlled = openRouteIds !== undefined;

  const [internalOpenIds, setInternalOpenIds] = React.useState<string[]>([]);
  const [collapsedMenuOpen, setCollapsedMenuOpen] = React.useState<
    string | null
  >(null);

  const currentOpenIds = isOpenControlled ? openRouteIds : internalOpenIds;

  const setOpenIds = React.useCallback(
    (nextIds: string[] | ((current: string[]) => string[])) => {
      const resolved =
        typeof nextIds === "function" ? nextIds(currentOpenIds ?? []) : nextIds;

      if (!isOpenControlled) {
        setInternalOpenIds(resolved);
      }

      onOpenRouteIdsChange?.(resolved);
    },
    [currentOpenIds, isOpenControlled, onOpenRouteIdsChange]
  );

  const resolvedExpandedWidth = toCssSize(
    sidebarExpandedWidth ?? expandedWidth,
    "286px"
  );

  const resolvedCollapsedWidth = toCssSize(
    sidebarCollapsedWidth ?? collapsedWidth,
    "76px"
  );

  const resolvedHeaderHeight = toCssSize(headerHeight, "64px");

  const resolvedWidth =
    width !== undefined
      ? toCssSize(width, "286px")
      : collapsed
        ? resolvedCollapsedWidth
        : resolvedExpandedWidth;

  React.useEffect(() => {
    if (!collapsed) {
      setCollapsedMenuOpen(null);
    }
  }, [collapsed]);

  React.useEffect(() => {
    const next = new Set(currentOpenIds ?? []);

    const walk = (items: AppShellProcessedRoute[]): boolean => {
      let foundInside = false;

      items.forEach((route) => {
        const routeId = getAppShellRouteId(route);
        const children = getAppShellRouteChildren(route);

        const selfActive = appShellRouteContainsActive(route, {
          activeRouteId,
          activePath,
        });

        const childActive = children.length > 0 ? walk(children) : false;

        if (selfActive || childActive) {
          next.add(routeId);
          foundInside = true;
        }
      });

      return foundInside;
    };

    walk(routes);

    const resolved = Array.from(next);
    const current = currentOpenIds ?? [];

    if (!areStringArraysEqual(resolved, current)) {
      setOpenIds(resolved);
    }
  }, [
    activePath,
    activeRouteId,
    currentOpenIds,
    routes,
    setOpenIds,
  ]);

  const toggleNode = React.useCallback(
    (routeId: string) => {
      setOpenIds((current) => {
        const set = new Set(current);

        if (set.has(routeId)) {
          set.delete(routeId);
        } else {
          set.add(routeId);
        }

        return Array.from(set);
      });
    },
    [setOpenIds]
  );

  const handleRouteSelect = React.useCallback(
    (route: AppShellProcessedRoute) => {
      if (!isAppShellRouteSelectable(route)) return;

      onNavigate?.(route);
      onRouteSelect?.(route);
      setCollapsedMenuOpen(null);
    },
    [onNavigate, onRouteSelect]
  );

  const renderCollapsedMenuItems = React.useCallback(
    (items: AppShellProcessedRoute[], depth = 0): React.ReactNode => {
      return items.map((route) => {
        const routeId = getAppShellRouteId(route);
        const children = getAppShellRouteChildren(route);
        const routeHasChildren = children.length > 0;
        const routeSelectable = isAppShellRouteSelectable(route);

        const active = appShellRouteContainsActive(route, {
          activeRouteId,
          activePath,
        });

        if (routeHasChildren) {
          return (
            <React.Fragment key={routeId}>
              {routeSelectable ? (
                <MenuItem
                  onSelect={() => handleRouteSelect(route)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    paddingLeft: `${0.75 + depth * 0.75}rem`,
                    background: active
                      ? "color-mix(in srgb, var(--ui-primary) 14%, transparent)"
                      : undefined,
                    color: active ? "var(--ui-text)" : undefined,
                    fontWeight: active ? 800 : undefined,
                  }}
                >
                  <span aria-hidden="true">{route.icon ?? route.emoji ?? "•"}</span>
                  <span>{route.name}</span>
                </MenuItem>
              ) : (
                <Box
                  style={{
                    paddingTop: "0.5rem",
                    paddingRight: "0.75rem",
                    paddingBottom: "0.3rem",
                    paddingLeft: `${0.75 + depth * 0.75}rem`,
                    fontSize: "var(--ui-font-size-sm)",
                    fontWeight: 800,
                    color: active ? "var(--ui-text)" : "var(--ui-text-muted)",
                  }}
                >
                  <span aria-hidden="true" style={{ marginRight: "0.5rem" }}>
                    {route.icon ?? route.emoji ?? "•"}
                  </span>
                  {route.name}
                </Box>
              )}

              {renderCollapsedMenuItems(children, depth + 1)}
            </React.Fragment>
          );
        }

        return (
          <MenuItem
            key={routeId}
            onSelect={() => handleRouteSelect(route)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              paddingLeft: `${0.75 + depth * 0.75}rem`,
              background: active
                ? "color-mix(in srgb, var(--ui-primary) 14%, transparent)"
                : undefined,
              color: active ? "var(--ui-text)" : undefined,
              fontWeight: active ? 800 : undefined,
            }}
          >
            <span aria-hidden="true">{route.icon ?? route.emoji ?? "•"}</span>
            <span>{route.name}</span>
          </MenuItem>
        );
      });
    },
    [activePath, activeRouteId, handleRouteSelect]
  );

  const renderTile = React.useCallback(
    ({
      route,
      depth,
      active,
      isOpen,
      routeHasChildren,
    }: {
      route: AppShellProcessedRoute;
      depth: number;
      active: boolean;
      isOpen: boolean;
      routeHasChildren: boolean;
    }) => {
      const iconBoxSize = collapsed ? 42 : 36;

      return (
        <Flex
          align="center"
          justify={collapsed ? "center" : "flex-start"}
          style={{
            width: "100%",
            minWidth: 0,
            minHeight: 52,
            borderRadius: collapsed
              ? "var(--ui-radius-xl)"
              : "var(--ui-radius-lg)",
            paddingTop: "0.35rem",
            paddingBottom: "0.35rem",
            paddingLeft: collapsed ? 0 : 10 + depth * 14,
            paddingRight: collapsed ? 0 : 12,
            cursor: "pointer",
            userSelect: "none",
            background: active
              ? "color-mix(in srgb, var(--ui-primary) 18%, transparent)"
              : "transparent",
            color: active ? "var(--ui-text)" : "var(--ui-text-muted)",
            border: active
              ? "1px solid color-mix(in srgb, var(--ui-primary) 28%, var(--ui-border))"
              : "1px solid transparent",
            boxShadow: active ? "var(--ui-shadow-sm)" : "none",
            transition:
              "background var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), color var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
          }}
          onMouseEnter={(event) => {
            if (active) return;

            event.currentTarget.style.background = "var(--ui-surface-hover)";
            event.currentTarget.style.borderColor = "var(--ui-border)";
          }}
          onMouseLeave={(event) => {
            if (active) return;

            event.currentTarget.style.background = "transparent";
            event.currentTarget.style.borderColor = "transparent";
          }}
        >
          <Flex
            align="center"
            justify="center"
            style={{
              width: iconBoxSize,
              height: iconBoxSize,
              minWidth: iconBoxSize,
              minHeight: iconBoxSize,
              borderRadius: collapsed
                ? "var(--ui-radius-lg)"
                : "var(--ui-radius-md)",
              background: collapsed
                ? active
                  ? "color-mix(in srgb, var(--ui-primary) 22%, transparent)"
                  : "color-mix(in srgb, var(--ui-surface-2) 76%, transparent)"
                : "transparent",
              border: collapsed ? "1px solid var(--ui-border)" : "none",
              flexShrink: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontSize: collapsed ? "1.25rem" : "1.05rem",
                lineHeight: 1,
              }}
            >
              {route.icon ?? route.emoji ?? "•"}
            </span>
          </Flex>

          {!collapsed ? (
            <>
              <Typography
                as="span"
                size="sm"
                weight={active ? 800 : 700}
                color={active ? "var(--ui-text)" : "var(--ui-text-muted)"}
                style={{
                  marginLeft: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {route.name}
              </Typography>

              {route.badge ? (
                <Box
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginRight: routeHasChildren ? "0.4rem" : 0,
                  }}
                >
                  {route.badge}
                </Box>
              ) : null}

              {routeHasChildren ? (
                <Box
                  aria-hidden="true"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ui-text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Box>
              ) : null}
            </>
          ) : null}
        </Flex>
      );
    },
    [collapsed]
  );

  const renderNode = React.useCallback(
    (route: AppShellProcessedRoute, depth: number): React.ReactNode => {
      const routeId = getAppShellRouteId(route);
      const children = getAppShellRouteChildren(route);
      const routeHasChildren = children.length > 0;

      const active = appShellRouteContainsActive(route, {
        activeRouteId,
        activePath,
      });

      const isOpen = Boolean((currentOpenIds ?? []).includes(routeId));
      const selectable = isAppShellRouteSelectable(route);

      const tile = renderTile({
        route,
        depth,
        active,
        isOpen,
        routeHasChildren,
      });

      if (collapsed) {
        if (routeHasChildren) {
          return (
            <Box key={routeId} style={{ width: "100%", minWidth: 0 }}>
              <Menu
                open={collapsedMenuOpen === routeId}
                onOpenChange={(nextOpen) => {
                  setCollapsedMenuOpen(nextOpen ? routeId : null);
                }}
              >
                <MenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={route.name}
                    title={route.name}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {tile}
                  </button>
                </MenuTrigger>

                <MenuContent
                  placement="right-start"
                  offset={10}
                  style={{
                    minWidth: 230,
                    padding: "0.45rem",
                    borderRadius: "var(--ui-radius-xl)",
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface-2) 80%, transparent), var(--ui-surface))",
                    border: "1px solid var(--ui-border)",
                    boxShadow: "var(--ui-shadow-lg)",
                  }}
                >
                  {renderCollapsedMenuItems(children)}
                </MenuContent>
              </Menu>
            </Box>
          );
        }

        return (
          <Box key={routeId} style={{ width: "100%", minWidth: 0 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={route.name}
                  title={route.name}
                  onClick={() => {
                    handleRouteSelect(route);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    cursor: selectable ? "pointer" : "default",
                  }}
                >
                  {tile}
                </button>
              </TooltipTrigger>

              <TooltipContent placement="right">{route.name}</TooltipContent>
            </Tooltip>
          </Box>
        );
      }

      return (
        <Box key={routeId} style={{ width: "100%", minWidth: 0 }}>
          <button
            type="button"
            aria-label={route.name}
            aria-expanded={routeHasChildren ? isOpen : undefined}
            onClick={() => {
              if (routeHasChildren) {
                toggleNode(routeId);
                return;
              }

              handleRouteSelect(route);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: 0,
              border: "none",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {tile}
          </button>

          {routeHasChildren && isOpen ? (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.15rem",
                marginTop: "0.15rem",
              }}
            >
              {children.map((child) => renderNode(child, depth + 1))}
            </Box>
          ) : null}
        </Box>
      );
    },
    [
      activePath,
      activeRouteId,
      collapsed,
      collapsedMenuOpen,
      currentOpenIds,
      handleRouteSelect,
      renderCollapsedMenuItems,
      renderTile,
      toggleNode,
    ]
  );

  return (
    <Box
      as="aside"
      className={className}
      style={{
        position: "fixed",
        top: resolvedHeaderHeight,
        left: 0,
        width: resolvedWidth,
        height: `calc(100dvh - ${resolvedHeaderHeight})`,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: collapsed ? "0.5rem" : "0.25rem",
        overflowY: "auto",
        overflowX: "hidden",
        padding: collapsed ? "0.75rem 0.5rem" : "0.85rem 0.65rem",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface) 94%, transparent), color-mix(in srgb, var(--ui-surface-2) 94%, transparent))",
        borderRight: "1px solid var(--ui-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition:
          "width 0.25s ease, padding var(--ui-duration-normal) var(--ui-ease-standard)",
        ...style,
      }}
    >
      {routes.map((route) => renderNode(route, 0))}
    </Box>
  );
};

AppShellSidebar.displayName = "AppShellSidebar";