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
  defineSlotRecipe,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControlContext } from "./FormControl";
import { setRef } from "../../core/interaction/events";

export type CheckboxSlot =
  | "root"
  | "input"
  | "control"
  | "indicator"
  | "mark"
  | "label";

export type CheckboxStyles =
  SlotStyleMap<CheckboxSlot>;

export type CheckboxSlotProps =
  SlotPropsMap<CheckboxSlot>;

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  label?: React.ReactNode;
  indeterminate?: boolean;
  color?: string;
  boxSize?: number;
  radius?: number;

  labelPlacement?:
  | "right"
  | "left";

  styles?: CheckboxStyles;
  slotProps?: CheckboxSlotProps;
}

type CheckboxRecipeVariants = {
  labelPlacement:
  | "right"
  | "left";

  markKind:
  | "checked"
  | "indeterminate";
};

type CheckboxRecipeState = {
  color: string;
  boxSize: number;
  radius: number;

  checked: boolean;
  marked: boolean;
  focused: boolean;
  disabled: boolean;
};

/**
 * La recipe concentra la política visual del Checkbox.
 *
 * El estado funcional del input, su propiedad indeterminate,
 * la integración con FormControl y los eventos nativos
 * permanecen fuera de Styling.
 */
const checkboxRecipe =
  defineSlotRecipe<
    CheckboxSlot,
    CheckboxRecipeVariants,
    CheckboxRecipeState
  >({
    base: {
      root: {
        display: "inline-flex",
        alignItems: "center",

        gap: "0.55rem",

        userSelect: "none",

        WebkitTapHighlightColor:
          "transparent",
      },

      control: {
        position: "relative",

        display: "inline-grid",

        flexShrink: 0,
      },

      input: {
        appearance: "none",
        WebkitAppearance: "none",

        display: "grid",
        placeItems: "center",

        flexShrink: 0,

        outline: "none",

        transition:
          "background var(--ui-duration-fast) var(--ui-ease-standard), " +
          "border-color var(--ui-duration-fast) var(--ui-ease-standard), " +
          "box-shadow var(--ui-duration-fast) var(--ui-ease-standard), " +
          "opacity var(--ui-duration-fast) var(--ui-ease-standard)",
      },

      indicator: {
        position: "absolute",

        pointerEvents: "none",

        display: "grid",
        placeItems: "center",
      },

      mark: {
        background: "#fff",

        transformOrigin: "center",
      },

      label: {
        fontSize: "0.95rem",

        color:
          "var(--ui-text)",

        lineHeight: 1.1,
      },
    },

    variants: {
      labelPlacement: {
        right: {
          root: {
            flexDirection: "row",
          },
        },

        left: {
          root: {
            flexDirection:
              "row-reverse",
          },
        },
      },

      markKind: {
        indeterminate: {
          mark: {
            height: 3,

            borderRadius:
              "var(--ui-radius-full)",

            opacity: 0.95,
          },
        },

        checked: {
          mark: {
            borderRight:
              "3px solid #fff",

            borderBottom:
              "3px solid #fff",

            transform:
              "rotate(45deg)",

            transition:
              "transform 0.15s ease-in-out",
          },
        },
      },
    },

    resolve: ({
      color,
      boxSize,
      radius,
      checked,
      marked,
      focused,
      disabled,
      markKind,
    }) => ({
      root: {
        cursor: disabled
          ? "not-allowed"
          : "pointer",
      },

      input: {
        width: boxSize,
        height: boxSize,

        border:
          `2px solid ${color}`,

        borderRadius: radius,

        background: marked
          ? color
          : "transparent",

        boxShadow: focused
          ? "0 0 0 3px var(--ui-focus-ring)"
          : "none",

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled
          ? "var(--ui-state-disabled-opacity, 0.65)"
          : 1,
      },

      indicator: {
        inset: 3,

        borderRadius:
          Math.max(
            2,
            radius - 2
          ),

        background: marked
          ? "rgba(0,0,0,0.18)"
          : "transparent",
      },

      mark:
        markKind ===
          "indeterminate"
          ? {
            width:
              Math.max(
                6,
                boxSize - 8
              ),
          }
          : {
            width:
              Math.max(
                5,
                boxSize - 8
              ),

            height:
              Math.max(
                8,
                boxSize - 8
              ),

            transform: checked
              ? "rotate(45deg) scale(1)"
              : "rotate(45deg) scale(0)",
          },

      label: {
        opacity: disabled
          ? "var(--ui-state-disabled-opacity, 0.65)"
          : 1,
      },
    }),
  });

