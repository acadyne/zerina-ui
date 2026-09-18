import React from "react";

import {
  MotionPresenceGroup,
} from "../motion";

import {
  FloatingLayer,
  type FloatingLayerRenderProps,
  type FloatingPlacement,
} from "./FloatingLayer";

import {
  Portal,
} from "./Portal";


export interface FloatingOverlayRuntimeProps {
  open:
    boolean;

  /**
   * Controla presencia visual dentro de MotionPresenceGroup.
   *
   * Permite que cada dominio decida si además de open necesita un anchor
   * committed u otra precondición. El runtime no posee esa política.
   */
  present?:
    boolean;

  anchorRef:
    React.RefObject<HTMLElement | null>;

  floatingElementRef?:
    React.Ref<HTMLDivElement>;

  placement?:
    FloatingPlacement;

  offset?:
    number;

  flip?:
    boolean;

  shift?:
    boolean;

  viewportPadding?:
    number;

  zIndex?:
    number;

  matchAnchorWidth?:
    boolean;

  updateOnResize?:
    boolean;

  updateOnScroll?:
    boolean;

  portalled?:
    boolean;

  container?:
    Element | DocumentFragment | null;

  children:
    (
      props:
        FloatingLayerRenderProps
    ) => React.ReactNode;
}


/**
 * Owner estructural común de overlays flotantes.
 *
 * Posee exclusivamente:
 *
 * presence -> portal -> FloatingLayer -> render props
 *
 * No conoce:
 *
 * - estado de dominio;
 * - dismiss/focus;
 * - recipes;
 * - roles/ARIA;
 * - navegación;
 * - hover/touch.
 */
export function FloatingOverlayRuntime({
  open,
  present =
    open,

  anchorRef,
  floatingElementRef,

  placement =
    "bottom-start",

  offset =
    8,

  flip =
    true,

  shift =
    true,

  viewportPadding =
    8,

  zIndex,

  matchAnchorWidth =
    false,

  updateOnResize =
    true,

  updateOnScroll =
    true,

  portalled =
    true,

  container,

  children,
}: FloatingOverlayRuntimeProps) {
  const content =
    present ? (
      <FloatingLayer
        anchorRef={
          anchorRef
        }

        floatingElementRef={
          floatingElementRef
        }

        open={
          open
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
          zIndex
        }

        strategy="fixed"

        matchAnchorWidth={
          matchAnchorWidth
        }

        updateOnResize={
          updateOnResize
        }

        updateOnScroll={
          updateOnScroll
        }
      >
        {children}
      </FloatingLayer>
    ) : null;


  const animated = (
    <MotionPresenceGroup>
      {content}
    </MotionPresenceGroup>
  );


  if (
    !portalled
  ) {
    return animated;
  }


  return (
    <Portal
      container={
        container
      }
    >
      {animated}
    </Portal>
  );
}


FloatingOverlayRuntime.displayName =
  "FloatingOverlayRuntime";
