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


type TextareaSize =
  TextControlSize;

type TextareaVariant =
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


type TextareaComponent =
  React.ForwardRefExoticComponent<
    TextareaProps &
    React.RefAttributes<HTMLTextAreaElement>
  > & {
    __UI_CONTROL_KIND?:
      "textarea";
  };


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

      const focus =
        useFocusVisible<HTMLTextAreaElement>({
          disabled:
            fieldControl.disabled,

          onFocus:
            composeEventHandlers<
              React.FocusEvent<HTMLTextAreaElement>
            >(
              slotOnFocus as
                | React.FocusEventHandler<HTMLTextAreaElement>
                | undefined,

              onFocus
            ),

          onBlur:
            composeEventHandlers<
              React.FocusEvent<HTMLTextAreaElement>
            >(
              slotOnBlur as
                | React.FocusEventHandler<HTMLTextAreaElement>
                | undefined,

              onBlur
            ),
        });

      return (
        <textarea
          {...resolvedRootSlot}
          {...props}
          {...focus.focusProps}

          ref={ref}

          id={
            fieldControl.id
          }

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

          data-ui="textarea"

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
  ) as TextareaComponent;


Textarea.displayName =
  "Textarea";

Textarea.__UI_CONTROL_KIND =
  "textarea";
