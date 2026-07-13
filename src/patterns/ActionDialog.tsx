// src/layout/ui/patterns/ActionDialog.tsx
import React from "react";
import type { ModalState } from "./state";
import { 
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
 } from "../primitives/overlay";
import { Button } from "../primitives/forms/Button";

export type ActionDialogVariant = "default" | "primary" | "danger";

type RenderableWithTarget<TTarget> =
  | React.ReactNode
  | ((target: TTarget) => React.ReactNode);

function resolveRenderable<TTarget>(
  value: RenderableWithTarget<TTarget> | undefined,
  target: TTarget | null
): React.ReactNode {
  if (typeof value === "function") {
    return target ? (value as (target: TTarget) => React.ReactNode)(target) : null;
  }

  return value ?? null;
}

export interface ActionDialogProps<TTarget> {
  state: ModalState<TTarget>;
  onOpenChange?: (open: boolean) => void;

  title: React.ReactNode;
  description?: RenderableWithTarget<TTarget>;
  children?: RenderableWithTarget<TTarget>;

  actionLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;

  onAction: (target: TTarget) => void | Promise<void>;
  onCancel?: (target: TTarget | null) => void;

  loading?: boolean;
  disabled?: boolean;
  error?: React.ReactNode;

  variant?: ActionDialogVariant;
  size?: "sm" | "md" | "lg" | "xl";

  targetLabel?: RenderableWithTarget<TTarget>;

  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnEscape?: boolean;
  closeOnPointerDownOutside?: boolean;
  lockScroll?: boolean;

  footer?: RenderableWithTarget<TTarget>;
}

export function ActionDialog<TTarget>({
  state,
  onOpenChange,
  title,
  description,
  children,
  actionLabel = "Continuar",
  cancelLabel = "Cancelar",
  onAction,
  onCancel,
  loading = false,
  disabled = false,
  error,
  variant = "primary",
  size = "md",
  targetLabel,
  initialFocusRef,
  closeOnEscape = true,
  closeOnPointerDownOutside = true,
  lockScroll = true,
  footer,
}: ActionDialogProps<TTarget>) {
  const open = state.isOpen;
  const target = state.isOpen ? state.target : null;
  const isActionDisabled = loading || disabled || !target;

  const resolvedDescription = resolveRenderable(description, target);
  const resolvedTargetLabel = resolveRenderable(targetLabel, target);
  const resolvedChildren = resolveRenderable(children, target);
  const resolvedFooter = resolveRenderable(footer, target);

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleCancel = React.useCallback(() => {
    onCancel?.(target);
    handleClose();
  }, [onCancel, target, handleClose]);

  const handleAction = React.useCallback(async () => {
    if (!target) {
      return;
    }

    const result = onAction(target);

    if (result instanceof Promise) {
      await result;
    }
  }, [onAction, target]);

  const handleDialogOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        onOpenChange?.(true);
        return;
      }

      onCancel?.(target);
      onOpenChange?.(false);
    },
    [onCancel, onOpenChange, target]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogOpenChange}
      size={size}
      initialFocusRef={initialFocusRef}
      closeOnEscape={closeOnEscape}
      closeOnPointerDownOutside={closeOnPointerDownOutside}
      lockScroll={lockScroll}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>

        {resolvedDescription || resolvedTargetLabel ? (
          <DialogDescription>
            {resolvedDescription}
            {resolvedTargetLabel ? (
              <span
                style={{
                  display: "block",
                  marginTop: resolvedDescription ? "0.45rem" : 0,
                  fontWeight: 600,
                  color: "var(--ui-text)",
                }}
              >
                {resolvedTargetLabel}
              </span>
            ) : null}
          </DialogDescription>
        ) : null}
      </DialogHeader>

      <DialogBody>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.9rem",
            minWidth: 0,
          }}
        >
          {error ? (
            <div
              role="alert"
              style={{
                padding: "0.75rem 0.85rem",
                borderRadius: "var(--ui-radius-md)",
                border: "1px solid var(--ui-danger)",
                background:
                  "color-mix(in srgb, var(--ui-danger) 10%, transparent)",
                color: "var(--ui-text)",
                fontSize: "var(--ui-font-size-sm)",
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          ) : null}

          {resolvedChildren}
        </div>
      </DialogBody>

      <DialogFooter>
        {resolvedFooter ? (
          resolvedFooter
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              colorScheme="secondary"
              size="sm"
              onPress={handleCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>

            <Button
              type="button"
              colorScheme={
                variant === "danger"
                  ? "danger"
                  : variant === "primary"
                    ? "primary"
                    : "secondary"
              }
              variant={variant === "default" ? "outline" : "solid"}
              size="sm"
              onPress={handleAction}
              disabled={isActionDisabled}
              isLoading={loading}
              loadingText="Procesando..."
            >
              {actionLabel}
            </Button>
          </>
        )}
      </DialogFooter>
    </Dialog>
  );
}

ActionDialog.displayName = "ActionDialog";