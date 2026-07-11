// src/primitives/forms/PasswordInput.tsx
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
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

export type PasswordInputStyles = SlotStyleMap<PasswordInputSlot>;

export type PasswordInputSlotProps = SlotPropsMap<PasswordInputSlot>;

export interface PasswordInputProps
  extends Omit<InputProps, "type" | "rightPadding" | "styles" | "slotProps"> {
  showLabel?: string;
  hideLabel?: string;

  styles?: PasswordInputStyles;
  slotProps?: PasswordInputSlotProps;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      showLabel = "Mostrar contraseña",
      hideLabel = "Ocultar contraseña",
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
    const ctx = React.useContext(FormControlContext);
    const [visible, setVisible] = React.useState(false);
    const [toggleHovered, setToggleHovered] = React.useState(false);

    const finalDisabled = isDisabled ?? ctx?.isDisabled ?? disabled ?? false;
    const finalInvalid = isInvalid ?? ctx?.isInvalid ?? false;

    const groupSlot = resolveSlot<PasswordInputSlot>({
      slot: "group",
      styles,
      slotProps,
      className,
      style,
    });

    const inputSlot = resolveSlot<PasswordInputSlot>({
      slot: "input",
      styles,
      slotProps,
    });

    const rightElementSlot = resolveSlot<PasswordInputSlot>({
      slot: "rightElement",
      styles,
      slotProps,
    });

    const toggleButtonSlot = resolveSlot<PasswordInputSlot>({
      slot: "toggleButton",
      styles,
      slotProps,
      baseStyle: {
        width: 28,
        height: 28,
        borderRadius: "var(--ui-radius-full)",
        border: "1px solid transparent",
        background:
          toggleHovered && !finalDisabled
            ? "var(--ui-surface-hover)"
            : "transparent",
        color:
          toggleHovered && !finalDisabled
            ? "var(--ui-text)"
            : "var(--ui-text-muted)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: finalDisabled ? "not-allowed" : "pointer",
        opacity: finalDisabled ? 0.55 : 1,
        padding: 0,
      },
    });

    return (
      <InputGroup
        isInvalid={finalInvalid}
        isDisabled={finalDisabled}
        className={groupSlot.className}
        style={groupSlot.style}
      >
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={finalDisabled}
          isDisabled={finalDisabled}
          isInvalid={finalInvalid}
          rightPadding="2.75rem"
          className={inputSlot.className}
          style={inputSlot.style}
          {...rest}
        />

        <InputRightElement
          className={rightElementSlot.className}
          style={rightElementSlot.style}
        >
          <button
            {...toggleButtonSlot}
            type="button"
            aria-label={visible ? hideLabel : showLabel}
            disabled={finalDisabled}
            onClick={() => setVisible((current) => !current)}
            onMouseEnter={() => {
              setToggleHovered(true);
            }}
            onMouseLeave={() => {
              setToggleHovered(false);
            }}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </InputRightElement>
      </InputGroup>
    );
  }
);

PasswordInput.displayName = "PasswordInput";