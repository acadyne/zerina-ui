import React, {
  forwardRef,
  useEffect,
  useRef,
} from "react";

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
  useChoiceControlRuntime,
  type ChoiceInputSlotEventProps,
} from "./use-choice-control-runtime";


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


      const runtime =
        useChoiceControlRuntime({
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

          onFocus,
          onBlur,
          onClick,
          onChange,

          inputSlotProps:
            slotProps?.input as
              | ChoiceInputSlotEventProps
              | undefined,
        });


      const {
        choice,
      } = runtime;


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

            ...runtime.rootStateProps,

            "data-indeterminate":
              indeterminate ||
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

              {...runtime.inputProps}

              ref={
                setRefs
              }

              type="checkbox"

              aria-checked={
                indeterminate
                  ? "mixed"
                  : choice.checked
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
