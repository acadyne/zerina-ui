// src/primitives/overlay/Tooltip.tsx
import React from "react";
import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  FloatingLayer,
  Portal,
  getLayerZIndex,
  type FloatingPlacement,
} from "../../core/overlay";
import {
  MotionPresenceGroup,
  useOptionalUIMotion,
} from "../../core/motion";
import {
  defineSlotRecipe,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { setRef } from "../../core/interaction/events";

export type TooltipSlot =
  | "trigger"
  | "content";

export type TooltipStyles =
  SlotStyleMap<TooltipSlot>;

export type TooltipSlotProps =
  SlotPropsMap<TooltipSlot>;

type TooltipRecipeVariants =
  Record<never, never>;

type TooltipRecipeState = {
  floatingStyle?: React.CSSProperties;
};

/**
 * La recipe concentra únicamente la política visual del Tooltip.
 *
 * FloatingLayer conserva posicionamiento y medición.
 * Motion conserva presencia, variantes y transición.
 * La apertura por puntero, foco y touch se mantiene fuera de Styling.
 */
const tooltipRecipe =
  defineSlotRecipe<
    TooltipSlot,
    TooltipRecipeVariants,
    TooltipRecipeState
  >({
    base: {
      content: {
        maxWidth:
          "min(280px, calc(100vw - 16px))",

        padding: "0.4rem 0.7rem",

        borderRadius:
          "var(--ui-radius-sm)",

        border:
          "1px solid var(--ui-border)",

        background:
          "var(--ui-surface)",

        color:
          "var(--ui-text)",

        boxShadow:
          "var(--ui-shadow-md)",

        fontSize: "0.78rem",
        lineHeight: 1.35,

        pointerEvents: "none",

        transformOrigin: "center",
      },
    },

    resolve: ({
      floatingStyle,
    }) => ({
      content: {
        ...floatingStyle,

        zIndex:
          getLayerZIndex("tooltip"),
      },
    }),
  });

type TooltipContextValue = {
  open: boolean;

  triggerId: string;
  contentId: string;

  anchorRef:
  React.RefObject<HTMLElement | null>;

  setAnchorNode: (
    node: HTMLElement | null
  ) => void;

  setOpen:
  React.Dispatch<
    React.SetStateAction<boolean>
  >;

  openDelayMs: number;
  closeDelayMs: number;
  enableTouch: boolean;

  styles?: TooltipStyles;
  slotProps?: TooltipSlotProps;
};

const TooltipContext =
  React.createContext<
    TooltipContextValue | null
  >(null);

function useTooltipContext() {
  const ctx =
    React.useContext(
      TooltipContext
    );

  if (!ctx) {
    throw new Error(
      "Tooltip subcomponents must be used inside <Tooltip />"
    );
  }

  return ctx;
}

type TooltipPointerType =
  | "mouse"
  | "touch"
  | "pen";

function supportsTooltipHover(
  pointerType: string
): boolean {
  return (
    pointerType === "mouse" ||
    pointerType === "pen"
  );
}

function isTooltipPointerType(
  pointerType: string
): pointerType is TooltipPointerType {
  return (
    pointerType === "mouse" ||
    pointerType === "touch" ||
    pointerType === "pen"
  );
}

type TriggerChildProps = {
  onPointerEnter?:
  React.PointerEventHandler<HTMLElement>;

  onPointerLeave?:
  React.PointerEventHandler<HTMLElement>;

  onPointerDown?:
  React.PointerEventHandler<HTMLElement>;

  onFocus?:
  React.FocusEventHandler<HTMLElement>;

  onBlur?:
  React.FocusEventHandler<HTMLElement>;

  onClick?:
  React.MouseEventHandler<HTMLElement>;

  id?: string;
  className?: string;
  style?: React.CSSProperties;

  "aria-describedby"?: string;
};

export interface TooltipProps {
  children?: React.ReactNode;

  openDelayMs?: number;
  closeDelayMs?: number;
  enableTouch?: boolean;

  styles?: TooltipStyles;
  slotProps?: TooltipSlotProps;
}

export const Tooltip:
  React.FC<TooltipProps> = ({
    children,
    openDelayMs = 150,
    closeDelayMs = 80,
    enableTouch = true,
    styles,
    slotProps,
  }) => {
    const reactId =
      React.useId().replace(
        /:/g,
        ""
      );

    const [
      open,
      setOpen,
    ] = React.useState(false);

    const anchorRef =
      React.useRef<HTMLElement | null>(
        null
      );

    const setAnchorNode =
      React.useCallback(
        (
          node:
            | HTMLElement
            | null
        ) => {
          anchorRef.current = node;
        },
        []
      );

    const value =
      React.useMemo<
        TooltipContextValue
      >(
        () => ({
          open,

          triggerId:
            `tooltip-trigger-${reactId}`,

          contentId:
            `tooltip-content-${reactId}`,

          anchorRef,
          setAnchorNode,
          setOpen,

          openDelayMs,
          closeDelayMs,
          enableTouch,

          styles,
          slotProps,
        }),
        [
          open,
          reactId,
          setAnchorNode,
          openDelayMs,
          closeDelayMs,
          enableTouch,
          styles,
          slotProps,
        ]
      );

    return (
      <TooltipContext.Provider
        value={value}
      >
        {children}
      </TooltipContext.Provider>
    );
  };

Tooltip.displayName = "Tooltip";

export interface TooltipTriggerProps {
  children:
  React.ReactElement<TriggerChildProps>;

  asChild?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: TooltipStyles;
  slotProps?: TooltipSlotProps;
}

export const TooltipTrigger =
  React.forwardRef<
    HTMLElement,
    TooltipTriggerProps
  >(
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
      const ctx =
        useTooltipContext();

      const openTimerRef =
        React.useRef<
          number | null
        >(null);

      const closeTimerRef =
        React.useRef<
          number | null
        >(null);

      const lastPointerTypeRef =
        React.useRef<
          TooltipPointerType | null
        >(null);

      const triggerSlot =
        resolveSlot<TooltipSlot>({
          slot: "trigger",

          styles:
            styles ??
            ctx.styles,

          slotProps:
            slotProps ??
            ctx.slotProps,

          className,
          style,
        });

      const clearTimers =
        React.useCallback(() => {
          if (
            openTimerRef.current !==
            null
          ) {
            window.clearTimeout(
              openTimerRef.current
            );

            openTimerRef.current =
              null;
          }

          if (
            closeTimerRef.current !==
            null
          ) {
            window.clearTimeout(
              closeTimerRef.current
            );

            closeTimerRef.current =
              null;
          }
        }, []);

      React.useEffect(() => {
        return () => {
          clearTimers();
        };
      }, [clearTimers]);

      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLElement
              | null
          ) => {
            ctx.setAnchorNode(
              node
            );

            setRef(
              ref,
              node
            );

            setRef(
              (
                children as React.ReactElement & {
                  ref?: React.Ref<HTMLElement>;
                }
              ).ref,
              node
            );
          },
          [
            children,
            ctx,
            ref,
          ]
        );

      const scheduleOpen =
        React.useCallback(() => {
          clearTimers();

          openTimerRef.current =
            window.setTimeout(
              () => {
                ctx.setOpen(
                  true
                );
              },
              ctx.openDelayMs
            );
        }, [
          clearTimers,
          ctx,
        ]);

      const scheduleClose =
        React.useCallback(() => {
          clearTimers();

          closeTimerRef.current =
            window.setTimeout(
              () => {
                ctx.setOpen(
                  false
                );
              },
              ctx.closeDelayMs
            );
        }, [
          clearTimers,
          ctx,
        ]);

      const handlePointerEnter =
        React.useCallback(
          (
            event:
              React.PointerEvent<HTMLElement>
          ) => {
            if (
              supportsTooltipHover(
                event.pointerType
              )
            ) {
              scheduleOpen();
            }
          },
          [scheduleOpen]
        );

      const handlePointerLeave =
        React.useCallback(
          (
            event:
              React.PointerEvent<HTMLElement>
          ) => {
            if (
              supportsTooltipHover(
                event.pointerType
              )
            ) {
              scheduleClose();
            }
          },
          [scheduleClose]
        );

      const handlePointerDown =
        React.useCallback(
          (
            event:
              React.PointerEvent<HTMLElement>
          ) => {
            if (
              isTooltipPointerType(
                event.pointerType
              )
            ) {
              lastPointerTypeRef.current =
                event.pointerType;
            }
          },
          []
        );

      const handleFocus =
        React.useCallback(() => {
          clearTimers();
          ctx.setOpen(true);
        }, [
          clearTimers,
          ctx,
        ]);

      const handleBlur =
        React.useCallback(() => {
          clearTimers();
          ctx.setOpen(false);
        }, [
          clearTimers,
          ctx,
        ]);

      const handleClick =
        React.useCallback(
          (
            event:
              React.MouseEvent<HTMLElement>
          ) => {
            const isTouchActivation =
              ctx.enableTouch &&
              event.detail !== 0 &&
              lastPointerTypeRef.current ===
              "touch";

            lastPointerTypeRef.current =
              null;

            if (
              !isTouchActivation
            ) {
              return;
            }

            clearTimers();

            ctx.setOpen(
              (previous) =>
                !previous
            );
          },
          [
            clearTimers,
            ctx,
          ]
        );

      if (
        asChild &&
        React.isValidElement<
          TriggerChildProps
        >(children)
      ) {
        return React.cloneElement(
          children,
          {
            ref: setRefs,

            id: ctx.triggerId,

            className: [
              children.props
                .className,

              triggerSlot.className,
            ]
              .filter(Boolean)
              .join(" "),

            style: {
              ...children.props
                .style,

              ...triggerSlot.style,
            },

            "aria-describedby":
              ctx.open
                ? ctx.contentId
                : undefined,

            onPointerEnter: (
              event:
                React.PointerEvent<HTMLElement>
            ) => {
              children.props
                .onPointerEnter?.(
                  event
                );

              if (
                event.defaultPrevented
              ) {
                return;
              }

              handlePointerEnter(
                event
              );
            },

            onPointerLeave: (
              event:
                React.PointerEvent<HTMLElement>
            ) => {
              children.props
                .onPointerLeave?.(
                  event
                );

              if (
                event.defaultPrevented
              ) {
                return;
              }

              handlePointerLeave(
                event
              );
            },

            onPointerDown: (
              event:
                React.PointerEvent<HTMLElement>
            ) => {
              children.props
                .onPointerDown?.(
                  event
                );

              if (
                event.defaultPrevented
              ) {
                return;
              }

              handlePointerDown(
                event
              );
            },

            onFocus: (
              event:
                React.FocusEvent<HTMLElement>
            ) => {
              children.props
                .onFocus?.(event);

              if (
                event.defaultPrevented
              ) {
                return;
              }

              handleFocus();
            },

            onBlur: (
              event:
                React.FocusEvent<HTMLElement>
            ) => {
              children.props
                .onBlur?.(event);

              if (
                event.defaultPrevented
              ) {
                return;
              }

              handleBlur();
            },

            onClick: (
              event:
                React.MouseEvent<HTMLElement>
            ) => {
              children.props
                .onClick?.(event);

              if (
                event.defaultPrevented
              ) {
                return;
              }

              handleClick(event);
            },
          } as TriggerChildProps & {
            ref: React.Ref<HTMLElement>;
          }
        );
      }

      return (
        <button
          ref={
            setRefs as React.Ref<HTMLButtonElement>
          }
          id={ctx.triggerId}
          type="button"
          aria-describedby={
            ctx.open
              ? ctx.contentId
              : undefined
          }
          className={
            triggerSlot.className
          }
          style={
            triggerSlot.style
          }
          onPointerEnter={
            handlePointerEnter
          }
          onPointerLeave={
            handlePointerLeave
          }
          onPointerDown={
            handlePointerDown
          }
          onFocus={
            handleFocus
          }
          onBlur={
            handleBlur
          }
          onClick={
            handleClick
          }
        >
          {children}
        </button>
      );
    }
  );

