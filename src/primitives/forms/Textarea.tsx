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


export type TextareaSize =
  TextControlSize;

export type TextareaVariant =
  TextControlVariant;


export type TextareaSlot =
  "root";

export type TextareaStyles =
  SlotStyleMap<TextareaSlot>;

export type TextareaSlotProps =
  SlotPropsMap<TextareaSlot>;


export interface TextareaProps
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "size"
    >,
    SpaceProps {
  className?: string;
  style?: React.CSSProperties;

  size?: TextareaSize;
  variant?: TextareaVariant;

  invalid?: boolean;

  resize?:
    React.CSSProperties["resize"];

  fullWidth?: boolean;

  rightPadding?:
    React.CSSProperties["paddingRight"];

  styles?: TextareaStyles;
  slotProps?: TextareaSlotProps;
}


export const Textarea =
  forwardRef<
    HTMLTextAreaElement,
    TextareaProps
  >(
    (
      {
        className = "",
        style,

        size = "md",
        variant = "outline",

        invalid,

        resize = "vertical",

        id,

        disabled,
        required,
        readOnly,

        fullWidth = true,

        rightPadding,

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
        resolveSlot<TextareaSlot>({
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
              0,

            resize,

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
        useTextControlRuntime<HTMLTextAreaElement>({
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
              | React.FocusEventHandler<HTMLTextAreaElement>
              | undefined,

          slotOnBlur:
            slotOnBlur as
              | React.FocusEventHandler<HTMLTextAreaElement>
              | undefined,
        });


      return (
        <textarea
          {...resolvedRootSlot}
          {...props}
          {...runtime.focus.focusProps}
          {...runtime.commonProps}

          ref={ref}

          data-ui="textarea"

          data-size={size}

          data-variant={
            variant
          }
        />
      );
    }
  );


Textarea.displayName =
  "Textarea";
