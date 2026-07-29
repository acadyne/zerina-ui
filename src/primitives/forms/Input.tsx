// src/primitives/forms/Input.tsx
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

type InputSize = "sm" | "md" | "lg";
type InputVariant = "outline" | "unstyled";

export type InputSlot = "root";

export type InputStyles = SlotStyleMap<InputSlot>;

export type InputSlotProps = SlotPropsMap<InputSlot>;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    SpaceProps {
  className?: string;
  style?: React.CSSProperties;

  size?: InputSize;
  variant?: InputVariant;
  invalid?: boolean;
  leftPadding?: number | string;
  rightPadding?: number | string;
  fullWidth?: boolean;

  styles?: InputStyles;
  slotProps?: InputSlotProps;
}

type InputComponent = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
> & {
  __UI_CONTROL_KIND?: "input";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
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

    const rootSlot = resolveSlot<InputSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        width: fullWidth ? "100%" : undefined,
        minWidth: fullWidth ? 0 : undefined,
        appearance: "none",
        WebkitAppearance: "none",

        ...controlStyles,

        paddingTop: pt ?? py ?? p ?? sizeStyles.paddingY,
        paddingBottom: pb ?? py ?? p ?? sizeStyles.paddingY,
        paddingLeft: leftPadding ?? pl ?? px ?? p ?? sizeStyles.paddingX,
        paddingRight: rightPadding ?? pr ?? px ?? p ?? sizeStyles.paddingX,

        marginTop: spacingStyles.marginTop,
        marginBottom: spacingStyles.marginBottom,
        marginLeft: spacingStyles.marginLeft,
        marginRight: spacingStyles.marginRight,
      },
    });

    return (
      <input
        {...rootSlot}
        ref={ref}
        id={fieldControl.id}
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
        data-ui="input"
      />
    );
  }
) as InputComponent;

Input.displayName = "Input";
Input.__UI_CONTROL_KIND = "input";