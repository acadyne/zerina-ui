import React from "react";

import {
  useControllableValue,
} from "../../core/react/useControllableValue";

import {
  Search,
  X,
} from "lucide-react";

import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

import type {
  UIPressEvent,
} from "../../core/interaction";

import {
  resolveSlot,
  type SlotElementProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  ControlAction,
  type ControlActionProps,
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


export type SearchInputSlot =
  | "group"
  | "startAdornment"
  | "icon"
  | "input"
  | "endAdornment"
  | "clearButton";


export type SearchInputStyles =
  SlotStyleMap<SearchInputSlot>;

export type SearchInputSlotProps =
  Omit<
    SlotPropsMap<SearchInputSlot>,
    "clearButton"
  > & {
    clearButton?:
      SlotElementProps &
      Pick<
        ControlActionProps,
        "onPress"
      >;
  };


export interface SearchInputProps
  extends Omit<
    InputProps,
    | "type"
    | "leftPadding"
    | "rightPadding"
    | "styles"
    | "slotProps"
  > {
  onClear?: () => void;

  onValueChange?: (
    value: string
  ) => void;

  clearable?: boolean;

  styles?:
    SearchInputStyles;

  slotProps?:
    SearchInputSlotProps;
}


export const SearchInput =
  React.forwardRef<
    HTMLInputElement,
    SearchInputProps
  >(
    (
      {
        value,
        defaultValue,

        onChange,
        onClear,
        onValueChange,

        clearable =
          true,

        placeholder =
          "Buscar…",

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


      const controlledValue =
        value === undefined
          ? undefined
          : String(
              value ?? ""
            );


      const {
        value:
          currentValue,

        setUncontrolledValue:
          setInternalValue,
      } =
        useControllableValue<string>({
          value:
            controlledValue,

          defaultValue:
            defaultValue == null
              ? ""
              : String(
                  defaultValue
                ),
        });


      const showClear =
        clearable &&
        currentValue.length >
          0 &&
        !state.disabled &&
        !state.readOnly;


      const groupSlot =
        resolveSlot<SearchInputSlot>({
          slot:
            "group",

          styles,
          slotProps,

          className,
          style,
        });


      const startAdornmentSlot =
        resolveSlot<SearchInputSlot>({
          slot:
            "startAdornment",

          styles,
          slotProps,
        });


      const iconSlot =
        resolveSlot<SearchInputSlot>({
          slot:
            "icon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,
          },

          baseStyle: {
            display:
              "inline-flex",

            color:
              "var(--ui-text-muted)",

            pointerEvents:
              "none",
          },
        });


      const endAdornmentSlot =
        resolveSlot<SearchInputSlot>({
          slot:
            "endAdornment",

          styles,
          slotProps,
        });


      const clearButtonSlot =
        resolveSlot<SearchInputSlot>({
          slot:
            "clearButton",

          styles,
          slotProps,
        });


      const inputRootStyle =
        styles?.input;

      const inputRootSlotProps =
        slotProps?.input;

      const {
        onChange:
          slotOnChange,

        ...inputRootSlotPropsRest
      } =
        inputRootSlotProps ??
        {};


      const handleChange =
        composeEventHandlers<
          React.ChangeEvent<HTMLInputElement>
        >(
          slotOnChange as
            | React.ChangeEventHandler<HTMLInputElement>
            | undefined,

          (event) => {
            const nextValue =
              event.currentTarget
                .value;

            setInternalValue(
              nextValue
            );

            onValueChange?.(
              nextValue
            );

            onChange?.(
              event
            );
          }
        );


      const handleClear =
        React.useCallback(
          (
            _event:
              UIPressEvent<HTMLButtonElement>
          ) => {
            if (
              state.disabled ||
              state.readOnly
            ) {
              return;
            }

            setInternalValue(
              ""
            );

            onClear?.();
            onValueChange?.(
              ""
            );
          },
          [
            onClear,
            onValueChange,
            setInternalValue,
            state.disabled,
            state.readOnly,
          ]
        );


      /*
       * Limpiar es conducta interna del control. El slot observa primero y
       * puede cancelarla sin reemplazar el estado disabled/readOnly ni aria.
       */
      const {
        onPress:
          clearButtonSlotOnPress,
        ...clearButtonSlotRest
      } = clearButtonSlot as typeof clearButtonSlot & {
        onPress?:
          typeof handleClear;
      };


      const handleClearPress =
        composeEventHandlers<
          UIPressEvent<HTMLButtonElement>
        >(
          clearButtonSlotOnPress,
          handleClear
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
          <InputAdornment
            {...startAdornmentSlot}

            position="start"

            pointerEvents="none"
          >
            <span
              {...iconSlot}
            >
              <Search
                size={16}
              />
            </span>
          </InputAdornment>

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
                      inputRootSlotPropsRest,
                  }
                : undefined
            }

            ref={ref}

            id={id}

            type="search"

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

            value={
              currentValue
            }

            onChange={
              handleChange
            }

            placeholder={
              placeholder
            }
          />

          {showClear ? (
            <InputAdornment
              {...endAdornmentSlot}

              position="end"
            >
              <ControlAction
                {...clearButtonSlotRest}

                size="sm"

                aria-label="Limpiar búsqueda"

                onPress={
                  handleClearPress
                }
              >
                <X
                  size={14}
                />
              </ControlAction>
            </InputAdornment>
          ) : null}
        </InputGroup>
      );
    }
  );


SearchInput.displayName =
  "SearchInput";
