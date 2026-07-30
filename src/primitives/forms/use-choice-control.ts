import React from "react";

import {
  useFocusVisible,
} from "../../core/interaction/focus";

import type {
  FieldControlKind,
} from "./use-field-control";

import {
  useFieldControl,
} from "./use-field-control";

import type {
  FieldStateSource,
} from "./field-semantics";


export interface UseChoiceControlOptions {
  id?:
    string;

  checked?:
    boolean;

  defaultChecked?:
    boolean;

  managed?:
    boolean;

  managedChecked?:
    boolean;

  disabled?:
    boolean;

  invalid?:
    boolean;

  required?:
    boolean;

  readOnly?:
    boolean;

  ariaInvalid?:
    React.AriaAttributes[
      "aria-invalid"
    ];

  ariaRequired?:
    React.AriaAttributes[
      "aria-required"
    ];

  ariaReadOnly?:
    React.AriaAttributes[
      "aria-readonly"
    ];

  ariaLabelledBy?:
    string;

  ariaDescribedBy?:
    string;

  kind?:
    FieldControlKind;

  includeFieldLabel?:
    boolean;

  includeFieldDescription?:
    boolean;

  additionalState?:
    FieldStateSource;

  onFocus?:
    React.FocusEventHandler<HTMLInputElement>;

  onBlur?:
    React.FocusEventHandler<HTMLInputElement>;

  onCheckedChange?: (
    checked:
      boolean,

    event:
      React.ChangeEvent<HTMLInputElement>
  ) => void;
}


export function useChoiceControl({
  id,

  checked,
  defaultChecked,

  managed = false,
  managedChecked,

  disabled,
  invalid,
  required,
  readOnly,

  ariaInvalid,
  ariaRequired,
  ariaReadOnly,

  ariaLabelledBy,
  ariaDescribedBy,

  kind,
  includeFieldLabel,
  includeFieldDescription,

  additionalState,

  onFocus,
  onBlur,

  onCheckedChange,
}: UseChoiceControlOptions) {
  const externallyControlled =
    checked !==
      undefined ||
    managed;


  const [
    internalChecked,
    setInternalChecked,
  ] =
    React.useState(
      Boolean(
        defaultChecked
      )
    );


  const resolvedChecked =
    checked !==
      undefined
      ? Boolean(
        checked
      )
      : managed
        ? Boolean(
          managedChecked
        )
        : internalChecked;


  const fieldControl =
    useFieldControl({
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

      kind,
      includeFieldLabel,
      includeFieldDescription,

      additionalState,
    });


  const {
    focused,
    focusVisible,
    focusProps,
  } =
    useFocusVisible<HTMLInputElement>({
      disabled:
        fieldControl.disabled,

      onFocus,
      onBlur,
    });


  const handleClick =
    React.useCallback(
      (
        event:
          React.MouseEvent<HTMLInputElement>
      ) => {
        if (
          fieldControl.readOnly
        ) {
          event.preventDefault();
        }
      },
      [
        fieldControl.readOnly,
      ]
    );


  const handleChange =
    React.useCallback(
      (
        event:
          React.ChangeEvent<HTMLInputElement>
      ) => {
        if (
          fieldControl.readOnly
        ) {
          event.preventDefault();

          return;
        }


        const nextChecked =
          event.currentTarget
            .checked;


        if (
          !externallyControlled
        ) {
          setInternalChecked(
            nextChecked
          );
        }


        onCheckedChange?.(
          nextChecked,
          event
        );
      },
      [
        externallyControlled,
        fieldControl.readOnly,
        onCheckedChange,
      ]
    );


  return {
    checked:
      resolvedChecked,

    fieldControl,

    focused,
    focusVisible,
    focusProps,

    handleClick,
    handleChange,
  } as const;
}
