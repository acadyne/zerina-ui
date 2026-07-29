// src/primitives/forms/Checkbox.tsx
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  defineSlotRecipe,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import {
  useFieldControl,
} from "./use-field-control";
import { setRef } from "../../core/interaction/events";
import {
  useFocusVisible,
} from "../../core/interaction/focus";

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
  invalid?: boolean;
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
  focusVisible: boolean;
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
        display: "block",

        background:
          "var(--ui-primary-contrast)",

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
            background:
              "transparent",

            borderRight:
              "3px solid var(--ui-primary-contrast)",

            borderBottom:
              "3px solid var(--ui-primary-contrast)",

            transform:
              "rotate(45deg)",

            transition:
              "transform var(--ui-duration-normal) var(--ui-ease-standard)",
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
      focusVisible,
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
          ? `color-mix(in srgb, ${color} 22%, transparent)`
          : "transparent",

        boxShadow:
          focusVisible
            ? "0 0 0 var(--ui-interaction-focus-ring-offset) var(--ui-surface), 0 0 0 calc(var(--ui-interaction-focus-ring-offset) + var(--ui-interaction-focus-ring-width)) var(--ui-interaction-focus-ring-color)"
            : "none",

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled
          ? "var(--ui-interaction-disabled-opacity)"
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
          ? `color-mix(in srgb, ${color} 22%, transparent)`
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
                4,
                boxSize - 10
              ),

            height:
              Math.max(
                7,
                boxSize - 8
              ),

            transform: checked
              ? "translateY(-1px) rotate(45deg) scale(1)"
              : "translateY(-1px) rotate(45deg) scale(0)",
          },

      label: {
        opacity: disabled
          ? "var(--ui-interaction-disabled-opacity)"
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
        invalid,
        required,
        readOnly,

        "aria-describedby":
          ariaDescribedBy,

        "aria-labelledby":
          ariaLabelledBy,

        "aria-invalid":
          ariaInvalid,

        "aria-required":
          ariaRequired,

        "aria-readonly":
          ariaReadOnly,

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
        onClick,

        ...rest
      },
      ref
    ) => {
      const innerRef =
        useRef<HTMLInputElement | null>(
          null
        );

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

      const {
        focusVisible,
        focusProps,
      } =
        useFocusVisible<HTMLInputElement>({
          disabled:
            fieldControl.disabled,

          onFocus,
          onBlur,
        });

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

          focusVisible,

          disabled:
            fieldControl.disabled,
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
              fieldControl.disabled ||
              undefined,

            "data-ui-checkbox-invalid":
              fieldControl.invalid ||
              undefined,

            "data-ui-checkbox-focus-visible":
              focusVisible ||
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
                  fieldControl.id,
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
              id={fieldControl.id}
              ref={setRefs}
              type="checkbox"
              checked={
                visualChecked
              }

              disabled={
                fieldControl.disabled
              }

              required={
                fieldControl.required
              }

              aria-checked={
                indeterminate
                  ? "mixed"
                  : visualChecked
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

              aria-describedby={
                fieldControl
                  .ariaDescribedBy
              }

              aria-labelledby={
                fieldControl
                  .ariaLabelledBy
              }

              data-readonly={
                fieldControl.readOnly ||
                undefined
              }

              onClick={(event) => {
                if (
                  fieldControl.readOnly
                ) {
                  event.preventDefault();
                }

                onClick?.(event);
              }}

              onChange={(event) => {
                if (
                  fieldControl.readOnly
                ) {
                  event.preventDefault();
                  return;
                }

                if (
                  !isControlled
                ) {
                  setInternalChecked(
                    event.currentTarget
                      .checked
                  );
                }

                onChange?.(
                  event
                );
              }}
              onFocus={
                focusProps.onFocus
              }
              onBlur={
                focusProps.onBlur
              }
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