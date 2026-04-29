// src/primitives/forms/RadioGroup.tsx
import React from "react";
import { Stack } from "../layout/Stack";
// import { Stack } from "./Stack";

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

export interface RadioGroupProps {
  children?: React.ReactNode;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  direction?: "row" | "column";
  spacing?: React.CSSProperties["gap"];
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  name,
  value,
  onChange,
  isDisabled = false,
  direction = "column",
  spacing = "0.65rem",
}) => {
  const ctx = React.useMemo<RadioGroupValue>(
    () => ({
      name,
      value,
      onChange,
      isDisabled,
    }),
    [name, value, onChange, isDisabled]
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <Stack direction={direction} spacing={spacing}>
        {children}
      </Stack>
    </RadioGroupContext.Provider>
  );
};