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
import {
  usePress,
  type UIPressEvent,
} from "../../core/interaction";
import { composeEventHandlers } from "../../core/interaction/events/composeEventHandlers";
import { setRef } from "../../core/interaction/events";
import { useOptionalUIMotion } from "../../core/motion";
import {
  defineSlotRecipe,
  resolveSlot,
  toMotionSlotProps,
  type SlotElementProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type MenuSlot =
  | "trigger"
  | "dismissableLayer"
  | "content"
  | "item"
  | "separator"
  | "label";

export type MenuStyles = SlotStyleMap<MenuSlot>;

export type MenuSlotProps = SlotPropsMap<MenuSlot>;


type MenuRecipeVariants =
  Record<never, never>;

type MenuRecipeState = {
  transformOrigin?: React.CSSProperties["transformOrigin"];
  hovered?: boolean;
  pressed?: boolean;
  focusVisible?: boolean;
  disabled?: boolean;
};

/**
 * La recipe contiene únicamente política visual.
 *
 * FloatingLayer decide placement y medición; Motion decide presencia y
 * transición; usePress produce los estados de interacción del item.
 */
const menuRecipe = defineSlotRecipe<
  MenuSlot,
  MenuRecipeVariants,
  MenuRecipeState
>({
  base: {
    content: {
      minWidth: 180,
      maxWidth: "min(320px, calc(100vw - 16px))",
      padding: "0.4rem",
      borderRadius: "var(--ui-radius-lg)",
      border: "1px solid var(--ui-border)",
      background: "var(--ui-surface)",
      color: "var(--ui-text)",
      boxShadow: "var(--ui-shadow-lg)",
      outline: "none",
    },

    item: {
      display: "flex",
      alignItems: "center",
      minHeight: 36,
      padding: "0.6rem 0.75rem",
      borderRadius: "var(--ui-radius-md)",
      userSelect: "none",
      outline: "none",
    },

    separator: {
      height: 1,
      margin: "0.35rem 0",
      background: "var(--ui-border)",
    },

    label: {
      padding: "0.45rem 0.75rem 0.35rem 0.75rem",
      fontSize: "var(--ui-font-size-sm)",
      fontWeight: 700,
      color: "var(--ui-text-muted)",
    },
  },

  resolve: ({
    transformOrigin,
    hovered = false,
    pressed = false,
    focusVisible = false,
    disabled = false,
  }) => ({
    content: {
      transformOrigin,
    },

    item: {
      background:
        !disabled && (pressed || hovered)
          ? "var(--ui-surface-hover)"
          : "transparent",

      cursor: disabled
        ? "not-allowed"
        : "pointer",

      opacity: disabled
        ? 0.55
        : 1,

      boxShadow: focusVisible
        ? "0 0 0 3px var(--ui-focus-ring)"
        : "none",
    },
  }),
});

const DEFAULT_MENU_RECIPE_STYLES =
  menuRecipe({});

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

  styles?: MenuStyles;
  slotProps?: MenuSlotProps;
};

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const ctx = React.useContext(MenuContext);

  if (!ctx) {
    throw new Error("Menu subcomponents must be used inside <Menu />");
  }

  return ctx;
}

function useOptionalMenuContext() {
  return React.useContext(MenuContext);
}

function getFloatingSide(
  placement: FloatingPlacement
): "top" | "bottom" | "left" | "right" {
  return placement.split("-")[0] as
    | "top"
    | "bottom"
    | "left"
    | "right";
}

function getMenuTransformOrigin(
  placement: FloatingPlacement
): React.CSSProperties["transformOrigin"] {
  switch (placement) {
    case "top":
      return "bottom center";

    case "top-start":
      return "bottom left";

    case "top-end":
      return "bottom right";

    case "bottom":
      return "top center";

    case "bottom-start":
      return "top left";

    case "bottom-end":
      return "top right";

    case "left":
      return "center right";

    case "left-start":
      return "top right";

    case "left-end":
      return "bottom right";

    case "right":
      return "center left";

    case "right-start":
      return "top left";

    case "right-end":
      return "bottom left";

    default:
      return "top left";
  }
}

type TriggerChildProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

export interface MenuProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;

  styles?: MenuStyles;
  slotProps?: MenuSlotProps;
}

export const Menu: React.FC<MenuProps> = ({
  children,
  open,
  onOpenChange,
  styles,
  slotProps,
}) => {
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
      styles,
      slotProps,
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
      styles,
      slotProps,
    ]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

Menu.displayName = "Menu";

export interface MenuTriggerProps {
  children: React.ReactElement<TriggerChildProps>;
  asChild?: boolean;

  className?: string;
  style?: React.CSSProperties;
  styles?: MenuStyles;
  slotProps?: MenuSlotProps;
}

