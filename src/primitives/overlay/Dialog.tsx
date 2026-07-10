// src/primitives/overlay/Dialog.tsx
import React from "react";
import {
  DismissableLayer,
  FocusScope,
  getLayerZIndex,
  Portal,
  ScrollLock,
} from "../../core/overlay";
import {
  MotionOverlayBackdrop,
  MotionOverlayPanel,
  MotionOverlayPresence,
  MotionOverlayRoot,
} from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Button, type ButtonProps } from "../forms/Button";

type DialogSize = "sm" | "md" | "lg" | "xl";

export type DialogSlot =
  | "root"
  | "backdrop"
  | "dismissableLayer"
  | "focusScope"
  | "panel"
  | "content"
  | "header"
  | "body"
  | "footer"
  | "title"
  | "description"
  | "close";

export type DialogStyles = SlotStyleMap<DialogSlot>;

export type DialogSlotProps = SlotPropsMap<DialogSlot>;

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
  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);

  if (!ctx) {
    throw new Error("Dialog subcomponents must be used inside <Dialog />");
  }

  return ctx;
}

function useOptionalDialogContext() {
  return React.useContext(DialogContext);
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

  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
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
  styles,
  slotProps,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const overlayId = overlayIdProp ?? `dialog-${reactId}`;
  const titleId = `${overlayId}-title`;
  const descriptionId = `${overlayId}-description`;

  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);

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
      styles,
      slotProps,
    }),
    [
      open,
      overlayId,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
      onOpenChange,
      styles,
      slotProps,
    ]
  );

  const rootSlot = resolveSlot<DialogSlot>({
    slot: "root",
    styles,
    slotProps,
    baseProps: {
      "data-ui-dialog-root": "",
    },
    baseStyle: {
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
    },
  });

  const backdropSlot = resolveSlot<DialogSlot>({
    slot: "backdrop",
    styles,
    slotProps,
    baseProps: {
      "aria-hidden": true,
      "data-ui-dialog-backdrop": "",
    },
    baseStyle: {
      position: "fixed",
      inset: 0,
      background: "var(--ui-overlay)",
      zIndex: getLayerZIndex("modalBackdrop"),
      pointerEvents: "auto",
    },
  });

  const dismissableLayerSlot = resolveSlot<DialogSlot>({
    slot: "dismissableLayer",
    styles,
    slotProps,
    baseStyle: {
      position: "relative",
      zIndex: getLayerZIndex("modal"),
      width: "100%",
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
    },
  });

  const focusScopeSlot = resolveSlot<DialogSlot>({
    slot: "focusScope",
    styles,
    slotProps,
    baseStyle: {
      position: "relative",
      zIndex: getLayerZIndex("modal"),
      width: "100%",
      display: "flex",
      justifyContent: "center",
      pointerEvents: "auto",
    },
  });

  const panelSlot = resolveSlot<DialogSlot>({
    slot: "panel",
    styles,
    slotProps,
    baseProps: {
      "data-ui": "modal-content",
      "data-ui-dialog-panel": "",
    },
    baseStyle: {
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
    },
  });

  const content = (
    <DialogContext.Provider value={contextValue}>
      <MotionOverlayPresence open={open}>
        <MotionOverlayRoot {...toMotionSlotProps(rootSlot)}>
          {modal ? (
            <MotionOverlayBackdrop {...toMotionSlotProps(backdropSlot)} />
          ) : null}

          <DismissableLayer
            overlayId={overlayId}
            layer={getLayerZIndex("modal")}
            enabled={open}
            dismissOnEscape={closeOnEscape}
            dismissOnPointerDownOutside={closeOnPointerDownOutside}
            onDismiss={handleDismiss}
            className={dismissableLayerSlot.className}
            style={dismissableLayerSlot.style}
          >
            <FocusScope
              overlayId={overlayId}
              enabled={open}
              contain={trapFocus}
              autoFocus={autoFocus}
              restoreFocus={restoreFocus}
              initialFocusRef={initialFocusRef}
              className={focusScopeSlot.className}
              style={focusScopeSlot.style}
            >
              <MotionOverlayPanel
                {...toMotionSlotProps(panelSlot)}
                as="div"
                kind="dialog"
                role="dialog"
                aria-modal={modal ? true : undefined}
                aria-labelledby={hasTitle ? titleId : undefined}
                aria-describedby={hasDescription ? descriptionId : undefined}
              >
                {children}
              </MotionOverlayPanel>
            </FocusScope>

            {lockScroll ? (
              <ScrollLock overlayId={overlayId} enabled={open} active={open} />
            ) : null}
          </DismissableLayer>
        </MotionOverlayRoot>
      </MotionOverlayPresence>
    </DialogContext.Provider>
  );

  return portalled ? <Portal container={container}>{content}</Portal> : content;
};

