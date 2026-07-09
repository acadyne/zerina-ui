// src/primitives/overlay/Drawer.tsx
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
import {
  getOverlayBackdropVariants,
  getOverlayDrawerVariants,
  getOverlayMotionIntent,
  useOptionalUIMotion,
} from "../../core/motion";
import { IconButton } from "../forms";
import { Box, Flex } from "../layout";
import { Typography } from "../typography";

export type DrawerPlacement = "left" | "right";

export interface DrawerProps {
  children?: React.ReactNode;

  open: boolean;
  onOpenChange?: (open: boolean) => void;

  placement?: DrawerPlacement;
  size?: number | string;

  title?: React.ReactNode;
  description?: React.ReactNode;

  closeOnEscape?: boolean;
  closeOnPointerDownOutside?: boolean;
  lockScroll?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;

  showCloseButton?: boolean;

  portalled?: boolean;
  container?: Element | DocumentFragment | null;
  overlayId?: string;

  className?: string;
  style?: React.CSSProperties;
  backdropStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export const Drawer: React.FC<DrawerProps> = ({
  children,
  open,
  onOpenChange,

  placement = "right",
  size = "min(420px, 92vw)",

  title,
  description,

  closeOnEscape = true,
  closeOnPointerDownOutside = true,
  lockScroll = true,
  trapFocus = true,
  autoFocus = true,
  restoreFocus = true,
  initialFocusRef,

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
  const overlayId = overlayIdProp ?? `drawer-${reactId}`;
  const titleId = `${overlayId}-title`;
  const descriptionId = `${overlayId}-description`;

  const motionState = useOptionalUIMotion();

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const backdropVariants = getOverlayBackdropVariants(
    motionState.effectiveLevel
  );

  const panelVariants = getOverlayDrawerVariants({
    placement,
    level: motionState.effectiveLevel,
  });

  const panelTransition = motionState.getTransition(
    motionState.effectiveLevel,
    getOverlayMotionIntent("drawer")
  );

  const backdropTransition = motionState.getTransition(
    motionState.effectiveLevel,
    getOverlayMotionIntent("backdrop")
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
            initial="initial"
            animate="animate"
            exit="exit"
            variants={backdropVariants}
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
              top: 0,
              bottom: 0,
              left: placement === "left" ? 0 : undefined,
              right: placement === "right" ? 0 : undefined,
              zIndex: getLayerZIndex("modal"),
              width: size,
              maxWidth: "100vw",
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
                height: "100%",
                minHeight: 0,
                outline: "none",
              }}
            >
              <motion.aside
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
                className={className}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={panelVariants}
                transition={panelTransition}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--ui-surface)",
                  color: "var(--ui-text)",
                  borderLeft:
                    placement === "right"
                      ? "1px solid var(--ui-border)"
                      : undefined,
                  borderRight:
                    placement === "left"
                      ? "1px solid var(--ui-border)"
                      : undefined,
                  boxShadow: "var(--ui-shadow-lg)",
                  outline: "none",
                  overflow: "hidden",
                  ...style,
                }}
              >
                {title || description || showCloseButton ? (
                  <DrawerHeader style={contentStyle}>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      {title ? (
                        <DrawerTitle id={titleId}>{title}</DrawerTitle>
                      ) : null}

                      {description ? (
                        <DrawerDescription id={descriptionId}>
                          {description}
                        </DrawerDescription>
                      ) : null}
                    </Box>

                    {showCloseButton ? (
                      <DrawerClose onClose={handleClose} />
                    ) : null}
                  </DrawerHeader>
                ) : null}

                {children}
              </motion.aside>
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

Drawer.displayName = "Drawer";

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        align="flex-start"
        justify="space-between"
        gap="0.75rem"
        style={{
          padding: "max(1rem, env(safe-area-inset-top)) 1rem 0.85rem",
          borderBottom: "1px solid var(--ui-border)",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </Flex>
    );
  }
);

DrawerHeader.displayName = "DrawerHeader";

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ children, style, ...rest }, ref) => {
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
  }
);

DrawerBody.displayName = "DrawerBody";

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <Flex
        ref={ref}
        align="center"
        justify="flex-end"
        gap="0.75rem"
        wrap="wrap"
        style={{
          padding: "0.85rem 1rem max(1rem, env(safe-area-inset-bottom))",
          borderTop: "1px solid var(--ui-border)",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        {children}
      </Flex>
    );
  }
);

DrawerFooter.displayName = "DrawerFooter";

export interface DrawerTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ children, style, ...rest }, ref) => {
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
  }
);

DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  DrawerDescriptionProps
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

DrawerDescription.displayName = "DrawerDescription";

export interface DrawerCloseProps {
  onClose?: () => void;
  ariaLabel?: string;
}

export const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ onClose, ariaLabel = "Cerrar" }, ref) => {
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
  }
);

DrawerClose.displayName = "DrawerClose";