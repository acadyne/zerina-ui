// src/core/overlay/DismissableLayer.tsx
import React from "react";
import {
  useIsPresent,
} from "framer-motion";
import {
  useInteractionBoundary,
} from "../interaction/presence";
import {
  setRef,
} from "../interaction/events";
import {
  useIsomorphicLayoutEffect,
} from "../react/useIsomorphicLayoutEffect";
import {
  getOverlayDocumentVersion,
  isDocumentOverlayTopmost,
  registerDocumentOverlay,
  subscribeOverlayDocument,
  unregisterDocumentOverlay,
  type OverlayBranchRef,
  type OverlayDismissEvent,
  type OverlayToken,
} from "./OverlayDocumentRegistry";
import {
  useOverlayContext,
} from "./OverlayProvider";
import {
  useOverlayPortalContext,
} from "./Portal";

export type DismissableLayerEvent =
  OverlayDismissEvent;

type DismissableLayerBranchRef =
  OverlayBranchRef;

const EMPTY_BRANCHES:
  readonly DismissableLayerBranchRef[] =
  [];

const EMPTY_SUBSCRIBE =
  () => () => undefined;

const SERVER_SNAPSHOT =
  () => 0;

export interface OverlayInstanceContextValue {
  token: OverlayToken;

  /** Solicitud lógica recibida por DismissableLayer. */
  enabled: boolean;

  /** La instancia continúa presente según AnimatePresence. */
  present: boolean;

  /** Puede poseer dismiss, foco, scroll lock e interacción. */
  interactive: boolean;

  ownerDocument: Document | null;
  sourceDocument: Document | null;
  isTopmost: boolean;
}

const OverlayInstanceContext =
  React.createContext<
    OverlayInstanceContextValue | null
  >(null);

function useIsDocumentOverlayTopmost(
  ownerDocument: Document | null,
  token: OverlayToken,
  interactive: boolean
): boolean {
  const subscribe =
    React.useCallback(
      (
        subscriber:
          () => void
      ) => {
        if (
          !ownerDocument ||
          !interactive
        ) {
          return EMPTY_SUBSCRIBE();
        }

        return subscribeOverlayDocument(
          ownerDocument,
          subscriber
        );
      },
      [
        interactive,
        ownerDocument,
      ]
    );

  const getSnapshot =
    React.useCallback(
      () =>
        ownerDocument
          ? getOverlayDocumentVersion(
              ownerDocument
            )
          : 0,
      [ownerDocument]
    );

  React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    SERVER_SNAPSHOT
  );

  return !!(
    interactive &&
    ownerDocument &&
    isDocumentOverlayTopmost(
      ownerDocument,
      token
    )
  );
}

export interface DismissableLayerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  overlayId: string;
  layer: number;

  enabled?: boolean;

  /**
   * Restaura únicamente cuando el foco profundo todavía permanece dentro de la
   * instancia al perder vigencia interactiva.
   */
  restoreFocus?: boolean;

  /**
   * Target preferido de handoff. El elemento previamente enfocado se conserva
   * como fallback cuando el owner no suministra uno vigente.
   */
  focusHandoffRef?:
    React.RefObject<
      HTMLElement | null
    >;

  dismissOnEscape?: boolean;

  dismissOnPointerDownOutside?:
    boolean;

  /** Nodos externos que pertenecen lógicamente al mismo overlay. */
  branches?:
    readonly DismissableLayerBranchRef[];

  onDismiss?: () => void;

  onEscapeKeyDown?: (
    event: KeyboardEvent,
    context: DismissableLayerEvent
  ) => void;

  onPointerDownOutside?: (
    event: PointerEvent,
    context: DismissableLayerEvent
  ) => void;
}

