// src/patterns/scaffold/MobileScaffold.tsx
import React from "react";
import { Box, Screen, ScrollArea } from "../../primitives/layout";

export type ScaffoldViewport = "window" | "contained";

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
   * Aplica padding horizontal/vertical al body.
   */
  padded?: boolean;

  /**
   * Aplica safe-area al root.
   */
  safeArea?: boolean;

  /**
   * Cuando hay bottomBar/bottomNavigation, agrega padding inferior
   * al área scrolleable para evitar que el contenido quede tapado.
   */
  reserveBottomInset?: boolean;

  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  floatingStyle?: React.CSSProperties;
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
  bodyStyle,
  contentStyle,
  floatingStyle,

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

  const body = (
    <Box
      style={{
        width: "100%",
        height: scrollable ? undefined : "100%",
        minWidth: 0,
        minHeight: 0,
        boxSizing: "border-box",
        overflow: scrollable ? undefined : "hidden",
        ...bodyPaddingStyles,
        ...contentStyle,
      }}
    >
      {children}
    </Box>
  );

  return (
    <Screen
      className={className}
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
      style={{
        height: getViewportHeight(viewport),
        minHeight: isContained ? 0 : getViewportHeight(viewport),
        width: "100%",
        minWidth: 0,
        position: "relative",
        overflow: "hidden",
        background: "var(--ui-bg)",
        color: "var(--ui-text)",
        ...style,
      }}
    >
      {appBar ? <Screen.Header>{appBar}</Screen.Header> : null}

      <Screen.Body
        style={{
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
          ...bodyStyle,
        }}
      >
        {scrollable ? (
          <ScrollArea
            axis="y"
            contain
            momentum
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {body}
          </ScrollArea>
        ) : (
          body
        )}
      </Screen.Body>

      {floating ? (
        <Box
          style={{
            position: "absolute",
            right: "max(1rem, env(safe-area-inset-right, 0px))",
            bottom: hasBottom
              ? "calc(5.25rem + env(safe-area-inset-bottom, 0px))"
              : "max(1rem, env(safe-area-inset-bottom, 0px))",
            zIndex: 30,
            ...floatingStyle,
          }}
        >
          {floating}
        </Box>
      ) : null}

      {bottom ? <Screen.Footer>{bottom}</Screen.Footer> : null}
    </Screen>
  );
}

MobileScaffold.displayName = "MobileScaffold";