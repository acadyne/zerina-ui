// src/primitives/overlay/menu/MenuSeparator.tsx

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
  MenuSeparatorProps,
  MenuSlot,
} from "./menu.types";


export const MenuSeparator =
  React.forwardRef<
    HTMLDivElement,
    MenuSeparatorProps
  >(
    (
      {
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
       * El slot se resuelve una sola vez y acumula las capas de contexto y del
       * componente. role se fija después porque constituye su semántica.
       */
      const separatorSlot =
        resolveLayeredSlot<MenuSlot>({
          slots: [
            "separator",
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
              .separator,
        });


      return (
        <div
          {...separatorSlot}
          {...rest}
          ref={ref}
          role="separator"
        />
      );
    }
  );


MenuSeparator.displayName =
  "MenuSeparator";
