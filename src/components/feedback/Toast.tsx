// src/components/feedback/Toast.tsx
import React from "react";
import {
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Box, Flex, Stack } from "../../primitives/layout";
import { Typography } from "../../primitives/typography";
import { useOptionalUIMotion } from "../../core/motion";

export type ToastVariant = "info" | "success" | "warning" | "danger" | "neutral";

export interface ToastProps
  extends Omit<HTMLMotionProps<"div">, "children" | "style" | "title"> {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: ToastVariant;
  icon?: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
  style?: React.CSSProperties;
}

const toastVariantMap: Record<
  ToastVariant,
  {
    icon: React.ReactNode;
    color: string;
    border: string;
  }
> = {
  info: {
    icon: <Info size={18} />,
    color: "var(--ui-primary)",
    border: "color-mix(in srgb, var(--ui-primary) 36%, var(--ui-border))",
  },
  success: {
    icon: <CheckCircle2 size={18} />,
    color: "#22c55e",
    border: "rgba(34, 197, 94, 0.34)",
  },
  warning: {
    icon: <TriangleAlert size={18} />,
    color: "#f59e0b",
    border: "rgba(245, 158, 11, 0.36)",
  },
  danger: {
    icon: <XCircle size={18} />,
    color: "var(--ui-danger)",
    border: "color-mix(in srgb, var(--ui-danger) 36%, var(--ui-border))",
  },
  neutral: {
    icon: <Info size={18} />,
    color: "var(--ui-text-muted)",
    border: "var(--ui-border)",
  },
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      title,
      description,
      action,
      variant = "info",
      icon,
      onClose,
      closable = true,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();
    const config = toastVariantMap[variant];

    const variants = motionState.getVariants(
      "feedback",
      motionState.effectiveLevel
    );

    const transition = motionState.getTransition(
      motionState.effectiveLevel,
      "feedback"
    );

    return (
      <motion.div
        ref={ref}
        role={variant === "danger" || variant === "warning" ? "alert" : "status"}
        aria-live={variant === "danger" || variant === "warning" ? "assertive" : "polite"}
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        style={{
          width: "min(420px, calc(100vw - 24px))",
          borderRadius: "var(--ui-radius-xl)",
          border: `1px solid ${config.border}`,
          background: "var(--ui-surface)",
          color: "var(--ui-text)",
          boxShadow: "var(--ui-shadow-lg)",
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        <Box style={{ padding: "0.85rem", minWidth: 0 }}>
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

            <Stack spacing="0.25rem" style={{ flex: 1, minWidth: 0 }}>
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

              {action ? (
                <Box style={{ marginTop: "0.45rem" }}>
                  {action}
                </Box>
              ) : null}
            </Stack>

            {closable ? (
              <button
                type="button"
                aria-label="Cerrar notificación"
                onClick={onClose}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: "var(--ui-radius-full)",
                  border: "1px solid transparent",
                  background: "transparent",
                  color: "var(--ui-text-muted)",
                  cursor: "pointer",
                  flexShrink: 0,
                  outline: "none",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = "var(--ui-surface-hover)";
                  event.currentTarget.style.color = "var(--ui-text)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "transparent";
                  event.currentTarget.style.color = "var(--ui-text-muted)";
                }}
                onFocus={(event) => {
                  event.currentTarget.style.boxShadow =
                    "0 0 0 3px var(--ui-focus-ring)";
                }}
                onBlur={(event) => {
                  event.currentTarget.style.boxShadow = "none";
                }}
              >
                <X size={16} />
              </button>
            ) : null}
          </Flex>
        </Box>
      </motion.div>
    );
  }
);

Toast.displayName = "Toast";