export const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
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
    const ctx = useMenuContext();

    const triggerSlot = resolveSlot<MenuSlot>({
      slot: "trigger",
      styles: styles ?? ctx.styles,
      slotProps: slotProps ?? ctx.slotProps,
      className,
      style,
    });

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        ctx.setAnchorNode(node);
        setRef(ref, node);
        setRef(
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
        className: [children.props.className, triggerSlot.className]
          .filter(Boolean)
          .join(" "),
        style: {
          ...children.props.style,
          ...triggerSlot.style,
        },
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
        className={triggerSlot.className}
        style={triggerSlot.style}
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

  styles?: MenuStyles;
  slotProps?: MenuSlotProps;
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
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useMenuContext();
    const motionState = useOptionalUIMotion();
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const resolvedStyles = styles ?? ctx.styles;
    const resolvedSlotProps = slotProps ?? ctx.slotProps;

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        setRef(ref, node);
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
          {({
            ref: floatingRef,
            style: floatingStyle,
            placement: resolvedPlacement,
          }) => {
            const side = getFloatingSide(
              resolvedPlacement
            );

            const dismissableLayerSlot =
              resolveSlot<MenuSlot>({
                slot: "dismissableLayer",
                styles: resolvedStyles,
                slotProps: resolvedSlotProps,
                baseProps: {
                  "data-ui-menu-dismissable-layer": "",
                  "data-side": side,
                  "data-placement": resolvedPlacement,
                },
                baseStyle: {
                  ...floatingStyle,
                  zIndex:
                    getLayerZIndex("dropdown"),
                },
              });

            const contentSlot =
              resolveSlot<MenuSlot>({
                slot: "content",
                styles: resolvedStyles,
                slotProps: resolvedSlotProps,
                className,
                style,
                baseProps: {
                  "data-ui-menu-content": "",
                  "data-side": side,
                  "data-placement":
                    resolvedPlacement,
                },
                baseStyle: menuRecipe({
                  transformOrigin:
                    getMenuTransformOrigin(
                      resolvedPlacement
                    ),
                }).content,
              });

            return (
              <DismissableLayer
                overlayId={ctx.contentId}
                layer={
                  getLayerZIndex("dropdown")
                }
                enabled={ctx.open}
                dismissOnEscape={closeOnEscape}
                dismissOnPointerDownOutside={
                  closeOnPointerDownOutside
                }
                onDismiss={handleDismiss}
                className={
                  dismissableLayerSlot.className
                }
                style={
                  dismissableLayerSlot.style
                }
              >
                <motion.div
                  {...rest}
                  {...toMotionSlotProps(
                    contentSlot
                  )}
                  ref={(node) => {
                    setRef(
                      floatingRef,
                      node
                    );

                    setRefs(node);
                  }}
                  id={ctx.contentId}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby={
                    ctx.triggerId
                  }
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                >
                  {children}
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

MenuContent.displayName = "MenuContent";

export interface MenuItemProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onClick"
  > {
  children?: React.ReactNode;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onSelect?: () => void;

  styles?: MenuStyles;
  slotProps?: MenuSlotProps;
}

export const MenuItem =
  React.forwardRef<
    HTMLDivElement,
    MenuItemProps
  >(
    (
      {
        children,
        disabled = false,
        closeOnSelect = true,
        onSelect,

        className = "",
        style,

        styles,
        slotProps,

        onPointerEnter,
        onPointerLeave,
        onPointerDown,
        onPointerUp,
        onPointerCancel,
        onLostPointerCapture,

        onFocus,
        onBlur,

        onKeyDown,
        onKeyUp,

        ...rest
      },
      ref
    ) => {
      const ctx =
        useMenuContext();

      const itemRef =
        React.useRef<
          HTMLDivElement | null
        >(null);

      const resolvedStyles =
        styles ?? ctx.styles;

      const resolvedSlotProps =
        slotProps ?? ctx.slotProps;

      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLDivElement
              | null
          ) => {
            itemRef.current = node;
            setRef(ref, node);
          },
          [ref]
        );

      React.useEffect(() => {
        const node =
          itemRef.current;

        if (!node) return;

        ctx.registerItem(node);

        return () => {
          ctx.unregisterItem(
            node
          );
        };
      }, [ctx]);

      const handleSelect =
        React.useCallback(
          (
            _event:
              UIPressEvent<HTMLElement>
          ) => {
            if (disabled) return;

            onSelect?.();

            if (closeOnSelect) {
              ctx.onOpenChange?.(
                false
              );

              window.setTimeout(
                () => {
                  ctx.anchorRef.current?.focus?.();
                },
                0
              );
            }
          },
          [
            closeOnSelect,
            ctx,
            disabled,
            onSelect,
          ]
        );

      /*
       * El foco por puntero conserva el comportamiento histórico del menú,
       * mientras usePress sigue siendo la única fuente del estado hovered.
       */
      const focusOnPointerEnter =
        React.useCallback(
          (
            event:
              React.PointerEvent<HTMLDivElement>
          ) => {
            if (!disabled) {
              event.currentTarget.focus();
            }
          },
          [disabled]
        );

      const preliminarySlot =
        resolveSlot<MenuSlot>({
          slot: "item",

          styles:
            resolvedStyles,

          slotProps:
            resolvedSlotProps,

          className,
          style,

          baseProps: {
            role: "menuitem",

            tabIndex: disabled
              ? -1
              : 0,

            "aria-disabled":
              disabled ||
              undefined,

            "data-ui-menu-item":
              "",
          },

          baseStyle:
            DEFAULT_MENU_RECIPE_STYLES
              .item,
        });

      const {
        onPointerEnter:
          slotOnPointerEnter,

        onPointerLeave:
          slotOnPointerLeave,

        onPointerDown:
          slotOnPointerDown,

        onPointerUp:
          slotOnPointerUp,

        onPointerCancel:
          slotOnPointerCancel,

        onLostPointerCapture:
          slotOnLostPointerCapture,

        onFocus:
          slotOnFocus,

        onBlur:
          slotOnBlur,

        onKeyDown:
          slotOnKeyDown,

        onKeyUp:
          slotOnKeyUp,

        onClick:
          slotOnClick,

        ...preliminarySlotRest
      } = preliminarySlot as SlotElementProps;

      const press =
        usePress<HTMLDivElement>({
          disabled,
          nativeInteractive: false,
          onPress: handleSelect,

          onPointerEnter:
            composeEventHandlers(
              composeEventHandlers(
                onPointerEnter,
                slotOnPointerEnter
              ),
              focusOnPointerEnter,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onPointerLeave:
            composeEventHandlers(
              onPointerLeave,
              slotOnPointerLeave,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onPointerDown:
            composeEventHandlers(
              onPointerDown,
              slotOnPointerDown
            ),

          onPointerUp:
            composeEventHandlers(
              onPointerUp,
              slotOnPointerUp,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onPointerCancel:
            composeEventHandlers(
              onPointerCancel,
              slotOnPointerCancel,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onLostPointerCapture:
            composeEventHandlers(
              onLostPointerCapture,
              slotOnLostPointerCapture,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onFocus:
            composeEventHandlers(
              onFocus,
              slotOnFocus
            ),

          onBlur:
            composeEventHandlers(
              onBlur,
              slotOnBlur,
              {
                checkDefaultPrevented:
                  false,
              }
            ),

          onKeyDown:
            composeEventHandlers(
              onKeyDown,
              slotOnKeyDown
            ),

          onKeyUp:
            composeEventHandlers(
              onKeyUp,
              slotOnKeyUp
            ),

          onClick:
            slotOnClick,
        });

      const itemSlot =
        resolveSlot<MenuSlot>({
          slot: "item",

          className:
            preliminarySlotRest.className,

          style:
            preliminarySlotRest.style,

          baseProps: {
            role:
              preliminarySlotRest.role,

            tabIndex:
              preliminarySlotRest.tabIndex,

            "aria-disabled":
              preliminarySlotRest[
                "aria-disabled"
              ],

            "data-ui-menu-item":
              "",

            "data-hovered":
              press.state.hovered ||
              undefined,

            "data-pressed":
              press.state.pressed ||
              undefined,

            "data-focused":
              press.state.focused ||
              undefined,

            "data-focus-visible":
              press.state.focusVisible ||
              undefined,

            "data-disabled":
              disabled ||
              undefined,
          },

          baseStyle:
            menuRecipe({
              hovered:
                press.state.hovered,

              pressed:
                press.state.pressed,

              focusVisible:
                press.state.focusVisible,

              disabled,
            }).item,
        });

      return (
        <div
          {...rest}
          {...itemSlot}
          {...press.pressProps}
          ref={setRefs}
        >
          {children}
        </div>
      );
    }
  );

MenuItem.displayName =
  "MenuItem";

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  styles?: MenuStyles;
  slotProps?: MenuSlotProps;
}

export const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  (
    {
      className = "",
      style,
      styles,
      slotProps,
      ...rest
    },
    ref
  ) => {
    const ctx = useOptionalMenuContext();

    const separatorSlot = resolveSlot<MenuSlot>({
      slot: "separator",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle:
        DEFAULT_MENU_RECIPE_STYLES
          .separator,
    });

    return <div {...separatorSlot} ref={ref} role="separator" {...rest} />;
  }
);

MenuSeparator.displayName = "MenuSeparator";

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  styles?: MenuStyles;
  slotProps?: MenuSlotProps;
}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
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
    const ctx = useOptionalMenuContext();

    const labelSlot = resolveSlot<MenuSlot>({
      slot: "label",
      styles: styles ?? ctx?.styles,
      slotProps: slotProps ?? ctx?.slotProps,
      className,
      style,
      baseStyle:
        DEFAULT_MENU_RECIPE_STYLES
          .label,
    });

    return (
      <div {...labelSlot} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

MenuLabel.displayName = "MenuLabel";