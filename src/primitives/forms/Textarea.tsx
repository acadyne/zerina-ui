// src/primitives/forms/Textarea.tsx
import React, { forwardRef, useContext, useMemo, useState } from "react";
import { FormControlContext } from "./FormControl";
import {
  getControlBaseStyles,
  getControlDataAttributes,
  getControlSizeStyles,
  getSpacingStyles,
  type SpaceProps,
} from "../../helpers";

type TextareaSize = "sm" | "md" | "lg";
type TextareaVariant = "outline" | "unstyled";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    SpaceProps {
  className?: string;
  style?: React.CSSProperties;

  size?: TextareaSize;
  variant?: TextareaVariant;
  isInvalid?: boolean;
  isDisabled?: boolean;
  resize?: React.CSSProperties["resize"];
  fullWidth?: boolean;
  rightPadding?: number | string;
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
      isInvalid,
      isDisabled,
      resize = "vertical",
      id,
      disabled,
      fullWidth = true,
      rightPadding,
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
      <textarea
        ref={ref}
        id={finalId}
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
) as TextareaComponent;

Textarea.displayName = "Textarea";
Textarea.__UI_CONTROL_KIND = "textarea";