export const DismissableLayer =
  React.forwardRef<
    HTMLDivElement,
    DismissableLayerProps
  >(
    (
      {
        children,

        overlayId,
        layer,

        enabled = true,

        restoreFocus = false,
        focusHandoffRef,

        dismissOnEscape = true,

        dismissOnPointerDownOutside =
          true,

        branches = EMPTY_BRANCHES,

        onDismiss,
        onEscapeKeyDown,
        onPointerDownOutside,

        "aria-hidden":
          ariaHidden,

        style,

        ...rest
      },
      ref
    ) => {
      const {
        providerToken,

        ownerDocument:
          providerDocument,
      } =
        useOverlayContext();

      const portalContext =
        useOverlayPortalContext();

      const present =
        useIsPresent();

      /*
       * `enabled` expresa la solicitud lógica del consumidor. `present` expresa
       * si AnimatePresence todavía considera vigente esta instancia. Un árbol
       * retenido exclusivamente para exit ya no puede poseer interacción.
       */
      const interactive =
        enabled && present;

      const localRef =
        React.useRef<
          HTMLDivElement | null
        >(null);

      const [
        layerNode,
        setLayerNode,
      ] =
        React.useState<
          HTMLDivElement | null
        >(null);

      const [token] =
        React.useState<
          OverlayToken
        >(
          () =>
            Symbol(
              "overlay-instance"
            )
        );

      const registeredDocumentRef =
        React.useRef<
          Document | null
        >(null);

      /*
       * Solo se marca cuando el pointer down externo conducirá al dismiss
       * interno. Una observación cancelada no contamina un cierre posterior.
       */
      const pointerDownOutsideRef =
        React.useRef(false);

      const ownerDocument =
        layerNode?.ownerDocument ??
        portalContext?.ownerDocument ??
        null;

      const sourceDocument =
        portalContext?.sourceDocument ??
        ownerDocument ??
        providerDocument;

      const setRefs =
        React.useCallback(
          (
            node:
              HTMLDivElement | null
          ) => {
            if (
              localRef.current !==
              node
            ) {
              localRef.current =
                node;

              setLayerNode(
                node
              );
            }

            setRef(
              ref,
              node
            );
          },
          [ref]
        );

      const handleRegisteredPointerDownOutside =
        React.useCallback(
          (
            event:
              PointerEvent,

            context:
              DismissableLayerEvent
          ): void => {
            onPointerDownOutside?.(
              event,
              context
            );

            if (
              !context.defaultPrevented &&
              dismissOnPointerDownOutside
            ) {
              pointerDownOutsideRef
                .current =
                true;
            }
          },
          [
            dismissOnPointerDownOutside,
            onPointerDownOutside,
          ]
        );

      /*
       * El registro representa vigencia interactiva, no mera presencia visual.
       * Una instancia en exit se retira de topmost antes de desmontarse.
       */
      useIsomorphicLayoutEffect(
        () => {
          const element =
            localRef.current;

          const currentDocument =
            element?.ownerDocument ??
            null;

          const registeredDocument =
            registeredDocumentRef
              .current;

          if (
            !interactive ||
            !element ||
            !currentDocument
          ) {
            if (
              registeredDocument
            ) {
              unregisterDocumentOverlay(
                registeredDocument,
                token
              );

              registeredDocumentRef
                .current =
                null;
            }

            return;
          }

          if (
            registeredDocument &&
            registeredDocument !==
              currentDocument
          ) {
            unregisterDocumentOverlay(
              registeredDocument,
              token
            );
          }

          registeredDocumentRef
            .current =
            currentDocument;

          registerDocumentOverlay(
            currentDocument,
            token,
            {
              overlayId,
              layer,
              element,
              providerToken,

              portalContainer:
                portalContext
                  ?.container ??
                null,

              branches,

              dismissOnEscape,

              dismissOnPointerDownOutside,

              onDismiss,
              onEscapeKeyDown,

              onPointerDownOutside:
                (
                  dismissOnPointerDownOutside ||
                  onPointerDownOutside
                )
                  ? handleRegisteredPointerDownOutside
                  : undefined,
            }
          );
        }
      );

      useIsomorphicLayoutEffect(
        () => {
          return () => {
            const registeredDocument =
              registeredDocumentRef
                .current;

            if (
              registeredDocument
            ) {
              unregisterDocumentOverlay(
                registeredDocument,
                token
              );

              registeredDocumentRef
                .current =
                null;
            }
          };
        },
        [
          token,
        ]
      );


      /*
       * Conserva la semántica de P2.2: mientras la instancia siga interactiva,
       * una marca que no produjo cierre no contamina una transición posterior.
       */
      useIsomorphicLayoutEffect(
        () => {
          if (interactive) {
            pointerDownOutsideRef
              .current =
              false;
          }
        }
      );


      /*
       * La frontera neutral únicamente pregunta si este handoff sigue permitido.
       * La causa concreta permanece encapsulada en DismissableLayer.
       */
      const shouldRestoreFocus =
        React.useCallback(
          (): boolean => {
            const allowed =
              !pointerDownOutsideRef
                .current;

            pointerDownOutsideRef
              .current =
              false;

            return allowed;
          },
          []
        );


      /*
       * El efecto de registro aparece antes que esta frontera. Al cerrar, primero
       * se retira ownership interactivo y después se evacúa y suprime el árbol.
       */
      const {
        interactionSuppressed,
      } =
        useInteractionBoundary({
          present,

          interactive:
            enabled,

          containerRef:
            localRef,

          restoreFocus,

          focusHandoffRef,

          sourceDocument,

          shouldRestoreFocus,
        });


      const isTopmost =
        useIsDocumentOverlayTopmost(
          ownerDocument,
          token,
          interactive
        );

      const contextValue =
        React.useMemo<
          OverlayInstanceContextValue
        >(
          () => ({
            token,

            enabled,
            present,
            interactive,

            ownerDocument,
            sourceDocument,

            isTopmost,
          }),
          [
            enabled,
            interactive,
            isTopmost,
            ownerDocument,
            present,
            sourceDocument,
            token,
          ]
        );

      const resolvedAriaHidden =
        interactionSuppressed
          ? true
          : ariaHidden;

      const resolvedStyle:
        React.CSSProperties | undefined =
        interactionSuppressed
          ? {
              ...style,

              pointerEvents:
                "none",
            }
          : style;

      return (
        <OverlayInstanceContext.Provider
          value={contextValue}
        >
          <div
            {...rest}
            ref={setRefs}
            aria-hidden={
              resolvedAriaHidden
            }
            style={
              resolvedStyle
            }
          >
            {children}
          </div>
        </OverlayInstanceContext.Provider>
      );
    }
  );

DismissableLayer.displayName =
  "DismissableLayer";

export function useOverlayInstanceContext():
  OverlayInstanceContextValue {
  const context =
    React.useContext(
      OverlayInstanceContext
    );

  if (!context) {
    throw new Error(
      "Overlay focus and scroll resources must be rendered inside <DismissableLayer />"
    );
  }

  return context;
}
