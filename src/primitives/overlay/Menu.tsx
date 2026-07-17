// src/primitives/overlay/Menu.tsx
import React from "react";
import {
  motion,
} from "framer-motion";
import {
  DismissableLayer,
  FloatingLayer,
  Portal,
  getLayerZIndex,
} from "../../core/overlay";
import {
  usePress,
  type UIPressEvent,
} from "../../core/interaction";
import { composeEventHandlers } from "../../core/interaction/events/composeEventHandlers";
import { setRef } from "../../core/interaction/events";
import {
  MotionPresenceGroup,
  useOptionalUIMotion,
} from "../../core/motion";
import {
  defineSlotRecipe,
  resolveSlot,
  toMotionSlotProps,
  type SlotElementProps,
} from "../../helpers/css";
import {
  getFloatingSide,
  getMenuTransformOrigin,
} from "./menu/menu.utils";
import type {
  MenuProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuSeparatorProps,
  MenuLabelProps,
  MenuSlot,
} from "./menu/menu.types";
import {
  MenuContext,
  type MenuContextValue,
  useMenuContext,
  useOptionalMenuContext,
} from "./menu/menu.context";


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
        ? "0 0 0 3px var(--ui-interaction-focus-ring)"
        : "none",
    },
  }),
});

const DEFAULT_MENU_RECIPE_STYLES =
  menuRecipe({});

type TriggerChildProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;

  onPress?: (
    event: UIPressEvent<HTMLElement>
  ) => void;

  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;

  id?: string;
  className?: string;
  style?: React.CSSProperties;

  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

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

    const focusTimerRef =
      React.useRef<number | null>(null);

    const {
      focusFirst,
      focusLast,
      onOpenChange,
    } = ctx;

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

    React.useEffect(() => {
      return () => {
        if (focusTimerRef.current !== null) {
          window.clearTimeout(
            focusTimerRef.current
          );
        }
      };
    }, []);

    const scheduleFocus =
      React.useCallback(
        (focus: () => void) => {
          if (focusTimerRef.current !== null) {
            window.clearTimeout(
              focusTimerRef.current
            );
          }

          focusTimerRef.current =
            window.setTimeout(() => {
              focusTimerRef.current = null;
              focus();
            }, 0);
        },
        []
      );

    const openAndFocusFirst =
      React.useCallback(() => {
        onOpenChange?.(true);
        scheduleFocus(focusFirst);
      }, [
        focusFirst,
        onOpenChange,
        scheduleFocus,
      ]);

    const openAndFocusLast =
      React.useCallback(() => {
        onOpenChange?.(true);
        scheduleFocus(focusLast);
      }, [
        focusLast,
        onOpenChange,
        scheduleFocus,
      ]);



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

        onPress: (event: UIPressEvent<HTMLElement>) => {
          children.props.onPress?.(event);
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

    const restoreFocusTimerRef =
      React.useRef<number | null>(null);

    const {
      anchorRef,
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
      onOpenChange,
      open,
    } = ctx;

    const resolvedStyles = styles ?? ctx.styles;
    const resolvedSlotProps = slotProps ?? ctx.slotProps;

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        setRef(ref, node);
      },
      [ref]
    );

    React.useEffect(() => {
      return () => {
        if (restoreFocusTimerRef.current !== null) {
          window.clearTimeout(
            restoreFocusTimerRef.current
          );
        }
      };
    }, []);

    const handleDismiss = React.useCallback(() => {
      onOpenChange?.(false);

      if (restoreFocusTimerRef.current !== null) {
        window.clearTimeout(
          restoreFocusTimerRef.current
        );
      }

      restoreFocusTimerRef.current =
        window.setTimeout(() => {
          restoreFocusTimerRef.current = null;
          anchorRef.current?.focus?.();
        }, 0);
    }, [anchorRef, onOpenChange]);

    React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        const containerNode = contentRef.current;
        const active = document.activeElement as Node | null;

        if (
          !containerNode ||
          !active ||
          !containerNode.contains(active)
        ) {
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusNext();
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          focusPrev();
          return;
        }

        if (event.key === "Home") {
          event.preventDefault();
          focusFirst();
          return;
        }

        if (event.key === "End") {
          event.preventDefault();
          focusLast();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
      open,
    ]);

    React.useEffect(() => {
      if (!open) return;

      const id = window.setTimeout(() => {
        const active =
          document.activeElement;

        if (
          active === anchorRef.current
        ) {
          focusFirst();
        }
      }, 0);

      return () => {
        window.clearTimeout(id);
      };
    }, [
      anchorRef,
      focusFirst,
      open,
    ]);

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

    const animated = (
      <MotionPresenceGroup>
        {content}
      </MotionPresenceGroup>
    );

    return portalled ? <Portal container={container}>{animated}</Portal> : animated;
  }
);

MenuContent.displayName = "MenuContent";

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

      const {
        anchorRef,
        onOpenChange,
        registerItem,
        unregisterItem,
      } = ctx;

      const restoreFocusTimerRef =
        React.useRef<number | null>(null);

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
        return () => {
          if (restoreFocusTimerRef.current !== null) {
            window.clearTimeout(
              restoreFocusTimerRef.current
            );
          }
        };
      }, []);

      React.useEffect(() => {
        const node = itemRef.current;

        if (!node) return;

        registerItem(node);

        return () => {
          unregisterItem(node);
        };
      }, [registerItem, unregisterItem]);

      const handleSelect =
        React.useCallback(
          (
            _event:
              UIPressEvent<HTMLElement>
          ) => {
            if (disabled) return;

            onSelect?.();

            if (closeOnSelect) {
              onOpenChange?.(false);

              if (
                restoreFocusTimerRef.current !== null
              ) {
                window.clearTimeout(
                  restoreFocusTimerRef.current
                );
              }

              restoreFocusTimerRef.current =
                window.setTimeout(() => {
                  restoreFocusTimerRef.current = null;
                  anchorRef.current?.focus?.();
                }, 0);
            }
          },
          [
            anchorRef,
            closeOnSelect,
            disabled,
            onOpenChange,
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

            tabIndex: -1,

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