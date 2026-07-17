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
        React.useRef<number | null>(
          null
        );


      const itemRef =
        React.useRef<HTMLDivElement | null>(
          null
        );


      const [
        itemIndex,
        setItemIndex,
      ] =
        React.useState(-1);


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

            setRef(
              ref,
              node
            );
          },
          [ref]
        );


      React.useEffect(() => {
        return () => {
          if (
            restoreFocusTimerRef.current !== null
          ) {
            window.clearTimeout(
              restoreFocusTimerRef.current
            );
          }
        };
      }, []);


      React.useEffect(() => {
        const node =
          itemRef.current;

        if (!node) {
          return;
        }


        const index =
          registerItem(node);


        setItemIndex(index);

        return () => {
          unregisterItem(node);
        };
      }, [
        registerItem,
        unregisterItem,
      ]);


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


      const isFocused =
        ctx.focusedIndex === itemIndex;

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
              isFocused ||
              undefined,

            "data-focus-visible":
              isFocused ||
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
                isFocused,

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