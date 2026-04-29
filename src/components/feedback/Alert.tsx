// src/components/feedback/Alert.tsx
import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { Box, Flex, Stack } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";

export type AlertVariant = "info" | "success" | "warning" | "danger" | "neutral";

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
      ...rest
    },
    ref
  ) => {
    const config = alertVariantMap[variant];

    return (
      <Box
        ref={ref as React.Ref<Element>}
        role={variant === "danger" || variant === "warning" ? "alert" : "status"}
        className={className}
        rounded="var(--ui-radius-lg)"
        style={{
          width: "100%",
          minWidth: 0,
          padding: compact ? "0.75rem" : "0.9rem 1rem",
          background: config.background,
          border: bordered ? `1px solid ${config.border}` : "1px solid transparent",
          color: "var(--ui-text)",
          ...style,
        }}
        {...rest}
      >
        <Flex align="flex-start" justify="flex-start" gap="0.75rem">
          <Box
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: config.color,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {icon ?? config.icon}
          </Box>

          <Stack spacing="0.35rem" style={{ flex: 1, minWidth: 0 }}>
            {title ? (
              <Typography
                as="div"
                size="sm"
                weight={800}
                style={{ margin: 0 }}
              >
                {title}
              </Typography>
            ) : null}

            {description ? (
              <Typography
                as="div"
                size="sm"
                color="var(--ui-text-muted)"
                style={{ margin: 0 }}
              >
                {description}
              </Typography>
            ) : null}

            {children ? (
              <Typography
                as="div"
                size="sm"
                color={title || description ? "var(--ui-text-muted)" : "var(--ui-text)"}
                style={{ margin: 0 }}
              >
                {children}
              </Typography>
            ) : null}
          </Stack>

          {action ? (
            <Box style={{ flexShrink: 0 }}>
              {action}
            </Box>
          ) : null}
        </Flex>
      </Box>
    );
  }
);

Alert.displayName = "Alert";