// src/primitives/navigation/RecursiveFloatingMenuLayer.tsx
import React from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  DismissableLayer,
  getLayerZIndex,
} from "../../core/overlay";
import { useOptionalUIMotion } from "../../core/motion";
import {
  defineSlotRecipe,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";

export type RecursiveFloatingMenuLayerSlot =
  | "dismissableLayer"
  | "panel";

export type RecursiveFloatingMenuLayerStyles =
  SlotStyleMap<RecursiveFloatingMenuLayerSlot>;

export type RecursiveFloatingMenuLayerSlotProps =
  SlotPropsMap<RecursiveFloatingMenuLayerSlot>;

export interface RecursiveFloatingMenuLayerProps {
  open: boolean;
  level: number;
  anchorX: number;

  containerRef:
    React.RefObject<HTMLElement | null>;

  direction?: "up" | "down";
  edgeMargin?: number;

  onDismiss?: () => void;

  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  styles?: RecursiveFloatingMenuLayerStyles;
  slotProps?: RecursiveFloatingMenuLayerSlotProps;
}

type RecursiveFloatingMenuLayerRecipeVariants = {
  direction: "up" | "down";
};

type RecursiveFloatingMenuLayerRecipeState = {
  left: number;
  verticalOffsetRem: number;
  zIndex: number;
};

/**
 * La recipe concentra la política visual de la capa flotante.
 *
 * La medición, el posicionamiento dinámico, la presencia, el dismiss
 * y las transiciones permanecen en sus sistemas correspondientes.
 */
const recursiveFloatingMenuLayerRecipe =
  defineSlotRecipe<
    RecursiveFloatingMenuLayerSlot,
    RecursiveFloatingMenuLayerRecipeVariants,
    RecursiveFloatingMenuLayerRecipeState
  >({
    base: {
      dismissableLayer: {
        position: "absolute",
        inset: 0,

        pointerEvents: "none",
      },

      panel: {
        position: "absolute",

        display: "flex",
        flexDirection: "column",

        gap: "0.4rem",

        maxWidth:
          "calc(100vw - 20px)",

        padding: "0.75rem",

        border:
          "1px solid var(--ui-border)",

        borderRadius:
          "var(--ui-radius-lg)",

        background:
          "var(--ui-surface)",

        color:
          "var(--ui-text)",

        boxShadow:
          "var(--ui-shadow-lg)",

        backdropFilter:
          "blur(6px)",

        WebkitBackdropFilter:
          "blur(6px)",

        pointerEvents: "auto",
      },
    },

    variants: {
      direction: {
        up: {
          panel: {
            top: undefined,

            transformOrigin:
              "bottom center",
          },
        },

        down: {
          panel: {
            bottom: undefined,

            transformOrigin:
              "top center",
          },
        },
      },
    },

    resolve: ({
      direction,
      left,
      verticalOffsetRem,
      zIndex,
    }) => ({
      dismissableLayer: {
        zIndex,
      },

      panel: {
        left,

        top:
          direction === "down"
            ? `${verticalOffsetRem}rem`
            : undefined,

        bottom:
          direction === "up"
            ? `${verticalOffsetRem}rem`
            : undefined,
      },
    }),
  });

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(
    min,
    Math.min(value, max)
  );
}

