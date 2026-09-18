// src/primitives/overlay/Popover.tsx
import React from "react";
import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  DismissableLayer,
  FloatingOverlayRuntime,
  FocusScope,
  getLayerZIndex,
} from "../../core/overlay";
import {
  useOptionalUIMotion,
} from "../../core/motion";
import {
  defineSlotRecipe,
  resolveContextualSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import { setRef } from "../../core/interaction/events";
import {
  TriggerRuntime,
} from "../../core/interaction/trigger";

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

export type PopoverStyles =
  SlotStyleMap<PopoverSlot>;

export type PopoverSlotProps =
  SlotPropsMap<PopoverSlot>;

type PopoverRecipeVariants =
  Record<never, never>;

type PopoverRecipeState = {
  floatingStyle?: React.CSSProperties;
};

/**
 * La recipe concentra únicamente la política visual del Popover.
 *
 * FloatingLayer conserva posicionamiento y medición.
 * Motion conserva presencia, variantes y transición.
 * Overlay conserva dismiss y administración de foco.
 */
const popoverRecipe =
  defineSlotRecipe<
    PopoverSlot,
    PopoverRecipeVariants,
    PopoverRecipeState
  >({
    base: {
      focusScope: {
        outline: "none",
      },

      content: {
        position: "relative",

        minWidth: 180,

        maxWidth:
          "min(360px, calc(100vw - 16px))",

        borderRadius:
          "var(--ui-radius-lg)",

        border:
          "1px solid var(--ui-border)",

        background:
          "var(--ui-surface)",

        color:
          "var(--ui-text)",

        boxShadow:
          "var(--ui-shadow-lg)",

        outline: "none",

        transformOrigin:
          "top left",
      },

      header: {
        padding:
          "0.85rem 0.9rem 0.65rem 0.9rem",

        borderBottom:
          "1px solid var(--ui-border)",
      },

      body: {
        padding: "0.9rem",
        minWidth: 0,
      },

      footer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",

        gap: "0.6rem",
        flexWrap: "wrap",

        padding:
          "0.7rem 0.9rem 0.9rem 0.9rem",

        borderTop:
          "1px solid var(--ui-border)",
      },
    },

    resolve: ({
      floatingStyle,
    }) => ({
      dismissableLayer: {
        ...floatingStyle,

        zIndex:
          getLayerZIndex("popover"),
      },
    }),
  });

const DEFAULT_POPOVER_RECIPE_STYLES =
  popoverRecipe({
    floatingStyle: undefined,
  });

