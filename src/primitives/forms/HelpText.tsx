// src/primitives/forms/HelpText.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { FormControlContext } from "./FormControl";

export type HelpTextSlot = "root";

export type HelpTextStyles = SlotStyleMap<HelpTextSlot>;

export type HelpTextSlotProps = SlotPropsMap<HelpTextSlot>;

export interface HelpTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  styles?: HelpTextStyles;
  slotProps?: HelpTextSlotProps;
}

export const HelpText = React.forwardRef<HTMLParagraphElement, HelpTextProps>(
  (
    {
      children,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = React.useContext(FormControlContext);

    if (!children) {
      return null;
    }

    const rootSlot = resolveSlot<HelpTextSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        marginTop: "0.35rem",
        fontSize: "var(--ui-font-size-sm)",
        color: "var(--ui-text-muted)",
        lineHeight: 1.35,
        wordBreak: "break-word",
        minWidth: 0,
      },
    });

    return (
      <p {...rootSlot} ref={ref} id={ctx?.helpTextId} {...rest}>
        {children}
      </p>
    );
  }
);

HelpText.displayName = "HelpText";