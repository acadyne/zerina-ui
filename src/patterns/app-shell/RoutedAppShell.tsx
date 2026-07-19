// src/patterns/app-shell/RoutedAppShell.tsx
import React from "react";
import { AppShell, type AppShellProps } from "./AppShell";
import type {
  NavigationNode,
} from "../navigation";

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
  navigate?: (
    path: string,
    node: NavigationNode
  ) => void;

  /**
   * Callback adicional cuando se selecciona un nodo.
   * No reemplaza a navigate; se ejecutan ambos.
   */
  onNavigate?: (
    node: NavigationNode
  ) => void;
}

export function RoutedAppShell({
  children,
  navigate,
  onNavigate,
  ...shellProps
}: RoutedAppShellProps) {
  const handleNavigate = React.useCallback(
    (
      node: NavigationNode
    ) => {
      onNavigate?.(node);

      const path =
        typeof node.meta === "object" &&
        node.meta !== null &&
        "path" in node.meta
          ? String(node.meta.path)
          : undefined;

      if (path) {
        navigate?.(
          path,
          node
        );
      }
    },
    [
      navigate,
      onNavigate,
    ]
  );

  return (
    <AppShell
      {...shellProps}
      onNavigate={handleNavigate}
    >
      {children}
    </AppShell>
  );
}

RoutedAppShell.displayName =
  "RoutedAppShell";