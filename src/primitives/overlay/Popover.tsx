// src/primitives/overlay/Popover.tsx
import React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import {
  DismissableLayer,
  FloatingLayer,
  FocusScope,
  Portal,
  getLayerZIndex,
} from "../../core/overlay";
import { useOptionalUIMotion } from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

type PopoverPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

export type PopoverSlot =
  | "trigger"
  | "dismissableLayer"
  | "content"
  | "focusScope"
  | "header"
  | "body"
  | "footer";

export type PopoverStyles = SlotStyleMap<PopoverSlot>;

export type PopoverSlotProps = SlotPropsMap<PopoverSlot>;

type TriggerChildProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

type PopoverContextValue = {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  triggerId: string;
  setTriggerNode: (node: HTMLElement | null) => void;
  onOpenChange?: (open: boolean) => void;
  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const ctx = React.useContext(PopoverContext);

  if (!ctx) {
    throw new Error("Popover subcomponents must be used inside <Popover />");
  }

  return ctx;
}

function useOptionalPopoverContext() {
  return React.useContext(PopoverContext);
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return;

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  try {
    (ref as React.MutableRefObject<T | null>).current = value;
  } catch {
    // noop
  }
}

export interface PopoverProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  open,
  onOpenChange,
  styles,
  slotProps,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const anchorRef = React.useRef<HTMLElement | null>(null);

  const setTriggerNode = React.useCallback((node: HTMLElement | null) => {
    anchorRef.current = node;
  }, []);

  const value = React.useMemo<PopoverContextValue>(
    () => ({
      open,
      anchorRef,
      contentId: `popover-content-${reactId}`,
      triggerId: `popover-trigger-${reactId}`,
      setTriggerNode,
      onOpenChange,
      styles,
      slotProps,
    }),
    [open, onOpenChange, reactId, setTriggerNode, styles, slotProps]
  );

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
};

Popover.displayName = "Popover";

export interface PopoverTriggerProps {
  children: React.ReactElement<TriggerChildProps>;
  asChild?: boolean;

  className?: string;
  style?: React.CSSProperties;
  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  (
    {
      children,
      asChild = true,
      className = "",
      style,
      styles,
      slotProps,
    },
    ref
  ) => {
    const ctx = usePopoverContext();

    const triggerSlot = resolveSlot<PopoverSlot>({
      slot: "trigger",
      styles: styles ?? ctx.styles,
      slotProps: slotProps ?? ctx.slotProps,
      className,
      style,
    });

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        ctx.setTriggerNode(node);
        assignRef(ref, node);
        assignRef(
          (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref,
          node
        );
      },
      [children, ctx, ref]
    );

    if (asChild && React.isValidElement<TriggerChildProps>(children)) {
      return React.cloneElement(children, {
        ref: setRefs,
        id: ctx.triggerId,
        className: [children.props.className, triggerSlot.className]
          .filter(Boolean)
          .join(" "),
        style: {
          ...children.props.style,
          ...triggerSlot.style,
        },
        "aria-haspopup": "dialog",
        "aria-expanded": ctx.open,
        "aria-controls": ctx.open ? ctx.contentId : undefined,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onClick?.(event);
          ctx.onOpenChange?.(!ctx.open);
        },
      } as TriggerChildProps & { ref: React.Ref<HTMLElement> });
    }

    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        id={ctx.triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={ctx.open}
        aria-controls={ctx.open ? ctx.contentId : undefined}
        className={triggerSlot.className}
        style={triggerSlot.style}
        onClick={() => ctx.onOpenChange?.(!ctx.open)}
      >
        {children}
      </button>
    );
  }
);

PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverContentProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "ref"
    | "style"
    | "className"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
  > {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  portalled?: boolean;
  container?: Element | DocumentFragment | null;
  placement?: PopoverPlacement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  viewportPadding?: number;
  closeOnEscape?: boolean;
  closeOnPointerDownOutside?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  matchAnchorWidth?: boolean;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(
  (
    {
      children,
      style,
      className = "",
      portalled = true,
      container,
      placement = "bottom-start",
      offset = 8,
      flip = true,
      shift = true,
      viewportPadding = 8,
      closeOnEscape = true,
      closeOnPointerDownOutside = true,
      trapFocus = false,
      autoFocus = false,
      restoreFocus = true,
      initialFocusRef,
      matchAnchorWidth = false,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = usePopoverContext();
    const motionState = useOptionalUIMotion();

    const resolvedStyles = styles ?? ctx.styles;
    const resolvedSlotProps = slotProps ?? ctx.slotProps;

    const variants = motionState.getVariants(
      "popover",
      motionState.effectiveLevel
    );

    const transition = motionState.getTransition(
      motionState.effectiveLevel,
      "slide"
    );

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        assignRef(ref, node);
      },
      [ref]
    );

    const handleDismiss = React.useCallback(() => {
      ctx.onOpenChange?.(false);
    }, [ctx]);

    const resolvedAriaLabelledBy =
      ariaLabel !== undefined || ariaLabelledBy !== undefined
        ? ariaLabelledBy
        : ctx.triggerId;

    const focusScopeSlot = resolveSlot<PopoverSlot>({
      slot: "focusScope",
      styles: resolvedStyles,
      slotProps: resolvedSlotProps,
      baseStyle: {
        outline: "none",
      },
    });

    const content =
      ctx.open && ctx.anchorRef.current ? (
        <FloatingLayer
          anchorRef={ctx.anchorRef}
          open={ctx.open}
          placement={placement}
          offset={offset}
          flip={flip}
          shift={shift}
          viewportPadding={viewportPadding}
          zIndex={getLayerZIndex("popover")}
          strategy="fixed"
          matchAnchorWidth={matchAnchorWidth}
        >
          {({ ref: floatingRef, style: floatingStyle, placement: side }) => {
            const dismissableLayerSlot = resolveSlot<PopoverSlot>({
              slot: "dismissableLayer",
              styles: resolvedStyles,
              slotProps: resolvedSlotProps,
              baseStyle: {
                ...floatingStyle,
                zIndex: getLayerZIndex("popover"),
              },
            });

            const contentSlot = resolveSlot<PopoverSlot>({
              slot: "content",
              styles: resolvedStyles,
              slotProps: resolvedSlotProps,
              className,
              style,
              baseProps: {
                "data-side": side,
                "data-ui-popover-content": "",
              },
              baseStyle: {
                position: "relative",
                minWidth: 180,
                maxWidth: "min(360px, calc(100vw - 16px))",
                borderRadius: "var(--ui-radius-lg)",
                border: "1px solid var(--ui-border)",
                background: "var(--ui-surface)",
                color: "var(--ui-text)",
                boxShadow: "var(--ui-shadow-lg)",
                outline: "none",
                transformOrigin: "top left",
              },
            });

            return (
              <DismissableLayer
                overlayId={ctx.contentId}
                layer={getLayerZIndex("popover")}
                enabled={ctx.open}
                dismissOnEscape={closeOnEscape}
                dismissOnPointerDownOutside={closeOnPointerDownOutside}
                onDismiss={handleDismiss}
                className={dismissableLayerSlot.className}
                style={dismissableLayerSlot.style}
              >
                <motion.div
                  {...rest}
                  {...toMotionSlotProps(contentSlot)}
                  ref={(node) => {
                    assignRef(floatingRef, node);
                    setRefs(node);
                  }}
                  id={ctx.contentId}
                  role="dialog"
                  aria-label={ariaLabel}
                  aria-labelledby={resolvedAriaLabelledBy}
                  aria-describedby={ariaDescribedBy}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                >
                  <FocusScope
                    overlayId={ctx.contentId}
                    enabled={ctx.open}
                    contain={trapFocus}
                    autoFocus={autoFocus}
                    restoreFocus={restoreFocus}
                    initialFocusRef={initialFocusRef}
                    className={focusScopeSlot.className}
                    style={focusScopeSlot.style}
                  >
                    {children}
                  </FocusScope>
                </motion.div>
              </DismissableLayer>
            );
          }}
        </FloatingLayer>
      ) : null;

    const animated = <AnimatePresence>{content}</AnimatePresence>;

    return portalled ? <Portal container={container}>{animated}</Portal> : animated;
  }
);

PopoverContent.displayName = "PopoverContent";

export interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverHeader = React.forwardRef<HTMLDivElement, PopoverHeaderProps>(
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
    const ctx = useOptionalPopoverContext();

    const headerSlot = resolveSlot<PopoverSlot>({
      slot: "header",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle: {
        padding: "0.85rem 0.9rem 0.65rem 0.9rem",
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

PopoverHeader.displayName = "PopoverHeader";

export interface PopoverBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverBody = React.forwardRef<HTMLDivElement, PopoverBodyProps>(
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
    const ctx = useOptionalPopoverContext();

    const bodySlot = resolveSlot<PopoverSlot>({
      slot: "body",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle: {
        padding: "0.9rem",
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

PopoverBody.displayName = "PopoverBody";

export interface PopoverFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverFooter = React.forwardRef<HTMLDivElement, PopoverFooterProps>(
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
    const ctx = useOptionalPopoverContext();

    const footerSlot = resolveSlot<PopoverSlot>({
      slot: "footer",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "0.6rem",
        flexWrap: "wrap",
        padding: "0.7rem 0.9rem 0.9rem 0.9rem",
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

PopoverFooter.displayName = "PopoverFooter";