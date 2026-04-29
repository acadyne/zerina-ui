// src/primitives/overlay/BottomSheet.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  DismissableLayer,
  FocusScope,
  Portal,
  ScrollLock,
  getLayerZIndex,
} from "../../core/overlay";
import { useOptionalUIMotion } from "../../core/motion";
import { IconButton } from "../forms";
import { Box, Flex } from "../layout";
import { Typography } from "../typography";

export interface BottomSheetProps {
  children?: React.ReactNode;

  open: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: React.ReactNode;
  description?: React.ReactNode;

  height?: number | string;
  maxHeight?: number | string;

  closeOnEscape?: boolean;
  closeOnPointerDownOutside?: boolean;
  lockScroll?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;

  showHandle?: boolean;
  showCloseButton?: boolean;

  portalled?: boolean;
  container?: Element | DocumentFragment | null;
  overlayId?: string;

  className?: string;
  style?: React.CSSProperties;
  backdropStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  open,
  onOpenChange,

  title,
  description,

  height,
  maxHeight = "min(82dvh, 760px)",

  closeOnEscape = true,
  closeOnPointerDownOutside = true,
  lockScroll = true,
  trapFocus = true,
  autoFocus = true,
  restoreFocus = true,
  initialFocusRef,

  showHandle = true,
  showCloseButton = true,

  portalled = true,
  container,
  overlayId: overlayIdProp,

  className = "",
  style,
  backdropStyle,
  contentStyle,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const overlayId = overlayIdProp ?? `bottom-sheet-${reactId}`;
  const titleId = `${overlayId}-title`;
  const descriptionId = `${overlayId}-description`;

  const motionState = useOptionalUIMotion();

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const panelTransition = motionState.getTransition(
    motionState.effectiveLevel,
    "slide"
  );

  const backdropTransition = motionState.getTransition(
    motionState.effectiveLevel,
    "fade"
  );

  const content = (
    <AnimatePresence>
      {open ? (
        <Box
          style={{
            position: "fixed",
            inset: 0,
            zIndex: getLayerZIndex("modal"),
            pointerEvents: "none",
          }}
        >
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
              ...backdropStyle,
            }}
          />

          <DismissableLayer
            overlayId={overlayId}
            layer={getLayerZIndex("modal")}
            enabled={open}
            dismissOnEscape={closeOnEscape}
            dismissOnPointerDownOutside={closeOnPointerDownOutside}
            onDismiss={handleClose}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: getLayerZIndex("modal"),
              display: "flex",
              justifyContent: "center",
              pointerEvents: "auto",
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
                width: "100%",
                display: "flex",
                justifyContent: "center",
                outline: "none",
              }}
            >
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
                className={className}
                initial={{ y: "100%", opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 1 }}
                transition={panelTransition}
                style={{
                  width: "100%",
                  height,
                  maxHeight,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--ui-surface)",
                  color: "var(--ui-text)",
                  borderTopLeftRadius: "var(--ui-radius-xl)",
                  borderTopRightRadius: "var(--ui-radius-xl)",
                  border: "1px solid var(--ui-border)",
                  borderBottom: "none",
                  boxShadow: "var(--ui-shadow-lg)",
                  outline: "none",
                  overflow: "hidden",
                  paddingBottom: "env(safe-area-inset-bottom)",
                  ...style,
                }}
              >
                {showHandle ? <BottomSheetHandle /> : null}

                {(title || description || showCloseButton) ? (
                  <BottomSheetHeader style={contentStyle}>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      {title ? (
                        <BottomSheetTitle id={titleId}>{title}</BottomSheetTitle>
                      ) : null}

                      {description ? (
                        <BottomSheetDescription id={descriptionId}>
                          {description}
                        </BottomSheetDescription>
                      ) : null}
                    </Box>

                    {showCloseButton ? (
                      <BottomSheetClose onClose={handleClose} />
                    ) : null}
                  </BottomSheetHeader>
                ) : null}

                {children}
              </motion.section>
            </FocusScope>

            {lockScroll ? (
              <ScrollLock overlayId={overlayId} enabled={open} active={open} />
            ) : null}
          </DismissableLayer>
        </Box>
      ) : null}
    </AnimatePresence>
  );

  return portalled ? <Portal container={container}>{content}</Portal> : content;
};

