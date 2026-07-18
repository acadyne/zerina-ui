import React from "react";

export type NavigationNodeId = string;

export interface NavigationNode {
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

  children?: NavigationNode[];

  meta?: Record<string, unknown>;
}