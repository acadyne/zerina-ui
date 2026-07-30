import React, {
  forwardRef,
  useEffect,
  useRef,
} from "react";

import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

import {
  setRef,
} from "../../core/interaction/events";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  ChoiceControlRoot,
} from "./ChoiceControlRoot";

import {
  choiceControlRecipe,
} from "./choice-control-recipe";

import type {
  ChoiceControlColorScheme,
  ChoiceControlLabelPlacement,
  ChoiceControlSize,
} from "./choice-control-types";

import {
  useChoiceControl,
} from "./use-choice-control";


export type CheckboxSlot =
  | "root"
  | "input"
  | "control"
  | "indicator"
  | "mark"
  | "label";


export type CheckboxStyles =
  SlotStyleMap<CheckboxSlot>;


export type CheckboxSlotProps =
  SlotPropsMap<CheckboxSlot>;


export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "color"
    | "size"
    | "type"
  > {
  label?:
    React.ReactNode;

  invalid?:
    boolean;

  indeterminate?:
    boolean;

  size?:
    ChoiceControlSize;

  colorScheme?:
    ChoiceControlColorScheme;

  labelPlacement?:
    ChoiceControlLabelPlacement;

  styles?:
    CheckboxStyles;

  slotProps?:
    CheckboxSlotProps;
}