type TriggerChildProps = {
  onClick?:
  React.MouseEventHandler<HTMLElement>;

  id?: string;
  className?: string;
  style?: React.CSSProperties;

  "aria-haspopup"?:
  React.AriaAttributes["aria-haspopup"];

  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

type PopoverContextValue = {
  open: boolean;

  anchorRef:
  React.RefObject<HTMLElement | null>;

  contentId: string;
  triggerId: string;

  setTriggerNode: (
    node: HTMLElement | null
  ) => void;

  onOpenChange?: (
    open: boolean
  ) => void;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
};

const PopoverContext =
  React.createContext<
    PopoverContextValue | null
  >(null);

function usePopoverContext() {
  const ctx =
    React.useContext(
      PopoverContext
    );

  if (!ctx) {
    throw new Error(
      "Popover subcomponents must be used inside <Popover />"
    );
  }

  return ctx;
}

function useOptionalPopoverContext() {
  return React.useContext(
    PopoverContext
  );
}

export interface PopoverProps {
  children?: React.ReactNode;

  open: boolean;

  onOpenChange?: (
    open: boolean
  ) => void;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const Popover:
  React.FC<PopoverProps> = ({
    children,
    open,
    onOpenChange,
    styles,
    slotProps,
  }) => {
    const reactId =
      React.useId().replace(
        /:/g,
        ""
      );

    const anchorRef =
      React.useRef<HTMLElement | null>(
        null
      );

    const setTriggerNode =
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
        PopoverContextValue
      >(
        () => ({
          open,
          anchorRef,

          contentId:
            `popover-content-${reactId}`,

          triggerId:
            `popover-trigger-${reactId}`,

          setTriggerNode,
          onOpenChange,
          styles,
          slotProps,
        }),
        [
          open,
          onOpenChange,
          reactId,
          setTriggerNode,
          styles,
          slotProps,
        ]
      );

    return (
      <PopoverContext.Provider
        value={value}
      >
        {children}
      </PopoverContext.Provider>
    );
  };

Popover.displayName = "Popover";

export interface PopoverTriggerProps {
  children:
  React.ReactElement<TriggerChildProps>;

  asChild?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverTrigger =
  React.forwardRef<
    HTMLElement,
    PopoverTriggerProps
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
        usePopoverContext();


      const triggerSlot =
        resolveContextualSlot<PopoverSlot>({
          slot:
            "trigger",

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          className,
          style,
        });


      const handlePress =
        React.useCallback(
          () => {
            ctx.onOpenChange?.(
              !ctx.open
            );
          },
          [
            ctx.onOpenChange,
            ctx.open,
          ]
        );


      return (
        <TriggerRuntime
          asChild={
            asChild
          }

          interactionMode="press"

          forwardedRef={
            ref
          }

          onNodeChange={
            ctx.setTriggerNode
          }

          elementProps={{
            ...triggerSlot,

            id:
              ctx.triggerId,

            "aria-haspopup":
              "dialog",

            "aria-expanded":
              ctx.open,

            "aria-controls":
              ctx.open
                ? ctx.contentId
                : undefined,
          }}

          eventLayers={[
            slotProps?.trigger ??
              {},

            ctx.slotProps
              ?.trigger ??
              {},
          ]}

          onPress={
            handlePress
          }
        >
          {children}
        </TriggerRuntime>
      );
    }
  );


PopoverTrigger.displayName =
  "PopoverTrigger";

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

  placement?: PopoverPlacement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  viewportPadding?: number;

  closeOnEscape?: boolean;

  closeOnPointerDownOutside?:
  boolean;

  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;

  initialFocusRef?:
  React.RefObject<
    HTMLElement | null
  >;

  matchAnchorWidth?: boolean;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverContent =
  React.forwardRef<
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

        placement =
        "bottom-start",

        offset = 8,
        flip = true,
        shift = true,

        viewportPadding = 8,

        closeOnEscape = true,

        closeOnPointerDownOutside =
        true,

        trapFocus = false,
        autoFocus = false,
        restoreFocus = true,

        initialFocusRef,

        matchAnchorWidth =
        false,

        "aria-label":
        ariaLabel,

        "aria-labelledby":
        ariaLabelledBy,

        "aria-describedby":
        ariaDescribedBy,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const ctx =
        usePopoverContext();

      const motionState =
        useOptionalUIMotion();

      const variants =
        motionState.getVariants(
          "popover",
          motionState.effectiveLevel
        );

      const transition =
        motionState.getTransition(
          motionState.effectiveLevel,
          "slide"
        );

      const setRefs =
        React.useCallback(
          (
            node:
              | HTMLDivElement
              | null
          ) => {
            setRef(
              ref,
              node
            );
          },
          [ref]
        );

      const handleDismiss =
        React.useCallback(() => {
          ctx.onOpenChange?.(
            false
          );
        }, [ctx.onOpenChange]);

      const resolvedAriaLabelledBy =
        ariaLabel !== undefined ||
          ariaLabelledBy !==
          undefined
          ? ariaLabelledBy
          : ctx.triggerId;

      const focusScopeSlot =
        resolveContextualSlot<PopoverSlot>({
          slot:
            "focusScope",

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          baseStyle:
            DEFAULT_POPOVER_RECIPE_STYLES
              .focusScope,
        });

      return (
        <FloatingOverlayRuntime
          open={
            ctx.open
          }

          present={
            ctx.open &&
            ctx.anchorRef.current !==
              null
          }

          anchorRef={
            ctx.anchorRef
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
              "popover"
            )
          }

          matchAnchorWidth={
            matchAnchorWidth
          }

          portalled={
            portalled
          }

          container={
            container
          }
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
                popoverRecipe({
                  floatingStyle,
                });

              const dismissableLayerSlot =
                resolveContextualSlot<PopoverSlot>(
                  {
                    slot:
                      "dismissableLayer",

                    contextStyles:
                      ctx.styles,

                    contextSlotProps:
                      ctx.slotProps,

                    styles,
                    slotProps,

                    baseStyle:
                      recipeStyles
                        .dismissableLayer,
                  }
                );

              const contentSlot =
                resolveContextualSlot<PopoverSlot>(
                  {
                    slot:
                      "content",

                    contextStyles:
                      ctx.styles,

                    contextSlotProps:
                      ctx.slotProps,

                    styles,
                    slotProps,

                    className,
                    style,

                    baseProps: {
                      "data-side":
                        side,

                      "data-ui-popover-content":
                        "",
                    },

                    baseStyle:
                      recipeStyles
                        .content,
                  }
                );

              return (
                <DismissableLayer
                  overlayId={
                    ctx.contentId
                  }
                  layer={
                    getLayerZIndex(
                      "popover"
                    )
                  }
                  enabled={
                    ctx.open
                  }
                  restoreFocus={
                    restoreFocus
                  }
                  focusHandoffRef={
                    ctx.anchorRef
                  }
                  branches={[
                    ctx.anchorRef,
                  ]}
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
                  {/*
                   * FloatingLayer decide posición.
                   * Motion decide entrada, salida y transición.
                   * La recipe solo aporta la superficie visual.
                   */}
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
                    role="dialog"
                    aria-label={
                      ariaLabel
                    }
                    aria-labelledby={
                      resolvedAriaLabelledBy
                    }
                    aria-describedby={
                      ariaDescribedBy
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
                    <FocusScope
                      contain={
                        trapFocus
                      }
                      autoFocus={
                        autoFocus
                      }
                      initialFocusRef={
                        initialFocusRef
                      }
                      className={
                        focusScopeSlot.className
                      }
                      style={
                        focusScopeSlot.style
                      }
                    >
                      {children}
                    </FocusScope>
                  </motion.div>
                </DismissableLayer>
              );
            }}

        </FloatingOverlayRuntime>
      );
    }
  );

