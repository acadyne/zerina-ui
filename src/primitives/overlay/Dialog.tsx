// src/primitives/overlay/Dialog.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";import {
  DismissableLayer,
  FocusScope,
  getLayerZIndex,
  Portal,
  ScrollLock,
} from "../../core/overlay";
import { useOptionalUIMotion } from "../../core/motion";
import { Button, type ButtonProps } from "../forms/Button";

type DialogSize = "sm" | "md" | "lg" | "xl";

const DIALOG_SIZE_MAP: Record<
  DialogSize,
  {
    width: React.CSSProperties["width"];
    maxWidth: React.CSSProperties["maxWidth"];
  }
> = {
  sm: { width: "420px", maxWidth: "92vw" },
  md: { width: "560px", maxWidth: "92vw" },
  lg: { width: "720px", maxWidth: "94vw" },
  xl: { width: "880px", maxWidth: "96vw" },
};

type DialogContextValue = {
  open: boolean;
  overlayId: string;
  titleId: string;
  descriptionId: string;
  setTitleMounted: (mounted: boolean) => void;
  setDescriptionMounted: (mounted: boolean) => void;
  hasTitle: boolean;
  hasDescription: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);

  if (!ctx) {
    throw new Error("Dialog subcomponents must be used inside <Dialog />");
  }

  return ctx;
}

export interface DialogProps {
  children?: React.ReactNode;

  open: boolean;
  onOpenChange?: (open: boolean) => void;

  closeOnEscape?: boolean;
  closeOnPointerDownOutside?: boolean;

  modal?: boolean;
  lockScroll?: boolean;

  restoreFocus?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;

  portalled?: boolean;
  container?: Element | DocumentFragment | null;

  size?: DialogSize;
  overlayId?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  open,
  onOpenChange,
  closeOnEscape = true,
  closeOnPointerDownOutside = true,
  modal = true,
  lockScroll = true,
  restoreFocus = true,
  trapFocus = true,
  autoFocus = true,
  initialFocusRef,
  portalled = true,
  container,
  size = "md",
  overlayId: overlayIdProp,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const overlayId = overlayIdProp ?? `dialog-${reactId}`;
  const titleId = `${overlayId}-title`;
  const descriptionId = `${overlayId}-description`;

  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const motionState = useOptionalUIMotion();

  const panelVariants = motionState.getVariants(
    "dialog",
    motionState.effectiveLevel
  );

  const panelTransition = motionState.getTransition(
    motionState.effectiveLevel,
    "scale"
  );

  const backdropTransition = motionState.getTransition(
    motionState.effectiveLevel,
    "fade"
  );

  const handleDismiss = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const contextValue = React.useMemo<DialogContextValue>(
    () => ({
      open,
      overlayId,
      titleId,
      descriptionId,
      setTitleMounted: setHasTitle,
      setDescriptionMounted: setHasDescription,
      hasTitle,
      hasDescription,
      onOpenChange,
    }),
    [
      open,
      overlayId,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
      onOpenChange,
    ]
  );

  const content = (
    <DialogContext.Provider value={contextValue}>
      <AnimatePresence>
        {open ? (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: getLayerZIndex("modal"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "max(16px, env(safe-area-inset-top))",
              paddingRight: "max(16px, env(safe-area-inset-right))",
              paddingBottom: "max(16px, env(safe-area-inset-bottom))",
              paddingLeft: "max(16px, env(safe-area-inset-left))",
              pointerEvents: "none",
            }}
          >
            {modal ? (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={backdropTransition}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "var(--ui-overlay)",
                  zIndex: getLayerZIndex("modalBackdrop"),
                  pointerEvents: "auto",
                }}
              />
            ) : null}

            <DismissableLayer
              overlayId={overlayId}
              layer={getLayerZIndex("modal")}
              enabled={open}
              dismissOnEscape={closeOnEscape}
              dismissOnPointerDownOutside={closeOnPointerDownOutside}
              onDismiss={handleDismiss}
              style={{
                position: "relative",
                zIndex: getLayerZIndex("modal"),
                width: "100%",
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <FocusScope
                overlayId={overlayId}
                enabled={open}
                contain={trapFocus}
                autoFocus={autoFocus}
                restoreFocus={restoreFocus}
                initialFocusRef={initialFocusRef}
                style={{
                  position: "relative",
                  zIndex: getLayerZIndex("modal"),
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  pointerEvents: "auto",
                }}
              >
                <motion.div
                  role="dialog"
                  aria-modal={modal ? true : undefined}
                  aria-labelledby={hasTitle ? titleId : undefined}
                  aria-describedby={hasDescription ? descriptionId : undefined}
                  data-ui="modal-content"
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={panelTransition}
                  style={{
                    width: DIALOG_SIZE_MAP[size].width,
                    maxWidth: DIALOG_SIZE_MAP[size].maxWidth,
                    maxHeight: "min(88vh, 88dvh)",
                    overflow: "auto",
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                    borderRadius: "var(--ui-radius-xl)",
                    border: "1px solid var(--ui-border)",
                    background: "var(--ui-surface)",
                    color: "var(--ui-text)",
                    boxShadow: "var(--ui-shadow-lg)",
                    outline: "none",
                    transformOrigin: "center",
                  }}
                >
                  {children}
                </motion.div>
              </FocusScope>

              {lockScroll ? (
                <ScrollLock overlayId={overlayId} enabled={open} active={open} />
              ) : null}
            </DismissableLayer>
          </div>
        ) : null}
      </AnimatePresence>
    </DialogContext.Provider>
  );

  return portalled ? <Portal container={container}>{content}</Portal> : content;
};

Dialog.displayName = "Dialog";

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

DialogContent.displayName = "DialogContent";

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          padding: "1rem 1rem 0.75rem 1rem",
          borderBottom: "1px solid var(--ui-border)",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

DialogHeader.displayName = "DialogHeader";

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "1rem",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

DialogBody.displayName = "DialogBody";

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem",
          flexWrap: "wrap",
          padding: "0.75rem 1rem 1rem 1rem",
          borderTop: "1px solid var(--ui-border)",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

DialogFooter.displayName = "DialogFooter";

export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  as?: React.ElementType;
}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, as: Comp = "h2", style, ...rest }, ref) => {
    const ctx = useDialogContext();

    React.useEffect(() => {
      ctx.setTitleMounted(true);
      return () => {
        ctx.setTitleMounted(false);
      };
    }, [ctx]);

    return (
      <Comp
        ref={ref as React.Ref<any>}
        id={ctx.titleId}
        style={{
          margin: 0,
          fontSize: "1.125rem",
          fontWeight: 800,
          lineHeight: 1.2,
          color: "var(--ui-text)",
          ...style,
        }}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);

DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ children, style, ...rest }, ref) => {
  const ctx = useDialogContext();

  React.useEffect(() => {
    ctx.setDescriptionMounted(true);
    return () => {
      ctx.setDescriptionMounted(false);
    };
  }, [ctx]);

  return (
    <p
      ref={ref}
      id={ctx.descriptionId}
      style={{
        margin: 0,
        fontSize: "var(--ui-font-size-sm)",
        lineHeight: 1.45,
        color: "var(--ui-text-muted)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
});

DialogDescription.displayName = "DialogDescription";

export interface DialogCloseProps extends Omit<ButtonProps, "type"> {
  children?: React.ReactNode;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, onClick, ...rest }, ref) => {
    const ctx = useDialogContext();

    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="sm"
        onClick={(event) => {
          ctx.onOpenChange?.(false);
          onClick?.(event);
        }}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

DialogClose.displayName = "DialogClose";