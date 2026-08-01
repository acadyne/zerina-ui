import React from "react";

import {
  resolveSlot,
} from "../../../helpers/css";

import {
  setRef,
} from "../../../core/interaction/events";

import {
  composeEventHandlers,
} from "../../../core/interaction/events/composeEventHandlers";

import {
  clearOwnedWindowTimeout,
  setOwnedWindowTimeout,
  type OwnedWindowTimeout,
} from "../../../core/dom";

import {
  mergeTriggerProps,
} from "../triggerProps";

import {
  useMenuContext,
} from "./menu.context";

import type {
  MenuSlot,
  MenuTriggerProps,
  TriggerChildProps,
} from "./menu.types";


export const MenuTrigger =
  React.forwardRef<
    HTMLElement,
    MenuTriggerProps
  >(
    (
      {
        children,
        asChild = true,
        className = "",
        style,
        styles,
        slotProps,
      },
      ref
    ) => {
      const ctx =
        useMenuContext();

      const focusTimerRef =
        React.useRef<
          OwnedWindowTimeout | null
        >(null);

      const {
        anchorRef,
        focusFirst,
        focusLast,
        onOpenChange,
      } = ctx;

      const triggerSlot =
        resolveSlot<MenuSlot>({
          slot: "trigger",

          styles:
            styles ??
            ctx.styles,

          slotProps:
            slotProps ??
            ctx.slotProps,

          className,
          style,
        });

      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLElement
              | null
          ) => {
            ctx.setAnchorNode(
              node
            );

            setRef(
              ref,
              node
            );

            setRef(
              (
                children as React.ReactElement & {
                  ref?: React.Ref<HTMLElement>;
                }
              ).ref,
              node
            );
          },
          [
            children,
            ctx,
            ref,
          ]
        );

      React.useEffect(() => {
        return () => {
          if (
            focusTimerRef.current !==
            null
          ) {
            clearOwnedWindowTimeout(
              focusTimerRef.current
            );
          }
        };
      }, []);

      const scheduleFocus =
        React.useCallback(
          (
            focus:
              () => void
          ) => {
            if (
              focusTimerRef.current !==
              null
            ) {
              clearOwnedWindowTimeout(
                focusTimerRef.current
              );
            }

            const ownerWindow =
              anchorRef.current?.ownerDocument.defaultView;

            if (!ownerWindow) {
              return;
            }

            focusTimerRef.current =
              setOwnedWindowTimeout(
                ownerWindow,
                () => {
                  focusTimerRef.current =
                    null;

                  focus();
                },
                0
              );
          },
          [anchorRef]
        );

      const openAndFocusFirst =
        React.useCallback(() => {
          onOpenChange?.(true);
          scheduleFocus(focusFirst);
        }, [
          focusFirst,
          onOpenChange,
          scheduleFocus,
        ]);

      const openAndFocusLast =
        React.useCallback(() => {
          onOpenChange?.(true);
          scheduleFocus(focusLast);
        }, [
          focusLast,
          onOpenChange,
          scheduleFocus,
        ]);

      const handleClick =
        React.useCallback(() => {
          onOpenChange?.(
            !ctx.open
          );
        }, [
          ctx.open,
          onOpenChange,
        ]);

      const handleKeyDown =
        React.useCallback(
          (
            event:
              React.KeyboardEvent<HTMLElement>
          ) => {
            if (
              event.key ===
                "Enter" ||
              event.key ===
                " "
            ) {
              /*
               * Se toma propiedad del teclado antes de que un botón nativo o
               * usePress generen otra activación mediante click/onPress.
               */
              event.preventDefault();

              onOpenChange?.(
                !ctx.open
              );

              return;
            }

            if (
              event.key ===
              "ArrowDown"
            ) {
              event.preventDefault();
              openAndFocusFirst();

              return;
            }

            if (
              event.key ===
              "ArrowUp"
            ) {
              event.preventDefault();
              openAndFocusLast();
            }
          },
          [
            ctx.open,
            onOpenChange,
            openAndFocusFirst,
            openAndFocusLast,
          ]
        );

      if (
        asChild &&
        React.isValidElement<
          TriggerChildProps
        >(children)
      ) {
        const {
          className:
            mergedClassName,

          style:
            mergedStyle,

          onClick:
            mergedOnClick,

          onKeyDown:
            mergedOnKeyDown,

          onPress:
            mergedOnPress,

          ...mergedRest
        } = mergeTriggerProps(
          children.props,
          triggerSlot
        );

        return React.cloneElement(
          children,
          {
            /*
             * El slot participa como capa pública, pero no puede reemplazar
             * identidad ni relaciones ARIA administradas por Menu.
             */
            ...mergedRest,

            ref: setRefs,
            id: ctx.triggerId,

            className:
              mergedClassName,

            style:
              mergedStyle,

            "aria-haspopup":
              "menu",

            "aria-expanded":
              ctx.open,

            "aria-controls":
              ctx.open
                ? ctx.contentId
                : undefined,

            onClick:
              composeEventHandlers(
                mergedOnClick,
                handleClick
              ),

            /*
             * usePress deriva onPress desde su onClick. Alternar también aquí
             * ejecutaría dos cambios de estado para una sola activación.
             */
            onPress:
              mergedOnPress,

            onKeyDown:
              composeEventHandlers(
                mergedOnKeyDown,
                handleKeyDown
              ),
          } as TriggerChildProps &
            React.HTMLAttributes<HTMLElement> & {
              ref:
                React.Ref<HTMLElement>;
            }
        );
      }

      const {
        className:
          triggerClassName,

        style:
          triggerStyle,

        onClick:
          triggerOnClick,

        onKeyDown:
          triggerOnKeyDown,

        ...triggerRest
      } = triggerSlot;

      return (
        <button
          {...triggerRest}

          ref={
            setRefs as React.Ref<HTMLButtonElement>
          }

          id={ctx.triggerId}
          type="button"

          aria-haspopup="menu"
          aria-expanded={ctx.open}
          aria-controls={
            ctx.open
              ? ctx.contentId
              : undefined
          }

          className={
            triggerClassName
          }

          style={
            triggerStyle
          }

          onClick={
            composeEventHandlers(
              triggerOnClick,
              handleClick
            )
          }

          onKeyDown={
            composeEventHandlers(
              triggerOnKeyDown,
              handleKeyDown
            )
          }
        >
          {children}
        </button>
      );
    }
  );

MenuTrigger.displayName =
  "MenuTrigger";
