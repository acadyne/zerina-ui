import type {
  AriaAttributes,
  FocusEventHandler,
} from "react";

import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

import {
  useFocusVisible,
} from "../../core/interaction/focus/useFocusVisible";

import {
  dataAttr,
} from "../../helpers";

import {
  useInputGroupDescendantState,
} from "./input-group-context";

import {
  useFieldControl,
} from "./use-field-control";


type TextControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement;


export interface UseTextControlRuntimeOptions<
  TElement extends TextControlElement,
> {
  id?:
    string;

  disabled?:
    boolean;

  invalid?:
    boolean;

  required?:
    boolean;

  readOnly?:
    boolean;

  ariaInvalid?:
    AriaAttributes["aria-invalid"];

  ariaRequired?:
    AriaAttributes["aria-required"];

  ariaReadOnly?:
    AriaAttributes["aria-readonly"];

  ariaLabelledBy?:
    string;

  ariaDescribedBy?:
    string;

  onFocus?:
    FocusEventHandler<TElement>;

  onBlur?:
    FocusEventHandler<TElement>;

  slotOnFocus?:
    FocusEventHandler<TElement>;

  slotOnBlur?:
    FocusEventHandler<TElement>;
}


export function useTextControlRuntime<
  TElement extends TextControlElement,
>({
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

  onFocus,
  onBlur,

  slotOnFocus,
  slotOnBlur,
}: UseTextControlRuntimeOptions<TElement>) {
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
    });


  /*
   * Precedencia transversal de eventos externos:
   *
   * prop pública -> slot local -> conducta interna.
   *
   * preventDefault() corta progresivamente las capas posteriores.
   */
  const focus =
    useFocusVisible<TElement>({
      disabled:
        fieldControl.disabled,

      onFocus:
        composeEventHandlers(
          onFocus,
          slotOnFocus,
        ),

      onBlur:
        composeEventHandlers(
          onBlur,
          slotOnBlur,
        ),
    });


  const inputGroup =
    useInputGroupDescendantState({
      focused:
        focus.focused,

      focusVisible:
        focus.focusVisible,
    });


  return {
    fieldControl,

    focus,

    commonProps: {
      id:
        fieldControl.id,

      disabled:
        fieldControl.disabled,

      required:
        fieldControl.required,

      readOnly:
        fieldControl.readOnly,

      "aria-invalid":
        fieldControl.ariaInvalid,

      "aria-required":
        fieldControl.ariaRequired,

      "aria-readonly":
        fieldControl.ariaReadOnly,

      "aria-labelledby":
        fieldControl.ariaLabelledBy,

      "aria-describedby":
        fieldControl.ariaDescribedBy,

      "data-ui-control":
        "",

      "data-in-group":
        dataAttr(
          Boolean(
            inputGroup,
          ),
        ),

      "data-focused":
        dataAttr(
          focus.focused,
        ),

      "data-focus-visible":
        dataAttr(
          focus.focusVisible,
        ),

      "data-invalid":
        dataAttr(
          fieldControl.invalid,
        ),

      "data-disabled":
        dataAttr(
          fieldControl.disabled,
        ),

      "data-required":
        dataAttr(
          fieldControl.required,
        ),

      "data-readonly":
        dataAttr(
          fieldControl.readOnly,
        ),
    },
  } as const;
}
