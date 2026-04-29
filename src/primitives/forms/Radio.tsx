// src/primitives/forms/Radio.tsx
import React, { forwardRef, useId } from "react";
import { useRadioGroupContext } from "./RadioGroup";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  color?: string;
  boxSize?: number;
  labelPlacement?: "right" | "left";
  wrapperStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
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
      color = "var(--ui-primary)",
      boxSize = 16,
      labelPlacement = "right",
      className = "",
      style,
      wrapperStyle,
      labelStyle,
      onFocus,
      onBlur,
      name,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `radio-${autoId}`;
    const group = useRadioGroupContext();

    const resolvedName = group?.name ?? name;
    const resolvedDisabled = group?.isDisabled ?? disabled ?? false;

    const resolvedChecked =
      checked !== undefined
        ? checked
        : group?.value !== undefined && value !== undefined
          ? group.value === String(value)
          : undefined;

    const visualChecked =
      resolvedChecked !== undefined ? resolvedChecked : Boolean(defaultChecked);

    const WrapperTag = label ? "label" : "div";

    return (
      <WrapperTag
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.55rem",
          cursor: resolvedDisabled ? "not-allowed" : "pointer",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          flexDirection: labelPlacement === "left" ? "row-reverse" : "row",
          ...wrapperStyle,
        }}
        {...(label ? { htmlFor: inputId } : {})}
      >
        <span style={{ position: "relative", display: "inline-grid" }}>
          <input
            ref={ref}
            id={inputId}
            type="radio"
            name={resolvedName}
            value={value}
            checked={resolvedChecked}
            defaultChecked={defaultChecked}
            disabled={resolvedDisabled}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              width: boxSize,
              height: boxSize,
              border: `2px solid ${color}`,
              borderRadius: "50%",
              backgroundColor: "transparent",
              transition:
                "border-color var(--ui-duration-fast) var(--ui-ease-standard), box-shadow var(--ui-duration-fast) var(--ui-ease-standard), opacity var(--ui-duration-fast) var(--ui-ease-standard)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              outline: "none",
              boxShadow: "none",
              cursor: resolvedDisabled ? "not-allowed" : "pointer",
              opacity: resolvedDisabled
                ? "var(--ui-state-disabled-opacity, 0.65)"
                : 1,
              ...style,
            }}
            onChange={(e) => {
              onChange?.(e);

              if (group?.onChange && e.currentTarget.value !== undefined) {
                group.onChange(e.currentTarget.value);
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--ui-focus-ring)";
              onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
              onBlur?.(e);
            }}
            {...rest}
          />

          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                width: Math.max(6, boxSize - 8),
                height: Math.max(6, boxSize - 8),
                borderRadius: "50%",
                background: color,
                transform: visualChecked ? "scale(1)" : "scale(0)",
                transition: "transform 0.15s ease-in-out",
              }}
            />
          </span>
        </span>

        {label ? (
          <span
            style={{
              fontSize: "0.95rem",
              color: "var(--ui-text)",
              lineHeight: 1.1,
              opacity: resolvedDisabled
                ? "var(--ui-state-disabled-opacity, 0.65)"
                : 1,
              ...labelStyle,
            }}
          >
            {label}
          </span>
        ) : null}
      </WrapperTag>
    );
  }
);

Radio.displayName = "Radio";