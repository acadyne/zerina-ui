import React from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import type {
  UIPressEvent,
} from "../../core/interaction";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  ControlAction,
} from "./ControlAction";

import {
  Input,
  type InputProps,
} from "./Input";

import {
  InputAdornment,
} from "./InputAdornment";

import {
  InputGroup,
} from "./InputGroup";

import {
  useFieldState,
} from "./use-field-control";


export type PasswordInputSlot =
  | "group"
  | "input"
  | "endAdornment"
  | "toggleButton";


export type PasswordInputStyles =
  SlotStyleMap<PasswordInputSlot>;

export type PasswordInputSlotProps =
  SlotPropsMap<PasswordInputSlot>;


export interface PasswordInputProps
  extends Omit<
    InputProps,
    | "type"
    | "rightPadding"
    | "styles"
    | "slotProps"
  > {
  showLabel?: string;
  hideLabel?: string;

  styles?:
    PasswordInputStyles;

  slotProps?:
    PasswordInputSlotProps;
}


export const PasswordInput =
  React.forwardRef<
    HTMLInputElement,
    PasswordInputProps
  >(
    (
      {
        showLabel =
          "Mostrar contraseña",

        hideLabel =
          "Ocultar contraseña",

        id,

        disabled,
        invalid,
        required,
        readOnly,

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

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const state =
        useFieldState({
          disabled,
          invalid,
          required,
          readOnly,
        });


      const [
        visible,
        setVisible,
      ] =
        React.useState(
          false
        );


      const groupSlot =
        resolveSlot<PasswordInputSlot>({
          slot:
            "group",

          styles,
          slotProps,

          className,
          style,
        });


      const inputRootStyle =
        styles?.input;

      const inputRootSlotProps =
        slotProps?.input;


      const endAdornmentSlot =
        resolveSlot<PasswordInputSlot>({
          slot:
            "endAdornment",

          styles,
          slotProps,
        });


      const toggleButtonSlot =
        resolveSlot<PasswordInputSlot>({
          slot:
            "toggleButton",

          styles,
          slotProps,
        });


      const handleToggle =
        React.useCallback(
          (
            _event:
              UIPressEvent<HTMLButtonElement>
          ) => {
            if (
              state.disabled
            ) {
              return;
            }

            setVisible(
              (current) =>
                !current
            );
          },
          [
            state.disabled,
          ]
        );


      return (
        <InputGroup
          {...groupSlot}

          invalid={
            invalid
          }

          disabled={
            disabled
          }

          required={
            required
          }

          readOnly={
            readOnly
          }
        >
          <Input
            {...rest}

            styles={
              inputRootStyle
                ? {
                    root:
                      inputRootStyle,
                  }
                : undefined
            }

            slotProps={
              inputRootSlotProps
                ? {
                    root:
                      inputRootSlotProps,
                  }
                : undefined
            }

            ref={ref}

            id={id}

            aria-invalid={
              ariaInvalid
            }

            aria-required={
              ariaRequired
            }

            aria-readonly={
              ariaReadOnly
            }

            aria-labelledby={
              ariaLabelledBy
            }

            aria-describedby={
              ariaDescribedBy
            }

            type={
              visible
                ? "text"
                : "password"
            }
          />

          <InputAdornment
            {...endAdornmentSlot}

            position="end"
          >
            <ControlAction
              {...toggleButtonSlot}

              size="md"

              aria-label={
                visible
                  ? hideLabel
                  : showLabel
              }

              aria-pressed={
                visible
              }

              disabled={
                state.disabled
              }

              onPress={
                handleToggle
              }
            >
              {visible ? (
                <EyeOff
                  size={16}
                />
              ) : (
                <Eye
                  size={16}
                />
              )}
            </ControlAction>
          </InputAdornment>
        </InputGroup>
      );
    }
  );


PasswordInput.displayName =
  "PasswordInput";
