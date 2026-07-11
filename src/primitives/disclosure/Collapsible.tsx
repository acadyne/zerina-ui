// src/primitives/disclosure/Collapsible.tsx
import React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useOptionalUIMotion } from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { Box, Flex } from "../layout";

export type CollapsibleSlot =
  | "trigger"
  | "triggerContent"
  | "triggerIcon"
  | "content"
  | "inner";

export type CollapsibleStyles = SlotStyleMap<CollapsibleSlot>;

export type CollapsibleSlotProps = SlotPropsMap<CollapsibleSlot>;

type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  contentId: string;
  triggerId: string;
  onOpenChange?: (open: boolean) => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null
);

function useCollapsibleContext() {
  const ctx = React.useContext(CollapsibleContext);

  if (!ctx) {
    throw new Error(
      "Collapsible subcomponents must be used inside <Collapsible />"
    );
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

type TriggerChildProps = {
  id?: string;
  disabled?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

export interface CollapsibleProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  id,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const baseId = id ?? `collapsible-${reactId}`;
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const currentOpen = isControlled ? Boolean(open) : internalOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;

      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [disabled, isControlled, onOpenChange]
  );

  const value = React.useMemo<CollapsibleContextValue>(
    () => ({
      open: currentOpen,
      disabled,
      triggerId: `${baseId}-trigger`,
      contentId: `${baseId}-content`,
      onOpenChange: handleOpenChange,
    }),
    [baseId, currentOpen, disabled, handleOpenChange]
  );

  return (
    <CollapsibleContext.Provider value={value}>
      {children}
    </CollapsibleContext.Provider>
  );
};

Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps {
  children?: React.ReactNode | ((state: { open: boolean }) => React.ReactNode);
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showIcon?: boolean;
  styles?: CollapsibleStyles;
  slotProps?: CollapsibleSlotProps;
}

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(
  (
    {
      children,
      asChild = false,
      className = "",
      style,
      showIcon = true,
      styles,
      slotProps,
    },
    ref
  ) => {
    const ctx = useCollapsibleContext();
    const motionState = useOptionalUIMotion();
    const [focused, setFocused] = React.useState(false);

    const handleToggle = React.useCallback(() => {
      ctx.onOpenChange?.(!ctx.open);
    }, [ctx]);

    const content =
      typeof children === "function" ? children({ open: ctx.open }) : children;

    const triggerSlot = resolveSlot<CollapsibleSlot>({
      slot: "trigger",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        width: "100%",
        minWidth: 0,
        border: "none",
        background: "transparent",
        color: "var(--ui-text)",
        padding: 0,
        cursor: ctx.disabled ? "not-allowed" : "pointer",
        opacity: ctx.disabled ? "var(--ui-state-disabled-opacity)" : 1,
        textAlign: "left",
        font: "inherit",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        borderRadius: "var(--ui-radius-sm)",
        boxShadow: focused ? "0 0 0 3px var(--ui-focus-ring)" : "none",
      },
    });

    const triggerContentSlot = resolveSlot<CollapsibleSlot>({
      slot: "triggerContent",
      styles,
      slotProps,
      baseStyle: {
        flex: 1,
        minWidth: 0,
      },
    });

    const triggerIconSlot = resolveSlot<CollapsibleSlot>({
      slot: "triggerIcon",
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
      },
      baseStyle: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "var(--ui-text-muted)",
      },
    });

    if (asChild && React.isValidElement<TriggerChildProps>(content)) {
      return React.cloneElement(content, {
        ref: (node: HTMLElement | null) => {
          assignRef(ref as React.Ref<HTMLElement>, node);
          assignRef(
            (content as React.ReactElement & { ref?: React.Ref<HTMLElement> })
              .ref,
            node
          );
        },
        id: ctx.triggerId,
        disabled: ctx.disabled || content.props.disabled,
        "aria-expanded": ctx.open,
        "aria-controls": ctx.contentId,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          content.props.onClick?.(event);
          handleToggle();
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          content.props.onKeyDown?.(event);

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggle();
          }
        },
      } as TriggerChildProps & { ref: React.Ref<HTMLElement> });
    }

    return (
      <button
        {...triggerSlot}
        ref={ref}
        id={ctx.triggerId}
        type="button"
        aria-expanded={ctx.open}
        aria-controls={ctx.contentId}
        disabled={ctx.disabled}
        onClick={handleToggle}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
      >
        <Flex align="center" justify="space-between" gap="0.75rem">
          <Box {...triggerContentSlot}>{content}</Box>

          {showIcon ? (
            <motion.span
              {...toMotionSlotProps(triggerIconSlot)}
              animate={{ rotate: ctx.open ? 180 : 0 }}
              transition={motionState.getTransition(
                motionState.effectiveLevel,
                ctx.open ? "expand" : "collapse"
              )}
            >
              <ChevronDown size={18} />
            </motion.span>
          ) : null}
        </Flex>
      </button>
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "ref"
    | "initial"
    | "animate"
    | "exit"
    | "transition"
    | "style"
    | "className"
  > {
  children?: React.ReactNode;
  forceMount?: boolean;
  unmountOnExit?: boolean;
  className?: string;
  style?: React.CSSProperties;
  styles?: CollapsibleStyles;
  slotProps?: CollapsibleSlotProps;
}

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(
  (
    {
      children,
      forceMount = false,
      unmountOnExit = true,
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useCollapsibleContext();
    const motionState = useOptionalUIMotion();

    const shouldRender = forceMount || ctx.open || !unmountOnExit;

    const contentSlot = resolveSlot<CollapsibleSlot>({
      slot: "content",
      styles,
      slotProps,
      className,
      style,
      baseStyle: {
        overflow: "hidden",
        minWidth: 0,
      },
    });

    const innerSlot = resolveSlot<CollapsibleSlot>({
      slot: "inner",
      styles,
      slotProps,
      baseStyle: {
        minWidth: 0,
      },
    });

    const content = shouldRender ? (
      <motion.div
        {...rest}
        {...toMotionSlotProps(contentSlot)}
        key="collapsible-content"
        id={ctx.contentId}
        role="region"
        aria-labelledby={ctx.triggerId}
        ref={ref}
        initial={false}
        animate={{
          height: ctx.open ? "auto" : 0,
          opacity: ctx.open ? 1 : 0,
        }}
        exit={{
          height: 0,
          opacity: 0,
        }}
        transition={motionState.getTransition(
          motionState.effectiveLevel,
          ctx.open ? "expand" : "collapse"
        )}
      >
        <div {...innerSlot}>{children}</div>
      </motion.div>
    ) : null;

    if (!unmountOnExit || forceMount) {
      return content;
    }

    return (
      <AnimatePresence initial={false}>
        {ctx.open ? content : null}
      </AnimatePresence>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";