export const RecursiveFloatingMenuLayer:
  React.FC<RecursiveFloatingMenuLayerProps> = ({
    open,
    level,
    anchorX,

    containerRef,

    direction = "up",
    edgeMargin = 10,

    onDismiss,

    children,

    className = "",
    style,

    styles,
    slotProps,
  }) => {
    const overlayId =
      React.useId().replace(
        /:/g,
        ""
      );

    const panelRef =
      React.useRef<HTMLDivElement | null>(
        null
      );

    const [
      left,
      setLeft,
    ] = React.useState(0);

    const motionState =
      useOptionalUIMotion();

    const variants =
      motionState.getVariants(
        direction === "up"
          ? "slide-up"
          : "slide-down",

        motionState.effectiveLevel
      );

    const transition =
      motionState.getTransition(
        motionState.effectiveLevel,
        "slide"
      );

    const updatePosition =
      React.useCallback(() => {
        const containerElement =
          containerRef.current;

        const panelElement =
          panelRef.current;

        if (
          !open ||
          !containerElement ||
          !panelElement
        ) {
          return;
        }

        const containerRect =
          containerElement.getBoundingClientRect();

        const panelRect =
          panelElement.getBoundingClientRect();

        const minLeft =
          edgeMargin;

        const maxLeft =
          Math.max(
            edgeMargin,

            containerRect.width -
              panelRect.width -
              edgeMargin
          );

        const nextLeft =
          clamp(
            anchorX -
              panelRect.width / 2,

            minLeft,
            maxLeft
          );

        setLeft(nextLeft);
      }, [
        anchorX,
        containerRef,
        edgeMargin,
        open,
      ]);

    React.useLayoutEffect(() => {
      if (!open) {
        return;
      }

      updatePosition();
    }, [
      open,
      updatePosition,
      children,
    ]);

    /*
     * La medición y escucha directa de resize/scroll quedan registradas
     * como deuda de Viewport/DOM. Esta fase solo centraliza Styling.
     */
    React.useEffect(() => {
      if (!open) {
        return;
      }

      const handleResize = () => {
        updatePosition();
      };

      const handleScroll = () => {
        updatePosition();
      };

      window.addEventListener(
        "resize",
        handleResize
      );

      const containerElement =
        containerRef.current;

      containerElement?.addEventListener(
        "scroll",
        handleScroll,
        {
          passive: true,
        }
      );

      const resizeObserver =
        typeof ResizeObserver !==
        "undefined"
          ? new ResizeObserver(
              updatePosition
            )
          : null;

      if (containerElement) {
        resizeObserver?.observe(
          containerElement
        );
      }

      if (panelRef.current) {
        resizeObserver?.observe(
          panelRef.current
        );
      }

      return () => {
        window.removeEventListener(
          "resize",
          handleResize
        );

        containerElement?.removeEventListener(
          "scroll",
          handleScroll
        );

        resizeObserver?.disconnect();
      };
    }, [
      open,
      updatePosition,
      containerRef,
    ]);

    const verticalOffsetRem =
      level * 2.2;

    const zIndex =
      getLayerZIndex("popover") +
      level;

    const recipeStyles =
      recursiveFloatingMenuLayerRecipe(
        {
          direction,

          left,
          verticalOffsetRem,
          zIndex,
        }
      );

    const dismissableLayerSlot =
      resolveSlot<RecursiveFloatingMenuLayerSlot>(
        {
          slot:
            "dismissableLayer",

          styles,
          slotProps,

          baseProps: {
            "data-ui-recursive-floating-menu-layer":
              "",

            "data-ui-recursive-floating-menu-level":
              level,

            "data-ui-recursive-floating-menu-direction":
              direction,
          },

          baseStyle:
            recipeStyles
              .dismissableLayer,
        }
      );

    const panelSlot =
      resolveSlot<RecursiveFloatingMenuLayerSlot>(
        {
          slot: "panel",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-recursive-floating-menu-panel":
              "",

            "data-ui-recursive-floating-menu-level":
              level,

            "data-ui-recursive-floating-menu-direction":
              direction,
          },

          baseStyle:
            recipeStyles.panel,
        }
      );

    return (
      <AnimatePresence>
        {open ? (
          <DismissableLayer
            overlayId={
              `recursive-floating-menu-${overlayId}`
            }
            layer={zIndex}
            enabled={open}
            dismissOnEscape
            dismissOnPointerDownOutside
            onDismiss={onDismiss}
            className={
              dismissableLayerSlot.className
            }
            style={
              dismissableLayerSlot.style
            }
          >
            <motion.div
              {...toMotionSlotProps(
                panelSlot
              )}
              ref={panelRef}
              variants={variants}
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
        ) : null}
      </AnimatePresence>
    );
  };

RecursiveFloatingMenuLayer.displayName =
  "RecursiveFloatingMenuLayer";