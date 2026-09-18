import React from "react";

import type {
  FieldMessageSlot,
  FieldMessageSlotProps,
  FieldMessageStyles,
} from "./FieldMessageFrame";

import {
  FieldMessageFrame,
} from "./FieldMessageFrame";


export type FormErrorMessageSlot =
  FieldMessageSlot;

export type FormErrorMessageStyles =
  FieldMessageStyles;

export type FormErrorMessageSlotProps =
  FieldMessageSlotProps;


export interface FormErrorMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?:
    React.ReactNode;

  className?:
    string;

  style?:
    React.CSSProperties;

  styles?:
    FormErrorMessageStyles;

  slotProps?:
    FormErrorMessageSlotProps;
}


export const FormErrorMessage =
  React.forwardRef<
    HTMLParagraphElement,
    FormErrorMessageProps
  >(
    (
      props,
      ref,
    ) => (
      <FieldMessageFrame
        {...props}
        ref={ref}
        kind="error"
      />
    ),
  );


FormErrorMessage.displayName =
  "FormErrorMessage";
