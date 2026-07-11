// src/primitives/forms/Radio.tsx
import React, { forwardRef, useContext, useId, useState } from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { useRadioGroupContext } from "./RadioGroup";
import { FormControlContext } from "./FormControl";

export type RadioSlot =
  | "root"
  | "input"
  | "control"
  | "indicator"
  | "indicatorDot"
  | "label";

export type RadioStyles = SlotStyleMap<RadioSlot>;

export type RadioSlotProps = SlotPropsMap<RadioSlot>;

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  color?: string;
  boxSize?: number;
  labelPlacement?: "right" | "left";
  styles?: RadioStyles;
  slotProps?: RadioSlotProps;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id,
      label,
      value,
      checked,
      defaultChecked,
      onChange,
      disabled,
      required,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      color = "var(--ui-primary)",
      boxSize = 16,
      labelPlacement = "right",
      className = "",
      style,
      styles,
      slotProps,
      onFocus,
      onBlur,
      name,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const group = useRadioGroupContext();
    const ctx = useContext(FormControlContext);
    const inputId = id ?? ctx?.id ?? `radio-${autoId}`;
    const [isFocused, setIsFocused] = useState(false);

    const resolvedName = group?.name ?? name;
    const resolvedDisabled = group?.isDisabled ?? ctx?.isDisabled ?? disabled ?? false;
    const finalInvalid = ariaInvalid ?? ctx?.isInvalid ?? false;
    const finalRequired = required ?? ctx?.isRequired ?? false;

    const describedBy = [
      ariaDescribedBy,
      ctx?.helpTextId,
      finalInvalid ? ctx?.errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    const resolvedChecked =
      checked !== undefined
        ? checked
        : group?.value !== undefined && value !== undefined
          ? group.value === String(value)
          : undefined;

    const visualChecked =
      resolvedChecked !== undefined ? resolvedChecked : Boolean(defaultChecked);

    const WrapperTag = label ? "label" : "div";

    const rootSlot = resolveSlot<RadioSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        cursor: resolvedDisabled ? "not-allowed" : "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        flexDirection: labelPlacement === "left" ? "row-reverse" : "row",
      },
    });

    const controlSlot = resolveSlot<RadioSlot>({
      slot: "control",
      styles,
      slotProps,
      baseStyle: {
        position: "relative",
        display: "inline-grid",
        flexShrink: 0,
      },
    });

    const inputSlot = resolveSlot<RadioSlot>({
      slot: "input",
      styles,
      slotProps,
      baseStyle: {
        appearance: "none",
        WebkitAppearance: "none",
        width: boxSize,
        height: boxSize,
        border: `2px solid ${color}`,
        borderRadius: "50%",
        background: "transparent",
        transition:
          "border-color var(--ui-duration-fast) var(--ui-ease-standard), box-shadow var(--ui-duration-fast) var(--ui-ease-standard), opacity var(--ui-duration-fast) var(--ui-ease-standard)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        outline: "none",
        boxShadow: isFocused ? "0 0 0 3px var(--ui-focus-ring)" : "none",
        cursor: resolvedDisabled ? "not-allowed" : "pointer",
        opacity: resolvedDisabled
          ? "var(--ui-state-disabled-opacity, 0.65)"
          : 1,
      },
    });

    const indicatorSlot = resolveSlot<RadioSlot>({
      slot: "indicator",
      styles,
      slotProps,
      baseStyle: {
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      },
    });

    const indicatorDotSlot = resolveSlot<RadioSlot>({
      slot: "indicatorDot",
      styles,
      slotProps,
      baseStyle: {
        width: Math.max(6, boxSize - 8),
        height: Math.max(6, boxSize - 8),
        borderRadius: "50%",
        background: color,
        transform: visualChecked ? "scale(1)" : "scale(0)",
        transition: "transform 0.15s ease-in-out",
      },
    });

    const labelSlot = resolveSlot<RadioSlot>({
      slot: "label",
      styles,
      slotProps,
      baseStyle: {
        fontSize: "0.95rem",
        color: "var(--ui-text)",
        lineHeight: 1.1,
        opacity: resolvedDisabled
          ? "var(--ui-state-disabled-opacity, 0.65)"
          : 1,
      },
    });

    return (
      <WrapperTag
        {...rootSlot}
        {...(label ? { htmlFor: inputId } : {})}
      >
        <span {...controlSlot}>
          <input
            {...inputSlot}
            {...rest}
            ref={ref}
            id={inputId}
            type="radio"
            name={resolvedName}
            value={value}
            checked={resolvedChecked}
            defaultChecked={defaultChecked}
            disabled={resolvedDisabled}
            required={finalRequired}
            aria-invalid={finalInvalid || undefined}
            aria-describedby={describedBy}
            aria-labelledby={label ? undefined : ctx?.labelId}
            onChange={(e) => {
              onChange?.(e);

              if (group?.onChange && e.currentTarget.value !== undefined) {
                group.onChange(e.currentTarget.value);
              }
            }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
          />

          <span {...indicatorSlot}>
            <span {...indicatorDotSlot} />
          </span>
        </span>

        {label ? <span {...labelSlot}>{label}</span> : null}
      </WrapperTag>
    );
  }
);

Radio.displayName = "Radio";