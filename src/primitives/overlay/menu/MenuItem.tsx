// src/primitives/overlay/menu/MenuItem.tsx

import React from "react";

import {
  usePress,
  type UIPressEvent,
} from "../../../core/interaction";

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
  DEFAULT_MENU_RECIPE_STYLES,
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
        anchorRef,
        onOpenChange,
        registerItem,
        unregisterItem,
      } = ctx;

      const restoreFocusTimerRef =
        React.useRef<number | null>(null);

      const itemRef =
        React.useRef<
          HTMLDivElement | null
        >(null);

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
            itemRef.current = node;
            setRef(ref, node);
          },
          [ref]
        );

      React.useEffect(() => {
        return () => {
          if (restoreFocusTimerRef.current !== null) {
            window.clearTimeout(
              restoreFocusTimerRef.current
            );
          }
        };
      }, []);

      React.useEffect(() => {
        const node = itemRef.current;

        if (!node) return;

        registerItem(node);

        return () => {
          unregisterItem(node);
        };
      }, [registerItem, unregisterItem]);

      const handleSelect =
        React.useCallback(
          (
            _event:
              UIPressEvent<HTMLElement>
          ) => {
            if (disabled) return;

            onSelect?.();

            if (closeOnSelect) {
              onOpenChange?.(false);

              if (
                restoreFocusTimerRef.current !== null
              ) {
                window.clearTimeout(
                  restoreFocusTimerRef.current
                );
              }

              restoreFocusTimerRef.current =
                window.setTimeout(() => {
                  restoreFocusTimerRef.current = null;
                  anchorRef.current?.focus?.();
                }, 0);
            }
          },
          [
            anchorRef,
            closeOnSelect,
            disabled,
            onOpenChange,
            onSelect,
          ]
        );

      /*
       * El foco por puntero conserva el comportamiento histórico del menú,
       * mientras usePress sigue siendo la única fuente del estado hovered.
       */
      const focusOnPointerEnter =
        React.useCallback(
          (
            event:
              React.PointerEvent<HTMLDivElement>
          ) => {
            if (!disabled) {
              event.currentTarget.focus();
            }
          },
          [disabled]
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
            DEFAULT_MENU_RECIPE_STYLES
              .item,
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
      } = preliminarySlot as SlotElementProps;

      const press =
        usePress<HTMLDivElement>({
          disabled,
          nativeInteractive: false,
          onPress: handleSelect,

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

      const itemSlot =
        resolveSlot<MenuSlot>({
          slot: "item",

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
              press.state.focused ||
              undefined,

            "data-focus-visible":
              press.state.focusVisible ||
              undefined,

            "data-disabled":
              disabled ||
              undefined,
          },

          baseStyle:
            menuRecipe({
              hovered:
                press.state.hovered,

              pressed:
                press.state.pressed,

              focusVisible:
                press.state.focusVisible,

              disabled,
            }).item,
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