BottomSheet.displayName = "BottomSheet";

export interface BottomSheetHandleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetHandle = React.forwardRef<
  HTMLDivElement,
  BottomSheetHandleProps
>(({ style, ...rest }, ref) => {
  return (
    <Flex
      ref={ref}
      justify="center"
      align="center"
      style={{
        padding: "0.65rem 1rem 0.35rem",
        ...style,
      }}
      {...rest}
    >
      <Box
        aria-hidden="true"
        style={{
          width: 42,
          height: 5,
          borderRadius: 999,
          background: "var(--ui-border-strong)",
          opacity: 0.8,
        }}
      />
    </Flex>
  );
});

BottomSheetHandle.displayName = "BottomSheetHandle";

export interface BottomSheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const BottomSheetHeader = React.forwardRef<
  HTMLDivElement,
  BottomSheetHeaderProps
>(({ children, style, ...rest }, ref) => {
  return (
    <Flex
      ref={ref}
      align="flex-start"
      justify="space-between"
      gap="0.75rem"
      style={{
        padding: "0.85rem 1rem",
        borderBottom: "1px solid var(--ui-border)",
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Flex>
  );
});

BottomSheetHeader.displayName = "BottomSheetHeader";

export interface BottomSheetBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const BottomSheetBody = React.forwardRef<
  HTMLDivElement,
  BottomSheetBodyProps
>(({ children, style, ...rest }, ref) => {
  return (
    <Box
      ref={ref as React.Ref<Element>}
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        padding: "1rem",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
});

BottomSheetBody.displayName = "BottomSheetBody";

export interface BottomSheetFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const BottomSheetFooter = React.forwardRef<
  HTMLDivElement,
  BottomSheetFooterProps
>(({ children, style, ...rest }, ref) => {
  return (
    <Flex
      ref={ref}
      align="center"
      justify="flex-end"
      gap="0.75rem"
      wrap="wrap"
      style={{
        padding: "0.85rem 1rem",
        borderTop: "1px solid var(--ui-border)",
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Flex>
  );
});

BottomSheetFooter.displayName = "BottomSheetFooter";

export interface BottomSheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export const BottomSheetTitle = React.forwardRef<
  HTMLHeadingElement,
  BottomSheetTitleProps
>(({ children, style, ...rest }, ref) => {
  return (
    <h2
      ref={ref}
      style={{
        margin: 0,
        color: "var(--ui-text)",
        fontSize: "1.05rem",
        fontWeight: 800,
        lineHeight: 1.2,
        ...style,
      }}
      {...rest}
    >
      {children}
    </h2>
  );
});

BottomSheetTitle.displayName = "BottomSheetTitle";

export interface BottomSheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export const BottomSheetDescription = React.forwardRef<
  HTMLParagraphElement,
  BottomSheetDescriptionProps
>(({ children, style, ...rest }, ref) => {
  return (
    <Typography
      ref={ref as React.Ref<HTMLElement>}
      as="p"
      size="sm"
      color="var(--ui-text-muted)"
      style={{
        margin: "0.35rem 0 0",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
});

BottomSheetDescription.displayName = "BottomSheetDescription";

export interface BottomSheetCloseProps {
  onClose?: () => void;
  ariaLabel?: string;
}

export const BottomSheetClose = React.forwardRef<
  HTMLButtonElement,
  BottomSheetCloseProps
>(({ onClose, ariaLabel = "Cerrar" }, ref) => {
  return (
    <IconButton
      ref={ref}
      ariaLabel={ariaLabel}
      icon={<X size={18} />}
      size="sm"
      variant="ghost"
      onClick={onClose}
    />
  );
});

BottomSheetClose.displayName = "BottomSheetClose";