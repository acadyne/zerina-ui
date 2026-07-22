// src/components/navigation-menu/NavigationMenuPanel.tsx

import React from "react";
import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  DismissableLayer,
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
  resolveSlot,
  toMotionSlotProps,
} from "../../helpers/css";
import type {
  NavigationMenuSemantics,
  NavigationMenuSlot,
  NavigationMenuSlotProps,
  NavigationMenuStyles,
} from "./navigationMenu.types";
import { setRef } from "../../core/interaction/events";

function getPanelTransformOrigin(
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

export interface NavigationMenuPanelProps
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
  open: boolean;
  semantics?: NavigationMenuSemantics;
  /**
   * Profundidad del panel.
   *
   * El primer panel abierto desde el menubar usa depth 0.
   */
  depth: number;

  /**
   * Elemento que sirve como ancla del panel.
   */
  anchorRef: React.RefObject<HTMLElement | null>;

  /**
   * Ubicación preferida.
   *
   * FloatingLayer puede invertirla automáticamente si no hay espacio.
   */
  placement: FloatingPlacement;

  children?: React.ReactNode;

  /**
   * Id estable del panel para aria-controls.
   */
  panelId?: string;

  /**
   * Id del trigger que describe el panel.
   */
  labelledBy?: string;

  /**
   * Separación respecto al elemento ancla.
   *
   * @default 6
   */
  offset?: number;

  /**
   * Espacio mínimo respecto al viewport.
   *
   * @default 8
   */
  viewportPadding?: number;

  /**
   * Permite invertir la ubicación al quedarse sin espacio.
   *
   * @default true
   */
  flip?: boolean;

  /**
   * Mantiene el panel dentro del viewport.
   *
   * @default true
   */
  shift?: boolean;

  /**
   * Renderiza el panel dentro de Portal.
   *
   * @default true
   */
  portalled?: boolean;

  container?: Element | DocumentFragment | null;

  /**
   * Se ejecuta al presionar Escape.
   *
   * Normalmente cerrará solo el nivel actual.
   */
  onEscapeDismiss?: () => void;

  /**
   * Se ejecuta al presionar fuera del panel.
   *
   * Normalmente cerrará toda la ruta abierta.
   */
  onPointerDownOutsideDismiss?: () => void;

  /**
   * Permite deshabilitar el cierre con Escape.
   *
   * @default true
   */
  dismissOnEscape?: boolean;

  /**
   * Permite deshabilitar el cierre exterior.
   *
   * @default true
   */
  dismissOnPointerDownOutside?: boolean;

  className?: string;
  style?: React.CSSProperties;

  styles?: NavigationMenuStyles;
  slotProps?: NavigationMenuSlotProps;
}

export const NavigationMenuPanel =
  React.forwardRef<
    HTMLDivElement,
    NavigationMenuPanelProps
  >(
    (
      {
        open,
        semantics = "navigation",
        depth,
        anchorRef,
        placement,

        children,

        panelId,
        labelledBy,

        offset = 6,
        viewportPadding = 8,
        flip = true,
        shift = true,

        portalled = true,
        container,

        onEscapeDismiss,
        onPointerDownOutsideDismiss,

        dismissOnEscape = true,
        dismissOnPointerDownOutside = true,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      forwardedRef
    ) => {
      const generatedId = React.useId().replace(
        /:/g,
        ""
      );

      const resolvedPanelId =
        panelId ??
        `navigation-menu-panel-${generatedId}`;

      const motionState = useOptionalUIMotion();

      const variants = motionState.getVariants(
        "menu",
        motionState.effectiveLevel
      );

      const transition =
        motionState.getTransition(
          motionState.effectiveLevel,
          "slide"
        );

      const layer =
        getLayerZIndex("dropdown") + depth;

      const content =
        open && anchorRef.current ? (
          <FloatingLayer
            anchorRef={anchorRef}
            open={open}
            placement={placement}
            offset={offset}
            flip={flip}
            shift={shift}
            viewportPadding={viewportPadding}
            zIndex={layer}
            strategy="fixed"
          >
            {({
              ref: floatingRef,
              style: floatingStyle,
              placement: resolvedPlacement,
            }) => {
              const panelSlot =
                resolveSlot<NavigationMenuSlot>({
                  slot: "panel",
                  styles,
                  slotProps,
                  className,
                  style,
                  baseProps: {
                    "data-ui-navigation-menu-panel":
                      "",
                    "data-ui-navigation-menu-panel-depth":
                      depth,
                    "data-ui-navigation-menu-panel-placement":
                      resolvedPlacement,
                    "data-side":
                      resolvedPlacement,
                  },
                  baseStyle: {
                    minWidth: 220,
                    maxWidth:
                      "min(360px, calc(100vw - 16px))",
                    maxHeight:
                      "min(70vh, calc(100vh - 16px))",
                    overflowY: "auto",
                    overflowX: "visible",
                    padding: "0.4rem",
                    border:
                      "1px solid var(--ui-border)",
                    borderRadius:
                      "var(--ui-radius-lg)",
                    background:
                      "var(--ui-surface)",
                    color: "var(--ui-text)",
                    boxShadow:
                      "var(--ui-shadow-lg)",
                    outline: "none",
                    boxSizing: "border-box",
                    transformOrigin:
                      getPanelTransformOrigin(
                        resolvedPlacement
                      ),
                  },
                });

              return (
                <DismissableLayer
                  overlayId={resolvedPanelId}
                  layer={layer}
                  enabled={open}
                  dismissOnEscape={false}
                  dismissOnPointerDownOutside={
                    false
                  }
                  onEscapeKeyDown={(
                    _event,
                    context
                  ) => {
                    if (!dismissOnEscape) {
                      return;
                    }

                    context.preventDefault();
                    onEscapeDismiss?.();
                  }}
                  onPointerDownOutside={(
                    _event,
                    context
                  ) => {
                    if (
                      !dismissOnPointerDownOutside
                    ) {
                      return;
                    }

                    context.preventDefault();
                    onPointerDownOutsideDismiss?.();
                  }}
                  style={{
                    ...floatingStyle,
                    zIndex: layer,
                  }}
                >
                  <motion.div
                    {...rest}
                    {...toMotionSlotProps(panelSlot)}
                    ref={(node) => {
                      setRef(
                        floatingRef,
                        node
                      );

                      setRef(
                        forwardedRef,
                        node
                      );
                    }}
                    id={resolvedPanelId}
                    aria-labelledby={
                      semantics === "menubar" ? labelledBy : undefined
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

      return portalled ? (
        <Portal container={container}>
          {animated}
        </Portal>
      ) : (
        animated
      );
    }
  );

NavigationMenuPanel.displayName =
  "NavigationMenuPanel";