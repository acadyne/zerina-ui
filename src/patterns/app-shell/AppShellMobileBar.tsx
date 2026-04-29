import React from "react";
import { Box, Flex } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";
import { RecursiveFloatingMenuLayer } from "../../primitives/navigation";
import type { AppShellProcessedRoute } from "./AppShell.types";
import { isAppShellRouteActive } from "./AppShellRouteUtils";

export interface AppShellMobileBarProps {
  routes: AppShellProcessedRoute[];

  activePath?: string;
  height?: number;

  onNavigate?: (route: AppShellProcessedRoute) => void;

  className?: string;
  style?: React.CSSProperties;
}

export function AppShellMobileBar({
  routes,
  activePath = "/",
  height = 68,
  onNavigate,
  className = "",
  style,
}: AppShellMobileBarProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [openRouteId, setOpenRouteId] = React.useState<string | null>(null);
  const [anchorX, setAnchorX] = React.useState(0);

  const openRoute = React.useMemo(() => {
    return routes.find((route) => route.id === openRouteId) ?? null;
  }, [routes, openRouteId]);

  const handleRootClick = (
    route: AppShellProcessedRoute,
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (route.disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    setAnchorX(rect.left - (containerRect?.left ?? 0) + rect.width / 2);

    if (route.subroutes?.length) {
      setOpenRouteId((current) => (current === route.id ? null : route.id));
      return;
    }

    setOpenRouteId(null);
    onNavigate?.(route);
  };

  const renderMobileMenuItem = (route: AppShellProcessedRoute) => {
    const active = isAppShellRouteActive(activePath, route);
    const iconContent = route.icon ?? route.emoji ?? "•";

    return (
      <button
        key={route.id}
        type="button"
        disabled={route.disabled}
        onClick={() => {
          if (route.subroutes?.length) return;
          setOpenRouteId(null);
          onNavigate?.(route);
        }}
        style={{
          width: "100%",
          minHeight: 42,
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.55rem 0.7rem",
          borderRadius: "var(--ui-radius-md)",
          border: active
            ? "1px solid color-mix(in srgb, var(--ui-primary) 30%, var(--ui-border))"
            : "1px solid transparent",
          background: active
            ? "color-mix(in srgb, var(--ui-primary) 16%, transparent)"
            : "transparent",
          color: active ? "var(--ui-text)" : "var(--ui-text-muted)",
          cursor: route.disabled ? "not-allowed" : "pointer",
          opacity: route.disabled ? "var(--ui-state-disabled-opacity)" : 1,
          textAlign: "left",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 26,
            height: 26,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {iconContent}
        </span>

        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: active ? 800 : 700,
          }}
        >
          {route.name}
        </span>
      </button>
    );
  };

  return (
    <Box
      ref={containerRef as React.Ref<Element>}
      className={className}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1400,
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "color-mix(in srgb, var(--ui-surface) 92%, transparent)",
        borderTop: "1px solid var(--ui-border)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        ...style,
      }}
    >
      <Flex
        align="center"
        justify="space-around"
        style={{
          height,
          minWidth: 0,
          padding: "0.4rem 0.45rem",
          position: "relative",
        }}
      >
        {routes.map((route) => {
          const active = isAppShellRouteActive(activePath, route);
          const iconContent = route.icon ?? route.emoji ?? "•";

          return (
            <button
              key={route.id}
              type="button"
              disabled={route.disabled}
              onClick={(event) => handleRootClick(route, event)}
              style={{
                flex: "1 1 0",
                minWidth: 0,
                height: "100%",
                border: "1px solid transparent",
                borderRadius: "var(--ui-radius-lg)",
                background: active
                  ? "color-mix(in srgb, var(--ui-primary) 16%, transparent)"
                  : "transparent",
                color: active ? "var(--ui-text)" : "var(--ui-text-muted)",
                cursor: route.disabled ? "not-allowed" : "pointer",
                opacity: route.disabled ? "var(--ui-state-disabled-opacity)" : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.2rem",
                padding: "0.25rem",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: "1.15rem",
                  lineHeight: 1,
                }}
              >
                {iconContent}
              </span>

              <Typography
                as="span"
                size="xs"
                weight={active ? 800 : 700}
                style={{
                  maxWidth: "100%",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "inherit",
                }}
              >
                {route.name}
              </Typography>
            </button>
          );
        })}

        <RecursiveFloatingMenuLayer
          open={Boolean(openRoute?.subroutes?.length)}
          level={1}
          anchorX={anchorX}
          containerRef={containerRef}
          direction="up"
          onDismiss={() => setOpenRouteId(null)}
          style={{
            minWidth: 220,
          }}
        >
          {openRoute?.subroutes?.map(renderMobileMenuItem)}
        </RecursiveFloatingMenuLayer>
      </Flex>
    </Box>
  );
}

AppShellMobileBar.displayName = "AppShellMobileBar";