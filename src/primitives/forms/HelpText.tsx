import React from "react";

import type {
  FieldMessageSlot,
  FieldMessageSlotProps,
  FieldMessageStyles,
} from "./FieldMessageFrame";

import {
  FieldMessageFrame,
} from "./FieldMessageFrame";


export type HelpTextSlot =
  FieldMessageSlot;

export type HelpTextStyles =
  FieldMessageStyles;

export type HelpTextSlotProps =
  FieldMessageSlotProps;


export interface HelpTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?:
    React.ReactNode;

  className?:
    string;

  style?:
    React.CSSProperties;

  styles?:
    HelpTextStyles;

  slotProps?:
    HelpTextSlotProps;
}


export const HelpText =
  React.forwardRef<
    HTMLParagraphElement,
    HelpTextProps
  >(
    (
      props,
      ref,
    ) => (
      <FieldMessageFrame
        {...props}
        ref={ref}
        kind="help"
      />
    ),
  );


HelpText.displayName =
  "HelpText";
