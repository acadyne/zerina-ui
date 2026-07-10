// src/primitives/forms/InputRightElement.tsx
import React, { forwardRef } from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type InputRightElementSlot = "root";

export type InputRightElementStyles = SlotStyleMap<InputRightElementSlot>;

export type InputRightElementSlotProps = SlotPropsMap<InputRightElementSlot>;

export interface InputRightElementProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  right?: number | string;
  width?: number | string;
  pointerEvents?: "auto" | "none";

  styles?: InputRightElementStyles;
  slotProps?: InputRightElementSlotProps;
}

type InputRightElementComponent = React.ForwardRefExoticComponent<
  InputRightElementProps & React.RefAttributes<HTMLDivElement>
> & {
  __UI_SLOT_KIND?: "input-right-element";
};

export const InputRightElement = forwardRef<
  HTMLDivElement,
  InputRightElementProps
>(
  (
    {
      children,
      className = "",
      style,
      right = "10px",
      width,
      pointerEvents = "auto",
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const rootSlot = resolveSlot<InputRightElementSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-input-right-element": "true",
      },
      baseStyle: {
        position: "absolute",
        top: "50%",
        right,
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width,
        gap: "0.35rem",
        paddingLeft: "0.25rem",
        paddingRight: "0.25rem",
        color: "var(--ui-text)",
        pointerEvents,
        zIndex: 1,
        minWidth: 0,
      },
    });

    return (
      <div {...rootSlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
) as InputRightElementComponent;

InputRightElement.displayName = "InputRightElement";
InputRightElement.__UI_SLOT_KIND = "input-right-element";