// src/primitives/forms/Select.tsx
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

  invalid?: boolean;
  readOnly?: boolean;
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
      indicatorOffset = 10,
      id,
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

    const hasPlaceholder =
      placeholder !== undefined;

    const sizeStyles = getControlSizeStyles(size);
    const controlStyles = getControlBaseStyles(size, variant, {
      invalid: fieldControl.invalid,
      disabled: fieldControl.disabled,
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
        opacity: fieldControl.disabled ? 0.55 : 0.8,
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
          id={fieldControl.id}
          value={value}

          onChange={(event) => {
            if (
              fieldControl.readOnly
            ) {
              event.preventDefault();
              return;
            }

            onChange(event);
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
          data-ui="select"
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