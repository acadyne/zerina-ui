// src/primitives/forms/RadioGroup.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Stack } from "../layout/Stack";

type RadioGroupValue = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupValue | null>(null);

export function useRadioGroupContext() {
  return React.useContext(RadioGroupContext);
}

export type RadioGroupSlot = "root";

export type RadioGroupStyles = SlotStyleMap<RadioGroupSlot>;

export type RadioGroupSlotProps = SlotPropsMap<RadioGroupSlot>;

export interface RadioGroupProps {
  children?: React.ReactNode;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  direction?: "row" | "column";
  spacing?: React.CSSProperties["gap"];

  className?: string;
  style?: React.CSSProperties;

  styles?: RadioGroupStyles;
  slotProps?: RadioGroupSlotProps;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      children,
      name,
      value,
      onChange,
      isDisabled = false,
      direction = "column",
      spacing = "0.65rem",
      className = "",
      style,
      styles,
      slotProps,
    },
    ref
  ) => {
    const ctx = React.useMemo<RadioGroupValue>(
      () => ({
        name,
        value,
        onChange,
        isDisabled,
      }),
      [name, value, onChange, isDisabled]
    );

    const rootSlot = resolveSlot<RadioGroupSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        role: "radiogroup",
        "data-ui-radio-group": "",
        "data-ui-radio-group-disabled": isDisabled || undefined,
      },
    });

    return (
      <RadioGroupContext.Provider value={ctx}>
        <Stack
          ref={ref}
          direction={direction}
          spacing={spacing}
          className={rootSlot.className}
          style={rootSlot.style}
          {...rootSlot}
        >
          {children}
        </Stack>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";