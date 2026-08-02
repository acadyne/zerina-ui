// src/primitives/overlay/menu/MenuRoot.tsx

import React from "react";

import {
  getDeepActiveElement,
  getNodeEventRoot,
  isComposedDescendantOf,
} from "../../../core/dom";

import {
  attemptFocus,
} from "../../../core/interaction/focus/attemptFocus";

import {
  MenuContext,
} from "./menu.context";

import type {
  MenuCollectionEntry,
  MenuCollectionScope,
  MenuContextValue,
  MenuItemToken,
} from "./menu.context";

import type {
  MenuProps,
} from "./menu.types";

import {
  compareComposedNodeOrder,
} from "./menu.utils";


/*
 * Typeahead compara texto semántico, no contenido visual sin procesar.
 *
 * NFKC conserva una representación estable para formas Unicode equivalentes;
 * el colapso de espacios evita que detalles de layout alteren la búsqueda.
 */
function normalizeMenuTextValue(
  value: string
): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(
      /\s+/gu,
      " "
    )
    .toLocaleLowerCase();
}


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
    React.useRef<HTMLElement | null>(
      null
    );


  /*
   * Map conserva identidad y metadatos, nunca posición.
   *
   * Mantener las entradas durante exit permite que la misma instancia vuelva a
   * reclamar su scope si el menú reabre antes de desmontarse. La pertenencia se
   * invalida mediante collectionScope, no destruyendo prematuramente el registro.
   */
  const itemsRef =
    React.useRef<
      Map<
        MenuItemToken,
        MenuCollectionEntry
      >
    >(
      new Map()
    );


  const currentCollectionScopeRef =
    React.useRef<
      MenuCollectionScope | null
    >(
      null
    );


  const focusedItemTokenRef =
    React.useRef<
      MenuItemToken | null
    >(
      null
    );


  const [
    hasFocusedItem,
    setHasFocusedItem,
  ] =
    React.useState(false);


  const setAnchorNode =
    React.useCallback(
      (
        node: HTMLElement | null
      ) => {
        anchorRef.current =
          node;
      },
      []
    );


  const registerItem =
    React.useCallback(
      (
        entry:
          MenuCollectionEntry
      ): void => {
        const previous =
          itemsRef.current.get(
            entry.token
          );

        itemsRef.current.set(
          entry.token,
          entry
        );

        /*
         * Una entrada interactiva reclama el scope vigente. Un overlay anterior
         * retenido para exit puede continuar registrado con otro scope, pero ya no
         * participa en ninguna operación de esta colección.
         */
        if (
          entry.collectionScope
        ) {
          if (
            currentCollectionScopeRef
              .current !==
            entry.collectionScope
          ) {
            currentCollectionScopeRef
              .current =
              entry.collectionScope;

            focusedItemTokenRef
              .current =
              null;

            setHasFocusedItem(
              false
            );
          }

          return;
        }

        const previousScope =
          previous
            ?.collectionScope;

        if (
          !previousScope ||
          currentCollectionScopeRef
            .current !==
            previousScope
        ) {
          return;
        }

        const scopeStillOwned =
          Array.from(
            itemsRef.current.values()
          ).some(
            (candidate) =>
              candidate
                .collectionScope ===
                previousScope &&
              candidate.node
                .isConnected
          );

        if (!scopeStillOwned) {
          currentCollectionScopeRef
            .current =
            null;

          focusedItemTokenRef
            .current =
            null;

          setHasFocusedItem(
            false
          );
        }
      },
      []
    );


  const unregisterItem =
    React.useCallback(
      (
        token:
          MenuItemToken
      ): void => {
        const previous =
          itemsRef.current.get(
            token
          );

        itemsRef.current.delete(
          token
        );

        if (
          focusedItemTokenRef
            .current ===
          token
        ) {
          focusedItemTokenRef
            .current =
            null;

          setHasFocusedItem(
            false
          );
        }

        const previousScope =
          previous
            ?.collectionScope;

        if (
          !previousScope ||
          currentCollectionScopeRef
            .current !==
            previousScope
        ) {
          return;
        }

        const scopeStillOwned =
          Array.from(
            itemsRef.current.values()
          ).some(
            (candidate) =>
              candidate
                .collectionScope ===
                previousScope &&
              candidate.node
                .isConnected
          );

        if (!scopeStillOwned) {
          currentCollectionScopeRef
            .current =
            null;

          focusedItemTokenRef
            .current =
            null;

          setHasFocusedItem(
            false
          );
        }
      },
      []
    );


  const getItems =
    React.useCallback(
      (
        requestedScope:
          MenuCollectionScope | null =
            currentCollectionScopeRef
              .current
      ): MenuCollectionEntry[] => {
        if (!requestedScope) {
          return [];
        }

        const items:
          MenuCollectionEntry[] =
          [];

        for (
          const [
            token,
            entry,
          ]
          of itemsRef.current
        ) {
          if (
            !entry.node
              .isConnected
          ) {
            itemsRef.current.delete(
              token
            );

            continue;
          }

          if (
            entry.collectionScope ===
            requestedScope
          ) {
            items.push(
              entry
            );
          }
        }

        /*
         * El orden se consulta sobre el árbol compuesto actual. No se conserva el
         * orden de montaje, de registro ni el índice de un render anterior.
         */
        items.sort(
          (
            left,
            right
          ) =>
            compareComposedNodeOrder(
              left.node,
              right.node
            )
        );

        return items;
      },
      []
    );


  const getEnabledItems =
    React.useCallback(
      (): MenuCollectionEntry[] =>
        getItems().filter(
          (entry) =>
            !entry.disabled
        ),
      [
        getItems,
      ]
    );


  const focusEntry =
    React.useCallback(
      (
        entry:
          MenuCollectionEntry
      ): boolean => {
        if (
          entry.disabled ||
          !entry.node.isConnected
        ) {
          return false;
        }

        if (
          !attemptFocus(
            entry.node,
            {
              preventScroll: true,
            }
          )
        ) {
          return false;
        }

        focusedItemTokenRef
          .current =
          entry.token;

        setHasFocusedItem(
          true
        );

        /*
         * preventScroll evita un salto global durante focus(). Después se revela
         * únicamente el item activo dentro del viewport o scroller más cercano.
         */
        if (
          typeof entry.node
            .scrollIntoView ===
            "function"
        ) {
          entry.node.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          });
        }

        return true;
      },
      []
    );


  const focusItem =
    React.useCallback(
      (
        token:
          MenuItemToken
      ): void => {
        const currentScope =
          currentCollectionScopeRef
            .current;

        const entry =
          itemsRef.current.get(
            token
          );

        if (
          !currentScope ||
          !entry ||
          entry.collectionScope !==
            currentScope
        ) {
          return;
        }

        focusEntry(
          entry
        );
      },
      [
        focusEntry,
      ]
    );


  const focusItemAt =
    React.useCallback(
      (
        index: number
      ): void => {
        const items =
          getEnabledItems();

        if (!items.length) {
          return;
        }

        /*
         * El índice se interpreta ahora, sobre la colección habilitada vigente.
         * Nunca se guarda como identidad del item.
         */
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

        if (target) {
          focusEntry(
            target
          );
        }
      },
      [
        focusEntry,
        getEnabledItems,
      ]
    );


  const focusFirst =
    React.useCallback(
      (): void => {
        focusItemAt(0);
      },
      [
        focusItemAt,
      ]
    );


  const focusLast =
    React.useCallback(
      (): void => {
        const items =
          getEnabledItems();

        const target =
          items[
            items.length - 1
          ];

        if (target) {
          focusEntry(
            target
          );
        }
      },
      [
        focusEntry,
        getEnabledItems,
      ]
    );


  const getCurrentItemIndex =
    React.useCallback(
      (
        items:
          MenuCollectionEntry[]
      ): number => {
        const first =
          items[0];

        if (!first) {
          return -1;
        }

        const active =
          getDeepActiveElement(
            getNodeEventRoot(
              first.node
            )
          );

        if (active) {
          const activeIndex =
            items.findIndex(
              (entry) =>
                active ===
                  entry.node ||
                isComposedDescendantOf(
                  active,
                  entry.node
                )
            );

          if (
            activeIndex >= 0
          ) {
            return activeIndex;
          }
        }

        const focusedToken =
          focusedItemTokenRef
            .current;

        return focusedToken
          ? items.findIndex(
              (entry) =>
                entry.token ===
                focusedToken
            )
          : -1;
      },
      []
    );


  const focusByTextValue =
    React.useCallback(
      (
        searchValue: string
      ): boolean => {
        const normalizedSearch =
          normalizeMenuTextValue(
            searchValue
          );

        if (!normalizedSearch) {
          return false;
        }

        /*
         * getEnabledItems excluye disabled y vuelve a derivar el orden compuesto.
         * Typeahead no conserva una segunda posición paralela a la colección.
         */
        const items =
          getEnabledItems();

        if (!items.length) {
          return false;
        }

        const currentIndex =
          getCurrentItemIndex(
            items
          );

        /*
         * La búsqueda comienza después del item vigente y recorre una vuelta
         * completa. Una tecla repetida avanza entre coincidencias.
         */
        for (
          let offset = 1;
          offset <= items.length;
          offset += 1
        ) {
          const candidateIndex =
            (
              Math.max(
                currentIndex,
                -1
              ) +
              offset
            ) %
            items.length;

          const candidate =
            items[
              candidateIndex
            ];

          if (
            !candidate ||
            !normalizeMenuTextValue(
              candidate.textValue
            ).startsWith(
              normalizedSearch
            )
          ) {
            continue;
          }

          return focusEntry(
            candidate
          );
        }

        return false;
      },
      [
        focusEntry,
        getCurrentItemIndex,
        getEnabledItems,
      ]
    );


  const focusNext =
    React.useCallback(
      (): void => {
        const items =
          getEnabledItems();

        if (!items.length) {
          return;
        }

        const currentIndex =
          getCurrentItemIndex(
            items
          );

        const nextIndex =
          currentIndex >=
            items.length - 1
            ? 0
            : currentIndex + 1;

        const target =
          items[nextIndex];

        if (target) {
          focusEntry(
            target
          );
        }
      },
      [
        focusEntry,
        getCurrentItemIndex,
        getEnabledItems,
      ]
    );


  const focusPrev =
    React.useCallback(
      (): void => {
        const items =
          getEnabledItems();

        if (!items.length) {
          return;
        }

        const currentIndex =
          getCurrentItemIndex(
            items
          );

        const prevIndex =
          currentIndex <= 0
            ? items.length - 1
            : currentIndex - 1;

        const target =
          items[prevIndex];

        if (target) {
          focusEntry(
            target
          );
        }
      },
      [
        focusEntry,
        getCurrentItemIndex,
        getEnabledItems,
      ]
    );


  React.useEffect(
    () => {
      if (open) {
        return;
      }

      /*
       * open=false implica enabled=false en DismissableLayer y, por tanto,
       * interactive=false. El scope lógico se invalida sin destruir entradas que
       * todavía permanecen montadas durante la animación de salida.
       */
      currentCollectionScopeRef
        .current =
        null;

      focusedItemTokenRef
        .current =
        null;

      setHasFocusedItem(
        false
      );
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

        focusItem,


        hasFocusedItem,

        setHasFocusedItem,

        initialFocusIndex,

        focusItemAt,

        focusFirst,

        focusLast,

        focusNext,

        focusPrev,

        focusByTextValue,


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
        focusItem,

        hasFocusedItem,
        initialFocusIndex,
        focusItemAt,
        focusFirst,
        focusLast,
        focusNext,
        focusPrev,
        focusByTextValue,

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
