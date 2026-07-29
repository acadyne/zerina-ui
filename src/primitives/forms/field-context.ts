import {
  createContext,
} from "react";

import type {
  FieldState,
} from "./field-semantics";


export type FieldLabelAssociation =
  | "control"
  | "group";


export type FieldContextValue =
  FieldState & {
    fieldId: string;
    controlId: string;

    labelId?: string;
    helpTextId?: string;
    errorMessageId?: string;

    labelAssociation:
      FieldLabelAssociation;
  };


export const FieldContext =
  createContext<
    FieldContextValue | null
  >(null);
