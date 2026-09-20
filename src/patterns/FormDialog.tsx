import { typographyRecipe } from "../theme/recipes";
import React from "react";

import {
  hasNonEmptyRenderableNode,
  hasRenderableNode,
} from "../core/react/nodePresence";

import {
  Button,
} from "../primitives/forms/Button";

import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../primitives/overlay";


export interface FormDialogProps {
  open:
    boolean;

  onOpenChange?: (
    open: boolean,
  ) => void;

  title:
    React.ReactNode;

  description?:
    React.ReactNode;

  children?:
    React.ReactNode;

  submitLabel?:
    React.ReactNode;

  cancelLabel?:
    React.ReactNode;

  onSubmit?: (
    event:
      React.FormEvent<HTMLFormElement>,
  ) =>
    | void
    | Promise<void>;

  onCancel?:
    () => void;

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
    React.ReactNode;

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


export const FormDialog:
  React.FC<FormDialogProps> = ({
    open,
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
  }) => {
    const isSubmitDisabled =
      loading ||
      disabled;

    const hasDescription =
      hasNonEmptyRenderableNode(
        description,
      );

    const hasTargetLabel =
      hasNonEmptyRenderableNode(
        targetLabel,
      );

    const hasError =
      hasNonEmptyRenderableNode(
        error,
      );

    const hasCustomFooter =
      hasRenderableNode(
        footer,
      );


    /*
     * FormDialog es el único owner de la semántica "cancelar y cerrar".
     *
     * Tanto el botón Cancel como un dismiss del Dialog llegan a esta función.
     * Los adaptadores superiores sólo traducen el payload de onCancel; no
     * vuelven a cerrar ni redisparan la cancelación.
     */
    const requestCancel =
      React.useCallback(
        () => {
          onCancel?.();

          onOpenChange?.(
            false,
          );
        },
        [
          onCancel,
          onOpenChange,
        ],
      );


    const handleSubmit =
      React.useCallback(
        async (
          event:
            React.FormEvent<HTMLFormElement>,
        ) => {
          event.preventDefault();

          const result =
            onSubmit?.(
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

          requestCancel();
        },
        [
          onOpenChange,
          requestCancel,
        ],
      );


    return (
      <Dialog
        open={open}
        onOpenChange={
          handleDialogOpenChange
        }
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
      >
        <form
          {...formProps}
          onSubmit={
            handleSubmit
          }
        >
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>

            {(
              hasDescription ||
              hasTargetLabel
            ) ? (
              <DialogDescription>
                {description}

                {hasTargetLabel ? (
                  <span
                    style={{
                      display:
                        "block",

                      marginTop:
                        hasDescription
                          ? "0.45rem"
                          : 0,

                      fontWeight:
                        600,

                      color:
                        "var(--ui-text)",
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
                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  "0.9rem",

                minWidth:
                  0,
              }}
            >
              {hasError ? (
                <div
                  role="alert"
                  style={{
                    padding:
                      "0.75rem 0.85rem",

                    borderRadius:
                      "var(--ui-radius-md)",

                    border:
                      "1px solid var(--ui-danger)",

                    background:
                      "color-mix(in srgb, var(--ui-danger) 10%, transparent)",

                    color:
                      "var(--ui-text)",

                    ...typographyRecipe({
                      role: "label",
                    }),
                  }}
                >
                  {error}
                </div>
              ) : null}

              {children}
            </div>
          </DialogBody>

          <DialogFooter>
            {hasCustomFooter ? (
              footer
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  colorScheme="secondary"
                  size="sm"
                  onPress={
                    requestCancel
                  }
                  disabled={
                    loading
                  }
                >
                  {cancelLabel}
                </Button>

                <Button
                  type="submit"
                  colorScheme="primary"
                  size="sm"
                  disabled={
                    isSubmitDisabled
                  }
                  isLoading={
                    loading
                  }
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


FormDialog.displayName =
  "FormDialog";
