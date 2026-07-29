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
  useFieldControl,
} from "./use-field-control";


type InputSize =
  TextControlSize;

type InputVariant =
  TextControlVariant;


export type InputSlot =
  "root";

export type InputStyles =
  SlotStyleMap<InputSlot>;

export type InputSlotProps =
  SlotPropsMap<InputSlot>;


export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size"
    >,
    SpaceProps {
  className?: string;
  style?: React.CSSProperties;

  size?: InputSize;
  variant?: InputVariant;

  invalid?: boolean;

  leftPadding?:
    React.CSSProperties["paddingLeft"];

  rightPadding?:
    React.CSSProperties["paddingRight"];

  fullWidth?: boolean;

  styles?: InputStyles;
  slotProps?: InputSlotProps;
}


type InputComponent =
  React.ForwardRefExoticComponent<
    InputProps &
    React.RefAttributes<HTMLInputElement>
  > & {
    __UI_CONTROL_KIND?:
      "input";
  };


export const Input =
  forwardRef<
    HTMLInputElement,
    InputProps
  >(
    (
      {
        className = "",
        style,

        size = "md",
        variant = "outline",

        invalid,

        leftPadding,
        rightPadding,

        type = "text",
        id,

        disabled,
        required,
        readOnly,

        fullWidth = true,

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
        resolveSlot<InputSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseStyle: {
            width:
              fullWidth
                ? "100%"
                : undefined,

            minWidth:
              fullWidth
                ? 0
                : undefined,

            appearance:
              "none",

            WebkitAppearance:
              "none",

            paddingTop:
              pt ??
              py ??
              p,

            paddingBottom:
              pb ??
              py ??
              p,

            paddingLeft:
              leftPadding ??
              pl ??
              px ??
              p,

            paddingRight:
              rightPadding ??
              pr ??
              px ??
              p,

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

      const {
        onFocus:
          slotOnFocus,

        onBlur:
          slotOnBlur,

        ...resolvedRootSlot
      } = rootSlot;

      const focus =
        useFocusVisible<HTMLInputElement>({
          disabled:
            fieldControl.disabled,

          onFocus:
            composeEventHandlers<
              React.FocusEvent<HTMLInputElement>
            >(
              slotOnFocus as
                | React.FocusEventHandler<HTMLInputElement>
                | undefined,

              onFocus
            ),

          onBlur:
            composeEventHandlers<
              React.FocusEvent<HTMLInputElement>
            >(
              slotOnBlur as
                | React.FocusEventHandler<HTMLInputElement>
                | undefined,

              onBlur
            ),
        });

      return (
        <input
          {...resolvedRootSlot}
          {...props}
          {...focus.focusProps}

          ref={ref}

          id={
            fieldControl.id
          }

          type={type}

          disabled={
            fieldControl.disabled
          }

          required={
            fieldControl.required
          }

          readOnly={
            fieldControl.readOnly
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

          data-ui="input"

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
        />
      );
    }
  ) as InputComponent;


Input.displayName =
  "Input";

Input.__UI_CONTROL_KIND =
  "input";
