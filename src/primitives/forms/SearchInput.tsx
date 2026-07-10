// src/primitives/forms/SearchInput.tsx
import React from "react";
import { Search, X } from "lucide-react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Input, type InputProps } from "./Input";
import { InputGroup } from "./InputGroup";
import { InputRightElement } from "./InputRightElement";

export type SearchInputSlot =
  | "group"
  | "icon"
  | "input"
  | "rightElement"
  | "clearButton";

export type SearchInputStyles = SlotStyleMap<SearchInputSlot>;

export type SearchInputSlotProps = SlotPropsMap<SearchInputSlot>;

export interface SearchInputProps
  extends Omit<
    InputProps,
    "type" | "leftPadding" | "rightPadding" | "styles" | "slotProps"
  > {
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  clearable?: boolean;

  styles?: SearchInputStyles;
  slotProps?: SearchInputSlotProps;
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
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const [clearHovered, setClearHovered] = React.useState(false);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(
      defaultValue == null ? "" : String(defaultValue)
    );

    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const finalDisabled = isDisabled ?? disabled ?? false;
    const showClear = clearable && currentValue.length > 0 && !finalDisabled;

    const groupSlot = resolveSlot<SearchInputSlot>({
      slot: "group",
      styles,
      slotProps,
      className,
      style,
    });

    const iconSlot = resolveSlot<SearchInputSlot>({
      slot: "icon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--ui-text-muted)",
        zIndex: 1,
        pointerEvents: "none",
        display: "inline-flex",
      },
    });

    const inputSlot = resolveSlot<SearchInputSlot>({
      slot: "input",
      styles,
      slotProps,
    });

    const rightElementSlot = resolveSlot<SearchInputSlot>({
      slot: "rightElement",
      styles,
      slotProps,
    });

    const clearButtonSlot = resolveSlot<SearchInputSlot>({
      slot: "clearButton",
      styles,
      slotProps,
      baseStyle: {
        width: 26,
        height: 26,
        borderRadius: "var(--ui-radius-full)",
        border: "1px solid transparent",
        background: clearHovered ? "var(--ui-surface-hover)" : "transparent",
        color: clearHovered ? "var(--ui-text)" : "var(--ui-text-muted)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 0,
      },
    });

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      onClear?.();
      onValueChange?.("");
    };

    return (
      <InputGroup
        isDisabled={finalDisabled}
        className={groupSlot.className}
        style={groupSlot.style}
      >
        <span {...iconSlot}>
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
          className={inputSlot.className}
          style={inputSlot.style}
          {...rest}
        />

        {showClear ? (
          <InputRightElement
            className={rightElementSlot.className}
            style={rightElementSlot.style}
          >
            <button
              {...clearButtonSlot}
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={handleClear}
              onMouseEnter={() => {
                setClearHovered(true);
              }}
              onMouseLeave={() => {
                setClearHovered(false);
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