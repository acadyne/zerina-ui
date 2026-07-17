// src/primitives/overlay/menu/menu.context.ts

import React from "react";

import type {
  MenuSlotProps,
  MenuStyles,
} from "./menu.types";


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


  registerItem:
    (node: HTMLElement | null) => void;

  unregisterItem:
    (node: HTMLElement | null) => void;


  focusFirst:
    () => void;

  focusLast:
    () => void;

  focusNext:
    () => void;

  focusPrev:
    () => void;


  styles?: MenuStyles;

  slotProps?: MenuSlotProps;
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