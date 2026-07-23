// src/patterns/navigation/navigation.types.ts
import React from "react";

export type NavigationNodeId = string;

export interface NavigationLinkMeta {
  href?: string;
}

export interface NavigationNode<
  TMeta = unknown
> {
  id: NavigationNodeId;

  label: React.ReactNode;

  /**
   * Nombre accesible estable para contextos
   * donde el label visual puede ocultarse,
   * como navegación colapsada.
   */
  ariaLabel?: string;

  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;

  /**
   * Si tiene hijos, por defecto funciona como grupo.
   * selectable=true permite seleccionar también el nodo padre.
   */
  selectable?: boolean;

  children?: NavigationNode<TMeta>[];

  meta?: TMeta;
}

export interface NavigationContentMeta {
  element?: React.ReactNode;

  component?: React.ComponentType<
    Record<never, never>
  >;
}