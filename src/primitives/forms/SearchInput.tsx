// src/primitives/forms/SearchInput.tsx
import React from "react";
import { Search, X } from "lucide-react";
import { Input, type InputProps } from "./Input";
import { InputGroup } from "./InputGroup";
import { InputRightElement } from "./InputRightElement";

export interface SearchInputProps
  extends Omit<InputProps, "type" | "leftPadding" | "rightPadding"> {
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  clearable?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onClear,
      onValueChange,
      clearable = true,
      placeholder = "Buscar…",
      disabled,
      isDisabled,
      style,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(
      defaultValue == null ? "" : String(defaultValue)
    );

    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const finalDisabled = isDisabled ?? disabled ?? false;
    const showClear = clearable && currentValue.length > 0 && !finalDisabled;

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      onClear?.();
      onValueChange?.("");
    };

    return (
      <InputGroup isDisabled={finalDisabled}>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--ui-text-muted)",
            zIndex: 1,
            pointerEvents: "none",
            display: "inline-flex",
          }}
        >
          <Search size={16} />
        </span>

        <Input
          ref={ref}
          type="search"
          value={isControlled ? value : internalValue}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;

            if (!isControlled) {
              setInternalValue(nextValue);
            }

            onValueChange?.(nextValue);
            onChange?.(event);
          }}
          placeholder={placeholder}
          disabled={disabled}
          isDisabled={isDisabled}
          leftPadding="2.35rem"
          rightPadding={showClear ? "2.5rem" : undefined}
          style={style}
          {...rest}
        />

        {showClear ? (
          <InputRightElement>
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={handleClear}
              style={{
                width: 26,
                height: 26,
                borderRadius: "var(--ui-radius-full)",
                border: "1px solid transparent",
                background: "transparent",
                color: "var(--ui-text-muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = "var(--ui-surface-hover)";
                event.currentTarget.style.color = "var(--ui-text)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "transparent";
                event.currentTarget.style.color = "var(--ui-text-muted)";
              }}
            >
              <X size={14} />
            </button>
          </InputRightElement>
        ) : null}
      </InputGroup>
    );
  }
);

SearchInput.displayName = "SearchInput";