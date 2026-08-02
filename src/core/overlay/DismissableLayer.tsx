// src/core/overlay/DismissableLayer.tsx
import React from "react";
import {
  useIsPresent,
} from "framer-motion";
import {
  getDeepActiveElement,
  getNodeEventRoot,
  isComposedDescendantOf,
} from "../dom";
import {
  setRef,
} from "../interaction/events";
import {
  attemptFocus,
} from "../interaction/focus/attemptFocus";
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

function getPreviousFocusTarget(
  container: HTMLElement,
  sourceDocument: Document | null
): HTMLElement | null {
  const ownerDocument =
    container.ownerDocument;

  /*
   * Los portales pueden renderizar el overlay en un Document distinto del
   * control que lo abrió. El cruce de iframe same-origin permanece explícito en
   * esta frontera y no modifica las primitivas generales del árbol compuesto.
   */
  if (
    sourceDocument &&
    sourceDocument !== ownerDocument
  ) {
    return getDeepActiveElement(
      sourceDocument,
      {
        traverseIframes: true,
      }
    );
  }

  return getDeepActiveElement(
    getNodeEventRoot(
      container
    ),
    {
      traverseIframes: true,
    }
  );
}

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

      const [
        interactionSuppressed,
        setInteractionSuppressed,
      ] =
        React.useState(
          !interactive
        );

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

      const focusCycleRef =
        React.useRef<{
          active: boolean;

          target:
            HTMLElement | null;
        }>({
          active: false,
          target: null,
        });

      const restoreFocusRef =
        React.useRef(
          restoreFocus
        );

      const focusHandoffRefRef =
        React.useRef(
          focusHandoffRef
        );

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

      const releaseFocusCycle =
        React.useCallback(
          (): void => {
            const cycle =
              focusCycleRef.current;

            if (!cycle.active) {
              return;
            }

            cycle.active =
              false;

            const previousTarget =
              cycle.target;

            cycle.target =
              null;

            const container =
              localRef.current;

            const blockedByPointer =
              pointerDownOutsideRef
                .current;

            pointerDownOutsideRef
              .current =
              false;

            if (
              !restoreFocusRef
                .current ||
              !container ||
              blockedByPointer
            ) {
              return;
            }

            /*
             * Una transición externa ya consumada es autoridad suficiente. El
             * overlay no recupera foco cuando otro control ya lo posee.
             */
            const active =
              getDeepActiveElement(
                getNodeEventRoot(
                  container
                )
              );

            if (
              !active ||
              !isComposedDescendantOf(
                active,
                container
              )
            ) {
              return;
            }

            const suppliedTarget =
              focusHandoffRefRef
                .current
                ?.current ??
              null;

            const target =
              suppliedTarget
                ?.isConnected
                ? suppliedTarget
                : previousTarget;

            if (
              !target ||
              !target.isConnected ||
              isComposedDescendantOf(
                target,
                container
              )
            ) {
              return;
            }

            void attemptFocus(
              target
            );
          },
          []
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

      /*
       * La transición se reconcilia tras commit. Al cerrar:
       *
       * 1. el registro ya observó `interactive=false`;
       * 2. se resuelve el handoff únicamente si el foco continúa dentro;
       * 3. se vuelve inerte e inaccesible el árbol retenido para exit.
       *
       * La actualización de estado ocurre en layout effect y se confirma antes
       * del siguiente paint, evitando aplicar aria-hidden sobre el foco vigente.
       */
      useIsomorphicLayoutEffect(
        () => {
          restoreFocusRef.current =
            restoreFocus;

          focusHandoffRefRef
            .current =
            focusHandoffRef;

          const cycle =
            focusCycleRef.current;

          if (interactive) {
            if (
              interactionSuppressed
            ) {
              setInteractionSuppressed(
                false
              );
            }

            if (!cycle.active) {
              const container =
                localRef.current;

              pointerDownOutsideRef
                .current =
                false;

              cycle.active =
                true;

              cycle.target =
                container
                  ? getPreviousFocusTarget(
                      container,
                      sourceDocument
                    )
                  : null;
            }

            return;
          }

          if (cycle.active) {
            releaseFocusCycle();
          }

          if (
            !interactionSuppressed
          ) {
            setInteractionSuppressed(
              true
            );
          }
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

            releaseFocusCycle();
          };
        },
        [
          releaseFocusCycle,
          token,
        ]
      );

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

      const resolvedInert =
        interactionSuppressed;

      const resolvedStyle:
        React.CSSProperties | undefined =
        interactionSuppressed
          ? {
              ...style,

              pointerEvents:
                "none",
            }
          : style;

      /*
       * React 18 todavía no expone `inert` en HTMLAttributes. Se sincroniza
       * como atributo DOM en layout effect para que quede aplicado antes del
       * siguiente paint sin ensanchar el contrato público del componente.
       */
      useIsomorphicLayoutEffect(
        () => {
          const element =
            localRef.current;

          if (!element) {
            return;
          }

          if (resolvedInert) {
            element.setAttribute(
              "inert",
              ""
            );

            return;
          }

          element.removeAttribute(
            "inert"
          );
        },
        [resolvedInert]
      );

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
