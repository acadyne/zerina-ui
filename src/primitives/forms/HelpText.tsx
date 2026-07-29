import React, {
  useContext,
} from "react";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  FieldContext,
} from "./field-context";


export type HelpTextSlot = "root";

export type HelpTextStyles =
  SlotStyleMap<HelpTextSlot>;

export type HelpTextSlotProps =
  SlotPropsMap<HelpTextSlot>;


export interface HelpTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  styles?: HelpTextStyles;
  slotProps?: HelpTextSlotProps;
}


export const HelpText =
  React.forwardRef<
    HTMLParagraphElement,
    HelpTextProps
  >(
    (
      {
        children,
        id,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const field =
        useContext(
          FieldContext
        );

      if (
        children === null ||
        children === undefined ||
        children === false ||
        children === true
      ) {
        return null;
      }

      const rootSlot =
        resolveSlot<HelpTextSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseStyle: {
            marginTop:
              "0.35rem",

            fontSize:
              "var(--ui-font-size-sm)",

            color:
              "var(--ui-text-muted)",

            lineHeight:
              1.35,

            wordBreak:
              "break-word",

            minWidth:
              0,
          },
        });

      return (
        <p
          {...rest}
          {...rootSlot}
          ref={ref}

          id={
            field?.helpTextId ??
            id
          }
        >
          {children}
        </p>
      );
    }
  );


HelpText.displayName =
  "HelpText";
