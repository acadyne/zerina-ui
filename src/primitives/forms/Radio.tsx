// src/primitives/forms/Radio.tsx
import React, {
  forwardRef,
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
import { useRadioGroupContext } from "./RadioGroup";
import {
  useFocusVisible,
} from "../../core/interaction/focus";

export type RadioSlot =
  | "root"
  | "input"
  | "control"
  | "indicator"
  | "indicatorDot"
  | "label";

export type RadioStyles =
  SlotStyleMap<RadioSlot>;

export type RadioSlotProps =
  SlotPropsMap<RadioSlot>;

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  label?: React.ReactNode;

  invalid?: boolean;

  color?: string;
  boxSize?: number;

  labelPlacement?:
  | "right"
  | "left";

  styles?: RadioStyles;
  slotProps?: RadioSlotProps;
}

type RadioRecipeVariants = {
  labelPlacement:
  | "right"
  | "left";
};

type RadioRecipeState = {
  color: string;
  boxSize: number;

  checked: boolean;
  focusVisible: boolean;
  disabled: boolean;
};

/**
 * La recipe concentra únicamente la política visual del Radio.
 *
 * La selección del valor, la integración con RadioGroup,
 * FormControl y los eventos nativos permanecen fuera de Styling.
 */
const radioRecipe =
  defineSlotRecipe<
    RadioSlot,
    RadioRecipeVariants,
    RadioRecipeState
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

        borderRadius: "50%",

        background: "transparent",

        outline: "none",

        transition:
          "border-color var(--ui-duration-fast) var(--ui-ease-standard), " +
          "box-shadow var(--ui-duration-fast) var(--ui-ease-standard), " +
          "opacity var(--ui-duration-fast) var(--ui-ease-standard)",
      },

      indicator: {
        position: "absolute",
        inset: 0,

        display: "grid",
        placeItems: "center",

        pointerEvents: "none",
      },

      indicatorDot: {
        borderRadius: "50%",

        transformOrigin: "center",

        transition:
          "transform var(--ui-duration-fast) var(--ui-ease-standard)",
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
    },

    resolve: ({
      color,
      boxSize,
      checked,
      focusVisible,
      disabled,
    }) => {
      const dotSize =
        Math.max(
          6,
          boxSize - 8
        );

      return {
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

        indicatorDot: {
          width: dotSize,
          height: dotSize,

          background: color,

          transform: checked
            ? "scale(1)"
            : "scale(0)",
        },

        label: {
          opacity: disabled
            ? "var(--ui-interaction-disabled-opacity)"
            : 1,
        },
      };
    },
  });

export const Radio =
  forwardRef<
    HTMLInputElement,
    RadioProps
  >(
    (
      {
        id,
        label,

        value,
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

        color =
        "var(--ui-primary)",

        boxSize = 16,

        labelPlacement =
        "right",

        className = "",
        style,

        styles,
        slotProps,

        onFocus,
        onBlur,
        onClick,

        name,

        ...rest
      },
      ref
    ) => {
      const group =
        useRadioGroupContext();

      const groupManaged =
        checked === undefined &&
        group !== null &&
        value !== undefined;

      const externallyControlled =
        checked !== undefined ||
        groupManaged;

      const [
        internalChecked,
        setInternalChecked,
      ] = useState(
        Boolean(defaultChecked)
      );

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

          kind:
            group === null
              ? "control"
              : "group-item",

          includeFieldDescription:
            group === null,

          additionalState:
            group?.state,
        });

      const resolvedName =
        group?.name ??
        name;

      const visualChecked =
        checked !== undefined
          ? Boolean(checked)
          : groupManaged
            ? group?.value ===
              String(value)
            : internalChecked;

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

      const WrapperTag =
        label
          ? "label"
          : "div";

      const recipeStyles =
        radioRecipe({
          labelPlacement,

          color,
          boxSize,

          checked:
            visualChecked,

          focusVisible,

          disabled:
            fieldControl.disabled,
        });

      const rootSlot =
        resolveSlot<RadioSlot>({
          slot: "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-radio":
              "",

            "data-ui-radio-checked":
              visualChecked ||
              undefined,

            "data-ui-radio-disabled":
              fieldControl.disabled ||
              undefined,

            "data-ui-radio-invalid":
              fieldControl.invalid ||
              undefined,

            "data-ui-radio-focus-visible":
              focusVisible ||
              undefined,
          },

          baseStyle:
            recipeStyles.root,
        });

      const controlSlot =
        resolveSlot<RadioSlot>({
          slot: "control",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.control,
        });

      const inputSlot =
        resolveSlot<RadioSlot>({
          slot: "input",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.input,
        });

      const indicatorSlot =
        resolveSlot<RadioSlot>({
          slot: "indicator",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,
          },

          baseStyle:
            recipeStyles.indicator,
        });

      const indicatorDotSlot =
        resolveSlot<RadioSlot>({
          slot:
            "indicatorDot",

          styles,
          slotProps,

          baseProps: {
            "data-ui-radio-indicator-dot":
              "",
          },

          baseStyle:
            recipeStyles
              .indicatorDot,
        });

      const labelSlot =
        resolveSlot<RadioSlot>({
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
              ref={ref}
              id={fieldControl.id}
              type="radio"
              name={resolvedName}
              value={value}
              checked={
                visualChecked
              }

              disabled={
                fieldControl.disabled
              }

              required={
                fieldControl.required
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
                fieldControl.ariaDescribedBy
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
                  !externallyControlled
                ) {
                  setInternalChecked(
                    event.currentTarget
                      .checked
                  );
                }

                onChange?.(
                  event
                );

                if (
                  groupManaged &&
                  event.currentTarget
                    .checked
                ) {
                  group?.selectValue(
                    String(value),
                    event
                  );
                }
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
                {...indicatorDotSlot}
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

Radio.displayName = "Radio";