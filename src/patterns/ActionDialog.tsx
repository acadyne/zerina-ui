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
  type TargetDialogRenderProps,
} from "./shared/targetDialogContract";


export type ActionDialogVariant =
  | "default"
  | "primary"
  | "danger";


export interface ActionDialogProps<
  TTarget,
> extends TargetDialogRenderProps<TTarget> {
  state:
    ModalState<TTarget>;

  onOpenChange?: (
    open: boolean,
  ) => void;

  title:
    React.ReactNode;

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

  initialFocusRef?:
    React.RefObject<
      HTMLElement | null
    >;

  closeOnEscape?:
    boolean;

  closeOnPointerDownOutside?:
    boolean;

}


export function ActionDialog<
  TTarget,
>({
  state,
  onOpenChange,

  title,
  renderDescription,
  renderBody,

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

  renderTargetLabel,
  initialFocusRef,

  closeOnEscape = true,

  closeOnPointerDownOutside =
    true,

  renderFooter,
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
      renderDescription={
        renderDescription
      }
      renderTargetLabel={
        renderTargetLabel
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
      renderFooter={
        renderFooter
      }
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
      renderBody={
        renderBody
      }
    />
  );
}

ActionDialog.displayName =
  "ActionDialog";
