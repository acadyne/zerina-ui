// src/primitives/overlay/menu/MenuRoot.tsx

import React from "react";

import {
  MenuContext,
} from "./menu.context";

import type {
  MenuContextValue,
} from "./menu.context";

import type {
  MenuProps,
} from "./menu.types";


export const MenuRoot: React.FC<MenuProps> = ({
  children,
  open,
  onOpenChange,
  styles,
  slotProps,
}) => {
  const reactId =
    React.useId().replace(/:/g, "");


  const anchorRef =
    React.useRef<HTMLElement | null>(null);


  const itemsRef =
    React.useRef<HTMLElement[]>([]);


  const setAnchorNode =
    React.useCallback(
      (
        node: HTMLElement | null
      ) => {
        anchorRef.current = node;
      },
      []
    );


  const getItems =
    React.useCallback(
      () =>
        itemsRef.current.filter(Boolean),
      []
    );


  const registerItem =
    React.useCallback(
      (
        node: HTMLElement | null
      ) => {
        if (!node) return;

        if (
          itemsRef.current.includes(node)
        ) {
          return;
        }

        itemsRef.current = [
          ...itemsRef.current,
          node,
        ];
      },
      []
    );


  const unregisterItem =
    React.useCallback(
      (
        node: HTMLElement | null
      ) => {
        if (!node) return;

        itemsRef.current =
          itemsRef.current.filter(
            (item) =>
              item !== node
          );
      },
      []
    );


  const focusItemAt =
    React.useCallback(
      (
        index: number
      ) => {
        const items =
          getItems();

        if (!items.length) {
          return;
        }

        const clamped =
          Math.max(
            0,
            Math.min(
              index,
              items.length - 1
            )
          );

        items[clamped]?.focus();
      },
      [getItems]
    );


  const focusFirst =
    React.useCallback(
      () => {
        focusItemAt(0);
      },
      [focusItemAt]
    );


  const focusLast =
    React.useCallback(
      () => {
        const items =
          getItems();

        if (!items.length) {
          return;
        }

        focusItemAt(
          items.length - 1
        );
      },
      [
        focusItemAt,
        getItems,
      ]
    );


  const focusNext =
    React.useCallback(
      () => {
        const items =
          getItems();

        if (!items.length) {
          return;
        }

        const active =
          document.activeElement as
            | HTMLElement
            | null;


        const index =
          items.findIndex(
            (item) =>
              item === active
          );


        const nextIndex =
          index < 0
            ? 0
            : Math.min(
                index + 1,
                items.length - 1
              );


        items[nextIndex]?.focus();
      },
      [getItems]
    );


  const focusPrev =
    React.useCallback(
      () => {
        const items =
          getItems();

        if (!items.length) {
          return;
        }


        const active =
          document.activeElement as
            | HTMLElement
            | null;


        const index =
          items.findIndex(
            (item) =>
              item === active
          );


        const prevIndex =
          index < 0
            ? items.length - 1
            : Math.max(
                index - 1,
                0
              );


        items[prevIndex]?.focus();
      },
      [getItems]
    );


  React.useEffect(
    () => {
      if (!open) {
        itemsRef.current = [];
      }
    },
    [open]
  );


  const value =
    React.useMemo<MenuContextValue>(
      () => ({
        open,

        triggerId:
          `menu-trigger-${reactId}`,

        contentId:
          `menu-content-${reactId}`,

        anchorRef,

        setAnchorNode,

        onOpenChange,

        registerItem,

        unregisterItem,

        focusFirst,

        focusLast,

        focusNext,

        focusPrev,

        styles,

        slotProps,
      }),
      [
        open,
        reactId,
        setAnchorNode,
        onOpenChange,
        registerItem,
        unregisterItem,
        focusFirst,
        focusLast,
        focusNext,
        focusPrev,
        styles,
        slotProps,
      ]
    );


  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

MenuRoot.displayName =
  "MenuRoot";