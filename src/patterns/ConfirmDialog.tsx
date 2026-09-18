import React from "react";

import {
  useIsomorphicLayoutEffect,
} from "../core/react/useIsomorphicLayoutEffect";

import {
  Button,
} from "../primitives/forms/Button";

import type {
  ModalState,
} from "./state";

import {
  TargetDialogFrame,
} from "./shared/TargetDialogFrame";

import {
  hasDialogTarget,
  type RenderableWithTarget as SharedRenderableWithTarget,
} from "./shared/targetDialogContract";


export type ConfirmDialogVariant =
  | "default"
  | "destructive";

type RenderableWithTarget<
  TTarget,
> =
  SharedRenderableWithTarget<TTarget>;


export interface ConfirmDialogProps<
  TTarget,
> {
  state:
    ModalState<TTarget>;

  onOpenChange?: (
    open: boolean,
  ) => void;

  title:
    React.ReactNode;

  description?:
    RenderableWithTarget<TTarget>;

  confirmLabel?:
    React.ReactNode;

  cancelLabel?:
    React.ReactNode;

  onConfirm: (
    target: TTarget,
  ) =>
    | void
    | Promise<void>;

  onCancel?: (
    target:
      TTarget | null,
  ) => void;

  loading?: boolean;
  disabled?: boolean;
  error?: React.ReactNode;

  variant?:
    ConfirmDialogVariant;

  size?:
    "sm" |
    "md" |
    "lg" |
    "xl";

  targetLabel?:
    RenderableWithTarget<TTarget>;

  initialFocusRef?:
    React.RefObject<
      HTMLElement | null
    >;

  closeOnEscape?:
    boolean;

  closeOnPointerDownOutside?:
    boolean;

  children?:
    RenderableWithTarget<TTarget>;

  footer?:
    RenderableWithTarget<TTarget>;
}


export function ConfirmDialog<
  TTarget,
>({
  state,
  onOpenChange,

  title,
  description,

  confirmLabel =
    "Confirmar",

  cancelLabel =
    "Cancelar",

  onConfirm,
  onCancel,

  loading = false,
  disabled = false,
  error,

  variant = "default",
  size = "sm",

  targetLabel,
  initialFocusRef,

  closeOnEscape = true,

  closeOnPointerDownOutside =
    true,

  children,
  footer,
}: ConfirmDialogProps<TTarget>) {
  const open =
    state.isOpen;

  const target =
    state.isOpen
      ? state.target
      : null;

  const isActionDisabled =
    loading ||
    disabled ||
    !hasDialogTarget(target);

  const confirmOperationRef =
    React.useRef(
      0,
    );

  const dialogStateRef =
    React.useRef({
      open,
      target,
    });

  useIsomorphicLayoutEffect(
    () => {
      /*
       * La identidad solo cambia tras un commit. Una renderización descartada
       * no debe invalidar la confirmación perteneciente a la interfaz visible.
       */
      confirmOperationRef.current +=
        1;

      dialogStateRef.current = {
        open,
        target,
      };

      return () => {
        confirmOperationRef.current +=
          1;
      };
    },
    [
      open,
      target,
    ],
  );

  const handleClose =
    React.useCallback(
      () => {
        confirmOperationRef.current +=
          1;

        onOpenChange?.(
          false,
        );
      },
      [
        onOpenChange,
      ],
    );

  const handleCancel =
    React.useCallback(
      () => {
        onCancel?.(
          target,
        );

        handleClose();
      },
      [
        onCancel,
        target,
        handleClose,
      ],
    );

  const handleConfirm =
    React.useCallback(
      async () => {
        if (
          !hasDialogTarget(
            target,
          )
        ) {
          return;
        }

        const operationId =
          confirmOperationRef.current +
          1;

        const confirmationTarget =
          target;

        confirmOperationRef.current =
          operationId;

        const result =
          onConfirm(
            confirmationTarget,
          );

        if (
          result instanceof
          Promise
        ) {
          await result;
        }

        const currentDialogState =
          dialogStateRef.current;

        if (
          confirmOperationRef.current !==
            operationId ||
          !currentDialogState.open ||
          currentDialogState.target !==
            confirmationTarget
        ) {
          return;
        }

        handleClose();
      },
      [
        onConfirm,
        target,
        handleClose,
      ],
    );

  const handleDialogOpenChange =
    React.useCallback(
      (
        nextOpen:
          boolean,
      ) => {
        confirmOperationRef.current +=
          1;

        if (
          nextOpen
        ) {
          onOpenChange?.(
            true,
          );

          return;
        }

        onCancel?.(
          target,
        );

        onOpenChange?.(
          false,
        );
      },
      [
        onCancel,
        onOpenChange,
        target,
      ],
    );

  return (
    <TargetDialogFrame
      open={open}
      target={target}
      onOpenChange={
        handleDialogOpenChange
      }
      title={title}
      description={
        description
      }
      targetLabel={
        targetLabel
      }
      error={error}
      size={size}
      initialFocusRef={
        initialFocusRef
      }
      closeOnEscape={
        closeOnEscape
      }
      closeOnPointerDownOutside={
        closeOnPointerDownOutside
      }
      footer={footer}
      defaultFooter={
        <>
          <Button
            type="button"
            variant="ghost"
            colorScheme="secondary"
            size="sm"
            onPress={
              handleCancel
            }
            disabled={
              loading
            }
          >
            {
              cancelLabel
            }
          </Button>

          <Button
            type="button"
            colorScheme={
              variant ===
              "destructive"
                ? "danger"
                : "primary"
            }
            size="sm"
            onPress={
              handleConfirm
            }
            disabled={
              isActionDisabled
            }
            isLoading={
              loading
            }
            loadingText="Procesando..."
          >
            {
              confirmLabel
            }
          </Button>
        </>
      }
    >
      {children}
    </TargetDialogFrame>
  );
}

ConfirmDialog.displayName =
  "ConfirmDialog";
