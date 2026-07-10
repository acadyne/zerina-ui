// src/patterns/scaffold/MobileScaffold.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Box, Screen, ScrollArea } from "../../primitives/layout";

export type ScaffoldViewport = "window" | "contained";

export type MobileScaffoldSlot =
  | "root"
  | "appBar"
  | "body"
  | "scrollArea"
  | "content"
  | "floating"
  | "footer";

export type MobileScaffoldStyles = SlotStyleMap<MobileScaffoldSlot>;

export type MobileScaffoldSlotProps = SlotPropsMap<MobileScaffoldSlot>;

export interface MobileScaffoldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactNode;

  /**
   * window:
   *   Ocupa el viewport dinámico real.
   *
   * contained:
   *   Ocupa el alto/ancho del contenedor padre.
   */
  viewport?: ScaffoldViewport;

  appBar?: React.ReactNode;
  bottomBar?: React.ReactNode;

  /**
   * Alias semántico para bottomBar cuando se usa BottomNavigation.
   */
  bottomNavigation?: React.ReactNode;

  /**
   * Contenido flotante por encima del body.
   * Útil para FABs, quick actions o overlays locales.
   */
  floating?: React.ReactNode;

  /**
   * true:
   *   El body usa ScrollArea vertical.
   *
   * false:
   *   El body no agrega scroll propio y ocupa todo el alto disponible.
   *   Útil para NavigationStack, mapas, canvas, juegos o layouts propios.
   */
  scrollable?: boolean;

  /**
   * Aplica padding horizontal/vertical al content.
   */
  padded?: boolean;

  /**
   * Aplica safe-area al root.
   */
  safeArea?: boolean;

  /**
   * Cuando hay bottomBar/bottomNavigation, agrega padding inferior
   * al área de contenido para evitar que quede tapado.
   */
  reserveBottomInset?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: MobileScaffoldStyles;
  slotProps?: MobileScaffoldSlotProps;
}

function getViewportHeight(viewport: ScaffoldViewport): string {
  return viewport === "contained" ? "100%" : "100dvh";
}

function getBodyPaddingStyles({
  padded,
  hasBottom,
  reserveBottomInset,
}: {
  padded: boolean;
  hasBottom: boolean;
  reserveBottomInset: boolean;
}): React.CSSProperties {
  const basePadding = padded ? "1rem" : undefined;

  return {
    paddingTop: basePadding,
    paddingRight: basePadding,
    paddingLeft: basePadding,
    paddingBottom:
      padded && hasBottom && reserveBottomInset
        ? "calc(1rem + env(safe-area-inset-bottom, 0px))"
        : padded
          ? "1rem"
          : hasBottom && reserveBottomInset
            ? "env(safe-area-inset-bottom, 0px)"
            : undefined,
  };
}

export function MobileScaffold({
  children,

  viewport = "window",

  appBar,
  bottomBar,
  bottomNavigation,
  floating,

  scrollable = true,
  padded = false,
  safeArea = false,
  reserveBottomInset = true,

  className = "",
  style,

  styles,
  slotProps,

  ...rest
}: MobileScaffoldProps) {
  const bottom = bottomNavigation ?? bottomBar;
  const hasBottom = Boolean(bottom);
  const isContained = viewport === "contained";

  const bodyPaddingStyles = getBodyPaddingStyles({
    padded,
    hasBottom,
    reserveBottomInset,
  });

  const rootSlot = resolveSlot<MobileScaffoldSlot>({
    slot: "root",
    styles,
    slotProps,
    className,
    style,
    baseProps: {
      "data-ui-mobile-scaffold": "",
      "data-ui-mobile-scaffold-viewport": viewport,
      "data-ui-mobile-scaffold-scrollable": scrollable || undefined,
    },
    baseStyle: {
      height: getViewportHeight(viewport),
      minHeight: isContained ? 0 : getViewportHeight(viewport),
      width: "100%",
      minWidth: 0,
      position: "relative",
      overflow: "hidden",
      background: "var(--ui-bg)",
      color: "var(--ui-text)",
    },
  });

  const appBarSlot = resolveSlot<MobileScaffoldSlot>({
    slot: "appBar",
    styles,
    slotProps,
    baseProps: {
      "data-ui-mobile-scaffold-app-bar": "",
    },
  });

  const bodySlot = resolveSlot<MobileScaffoldSlot>({
    slot: "body",
    styles,
    slotProps,
    baseProps: {
      "data-ui-mobile-scaffold-body": "",
    },
    baseStyle: {
      minWidth: 0,
      minHeight: 0,
      overflow: "hidden",
    },
  });

  const scrollAreaSlot = resolveSlot<MobileScaffoldSlot>({
    slot: "scrollArea",
    styles,
    slotProps,
    baseProps: {
      "data-ui-mobile-scaffold-scroll-area": "",
    },
    baseStyle: {
      width: "100%",
      height: "100%",
    },
  });

  const contentSlot = resolveSlot<MobileScaffoldSlot>({
    slot: "content",
    styles,
    slotProps,
    baseProps: {
      "data-ui-mobile-scaffold-content": "",
    },
    baseStyle: {
      width: "100%",
      height: scrollable ? undefined : "100%",
      minWidth: 0,
      minHeight: 0,
      boxSizing: "border-box",
      overflow: scrollable ? undefined : "hidden",
      ...bodyPaddingStyles,
    },
  });

  const floatingSlot = resolveSlot<MobileScaffoldSlot>({
    slot: "floating",
    styles,
    slotProps,
    baseProps: {
      "data-ui-mobile-scaffold-floating": "",
    },
    baseStyle: {
      position: "absolute",
      right: "max(1rem, env(safe-area-inset-right, 0px))",
      bottom: hasBottom
        ? "calc(5.25rem + env(safe-area-inset-bottom, 0px))"
        : "max(1rem, env(safe-area-inset-bottom, 0px))",
      zIndex: 30,
    },
  });

  const footerSlot = resolveSlot<MobileScaffoldSlot>({
    slot: "footer",
    styles,
    slotProps,
    baseProps: {
      "data-ui-mobile-scaffold-footer": "",
    },
  });

  const body = <Box {...contentSlot}>{children}</Box>;

  return (
    <Screen
      className={rootSlot.className}
      fullHeight={viewport === "window"}
      safeArea={
        safeArea
          ? {
              top: false,
              right: true,
              bottom: false,
              left: true,
            }
          : false
      }
      {...rest}
      style={rootSlot.style}
    >
      {appBar ? (
        <Screen.Header {...appBarSlot}>{appBar}</Screen.Header>
      ) : null}

      <Screen.Body {...bodySlot}>
        {scrollable ? (
          <ScrollArea axis="y" contain momentum {...scrollAreaSlot}>
            {body}
          </ScrollArea>
        ) : (
          body
        )}
      </Screen.Body>

      {floating ? <Box {...floatingSlot}>{floating}</Box> : null}

      {bottom ? <Screen.Footer {...footerSlot}>{bottom}</Screen.Footer> : null}
    </Screen>
  );
}

MobileScaffold.displayName = "MobileScaffold";