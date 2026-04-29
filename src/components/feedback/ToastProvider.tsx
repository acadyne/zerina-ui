// src/components/feedback/ToastProvider.tsx
import React from "react";
import { AnimatePresence } from "framer-motion";
import { getLayerZIndex } from "../../core/overlay";
import { Toast, type ToastVariant } from "./Toast";

export type ToastPlacement =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type ToastInput = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  closable?: boolean;
};

export type ToastRecord = Required<
  Pick<ToastInput, "id" | "variant" | "duration" | "closable">
> &
  Omit<ToastInput, "id" | "variant" | "duration" | "closable">;

export interface ToastContextValue {
  toasts: ToastRecord[];
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export interface ToastProviderProps {
  children?: React.ReactNode;
  placement?: ToastPlacement;
  maxToasts?: number;
  defaultDuration?: number;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function createToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getPlacementStyles(placement: ToastPlacement): React.CSSProperties {
  const common: React.CSSProperties = {
    position: "fixed",
    zIndex: getLayerZIndex("toast"),
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    pointerEvents: "none",
    padding:
      "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",
  };

  if (placement.startsWith("top")) {
    common.top = 0;
  } else {
    common.bottom = 0;
  }

  if (placement.endsWith("right")) {
    common.right = 0;
    common.alignItems = "flex-end";
  } else if (placement.endsWith("left")) {
    common.left = 0;
    common.alignItems = "flex-start";
  } else {
    common.left = "50%";
    common.transform = "translateX(-50%)";
    common.alignItems = "center";
  }

  return common;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  placement = "top-right",
  maxToasts = 5,
  defaultDuration = 4500,
}) => {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timersRef = React.useRef<Map<string, number>>(new Map());

  const clearTimer = React.useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = React.useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((current) => current.filter((item) => item.id !== id));
    },
    [clearTimer]
  );

  const clear = React.useCallback(() => {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current.clear();
    setToasts([]);
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = input.id ?? createToastId();

      const nextToast: ToastRecord = {
        id,
        title: input.title,
        description: input.description,
        action: input.action,
        variant: input.variant ?? "info",
        duration: input.duration ?? defaultDuration,
        closable: input.closable ?? true,
      };

      setToasts((current) => {
        const withoutSameId = current.filter((item) => item.id !== id);
        const next = [nextToast, ...withoutSameId].slice(0, maxToasts);
        const visibleIds = new Set(next.map((item) => item.id));

        timersRef.current.forEach((_, timerId) => {
          if (!visibleIds.has(timerId)) {
            clearTimer(timerId);
          }
        });

        return next;
      });

      clearTimer(id);

      if (nextToast.duration > 0) {
        const timer = window.setTimeout(() => {
          dismiss(id);
        }, nextToast.duration);

        timersRef.current.set(id, timer);
      }

      return id;
    },
    [clearTimer, defaultDuration, dismiss, maxToasts]
  );

  React.useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timersRef.current.clear();
    };
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toasts,
      toast,
      dismiss,
      clear,
    }),
    [toasts, toast, dismiss, clear]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div style={getPlacementStyles(placement)}>
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <Toast
              key={item.id}
              title={item.title}
              description={item.description}
              action={item.action}
              variant={item.variant}
              closable={item.closable}
              onClose={() => dismiss(item.id)}
              style={{
                pointerEvents: "auto",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider />");
  }

  return ctx;
}