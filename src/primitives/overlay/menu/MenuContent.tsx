// src/primitives/overlay/menu/MenuContent.tsx

import React from "react";

import {
  motion,
} from "framer-motion";

import {
  DismissableLayer,
  FloatingLayer,
  Portal,
  getLayerZIndex,
} from "../../../core/overlay";

import {
  MotionPresenceGroup,
  useOptionalUIMotion,
} from "../../../core/motion";

import {
  setRef,
} from "../../../core/interaction/events";

import {
  resolveSlot,
  toMotionSlotProps,
} from "../../../helpers/css";

import {
  getFloatingSide,
  getMenuTransformOrigin,
} from "./menu.utils";

import {
  useMenuContext,
} from "./menu.context";

import {
  menuRecipe,
} from "./menu.recipe";

import type {
  MenuSlot,
  MenuContentProps,
} from "./menu.types";


export const MenuContent =
  React.forwardRef<HTMLDivElement, MenuContentProps>(
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
      const ctx =
        useMenuContext();

      const motionState =
        useOptionalUIMotion();

      const contentRef =
        React.useRef<HTMLDivElement | null>(
          null
        );

      const restoreFocusTimerRef =
        React.useRef<number | null>(
          null
        );


      const {
        anchorRef,
        focusFirst,
        focusLast,
        focusNext,
        focusPrev,
        onOpenChange,
        open,
      } = ctx;


      const resolvedStyles =
        styles ?? ctx.styles;

      const resolvedSlotProps =
        slotProps ?? ctx.slotProps;


      const setRefs =
        React.useCallback(
          (
            node: HTMLDivElement | null
          ) => {
            contentRef.current =
              node;

            setRef(
              ref,
              node
            );
          },
          [ref]
        );


      React.useEffect(() => {
        return () => {
          if (
            restoreFocusTimerRef.current !== null
          ) {
            window.clearTimeout(
              restoreFocusTimerRef.current
            );
          }
        };
      }, []);


      React.useEffect(() => {
        if (!open) {
          return;
        }


        if (ctx.hasFocusedItem) {
          return;
        }

        const id =
          window.setTimeout(() => {
            ctx.focusItemAt(
              ctx.initialFocusIndex
            );
          }, 0);

        return () => {
          window.clearTimeout(id);
        };
      }, [
        ctx.hasFocusedItem,
        focusFirst,
        open,
      ]);


      const handleDismiss =
        React.useCallback(
          () => {
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
          },
          [
            anchorRef,
            onOpenChange,
          ]
        );


      const handleKeyDown =
        React.useCallback(
          (
            event: React.KeyboardEvent<HTMLDivElement>
          ) => {

            if (
              event.key === "ArrowDown"
            ) {
              event.preventDefault();

              focusNext();

              return;
            }


            if (
              event.key === "ArrowUp"
            ) {
              event.preventDefault();

              focusPrev();

              return;
            }


            if (
              event.key === "Home"
            ) {
              event.preventDefault();

              focusFirst();

              return;
            }


            if (
              event.key === "End"
            ) {
              event.preventDefault();

              focusLast();
            }
          },
          [
            focusFirst,
            focusLast,
            focusNext,
            focusPrev,
          ]
        );

      const variants =
        motionState.getVariants(
          "menu",
          motionState.effectiveLevel
        );


      const transition =
        motionState.getTransition(
          motionState.effectiveLevel,
          "slide"
        );


      const content =
        ctx.open &&
          ctx.anchorRef.current ? (
          <FloatingLayer
            anchorRef={
              ctx.anchorRef
            }
            open={
              ctx.open
            }
            placement={
              placement
            }
            offset={
              offset
            }
            flip={
              flip
            }
            shift={
              shift
            }
            viewportPadding={
              viewportPadding
            }
            zIndex={
              getLayerZIndex(
                "dropdown"
              )
            }
            strategy="fixed"
            matchAnchorWidth={
              matchAnchorWidth
            }
          >
            {({
              ref: floatingRef,
              style: floatingStyle,
              placement: resolvedPlacement,
            }) => {
              const side =
                getFloatingSide(
                  resolvedPlacement
                );


              const dismissableLayerSlot =
                resolveSlot<MenuSlot>({
                  slot:
                    "dismissableLayer",

                  styles:
                    resolvedStyles,

                  slotProps:
                    resolvedSlotProps,

                  baseProps: {
                    "data-ui-menu-dismissable-layer":
                      "",

                    "data-side":
                      side,

                    "data-placement":
                      resolvedPlacement,
                  },

                  baseStyle: {
                    ...floatingStyle,

                    zIndex:
                      getLayerZIndex(
                        "dropdown"
                      ),
                  },
                });


              const contentSlot =
                resolveSlot<MenuSlot>({
                  slot:
                    "content",

                  styles:
                    resolvedStyles,

                  slotProps:
                    resolvedSlotProps,

                  className,

                  style,

                  baseProps: {
                    "data-ui-menu-content":
                      "",

                    "data-side":
                      side,

                    "data-placement":
                      resolvedPlacement,
                  },

                  baseStyle:
                    menuRecipe({
                      transformOrigin:
                        getMenuTransformOrigin(
                          resolvedPlacement
                        ),
                    }).content,
                });


              return (
                <DismissableLayer
                  overlayId={
                    ctx.contentId
                  }
                  layer={
                    getLayerZIndex(
                      "dropdown"
                    )
                  }
                  enabled={
                    ctx.open
                  }
                  dismissOnEscape={
                    closeOnEscape
                  }
                  dismissOnPointerDownOutside={
                    closeOnPointerDownOutside
                  }
                  onDismiss={
                    handleDismiss
                  }
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
                    onKeyDown={
                      handleKeyDown
                    }
                    id={
                      ctx.contentId
                    }
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={
                      ctx.triggerId
                    }
                    variants={
                      variants
                    }
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={
                      transition
                    }
                  >
                    {children}
                  </motion.div>
                </DismissableLayer>
              );
            }}
          </FloatingLayer>
        ) : null;


      const animated =
        (
          <MotionPresenceGroup>
            {content}
          </MotionPresenceGroup>
        );


      return portalled ? (
        <Portal container={container}>
          {animated}
        </Portal>
      ) : (
        animated
      );
    }
  );


MenuContent.displayName =
  "MenuContent";