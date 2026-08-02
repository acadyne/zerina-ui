// src/primitives/overlay/menu/MenuLabel.tsx

import React from "react";

import {
  resolveLayeredSlot,
} from "../../../helpers/css";

import {
  useOptionalMenuContext,
} from "./menu.context";

import {
  DEFAULT_MENU_RECIPE_STYLES,
} from "./menu.recipe";

import type {
  MenuLabelProps,
  MenuSlot,
} from "./menu.types";


export const MenuLabel =
  React.forwardRef<
    HTMLDivElement,
    MenuLabelProps
  >(
    (
      {
        children,

        className = "",

        style,

        styles,

        slotProps,

        ...rest
      },
      ref
    ) => {
      const ctx =
        useOptionalMenuContext();


      /*
       * Contexto y override local son capas acumulativas. El override no borra
       * estilos ni clases declarados por MenuRoot.
       */
      const labelSlot =
        resolveLayeredSlot<MenuSlot>({
          slots: [
            "label",
          ],

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,

          slotProps,

          className,

          style,

          baseStyle:
            DEFAULT_MENU_RECIPE_STYLES
              .label,
        });


      return (
        <div
          {...labelSlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );


MenuLabel.displayName =
  "MenuLabel";