Dialog.displayName = "Dialog";

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(
  (
    {
      children,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalDialogContext();

    const contentSlot = resolveSlot<DialogSlot>({
      slot: "content",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle: {
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      },
    });

    return (
      <div {...contentSlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

DialogContent.displayName = "DialogContent";

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  (
    {
      children,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalDialogContext();

    const headerSlot = resolveSlot<DialogSlot>({
      slot: "header",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle: {
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        padding: "1rem 1rem 0.75rem 1rem",
        borderBottom: "1px solid var(--ui-border)",
      },
    });

    return (
      <div {...headerSlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

DialogHeader.displayName = "DialogHeader";

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  (
    {
      children,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalDialogContext();

    const bodySlot = resolveSlot<DialogSlot>({
      slot: "body",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle: {
        padding: "1rem",
        minWidth: 0,
      },
    });

    return (
      <div {...bodySlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

DialogBody.displayName = "DialogBody";

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  (
    {
      children,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalDialogContext();

    const footerSlot = resolveSlot<DialogSlot>({
      slot: "footer",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "0.75rem",
        flexWrap: "wrap",
        padding: "0.75rem 1rem 1rem 1rem",
        borderTop: "1px solid var(--ui-border)",
      },
    });

    return (
      <div {...footerSlot} ref={ref} {...rest}>
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
  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (
    {
      children,
      as: Comp = "h2",
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useDialogContext();

    React.useEffect(() => {
      ctx.setTitleMounted(true);

      return () => {
        ctx.setTitleMounted(false);
      };
    }, [ctx]);

    const titleSlot = resolveSlot<DialogSlot>({
      slot: "title",
      styles: styles ?? ctx.styles,
      slotProps: slotProps ?? ctx.slotProps,
      className,
      style,
      baseStyle: {
        margin: 0,
        fontSize: "1.125rem",
        fontWeight: 800,
        lineHeight: 1.2,
        color: "var(--ui-text)",
      },
    });

    return (
      <Comp
        {...titleSlot}
        ref={ref as React.Ref<any>}
        id={ctx.titleId}
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
  styles?: DialogStyles;
  slotProps?: DialogSlotProps;
}

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(
  (
    {
      children,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useDialogContext();

    React.useEffect(() => {
      ctx.setDescriptionMounted(true);

      return () => {
        ctx.setDescriptionMounted(false);
      };
    }, [ctx]);

    const descriptionSlot = resolveSlot<DialogSlot>({
      slot: "description",
      styles: styles ?? ctx.styles,
      slotProps: slotProps ?? ctx.slotProps,
      className,
      style,
      baseStyle: {
        margin: 0,
        fontSize: "var(--ui-font-size-sm)",
        lineHeight: 1.45,
        color: "var(--ui-text-muted)",
      },
    });

    return (
      <p
        {...descriptionSlot}
        ref={ref}
        id={ctx.descriptionId}
        {...rest}
      >
        {children}
      </p>
    );
  }
);

DialogDescription.displayName = "DialogDescription";

export interface DialogCloseProps extends Omit<ButtonProps, "type"> {
  children?: React.ReactNode;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  (
    {
      children,
      onClick,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const ctx = useDialogContext();

    const closeSlot = resolveSlot<DialogSlot>({
      slot: "close",
      styles: ctx.styles,
      slotProps: ctx.slotProps,
      className,
      style,
    });

    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="sm"
        className={closeSlot.className}
        style={closeSlot.style}
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