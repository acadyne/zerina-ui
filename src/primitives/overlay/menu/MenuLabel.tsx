// src/primitives/overlay/menu/MenuLabel.tsx

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


      const labelSlot =
        resolveSlot<MenuSlot>({
          slot: "label",

          styles:
            styles ?? ctx?.styles,

          slotProps:
            slotProps ?? ctx?.slotProps,

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