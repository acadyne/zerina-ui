// src/components/feedback/Alert.tsx
import React from "react";
import {
  hasNonEmptyRenderableNode,
  hasRenderableNode,
} from "../../core/react/nodePresence";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import type {
  FeedbackVariant,
} from "./feedback.types";
import {
  toneRecipe,
  typographyRecipe,
} from "../../theme/recipes";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type AlertVariant =
  FeedbackVariant;

export type AlertSlot =
  | "root"
  | "inner"
  | "icon"
  | "content"
  | "title"
  | "description"
  | "children"
  | "action";

export type AlertStyles = SlotStyleMap<AlertSlot>;

export type AlertSlotProps = SlotPropsMap<AlertSlot>;

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
  bordered?: boolean;

  styles?: AlertStyles;
  slotProps?: AlertSlotProps;
}

const alertIconMap: Record<
  AlertVariant,
  React.ReactNode
> = {
  info:
    <Info size={18} />,

  success:
    <CheckCircle2 size={18} />,

  warning:
    <TriangleAlert size={18} />,

  danger:
    <XCircle size={18} />,

  neutral:
    <AlertCircle size={18} />,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      title,
      description,
      variant = "info",
      icon,
      action,
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
    const tone =
      toneRecipe({
        tone:
          variant,
        emphasis:
          "container",
      });

    const defaultIcon =
      alertIconMap[
        variant
      ];

    const rootSlot = resolveSlot<AlertSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        role: variant === "danger" || variant === "warning" ? "alert" : "status",
        "data-ui-alert": "",
        "data-ui-alert-variant": variant,
      },
      baseStyle: {
        width: "100%",
        minWidth: 0,
        padding: compact ? "0.75rem" : "0.9rem 1rem",
        borderRadius: "var(--ui-radius-lg)",
        background:
          tone.background,

        border:
          bordered
            ? `1px solid ${tone.borderColor}`
            : "1px solid transparent",

        color:
          tone.color,
      },
    });

    const innerSlot = resolveSlot<AlertSlot>({
      slot: "inner",
      styles,
      slotProps,
      baseStyle: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: "0.75rem",
      },
    });

    const iconSlot = resolveSlot<AlertSlot>({
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
        color: tone.color,
        flexShrink: 0,
        marginTop: 2,
      },
    });

    const contentSlot = resolveSlot<AlertSlot>({
      slot: "content",
      styles,
      slotProps,
      baseStyle: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      },
    });

    const titleSlot = resolveSlot<AlertSlot>({
      slot: "title",
      styles,
      slotProps,
      baseStyle: {
        ...typographyRecipe({
          role: "label",
        }),
        margin: 0,
        fontWeight: "var(--ui-font-weight-bold)",
        color: "inherit",
      },
    });

    const descriptionSlot = resolveSlot<AlertSlot>({
      slot: "description",
      styles,
      slotProps,
      baseStyle: {
        ...typographyRecipe({
          role: "label",
        }),
        margin: 0,
        color: "inherit",
        opacity: 0.84,
      },
    });

    const childrenSlot = resolveSlot<AlertSlot>({
      slot: "children",
      styles,
      slotProps,
      baseStyle: {
        ...typographyRecipe({
          role: "label",
        }),
        margin: 0,
        color:
          "inherit",

        opacity:
          hasNonEmptyRenderableNode(
            title
          ) ||
          hasNonEmptyRenderableNode(
            description
          )
            ? 0.84
            : 1,
      },
    });

    const actionSlot = resolveSlot<AlertSlot>({
      slot: "action",
      styles,
      slotProps,
      baseStyle: {
        flexShrink: 0,
      },
    });

    return (
      <div {...rootSlot} ref={ref} {...rest}>
        <div {...innerSlot}>
          <div {...iconSlot}>{icon ?? defaultIcon}</div>

          <div {...contentSlot}>
            {hasNonEmptyRenderableNode(title) ? <div {...titleSlot}>{title}</div> : null}

            {hasNonEmptyRenderableNode(description) ? (
              <div {...descriptionSlot}>{description}</div>
            ) : null}

            {hasRenderableNode(children) ? <div {...childrenSlot}>{children}</div> : null}
          </div>

          {hasRenderableNode(action) ? <div {...actionSlot}>{action}</div> : null}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";