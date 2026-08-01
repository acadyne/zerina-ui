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
import {
  composeEventHandlers,
} from "../../core/interaction/events/composeEventHandlers";
import {
  mergeTriggerProps,
} from "./triggerProps";
import {
  clearOwnedWindowTimeout,
  getNodeEventRoot,
  isEventInsideNode,
  setOwnedWindowTimeout,
  type DOMEventRoot,
  type OwnedWindowTimeout,
} from "../../core/dom";
import {
  useIsomorphicLayoutEffect,
} from "../../core/react/useIsomorphicLayoutEffect";

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

  anchorNode:
  HTMLElement | null;

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

    const [
      anchorNode,
      setAnchorNodeState,
    ] =
      React.useState<HTMLElement | null>(
        null
      );

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

          setAnchorNodeState(
            (currentNode) =>
              currentNode === node
                ? currentNode
                : node
          );
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

          anchorNode,
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
          anchorNode,
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

      const {
        contentId,
        enableTouch,
        open,
        openDelayMs,
        closeDelayMs,
        setAnchorNode,
        setOpen,
        triggerId,
      } = ctx;

      const openTimerRef =
        React.useRef<
          OwnedWindowTimeout | null
        >(null);

      const closeTimerRef =
        React.useRef<
          OwnedWindowTimeout | null
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
            clearOwnedWindowTimeout(
              openTimerRef.current
            );

            openTimerRef.current =
              null;
          }

          if (
            closeTimerRef.current !==
            null
          ) {
            clearOwnedWindowTimeout(
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

      const childRef =
        (
          children as React.ReactElement & {
            ref?: React.Ref<HTMLElement>;
          }
        ).ref;

      /*
       * La identidad del elemento React puede cambiar en cada render aunque
       * su ref no cambie. Depender de la ref real evita ciclos null → node
       * que alterarían artificialmente el nodo committed del anchor.
       */
      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLElement
              | null
          ) => {
            setAnchorNode(
              node
            );

            setRef(
              ref,
              node
            );

            setRef(
              childRef,
              node
            );
          },
          [
            childRef,
            ref,
            setAnchorNode,
          ]
        );

      const scheduleOpen =
        React.useCallback(() => {
          clearTimers();

          const ownerWindow =
            ctx.anchorRef.current
              ?.ownerDocument.defaultView;

          if (!ownerWindow) {
            return;
          }

          openTimerRef.current =
            setOwnedWindowTimeout(
              ownerWindow,
              () => {
                openTimerRef.current = null;
                setOpen(true);
              },
              openDelayMs
            );
        }, [
          clearTimers,
          ctx.anchorRef,
          openDelayMs,
          setOpen,
        ]);

      const scheduleClose =
        React.useCallback(() => {
          clearTimers();

          const ownerWindow =
            ctx.anchorRef.current
              ?.ownerDocument.defaultView;

          if (!ownerWindow) {
            return;
          }

          closeTimerRef.current =
            setOwnedWindowTimeout(
              ownerWindow,
              () => {
                closeTimerRef.current = null;
                setOpen(false);
              },
              closeDelayMs
            );
        }, [
          clearTimers,
          ctx.anchorRef,
          closeDelayMs,
          setOpen,
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
          setOpen(true);
        }, [
          clearTimers,
          setOpen,
        ]);

      const handleBlur =
        React.useCallback(() => {
          clearTimers();
          setOpen(false);
        }, [
          clearTimers,
          setOpen,
        ]);

      const handleClick =
        React.useCallback(
          (
            event:
              React.MouseEvent<HTMLElement>
          ) => {
            const isTouchActivation =
              enableTouch &&
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

            setOpen(
              (previous) =>
                !previous
            );
          },
          [
            clearTimers,
            enableTouch,
            setOpen,
          ]
        );

      if (
        asChild &&
        React.isValidElement<
          TriggerChildProps
        >(children)
      ) {
        const {
          className:
            mergedClassName,

          style:
            mergedStyle,

          onPointerEnter:
            mergedOnPointerEnter,

          onPointerLeave:
            mergedOnPointerLeave,

          onPointerDown:
            mergedOnPointerDown,

          onFocus:
            mergedOnFocus,

          onBlur:
            mergedOnBlur,

          onClick:
            mergedOnClick,

          ...mergedRest
        } = mergeTriggerProps(
          children.props,
          triggerSlot
        );

        return React.cloneElement(
          children,
          {
            /*
             * Los atributos del slot son públicos; la identidad y la relación
             * con el contenido siguen siendo invariantes del Tooltip.
             */
            ...mergedRest,

            ref: setRefs,
            id: triggerId,

            className:
              mergedClassName,

            style:
              mergedStyle,

            "aria-describedby":
              open
                ? contentId
                : undefined,

            onPointerEnter:
              composeEventHandlers(
                mergedOnPointerEnter,
                handlePointerEnter
              ),

            onPointerLeave:
              composeEventHandlers(
                mergedOnPointerLeave,
                handlePointerLeave
              ),

            onPointerDown:
              composeEventHandlers(
                mergedOnPointerDown,
                handlePointerDown
              ),

            onFocus:
              composeEventHandlers(
                mergedOnFocus,
                handleFocus
              ),

            onBlur:
              composeEventHandlers(
                mergedOnBlur,
                handleBlur
              ),

            onClick:
              composeEventHandlers(
                mergedOnClick,
                handleClick
              ),
          } as TriggerChildProps &
            React.HTMLAttributes<HTMLElement> & {
              ref:
                React.Ref<HTMLElement>;
            }
        );
      }

      const {
        className:
          triggerClassName,

        style:
          triggerStyle,

        onPointerEnter:
          triggerOnPointerEnter,

        onPointerLeave:
          triggerOnPointerLeave,

        onPointerDown:
          triggerOnPointerDown,

        onFocus:
          triggerOnFocus,

        onBlur:
          triggerOnBlur,

        onClick:
          triggerOnClick,

        ...triggerRest
      } = triggerSlot;

      return (
        <button
          {...triggerRest}

          ref={
            setRefs as React.Ref<HTMLButtonElement>
          }

          id={triggerId}
          type="button"

          aria-describedby={
            open
              ? contentId
              : undefined
          }

          className={
            triggerClassName
          }

          style={
            triggerStyle
          }

          onPointerEnter={
            composeEventHandlers(
              triggerOnPointerEnter,
              handlePointerEnter
            )
          }

          onPointerLeave={
            composeEventHandlers(
              triggerOnPointerLeave,
              handlePointerLeave
            )
          }

          onPointerDown={
            composeEventHandlers(
              triggerOnPointerDown,
              handlePointerDown
            )
          }

          onFocus={
            composeEventHandlers(
              triggerOnFocus,
              handleFocus
            )
          }

          onBlur={
            composeEventHandlers(
              triggerOnBlur,
              handleBlur
            )
          }

          onClick={
            composeEventHandlers(
              triggerOnClick,
              handleClick
            )
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

      const {
        anchorNode,
        anchorRef,
        contentId,
        open,
        setOpen,
      } = ctx;

      const motionState =
        useOptionalUIMotion();

      const contentRef =
        React.useRef<
          HTMLDivElement | null
        >(null);

      const [
        contentNode,
        setContentNode,
      ] =
        React.useState<HTMLDivElement | null>(
          null
        );

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

            setContentNode(
              (currentNode) =>
                currentNode === node
                  ? currentNode
                  : node
            );

            setRef(
              ref,
              node
            );
          },
          [ref]
        );

      useIsomorphicLayoutEffect(() => {
        if (
          !open ||
          !closeOnClickOutside
        ) {
          return;
        }

        const nodes = [
          anchorNode,
          contentNode,
        ].filter(
          (node): node is HTMLElement =>
            node !== null
        );

        const roots =
          new Set<DOMEventRoot>();

        nodes.forEach((node) => {
          roots.add(node.ownerDocument);
          roots.add(getNodeEventRoot(node));
        });

        const processedEvents =
          new WeakSet<Event>();

        const handlePointerDown:
          EventListener = (event) => {
            if (
              processedEvents.has(event)
            ) {
              return;
            }

            processedEvents.add(event);

            if (
              (
                anchorNode &&
                isEventInsideNode(
                  event,
                  anchorNode
                )
              ) ||
              (
                contentNode &&
                isEventInsideNode(
                  event,
                  contentNode
                )
              )
            ) {
              return;
            }

            setOpen(false);
          };

        roots.forEach((root) => {
          root.addEventListener(
            "pointerdown",
            handlePointerDown
          );
        });

        return () => {
          roots.forEach((root) => {
            root.removeEventListener(
              "pointerdown",
              handlePointerDown
            );
          });
        };
      }, [
        anchorNode,
        closeOnClickOutside,
        contentNode,
        open,
        setOpen,
      ]);

      const content =
        open &&
          anchorNode ? (
          <FloatingLayer
            anchorRef={
              anchorRef
            }
            floatingElementRef={
              setRefs
            }
            open={open}
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
                  ref={
                    floatingRef
                  }
                  id={
                    contentId
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