export const Checkbox =
  forwardRef<
    HTMLInputElement,
    CheckboxProps
  >(
    (
      {
        id,
        label,

        checked,
        defaultChecked,
        onChange,

        disabled,
        required,

        "aria-describedby":
        ariaDescribedBy,

        "aria-invalid":
        ariaInvalid,

        indeterminate = false,

        color =
        "var(--ui-primary)",

        boxSize = 16,
        radius = 4,

        labelPlacement =
        "right",

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

      const ctx =
        useContext(
          FormControlContext
        );

      const inputId =
        id ??
        ctx?.id ??
        `cb-${autoId}`;

      const innerRef =
        useRef<HTMLInputElement | null>(
          null
        );

      const [
        isFocused,
        setIsFocused,
      ] = useState(false);

      const isControlled =
        checked !== undefined;

      const [
        internalChecked,
        setInternalChecked,
      ] = useState(
        Boolean(defaultChecked)
      );

      const visualChecked =
        isControlled
          ? Boolean(checked)
          : internalChecked;

      const showMarked =
        indeterminate ||
        visualChecked;

      const finalDisabled =
        ctx?.isDisabled ??
        disabled ??
        false;

      const finalInvalid =
        ariaInvalid ??
        ctx?.isInvalid ??
        false;

      const finalRequired =
        required ??
        ctx?.isRequired ??
        false;

      const describedBy =
        [
          ariaDescribedBy,
          ctx?.helpTextId,

          finalInvalid
            ? ctx?.errorId
            : undefined,
        ]
          .filter(Boolean)
          .join(" ") ||
        undefined;

      useEffect(() => {
        if (
          innerRef.current
        ) {
          innerRef.current.indeterminate =
            Boolean(
              indeterminate
            );
        }
      }, [indeterminate]);

      const setRefs = React.useCallback(
        (
          node:
            | HTMLInputElement
            | null
        ) => {
          innerRef.current = node;
          setRef(ref, node);
        },
        [ref]
      );

      const WrapperTag =
        label
          ? "label"
          : "div";

      const recipeStyles =
        checkboxRecipe({
          labelPlacement,

          markKind:
            indeterminate
              ? "indeterminate"
              : "checked",

          color,
          boxSize,
          radius,

          checked:
            visualChecked,

          marked:
            showMarked,

          focused:
            isFocused,

          disabled:
            finalDisabled,
        });

      const rootSlot =
        resolveSlot<CheckboxSlot>({
          slot: "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-checkbox":
              "",

            "data-ui-checkbox-checked":
              visualChecked ||
              undefined,

            "data-ui-checkbox-indeterminate":
              indeterminate ||
              undefined,

            "data-ui-checkbox-disabled":
              finalDisabled ||
              undefined,

            "data-ui-checkbox-invalid":
              finalInvalid ||
              undefined,

            "data-ui-checkbox-focused":
              isFocused ||
              undefined,
          },

          baseStyle:
            recipeStyles.root,
        });

      const controlSlot =
        resolveSlot<CheckboxSlot>({
          slot: "control",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.control,
        });

      const inputSlot =
        resolveSlot<CheckboxSlot>({
          slot: "input",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.input,
        });

      const indicatorSlot =
        resolveSlot<CheckboxSlot>({
          slot: "indicator",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,
          },

          baseStyle:
            recipeStyles.indicator,
        });

      const markSlot =
        resolveSlot<CheckboxSlot>({
          slot: "mark",

          styles,
          slotProps,

          baseProps: {
            "data-ui-checkbox-mark":
              indeterminate
                ? "indeterminate"
                : "checked",
          },

          baseStyle:
            recipeStyles.mark,
        });

      const labelSlot =
        resolveSlot<CheckboxSlot>({
          slot: "label",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.label,
        });

      return (
        <WrapperTag
          {...rootSlot}
          {...(
            label
              ? {
                htmlFor:
                  inputId,
              }
              : {}
          )}
        >
          <span
            {...controlSlot}
          >
            <input
              {...inputSlot}
              {...rest}
              id={inputId}
              ref={setRefs}
              type="checkbox"
              checked={checked}
              defaultChecked={
                defaultChecked
              }
              disabled={
                finalDisabled
              }
              required={
                finalRequired
              }
              aria-checked={
                indeterminate
                  ? "mixed"
                  : visualChecked
              }
              aria-invalid={
                finalInvalid ||
                undefined
              }
              aria-describedby={
                describedBy
              }
              aria-labelledby={
                label
                  ? undefined
                  : ctx?.labelId
              }
              onChange={(
                event
              ) => {
                if (
                  !isControlled
                ) {
                  setInternalChecked(
                    event
                      .currentTarget
                      .checked
                  );
                }

                onChange?.(
                  event
                );
              }}
              onFocus={(
                event
              ) => {
                setIsFocused(
                  true
                );

                onFocus?.(
                  event
                );
              }}
              onBlur={(
                event
              ) => {
                setIsFocused(
                  false
                );

                onBlur?.(
                  event
                );
              }}
            />

            <span
              {...indicatorSlot}
            >
              <span
                {...markSlot}
              />
            </span>
          </span>

          {label ? (
            <span
              {...labelSlot}
            >
              {label}
            </span>
          ) : null}
        </WrapperTag>
      );
    }
  );

Checkbox.displayName =
  "Checkbox";