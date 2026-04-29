// src/primitives/overlay/Tooltip.tsx
import React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import {
  FloatingLayer,
  Portal,
  getLayerZIndex,
  type FloatingPlacement,
} from "../../core/overlay";
import { useOptionalUIMotion } from "../../core/motion";

type TooltipContextValue = {
  open: boolean;
  triggerId: string;
  contentId: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  setAnchorNode: (node: HTMLElement | null) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openDelayMs: number;
  closeDelayMs: number;
  enableTouch: boolean;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipContext() {
  const ctx = React.useContext(TooltipContext);

  if (!ctx) {
    throw new Error("Tooltip subcomponents must be used inside <Tooltip />");
  }

  return ctx;
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

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error legacy
    navigator.msMaxTouchPoints > 0
  );
}

type TriggerChildProps = {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  id?: string;
  "aria-describedby"?: string;
};

export interface TooltipProps {
  children?: React.ReactNode;
  openDelayMs?: number;
  closeDelayMs?: number;
  enableTouch?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  openDelayMs = 150,
  closeDelayMs = 80,
  enableTouch = true,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLElement | null>(null);

  const setAnchorNode = React.useCallback((node: HTMLElement | null) => {
    anchorRef.current = node;
  }, []);

  const value = React.useMemo<TooltipContextValue>(
    () => ({
      open,
      triggerId: `tooltip-trigger-${reactId}`,
      contentId: `tooltip-content-${reactId}`,
      anchorRef,
      setAnchorNode,
      setOpen,
      openDelayMs,
      closeDelayMs,
      enableTouch,
    }),
    [open, reactId, setAnchorNode, openDelayMs, closeDelayMs, enableTouch]
  );

  return (
    <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
  );
};

Tooltip.displayName = "Tooltip";

export interface TooltipTriggerProps {
  children: React.ReactElement<TriggerChildProps>;
  asChild?: boolean;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild = true }, ref) => {
    const ctx = useTooltipContext();
    const openTimerRef = React.useRef<number | null>(null);
    const closeTimerRef = React.useRef<number | null>(null);

    const touch = React.useMemo(
      () => (ctx.enableTouch ? isTouchDevice() : false),
      [ctx.enableTouch]
    );

    const clearTimers = React.useCallback(() => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    }, []);

    React.useEffect(() => {
      return () => {
        clearTimers();
      };
    }, [clearTimers]);

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        ctx.setAnchorNode(node);
        assignRef(ref, node);
        assignRef(
          (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref,
          node
        );
      },
      [children, ctx, ref]
    );

    const scheduleOpen = React.useCallback(() => {
      clearTimers();
      openTimerRef.current = window.setTimeout(() => {
        ctx.setOpen(true);
      }, ctx.openDelayMs);
    }, [clearTimers, ctx]);

    const scheduleClose = React.useCallback(() => {
      clearTimers();
      closeTimerRef.current = window.setTimeout(() => {
        ctx.setOpen(false);
      }, ctx.closeDelayMs);
    }, [clearTimers, ctx]);

    if (asChild && React.isValidElement<TriggerChildProps>(children)) {
      return React.cloneElement(children, {
        ref: setRefs,
        id: ctx.triggerId,
        "aria-describedby": ctx.open ? ctx.contentId : undefined,
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onMouseEnter?.(event);
          if (!touch) scheduleOpen();
        },
        onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onMouseLeave?.(event);
          if (!touch) scheduleClose();
        },
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          children.props.onFocus?.(event);
          if (!touch) {
            clearTimers();
            ctx.setOpen(true);
          }
        },
        onBlur: (event: React.FocusEvent<HTMLElement>) => {
          children.props.onBlur?.(event);
          if (!touch) {
            clearTimers();
            ctx.setOpen(false);
          }
        },
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onClick?.(event);
          if (touch) {
            clearTimers();
            ctx.setOpen((prev) => !prev);
          }
        },
      } as TriggerChildProps & { ref: React.Ref<HTMLElement> });
    }

    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        id={ctx.triggerId}
        type="button"
        aria-describedby={ctx.open ? ctx.contentId : undefined}
        onMouseEnter={() => {
          if (!touch) scheduleOpen();
        }}
        onMouseLeave={() => {
          if (!touch) scheduleClose();
        }}
        onFocus={() => {
          if (!touch) {
            clearTimers();
            ctx.setOpen(true);
          }
        }}
        onBlur={() => {
          if (!touch) {
            clearTimers();
            ctx.setOpen(false);
          }
        }}
        onClick={() => {
          if (touch) {
            clearTimers();
            ctx.setOpen((prev) => !prev);
          }
        }}
      >
        {children}
      </button>
    );
  }
);

TooltipTrigger.displayName = "TooltipTrigger";

export interface TooltipContentProps
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
  placement?: FloatingPlacement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  viewportPadding?: number;
  closeOnClickOutside?: boolean;
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(
  (
    {
      children,
      style,
      className = "",
      portalled = true,
      container,
      placement = "top",
      offset = 8,
      flip = true,
      shift = true,
      viewportPadding = 8,
      closeOnClickOutside = true,
      ...rest
    },
    ref
  ) => {
    const ctx = useTooltipContext();
    const motionState = useOptionalUIMotion();
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const variants = motionState.getVariants(
      "tooltip",
      motionState.effectiveLevel
    );

    const transition = motionState.getTransition(
      motionState.effectiveLevel,
      "fade"
    );

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );

    React.useEffect(() => {
      if (!ctx.open) return;
      if (!closeOnClickOutside) return;

      const handlePointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        const anchorEl = ctx.anchorRef.current;
        const contentEl = contentRef.current;

        const clickedAnchor = !!anchorEl && !!target && anchorEl.contains(target);
        const clickedContent =
          !!contentEl && !!target && contentEl.contains(target);

        if (!clickedAnchor && !clickedContent) {
          ctx.setOpen(false);
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
      };
    }, [closeOnClickOutside, ctx]);

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
          zIndex={getLayerZIndex("tooltip")}
          strategy="fixed"
        >
          {({ ref: floatingRef, style: floatingStyle, placement: side }) => (
            <motion.div
              ref={(node) => {
                assignRef(floatingRef, node);
                setRefs(node);
              }}
              id={ctx.contentId}
              role="tooltip"
              className={className}
              data-side={side}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              style={{
                ...floatingStyle,
                zIndex: getLayerZIndex("tooltip"),
                maxWidth: "min(280px, calc(100vw - 16px))",
                padding: "0.4rem 0.7rem",
                borderRadius: "var(--ui-radius-sm)",
                border: "1px solid var(--ui-border)",
                background: "var(--ui-surface)",
                color: "var(--ui-text)",
                boxShadow: "var(--ui-shadow-md)",
                fontSize: "0.78rem",
                lineHeight: 1.35,
                pointerEvents: "none",
                transformOrigin: "center",
                ...style,
              }}
              {...rest}
            >
              {children}
            </motion.div>
          )}
        </FloatingLayer>
      ) : null;

    const animated = <AnimatePresence>{content}</AnimatePresence>;

    return portalled ? <Portal container={container}>{animated}</Portal> : animated;
  }
);

TooltipContent.displayName = "TooltipContent";