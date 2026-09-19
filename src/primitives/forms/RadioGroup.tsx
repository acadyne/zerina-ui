import React from "react";

import {
  useControllableValue,
} from "../../core/react/useControllableValue";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  Stack,
} from "../layout/Stack";

import {
  useFieldControl,
} from "./use-field-control";

import type {
  FieldState,
} from "./field-semantics";


type RadioGroupContextValue = {
  name: string;
  value?: string;

  selectValue: (
    value: string,
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => void;

  state: FieldState;
};


const RadioGroupContext =
  React.createContext<
    RadioGroupContextValue | null
  >(null);


export function useRadioGroupContext() {
  return React.useContext(
    RadioGroupContext
  );
}


export type RadioGroupSlot =
  "root";

export type RadioGroupStyles =
  SlotStyleMap<RadioGroupSlot>;

export type RadioGroupSlotProps =
  SlotPropsMap<RadioGroupSlot>;


export interface RadioGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | "defaultValue"
    | "onChange"
  > {
  children?: React.ReactNode;

  name: string;

  value?: string;
  defaultValue?: string;

  onValueChange?: (
    value: string,
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => void;

  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  readOnly?: boolean;

  direction?:
    | "row"
    | "column";

  spacing?:
    React.CSSProperties["gap"];

  className?: string;
  style?: React.CSSProperties;

  styles?: RadioGroupStyles;
  slotProps?: RadioGroupSlotProps;
}


export const RadioGroup =
  React.forwardRef<
    HTMLDivElement,
    RadioGroupProps
  >(
    (
      {
        children,

        id,
        name,

        value,
        defaultValue,
        onValueChange,

        disabled,
        invalid,
        required,
        readOnly,

        direction =
          "column",

        spacing =
          "0.65rem",

        className = "",
        style,

        styles,
        slotProps,

        "aria-invalid":
          ariaInvalid,

        "aria-required":
          ariaRequired,

        "aria-readonly":
          ariaReadOnly,

        "aria-labelledby":
          ariaLabelledBy,

        "aria-describedby":
          ariaDescribedBy,

        ...rest
      },
      ref
    ) => {
      const {
        value:
          currentValue,

        setUncontrolledValue:
          setInternalValue,
      } =
        useControllableValue<
          string | undefined
        >({
          value,

          defaultValue,
        });

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

          kind:
            "group",
        });

      const selectValue =
        React.useCallback(
          (
            nextValue: string,
            event:
              React.ChangeEvent<HTMLInputElement>
          ) => {
            if (
              fieldControl.disabled ||
              fieldControl.readOnly
            ) {
              event.preventDefault();
              return;
            }

            setInternalValue(
              nextValue
            );

            onValueChange?.(
              nextValue,
              event
            );
          },
          [
            fieldControl.disabled,
            fieldControl.readOnly,
            onValueChange,
            setInternalValue,
          ]
        );

      const contextValue =
        React.useMemo<
          RadioGroupContextValue
        >(
          () => ({
            name,

            value:
              currentValue,

            selectValue,

            state: {
              disabled:
                fieldControl.disabled,

              invalid:
                fieldControl.invalid,

              required:
                fieldControl.required,

              readOnly:
                fieldControl.readOnly,
            },
          }),
          [
            name,
            currentValue,
            selectValue,

            fieldControl.disabled,
            fieldControl.invalid,
            fieldControl.required,
            fieldControl.readOnly,
          ]
        );

      const semanticRootProps = {
        id:
          fieldControl.id,

        role:
          "radiogroup" as const,

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
      };


      const rootSlot =
        resolveSlot<RadioGroupSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            ...semanticRootProps,

            "data-ui":
              "radio-group",

            "data-disabled":
              fieldControl.disabled ||
              undefined,

            "data-invalid":
              fieldControl.invalid ||
              undefined,

            "data-required":
              fieldControl.required ||
              undefined,

            "data-readonly":
              fieldControl.readOnly ||
              undefined,
          },
        });

      return (
        <RadioGroupContext.Provider
          value={contextValue}
        >
          <Stack
            {...rest}
            {...rootSlot}
            {...semanticRootProps}

            ref={ref}

            direction={
              direction
            }

            spacing={
              spacing
            }
          >
            {children}
          </Stack>
        </RadioGroupContext.Provider>
      );
    }
  );


RadioGroup.displayName =
  "RadioGroup";
