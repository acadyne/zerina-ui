import React from "react";

import {
  TriggerRuntime,
} from "../../../core/interaction/trigger";

import {
  resolveLayeredSlot,
} from "../../../helpers/css";

import {
  useMenuContext,
} from "./menu.context";

import type {
  MenuSlot,
  MenuTriggerProps,
} from "./menu.types";


export const MenuTrigger =
  React.forwardRef<
    HTMLElement,
    MenuTriggerProps
  >(
    (
      {
        children,

        asChild =
          true,

        disabled =
          false,

        className =
          "",

        style,

        styles,
        slotProps,
      },
      ref
    ) => {
      const ctx =
        useMenuContext();

      const triggerSlot =
        resolveLayeredSlot<MenuSlot>({
          slots: [
            "trigger",
          ],

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          className,
          style,
        });

      const localTriggerEvents =
        slotProps
          ?.trigger as
          | React.HTMLAttributes<HTMLElement>
          | undefined;

      const contextTriggerEvents =
        ctx.slotProps
          ?.trigger as
          | React.HTMLAttributes<HTMLElement>
          | undefined;

      const handlePress =
        React.useCallback(
          () => {
            if (
              ctx.open
            ) {
              ctx.onOpenChange?.(
                false
              );

              return;
            }

            ctx.requestOpen(
              "configured"
            );
          },
          [
            ctx.onOpenChange,
            ctx.open,
            ctx.requestOpen,
          ]
        );

      const handleKeyDown =
        React.useCallback(
          (
            event:
              React.KeyboardEvent<HTMLElement>
          ) => {
            if (
              event.nativeEvent
                .isComposing ||
              event.key ===
                "Process"
            ) {
              return;
            }

            if (
              event.key ===
              "ArrowDown"
            ) {
              event.preventDefault();

              /*
               * El trigger publica intención. MenuRoot decide si el foco puede
               * aplicarse ahora o debe esperar al contenido committed.
               */
              ctx.requestOpen(
                "first"
              );

              return;
            }

            if (
              event.key ===
              "ArrowUp"
            ) {
              event.preventDefault();

              ctx.requestOpen(
                "last"
              );
            }
          },
          [
            ctx.requestOpen,
          ]
        );

      return (
        <TriggerRuntime
          asChild={
            asChild
          }

          disabled={
            disabled
          }

          forwardedRef={
            ref
          }

          onNodeChange={
            ctx.setAnchorNode
          }

          elementProps={{
            ...triggerSlot,

            id:
              ctx.triggerId,

            "aria-haspopup":
              "menu",

            "aria-expanded":
              ctx.open,

            "aria-controls":
              ctx.open
                ? ctx.contentId
                : undefined,
          }}

          /*
           * El hijo se compone dentro del runtime. Después participan el slot
           * local y el heredado; la conducta semántica interna queda al final.
           */
          eventLayers={[
            localTriggerEvents,
            contextTriggerEvents,
          ]}

          onPress={
            handlePress
          }

          onKeyDown={
            handleKeyDown
          }
        >
          {children}
        </TriggerRuntime>
      );
    }
  );


MenuTrigger.displayName =
  "MenuTrigger";
