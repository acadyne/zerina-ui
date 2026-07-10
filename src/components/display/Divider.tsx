// src/components/display/Divider.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type DividerSlot = "root";

export type DividerStyles = SlotStyleMap<DividerSlot>;

export type DividerSlotProps = SlotPropsMap<DividerSlot>;

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  color?: React.CSSProperties["borderColor"];
  thickness?: number | string;
  length?: number | string;
  spacing?: number | string;
  className?: string;
  style?: React.CSSProperties;

  styles?: DividerStyles;
  slotProps?: DividerSlotProps;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      color = "var(--ui-border)",
      thickness = "1px",
      length,
      spacing,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const isVertical = orientation === "vertical";

    const rootSlot = resolveSlot<DividerSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "aria-orientation": orientation,
        "data-ui-divider": "",
        "data-ui-divider-orientation": orientation,
      },
      baseStyle: {
        border: "none",
        margin: 0,
        flexShrink: 0,
        alignSelf: "stretch",
        backgroundColor: color,
        ...(isVertical
          ? {
              width: thickness,
              height: length ?? "auto",
              minHeight: length ?? "1.25rem",
              marginLeft: spacing,
              marginRight: spacing,
            }
          : {
              height: thickness,
              width: length ?? "100%",
              marginTop: spacing,
              marginBottom: spacing,
            }),
      },
    });

    return <hr {...rootSlot} ref={ref} {...rest} />;
  }
);

Divider.displayName = "Divider";