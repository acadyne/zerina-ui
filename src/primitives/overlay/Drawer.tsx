// src/primitives/overlay/Drawer.tsx
import React from "react";
import { X } from "lucide-react";
import {
  DismissableLayer,
  FocusScope,
  Portal,
  ScrollLock,
  getLayerZIndex,
} from "../../core/overlay";
import {
  MotionOverlayBackdrop,
  MotionOverlayPanel,
  MotionOverlayPresence,
  MotionOverlayRoot,
} from "../../core/motion/MotionOverlay";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { IconButton } from "../forms";
import { Box, Flex } from "../layout";
import { Typography } from "../typography";

export type DrawerPlacement = "left" | "right";

export type DrawerSlot =
  | "root"
  | "backdrop"
  | "positioner"
  | "focusScope"
  | "panel"
  | "header"
  | "title"
  | "description"
  | "closeButton"
  | "body"
  | "footer";

export type DrawerStyles = SlotStyleMap<DrawerSlot>;

export type DrawerSlotProps = SlotPropsMap<DrawerSlot>;

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

  styles?: DrawerStyles;
  slotProps?: DrawerSlotProps;
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

  styles,
  slotProps,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const overlayId = overlayIdProp ?? `drawer-${reactId}`;
  const titleId = `${overlayId}-title`;
  const descriptionId = `${overlayId}-description`;

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const rootSlot = resolveSlot<DrawerSlot>({
    slot: "root",
    styles,
    slotProps,
    baseProps: {
      "data-ui-drawer-root": "",
      "data-ui-drawer-open": open || undefined,
      "data-ui-drawer-placement": placement,
    },
    baseStyle: {
      position: "fixed",
      inset: 0,
      zIndex: getLayerZIndex("modal"),
      pointerEvents: "none",
    },
  });

  const backdropSlot = resolveSlot<DrawerSlot>({
    slot: "backdrop",
    styles,
    slotProps,
    baseProps: {
      "aria-hidden": true,
      "data-ui-drawer-backdrop": "",
    },
    baseStyle: {
      position: "fixed",
      inset: 0,
      background: "var(--ui-overlay)",
      zIndex: getLayerZIndex("modalBackdrop"),
      pointerEvents: "auto",
    },
  });

  const positionerSlot = resolveSlot<DrawerSlot>({
    slot: "positioner",
    styles,
    slotProps,
    baseProps: {
      "data-ui-drawer-positioner": "",
    },
    baseStyle: {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: placement === "left" ? 0 : undefined,
      right: placement === "right" ? 0 : undefined,
      zIndex: getLayerZIndex("modal"),
      width: size,
      maxWidth: "100vw",
      pointerEvents: "auto",
    },
  });

  const focusScopeSlot = resolveSlot<DrawerSlot>({
    slot: "focusScope",
    styles,
    slotProps,
    baseProps: {
      "data-ui-drawer-focus-scope": "",
    },
    baseStyle: {
      height: "100%",
      minHeight: 0,
      outline: "none",
    },
  });

  const panelSlot = resolveSlot<DrawerSlot>({
    slot: "panel",
    styles,
    slotProps,
    className,
    style,
    baseProps: {
      "data-ui-drawer-panel": "",
    },
    baseStyle: {
      width: "100%",
      height: "100%",
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--ui-surface)",
      color: "var(--ui-text)",
      borderLeft:
        placement === "right" ? "1px solid var(--ui-border)" : undefined,
      borderRight:
        placement === "left" ? "1px solid var(--ui-border)" : undefined,
      boxShadow: "var(--ui-shadow-lg)",
      outline: "none",
      overflow: "hidden",
    },
  });

  const headerSlot = resolveSlot<DrawerSlot>({
    slot: "header",
    styles,
    slotProps,
  });

  const titleSlot = resolveSlot<DrawerSlot>({
    slot: "title",
    styles,
    slotProps,
  });

  const descriptionSlot = resolveSlot<DrawerSlot>({
    slot: "description",
    styles,
    slotProps,
  });

  const closeButtonSlot = resolveSlot<DrawerSlot>({
    slot: "closeButton",
    styles,
    slotProps,
  });


  const content = (
    <MotionOverlayPresence open={open}>
<MotionOverlayRoot {...toMotionSlotProps(rootSlot)}>
  <MotionOverlayBackdrop {...toMotionSlotProps(backdropSlot)} />
        <DismissableLayer
          overlayId={overlayId}
          layer={getLayerZIndex("modal")}
          enabled={open}
          dismissOnEscape={closeOnEscape}
          dismissOnPointerDownOutside={closeOnPointerDownOutside}
          onDismiss={handleClose}
          {...positionerSlot}
        >
          <FocusScope
            overlayId={overlayId}
            enabled={open}
            contain={trapFocus}
            autoFocus={autoFocus}
            restoreFocus={restoreFocus}
            initialFocusRef={initialFocusRef}
            {...focusScopeSlot}
          >
            <MotionOverlayPanel
              as="aside"
              kind="drawer"
              placement={placement}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={description ? descriptionId : undefined}
              {...toMotionSlotProps(panelSlot)}
            >
              {title || description || showCloseButton ? (
                <DrawerHeader {...headerSlot}>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    {title ? (
                      <DrawerTitle id={titleId} {...titleSlot}>
                        {title}
                      </DrawerTitle>
                    ) : null}

                    {description ? (
                      <DrawerDescription
                        id={descriptionId}
                        {...descriptionSlot}
                      >
                        {description}
                      </DrawerDescription>
                    ) : null}
                  </Box>

                  {showCloseButton ? (
                    <DrawerClose
                      onClose={handleClose}
                      className={closeButtonSlot.className}
                      style={closeButtonSlot.style}
                    />
                  ) : null}
                </DrawerHeader>
              ) : null}

              {children}
            </MotionOverlayPanel>
          </FocusScope>

          {lockScroll ? (
            <ScrollLock overlayId={overlayId} enabled={open} active={open} />
          ) : null}
        </DismissableLayer>
      </MotionOverlayRoot>
    </MotionOverlayPresence>
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

export const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  DrawerTitleProps
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
  className?: string;
  style?: React.CSSProperties;
}

export const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ onClose, ariaLabel = "Cerrar", className, style }, ref) => {
    return (
      <IconButton
        ref={ref}
        ariaLabel={ariaLabel}
        icon={<X size={18} />}
        size="sm"
        variant="ghost"
        onPress={onClose}
        className={className}
        style={style}
      />
    );
  }
);

DrawerClose.displayName = "DrawerClose";