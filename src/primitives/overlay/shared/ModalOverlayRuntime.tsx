import React from "react";

import {
  DismissableLayer,
  FocusScope,
  Portal,
  ScrollLock,
  getLayerZIndex,
} from "../../../core/overlay";

import {
  MotionOverlayBackdrop,
  MotionOverlayPanel,
  MotionOverlayPresence,
  MotionOverlayRoot,
  type MotionOverlayPanelAs,
  type MotionOverlayPanelKind,
  type MotionOverlayPanelProps,
} from "../../../core/motion";

import type {
  MotionSlotProps,
  SlotElementProps,
} from "../../../helpers/css";


export interface ModalOverlayRuntimeProps {
  children?: React.ReactNode;

  open: boolean;
  overlayId: string;

  /**
   * Política modal atómica.
   *
   * true  -> backdrop + focus containment + scroll lock + aria-modal
   * false -> none of the above
   */
  modal?:
    boolean;

  onDismiss:
    () => void;

  closeOnEscape:
    boolean;

  closeOnPointerDownOutside:
    boolean;

  autoFocus:
    boolean;

  restoreFocus:
    boolean;

  initialFocusRef?:
    React.RefObject<
      HTMLElement | null
    >;

  portalled:
    boolean;

  container?:
    | Element
    | DocumentFragment
    | null;

  rootSlot:
    MotionSlotProps;

  backdropSlot:
    MotionSlotProps;

  dismissableLayerSlot:
    SlotElementProps;

  focusScopeSlot:
    SlotElementProps;

  panelSlot:
    MotionSlotProps;

  panelAs:
    MotionOverlayPanelAs;

  panelKind:
    MotionOverlayPanelKind;

  panelPlacement?:
    MotionOverlayPanelProps[
      "placement"
    ];

  labelledBy?:
    string;

  describedBy?:
    string;
}


/**
 * Runtime modal único para Dialog, Drawer y BottomSheet.
 *
 * Las recipes permanecen en cada familia. Esta frontera posee únicamente la
 * mecánica transversal:
 *
 * Presence -> optional Backdrop -> DismissableLayer -> FocusScope
 * -> Panel -> optional ScrollLock.
 *
 * `modal` es una política atómica: backdrop, focus containment, scroll lock y
 * aria-modal cambian juntos. restoreFocus/autoFocus siguen siendo decisiones
 * independientes del consumidor.
 *
 * Los slots se aplican antes de las invariantes para que estilos/atributos DOM
 * sean extensibles sin permitir que un slot sustituya ownership, foco o dismiss.
 */
export function ModalOverlayRuntime({
  children,

  open,
  overlayId,

  modal = true,

  onDismiss,

  closeOnEscape,
  closeOnPointerDownOutside,

  autoFocus,
  restoreFocus,
  initialFocusRef,

  portalled,
  container,

  rootSlot,
  backdropSlot,
  dismissableLayerSlot,
  focusScopeSlot,
  panelSlot,

  panelAs,
  panelKind,
  panelPlacement,

  labelledBy,
  describedBy,
}: ModalOverlayRuntimeProps) {
  const content = (
    <MotionOverlayPresence
      open={open}
    >
      <MotionOverlayRoot
        {...rootSlot}
      >
        {modal ? (
          <MotionOverlayBackdrop
            {...backdropSlot}
          />
        ) : null}

        <DismissableLayer
          {...dismissableLayerSlot}
          overlayId={
            overlayId
          }
          layer={
            getLayerZIndex(
              "modal",
            )
          }
          enabled={open}
          restoreFocus={
            restoreFocus
          }
          dismissOnEscape={
            closeOnEscape
          }
          dismissOnPointerDownOutside={
            closeOnPointerDownOutside
          }
          onDismiss={
            onDismiss
          }
        >
          <FocusScope
            {...focusScopeSlot}
            contain={
              modal
            }
            autoFocus={
              autoFocus
            }
            initialFocusRef={
              initialFocusRef
            }
          >
            <MotionOverlayPanel
              {...panelSlot}
              as={panelAs}
              kind={panelKind}
              placement={
                panelPlacement
              }
              role="dialog"
              aria-modal={
                modal
                  ? "true"
                  : undefined
              }
              aria-labelledby={
                labelledBy
              }
              aria-describedby={
                describedBy
              }
            >
              {children}
            </MotionOverlayPanel>
          </FocusScope>

          {modal ? (
            <ScrollLock />
          ) : null}
        </DismissableLayer>
      </MotionOverlayRoot>
    </MotionOverlayPresence>
  );

  if (!portalled) {
    return content;
  }

  return (
    <Portal
      container={
        container
      }
    >
      {content}
    </Portal>
  );
}

ModalOverlayRuntime.displayName =
  "ModalOverlayRuntime";
