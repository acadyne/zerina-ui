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


export type SwitchSlot =
  | "root"
  | "input"
  | "track"
  | "thumb"
  | "label";


export type SwitchStyles =
  SlotStyleMap<SwitchSlot>;


export type SwitchSlotProps =
  SlotPropsMap<SwitchSlot>;


export interface SwitchProps
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
    SwitchStyles;

  slotProps?:
    SwitchSlotProps;
}


export const Switch =
  forwardRef<
    HTMLInputElement,
    SwitchProps
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


      const recipeStyles =
        choiceControlRecipe({
          size,
          colorScheme,
          labelPlacement,
        });


      const rootSlot =
        resolveSlot<SwitchSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui":
              "switch",

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


      const trackSlot =
        resolveSlot<SwitchSlot>({
          slot:
            "track",

          styles,
          slotProps,

          baseProps: {
            "data-ui":
              "switch-track",
          },

          baseStyle: {
            position:
              "relative",

            display:
              "inline-flex",

            alignItems:
              "center",

            flexShrink:
              0,

            boxSizing:
              "border-box",
          },
        });


      const inputSlot =
        resolveSlot<SwitchSlot>({
          slot:
            "input",

          styles,
          slotProps,

          baseStyle: {
            ...recipeStyles.input,

            position:
              "absolute",

            inset:
              0,

            width:
              "100%",

            height:
              "100%",

            opacity:
              0,

            zIndex:
              1,
          },
        });


      const thumbSlot =
        resolveSlot<SwitchSlot>({
          slot:
            "thumb",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,

            "data-ui":
              "switch-thumb",
          },

          baseStyle: {
            display:
              "block",

            flexShrink:
              0,

            pointerEvents:
              "none",
          },
        });


      const labelSlot =
        resolveSlot<SwitchSlot>({
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
            {...trackSlot}
          >
            <input
              {...inputSlot}
              {...rest}

              {...runtime.inputProps}

              ref={
                ref
              }

              type="checkbox"

              role="switch"

              aria-checked={
                choice.checked
              }
            />

            <span
              {...thumbSlot}
            />
          </span>
        </ChoiceControlRoot>
      );
    }
  );


Switch.displayName =
  "Switch";
