// src/primitives/forms/Select.tsx
import React, { forwardRef, useContext, useMemo, useState } from "react";
import { FormControlContext } from "./FormControl";
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

export interface Option {
  label: string;
  value: string;
}

type SelectSize = "sm" | "md" | "lg";
type SelectVariant = "outline" | "unstyled";

export type SelectSlot = "root" | "control" | "indicator";

export type SelectStyles = SlotStyleMap<SelectSlot>;

export type SelectSlotProps = SlotPropsMap<SelectSlot>;

export interface SelectProps
  extends Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      "value" | "onChange" | "size" | "style" | "className"
    >,
    SpaceProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  options?: Option[];
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  error?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  rounded?: React.CSSProperties["borderRadius"];
  minW?: React.CSSProperties["minWidth"];
  size?: SelectSize;
  variant?: SelectVariant;
  fullWidth?: boolean;
  placeholder?: string;
  rightPadding?: number | string;
  indicatorOffset?: number | string;

  styles?: SelectStyles;
  slotProps?: SelectSlotProps;
}

type SelectComponent = React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<HTMLSelectElement>
> & {
  __UI_CONTROL_KIND?: "select";
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value,
      onChange,
      options,
      children,
      className = "",
      style,
      error,
      isInvalid,
      isDisabled,
      rounded,
      minW,
      size = "md",
      variant = "outline",
      fullWidth = true,
      disabled = false,
      placeholder,
      rightPadding,
      indicatorOffset = 10,
      id,
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

      styles,
      slotProps,

      ...props
    },
    ref
  ) => {
    const ctx = useContext(FormControlContext);
    const [isFocused, setIsFocused] = useState(false);

    const finalId = id ?? ctx?.id;
    const finalInvalid = isInvalid ?? error ?? ctx?.isInvalid ?? false;
    const finalDisabled = isDisabled ?? ctx?.isDisabled ?? disabled ?? false;
    const hasPlaceholder = placeholder !== undefined;

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

    const rootSlot = resolveSlot<SelectSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        position: "relative",
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : undefined,
        minWidth: fullWidth ? 0 : minW,
        maxWidth: "100%",

        ...getSpacingStyles({
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
        }),
      },
    });

    const controlSlot = resolveSlot<SelectSlot>({
      slot: "control",
      styles,
      slotProps,
      baseStyle: {
        width: fullWidth ? "100%" : undefined,
        minWidth: fullWidth ? 0 : minW,
        maxWidth: "100%",
        lineHeight: 1.2,
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",

        ...controlStyles,
        borderRadius: rounded ?? sizeStyles.borderRadius,
        paddingRight: rightPadding ?? "2.2rem",
      },
    });

    const indicatorSlot = resolveSlot<SelectSlot>({
      slot: "indicator",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        position: "absolute",
        right: indicatorOffset,
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        opacity: finalDisabled ? 0.55 : 0.8,
        fontSize: 12,
        color: "var(--ui-text-muted)",
        lineHeight: 1,
      },
    });

    return (
      <div {...rootSlot}>
        <select
          {...controlSlot}
          ref={ref}
          id={finalId}
          value={value}
          onChange={onChange}
          disabled={finalDisabled}
          aria-invalid={finalInvalid || undefined}
          aria-labelledby={ctx?.labelId}
          aria-describedby={describedBy}
          {...getControlDataAttributes({
            focused: isFocused,
            invalid: finalInvalid,
            disabled: finalDisabled,
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
        >
          {hasPlaceholder ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}

          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <span {...indicatorSlot}>▼</span>
      </div>
    );
  }
) as SelectComponent;

Select.displayName = "Select";
Select.__UI_CONTROL_KIND = "select";