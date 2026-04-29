// src/primitives/forms/PasswordInput.tsx
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "./Input";
import { InputGroup } from "./InputGroup";
import { InputRightElement } from "./InputRightElement";

export interface PasswordInputProps
  extends Omit<InputProps, "type" | "rightPadding"> {
  showLabel?: string;
  hideLabel?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      showLabel = "Mostrar contraseña",
      hideLabel = "Ocultar contraseña",
      disabled,
      isDisabled,
      ...rest
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false);
    const finalDisabled = isDisabled ?? disabled ?? false;

    return (
      <InputGroup isDisabled={finalDisabled}>
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          isDisabled={isDisabled}
          rightPadding="2.75rem"
          {...rest}
        />

        <InputRightElement>
          <button
            type="button"
            aria-label={visible ? hideLabel : showLabel}
            disabled={finalDisabled}
            onClick={() => setVisible((current) => !current)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--ui-radius-full)",
              border: "1px solid transparent",
              background: "transparent",
              color: "var(--ui-text-muted)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: finalDisabled ? "not-allowed" : "pointer",
              opacity: finalDisabled ? 0.55 : 1,
              padding: 0,
            }}
            onMouseEnter={(event) => {
              if (finalDisabled) return;
              event.currentTarget.style.background = "var(--ui-surface-hover)";
              event.currentTarget.style.color = "var(--ui-text)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "transparent";
              event.currentTarget.style.color = "var(--ui-text-muted)";
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