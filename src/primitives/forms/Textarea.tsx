// src/primitives/forms/Textarea.tsx
import React, { forwardRef, useState } from "react";
import { useFieldControl } from "./use-field-control";
import {
  getControlBaseStyles,
  getControlDataAttributes,
  getControlSizeStyles,
  getSpacingStyles,
  type SpaceProps,
} from "../../helpers";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

type TextareaSize = "sm" | "md" | "lg";
type TextareaVariant = "outline" | "unstyled";

export type TextareaSlot = "root";

export type TextareaStyles = SlotStyleMap<TextareaSlot>;

export type TextareaSlotProps = SlotPropsMap<TextareaSlot>;

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    SpaceProps {
  className?: string;
  style?: React.CSSProperties;

  size?: TextareaSize;
  variant?: TextareaVariant;
  invalid?: boolean;
  resize?: React.CSSProperties["resize"];
  fullWidth?: boolean;
  rightPadding?: number | string;

  styles?: TextareaStyles;
  slotProps?: TextareaSlotProps;
}

const textareaMinHeightMap: Record<
  TextareaSize,
  React.CSSProperties["minHeight"]
> = {
  sm: "84px",
  md: "108px",
  lg: "132px",
};

type TextareaComponent = React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
> & {
  __UI_CONTROL_KIND?: "textarea";
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-readonly": ariaReadOnly,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,

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
    const [isFocused, setIsFocused] =
      useState(false);

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

    const sizeStyles = getControlSizeStyles(size);
    const controlStyles = getControlBaseStyles(size, variant, {
      invalid: fieldControl.invalid,
      disabled: fieldControl.disabled,
      focused: isFocused,
    });

    const spacingStyles = getSpacingStyles({
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
    });

    const rootSlot = resolveSlot<TextareaSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        width: fullWidth ? "100%" : undefined,
        minWidth: 0,
        outline: "none",
        lineHeight: 1.5,
        resize,

        ...controlStyles,

        minHeight: textareaMinHeightMap[size],

        paddingTop: pt ?? py ?? p ?? sizeStyles.paddingY,
        paddingBottom: pb ?? py ?? p ?? sizeStyles.paddingY,
        paddingLeft: pl ?? px ?? p ?? sizeStyles.paddingX,
        paddingRight: rightPadding ?? pr ?? px ?? p ?? sizeStyles.paddingX,

        marginTop: spacingStyles.marginTop,
        marginBottom: spacingStyles.marginBottom,
        marginLeft: spacingStyles.marginLeft,
        marginRight: spacingStyles.marginRight,
      },
    });

    return (
      <textarea
        {...rootSlot}
        ref={ref}
        id={fieldControl.id}

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

        data-readonly={
          fieldControl.readOnly ||
          undefined
        }
        {...getControlDataAttributes({
          focused: isFocused,
          invalid: fieldControl.invalid,
          disabled: fieldControl.disabled,
        })}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        {...props}
        data-ui="textarea"
      />
    );
  }
) as TextareaComponent;

Textarea.displayName = "Textarea";
Textarea.__UI_CONTROL_KIND = "textarea";