// src/patterns/app-shell/RoutedAppShell.tsx
import React from "react";
import { AppShell, type AppShellProps } from "./AppShell";
import type { AppShellProcessedRoute } from "./AppShell.types";

export interface RoutedAppShellProps
  extends Omit<AppShellProps, "children" | "onNavigate"> {
  children?: React.ReactNode;

  /**
   * Función de navegación externa.
   *
   * Ejemplos:
   *
   * wouter:
   * navigate={(path) => navigate(path)}
   *
   * react-router:
   * navigate={(path) => routerNavigate(path)}
   *
   * tanstack/router:
   * navigate={(path) => router.navigate({ to: path })}
   */
  navigate?: (path: string, route: AppShellProcessedRoute) => void;

  /**
   * Callback adicional cuando se selecciona una ruta.
   * No reemplaza a navigate; se ejecutan ambos.
   */
  onNavigate?: (route: AppShellProcessedRoute) => void;
}

export function RoutedAppShell({
  children,
  navigate,
  onNavigate,
  ...shellProps
}: RoutedAppShellProps) {
  const handleNavigate = React.useCallback(
    (route: AppShellProcessedRoute) => {
      onNavigate?.(route);

      if (route.path) {
        navigate?.(route.path, route);
      }
    },
    [navigate, onNavigate]
  );

  return (
    <AppShell {...shellProps} onNavigate={handleNavigate}>
      {children}
    </AppShell>
  );
}

RoutedAppShell.displayName = "RoutedAppShell";