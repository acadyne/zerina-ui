import React, {
  forwardRef,
} from "react";

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

import {
  useRadioGroupContext,
} from "./RadioGroup";


export type RadioSlot =
  | "root"
  | "input"
  | "control"
  | "indicator"
  | "indicatorDot"
  | "label";


export type RadioStyles =
  SlotStyleMap<RadioSlot>;


export type RadioSlotProps =
  SlotPropsMap<RadioSlot>;


export interface RadioProps
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

  size?:
    ChoiceControlSize;

  colorScheme?:
    ChoiceControlColorScheme;

  labelPlacement?:
    ChoiceControlLabelPlacement;

  styles?:
    RadioStyles;

  slotProps?:
    RadioSlotProps;
}


export const Radio =
  forwardRef<
    HTMLInputElement,
    RadioProps
  >(
    (
      {
        id,
        label,

        value,
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

        name,

        ...rest
      },
      ref
    ) => {
      const group =
        useRadioGroupContext();


      const groupManaged =
        checked ===
          undefined &&
        group !==
          null &&
        value !==
          undefined;


      const runtime =
        useChoiceControlRuntime({
          id,

          checked,
          defaultChecked,

          managed:
            groupManaged,

          managedChecked:
            groupManaged
              ? group?.value ===
                String(
                  value
                )
              : undefined,

          disabled,
          invalid,
          required,
          readOnly,

          ariaInvalid,
          ariaRequired,
          ariaReadOnly,

          ariaLabelledBy,
          ariaDescribedBy,

          kind:
            group ===
              null
              ? "control"
              : "group-item",

          includeFieldDescription:
            group ===
              null,

          additionalState:
            group?.state,

          onFocus,
          onBlur,
          onClick,
          onChange,

          inputSlotProps:
            slotProps?.input as
              | ChoiceInputSlotEventProps
              | undefined,

          onCheckedChange: (
            nextChecked,
            event
          ) => {
            if (
              groupManaged &&
              nextChecked
            ) {
              group?.selectValue(
                String(
                  value
                ),
                event
              );
            }
          },
        });


      const {
        choice,
      } = runtime;


      const resolvedName =
        group?.name ??
        name;


      const recipeStyles =
        choiceControlRecipe({
          size,
          colorScheme,
          labelPlacement,
        });


      const rootSlot =
        resolveSlot<RadioSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "radio",

            "data-size":
              size,

            "data-color-scheme":
              colorScheme,

            "data-label-placement":
              labelPlacement,

            ...runtime.rootStateProps,
          },

          baseStyle:
            recipeStyles.root,
        });


      const controlSlot =
        resolveSlot<RadioSlot>({
          slot:
            "control",

          styles,
          slotProps,

          baseProps: {
            "data-ui":
              "radio-control",
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
        resolveSlot<RadioSlot>({
          slot:
            "input",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.input,
        });


      const indicatorSlot =
        resolveSlot<RadioSlot>({
          slot:
            "indicator",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,

            "data-ui":
              "radio-indicator",
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


      const indicatorDotSlot =
        resolveSlot<RadioSlot>({
          slot:
            "indicatorDot",

          styles,
          slotProps,

          baseProps: {
            "data-ui":
              "radio-dot",
          },

          baseStyle: {
            display:
              "block",

            borderRadius:
              "var(--ui-radius-full)",

            transformOrigin:
              "center",
          },
        });


      const labelSlot =
        resolveSlot<RadioSlot>({
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
                ref
              }

              type="radio"

              name={
                resolvedName
              }

              value={
                value
              }
            />

            <span
              {...indicatorSlot}
            >
              <span
                {...indicatorDotSlot}
              />
            </span>
          </span>
        </ChoiceControlRoot>
      );
    }
  );


Radio.displayName =
  "Radio";
