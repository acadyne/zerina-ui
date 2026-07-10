// src/components/feedback/Alert.tsx
import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type AlertVariant = "info" | "success" | "warning" | "danger" | "neutral";

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

const alertVariantMap: Record<
  AlertVariant,
  {
    icon: React.ReactNode;
    color: string;
    background: string;
    border: string;
  }
> = {
  info: {
    icon: <Info size={18} />,
    color: "var(--ui-primary)",
    background: "color-mix(in srgb, var(--ui-primary) 10%, transparent)",
    border: "color-mix(in srgb, var(--ui-primary) 32%, var(--ui-border))",
  },
  success: {
    icon: <CheckCircle2 size={18} />,
    color: "#22c55e",
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.32)",
  },
  warning: {
    icon: <TriangleAlert size={18} />,
    color: "#f59e0b",
    background: "rgba(245, 158, 11, 0.13)",
    border: "rgba(245, 158, 11, 0.34)",
  },
  danger: {
    icon: <XCircle size={18} />,
    color: "var(--ui-danger)",
    background: "color-mix(in srgb, var(--ui-danger) 12%, transparent)",
    border: "color-mix(in srgb, var(--ui-danger) 34%, var(--ui-border))",
  },
  neutral: {
    icon: <AlertCircle size={18} />,
    color: "var(--ui-text-muted)",
    background: "var(--ui-surface-2)",
    border: "var(--ui-border)",
  },
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
    const config = alertVariantMap[variant];

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
        background: config.background,
        border: bordered
          ? `1px solid ${config.border}`
          : "1px solid transparent",
        color: "var(--ui-text)",
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
        color: config.color,
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
        margin: 0,
        fontSize: "var(--ui-font-size-sm)",
        fontWeight: 800,
        lineHeight: 1.45,
        color: "var(--ui-text)",
      },
    });

    const descriptionSlot = resolveSlot<AlertSlot>({
      slot: "description",
      styles,
      slotProps,
      baseStyle: {
        margin: 0,
        fontSize: "var(--ui-font-size-sm)",
        lineHeight: 1.45,
        color: "var(--ui-text-muted)",
      },
    });

    const childrenSlot = resolveSlot<AlertSlot>({
      slot: "children",
      styles,
      slotProps,
      baseStyle: {
        margin: 0,
        fontSize: "var(--ui-font-size-sm)",
        lineHeight: 1.45,
        color:
          title || description ? "var(--ui-text-muted)" : "var(--ui-text)",
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
          <div {...iconSlot}>{icon ?? config.icon}</div>

          <div {...contentSlot}>
            {title ? <div {...titleSlot}>{title}</div> : null}

            {description ? (
              <div {...descriptionSlot}>{description}</div>
            ) : null}

            {children ? <div {...childrenSlot}>{children}</div> : null}
          </div>

          {action ? <div {...actionSlot}>{action}</div> : null}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";