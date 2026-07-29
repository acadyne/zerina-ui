import {
  useContext,
  useId,
} from "react";

import type {
  AriaAttributes,
} from "react";

import {
  FieldContext,
} from "./field-context";

import {
  InputGroupContext,
} from "./input-group-context";

import {
  mergeAriaIds,
  resolveAriaInvalid,
  resolveAriaReadOnly,
  resolveAriaRequired,
  resolveFieldState,
  type FieldState,
  type FieldStateSource,
} from "./field-semantics";


export type FieldControlKind =
  | "control"
  | "group"
  | "group-item";


export type UseFieldControlOptions = {
  id?: string;

  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  readOnly?: boolean;

  ariaInvalid?:
    AriaAttributes["aria-invalid"];

  ariaRequired?:
    AriaAttributes["aria-required"];

  ariaReadOnly?:
    AriaAttributes["aria-readonly"];

  ariaLabelledBy?: string;
  ariaDescribedBy?: string;

  kind?: FieldControlKind;

  includeFieldLabel?: boolean;
  includeFieldDescription?: boolean;

  additionalState?:
    FieldStateSource;
};


export function useFieldState(
  ...sources:
    ReadonlyArray<FieldStateSource>
): FieldState {
  const field =
    useContext(
      FieldContext
    );

  const inputGroup =
    useContext(
      InputGroupContext
    );

  return resolveFieldState(
    field,
    inputGroup,
    ...sources
  );
}


export function useFieldControl({
  id,

  disabled,
  invalid,
  required,
  readOnly,

  ariaInvalid,
  ariaRequired,
  ariaReadOnly,

  ariaLabelledBy,
  ariaDescribedBy,

  kind = "control",

  includeFieldLabel,
  includeFieldDescription = true,

  additionalState,
}: UseFieldControlOptions) {
  const generatedId =
    useId();

  const field =
    useContext(
      FieldContext
    );

  const state =
    useFieldState(
      additionalState,
      {
        disabled,
        invalid,
        required,
        readOnly,
      }
    );

  const resolvedId =
    id ??
    (
      kind !== "group-item"
        ? field?.controlId
        : undefined
    ) ??
    `ui-control-${generatedId}`;

  const shouldIncludeFieldLabel =
    includeFieldLabel ??
    (
      kind === "group" &&
      field?.labelAssociation ===
        "group"
    );

  const resolvedAriaLabelledBy =
    mergeAriaIds(
      ariaLabelledBy,

      shouldIncludeFieldLabel
        ? field?.labelId
        : undefined
    );

  const resolvedAriaDescribedBy =
    mergeAriaIds(
      ariaDescribedBy,

      includeFieldDescription
        ? field?.helpTextId
        : undefined,

      includeFieldDescription &&
      state.invalid
        ? field?.errorMessageId
        : undefined
    );

  return {
    id:
      resolvedId,

    disabled:
      state.disabled,

    invalid:
      state.invalid,

    required:
      state.required,

    readOnly:
      state.readOnly,

    ariaInvalid:
      resolveAriaInvalid(
        ariaInvalid,
        state.invalid
      ),

    ariaRequired:
      resolveAriaRequired(
        ariaRequired,
        state.required
      ),

    ariaReadOnly:
      resolveAriaReadOnly(
        ariaReadOnly,
        state.readOnly
      ),

    ariaLabelledBy:
      resolvedAriaLabelledBy,

    ariaDescribedBy:
      resolvedAriaDescribedBy,

    field,
  } as const;
}
