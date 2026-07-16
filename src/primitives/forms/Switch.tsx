// src/primitives/forms/Switch.tsx
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

export type SwitchSlot =
  | "root"
  | "input"
  | "track"
  | "thumb"
  | "label";

export type SwitchStyles =
  SlotStyleMap<SwitchSlot>;

export type SwitchSlotProps =
  SlotPropsMap<SwitchSlot>;

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  label?: React.ReactNode;

  labelPlacement?:
  | "right"
  | "left";

  size?: "sm" | "md" | "lg";

  color?: string;

  styles?: SwitchStyles;
  slotProps?: SwitchSlotProps;
}

const sizeMap = {
  sm: {
    trackW: 34,
    trackH: 20,
    knob: 14,
    offset: 3,
  },

  md: {
    trackW: 42,
    trackH: 24,
    knob: 18,
    offset: 3,
  },

  lg: {
    trackW: 52,
    trackH: 30,
    knob: 22,
    offset: 4,
  },
} as const;

type SwitchRecipeVariants = {
  size: NonNullable<
    SwitchProps["size"]
  >;

  labelPlacement: NonNullable<
    SwitchProps["labelPlacement"]
  >;
};

type SwitchRecipeState = {
  color: string;

  checked: boolean;
  focused: boolean;
  disabled: boolean;
};

/**
 * La recipe concentra únicamente la política visual del Switch.
 *
 * El estado controlado/no controlado, el input nativo,
 * FormControl y los eventos permanecen fuera de Styling.
 */
const switchRecipe =
  defineSlotRecipe<
    SwitchSlot,
    SwitchRecipeVariants,
    SwitchRecipeState
  >({
    base: {
      root: {
        display: "inline-flex",
        alignItems: "center",

        gap: "0.6rem",

        userSelect: "none",

        WebkitTapHighlightColor:
          "transparent",
      },

      track: {
        position: "relative",

        display: "inline-flex",
        alignItems: "center",

        flexShrink: 0,

        borderRadius:
          "var(--ui-radius-full)",

        padding: 0,

        transition:
          "background var(--ui-duration-normal) var(--ui-ease-standard), " +
          "border-color var(--ui-duration-normal) var(--ui-ease-standard), " +
          "box-shadow var(--ui-duration-normal) var(--ui-ease-standard), " +
          "opacity var(--ui-duration-normal) var(--ui-ease-standard)",
      },

      input: {
        position: "absolute",
        inset: 0,

        opacity: 0,

        margin: 0,

        zIndex: 1,
      },

      thumb: {
        borderRadius:
          "var(--ui-radius-full)",

        background: "var(--ui-control-indicator)",

        boxShadow:
          "var(--ui-shadow-control)",

        pointerEvents: "none",

        transition:
          "transform var(--ui-duration-normal) var(--ui-ease-standard)",
      },

      label: {
        fontSize: "0.95rem",

        color:
          "var(--ui-text)",

        lineHeight: 1.15,
      },
    },

    variants: {
      size: {
        sm: {
          track: {
            width:
              sizeMap.sm.trackW,

            height:
              sizeMap.sm.trackH,
          },

          thumb: {
            width:
              sizeMap.sm.knob,

            height:
              sizeMap.sm.knob,
          },
        },

        md: {
          track: {
            width:
              sizeMap.md.trackW,

            height:
              sizeMap.md.trackH,
          },

          thumb: {
            width:
              sizeMap.md.knob,

            height:
              sizeMap.md.knob,
          },
        },

        lg: {
          track: {
            width:
              sizeMap.lg.trackW,

            height:
              sizeMap.lg.trackH,
          },

          thumb: {
            width:
              sizeMap.lg.knob,

            height:
              sizeMap.lg.knob,
          },
        },
      },

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
      size,
      color,
      checked,
      focused,
      disabled,
    }) => {
      const resolvedSize =
        sizeMap[size];

      const thumbOffset =
        checked
          ? resolvedSize.trackW -
          resolvedSize.knob -
          resolvedSize.offset
          : resolvedSize.offset;

      return {
        root: {
          cursor: disabled
            ? "not-allowed"
            : "pointer",
        },

        track: {
          background: checked
            ? color
            : "var(--ui-surface-3)",

          border:
            `1px solid ${checked
              ? color
              : "var(--ui-border)"
            }`,

          boxShadow: focused
            ? "0 0 0 3px var(--ui-focus-ring)"
            : "none",

          opacity: disabled
            ? "var(--ui-state-disabled-opacity)"
            : 1,
        },

        input: {
          cursor: disabled
            ? "not-allowed"
            : "pointer",
        },

        thumb: {
          transform:
            `translateX(${thumbOffset}px)`,
        },

        label: {
          opacity: disabled
            ? "var(--ui-state-disabled-opacity)"
            : 1,
        },
      };
    },
  });

export const Switch =
  forwardRef<
    HTMLInputElement,
    SwitchProps
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

        size = "md",

        color =
        "var(--ui-primary)",

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
        `sw-${autoId}`;

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

      const isOn =
        isControlled
          ? Boolean(checked)
          : internalChecked;

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

      const WrapperTag =
        label
          ? "label"
          : "div";

      const recipeStyles =
        switchRecipe({
          size,
          labelPlacement,

          color,

          checked: isOn,

          focused:
            isFocused,

          disabled:
            finalDisabled,
        });

      const rootSlot =
        resolveSlot<SwitchSlot>({
          slot: "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-switch":
              "",

            "data-ui-switch-checked":
              isOn ||
              undefined,

            "data-ui-switch-disabled":
              finalDisabled ||
              undefined,

            "data-ui-switch-invalid":
              finalInvalid ||
              undefined,

            "data-ui-switch-focused":
              isFocused ||
              undefined,

            "data-ui-switch-size":
              size,
          },

          baseStyle:
            recipeStyles.root,
        });

      const trackSlot =
        resolveSlot<SwitchSlot>({
          slot: "track",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.track,
        });

      const inputSlot =
        resolveSlot<SwitchSlot>({
          slot: "input",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.input,
        });

      const thumbSlot =
        resolveSlot<SwitchSlot>({
          slot: "thumb",

          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,

            "data-ui-switch-thumb":
              "",
          },

          baseStyle:
            recipeStyles.thumb,
        });

      const labelSlot =
        resolveSlot<SwitchSlot>({
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
            {...trackSlot}
          >
            <input
              {...inputSlot}
              {...rest}
              ref={ref}
              id={inputId}
              type="checkbox"
              role="switch"
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
              aria-checked={isOn}
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
              {...thumbSlot}
            />
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

Switch.displayName =
  "Switch";