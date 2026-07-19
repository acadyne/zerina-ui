// src/patterns/app-shell/RoutedAppShell.tsx

import React from "react";

import {
  AppShell,
  type AppShellProps,
} from "./AppShell";

import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../navigation";


export interface RoutedAppShellProps
  extends Omit<
    AppShellProps,
    "children" | "onNavigate"
  > {

  children?: React.ReactNode;


  /**
   * Navegación externa.
   *
   * RoutedAppShell es el límite entre:
   *
   * NavigationNode
   *        |
   *        v
   * Router externo
   *
   * El router puede ser:
   * - react-router
   * - wouter
   * - tanstack router
   * - next/router
   * - cualquier implementación externa
   *
   * AppShell NO conoce routers.
   */
  navigate?: (
    href: string,
    node: NavigationNode<NavigationLinkMeta>
  ) => void;


  /**
   * Callback adicional cuando un nodo navegable
   * es seleccionado.
   *
   * No reemplaza navigate.
   *
   * Ambos pueden ejecutarse:
   *
   * onNavigate(node)
   *        +
   * navigate(node.meta.href)
   */
  onNavigate?: (
    node: NavigationNode<NavigationLinkMeta>
  ) => void;
}


/**
 * Wrapper de navegación externa para AppShell.
 *
 * Responsabilidades:
 *
 * leer NavigationLinkMeta.href
 * llamar al router externo
 * notificar selección
 *
 * No hace:
 *
 * resolver activeId
 * conocer activePath
 * transformar routes
 * crear NavigationNode
 *
 * El estado activo pertenece a AppShell.
 * El router pertenece al consumidor.
 */
export function RoutedAppShell({
  children,

  navigate,

  onNavigate,

  ...shellProps

}: RoutedAppShellProps) {

  const handleNavigate =
    React.useCallback(
      (
        node: NavigationNode<NavigationLinkMeta>
      ) => {

        onNavigate?.(
          node
        );


        /**
         * El destino externo vive en metadata.
         *
         * No usamos:
         *
         * node.path
         * node.route
         *
         */
        const href =
          node.meta?.href;


        if (href) {

          navigate?.(
            href,
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
      onNavigate={
        handleNavigate
      }
    >
      {children}
    </AppShell>
  );
}


RoutedAppShell.displayName =
  "RoutedAppShell";