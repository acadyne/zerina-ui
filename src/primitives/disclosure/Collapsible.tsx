// src/primitives/disclosure/Collapsible.tsx
import React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useOptionalUIMotion } from "../../core/motion";
import { Box, Flex } from "../layout";

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
    },
    ref
  ) => {
    const ctx = useCollapsibleContext();

    const handleToggle = React.useCallback(() => {
      ctx.onOpenChange?.(!ctx.open);
    }, [ctx]);

    const content =
      typeof children === "function" ? children({ open: ctx.open }) : children;

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
        ref={ref}
        id={ctx.triggerId}
        type="button"
        aria-expanded={ctx.open}
        aria-controls={ctx.contentId}
        disabled={ctx.disabled}
        className={className}
        style={{
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
          ...style,
        }}
        onClick={handleToggle}
        onFocus={(event) => {
          event.currentTarget.style.boxShadow =
            "0 0 0 3px var(--ui-focus-ring)";
        }}
        onBlur={(event) => {
          event.currentTarget.style.boxShadow = "none";
        }}
      >
        <Flex align="center" justify="space-between" gap="0.75rem">
          <Box style={{ flex: 1, minWidth: 0 }}>{content}</Box>

          {showIcon ? (
            <motion.span
              aria-hidden="true"
              animate={{ rotate: ctx.open ? 180 : 0 }}
              transition={{ duration: 0.16 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--ui-text-muted)",
              }}
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
  innerStyle?: React.CSSProperties;
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
      innerStyle,
      ...rest
    },
    ref
  ) => {
    const ctx = useCollapsibleContext();
    const motionState = useOptionalUIMotion();

    const shouldRender = forceMount || ctx.open || !unmountOnExit;

    const content = shouldRender ? (
      <motion.div
        key="collapsible-content"
        id={ctx.contentId}
        role="region"
        aria-labelledby={ctx.triggerId}
        ref={ref}
        className={className}
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
        style={{
          overflow: "hidden",
          minWidth: 0,
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            minWidth: 0,
            ...innerStyle,
          }}
        >
          {children}
        </div>
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