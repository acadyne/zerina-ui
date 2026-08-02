// src/primitives/overlay/menu/MenuItem.tsx

import React from "react";

import {
  usePress,
  type UIPressEvent,
} from "../../../core/interaction";

import {
  useOverlayInstanceContext,
} from "../../../core/overlay";

import {
  composeEventHandlers,
} from "../../../core/interaction/events/composeEventHandlers";

import {
  setRef,
} from "../../../core/interaction/events";

import {
  resolveSlot,
  type SlotElementProps,
} from "../../../helpers/css";

import {
  useMenuContext,
} from "./menu.context";

import {
  menuRecipe,
} from "./menu.recipe";

import type {
  MenuItemProps,
  MenuSlot,
} from "./menu.types";


export const MenuItem =
  React.forwardRef<
    HTMLDivElement,
    MenuItemProps
  >(
    (
      {
        children,
        disabled = false,
        textValue,
        closeOnSelect = true,
        onSelect,

        className = "",
        style,

        styles,
        slotProps,

        onPointerEnter,
        onPointerLeave,
        onPointerDown,
        onPointerUp,
        onPointerCancel,
        onLostPointerCapture,

        onFocus,
        onBlur,

        onKeyDown,
        onKeyUp,

        ...rest
      },
      ref
    ) => {
      const ctx =
        useMenuContext();


      const {
        focusItem,
        onOpenChange,
        registerItem,
        unregisterItem,
      } = ctx;


      const overlay =
        useOverlayInstanceContext();


      const itemRef =
        React.useRef<HTMLDivElement | null>(
          null
        );


      /*
       * El token identifica esta entrada aunque cambie su posición, contenido o
       * nodo. No representa un índice ni una generación temporal.
       */
      const [itemToken] =
        React.useState<symbol>(
          () =>
            Symbol(
              "menu-item"
            )
        );


      /*
       * DismissableLayer es la única fuente de vigencia interactiva. Durante exit
       * el nodo puede continuar montado, pero collectionScope pasa a null.
       */
      const collectionScope =
        overlay.interactive
          ? overlay.token
          : null;


      /*
       * El callback ref permanece estable frente a cambios de metadatos. El efecto
       * inferior propaga disabled, textValue y scope sin desmontar artificialmente
       * la asociación token-nodo.
       */
      const registrationRef =
        React.useRef({
          disabled,
          textValue,
          collectionScope,
        });


      registrationRef.current = {
        disabled,
        textValue,
        collectionScope,
      };


      const resolvedStyles =
        styles ?? ctx.styles;


      const resolvedSlotProps =
        slotProps ?? ctx.slotProps;


      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLDivElement
              | null
          ) => {
            itemRef.current =
              node;

            if (node) {
              const metadata =
                registrationRef
                  .current;

              registerItem({
                token:
                  itemToken,

                node,

                disabled:
                  metadata.disabled,

                textValue:
                  metadata.textValue ??
                  node.textContent ??
                  "",

                collectionScope:
                  metadata.collectionScope,
              });
            } else {
              unregisterItem(
                itemToken
              );
            }

            setRef(
              ref,
              node
            );
          },
          [
            itemToken,
            ref,
            registerItem,
            unregisterItem,
          ]
        );


      React.useEffect(
        () => {
          const node =
            itemRef.current;

          if (!node) {
            return;
          }

          /*
           * registerItem es un upsert. Mantiene la identidad y actualiza solo los
           * metadatos que pueden cambiar después del montaje.
           */
          registerItem({
            token:
              itemToken,

            node,

            disabled,

            textValue:
              textValue ??
              node.textContent ??
              "",

            collectionScope,
          });
        },
        [
          children,
          collectionScope,
          disabled,
          itemToken,
          registerItem,
          textValue,
        ]
      );


      const handleSelect =
        React.useCallback(
          (
            _event:
              UIPressEvent<HTMLElement>
          ) => {
            if (disabled) {
              return;
            }


            onSelect?.();


            if (closeOnSelect) {
              onOpenChange?.(false);
            }
          },
          [
            closeOnSelect,
            disabled,
            onOpenChange,
            onSelect,
          ]
        );


      const focusOnPointerEnter =
        React.useCallback(
          (
            _event:
              React.PointerEvent<HTMLDivElement>
          ) => {
            if (!disabled) {
              focusItem(
                itemToken
              );
            }
          },
          [
            disabled,
            focusItem,
            itemToken,
          ]
        );


      const preliminarySlot =
        resolveSlot<MenuSlot>({
          slot: "item",

          styles:
            resolvedStyles,

          slotProps:
            resolvedSlotProps,

          className,

          style,

          baseProps: {
            role: "menuitem",

            tabIndex: -1,

            "aria-disabled":
              disabled ||
              undefined,

            "data-ui-menu-item":
              "",
          },

          baseStyle:
            undefined,
        });


      const {
        onPointerEnter:
        slotOnPointerEnter,

        onPointerLeave:
        slotOnPointerLeave,

        onPointerDown:
        slotOnPointerDown,

        onPointerUp:
        slotOnPointerUp,

        onPointerCancel:
        slotOnPointerCancel,

        onLostPointerCapture:
        slotOnLostPointerCapture,

        onFocus:
        slotOnFocus,

        onBlur:
        slotOnBlur,

        onKeyDown:
        slotOnKeyDown,

        onKeyUp:
        slotOnKeyUp,

        onClick:
        slotOnClick,

        ...preliminarySlotRest
      } =
        preliminarySlot as SlotElementProps;


      const press =
        usePress<HTMLDivElement>({
          disabled,

          nativeInteractive: false,

          onPress:
            handleSelect,


          onPointerEnter:
            composeEventHandlers(
              composeEventHandlers(
                onPointerEnter,
                slotOnPointerEnter
              ),
              focusOnPointerEnter,
              {
                checkDefaultPrevented:
                  false,
              }
            ),


          onPointerLeave:
            composeEventHandlers(
              onPointerLeave,
              slotOnPointerLeave,
              {
                checkDefaultPrevented:
                  false,
              }
            ),


          onPointerDown:
            composeEventHandlers(
              onPointerDown,
              slotOnPointerDown
            ),


          onPointerUp:
            composeEventHandlers(
              onPointerUp,
              slotOnPointerUp,
              {
                checkDefaultPrevented:
                  false,
              }
            ),


          onPointerCancel:
            composeEventHandlers(
              onPointerCancel,
              slotOnPointerCancel,
              {
                checkDefaultPrevented:
                  false,
              }
            ),


          onLostPointerCapture:
            composeEventHandlers(
              onLostPointerCapture,
              slotOnLostPointerCapture,
              {
                checkDefaultPrevented:
                  false,
              }
            ),


          onFocus:
            composeEventHandlers(
              onFocus,
              slotOnFocus
            ),


          onBlur:
            composeEventHandlers(
              onBlur,
              slotOnBlur,
              {
                checkDefaultPrevented:
                  false,
              }
            ),


          onKeyDown:
            composeEventHandlers(
              onKeyDown,
              slotOnKeyDown
            ),


          onKeyUp:
            composeEventHandlers(
              onKeyUp,
              slotOnKeyUp
            ),


          onClick:
            slotOnClick,
        });


      /*
       * El estado visual procede del foco DOM real observado por usePress. Ya no
       * existe un índice persistente paralelo que pueda quedar desalineado.
       */
      const focused =
        press.state.focused;


      const focusVisible =
        press.state.focusVisible;

      const itemSlot =
        resolveSlot<MenuSlot>({
          slot: "item",

          styles:
            resolvedStyles,

          slotProps:
            resolvedSlotProps,

          className:
            preliminarySlotRest.className,

          style:
            preliminarySlotRest.style,

          baseProps: {
            role:
              preliminarySlotRest.role,

            tabIndex:
              preliminarySlotRest.tabIndex,

            "aria-disabled":
              preliminarySlotRest[
              "aria-disabled"
              ],

            "data-ui-menu-item":
              "",

            "data-hovered":
              press.state.hovered ||
              undefined,

            "data-pressed":
              press.state.pressed ||
              undefined,

            "data-focused":
              focused
                ? ""
                : undefined,

            "data-focus-visible":
              focusVisible
                ? ""
                : undefined,

            "data-disabled":
              disabled ||
              undefined,
          },

          baseStyle:
            menuRecipe({}).item,
        });


      return (
        <div
          {...rest}
          {...itemSlot}
          {...press.pressProps}
          ref={setRefs}
        >
          {children}
        </div>
      );
    }
  );


MenuItem.displayName =
  "MenuItem";