export const Checkbox =
  forwardRef<
    HTMLInputElement,
    CheckboxProps
  >(
    (
      {
        id,
        label,

        checked,
        defaultChecked,
        onChange,

        disabled,
        invalid,
        required,
        readOnly,

        "aria-describedby":
          ariaDescribedBy,

        "aria-labelledby":
          ariaLabelledBy,

        "aria-invalid":
          ariaInvalid,

        "aria-required":
          ariaRequired,

        "aria-readonly":
          ariaReadOnly,

        indeterminate =
          false,

        size =
          "md",

        colorScheme =
          "primary",

        labelPlacement =
          "end",

        className =
          "",

        style,

        styles,
        slotProps,

        onFocus,
        onBlur,
        onClick,

        ...rest
      },
      ref
    ) => {
      const innerRef =
        useRef<HTMLInputElement | null>(
          null
        );


      const inputSlotProps =
        slotProps?.input;


      const slotOnFocus =
        inputSlotProps
          ?.onFocus as
          | React.FocusEventHandler<HTMLInputElement>
          | undefined;


      const slotOnBlur =
        inputSlotProps
          ?.onBlur as
          | React.FocusEventHandler<HTMLInputElement>
          | undefined;


      const slotOnClick =
        inputSlotProps
          ?.onClick as
          | React.MouseEventHandler<HTMLInputElement>
          | undefined;


      const slotOnChange =
        inputSlotProps
          ?.onChange as
          | React.ChangeEventHandler<HTMLInputElement>
          | undefined;


      const externalOnFocus =
        composeEventHandlers<
          React.FocusEvent<HTMLInputElement>
        >(
          onFocus,
          slotOnFocus,
          {
            checkDefaultPrevented:
              false,
          }
        );


      const externalOnBlur =
        composeEventHandlers<
          React.FocusEvent<HTMLInputElement>
        >(
          onBlur,
          slotOnBlur,
          {
            checkDefaultPrevented:
              false,
          }
        );


      const choice =
        useChoiceControl({
          id,

          checked,
          defaultChecked,

          disabled,
          invalid,
          required,
          readOnly,

          ariaInvalid,
          ariaRequired,
          ariaReadOnly,

          ariaLabelledBy,
          ariaDescribedBy,

          onFocus:
            externalOnFocus,

          onBlur:
            externalOnBlur,
        });


      useEffect(() => {
        if (
          innerRef.current
        ) {
          innerRef
            .current
            .indeterminate =
            Boolean(
              indeterminate
            );
        }
      }, [
        indeterminate,
      ]);


      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLInputElement
              | null
          ) => {
            innerRef.current =
              node;

            setRef(
              ref,
              node
            );
          },
          [
            ref,
          ]
        );


      const recipeStyles =
        choiceControlRecipe({
          size,
          colorScheme,
          labelPlacement,
        });


      const rootSlot =
        resolveSlot<CheckboxSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "checkbox",

            "data-size":
              size,

            "data-color-scheme":
              colorScheme,

            "data-label-placement":
              labelPlacement,

            "data-checked":
              choice.checked ||
              undefined,

            "data-indeterminate":
              indeterminate ||
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
          },

          baseStyle:
            recipeStyles.root,
        });


      const controlSlot =
        resolveSlot<CheckboxSlot>({
          slot:
            "control",

          styles,
          slotProps,

          baseProps: {
            "data-ui":
              "checkbox-control",
          },

          baseStyle: {
            position:
              "relative",

            display:
              "inline-grid",

            flexShrink:
              0,
          },
        });


      const inputSlot =
        resolveSlot<CheckboxSlot>({
          slot:
            "input",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.input,
        });


      const indicatorSlot =
        resolveSlot<CheckboxSlot>({
          slot:
            "indicator",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,

            "data-ui":
              "checkbox-indicator",
          },

          baseStyle: {
            position:
              "absolute",

            inset:
              0,

            display:
              "grid",

            placeItems:
              "center",

            pointerEvents:
              "none",
          },
        });


      const markSlot =
        resolveSlot<CheckboxSlot>({
          slot:
            "mark",

          styles,
          slotProps,

          baseProps: {
            "data-ui":
              "checkbox-mark",
          },

          baseStyle: {
            display:
              "block",

            transformOrigin:
              "center",
          },
        });


      const labelSlot =
        resolveSlot<CheckboxSlot>({
          slot:
            "label",

          styles,
          slotProps,

          baseProps: {
            "data-ui":
              "choice-label",
          },

          baseStyle:
            recipeStyles.label,
        });


      const externalOnClick =
        composeEventHandlers<
          React.MouseEvent<HTMLInputElement>
        >(
          onClick,
          slotOnClick,
          {
            checkDefaultPrevented:
              false,
          }
        );


      const handleClick =
        composeEventHandlers<
          React.MouseEvent<HTMLInputElement>
        >(
          externalOnClick,
          choice.handleClick
        );


      const externalOnChange =
        composeEventHandlers<
          React.ChangeEvent<HTMLInputElement>
        >(
          onChange,
          slotOnChange,
          {
            checkDefaultPrevented:
              false,
          }
        );


      const handleChange = (
        event:
          React.ChangeEvent<HTMLInputElement>
      ): void => {
        if (
          choice
            .fieldControl
            .readOnly
        ) {
          event.preventDefault();

          return;
        }


        externalOnChange(
          event
        );


        if (
          event.defaultPrevented
        ) {
          return;
        }


        choice.handleChange(
          event
        );
      };


      return (
        <ChoiceControlRoot
          controlId={
            choice
              .fieldControl
              .id
          }

          label={
            label
          }

          rootProps={
            rootSlot
          }

          labelProps={
            labelSlot
          }
        >
          <span
            {...controlSlot}
          >
            <input
              {...inputSlot}
              {...rest}

              id={
                choice
                  .fieldControl
                  .id
              }

              ref={
                setRefs
              }

              type="checkbox"

              data-ui="choice-input"

              checked={
                choice.checked
              }

              disabled={
                choice
                  .fieldControl
                  .disabled
              }

              required={
                choice
                  .fieldControl
                  .required
              }

              aria-checked={
                indeterminate
                  ? "mixed"
                  : choice.checked
              }

              aria-invalid={
                choice
                  .fieldControl
                  .ariaInvalid
              }

              aria-required={
                choice
                  .fieldControl
                  .ariaRequired
              }

              aria-readonly={
                choice
                  .fieldControl
                  .ariaReadOnly
              }

              aria-describedby={
                choice
                  .fieldControl
                  .ariaDescribedBy
              }

              aria-labelledby={
                choice
                  .fieldControl
                  .ariaLabelledBy
              }

              data-readonly={
                choice
                  .fieldControl
                  .readOnly ||
                undefined
              }

              onClick={
                handleClick
              }

              onChange={
                handleChange
              }

              onFocus={
                choice
                  .focusProps
                  .onFocus
              }

              onBlur={
                choice
                  .focusProps
                  .onBlur
              }
            />

            <span
              {...indicatorSlot}
            >
              <span
                {...markSlot}
              />
            </span>
          </span>
        </ChoiceControlRoot>
      );
    }
  );


Checkbox.displayName =
  "Checkbox";
