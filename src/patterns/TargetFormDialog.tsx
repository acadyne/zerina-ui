// src/layout/ui/patterns/TargetFormDialog.tsx
import React from "react";
import type { ModalState } from "./state";
import { FormDialog } from "./FormDialog";

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

export interface TargetFormDialogProps<TTarget> {
  state: ModalState<TTarget>;
  onOpenChange?: (open: boolean) => void;

  title: React.ReactNode;
  description?: RenderableWithTarget<TTarget>;
  children?: RenderableWithTarget<TTarget>;

  submitLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;

  onSubmit: (
    target: TTarget,
    event: React.FormEvent<HTMLFormElement>
  ) => void | Promise<void>;

  onCancel?: (target: TTarget | null) => void;

  loading?: boolean;
  disabled?: boolean;
  error?: React.ReactNode;

  size?: "sm" | "md" | "lg" | "xl";

  targetLabel?: RenderableWithTarget<TTarget>;

  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnEscape?: boolean;
  closeOnPointerDownOutside?: boolean;
  lockScroll?: boolean;

  footer?: React.ReactNode;
  formProps?: Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "children"
  >;
}

export function TargetFormDialog<TTarget>({
  state,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  onSubmit,
  onCancel,
  loading = false,
  disabled = false,
  error,
  size = "md",
  targetLabel,
  initialFocusRef,
  closeOnEscape = true,
  closeOnPointerDownOutside = false,
  lockScroll = true,
  footer,
  formProps,
}: TargetFormDialogProps<TTarget>) {
  const open = state.isOpen;
  const target = state.isOpen ? state.target : null;

  const resolvedDescription = resolveRenderable(description, target);
  const resolvedTargetLabel = resolveRenderable(targetLabel, target);
  const resolvedChildren = resolveRenderable(children, target);

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleCancel = React.useCallback(() => {
    onCancel?.(target);
    handleClose();
  }, [onCancel, target, handleClose]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (!target) {
        return;
      }

      await onSubmit(target, event);
    },
    [onSubmit, target]
  );

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
    <FormDialog
      open={open}
      onOpenChange={handleDialogOpenChange}
      title={title}
      description={resolvedDescription}
      submitLabel={submitLabel}
      cancelLabel={cancelLabel}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      disabled={disabled || !target}
      error={error}
      size={size}
      targetLabel={resolvedTargetLabel}
      initialFocusRef={initialFocusRef}
      closeOnEscape={closeOnEscape}
      closeOnPointerDownOutside={closeOnPointerDownOutside}
      lockScroll={lockScroll}
      footer={footer}
      formProps={formProps}
    >
      {resolvedChildren}
    </FormDialog>
  );
}

TargetFormDialog.displayName = "TargetFormDialog";