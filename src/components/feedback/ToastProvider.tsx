// src/components/feedback/ToastProvider.tsx
import React from "react";
import { MotionPresenceGroup } from "../../core/motion";
import { getLayerZIndex } from "../../core/overlay";
import {
  Toast,
  type ToastPauseReason,
  type ToastVariant,
} from "./Toast";

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
  Pick<
    ToastInput,
    "id" | "variant" | "duration" | "closable"
  >
> &
  Omit<
    ToastInput,
    "id" | "variant" | "duration" | "closable"
  >;

interface ToastTimerState {
  timeoutId: number | null;
  startedAt: number;
  remaining: number;
  pauseReasons: Set<ToastPauseReason>;
}

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

const ToastContext =
  React.createContext<ToastContextValue | null>(null);

function createToastId(): string {
  return `toast-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getPlacementStyles(
  placement: ToastPlacement
): React.CSSProperties {
  const common: React.CSSProperties = {
    position: "fixed",
    zIndex: getLayerZIndex("toast"),
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    pointerEvents: "none",
    padding:
      "max(12px, env(safe-area-inset-top)) " +
      "max(12px, env(safe-area-inset-right)) " +
      "max(12px, env(safe-area-inset-bottom)) " +
      "max(12px, env(safe-area-inset-left))",
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

export const ToastProvider: React.FC<
  ToastProviderProps
> = ({
  children,
  placement = "top-right",
  maxToasts = 5,
  defaultDuration = 4500,
}) => {
    const [toasts, setToasts] =
      React.useState<ToastRecord[]>([]);

    const timersRef = React.useRef<
      Map<string, ToastTimerState>
    >(new Map());

    const clearTimer = React.useCallback(
      (id: string) => {
        const timerState =
          timersRef.current.get(id);

        if (!timerState) {
          return;
        }

        if (timerState.timeoutId !== null) {
          window.clearTimeout(
            timerState.timeoutId
          );
        }

        timersRef.current.delete(id);
      },
      []
    );

    const dismiss = React.useCallback(
      (id: string) => {
        clearTimer(id);

        setToasts((current) =>
          current.filter((item) => item.id !== id)
        );
      },
      [clearTimer]
    );

    const startTimer = React.useCallback(
      (
        id: string,
        duration: number
      ) => {
        if (duration <= 0) {
          return;
        }

        const timerState: ToastTimerState = {
          timeoutId: null,
          startedAt: performance.now(),
          remaining: duration,
          pauseReasons:
            new Set<ToastPauseReason>(),
        };

        timerState.timeoutId =
          window.setTimeout(() => {
            timersRef.current.delete(id);
            dismiss(id);
          }, duration);

        timersRef.current.set(
          id,
          timerState
        );
      },
      [dismiss]
    );

    const pauseTimer = React.useCallback(
      (
        id: string,
        reason: ToastPauseReason
      ) => {
        const timerState =
          timersRef.current.get(id);

        if (!timerState) {
          return;
        }

        const wasAlreadyPaused =
          timerState.pauseReasons.size > 0;

        timerState.pauseReasons.add(reason);

        if (
          wasAlreadyPaused ||
          timerState.timeoutId === null
        ) {
          return;
        }

        const elapsed =
          performance.now() -
          timerState.startedAt;

        timerState.remaining = Math.max(
          0,
          timerState.remaining - elapsed
        );

        window.clearTimeout(
          timerState.timeoutId
        );

        timerState.timeoutId = null;
      },
      []
    );

    const resumeTimer = React.useCallback(
      (
        id: string,
        reason: ToastPauseReason
      ) => {
        const timerState =
          timersRef.current.get(id);

        if (!timerState) {
          return;
        }

        timerState.pauseReasons.delete(reason);

        if (
          timerState.pauseReasons.size > 0 ||
          timerState.timeoutId !== null
        ) {
          return;
        }

        if (timerState.remaining <= 0) {
          dismiss(id);
          return;
        }

        timerState.startedAt =
          performance.now();

        timerState.timeoutId =
          window.setTimeout(() => {
            timersRef.current.delete(id);
            dismiss(id);
          }, timerState.remaining);
      },
      [dismiss]
    );

    const clear = React.useCallback(() => {
      timersRef.current.forEach(
        (timerState) => {
          if (timerState.timeoutId !== null) {
            window.clearTimeout(
              timerState.timeoutId
            );
          }
        }
      );

      timersRef.current.clear();
      setToasts([]);
    }, []);

    const toast = React.useCallback(
      (input: ToastInput): string => {
        const id = input.id ?? createToastId();

        const nextToast: ToastRecord = {
          id,
          title: input.title,
          description: input.description,
          action: input.action,
          variant: input.variant ?? "info",
          duration:
            input.duration ?? defaultDuration,
          closable:
            input.closable ?? true,
        };

        clearTimer(id);

        setToasts((current) => {
          const withoutSameId = current.filter(
            (item) => item.id !== id
          );

          return [
            nextToast,
            ...withoutSameId,
          ].slice(0, Math.max(0, maxToasts));
        });

        startTimer(
          id,
          nextToast.duration
        );

        return id;
      },
      [
        clearTimer,
        defaultDuration,
        maxToasts,
        startTimer,
      ]
    );

    React.useEffect(() => {
      const visibleIds = new Set(
        toasts.map((item) => item.id)
      );

      timersRef.current.forEach((_, timerId) => {
        if (!visibleIds.has(timerId)) {
          clearTimer(timerId);
        }
      });
    }, [clearTimer, toasts]);

    React.useEffect(() => {
      return () => {
        timersRef.current.forEach(
          (timerState) => {
            if (
              timerState.timeoutId !== null
            ) {
              window.clearTimeout(
                timerState.timeoutId
              );
            }
          }
        );

        timersRef.current.clear();
      };
    }, []);

    const value =
      React.useMemo<ToastContextValue>(
        () => ({
          toasts,
          toast,
          dismiss,
          clear,
        }),
        [clear, dismiss, toast, toasts]
      );

    return (
      <ToastContext.Provider value={value}>
        {children}

        <div style={getPlacementStyles(placement)}>
          <MotionPresenceGroup initial={false}>
            {toasts.map((item) => (
              <Toast
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                action={item.action}
                variant={item.variant}
                closable={item.closable}
                onClose={() => {
                  dismiss(item.id);
                }}
                onPauseAutoDismiss={(reason) => {
                  pauseTimer(item.id, reason);
                }}
                onResumeAutoDismiss={(reason) => {
                  resumeTimer(item.id, reason);
                }}
                style={{
                  pointerEvents: "auto",
                }}
              />
            ))}
          </MotionPresenceGroup>
        </div>
      </ToastContext.Provider>
    );
  };

ToastProvider.displayName = "ToastProvider";

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside <ToastProvider />"
    );
  }

  return context;
}