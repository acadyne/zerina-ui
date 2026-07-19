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


/**
 * RoutedAppShell
 *
 * Adaptador entre AppShell y un router externo.
 *
 * IMPORTANTE:
 *
 * AppShell NO conoce routers.
 *
 * AppShell solamente trabaja con:
 *
 * NavigationNode
 *        |
 *        v
 * selección de navegación
 *
 *
 * RoutedAppShell agrega la integración externa:
 *
 * NavigationNode
 *        |
 *        v
 * NavigationLinkMeta.href
 *        |
 *        v
 * router del consumidor
 *
 *
 * Ejemplos de routers compatibles:
 *
 * - react-router
 * - wouter
 * - TanStack Router
 * - Next Router
 * - cualquier implementación propia
 *
 *
 * Este componente existe para evitar que:
 *
 * ❌ AppShell conozca URLs
 * ❌ NavigationNode conozca routers
 * ❌ Navigation primitives conozcan navegación externa
 *
 *
 * La separación queda:
 *
 * NavigationNode
 *      =
 *      modelo seleccionable
 *
 *
 * NavigationLinkMeta
 *      =
 *      metadata opcional de destino
 *
 *
 * RoutedAppShell
 *      =
 *      puente hacia router externo
 */
export interface RoutedAppShellProps
  extends Omit<
    AppShellProps,
    "children" | "onNavigate"
  > {

  children?: React.ReactNode;


  /**
   * Ejecuta navegación externa.
   *
   * Recibe:
   *
   * href:
   *   destino definido en NavigationLinkMeta.
   *
   * node:
   *   nodo completo seleccionado.
   *
   *
   * Ejemplos:
   *
   * react-router:
   *
   * navigate={(href) => router.navigate(href)}
   *
   *
   * TanStack Router:
   *
   * navigate={(href) =>
   *   router.navigate({ to: href })
   * }
   */
  navigate?: (
    href: string,
    node: NavigationNode<NavigationLinkMeta>
  ) => void;


  /**
   * Callback adicional al seleccionar un nodo.
   *
   * No reemplaza navigate.
   *
   * Orden:
   *
   * 1. onNavigate(node)
   *
   * 2. navigate(node.meta.href)
   *
   *
   * Permite:
   *
   * - analytics
   * - permisos
   * - side effects
   * - sincronización externa
   */
  onNavigate?: (
    node: NavigationNode<NavigationLinkMeta>
  ) => void;
}


/**
 * Wrapper de navegación externa.
 *
 * RESPONSABILIDADES:
 *
 *  leer NavigationLinkMeta.href
 *
 *  notificar selección de nodo
 *
 *  delegar navegación al consumidor
 *
 *
 * NO RESPONSABILIDADES:
 *
 * resolver activeId
 *
 * mantener estado seleccionado
 *
 * conocer activePath
 *
 * conocer URLs internas del framework
 *
 * transformar routes en NavigationNode
 *
 * crear modelos alternativos como AppShellRoute
 *
 *
 * El estado activo pertenece a AppShell.
 *
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
         * El destino externo pertenece
         * exclusivamente a NavigationLinkMeta.
         *
         * Contrato válido:
         *
         * node.meta.href
         *
         *
         * Contratos eliminados:
         *
         * node.path
         * node.route
         * node.component
         * node.element
         *
         *
         * NavigationNode no representa una ruta.
         * Representa un nodo seleccionable.
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