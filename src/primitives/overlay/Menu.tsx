// src/primitives/overlay/Menu.tsx
import React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import {
  DismissableLayer,
  FloatingLayer,
  Portal,
  getLayerZIndex,
  type FloatingPlacement,
} from "../../core/overlay";
import { useOptionalUIMotion } from "../../core/motion";

type MenuContextValue = {
  open: boolean;
  triggerId: string;
  contentId: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  setAnchorNode: (node: HTMLElement | null) => void;
  onOpenChange?: (open: boolean) => void;

  registerItem: (node: HTMLElement | null) => void;
  unregisterItem: (node: HTMLElement | null) => void;

  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrev: () => void;
};

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const ctx = React.useContext(MenuContext);

  if (!ctx) {
    throw new Error("Menu subcomponents must be used inside <Menu />");
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
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  id?: string;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

export interface MenuProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Menu: React.FC<MenuProps> = ({ children, open, onOpenChange }) => {
  const reactId = React.useId().replace(/:/g, "");
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const itemsRef = React.useRef<HTMLElement[]>([]);

  const setAnchorNode = React.useCallback((node: HTMLElement | null) => {
    anchorRef.current = node;
  }, []);

  const getItems = React.useCallback(() => {
    return itemsRef.current.filter(Boolean);
  }, []);

  const registerItem = React.useCallback((node: HTMLElement | null) => {
    if (!node) return;
    if (itemsRef.current.includes(node)) return;

    itemsRef.current = [...itemsRef.current, node];
  }, []);

  const unregisterItem = React.useCallback((node: HTMLElement | null) => {
    if (!node) return;

    itemsRef.current = itemsRef.current.filter((item) => item !== node);
  }, []);

  const focusItemAt = React.useCallback(
    (index: number) => {
      const items = getItems();
      if (!items.length) return;

      const clamped = Math.max(0, Math.min(index, items.length - 1));
      items[clamped]?.focus();
    },
    [getItems]
  );

  const focusFirst = React.useCallback(() => {
    focusItemAt(0);
  }, [focusItemAt]);

  const focusLast = React.useCallback(() => {
    const items = getItems();
    if (!items.length) return;

    focusItemAt(items.length - 1);
  }, [focusItemAt, getItems]);

  const focusNext = React.useCallback(() => {
    const items = getItems();
    if (!items.length) return;

    const active = document.activeElement as HTMLElement | null;
    const index = items.findIndex((item) => item === active);
    const nextIndex = index < 0 ? 0 : Math.min(index + 1, items.length - 1);

    items[nextIndex]?.focus();
  }, [getItems]);

  const focusPrev = React.useCallback(() => {
    const items = getItems();
    if (!items.length) return;

    const active = document.activeElement as HTMLElement | null;
    const index = items.findIndex((item) => item === active);
    const prevIndex = index < 0 ? items.length - 1 : Math.max(index - 1, 0);

    items[prevIndex]?.focus();
  }, [getItems]);

  React.useEffect(() => {
    if (!open) {
      itemsRef.current = [];
    }
  }, [open]);

  const value = React.useMemo<MenuContextValue>(
    () => ({
      open,
      triggerId: `menu-trigger-${reactId}`,
      contentId: `menu-content-${reactId}`,
      anchorRef,
      setAnchorNode,
      onOpenChange,
      registerItem,
      unregisterItem,
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
    }),
    [
      open,
      reactId,
      setAnchorNode,
      onOpenChange,
      registerItem,
      unregisterItem,
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
    ]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

Menu.displayName = "Menu";

export interface MenuTriggerProps {
  children: React.ReactElement<TriggerChildProps>;
  asChild?: boolean;
}

export const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
  ({ children, asChild = true }, ref) => {
    const ctx = useMenuContext();

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

    const openAndFocusFirst = React.useCallback(() => {
      ctx.onOpenChange?.(true);
      window.setTimeout(() => {
        ctx.focusFirst();
      }, 0);
    }, [ctx]);

    const openAndFocusLast = React.useCallback(() => {
      ctx.onOpenChange?.(true);
      window.setTimeout(() => {
        ctx.focusLast();
      }, 0);
    }, [ctx]);

    if (asChild && React.isValidElement<TriggerChildProps>(children)) {
      return React.cloneElement(children, {
        ref: setRefs,
        id: ctx.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": ctx.open,
        "aria-controls": ctx.open ? ctx.contentId : undefined,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onClick?.(event);
          ctx.onOpenChange?.(!ctx.open);
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          children.props.onKeyDown?.(event);

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            ctx.onOpenChange?.(!ctx.open);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            openAndFocusFirst();
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            openAndFocusLast();
          }
        },
      } as TriggerChildProps & { ref: React.Ref<HTMLElement> });
    }

    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        id={ctx.triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={ctx.open}
        aria-controls={ctx.open ? ctx.contentId : undefined}
        onClick={() => ctx.onOpenChange?.(!ctx.open)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            ctx.onOpenChange?.(!ctx.open);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            openAndFocusFirst();
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            openAndFocusLast();
          }
        }}
      >
        {children}
      </button>
    );
  }
);

MenuTrigger.displayName = "MenuTrigger";

