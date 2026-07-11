// src/primitives/overlay/BottomSheet.tsx
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
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { IconButton } from "../forms";
import { Box, Flex } from "../layout";
import { Typography } from "../typography";
import {  MotionOverlayBackdrop,
  MotionOverlayPanel,
  MotionOverlayPresence,
  MotionOverlayRoot, } from "../../core/motion/MotionOverlay";

export type BottomSheetSlot =
  | "root"
  | "backdrop"
  | "positioner"
  | "focusScope"
  | "panel"
  | "handle"
  | "handleIndicator"
  | "header"
  | "title"
  | "description"
  | "closeButton"
  | "body"
  | "footer";

export type BottomSheetStyles = SlotStyleMap<BottomSheetSlot>;

export type BottomSheetSlotProps = SlotPropsMap<BottomSheetSlot>;

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

  styles?: BottomSheetStyles;
  slotProps?: BottomSheetSlotProps;
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

  styles,
  slotProps,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const overlayId = overlayIdProp ?? `bottom-sheet-${reactId}`;
  const titleId = `${overlayId}-title`;
  const descriptionId = `${overlayId}-description`;

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const rootSlot = resolveSlot<BottomSheetSlot>({
    slot: "root",
    styles,
    slotProps,
    baseProps: {
      "data-ui-bottom-sheet-root": "",
      "data-ui-bottom-sheet-open": open || undefined,
    },
    baseStyle: {
      position: "fixed",
      inset: 0,
      zIndex: getLayerZIndex("modal"),
      pointerEvents: "none",
    },
  });

  const backdropSlot = resolveSlot<BottomSheetSlot>({
    slot: "backdrop",
    styles,
    slotProps,
    baseProps: {
      "aria-hidden": true,
      "data-ui-bottom-sheet-backdrop": "",
    },
    baseStyle: {
      position: "fixed",
      inset: 0,
      background: "var(--ui-overlay)",
      zIndex: getLayerZIndex("modalBackdrop"),
      pointerEvents: "auto",
    },
  });

  const positionerSlot = resolveSlot<BottomSheetSlot>({
    slot: "positioner",
    styles,
    slotProps,
    baseProps: {
      "data-ui-bottom-sheet-positioner": "",
    },
    baseStyle: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: getLayerZIndex("modal"),
      display: "flex",
      justifyContent: "center",
      pointerEvents: "auto",
    },
  });

  const focusScopeSlot = resolveSlot<BottomSheetSlot>({
    slot: "focusScope",
    styles,
    slotProps,
    baseProps: {
      "data-ui-bottom-sheet-focus-scope": "",
    },
    baseStyle: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      outline: "none",
    },
  });

  const panelSlot = resolveSlot<BottomSheetSlot>({
    slot: "panel",
    styles,
    slotProps,
    className,
    style,
    baseProps: {
      "data-ui-bottom-sheet-panel": "",
    },
    baseStyle: {
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
    },
  });

  const handleSlot = resolveSlot<BottomSheetSlot>({
    slot: "handle",
    styles,
    slotProps,
  });

  const handleIndicatorSlot = resolveSlot<BottomSheetSlot>({
    slot: "handleIndicator",
    styles,
    slotProps,
  });

  const headerSlot = resolveSlot<BottomSheetSlot>({
    slot: "header",
    styles,
    slotProps,
  });

  const titleSlot = resolveSlot<BottomSheetSlot>({
    slot: "title",
    styles,
    slotProps,
  });

  const descriptionSlot = resolveSlot<BottomSheetSlot>({
    slot: "description",
    styles,
    slotProps,
  });

  const closeButtonSlot = resolveSlot<BottomSheetSlot>({
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
              as="section"
              kind="bottom-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={description ? descriptionId : undefined}
              {...toMotionSlotProps(panelSlot)}
            >
              {showHandle ? (
                <BottomSheetHandle
                  {...handleSlot}
                  indicatorProps={handleIndicatorSlot}
                />
              ) : null}

              {title || description || showCloseButton ? (
                <BottomSheetHeader {...headerSlot}>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    {title ? (
                      <BottomSheetTitle id={titleId} {...titleSlot}>
                        {title}
                      </BottomSheetTitle>
                    ) : null}

                    {description ? (
                      <BottomSheetDescription
                        id={descriptionId}
                        {...descriptionSlot}
                      >
                        {description}
                      </BottomSheetDescription>
                    ) : null}
                  </Box>

                  {showCloseButton ? (
                    <BottomSheetClose
                      onClose={handleClose}
                      className={closeButtonSlot.className}
                      style={closeButtonSlot.style}
                    />
                  ) : null}
                </BottomSheetHeader>
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

BottomSheet.displayName = "BottomSheet";

export interface BottomSheetHandleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  indicatorProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const BottomSheetHandle = React.forwardRef<
  HTMLDivElement,
  BottomSheetHandleProps
>(({ indicatorProps, style, ...rest }, ref) => {
  const { style: indicatorStyle, ...indicatorRest } = indicatorProps ?? {};

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
          ...indicatorStyle,
        }}
        {...indicatorRest}
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
  className?: string;
  style?: React.CSSProperties;
}

export const BottomSheetClose = React.forwardRef<
  HTMLButtonElement,
  BottomSheetCloseProps
>(({ onClose, ariaLabel = "Cerrar", className, style }, ref) => {
  return (
    <IconButton
      ref={ref}
      ariaLabel={ariaLabel}
      icon={<X size={18} />}
      size="sm"
      variant="ghost"
      onClick={onClose}
      className={className}
      style={style}
    />
  );
});

BottomSheetClose.displayName = "BottomSheetClose";