import React from "react";

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


export type ActionDialogVariant =
  | "default"
  | "primary"
  | "danger";

type RenderableWithTarget<
  TTarget,
> =
  SharedRenderableWithTarget<TTarget>;


export interface ActionDialogProps<
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

  children?:
    RenderableWithTarget<TTarget>;

  actionLabel?:
    React.ReactNode;

  cancelLabel?:
    React.ReactNode;

  onAction: (
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
    ActionDialogVariant;

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

  footer?:
    RenderableWithTarget<TTarget>;
}


export function ActionDialog<
  TTarget,
>({
  state,
  onOpenChange,

  title,
  description,
  children,

  actionLabel =
    "Continuar",

  cancelLabel =
    "Cancelar",

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

  closeOnPointerDownOutside =
    true,

  footer,
}: ActionDialogProps<TTarget>) {
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

  const handleClose =
    React.useCallback(
      () => {
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

  const handleAction =
    React.useCallback(
      async () => {
        if (
          !hasDialogTarget(
            target,
          )
        ) {
          return;
        }

        const result =
          onAction(
            target,
          );

        if (
          result instanceof
          Promise
        ) {
          await result;
        }
      },
      [
        onAction,
        target,
      ],
    );

  const handleDialogOpenChange =
    React.useCallback(
      (
        nextOpen:
          boolean,
      ) => {
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
              "danger"
                ? "danger"
                : variant ===
                    "primary"
                  ? "primary"
                  : "secondary"
            }
            variant={
              variant ===
              "default"
                ? "outline"
                : "solid"
            }
            size="sm"
            onPress={
              handleAction
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
              actionLabel
            }
          </Button>
        </>
      }
    >
      {children}
    </TargetDialogFrame>
  );
}

ActionDialog.displayName =
  "ActionDialog";
