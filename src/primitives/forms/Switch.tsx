import React, {
  forwardRef,
} from "react";

import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

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
            {...trackSlot}
          >
            <input
              {...inputSlot}
              {...rest}

              ref={
                ref
              }

              id={
                choice
                  .fieldControl
                  .id
              }

              type="checkbox"

              role="switch"

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
                choice.checked
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
              {...thumbSlot}
            />
          </span>
        </ChoiceControlRoot>
      );
    }
  );


Switch.displayName =
  "Switch";
