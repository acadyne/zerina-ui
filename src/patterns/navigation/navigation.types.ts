// src/patterns/navigation/navigation.types.ts
import React from "react";

export type NavigationNodeId = string;

export interface NavigationNode<
  TMeta = Record<string, unknown>
> {
  id: NavigationNodeId;

  label: React.ReactNode;

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