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
  resolveLayeredSlot,
} from "../../../helpers/css";

import {
  useMenuContext,
} from "./menu.context";

import {
  menuRecipe,
} from "./menu.recipe";

import {
  composeMenuExternalHandlers,
} from "./menu.utils";

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

      const overlay =
        useOverlayInstanceContext();

      const {
        focusItem,
        onOpenChange,
        registerItem,
        unregisterItem,
      } = ctx;


      const itemRef =
        React.useRef<HTMLDivElement | null>(
          null
        );


      /*
       * El token identifica esta entrada aunque React cambie su posición.
       * Nunca representa un índice ni una generación temporal.
       */
      const [itemToken] =
        React.useState<symbol>(
          () =>
            Symbol(
              "menu-item"
            )
        );


      /*
       * DismissableLayer es la única fuente de vigencia interactiva.
       *
       * Durante exit el nodo sigue montado para animar, pero scope=null lo retira
       * inmediatamente de navegación, foco inicial y typeahead.
       */
      const collectionScope =
        overlay.interactive
          ? overlay.token
          : null;


      /*
       * El callback ref posee la asociación token-nodo. Los metadatos variables
       * se leen desde esta ref para no reconstruirlo cuando cambian disabled,
       * textValue o la presencia interactiva.
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
           * registerItem es un upsert por token. Propaga metadatos sin desmontar
           * ni convertir la posición actual en identidad.
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
              onOpenChange?.(
                false
              );
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


      const contextItemProps =
        ctx.slotProps
          ?.item as
          | React.HTMLAttributes<HTMLDivElement>
          | undefined;

      const localItemProps =
        slotProps
          ?.item as
          | React.HTMLAttributes<HTMLDivElement>
          | undefined;


      /*
       * Orden de capas externas:
       *
       * 1. prop pública;
       * 2. slot local;
       * 3. slot de contexto.
       *
       * Todas se ejecutan una vez. Después, defaultPrevented decide si Menu puede
       * adoptar la conducta interna.
       */
      const externalPointerEnter =
        composeMenuExternalHandlers(
          onPointerEnter,
          localItemProps
            ?.onPointerEnter,
          contextItemProps
            ?.onPointerEnter
        );


      const press =
        usePress<HTMLDivElement>({
          disabled,

          nativeInteractive:
            false,

          onPress:
            handleSelect,

          /*
           * Enfocar por hover es conducta semántica cancelable. No comparte la
           * excepción de los cleanups técnicos de pointer.
           */
          onPointerEnter:
            composeEventHandlers(
              externalPointerEnter,
              focusOnPointerEnter
            ),

          onPointerLeave:
            composeMenuExternalHandlers(
              onPointerLeave,
              localItemProps
                ?.onPointerLeave,
              contextItemProps
                ?.onPointerLeave
            ),

          onPointerDown:
            composeMenuExternalHandlers(
              onPointerDown,
              localItemProps
                ?.onPointerDown,
              contextItemProps
                ?.onPointerDown
            ),

          onPointerUp:
            composeMenuExternalHandlers(
              onPointerUp,
              localItemProps
                ?.onPointerUp,
              contextItemProps
                ?.onPointerUp
            ),

          onPointerCancel:
            composeMenuExternalHandlers(
              onPointerCancel,
              localItemProps
                ?.onPointerCancel,
              contextItemProps
                ?.onPointerCancel
            ),

          onLostPointerCapture:
            composeMenuExternalHandlers(
              onLostPointerCapture,
              localItemProps
                ?.onLostPointerCapture,
              contextItemProps
                ?.onLostPointerCapture
            ),

          onFocus:
            composeMenuExternalHandlers(
              onFocus,
              localItemProps
                ?.onFocus,
              contextItemProps
                ?.onFocus
            ),

          onBlur:
            composeMenuExternalHandlers(
              onBlur,
              localItemProps
                ?.onBlur,
              contextItemProps
                ?.onBlur
            ),

          onKeyDown:
            composeMenuExternalHandlers(
              onKeyDown,
              localItemProps
                ?.onKeyDown,
              contextItemProps
                ?.onKeyDown
            ),

          onKeyUp:
            composeMenuExternalHandlers(
              onKeyUp,
              localItemProps
                ?.onKeyUp,
              contextItemProps
                ?.onKeyUp
            ),

          onClick:
            composeMenuExternalHandlers(
              localItemProps
                ?.onClick,
              contextItemProps
                ?.onClick
            ),
        });


      const focused =
        press.state.focused;

      const focusVisible =
        press.state.focusVisible;


      /*
       * El slot se resuelve una sola vez. Receta, estado, contexto y override
       * local convergen aquí.
       *
       * Los handlers finales de usePress se aplican después para que las props de
       * slot ya consumidas no se ejecuten una segunda vez.
       */
      const itemSlot =
        resolveLayeredSlot<MenuSlot>({
          slots: [
            "item",
          ],

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,

          slotProps,

          className,

          style,

          baseProps: {
            role:
              "menuitem",

            tabIndex:
              -1,

            "aria-disabled":
              disabled ||
              undefined,

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
