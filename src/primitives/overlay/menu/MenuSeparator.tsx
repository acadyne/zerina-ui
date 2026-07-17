// src/primitives/overlay/menu/MenuSeparator.tsx

import React from "react";

import {
  resolveSlot,
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


      const separatorSlot =
        resolveSlot<MenuSlot>({
          slot: "separator",

          styles:
            styles ?? ctx?.styles,

          slotProps:
            slotProps ?? ctx?.slotProps,

          className,

          style,

          baseStyle:
            DEFAULT_MENU_RECIPE_STYLES
              .separator,
        });


      return (
        <div
          {...separatorSlot}
          ref={ref}
          role="separator"
          {...rest}
        />
      );
    }
  );


MenuSeparator.displayName =
  "MenuSeparator";