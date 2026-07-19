// src/patterns/app-shell/UncontrolledAppShell.tsx

import React from "react";

import type {
  AppShellCommonProps,
} from "./AppShell.types";

import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../navigation";

import { AppShell } from "./AppShell";


/**
 * UncontrolledAppShell
 *
 * Responsabilidad:
 *
 * - Mantener internamente el nodo activo.
 * - Resolver selección cuando el consumidor no controla activeId.
 * - Exponer el nodo activo para que el consumidor decida qué renderizar.
 *
 * No es responsable de:
 *
 * - Renderizar componentes desde NavigationNode.meta.
 * - Interpretar meta.component.
 * - Interpretar meta.element.
 * - Conocer routers.
 * - Resolver URLs.
 *
 * La navegación y el render están separados.
 *
 * NavigationNode:
 *
 *     "qué puedo seleccionar"
 *
 * renderNode:
 *
 *     "qué muestro cuando está seleccionado"
 *
 * Esto evita acoplar la navegación a React components.
 */


export interface UncontrolledAppShellProps
  extends AppShellCommonProps {

  /**
   * Nodo inicial seleccionado.
   *
   * Si no existe:
   * se utiliza el primer nodo disponible.
   */
  defaultActiveId?: string;


  /**
   * Resolver externo del contenido activo.
   *
   * UncontrolledAppShell solamente administra:
   *
   * NavigationNode
   *        |
   *        v
   * activeId
   *
   * El consumidor decide:
   *
   * activeId
   *        |
   *        v
   * Component / Screen / View
   */
  renderNode?: (
    context: {
      node: NavigationNode<NavigationLinkMeta>;
      activeId: string | null;
    }
  ) => React.ReactNode;


  /**
   * Contenido cuando no existe nodo activo.
   */
  fallback?: React.ReactNode;
}


export function UncontrolledAppShell({
  navigation,

  defaultActiveId,

  renderNode,

  fallback,

  activeId: controlledActiveId,

  ...rest

}: UncontrolledAppShellProps) {


  /**
   * Estado inicial.
   *
   * No buscamos componentes dentro del nodo.
   *
   * Antes este componente leía:
   *
   * node.meta.component
   * node.meta.element
   *
   * Eso mezclaba navegación con rendering.
   *
   * Ahora solamente existe selección.
   */
  const firstNode =
    React.useMemo(
      () =>
        navigation[0] ?? null,
      [
        navigation,
      ]
    );


  const [
    internalActiveId,
    setInternalActiveId,
  ] =
    React.useState<string | null>(
      () =>
        defaultActiveId ??
        firstNode?.id ??
        null
    );


  /**
   * Soporta ambos modos:
   *
   * Controlado:
   *
   * activeId viene del consumidor.
   *
   *
   * No controlado:
   *
   * usamos estado interno.
   */
  const activeId =
    controlledActiveId ??
    internalActiveId;


  const activeNode =
    React.useMemo(
      () =>
        navigation.find(
          (node) =>
            node.id === activeId
        ) ?? null,
      [
        activeId,
        navigation,
      ]
    );


  /**
   * Selección interna.
   *
   * AppShell sigue siendo responsable solamente
   * de emitir selección.
   *
   * El router externo vive en RoutedAppShell.
   */
  const handleNavigate =
    React.useCallback(
      (
        node: NavigationNode<NavigationLinkMeta>
      ) => {

        if (!node.id) {
          return;
        }


        setInternalActiveId(
          node.id
        );

      },
      []
    );


  /**
   * El contenido pertenece al consumidor.
   *
   * No hacemos:
   *
   * node.meta.component
   * node.meta.element
   *
   * porque NavigationNode no es un registry
   * de pantallas.
   */
  const content =
    activeNode && renderNode
      ? renderNode({
        node: activeNode,
        activeId,
      })
      : fallback;


  return (
    <AppShell
      {...rest}

      navigation={
        navigation
      }

      activeId={
        activeId
      }

      onNavigate={
        handleNavigate
      }
    >
      {
        content ??
        fallback ??
        null
      }
    </AppShell>
  );
}


UncontrolledAppShell.displayName =
  "UncontrolledAppShell";