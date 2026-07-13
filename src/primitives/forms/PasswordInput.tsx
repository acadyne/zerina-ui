// src/primitives/forms/PasswordInput.tsx
import React from "react";
import { Eye, EyeOff } from "lucide-react";
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

export type PasswordInputSlot =
  | "group"
  | "input"
  | "rightElement"
  | "toggleButton";

export type PasswordInputStyles =
  SlotStyleMap<PasswordInputSlot>;

export type PasswordInputSlotProps =
  SlotPropsMap<PasswordInputSlot>;

export interface PasswordInputProps
  extends Omit<
    InputProps,
    | "type"
    | "rightPadding"
    | "styles"
    | "slotProps"
  > {
  showLabel?: string;
  hideLabel?: string;

  styles?: PasswordInputStyles;
  slotProps?: PasswordInputSlotProps;
}

type PasswordInputRecipeVariants =
  Record<never, never>;

type PasswordInputRecipeState = {
  hovered: boolean;
  disabled: boolean;
};

/**
 * La recipe concentra la política visual propia de PasswordInput.
 *
 * Input e InputGroup conservan sus respectivas políticas visuales.
 * La visibilidad y los eventos permanecen fuera de Styling.
 */
const passwordInputRecipe =
  defineSlotRecipe<
    PasswordInputSlot,
    PasswordInputRecipeVariants,
    PasswordInputRecipeState
  >({
    base: {
      toggleButton: {
        width: 28,
        height: 28,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        padding: 0,

        border:
          "1px solid transparent",

        borderRadius:
          "var(--ui-radius-full)",

        background:
          "transparent",

        color:
          "var(--ui-text-muted)",

        cursor: "pointer",
      },
    },

    resolve: ({
      hovered,
      disabled,
    }) => ({
      toggleButton: {
        background:
          hovered &&
          !disabled
            ? "var(--ui-surface-hover)"
            : "transparent",

        color:
          hovered &&
          !disabled
            ? "var(--ui-text)"
            : "var(--ui-text-muted)",

        cursor: disabled
          ? "not-allowed"
          : "pointer",

        opacity: disabled
          ? 0.55
          : 1,
      },
    }),
  });

export const PasswordInput =
  React.forwardRef<
    HTMLInputElement,
    PasswordInputProps
  >(
    (
      {
        showLabel =
          "Mostrar contraseña",

        hideLabel =
          "Ocultar contraseña",

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
        visible,
        setVisible,
      ] =
        React.useState(false);

      const [
        toggleHovered,
        setToggleHovered,
      ] =
        React.useState(false);

      const finalDisabled =
        isDisabled ??
        ctx?.isDisabled ??
        disabled ??
        false;

      const finalInvalid =
        isInvalid ??
        ctx?.isInvalid ??
        false;

      const recipeStyles =
        passwordInputRecipe({
          hovered:
            toggleHovered,

          disabled:
            finalDisabled,
        });

      const groupSlot =
        resolveSlot<PasswordInputSlot>({
          slot: "group",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-password-input":
              "",

            "data-ui-password-input-visible":
              visible ||
              undefined,

            "data-ui-password-input-disabled":
              finalDisabled ||
              undefined,

            "data-ui-password-input-invalid":
              finalInvalid ||
              undefined,
          },

          baseStyle:
            recipeStyles.group,
        });

      const inputSlot =
        resolveSlot<PasswordInputSlot>({
          slot: "input",

          styles,
          slotProps,

          baseStyle:
            recipeStyles.input,
        });

      const rightElementSlot =
        resolveSlot<PasswordInputSlot>({
          slot:
            "rightElement",

          styles,
          slotProps,

          baseStyle:
            recipeStyles
              .rightElement,
        });

      const toggleButtonSlot =
        resolveSlot<PasswordInputSlot>({
          slot:
            "toggleButton",

          styles,
          slotProps,

          baseProps: {
            "data-ui-password-input-toggle":
              "",
          },

          baseStyle:
            recipeStyles
              .toggleButton,
        });

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
          <Input
            ref={ref}
            type={
              visible
                ? "text"
                : "password"
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
            rightPadding="2.75rem"
            className={
              inputSlot.className
            }
            style={
              inputSlot.style
            }
            {...rest}
          />

          <InputRightElement
            className={
              rightElementSlot.className
            }
            style={
              rightElementSlot.style
            }
          >
            <button
              {...toggleButtonSlot}
              type="button"
              aria-label={
                visible
                  ? hideLabel
                  : showLabel
              }
              aria-pressed={
                visible
              }
              disabled={
                finalDisabled
              }
              onClick={() => {
                setVisible(
                  (current) =>
                    !current
                );
              }}
              onMouseEnter={() => {
                setToggleHovered(
                  true
                );
              }}
              onMouseLeave={() => {
                setToggleHovered(
                  false
                );
              }}
            >
              {visible ? (
                <EyeOff
                  size={16}
                />
              ) : (
                <Eye
                  size={16}
                />
              )}
            </button>
          </InputRightElement>
        </InputGroup>
      );
    }
  );

PasswordInput.displayName =
  "PasswordInput";