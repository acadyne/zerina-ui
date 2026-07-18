// src/patterns/scaffold/scaffold.types.ts

import type React from "react";

import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../helpers/css";

import type {
  ScreenProps,
  ScrollAreaProps,
} from "../../primitives/layout";


export type ScaffoldViewport =
  | "window"
  | "contained";


export type ScaffoldSlot =
  | "root"
  | "appBar"
  | "body"
  | "scroll"
  | "content"
  | "floating"
  | "footer";


export type ScaffoldStyles =
  SlotStyleMap<ScaffoldSlot>;


export type ScaffoldSlotProps =
  SlotPropsMap<ScaffoldSlot>;


export interface ScaffoldProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | "children"
    | "title"
  > {
    
  children?: React.ReactNode;


  /**
   * window:
   *   Ocupa viewport completo.
   *
   * contained:
   *   Ocupa el contenedor padre.
   */
  viewport?: ScaffoldViewport;


  /**
   * Región superior de pantalla.
   *
   * Normalmente:
   * TopAppBar
   */
  appBar?: React.ReactNode;


  /**
   * Región inferior.
   *
   * Puede ser:
   * BottomNavigation
   * ActionBar
   * Toolbar
   */
  footer?: React.ReactNode;


  /**
   * Elemento flotante sobre el contenido.
   *
   * Ej:
   * FAB
   * Quick actions
   */
  floating?: React.ReactNode;


  /**
   * Habilita scroll administrado por Scaffold.
   */
  scrollable?: boolean;


  /**
   * Configuración avanzada del scroll.
   */
  scrollProps?: Omit<
    ScrollAreaProps,
    "children"
  >;


  /**
   * Configuración avanzada del Screen interno.
   */
  screenProps?: Omit<
    ScreenProps,
    "children"
  >;


  className?: string;

  style?: React.CSSProperties;


  styles?: ScaffoldStyles;

  slotProps?: ScaffoldSlotProps;
}