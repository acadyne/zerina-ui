// src/primitives/forms/Input.tsx
import React, { forwardRef, useContext, useMemo, useState } from "react";
import { FormControlContext } from "./FormControl";
import {
  getControlBaseStyles,
  getControlDataAttributes,
  getControlSizeStyles,
  getSpacingStyles,
  type SpaceProps,
} from "../../helpers";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "outline" | "unstyled";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    SpaceProps {
  className?: string;
  style?: React.CSSProperties;

  size?: InputSize;
  variant?: InputVariant;
  isInvalid?: boolean;
  isDisabled?: boolean;
  leftPadding?: number | string;
  rightPadding?: number | string;
  fullWidth?: boolean;
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
      isInvalid,
      isDisabled,
      leftPadding,
      rightPadding,
      type = "text",
      id,
      disabled,
      fullWidth = true,
      onFocus,
      onBlur,
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

      ...props
    },
    ref
  ) => {
    const ctx = useContext(FormControlContext);
    const [isFocused, setIsFocused] = useState(false);

    const finalId = id ?? ctx?.id;
    const finalInvalid = isInvalid ?? ctx?.isInvalid ?? false;
    const finalDisabled = isDisabled ?? ctx?.isDisabled ?? disabled ?? false;

    const describedBy = useMemo(() => {
      const ids = new Set<string>();

      if (ariaDescribedBy) {
        ariaDescribedBy
          .split(" ")
          .map((value) => value.trim())
          .filter(Boolean)
          .forEach((value) => ids.add(value));
      }

      if (finalInvalid && ctx?.errorId) {
        ids.add(ctx.errorId);
      }

      return ids.size > 0 ? Array.from(ids).join(" ") : undefined;
    }, [ariaDescribedBy, finalInvalid, ctx?.errorId]);

    const sizeStyles = getControlSizeStyles(size);
    const controlStyles = getControlBaseStyles(size, variant, {
      invalid: finalInvalid,
      disabled: finalDisabled,
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

    return (
      <input
        ref={ref}
        id={finalId}
        type={type}
        className={className}
        disabled={finalDisabled}
        aria-invalid={finalInvalid || undefined}
        aria-labelledby={ctx?.labelId}
        aria-describedby={describedBy}
        {...getControlDataAttributes({
          focused: isFocused,
          invalid: finalInvalid,
          disabled: finalDisabled,
        })}
        style={{
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

          ...style,
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        {...props}
      />
    );
  }
) as InputComponent;

Input.displayName = "Input";
Input.__UI_CONTROL_KIND = "input";