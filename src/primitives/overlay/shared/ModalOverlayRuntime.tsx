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

  positionerSlot:
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
 * Runtime modal único para superficies laterales/inferiores.
 *
 * Las recipes siguen perteneciendo a Drawer/BottomSheet. Esta frontera posee
 * únicamente la mecánica transversal:
 *
 * Presence -> Backdrop -> DismissableLayer -> FocusScope -> Panel -> ScrollLock.
 *
 * Los slots se aplican antes de las invariantes para que estilos/atributos DOM
 * sean extensibles sin permitir que un slot sustituya ownership, foco o dismiss.
 */
export function ModalOverlayRuntime({
  children,

  open,
  overlayId,

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
  positionerSlot,
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
        <MotionOverlayBackdrop
          {...backdropSlot}
        />

        <DismissableLayer
          {...positionerSlot}
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
            contain
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
              aria-modal="true"
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

          <ScrollLock />
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
