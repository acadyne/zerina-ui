// src/patterns/scaffold/scaffold.types.ts
import type React from "react";

import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../helpers/css";

import type {
  ScreenProps,
} from "../../primitives/layout";

export type ScaffoldViewport =
  | "window"
  | "contained";

export type ScaffoldSlot =
  | "root"
  | "appBar"
  | "body"
  | "content"
  | "floating"
  | "footer";

export type ScaffoldStyles =
  SlotStyleMap<ScaffoldSlot>;

export type ScaffoldSlotProps =
  SlotPropsMap<ScaffoldSlot>;

/**
 * Scaffold sólo posee la estructura de regiones.
 *
 * El scroll de contenido pertenece a ScreenContent/ScrollArea,
 * no al shell.
 *
 * Las props del Screen raíz se reciben directamente; no existe
 * un segundo canal `screenProps`.
 */
export interface ScaffoldProps
  extends Omit<
    ScreenProps,
    | "as"
    | "children"
    | "fullHeight"
  > {
  children?:
    React.ReactNode;

  /**
   * window:
   *   Ocupa viewport completo.
   *
   * contained:
   *   Ocupa el contenedor padre.
   */
  viewport?:
    ScaffoldViewport;

  /**
   * Región superior estructural.
   */
  appBar?:
    React.ReactNode;

  /**
   * Región inferior estructural.
   */
  footer?:
    React.ReactNode;

  /**
   * Elemento flotante contenido dentro del body.
   */
  floating?:
    React.ReactNode;

  styles?:
    ScaffoldStyles;

  slotProps?:
    ScaffoldSlotProps;
}
