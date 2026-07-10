// src/components/feedback/EmptyState.tsx
import React from "react";
import { Button } from "../../primitives/forms";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type EmptyStateSlot =
  | "root"
  | "content"
  | "icon"
  | "title"
  | "description"
  | "action";

export type EmptyStateStyles = SlotStyleMap<EmptyStateSlot>;

export type EmptyStateSlotProps = SlotPropsMap<EmptyStateSlot>;

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
  action?: React.ReactNode;
  align?: "left" | "center";
  compact?: boolean;
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;

  styles?: EmptyStateStyles;
  slotProps?: EmptyStateSlotProps;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title = "Nada por mostrar",
      description,
      actionLabel,
      onAction,
      action,
      align = "center",
      compact = false,
      bordered = true,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const textAlign = align;
    const itemsAlign = align === "center" ? "center" : "flex-start";

    const rootSlot = resolveSlot<EmptyStateSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-empty-state": "",
        "data-ui-empty-state-align": align,
      },
      baseStyle: {
        width: "100%",
        minWidth: 0,
        padding: compact ? "1.25rem" : "2rem",
        borderRadius: "var(--ui-radius-lg)",
        background: "var(--ui-surface)",
        border: bordered ? "1px dashed var(--ui-border)" : "none",
        color: "var(--ui-text)",
      },
    });

    const contentSlot = resolveSlot<EmptyStateSlot>({
      slot: "content",
      styles,
      slotProps,
      baseStyle: {
        display: "flex",
        flexDirection: "column",
        alignItems: itemsAlign,
        gap: compact ? "0.65rem" : "0.9rem",
        textAlign,
        minWidth: 0,
      },
    });

    const iconSlot = resolveSlot<EmptyStateSlot>({
      slot: "icon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: compact ? 44 : 56,
        height: compact ? 44 : 56,
        borderRadius: "var(--ui-radius-full)",
        background: "var(--ui-surface-2)",
        color: "var(--ui-text-muted)",
        fontSize: compact ? "1.1rem" : "1.35rem",
        flexShrink: 0,
      },
    });

    const titleSlot = resolveSlot<EmptyStateSlot>({
      slot: "title",
      styles,
      slotProps,
      baseStyle: {
        margin: 0,
        fontSize: compact
          ? "var(--ui-font-size-lg)"
          : "var(--ui-font-size-xl)",
        fontWeight: 800,
        lineHeight: 1.2,
        color: "var(--ui-text)",
        textAlign,
      },
    });

    const descriptionSlot = resolveSlot<EmptyStateSlot>({
      slot: "description",
      styles,
      slotProps,
      baseStyle: {
        margin: align === "center" ? "0 auto" : 0,
        maxWidth: align === "center" ? 520 : undefined,
        fontSize: compact
          ? "var(--ui-font-size-sm)"
          : "var(--ui-font-size-md)",
        lineHeight: 1.5,
        color: "var(--ui-text-muted)",
        textAlign,
      },
    });

    const actionSlot = resolveSlot<EmptyStateSlot>({
      slot: "action",
      styles,
      slotProps,
      baseStyle: {
        marginTop: "0.25rem",
      },
    });

    return (
      <div {...rootSlot} ref={ref} {...rest}>
        <div {...contentSlot}>
          {icon ? <div {...iconSlot}>{icon}</div> : null}

          {title ? <h3 {...titleSlot}>{title}</h3> : null}

          {description ? (
            <div {...descriptionSlot}>{description}</div>
          ) : null}

          {action ? (
            <div {...actionSlot}>{action}</div>
          ) : actionLabel && onAction ? (
            <div {...actionSlot}>
              <Button onClick={onAction}>{actionLabel}</Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";