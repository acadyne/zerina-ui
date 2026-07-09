// src/primitives/forms/Switch.tsx
import React, { forwardRef, useId, useState } from "react";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  labelPlacement?: "right" | "left";
  size?: "sm" | "md" | "lg";
  color?: string;
  wrapperStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

const sizeMap = {
  sm: { trackW: 34, trackH: 20, knob: 14, offset: 3 },
  md: { trackW: 42, trackH: 24, knob: 18, offset: 3 },
  lg: { trackW: 52, trackH: 30, knob: 22, offset: 4 },
} as const;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      label,
      checked,
      defaultChecked,
      onChange,
      disabled,
      size = "md",
      color = "var(--ui-primary)",
      labelPlacement = "right",
      className = "",
      style,
      wrapperStyle,
      labelStyle,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `sw-${autoId}`;
    const s = sizeMap[size];

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(
      Boolean(defaultChecked)
    );
    const isOn = isControlled ? Boolean(checked) : internalChecked;

    const WrapperTag = label ? "label" : "div";

    return (
      <WrapperTag
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          flexDirection: labelPlacement === "left" ? "row-reverse" : "row",
          ...wrapperStyle,
        }}
        {...(label ? { htmlFor: inputId } : {})}
      >
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            width: s.trackW,
            height: s.trackH,
            flexShrink: 0,
          }}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              margin: 0,
              cursor: disabled ? "not-allowed" : "pointer",
              zIndex: 1,
            }}
            onChange={(e) => {
              if (!isControlled) {
                setInternalChecked(e.currentTarget.checked);
              }
              onChange?.(e);
            }}
            onFocus={(e) => {
              const track = e.currentTarget.nextElementSibling as
                | HTMLSpanElement
                | null;
              if (track) {
                track.style.boxShadow = "0 0 0 3px var(--ui-focus-ring)";
              }
              onFocus?.(e);
            }}
            onBlur={(e) => {
              const track = e.currentTarget.nextElementSibling as
                | HTMLSpanElement
                | null;
              if (track) {
                track.style.boxShadow = "none";
              }
              onBlur?.(e);
            }}
            {...rest}
          />

          <span
            aria-hidden="true"
            style={{
              width: s.trackW,
              height: s.trackH,
              borderRadius: 9999,
              background: isOn ? color : "var(--ui-surface-3)",
              border: `1px solid ${isOn ? color : "var(--ui-border)"}`,
              transition:
                "background var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard)",
              boxShadow: "none",
              display: "inline-flex",
              alignItems: "center",
              padding: 0,
              opacity: disabled ? "var(--ui-state-disabled-opacity, 0.65)" : 1,
              pointerEvents: "none",
              ...style,
            }}
          >
            <span
              style={{
                width: s.knob,
                height: s.knob,
                borderRadius: 9999,
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                transform: `translateX(${
                  isOn ? s.trackW - s.knob - s.offset : s.offset
                }px)`,
                transition:
                  "transform var(--ui-duration-normal) var(--ui-ease-standard)",
                pointerEvents: "none",
              }}
            />
          </span>
        </span>

        {label ? (
          <span
            style={{
              fontSize: "0.95rem",
              color: "var(--ui-text)",
              lineHeight: 1.15,
              opacity: disabled ? "var(--ui-state-disabled-opacity, 0.65)" : 1,
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

Switch.displayName = "Switch";