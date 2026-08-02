// src/primitives/overlay/menu/menu.context.ts

import React from "react";

import type {
  MenuSlotProps,
  MenuStyles,
} from "./menu.types";


/*
 * El token identifica una entrada estable de la colección.
 *
 * Nunca debe sustituirse por una posición: el índice cambia cuando React
 * reordena, inserta o elimina elementos con keys estables.
 */
export type MenuItemToken =
  symbol;


/*
 * El scope representa la instancia interactiva vigente del menú.
 *
 * Se deriva del token de DismissableLayer, pero pertenece a un dominio distinto
 * del token de cada item. Una instancia retenida únicamente para exit conserva
 * sus nodos montados, pero sus entradas usan collectionScope=null y dejan de
 * participar inmediatamente en navegación.
 */
export type MenuCollectionScope =
  symbol;


export type MenuInitialFocusTarget =
  | "configured"
  | "first"
  | "last";


/*
 * Esta es la unidad completa de registro.
 *
 * El registro conserva identidad y metadatos; el orden nunca se almacena aquí.
 * Cada operación de navegación vuelve a derivarlo del árbol compuesto vigente.
 */
export interface MenuCollectionEntry {
  token: MenuItemToken;

  node: HTMLElement;

  disabled: boolean;

  textValue: string;

  collectionScope:
    | MenuCollectionScope
    | null;
}


export interface MenuContextValue {
  open: boolean;

  triggerId: string;

  contentId: string;

  anchorRef:
    React.RefObject<HTMLElement | null>;

  setAnchorNode:
    (node: HTMLElement | null) => void;

  onOpenChange?:
    (open: boolean) => void;

  /*
   * Recibe intención, no ejecuta una transición temporal desde el trigger.
   *
   * MenuRoot decide si puede aplicarla inmediatamente o si MenuContent debe
   * consumirla después de confirmar el montaje abierto.
   */
  requestOpen:
    (
      initialFocus:
        MenuInitialFocusTarget
    ) => void;

  focusInitial:
    () => void;


  /*
   * registerItem es un upsert por token. El mismo método registra el nodo y
   * propaga cambios posteriores de disabled, textValue o collectionScope.
   */
  registerItem:
    (entry: MenuCollectionEntry) => void;

  unregisterItem:
    (token: MenuItemToken) => void;


  /*
   * El foco imperativo recibe identidad, no posición persistente. El índice solo
   * existe como una consulta temporal sobre la colección ordenada vigente.
   */
  focusItem:
    (token: MenuItemToken) => void;

  hasFocusedItem:
    boolean;

  setHasFocusedItem:
    (value: boolean) => void;

  focusFirst:
    () => void;

  focusLast:
    () => void;

  focusNext:
    () => void;

  focusPrev:
    () => void;

  /*
   * Ejecuta typeahead sobre la colección habilitada y ordenada vigente.
   * Devuelve true únicamente cuando encontró y enfocó una coincidencia.
   */
  focusByTextValue:
    (searchValue: string) => boolean;


  styles?: MenuStyles;

  slotProps?: MenuSlotProps;

  /*
   * La API pública sigue expresando una posición inicial. Se interpreta contra
   * la colección habilitada y ordenada en el momento de aplicar el foco.
   */
  initialFocusIndex: number;

  focusItemAt:
    (index: number) => void;
}


export const MenuContext =
  React.createContext<MenuContextValue | null>(
    null
  );


export function useMenuContext() {
  const ctx =
    React.useContext(MenuContext);


  if (!ctx) {
    throw new Error(
      "Menu subcomponents must be used inside <Menu />"
    );
  }


  return ctx;
}


export function useOptionalMenuContext() {
  return React.useContext(
    MenuContext
  );
}
