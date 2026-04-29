// src/components/feedback/EmptyState.tsx
import React from "react";
import { Box, Stack } from "../../primitives/layout";
import { Heading, Typography } from "../../primitives/typography";
import { Button } from "../../primitives/forms";

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
      ...rest
    },
    ref
  ) => {
    const textAlign = align;
    const itemsAlign = align === "center" ? "center" : "flex-start";

    return (
      <Box
        ref={ref as React.Ref<Element>}
        className={className}
        style={{
          width: "100%",
          minWidth: 0,
          padding: compact ? "1.25rem" : "2rem",
          borderRadius: "var(--ui-radius-lg)",
          background: "var(--ui-surface)",
          border: bordered ? "1px dashed var(--ui-border)" : "none",
          color: "var(--ui-text)",
          ...style,
        }}
        {...rest}
      >
        <Stack
          align={itemsAlign}
          spacing={compact ? "0.65rem" : "0.9rem"}
          style={{
            textAlign,
            minWidth: 0,
          }}
        >
          {icon ? (
            <Box
              aria-hidden="true"
              style={{
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
              }}
            >
              {icon}
            </Box>
          ) : null}

          {title ? (
            <Heading
              as="h3"
              size={compact ? "md" : "lg"}
              align={textAlign}
              style={{ margin: 0 }}
            >
              {title}
            </Heading>
          ) : null}

          {description ? (
            <Typography
              size={compact ? "sm" : "md"}
              color="var(--ui-text-muted)"
              align={textAlign}
              style={{
                maxWidth: align === "center" ? 520 : undefined,
                margin: align === "center" ? "0 auto" : undefined,
              }}
            >
              {description}
            </Typography>
          ) : null}

          {action ? (
            <Box style={{ marginTop: "0.25rem" }}>{action}</Box>
          ) : actionLabel && onAction ? (
            <Box style={{ marginTop: "0.25rem" }}>
              <Button onClick={onAction}>{actionLabel}</Button>
            </Box>
          ) : null}
        </Stack>
      </Box>
    );
  }
);

EmptyState.displayName = "EmptyState";