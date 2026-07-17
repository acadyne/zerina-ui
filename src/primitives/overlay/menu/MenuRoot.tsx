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
  initialFocusIndex = 0,
  styles,
  slotProps,
}) => {
  const reactId =
    React.useId().replace(/:/g, "");


  const anchorRef =
    React.useRef<HTMLElement | null>(null);


  const itemsRef =
    React.useRef<HTMLElement[]>([]);


  const [
    focusedIndex,
    setFocusedIndex,
  ] = React.useState(0);

  const [
    hasFocusedItem,
    setHasFocusedItem,
  ] = React.useState(false);

  const focusedIndexRef =
    React.useRef(0);

  const initialFocusAppliedRef =
    React.useRef(false);

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
        itemsRef.current.filter(
          (item) =>
            item.isConnected
        ),
      []
    );


  const registerItem =
    React.useCallback(
      (
        node: HTMLElement | null
      ): number => {
        if (!node) {
          return -1;
        }


        const existingIndex =
          itemsRef.current.findIndex(
            (item) =>
              item === node
          );


        if (existingIndex >= 0) {
          return existingIndex;
        }


        itemsRef.current =
          itemsRef.current.filter(
            (item) =>
              item.isConnected
          );


        itemsRef.current.push(node);


        return (
          itemsRef.current.length - 1
        );
      },
      []
    );


  const unregisterItem =
    React.useCallback(
      (
        node: HTMLElement | null
      ) => {
        if (!node) {
          return;
        }

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


        const target =
          items[clamped];


        if (!target) {
          return;
        }

        focusedIndexRef.current =
          clamped;

        setFocusedIndex(
          clamped
        );

        setHasFocusedItem(
          true
        );

        target.focus({
          preventScroll: true,
        });

        requestAnimationFrame(() => {
          setFocusedIndex(clamped);
        });
      },
      [
        getItems,
      ]
    );


  const focusFirst =
    React.useCallback(
      () => {
        focusItemAt(0);
      },
      [
        focusItemAt,
      ]
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


        const currentIndex =
          items.findIndex(
            (item) =>
              item === active
          );


        const baseIndex =
          currentIndex >= 0
            ? currentIndex
            : focusedIndexRef.current;


        const nextIndex =
          baseIndex >= items.length - 1
            ? 0
            : baseIndex + 1;


        focusItemAt(nextIndex);
      },
      [
        focusedIndex,
        focusItemAt,
        getItems,
      ]
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


        const currentIndex =
          items.findIndex(
            (item) =>
              item === active
          );

        const baseIndex =
          currentIndex >= 0
            ? currentIndex
            : focusedIndexRef.current;


        const prevIndex =
          baseIndex <= 0
            ? items.length - 1
            : baseIndex - 1;


        focusItemAt(prevIndex);
      },
      [
        focusItemAt,
        getItems,
      ]
    );


  React.useEffect(
    () => {
      if (!open) {
        itemsRef.current = [];

        setFocusedIndex(0);

        focusedIndexRef.current = 0;

        setHasFocusedItem(false);

        initialFocusAppliedRef.current = false;
      }
    },
    [
      open,
    ]
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


        focusedIndex,

        setFocusedIndex,

        hasFocusedItem,

        setHasFocusedItem,

        initialFocusIndex,

        focusItemAt,

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

        focusedIndex,
        setFocusedIndex,

        hasFocusedItem,
        setHasFocusedItem,

        focusFirst,
        focusLast,
        focusNext,
        focusPrev,

        styles,
        slotProps,
      ]
    );


  return (
    <MenuContext.Provider
      value={value}
    >
      {children}
    </MenuContext.Provider>
  );
};


MenuRoot.displayName =
  "MenuRoot";