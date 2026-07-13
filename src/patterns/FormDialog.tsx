// src/layout/ui/patterns/FormDialog.tsx
import React from "react";
import { 
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
 } from "../primitives/overlay";
import { Button } from "../primitives/forms/Button";

export interface FormDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;

  title: React.ReactNode;
  description?: React.ReactNode;

  children?: React.ReactNode;

  submitLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;

  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancel?: () => void;

  loading?: boolean;
  disabled?: boolean;
  error?: React.ReactNode;

  size?: "sm" | "md" | "lg" | "xl";

  targetLabel?: React.ReactNode;

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

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
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
}) => {
  const isSubmitDisabled = loading || disabled;

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    handleClose();
  }, [onCancel, handleClose]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const result = onSubmit?.(event);

      if (result instanceof Promise) {
        await result;
      }
    },
    [onSubmit]
  );

  const handleDialogOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        onOpenChange?.(true);
        return;
      }

      onCancel?.();
      onOpenChange?.(false);
    },
    [onCancel, onOpenChange]
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
      <form onSubmit={handleSubmit} {...formProps}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description || targetLabel ? (
            <DialogDescription>
              {description}
              {targetLabel ? (
                <span
                  style={{
                    display: "block",
                    marginTop: description ? "0.45rem" : 0,
                    fontWeight: 600,
                    color: "var(--ui-text)",
                  }}
                >
                  {targetLabel}
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

            {children}
          </div>
        </DialogBody>

        <DialogFooter>
          {footer ? (
            footer
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
                type="submit"
                colorScheme="primary"
                size="sm"
                disabled={isSubmitDisabled}
                isLoading={loading}
                loadingText="Guardando..."
              >
                {submitLabel}
              </Button>
            </>
          )}
        </DialogFooter>
      </form>
    </Dialog>
  );
};

FormDialog.displayName = "FormDialog";