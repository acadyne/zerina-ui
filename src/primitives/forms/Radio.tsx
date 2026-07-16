// src/primitives/forms/Radio.tsx
import React, {
  forwardRef,
  useContext,
  useId,
  useState,
} from "react";
import {
  defineSlotRecipe,
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControlContext } from "./FormControl";
import { useRadioGroupContext } from "./RadioGroup";

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
  focused: boolean;
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
          "transform 0.15s ease-in-out",
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
      focused,
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

          boxShadow: focused
            ? "0 0 0 3px var(--ui-focus-ring)"
            : "none",

          cursor: disabled
            ? "not-allowed"
            : "pointer",

          opacity: disabled
            ? "var(--ui-state-disabled-opacity)"
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
            ? "var(--ui-state-disabled-opacity)"
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
        required,

        "aria-describedby":
          ariaDescribedBy,

        "aria-invalid":
          ariaInvalid,

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

        name,

        ...rest
      },
      ref
    ) => {
      const autoId = useId();

      const group =
        useRadioGroupContext();

      const ctx =
        useContext(
          FormControlContext
        );

      const inputId =
        id ??
        ctx?.id ??
        `radio-${autoId}`;

      const [
        isFocused,
        setIsFocused,
      ] = useState(false);

      const resolvedName =
        group?.name ??
        name;

      const resolvedDisabled =
        group?.isDisabled ??
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

      const resolvedChecked =
        checked !== undefined
          ? checked
          : group?.value !==
                undefined &&
              value !== undefined
            ? group.value ===
              String(value)
            : undefined;

      const visualChecked =
        resolvedChecked !==
        undefined
          ? resolvedChecked
          : Boolean(
              defaultChecked
            );

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

          focused:
            isFocused,

          disabled:
            resolvedDisabled,
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
              resolvedDisabled ||
              undefined,

            "data-ui-radio-invalid":
              finalInvalid ||
              undefined,

            "data-ui-radio-focused":
              isFocused ||
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
              ref={ref}
              id={inputId}
              type="radio"
              name={resolvedName}
              value={value}
              checked={
                resolvedChecked
              }
              defaultChecked={
                defaultChecked
              }
              disabled={
                resolvedDisabled
              }
              required={
                finalRequired
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
                onChange?.(
                  event
                );

                if (
                  group?.onChange &&
                  event.currentTarget
                    .value !==
                    undefined
                ) {
                  group.onChange(
                    event
                      .currentTarget
                      .value
                  );
                }
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