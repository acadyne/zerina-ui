// src/primitives/forms/Checkbox.tsx
import React, {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  indeterminate?: boolean;
  color?: string;
  boxSize?: number;
  radius?: number;
  labelPlacement?: "right" | "left";
  wrapperStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
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
      indeterminate = false,
      color = "var(--ui-primary)",
      boxSize = 16,
      radius = 4,
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
    const inputId = id ?? `cb-${autoId}`;
    const innerRef = useRef<HTMLInputElement | null>(null);

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));

    const visualChecked = isControlled ? Boolean(checked) : internalChecked;
    const showMarked = indeterminate || visualChecked;

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

    const wrapperBase: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.55rem",
      cursor: disabled ? "not-allowed" : "pointer",
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
      ...wrapperStyle,
    };

    const inputBase: React.CSSProperties = {
      appearance: "none",
      WebkitAppearance: "none",
      width: boxSize,
      height: boxSize,
      border: `2px solid ${color}`,
      borderRadius: radius,
      backgroundColor: showMarked ? color : "transparent",
      transition:
        "background-color var(--ui-duration-fast) var(--ui-ease-standard), border-color var(--ui-duration-fast) var(--ui-ease-standard), box-shadow var(--ui-duration-fast) var(--ui-ease-standard), opacity var(--ui-duration-fast) var(--ui-ease-standard)",
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      outline: "none",
      boxShadow: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? "var(--ui-state-disabled-opacity, 0.65)" : 1,
      ...style,
    };

    const textStyle: React.CSSProperties = {
      fontSize: "0.95rem",
      color: "var(--ui-text)",
      lineHeight: 1.1,
      opacity: disabled ? "var(--ui-state-disabled-opacity, 0.65)" : 1,
      ...labelStyle,
    };

    return (
      <WrapperTag
        className={className}
        style={{
          ...wrapperBase,
          flexDirection: labelPlacement === "left" ? "row-reverse" : "row",
        }}
        {...(label ? { htmlFor: inputId } : {})}
      >
        <span style={{ position: "relative", display: "inline-grid" }}>
          <input
            id={inputId}
            ref={setRefs}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-checked={indeterminate ? "mixed" : visualChecked}
            style={inputBase}
            onChange={(e) => {
              if (!isControlled) {
                setInternalChecked(e.currentTarget.checked);
              }
              onChange?.(e);
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
              inset: 3,
              borderRadius: Math.max(2, radius - 2),
              pointerEvents: "none",
              backgroundColor: showMarked ? "rgba(0,0,0,0.18)" : "transparent",
              display: "grid",
              placeItems: "center",
            }}
          >
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

        {label ? <span style={textStyle}>{label}</span> : null}
      </WrapperTag>
    );
  }
);

Checkbox.displayName = "Checkbox";