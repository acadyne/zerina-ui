// src/patterns/scaffold/FloatingActionButton.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Pressable } from "../../primitives/forms";
import { Box } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";
import type { UIPressEvent } from "../../core/interaction";

export type FloatingActionButtonSize = "sm" | "md" | "lg";

export type FloatingActionButtonVariant = "solid" | "subtle" | "surface";

export type FloatingActionButtonPlacement =
  | "inline"
  | "bottom-end"
  | "bottom-center"
  | "bottom-start";

export type FloatingActionButtonSlot = "root" | "icon" | "label";

export type FloatingActionButtonStyles =
  SlotStyleMap<FloatingActionButtonSlot>;

export type FloatingActionButtonSlotProps =
  SlotPropsMap<FloatingActionButtonSlot>;

export interface FloatingActionButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "type" | "onClick"
  > {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  children?: React.ReactNode;

  /**
   * true:
   *   Muestra icono + texto en cápsula horizontal.
   *
   * false:
   *   Muestra solo botón circular.
   */
  extended?: boolean;

  size?: FloatingActionButtonSize;
  variant?: FloatingActionButtonVariant;

  /**
   * inline:
   *   No posiciona absolutamente. Ideal para MobileScaffold.floating,
   *   porque el scaffold ya controla la posición.
   *
   * bottom-*:
   *   Posicionamiento absoluto local para usos standalone.
   */
  placement?: FloatingActionButtonPlacement;

  onPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;

  className?: string;
  style?: React.CSSProperties;

  styles?: FloatingActionButtonStyles;
  slotProps?: FloatingActionButtonSlotProps;
}

const FLOATING_ACTION_BUTTON_SIZE_MAP: Record<
  FloatingActionButtonSize,
  {
    size: number;
    minWidth: number;
    height: number;
    paddingInline: string;
    iconSize: string;
    labelSize: "xs" | "sm" | "md";
    gap: string;
  }
> = {
  sm: {
    size: 44,
    minWidth: 44,
    height: 44,
    paddingInline: "0.9rem",
    iconSize: "1.15rem",
    labelSize: "sm",
    gap: "0.45rem",
  },
  md: {
    size: 52,
    minWidth: 52,
    height: 52,
    paddingInline: "1rem",
    iconSize: "1.3rem",
    labelSize: "sm",
    gap: "0.5rem",
  },
  lg: {
    size: 60,
    minWidth: 60,
    height: 60,
    paddingInline: "1.15rem",
    iconSize: "1.45rem",
    labelSize: "md",
    gap: "0.55rem",
  },
};

function getVariantStyles(
  variant: FloatingActionButtonVariant
): React.CSSProperties {
  if (variant === "surface") {
    return {
      background: "var(--ui-surface)",
      color: "var(--ui-text)",
      borderColor: "var(--ui-border)",
      boxShadow: "var(--ui-shadow-lg)",
    };
  }

  if (variant === "subtle") {
    return {
      background: "color-mix(in srgb, var(--ui-primary) 14%, var(--ui-surface))",
      color: "var(--ui-primary)",
      borderColor: "color-mix(in srgb, var(--ui-primary) 24%, transparent)",
      boxShadow: "var(--ui-shadow-md)",
    };
  }

  return {
    background: "var(--ui-primary)",
    color: "var(--ui-primary-contrast, white)",
    borderColor: "color-mix(in srgb, var(--ui-primary) 74%, black)",
    boxShadow: "var(--ui-shadow-lg)",
  };
}

function getPlacementStyles(
  placement: FloatingActionButtonPlacement
): React.CSSProperties {
  if (placement === "inline") {
    return {
      position: "relative",
    };
  }

  const horizontal =
    placement === "bottom-center"
      ? {
        left: "50%",
        transform: "translateX(-50%)",
      }
      : placement === "bottom-start"
        ? {
          left: "max(1rem, env(safe-area-inset-left, 0px))",
        }
        : {
          right: "max(1rem, env(safe-area-inset-right, 0px))",
        };

  return {
    position: "absolute",
    bottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
    zIndex: 30,
    ...horizontal,
  };
}

export const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(
  (
    {
      icon = "+",
      label,
      children,
      extended = Boolean(label ?? children),
      size = "md",
      variant = "solid",
      placement = "inline",
      disabled = false,
      onPress,
      className = "",
      style,

      styles,
      slotProps,

      ...rest
    },
    ref
  ) => {
    const sizeStyles = FLOATING_ACTION_BUTTON_SIZE_MAP[size];
    const resolvedLabel = label ?? children;

    const rootSlot = resolveSlot<FloatingActionButtonSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-floating-action-button": "",
        "data-ui-floating-action-button-extended": extended || undefined,
        "data-ui-floating-action-button-size": size,
        "data-ui-floating-action-button-variant": variant,
      },
      baseStyle: {
        ...getPlacementStyles(placement),
        width: extended ? "auto" : sizeStyles.size,
        minWidth: extended ? sizeStyles.minWidth : sizeStyles.size,
        height: sizeStyles.height,
        borderRadius: "9999px",
        border: "1px solid",
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: extended ? sizeStyles.gap : 0,
        paddingInline: extended ? sizeStyles.paddingInline : 0,
        font: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? "var(--ui-state-disabled-opacity, 0.62)" : 1,
        transition:
          "background var(--ui-duration-normal) var(--ui-ease-standard), color var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard)",
        ...getVariantStyles(variant),
      },
    });

    const iconSlot = resolveSlot<FloatingActionButtonSlot>({
      slot: "icon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
        "data-ui-floating-action-button-icon": "",
      },
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: sizeStyles.iconSize,
        lineHeight: 1,
      },
    });

    const labelSlot = resolveSlot<FloatingActionButtonSlot>({
      slot: "label",
      styles,
      slotProps,
      baseProps: {
        "data-ui-floating-action-button-label": "",
      },
      baseStyle: {
        color: "inherit",
        lineHeight: 1,
        whiteSpace: "nowrap",
      },
    });

    return (
      <Pressable
        as="button"
        ref={ref as React.Ref<HTMLElement>}
        type="button"
        disabled={disabled}
        {...rest}
        {...rootSlot}
        onPress={onPress}
      >
        {icon ? <Box {...iconSlot}>{icon}</Box> : null}

        {extended && resolvedLabel ? (
          <Typography
            as="span"
            size={sizeStyles.labelSize}
            weight={800}
            {...labelSlot}
          >
            {resolvedLabel}
          </Typography>
        ) : null}
      </Pressable>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";