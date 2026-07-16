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
import { usePress } from "../../core/interaction";
import { useOptionalUIMotion } from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type ToastVariant =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type ToastSlot =
  | "root"
  | "inner"
  | "icon"
  | "content"
  | "title"
  | "description"
  | "action"
  | "closeButton"
  | "closeIcon";

export type ToastStyles = SlotStyleMap<ToastSlot>;

export type ToastSlotProps = SlotPropsMap<ToastSlot>;

export interface ToastProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "style"
    | "title"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
    | "custom"
  > {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: ToastVariant;
  icon?: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
  className?: string;
  style?: React.CSSProperties;

  styles?: ToastStyles;
  slotProps?: ToastSlotProps;
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
    border:
      "color-mix(in srgb, var(--ui-primary) 36%, var(--ui-border))",
  },

  success: {
    icon: <CheckCircle2 size={18} />,
    color: "var(--ui-success)",
    border:
      "color-mix(in srgb, var(--ui-success) 34%, var(--ui-border))",
  },

  warning: {
    icon: <TriangleAlert size={18} />,
    color: "var(--ui-warning)",
    border:
      "color-mix(in srgb, var(--ui-warning) 36%, var(--ui-border))",
  },

  danger: {
    icon: <XCircle size={18} />,
    color: "var(--ui-danger)",
    border:
      "color-mix(in srgb, var(--ui-danger) 36%, var(--ui-border))",
  },

  neutral: {
    icon: <Info size={18} />,
    color: "var(--ui-text-muted)",
    border: "var(--ui-border)",
  },
};

export const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps
>(
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
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const motionState = useOptionalUIMotion();
    const config = toastVariantMap[variant];

    const closeButtonSlotProps =
      slotProps?.closeButton;

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
    } = closeButtonSlotProps ?? {};

    const variants = motionState.getVariants(
      "feedback",
      motionState.effectiveLevel
    );

    const transition = motionState.getTransition(
      motionState.effectiveLevel,
      "feedback"
    );

    const closePress = usePress<HTMLButtonElement>({
      disabled: !closable,
      nativeInteractive: true,

      onPress: () => {
        onClose?.();
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
      onClick: slotOnClick,
    });

    const rootSlot = resolveSlot<ToastSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,

      baseProps: {
        role:
          variant === "danger" ||
          variant === "warning"
            ? "alert"
            : "status",

        "aria-live":
          variant === "danger" ||
          variant === "warning"
            ? "assertive"
            : "polite",

        "data-ui-toast": "",
        "data-ui-toast-variant": variant,
      },

      baseStyle: {
        width: "min(420px, calc(100vw - 24px))",
        borderRadius: "var(--ui-radius-xl)",
        border: `1px solid ${config.border}`,
        background: "var(--ui-surface)",
        color: "var(--ui-text)",
        boxShadow: "var(--ui-shadow-lg)",
        overflow: "hidden",
      },
    });

    const innerSlot = resolveSlot<ToastSlot>({
      slot: "inner",
      styles,
      slotProps,

      baseStyle: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: "0.75rem",
        padding: "0.85rem",
        minWidth: 0,
      },
    });

    const iconSlot = resolveSlot<ToastSlot>({
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

    const contentSlot = resolveSlot<ToastSlot>({
      slot: "content",
      styles,
      slotProps,

      baseStyle: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      },
    });

    const titleSlot = resolveSlot<ToastSlot>({
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

    const descriptionSlot = resolveSlot<ToastSlot>({
      slot: "description",
      styles,
      slotProps,

      baseStyle: {
        margin: 0,
        fontSize: "var(--ui-font-size-sm)",
        fontWeight: 400,
        lineHeight: 1.45,
        color: "var(--ui-text-muted)",
      },
    });

    const actionSlot = resolveSlot<ToastSlot>({
      slot: "action",
      styles,
      slotProps,

      baseStyle: {
        marginTop: "0.45rem",
      },
    });

    const closeButtonSlot = resolveSlot<ToastSlot>({
      slot: "closeButton",
      styles,
      slotProps,

      baseProps: {
        "aria-label": "Cerrar notificación",

        "data-hovered":
          closePress.state.hovered ||
          undefined,

        "data-pressed":
          closePress.state.pressed ||
          undefined,

        "data-focused":
          closePress.state.focused ||
          undefined,

        "data-focus-visible":
          closePress.state.focusVisible ||
          undefined,
      },

      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        width: 28,
        height: 28,

        borderRadius:
          "var(--ui-radius-full)",

        border:
          "1px solid transparent",

        background:
          closePress.state.hovered
            ? "var(--ui-surface-hover)"
            : "transparent",

        color:
          closePress.state.hovered
            ? "var(--ui-text)"
            : "var(--ui-text-muted)",

        cursor: "pointer",
        flexShrink: 0,
        outline: "none",

        boxShadow:
          closePress.state.focusVisible
            ? "0 0 0 3px var(--ui-focus-ring)"
            : "none",

        transition:
          "background var(--ui-duration-normal) var(--ui-ease-standard), " +
          "color var(--ui-duration-normal) var(--ui-ease-standard), " +
          "box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
      },
    });

    const closeIconSlot = resolveSlot<ToastSlot>({
      slot: "closeIcon",
      styles,
      slotProps,

      baseProps: {
        "aria-hidden": true,
      },

      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      },
    });

    return (
      <motion.div
        {...rest}
        {...toMotionSlotProps(rootSlot)}
        ref={ref}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        <div {...innerSlot}>
          <div {...iconSlot}>
            {icon ?? config.icon}
          </div>

          <div {...contentSlot}>
            {title ? (
              <div {...titleSlot}>
                {title}
              </div>
            ) : null}

            {description ? (
              <div {...descriptionSlot}>
                {description}
              </div>
            ) : null}

            {action ? (
              <div {...actionSlot}>
                {action}
              </div>
            ) : null}
          </div>

          {closable ? (
            <button
              {...closeButtonSlot}
              {...closePress.pressProps}
              type="button"
            >
              <span {...closeIconSlot}>
                <X size={16} />
              </span>
            </button>
          ) : null}
        </div>
      </motion.div>
    );
  }
);

Toast.displayName = "Toast";