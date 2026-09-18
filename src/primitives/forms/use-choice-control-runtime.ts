import React from "react";

import {
  composeEventHandlerChain,
} from "../../core/interaction/events/composeEventHandlers";

import {
  useChoiceControl,
  type UseChoiceControlOptions,
} from "./use-choice-control";


export interface ChoiceInputSlotEventProps {
  onFocus?:
    React.FocusEventHandler<HTMLInputElement>;

  onBlur?:
    React.FocusEventHandler<HTMLInputElement>;

  onClick?:
    React.MouseEventHandler<HTMLInputElement>;

  onChange?:
    React.ChangeEventHandler<HTMLInputElement>;
}


export interface UseChoiceControlRuntimeOptions
  extends Omit<
    UseChoiceControlOptions,
    | "onFocus"
    | "onBlur"
  > {
  onFocus?:
    React.FocusEventHandler<HTMLInputElement>;

  onBlur?:
    React.FocusEventHandler<HTMLInputElement>;

  onClick?:
    React.MouseEventHandler<HTMLInputElement>;

  onChange?:
    React.ChangeEventHandler<HTMLInputElement>;

  inputSlotProps?:
    ChoiceInputSlotEventProps;
}


/**
 * Owner del wiring semántico común de Checkbox, Radio y Switch.
 *
 * Mantiene:
 *
 * public prop -> input slot -> conducta interna
 *
 * bajo la regla transversal de cancelación progresiva. readOnly se evalúa
 * antes de las capas externas de change, porque un control readOnly no adopta
 * ni notifica un cambio nativo.
 */
export function useChoiceControlRuntime({
  onFocus,
  onBlur,
  onClick,
  onChange,

  inputSlotProps,

  ...choiceOptions
}: UseChoiceControlRuntimeOptions) {
  const choice =
    useChoiceControl({
      ...choiceOptions,

      onFocus:
        composeEventHandlerChain(
          onFocus,
          inputSlotProps
            ?.onFocus,
        ),

      onBlur:
        composeEventHandlerChain(
          onBlur,
          inputSlotProps
            ?.onBlur,
        ),
    });


  const handleClick =
    composeEventHandlerChain<
      React.MouseEvent<HTMLInputElement>
    >(
      onClick,
      inputSlotProps
        ?.onClick,
      choice.handleClick,
    );


  const externalChange =
    composeEventHandlerChain<
      React.ChangeEvent<HTMLInputElement>
    >(
      onChange,
      inputSlotProps
        ?.onChange,
      choice.handleChange,
    );


  const handleChange =
    React.useCallback(
      (
        event:
          React.ChangeEvent<HTMLInputElement>,
      ) => {
        if (
          choice
            .fieldControl
            .readOnly
        ) {
          event.preventDefault();

          return;
        }

        externalChange?.(
          event,
        );
      },
      [
        choice
          .fieldControl
          .readOnly,
        externalChange,
      ],
    );


  const rootStateProps = {
    "data-checked":
      choice.checked ||
      undefined,

    "data-disabled":
      choice
        .fieldControl
        .disabled ||
      undefined,

    "data-invalid":
      choice
        .fieldControl
        .invalid ||
      undefined,

    "data-required":
      choice
        .fieldControl
        .required ||
      undefined,

    "data-readonly":
      choice
        .fieldControl
        .readOnly ||
      undefined,

    "data-focused":
      choice.focused ||
      undefined,

    "data-focus-visible":
      choice.focusVisible ||
      undefined,
  } as const;


  const inputProps = {
    id:
      choice
        .fieldControl
        .id,

    "data-ui":
      "choice-input",

    checked:
      choice.checked,

    disabled:
      choice
        .fieldControl
        .disabled,

    required:
      choice
        .fieldControl
        .required,

    "aria-invalid":
      choice
        .fieldControl
        .ariaInvalid,

    "aria-required":
      choice
        .fieldControl
        .ariaRequired,

    "aria-readonly":
      choice
        .fieldControl
        .ariaReadOnly,

    "aria-describedby":
      choice
        .fieldControl
        .ariaDescribedBy,

    "aria-labelledby":
      choice
        .fieldControl
        .ariaLabelledBy,

    "data-readonly":
      choice
        .fieldControl
        .readOnly ||
      undefined,

    onClick:
      handleClick,

    onChange:
      handleChange,

    onFocus:
      choice
        .focusProps
        .onFocus,

    onBlur:
      choice
        .focusProps
        .onBlur,
  } as const;


  return {
    choice,
    rootStateProps,
    inputProps,
  } as const;
}