PopoverContent.displayName =
  "PopoverContent";

export interface PopoverHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverHeader =
  React.forwardRef<
    HTMLDivElement,
    PopoverHeaderProps
  >(
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
      const ctx =
        useOptionalPopoverContext();

      const headerSlot =
        resolveContextualSlot<PopoverSlot>({
          slot:
            "header",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

          className,
          style,

          baseStyle:
            DEFAULT_POPOVER_RECIPE_STYLES
              .header,
        });

      return (
        <div
          {...headerSlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );

PopoverHeader.displayName =
  "PopoverHeader";

export interface PopoverBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverBody =
  React.forwardRef<
    HTMLDivElement,
    PopoverBodyProps
  >(
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
      const ctx =
        useOptionalPopoverContext();

      const bodySlot =
        resolveContextualSlot<PopoverSlot>({
          slot:
            "body",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

          className,
          style,

          baseStyle:
            DEFAULT_POPOVER_RECIPE_STYLES
              .body,
        });

      return (
        <div
          {...bodySlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );

PopoverBody.displayName =
  "PopoverBody";

export interface PopoverFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: PopoverStyles;
  slotProps?: PopoverSlotProps;
}

export const PopoverFooter =
  React.forwardRef<
    HTMLDivElement,
    PopoverFooterProps
  >(
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
      const ctx =
        useOptionalPopoverContext();

      const footerSlot =
        resolveContextualSlot<PopoverSlot>({
          slot:
            "footer",

          contextStyles:
            ctx?.styles,

          contextSlotProps:
            ctx?.slotProps,

          styles,
          slotProps,

          className,
          style,

          baseStyle:
            DEFAULT_POPOVER_RECIPE_STYLES
              .footer,
        });

      return (
        <div
          {...footerSlot}
          ref={ref}
          {...rest}
        >
          {children}
        </div>
      );
    }
  );

PopoverFooter.displayName =
  "PopoverFooter";