export interface MenuContentProps
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
  closeOnEscape?: boolean;
  closeOnPointerDownOutside?: boolean;
  matchAnchorWidth?: boolean;
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
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
      matchAnchorWidth = false,
      ...rest
    },
    ref
  ) => {
    const ctx = useMenuContext();
    const motionState = useOptionalUIMotion();
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );

    const handleDismiss = React.useCallback(() => {
      ctx.onOpenChange?.(false);

      window.setTimeout(() => {
        ctx.anchorRef.current?.focus?.();
      }, 0);
    }, [ctx]);

    React.useEffect(() => {
      if (!ctx.open) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        const containerNode = contentRef.current;
        const active = document.activeElement as Node | null;

        if (!containerNode || !active || !containerNode.contains(active)) {
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          ctx.focusNext();
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          ctx.focusPrev();
          return;
        }

        if (event.key === "Home") {
          event.preventDefault();
          ctx.focusFirst();
          return;
        }

        if (event.key === "End") {
          event.preventDefault();
          ctx.focusLast();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [ctx]);

    React.useEffect(() => {
      if (!ctx.open) return;

      const id = window.setTimeout(() => {
        ctx.focusFirst();
      }, 0);

      return () => {
        window.clearTimeout(id);
      };
    }, [ctx]);

    const variants = motionState.getVariants("menu", motionState.effectiveLevel);
    const transition = motionState.getTransition(
      motionState.effectiveLevel,
      "slide"
    );

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
          zIndex={getLayerZIndex("dropdown")}
          strategy="fixed"
          matchAnchorWidth={matchAnchorWidth}
        >
          {({ ref: floatingRef, style: floatingStyle }) => (
            <DismissableLayer
              overlayId={ctx.contentId}
              layer={getLayerZIndex("dropdown")}
              enabled={ctx.open}
              dismissOnEscape={closeOnEscape}
              dismissOnPointerDownOutside={closeOnPointerDownOutside}
              onDismiss={handleDismiss}
              style={{
                ...floatingStyle,
                zIndex: getLayerZIndex("dropdown"),
              }}
            >
              <motion.div
                ref={(node) => {
                  assignRef(floatingRef, node);
                  setRefs(node);
                }}
                id={ctx.contentId}
                role="menu"
                aria-labelledby={ctx.triggerId}
                className={className}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                style={{
                  minWidth: 180,
                  maxWidth: "min(320px, calc(100vw - 16px))",
                  padding: "0.4rem",
                  borderRadius: "var(--ui-radius-lg)",
                  border: "1px solid var(--ui-border)",
                  background: "var(--ui-surface)",
                  color: "var(--ui-text)",
                  boxShadow: "var(--ui-shadow-lg)",
                  outline: "none",
                  transformOrigin: "top left",
                  ...style,
                }}
                {...rest}
              >
                {children}
              </motion.div>
            </DismissableLayer>
          )}
        </FloatingLayer>
      ) : null;

    const animated = <AnimatePresence>{content}</AnimatePresence>;

    return portalled ? <Portal container={container}>{animated}</Portal> : animated;
  }
);

MenuContent.displayName = "MenuContent";

export interface MenuItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  children?: React.ReactNode;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onSelect?: () => void;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      children,
      disabled = false,
      closeOnSelect = true,
      onSelect,
      style,
      className = "",
      ...rest
    },
    ref
  ) => {
    const ctx = useMenuContext();
    const itemRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        itemRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );

    React.useEffect(() => {
      const node = itemRef.current;
      if (!node) return;

      ctx.registerItem(node);

      return () => {
        ctx.unregisterItem(node);
      };
    }, [ctx]);

    const handleSelect = React.useCallback(() => {
      if (disabled) return;

      onSelect?.();

      if (closeOnSelect) {
        ctx.onOpenChange?.(false);
        window.setTimeout(() => {
          ctx.anchorRef.current?.focus?.();
        }, 0);
      }
    }, [closeOnSelect, ctx, disabled, onSelect]);

    return (
      <div
        ref={setRefs}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: 36,
          padding: "0.6rem 0.75rem",
          borderRadius: "var(--ui-radius-md)",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          outline: "none",
          opacity: disabled ? 0.55 : 1,
          transition:
            "background-color var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard)",
          ...style,
        }}
        onClick={handleSelect}
        onKeyDown={(event) => {
          if (disabled) return;

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleSelect();
          }
        }}
        onMouseEnter={(event) => {
          if (!disabled) {
            event.currentTarget.focus();
            event.currentTarget.style.background = "var(--ui-surface-hover)";
          }
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = "transparent";
        }}
        onFocus={(event) => {
          event.currentTarget.style.boxShadow = "0 0 0 3px var(--ui-focus-ring)";
        }}
        onBlur={(event) => {
          event.currentTarget.style.boxShadow = "none";
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

MenuItem.displayName = "MenuItem";

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        style={{
          height: 1,
          margin: "0.35rem 0",
          background: "var(--ui-border)",
          ...style,
        }}
        {...rest}
      />
    );
  }
);

MenuSeparator.displayName = "MenuSeparator";

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "0.45rem 0.75rem 0.35rem 0.75rem",
          fontSize: "var(--ui-font-size-sm)",
          fontWeight: 700,
          color: "var(--ui-text-muted)",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

MenuLabel.displayName = "MenuLabel";