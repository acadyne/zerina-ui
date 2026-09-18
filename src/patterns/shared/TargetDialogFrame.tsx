import React from "react";

import {
  hasNonEmptyRenderableNode,
  hasRenderableNode,
} from "../../core/react/nodePresence";

import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../primitives/overlay";

import {
  resolveRenderableWithTarget,
  type RenderableWithTarget,
} from "./targetDialogContract";


export interface TargetDialogFrameProps<
  TTarget,
> {
  open: boolean;

  target:
    TTarget | null;

  onOpenChange: (
    open: boolean,
  ) => void;

  title:
    React.ReactNode;

  description?:
    RenderableWithTarget<TTarget>;

  targetLabel?:
    RenderableWithTarget<TTarget>;

  children?:
    RenderableWithTarget<TTarget>;

  footer?:
    RenderableWithTarget<TTarget>;

  defaultFooter:
    React.ReactNode;

  error?:
    React.ReactNode;

  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl";

  initialFocusRef?:
    React.RefObject<
      HTMLElement | null
    >;

  closeOnEscape?:
    boolean;

  closeOnPointerDownOutside?:
    boolean;
}


/**
 * Estructura visual única de los diálogos orientados a un target.
 *
 * ConfirmDialog y ActionDialog conservan por separado su semántica de
 * operación/confirmación, pero no duplican header, description, error,
 * body, target label ni resolución de footer.
 */
export function TargetDialogFrame<
  TTarget,
>({
  open,
  target,
  onOpenChange,

  title,
  description,
  targetLabel,
  children,
  footer,
  defaultFooter,
  error,

  size = "md",

  initialFocusRef,

  closeOnEscape = true,
  closeOnPointerDownOutside =
    true,
}: TargetDialogFrameProps<TTarget>) {
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

  const resolvedFooter =
    resolveRenderableWithTarget(
      footer,
      target,
    );

  const hasDescription =
    hasNonEmptyRenderableNode(
      resolvedDescription,
    );

  const hasTargetLabel =
    hasNonEmptyRenderableNode(
      resolvedTargetLabel,
    );

  const hasError =
    hasNonEmptyRenderableNode(
      error,
    );

  const hasCustomFooter =
    hasRenderableNode(
      resolvedFooter,
    );


  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
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
      <DialogHeader>
        <DialogTitle>
          {title}
        </DialogTitle>

        {(
          hasDescription ||
          hasTargetLabel
        ) ? (
          <DialogDescription>
            {
              resolvedDescription
            }

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
                {
                  resolvedTargetLabel
                }
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

                fontSize:
                  "var(--ui-font-size-sm)",

                lineHeight:
                  1.4,
              }}
            >
              {error}
            </div>
          ) : null}

          {resolvedChildren}
        </div>
      </DialogBody>

      <DialogFooter>
        {hasCustomFooter
          ? resolvedFooter
          : defaultFooter}
      </DialogFooter>
    </Dialog>
  );
}
