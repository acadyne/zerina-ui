import React, {
  forwardRef,
} from "react";

import {
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
  useTextControlRuntime,
} from "./use-text-control-runtime";


export type InputSize =
  TextControlSize;

export type InputVariant =
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


      const runtime =
        useTextControlRuntime<HTMLInputElement>({
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

          onFocus,
          onBlur,

          slotOnFocus:
            slotOnFocus as
              | React.FocusEventHandler<HTMLInputElement>
              | undefined,

          slotOnBlur:
            slotOnBlur as
              | React.FocusEventHandler<HTMLInputElement>
              | undefined,
        });


      return (
        <input
          {...resolvedRootSlot}
          {...props}
          {...runtime.focus.focusProps}
          {...runtime.commonProps}

          ref={ref}

          type={type}

          data-ui="input"

          data-size={size}

          data-variant={
            variant
          }
        />
      );
    }
  );


Input.displayName =
  "Input";
