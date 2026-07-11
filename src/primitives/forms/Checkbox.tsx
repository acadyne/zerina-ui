// src/primitives/forms/Checkbox.tsx
import React, {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControlContext } from "./FormControl";

export type CheckboxSlot =
  | "root"
  | "input"
  | "control"
  | "indicator"
  | "label";

export type CheckboxStyles = SlotStyleMap<CheckboxSlot>;

export type CheckboxSlotProps = SlotPropsMap<CheckboxSlot>;

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  indeterminate?: boolean;
  color?: string;
  boxSize?: number;
  radius?: number;
  labelPlacement?: "right" | "left";
  styles?: CheckboxStyles;
  slotProps?: CheckboxSlotProps;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      checked,
      defaultChecked,
      onChange,
      disabled,
      required,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      indeterminate = false,
      color = "var(--ui-primary)",
      boxSize = 16,
      radius = 4,
      labelPlacement = "right",
      className = "",
      style,
      styles,
      slotProps,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const ctx = useContext(FormControlContext);
    const inputId = id ?? ctx?.id ?? `cb-${autoId}`;
    const innerRef = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(
      Boolean(defaultChecked)
    );

    const visualChecked = isControlled ? Boolean(checked) : internalChecked;
    const showMarked = indeterminate || visualChecked;
    const finalDisabled = ctx?.isDisabled ?? disabled ?? false;
    const finalInvalid = ariaInvalid ?? ctx?.isInvalid ?? false;
    const finalRequired = required ?? ctx?.isRequired ?? false;

    const describedBy = [
      ariaDescribedBy,
      ctx?.helpTextId,
      finalInvalid ? ctx?.errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    const WrapperTag = label ? "label" : "div";

    const rootSlot = resolveSlot({
      slot: "root",
      styles,
      slotProps,
      className,
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        cursor: finalDisabled ? "not-allowed" : "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        flexDirection: labelPlacement === "left" ? "row-reverse" : "row",
      },
    });

    const controlSlot = resolveSlot({
      slot: "control",
      styles,
      slotProps,
      baseStyle: {
        position: "relative",
        display: "inline-grid",
        flexShrink: 0,
      },
    });

    const inputSlot = resolveSlot({
      slot: "input",
      styles,
      slotProps,
      baseStyle: {
        appearance: "none",
        WebkitAppearance: "none",
        width: boxSize,
        height: boxSize,
        border: `2px solid ${color}`,
        borderRadius: radius,
        background: showMarked ? color : "transparent",
        transition:
          "background var(--ui-duration-fast) var(--ui-ease-standard), border-color var(--ui-duration-fast) var(--ui-ease-standard), box-shadow var(--ui-duration-fast) var(--ui-ease-standard), opacity var(--ui-duration-fast) var(--ui-ease-standard)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        outline: "none",
        boxShadow: isFocused ? "0 0 0 3px var(--ui-focus-ring)" : "none",
        cursor: finalDisabled ? "not-allowed" : "pointer",
        opacity: finalDisabled ? "var(--ui-state-disabled-opacity, 0.65)" : 1,
      },
    });

    const indicatorSlot = resolveSlot({
      slot: "indicator",
      styles,
      slotProps,
      baseStyle: {
        position: "absolute",
        inset: 3,
        borderRadius: Math.max(2, radius - 2),
        pointerEvents: "none",
        background: showMarked ? "rgba(0,0,0,0.18)" : "transparent",
        display: "grid",
        placeItems: "center",
      },
    });

    const labelSlot = resolveSlot({
      slot: "label",
      styles,
      slotProps,
      baseStyle: {
        fontSize: "0.95rem",
        color: "var(--ui-text)",
        lineHeight: 1.1,
        opacity: finalDisabled ? "var(--ui-state-disabled-opacity, 0.65)" : 1,
      },
    });

    return (
      <WrapperTag
        {...rootSlot}
        {...(label ? { htmlFor: inputId } : {})}
        style={{
          ...rootSlot.style,
          ...style,
        }}
      >
        <span {...controlSlot}>
          <input
            {...inputSlot}
            {...rest}
            id={inputId}
            ref={setRefs}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={finalDisabled}
            required={finalRequired}
            aria-checked={indeterminate ? "mixed" : visualChecked}
            aria-invalid={finalInvalid || undefined}
            aria-describedby={describedBy}
            aria-labelledby={label ? undefined : ctx?.labelId}
            style={inputSlot.style}
            onChange={(e) => {
              if (!isControlled) {
                setInternalChecked(e.currentTarget.checked);
              }

              onChange?.(e);
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
            {indeterminate ? (
              <span
                style={{
                  width: Math.max(6, boxSize - 8),
                  height: 3,
                  borderRadius: 999,
                  background: "#fff",
                  opacity: 0.95,
                }}
              />
            ) : (
              <span
                style={{
                  width: Math.max(5, boxSize - 8),
                  height: Math.max(8, boxSize - 8),
                  borderRight: "3px solid #fff",
                  borderBottom: "3px solid #fff",
                  transform: visualChecked
                    ? "rotate(45deg) scale(1)"
                    : "rotate(45deg) scale(0)",
                  transformOrigin: "center",
                  transition: "transform 0.15s ease-in-out",
                }}
              />
            )}
          </span>
        </span>

        {label ? <span {...labelSlot}>{label}</span> : null}
      </WrapperTag>
    );
  }
);

Checkbox.displayName = "Checkbox";