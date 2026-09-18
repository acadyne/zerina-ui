import React from "react";

import {
  FormDialog,
} from "./FormDialog";

import type {
  ModalState,
} from "./state";

import {
  hasDialogTarget,
  resolveRenderableWithTarget,
  type RenderableWithTarget,
} from "./shared/targetDialogContract";


export interface TargetFormDialogProps<
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

  submitLabel?:
    React.ReactNode;

  cancelLabel?:
    React.ReactNode;

  onSubmit: (
    target:
      TTarget,

    event:
      React.FormEvent<HTMLFormElement>,
  ) =>
    | void
    | Promise<void>;

  onCancel?: (
    target:
      TTarget | null,
  ) => void;

  loading?:
    boolean;

  disabled?:
    boolean;

  error?:
    React.ReactNode;

  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl";

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
    React.ReactNode;

  formProps?:
    Omit<
      React.FormHTMLAttributes<HTMLFormElement>,
      | "onSubmit"
      | "children"
    >;
}


export function TargetFormDialog<
  TTarget,
>({
  state,
  onOpenChange,

  title,
  description,
  children,

  submitLabel =
    "Guardar",

  cancelLabel =
    "Cancelar",

  onSubmit,
  onCancel,

  loading = false,
  disabled = false,
  error,

  size = "md",

  targetLabel,

  initialFocusRef,

  closeOnEscape = true,

  closeOnPointerDownOutside =
    false,

  footer,
  formProps,
}: TargetFormDialogProps<TTarget>) {
  const open =
    state.isOpen;

  const target =
    state.isOpen
      ? state.target
      : null;

  const resolvedDescription =
    resolveRenderableWithTarget(
      description,
      target,
    );

  const resolvedTargetLabel =
    resolveRenderableWithTarget(
      targetLabel,
      target,
    );

  const resolvedChildren =
    resolveRenderableWithTarget(
      children,
      target,
    );


  const handleCancel =
    React.useCallback(
      () => {
        onCancel?.(
          target,
        );
      },
      [
        onCancel,
        target,
      ],
    );


  const handleSubmit =
    React.useCallback(
      async (
        event:
          React.FormEvent<HTMLFormElement>,
      ) => {
        if (
          !hasDialogTarget(
            target,
          )
        ) {
          return;
        }

        const result =
          onSubmit(
            target,
            event,
          );

        if (
          result instanceof
          Promise
        ) {
          await result;
        }
      },
      [
        onSubmit,
        target,
      ],
    );


  return (
    <FormDialog
      open={open}
      onOpenChange={
        onOpenChange
      }
      title={title}
      description={
        resolvedDescription
      }
      submitLabel={
        submitLabel
      }
      cancelLabel={
        cancelLabel
      }
      onSubmit={
        handleSubmit
      }
      onCancel={
        handleCancel
      }
      loading={
        loading
      }
      disabled={
        disabled ||
        !hasDialogTarget(
          target,
        )
      }
      error={error}
      size={size}
      targetLabel={
        resolvedTargetLabel
      }
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
      formProps={
        formProps
      }
    >
      {resolvedChildren}
    </FormDialog>
  );
}


TargetFormDialog.displayName =
  "TargetFormDialog";
