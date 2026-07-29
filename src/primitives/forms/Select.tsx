import React, {
  forwardRef,
} from "react";

import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";

import {
  useFocusVisible,
} from "../../core/interaction/focus/useFocusVisible";

import {
  dataAttr,
  getSpacingStyles,
  type SpaceProps,
} from "../../helpers";

import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

import {
  type TextControlSize,
  type TextControlVariant,
} from "./control-types";

import {
  useInputGroupDescendantState,
} from "./input-group-context";

import {
  useFieldControl,
} from "./use-field-control";


export interface Option {
  label: string;
  value: string;
}


type SelectSize =
  TextControlSize;

type SelectVariant =
  TextControlVariant;


export type SelectSlot =
  | "root"
  | "control"
  | "indicator";

export type SelectStyles =
  SlotStyleMap<SelectSlot>;

export type SelectSlotProps =
  SlotPropsMap<SelectSlot>;


export interface SelectProps
  extends Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      | "value"
      | "onChange"
      | "size"
      | "style"
      | "className"
    >,
    SpaceProps {
  value: string;

  onChange: (
    event:
      React.ChangeEvent<HTMLSelectElement>
  ) => void;

  options?: Option[];
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  invalid?: boolean;
  readOnly?: boolean;

  rounded?:
    React.CSSProperties["borderRadius"];

  minW?:
    React.CSSProperties["minWidth"];

  size?: SelectSize;
  variant?: SelectVariant;

  fullWidth?: boolean;
  placeholder?: string;

  rightPadding?:
    React.CSSProperties["paddingRight"];

  indicatorOffset?:
    React.CSSProperties["right"];

  styles?: SelectStyles;
  slotProps?: SelectSlotProps;
}


export const Select =
  forwardRef<
    HTMLSelectElement,
    SelectProps
  >(
    (
      {
        value,
        onChange,

        options,
        children,

        className = "",
        style,

        invalid,
        readOnly,

        rounded,
        minW,

        size = "md",
        variant = "outline",

        fullWidth = true,

        disabled = false,
        required,

        placeholder,
        rightPadding,

        indicatorOffset,

        id,

        onFocus,
        onBlur,

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

        p,
        px,
        py,
        pt,
        pb,
        pl,
        pr,

        m,
        mx,
        my,
        mt,
        mb,
        ml,
        mr,

        styles,
        slotProps,

        ...props
      },
      ref
    ) => {
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
        });

      const hasPlaceholder =
        placeholder !==
        undefined;

      const spacingStyles =
        getSpacingStyles({
          m,
          mx,
          my,
          mt,
          mb,
          ml,
          mr,
        });

      const rootSlot =
        resolveSlot<SelectSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseStyle: {
            position:
              "relative",

            display:
              fullWidth
                ? "flex"
                : "inline-flex",

            width:
              fullWidth
                ? "100%"
                : undefined,

            minWidth:
              fullWidth
                ? 0
                : minW,

            maxWidth:
              "100%",

            marginTop:
              spacingStyles.marginTop,

            marginBottom:
              spacingStyles.marginBottom,

            marginLeft:
              spacingStyles.marginLeft,

            marginRight:
              spacingStyles.marginRight,
          },
        });

      const controlSlot =
        resolveSlot<SelectSlot>({
          slot:
            "control",

          styles,
          slotProps,

          baseStyle: {
            width:
              fullWidth
                ? "100%"
                : undefined,

            minWidth:
              fullWidth
                ? 0
                : minW,

            maxWidth:
              "100%",

            appearance:
              "none",

            WebkitAppearance:
              "none",

            MozAppearance:
              "none",

            borderRadius:
              rounded,

            paddingTop:
              pt ??
              py ??
              p,

            paddingBottom:
              pb ??
              py ??
              p,

            paddingLeft:
              pl ??
              px ??
              p,

            paddingRight:
              rightPadding ??
              pr ??
              px ??
              p,
          },
        });

      const indicatorSlot =
        resolveSlot<SelectSlot>({
          slot:
            "indicator",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden":
              true,
          },

          baseStyle: {
            position:
              "absolute",

            right:
              indicatorOffset,

            top:
              "50%",

            transform:
              "translateY(-50%)",

            pointerEvents:
              "none",

            fontSize:
              12,

            color:
              "var(--ui-text-muted)",

            lineHeight:
              1,
          },
        });

      const {
        onFocus:
          slotOnFocus,

        onBlur:
          slotOnBlur,

        onChange:
          slotOnChange,

        ...resolvedControlSlot
      } = controlSlot;

      const focus =
        useFocusVisible<HTMLSelectElement>({
          disabled:
            fieldControl.disabled,

          onFocus:
            composeEventHandlers<
              React.FocusEvent<HTMLSelectElement>
            >(
              slotOnFocus as
                | React.FocusEventHandler<HTMLSelectElement>
                | undefined,

              onFocus
            ),

          onBlur:
            composeEventHandlers<
              React.FocusEvent<HTMLSelectElement>
            >(
              slotOnBlur as
                | React.FocusEventHandler<HTMLSelectElement>
                | undefined,

              onBlur
            ),
        });

      const handleChange =
        composeEventHandlers<
          React.ChangeEvent<HTMLSelectElement>
        >(
          slotOnChange as
            | React.ChangeEventHandler<HTMLSelectElement>
            | undefined,

          onChange
        );

      const inputGroup =
        useInputGroupDescendantState({
          focused:
            focus.focused,

          focusVisible:
            focus.focusVisible,
        });


      return (
        <div
          {...rootSlot}
        >
          <select
            {...resolvedControlSlot}
            {...props}
            {...focus.focusProps}

            ref={ref}

            id={
              fieldControl.id
            }

            value={value}

            onChange={(event) => {
              if (
                fieldControl.readOnly
              ) {
                event.preventDefault();
                return;
              }

              handleChange(
                event
              );
            }}

            disabled={
              fieldControl.disabled
            }

            required={
              fieldControl.required
            }

            aria-invalid={
              fieldControl.ariaInvalid
            }

            aria-required={
              fieldControl.ariaRequired
            }

            aria-readonly={
              fieldControl.ariaReadOnly
            }

            aria-labelledby={
              fieldControl.ariaLabelledBy
            }

            aria-describedby={
              fieldControl.ariaDescribedBy
            }

            data-ui-control=""

            data-ui="select"

            data-in-group={
              dataAttr(
                Boolean(
                  inputGroup
                )
              )
            }

            data-size={size}

            data-variant={
              variant
            }

            data-focused={
              dataAttr(
                focus.focused
              )
            }

            data-focus-visible={
              dataAttr(
                focus.focusVisible
              )
            }

            data-invalid={
              dataAttr(
                fieldControl.invalid
              )
            }

            data-disabled={
              dataAttr(
                fieldControl.disabled
              )
            }

            data-required={
              dataAttr(
                fieldControl.required
              )
            }

            data-readonly={
              dataAttr(
                fieldControl.readOnly
              )
            }
          >
            {hasPlaceholder ? (
              <option
                value=""
                disabled
                hidden
              >
                {placeholder}
              </option>
            ) : null}

            {options
              ? options.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }

                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  )
                )
              : children}
          </select>

          <span
            {...indicatorSlot}
            data-ui="select-indicator"
          >
            ▼
          </span>
        </div>
      );
    }
  );


Select.displayName =
  "Select";
