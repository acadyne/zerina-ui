// src/components/display/Tag.tsx
import React from "react";
import { usePress } from "../../core/interaction";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

type TagVariant = "solid" | "subtle" | "outline";
type TagScheme =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type TagSlot =
  | "root"
  | "leftIcon"
  | "content"
  | "rightIcon"
  | "removeButton";

export type TagStyles = SlotStyleMap<TagSlot>;

export type TagSlotProps = SlotPropsMap<TagSlot>;

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  variant?: TagVariant;
  colorScheme?: TagScheme;
  rounded?: React.CSSProperties["borderRadius"];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
  style?: React.CSSProperties;

  styles?: TagStyles;
  slotProps?: TagSlotProps;
}

const schemeMap: Record<
  TagScheme,
  {
    solidBg: string;
    solidText: string;
    subtleBg: string;
    subtleText: string;
    outlineText: string;
    outlineBorder: string;
  }
> = {
  primary: {
    solidBg: "var(--ui-primary)",
    solidText: "var(--ui-primary-contrast)",
    subtleBg: "color-mix(in srgb, var(--ui-primary) 18%, transparent)",
    subtleText: "var(--ui-primary)",
    outlineText: "var(--ui-primary)",
    outlineBorder: "color-mix(in srgb, var(--ui-primary) 40%, var(--ui-border))",
  },
  secondary: {
    solidBg: "var(--ui-secondary)",
    solidText: "var(--ui-secondary-contrast)",
    subtleBg: "color-mix(in srgb, var(--ui-secondary) 18%, transparent)",
    subtleText: "var(--ui-secondary)",
    outlineText: "var(--ui-secondary)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-secondary) 40%, var(--ui-border))",
  },
  success: {
    solidBg: "var(--ui-success-strong)",
    solidText: "var(--ui-success-contrast)",
    subtleBg:
      "color-mix(in srgb, var(--ui-success) 16%, transparent)",
    subtleText: "var(--ui-success)",
    outlineText: "var(--ui-success)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-success) 35%, var(--ui-border))",
  },
  warning: {
    solidBg: "var(--ui-warning-strong)",
    solidText: "var(--ui-warning-contrast)",
    subtleBg:
      "color-mix(in srgb, var(--ui-warning) 16%, transparent)",
    subtleText: "var(--ui-warning)",
    outlineText: "var(--ui-warning)",
    outlineBorder:
      "color-mix(in srgb, var(--ui-warning) 35%, var(--ui-border))",
  },
  danger: {
    solidBg: "var(--ui-danger)",
    solidText: "var(--ui-danger-contrast)",
    subtleBg: "color-mix(in srgb, var(--ui-danger) 16%, transparent)",
    subtleText: "var(--ui-danger)",
    outlineText: "var(--ui-danger)",
    outlineBorder: "color-mix(in srgb, var(--ui-danger) 40%, var(--ui-border))",
  },
  neutral: {
    solidBg: "var(--ui-surface-3)",
    solidText: "var(--ui-text)",
    subtleBg: "var(--ui-surface-2)",
    subtleText: "var(--ui-text-muted)",
    outlineText: "var(--ui-text-muted)",
    outlineBorder: "var(--ui-border)",
  },
};

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      variant = "subtle",
      colorScheme = "neutral",
      rounded = "var(--ui-radius-full)",
      leftIcon,
      rightIcon,
      onRemove,
      removable = false,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {

    const scheme = schemeMap[colorScheme];

    const variantStyle: React.CSSProperties =
      variant === "solid"
        ? {
          background: scheme.solidBg,
          color: scheme.solidText,
          border: "1px solid transparent",
        }
        : variant === "outline"
          ? {
            background: "transparent",
            color: scheme.outlineText,
            border: `1px solid ${scheme.outlineBorder}`,
          }
          : {
            background: scheme.subtleBg,
            color: scheme.subtleText,
            border: "1px solid transparent",
          };

    const showRemove = removable || Boolean(onRemove);

    const removeButtonSlotProps = slotProps?.removeButton;

    const {
      onPointerEnter: slotOnPointerEnter,
      onPointerLeave: slotOnPointerLeave,
      onPointerDown: slotOnPointerDown,
      onPointerUp: slotOnPointerUp,
      onPointerCancel: slotOnPointerCancel,
      onLostPointerCapture: slotOnLostPointerCapture,
      onFocus: slotOnFocus,
      onBlur: slotOnBlur,
      onKeyDown: slotOnKeyDown,
      onKeyUp: slotOnKeyUp,
      onClick: slotOnClick,
    } = removeButtonSlotProps ?? {};

    const removePress = usePress<HTMLButtonElement>({
      disabled: !onRemove,
      nativeInteractive: true,

      onPress: () => {
        onRemove?.();
      },

      onPointerEnter: slotOnPointerEnter,
      onPointerLeave: slotOnPointerLeave,
      onPointerDown: slotOnPointerDown,
      onPointerUp: slotOnPointerUp,
      onPointerCancel: slotOnPointerCancel,
      onLostPointerCapture: slotOnLostPointerCapture,
      onFocus: slotOnFocus,
      onBlur: slotOnBlur,
      onKeyDown: slotOnKeyDown,
      onKeyUp: slotOnKeyUp,

      onClick: (event) => {
        event.stopPropagation();
        slotOnClick?.(event);
      },
    });

    const rootSlot = resolveSlot<TagSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-tag": "",
        "data-ui-tag-variant": variant,
        "data-ui-tag-color-scheme": colorScheme,
      },
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
        minHeight: 28,
        maxWidth: "100%",
        padding: "0.28rem 0.7rem",
        fontSize: "0.78rem",
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
        borderRadius: rounded,
        letterSpacing: "0.01em",
        ...variantStyle,
      },
    });

    const iconBaseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    };

    const leftIconSlot = resolveSlot<TagSlot>({
      slot: "leftIcon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: iconBaseStyle,
    });

    const contentSlot = resolveSlot<TagSlot>({
      slot: "content",
      styles,
      slotProps,
      baseStyle: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    });

    const rightIconSlot = resolveSlot<TagSlot>({
      slot: "rightIcon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: iconBaseStyle,
    });

    const removeButtonSlot = resolveSlot<TagSlot>({
      slot: "removeButton",
      styles,
      slotProps,

      baseProps: {
        "aria-label": "Quitar",

        "data-hovered":
          removePress.state.hovered ||
          undefined,

        "data-pressed":
          removePress.state.pressed ||
          undefined,

        "data-focused":
          removePress.state.focused ||
          undefined,

        "data-focus-visible":
          removePress.state.focusVisible ||
          undefined,
      },

      baseStyle: {
        marginLeft: "0.1rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        borderRadius: "var(--ui-radius-full)",
        border: "none",

        background:
          removePress.state.hovered
            ? "var(--ui-surface-hover)"
            : "transparent",

        color: "inherit",

        cursor:
          onRemove
            ? "pointer"
            : "not-allowed",

        padding: 0,
        lineHeight: 1,

        opacity:
          onRemove
            ? 0.85
            : "var(--ui-state-disabled-opacity)",

        flexShrink: 0,
        outline: "none",

        boxShadow:
          removePress.state.focusVisible
            ? "0 0 0 3px var(--ui-focus-ring)"
            : "none",

        transition:
          "background var(--ui-duration-normal) var(--ui-ease-standard), " +
          "box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
      },
    });

    return (
      <span {...rootSlot} ref={ref} {...rest}>
        {leftIcon ? <span {...leftIconSlot}>{leftIcon}</span> : null}

        <span {...contentSlot}>{children}</span>

        {rightIcon ? <span {...rightIconSlot}>{rightIcon}</span> : null}

        {showRemove ? (
          <button
            {...removeButtonSlot}
            {...removePress.pressProps}
            type="button"
            disabled={!onRemove}
          >
            ×
          </button>
        ) : null}
      </span>
    );
  }
);

Tag.displayName = "Tag";