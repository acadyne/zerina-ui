// src/patterns/app-shell/AppShellHeader.tsx
import React from "react";
import {
  ChevronDown,
  LogOut,
  Menu as MenuIcon,
  PanelLeft,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Box, Flex } from "../../primitives/layout";
import { IconButton } from "../../primitives/forms";
import { Typography } from "../../primitives/typography";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../primitives/overlay";
import { useOptionalUIViewport } from "../../core/viewport";

import type {
  AppShellBrand,
  AppShellUserInfo,
  AppShellViewport,
} from "./AppShell.types";


import {
  useUITheme,
} from "../../theme";
import { getScaffoldLayer } from "../scaffold/scaffoldLayers";

function getInitials(user?: AppShellUserInfo): string {
  if (user?.initials) return user.initials;

  const raw = String(user?.name ?? "Usuario").trim();
  if (!raw) return "U";

  const parts = raw.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export interface AppShellHeaderProps {
  viewport?: AppShellViewport;

  brand?: AppShellBrand;
  user?: AppShellUserInfo;

  /**
   * Reemplaza el bloque default de marca/logo.
   */
  headerStart?: React.ReactNode;

  /**
   * Zona central del header.
   */
  headerCenter?: React.ReactNode;

  /**
   * Zona adicional antes de las acciones default.
   */
  headerEnd?: React.ReactNode;

  collapsed?: boolean;
  isMobile?: boolean;

  height?: number | string;

  showCollapseButton?: boolean;
  showMobileModeButton?: boolean;
  showThemeButton?: boolean;
  showUserMenu?: boolean;

  onToggleCollapsed?: () => void;
  onToggleMobileMode?: () => void;

  logoutLabel?: React.ReactNode;
  onLogout?: () => void | Promise<void>;

  className?: string;
  style?: React.CSSProperties;
}

export function AppShellHeader({
  viewport = "window",

  brand,
  user,

  headerStart,
  headerCenter,
  headerEnd,

  collapsed = false,
  isMobile,

  height = 64,

  showCollapseButton = true,
  showMobileModeButton = true,
  showThemeButton = true,
  showUserMenu = true,

  onToggleCollapsed,
  onToggleMobileMode,

  logoutLabel = "Cerrar sesión",
  onLogout,

  className = "",
  style,
}: AppShellHeaderProps) {
  const viewportInfo = useOptionalUIViewport();
  const resolvedMobile = isMobile ?? Boolean(viewportInfo?.isMobile);
  const isContained = viewport === "contained";

  const { theme, cycleTheme } = useUITheme();

  const ThemeIcon =
    theme.metadata?.icon ?? Sparkles;

  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const initials = React.useMemo(() => getInitials(user), [user]);

  const defaultBrand = (
    <Flex
      align="center"
      gap="0.75rem"
      style={{
        minWidth: 0,
        padding: "0.35rem 0.65rem 0.35rem 0.35rem",
        borderRadius: "var(--ui-radius-xl)",
        border: "1px solid var(--ui-border)",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface-2) 78%, transparent), var(--ui-surface))",
        boxShadow: "var(--ui-shadow-sm)",
      }}
    >
      <Box
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          minWidth: 36,
          minHeight: 36,
          borderRadius: "9999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "color-mix(in srgb, var(--ui-primary) 16%, transparent)",
          color: "var(--ui-text)",
          fontWeight: 800,
          fontSize: "0.82rem",
          border: "1px solid var(--ui-border)",
          boxShadow: "var(--ui-shadow-sm)",
          flexShrink: 0,
        }}
      >
        {brand?.logo ?? initials}
      </Box>

      <Box style={{ minWidth: 0 }}>
        <Typography
          as="div"
          size="sm"
          weight={800}
          style={{
            margin: 0,
            color: "var(--ui-text)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: resolvedMobile ? "140px" : "280px",
          }}
        >
          {brand?.title ?? user?.name ?? "Zerina UI"}
        </Typography>

        <Typography
          as="div"
          size="xs"
          color="var(--ui-text-muted)"
          style={{
            marginTop: "0.1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: resolvedMobile ? "140px" : "280px",
          }}
        >
          {brand?.subtitle ?? user?.role ?? "App Shell"}
        </Typography>
      </Box>
    </Flex>
  );

  return (
    <Box
      as="header"
      className={className}
      data-ui-app-shell-header-viewport={viewport}
      data-ui-app-shell-header-mobile={resolvedMobile || undefined}
      style={{
        position: isContained ? "absolute" : "sticky",
        top: 0,
        left: isContained ? 0 : undefined,
        right: isContained ? 0 : undefined,
        zIndex: getScaffoldLayer("navigation"),
        width: "100%",
        height,
        padding: "0.55rem 0.75rem",
        background: "color-mix(in srgb, var(--ui-surface) 88%, transparent)",
        borderBottom: "1px solid var(--ui-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        h="100%"
        gap="0.75rem"
        style={{
          position: "relative",
          maxWidth: "100%",
          minWidth: 0,
        }}
      >
        <Flex
          align="center"
          gap="0.65rem"
          style={{
            minWidth: 0,
            flex: "0 1 auto",
            maxWidth: headerCenter ? "34%" : "100%",
            position: "relative",
            zIndex: 2,
          }}
        >
          {showCollapseButton ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <IconButton
                    ariaLabel={
                      collapsed ? "Expandir navegación" : "Colapsar navegación"
                    }
                    icon={<PanelLeft size={18} />}
                    onPress={onToggleCollapsed}
                    variant="ghost"
                    size="sm"
                    disabled={resolvedMobile}
                    style={{
                      color: "var(--ui-text)",
                      border: "1px solid var(--ui-border)",
                      background:
                        "color-mix(in srgb, var(--ui-surface-2) 70%, transparent)",
                    }}
                  />
                </span>
              </TooltipTrigger>

              <TooltipContent>
                {resolvedMobile
                  ? "En modo mobile se usa navegación inferior"
                  : collapsed
                    ? "Expandir sidebar"
                    : "Colapsar sidebar"}
              </TooltipContent>
            </Tooltip>
          ) : null}

          <Box
            style={{
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            {headerStart ?? defaultBrand}
          </Box>
        </Flex>

        {headerCenter ? (
          <Box
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: resolvedMobile
                ? "min(48vw, 420px)"
                : "min(44vw, 560px)",
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <Box
              style={{
                width: "100%",
                minWidth: 0,
                pointerEvents: "auto",
              }}
            >
              {headerCenter}
            </Box>
          </Box>
        ) : null}

        <Flex
          align="center"
          gap="0.5rem"
          style={{
            flexShrink: 0,
            minWidth: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          {headerEnd ? (
            <Box
              style={{
                minWidth: 0,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {headerEnd}
            </Box>
          ) : null}

          {showMobileModeButton ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <IconButton
                    ariaLabel={
                      resolvedMobile
                        ? "Salir de modo mobile"
                        : "Activar modo mobile"
                    }
                    icon={<Smartphone size={16} />}
                    variant="ghost"
                    size="sm"
                    onPress={onToggleMobileMode}
                    style={{
                      color: resolvedMobile
                        ? "var(--ui-primary)"
                        : "var(--ui-text)",
                      border: "1px solid var(--ui-border)",
                      background: resolvedMobile
                        ? "color-mix(in srgb, var(--ui-primary) 12%, transparent)"
                        : "color-mix(in srgb, var(--ui-surface-2) 70%, transparent)",
                    }}
                  />
                </span>
              </TooltipTrigger>

              <TooltipContent>
                {resolvedMobile ? "Salir de modo mobile" : "Activar modo mobile"}
              </TooltipContent>
            </Tooltip>
          ) : null}

          {showThemeButton ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <IconButton
                    ariaLabel={`Cambiar tema. Tema actual: ${theme.name}`}
                    icon={<ThemeIcon size={16} />}
                    variant="ghost"
                    size="sm"
                    onPress={cycleTheme}
                    style={{
                      color: "var(--ui-text)",
                      border: "1px solid var(--ui-border)",
                      background:
                        "color-mix(in srgb, var(--ui-surface-2) 70%, transparent)",
                    }}
                  />
                </span>
              </TooltipTrigger>

              <TooltipContent>
                Tema actual: {theme.name}. Click para cambiar.
              </TooltipContent>
            </Tooltip>
          ) : null}

          {showUserMenu ? (
            <Menu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <MenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Opciones de usuario"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <Flex
                    align="center"
                    gap="0.35rem"
                    style={{
                      padding: "0.22rem",
                      paddingLeft: "0.45rem",
                      borderRadius: "9999px",
                      border: "1px solid var(--ui-border)",
                      background:
                        "color-mix(in srgb, var(--ui-surface-2) 70%, transparent)",
                      color: "var(--ui-text)",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: "9999px",
                        background:
                          "color-mix(in srgb, var(--ui-primary) 14%, transparent)",
                        border: "1px solid var(--ui-border)",
                        flexShrink: 0,
                      }}
                    >
                      <MenuIcon size={15} />
                    </Box>

                    <ChevronDown size={15} />
                  </Flex>
                </button>
              </MenuTrigger>

              <MenuContent
                placement="bottom-end"
                style={{
                  minWidth: "230px",
                  padding: "0.45rem",
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface-2) 80%, transparent), var(--ui-surface))",
                  border: "1px solid var(--ui-border)",
                  boxShadow: "var(--ui-shadow-lg)",
                  borderRadius: "var(--ui-radius-xl)",
                }}
              >
                <Box
                  style={{
                    padding: "0.55rem 0.75rem 0.7rem",
                    marginBottom: "0.25rem",
                    borderBottom: "1px solid var(--ui-border)",
                  }}
                >
                  <Typography
                    as="div"
                    size="sm"
                    weight={800}
                    style={{ margin: 0 }}
                  >
                    {user?.name ?? "Usuario"}
                  </Typography>

                  <Typography
                    as="div"
                    size="xs"
                    color="var(--ui-text-muted)"
                    style={{ marginTop: "0.2rem" }}
                  >
                    {user?.email ?? user?.role ?? "Sesión activa"}
                  </Typography>
                </Box>

                {onLogout ? (
                  <MenuItem
                    onSelect={() => {
                      void onLogout();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <LogOut size={16} />
                    <span>{logoutLabel}</span>
                  </MenuItem>
                ) : null}
              </MenuContent>
            </Menu>
          ) : null}
        </Flex>
      </Flex>
    </Box>
  );
}

AppShellHeader.displayName = "AppShellHeader";