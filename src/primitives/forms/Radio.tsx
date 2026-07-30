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

          onFocus:
            externalOnFocus,

          onBlur:
            externalOnBlur,

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

              ref={
                ref
              }

              id={
                choice
                  .fieldControl
                  .id
              }

              type="radio"

              data-ui="choice-input"

              name={
                resolvedName
              }

              value={
                value
              }

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
