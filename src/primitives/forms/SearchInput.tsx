// src/primitives/forms/SearchInput.tsx
import React from "react";
import { Search, X } from "lucide-react";
import {
  defineSlotRecipe,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Input, type InputProps } from "./Input";
import { InputGroup } from "./InputGroup";
import { InputRightElement } from "./InputRightElement";
import { FormControlContext } from "./FormControl";

export type SearchInputSlot =
  | "group"
  | "icon"
  | "input"
  | "rightElement"
  | "clearButton";

export type SearchInputStyles =
  SlotStyleMap<SearchInputSlot>;

export type SearchInputSlotProps =
  SlotPropsMap<SearchInputSlot>;

export interface SearchInputProps
  extends Omit<
    InputProps,
    | "type"
    | "leftPadding"
    | "rightPadding"
    | "styles"
    | "slotProps"
  > {
  onClear?: () => void;

  onValueChange?: (
    value: string
  ) => void;

  clearable?: boolean;

  styles?: SearchInputStyles;
  slotProps?: SearchInputSlotProps;
}

type SearchInputRecipeVariants =
  Record<never, never>;

type SearchInputRecipeState = {
  clearHovered: boolean;
  disabled: boolean;
};

/**
 * La recipe concentra la política visual propia de SearchInput.
 *
 * Input e InputGroup conservan sus respectivas políticas visuales.
 * El valor, el clear y los eventos permanecen fuera de Styling.
 */
const searchInputRecipe =
  defineSlotRecipe<
    SearchInputSlot,
    SearchInputRecipeVariants,
    SearchInputRecipeState
  >({
    base: {
      icon: {
        position: "absolute",

        left: 12,
        top: "50%",

        zIndex: 1,

        display: "inline-flex",

        color:
          "var(--ui-text-muted)",

        pointerEvents: "none",

        transform:
          "translateY(-50%)",
      },

      clearButton: {
        width: 26,
        height: 26,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        padding: 0,

        border:
          "1px solid transparent",

        borderRadius:
          "var(--ui-radius-full)",

        background: "transparent",

        color:
          "var(--ui-text-muted)",

        cursor: "pointer",
      },
    },

    resolve: ({
      clearHovered,
      disabled,
    }) => ({
      clearButton: {
        background:
          clearHovered &&
          !disabled
            ? "var(--ui-surface-hover)"
            : "transparent",

        color:
          clearHovered &&
          !disabled
            ? "var(--ui-text)"
            : "var(--ui-text-muted)",

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled
          ? "var(--ui-state-disabled-opacity, 0.65)"
          : 1,
      },
    }),
  });

export const SearchInput =
  React.forwardRef<
    HTMLInputElement,
    SearchInputProps
  >(
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
        isInvalid,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const ctx =
        React.useContext(
          FormControlContext
        );

      const [
        clearHovered,
        setClearHovered,
      ] =
        React.useState(false);

      const isControlled =
        value !== undefined;

      const [
        internalValue,
        setInternalValue,
      ] = React.useState(
        defaultValue == null
          ? ""
          : String(
              defaultValue
            )
      );

      const currentValue =
        isControlled
          ? String(value ?? "")
          : internalValue;

      const finalDisabled =
        isDisabled ??
        ctx?.isDisabled ??
        disabled ??
        false;

      const finalInvalid =
        isInvalid ??
        ctx?.isInvalid ??
        false;

      const showClear =
        clearable &&
        currentValue.length > 0 &&
        !finalDisabled;

      const recipeStyles =
        searchInputRecipe({
          clearHovered,

          disabled:
            finalDisabled,
        });

      const groupSlot =
        resolveSlot<SearchInputSlot>({
          slot: "group",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-search-input":
              "",

            "data-ui-search-input-disabled":
              finalDisabled ||
              undefined,

            "data-ui-search-input-invalid":
              finalInvalid ||
              undefined,

            "data-ui-search-input-clearable":
              showClear ||
              undefined,
          },

          baseStyle:
            recipeStyles.group,
        });

      const iconSlot =
        resolveSlot<SearchInputSlot>({
          slot: "icon",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,

            "data-ui-search-input-icon":
              "",
          },

          baseStyle:
            recipeStyles.icon,
        });

      const inputSlot =
        resolveSlot<SearchInputSlot>({
          slot: "input",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.input,
        });

      const rightElementSlot =
        resolveSlot<SearchInputSlot>({
          slot: "rightElement",

          styles,
          slotProps,

          baseStyle:
            recipeStyles
              .rightElement,
        });

      const clearButtonSlot =
        resolveSlot<SearchInputSlot>({
          slot: "clearButton",

          styles,
          slotProps,

          baseProps: {
            "data-ui-search-input-clear-button":
              "",
          },

          baseStyle:
            recipeStyles
              .clearButton,
        });

      const handleClear =
        React.useCallback(() => {
          if (
            !isControlled
          ) {
            setInternalValue("");
          }

          onClear?.();
          onValueChange?.("");
        }, [
          isControlled,
          onClear,
          onValueChange,
        ]);

      return (
        <InputGroup
          isInvalid={
            finalInvalid
          }
          isDisabled={
            finalDisabled
          }
          className={
            groupSlot.className
          }
          style={
            groupSlot.style
          }
        >
          <span
            {...iconSlot}
          >
            <Search
              size={16}
            />
          </span>

          <Input
            ref={ref}
            type="search"
            value={
              isControlled
                ? value
                : internalValue
            }
            defaultValue={
              isControlled
                ? undefined
                : defaultValue
            }
            onChange={(
              event
            ) => {
              const nextValue =
                event.currentTarget
                  .value;

              if (
                !isControlled
              ) {
                setInternalValue(
                  nextValue
                );
              }

              onValueChange?.(
                nextValue
              );

              onChange?.(
                event
              );
            }}
            placeholder={
              placeholder
            }
            disabled={
              finalDisabled
            }
            isDisabled={
              finalDisabled
            }
            isInvalid={
              finalInvalid
            }
            leftPadding="2.35rem"
            rightPadding={
              showClear
                ? "2.5rem"
                : undefined
            }
            className={
              inputSlot.className
            }
            style={
              inputSlot.style
            }
            {...rest}
          />

          {showClear ? (
            <InputRightElement
              className={
                rightElementSlot.className
              }
              style={
                rightElementSlot.style
              }
            >
              <button
                {...clearButtonSlot}
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={
                  handleClear
                }
                onMouseEnter={() => {
                  setClearHovered(
                    true
                  );
                }}
                onMouseLeave={() => {
                  setClearHovered(
                    false
                  );
                }}
              >
                <X
                  size={14}
                />
              </button>
            </InputRightElement>
          ) : null}
        </InputGroup>
      );
    }
  );

SearchInput.displayName =
  "SearchInput";