TooltipTrigger.displayName =
  "TooltipTrigger";

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
    | "custom"
  > {
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  portalled?: boolean;

  container?:
  | Element
  | DocumentFragment
  | null;

  placement?: FloatingPlacement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  viewportPadding?: number;

  closeOnClickOutside?: boolean;

  styles?: TooltipStyles;
  slotProps?: TooltipSlotProps;
}

export const TooltipContent =
  React.forwardRef<
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

        closeOnClickOutside =
        true,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const ctx =
        useTooltipContext();

      const motionState =
        useOptionalUIMotion();

      const contentRef =
        React.useRef<
          HTMLDivElement | null
        >(null);

      const resolvedStyles =
        styles ??
        ctx.styles;

      const resolvedSlotProps =
        slotProps ??
        ctx.slotProps;

      const variants =
        motionState.getVariants(
          "tooltip",
          motionState.effectiveLevel
        );

      const transition =
        motionState.getTransition(
          motionState.effectiveLevel,
          "fade"
        );

      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLDivElement
              | null
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
        if (!ctx.open) {
          return;
        }

        if (
          !closeOnClickOutside
        ) {
          return;
        }

        const handlePointerDown =
          (
            event:
              PointerEvent
          ) => {
            const target =
              event.target as
              | Node
              | null;

            const anchorEl =
              ctx.anchorRef.current;

            const contentEl =
              contentRef.current;

            const clickedAnchor =
              !!anchorEl &&
              !!target &&
              anchorEl.contains(
                target
              );

            const clickedContent =
              !!contentEl &&
              !!target &&
              contentEl.contains(
                target
              );

            if (
              !clickedAnchor &&
              !clickedContent
            ) {
              ctx.setOpen(
                false
              );
            }
          };

        document.addEventListener(
          "pointerdown",
          handlePointerDown
        );

        return () => {
          document.removeEventListener(
            "pointerdown",
            handlePointerDown
          );
        };
      }, [
        closeOnClickOutside,
        ctx,
      ]);

      const content =
        ctx.open &&
          ctx.anchorRef.current ? (
          <FloatingLayer
            anchorRef={
              ctx.anchorRef
            }
            open={ctx.open}
            placement={placement}
            offset={offset}
            flip={flip}
            shift={shift}
            viewportPadding={
              viewportPadding
            }
            zIndex={
              getLayerZIndex(
                "tooltip"
              )
            }
            strategy="fixed"
          >
            {({
              ref:
              floatingRef,

              style:
              floatingStyle,

              placement:
              side,
            }) => {
              const recipeStyles =
                tooltipRecipe({
                  floatingStyle,
                });

              const contentSlot =
                resolveSlot<TooltipSlot>(
                  {
                    slot:
                      "content",

                    styles:
                      resolvedStyles,

                    slotProps:
                      resolvedSlotProps,

                    className,
                    style,

                    baseProps: {
                      "data-side":
                        side,

                      "data-ui-tooltip-content":
                        "",
                    },

                    baseStyle:
                      recipeStyles
                        .content,
                  }
                );

              return (
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
                  id={
                    ctx.contentId
                  }
                  role="tooltip"
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
              );
            }}
          </FloatingLayer>
        ) : null;

      const animated = (
        <MotionPresenceGroup>
          {content}
        </MotionPresenceGroup>
      );

      return portalled ? (
        <Portal
          container={container}
        >
          {animated}
        </Portal>
      ) : (
        animated
      );
    }
  );

TooltipContent.displayName =
  "TooltipContent";