// src/core/overlay/DismissableLayer.tsx
import React from "react";
import { setRef } from "../interaction/events";
import { useIsomorphicLayoutEffect } from "../react/useIsomorphicLayoutEffect";
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
import { useOverlayContext } from "./OverlayProvider";
import { useOverlayPortalContext } from "./Portal";

export type DismissableLayerEvent = OverlayDismissEvent;

type DismissableLayerBranchRef = OverlayBranchRef;

const EMPTY_BRANCHES: readonly DismissableLayerBranchRef[] = [];
const EMPTY_SUBSCRIBE = () => () => undefined;
const SERVER_SNAPSHOT = () => 0;

export interface OverlayInstanceContextValue {
  token: OverlayToken;
  enabled: boolean;
  ownerDocument: Document | null;
  sourceDocument: Document | null;
  isTopmost: boolean;
}

const OverlayInstanceContext =
  React.createContext<OverlayInstanceContextValue | null>(null);

function useIsDocumentOverlayTopmost(
  ownerDocument: Document | null,
  token: OverlayToken,
  enabled: boolean
): boolean {
  const subscribe = React.useCallback(
    (subscriber: () => void) => {
      if (!ownerDocument || !enabled) {
        return EMPTY_SUBSCRIBE();
      }

      return subscribeOverlayDocument(ownerDocument, subscriber);
    },
    [enabled, ownerDocument]
  );

  const getSnapshot = React.useCallback(
    () => ownerDocument
      ? getOverlayDocumentVersion(ownerDocument)
      : 0,
    [ownerDocument]
  );

  React.useSyncExternalStore(subscribe, getSnapshot, SERVER_SNAPSHOT);

  return !!(
    enabled &&
    ownerDocument &&
    isDocumentOverlayTopmost(ownerDocument, token)
  );
}

export interface DismissableLayerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  overlayId: string;
  layer: number;

  enabled?: boolean;
  dismissOnEscape?: boolean;
  dismissOnPointerDownOutside?: boolean;

  /** Nodos externos que pertenecen lógicamente al mismo overlay. */
  branches?: readonly DismissableLayerBranchRef[];

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

export const DismissableLayer = React.forwardRef<
  HTMLDivElement,
  DismissableLayerProps
>(
  (
    {
      children,
      overlayId,
      layer,
      enabled = true,
      dismissOnEscape = true,
      dismissOnPointerDownOutside = true,
      branches = EMPTY_BRANCHES,
      onDismiss,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...rest
    },
    ref
  ) => {
    const { providerToken, ownerDocument: providerDocument } =
      useOverlayContext();
    const portalContext = useOverlayPortalContext();
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const [layerNode, setLayerNode] =
      React.useState<HTMLDivElement | null>(null);
    const [token] = React.useState<OverlayToken>(() =>
      Symbol("overlay-instance")
    );
    const registeredDocumentRef = React.useRef<Document | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (localRef.current !== node) {
          localRef.current = node;
          setLayerNode(node);
        }

        setRef(ref, node);
      },
      [ref]
    );

    /*
     * El registro se reconcilia después de cada commit. Así, listeners
     * nativos y tareas de foco nunca leen callbacks de un render descartado,
     * y cambiar configuración no altera el orden temporal de la instancia.
     */
    useIsomorphicLayoutEffect(() => {
      const element = localRef.current;
      const ownerDocument = element?.ownerDocument ?? null;
      const registeredDocument = registeredDocumentRef.current;

      if (!enabled || !element || !ownerDocument) {
        if (registeredDocument) {
          unregisterDocumentOverlay(registeredDocument, token);
          registeredDocumentRef.current = null;
        }

        return;
      }

      if (registeredDocument && registeredDocument !== ownerDocument) {
        unregisterDocumentOverlay(registeredDocument, token);
      }

      registeredDocumentRef.current = ownerDocument;
      registerDocumentOverlay(ownerDocument, token, {
        overlayId,
        layer,
        element,
        providerToken,
        portalContainer: portalContext?.container ?? null,
        branches,
        dismissOnEscape,
        dismissOnPointerDownOutside,
        onDismiss,
        onEscapeKeyDown,
        onPointerDownOutside,
      });
    });

    useIsomorphicLayoutEffect(() => {
      return () => {
        const registeredDocument = registeredDocumentRef.current;

        if (registeredDocument) {
          unregisterDocumentOverlay(registeredDocument, token);
          registeredDocumentRef.current = null;
        }
      };
    }, [token]);

    const ownerDocument =
      layerNode?.ownerDocument ??
      portalContext?.ownerDocument ??
      null;
    const isTopmost = useIsDocumentOverlayTopmost(
      ownerDocument,
      token,
      enabled
    );

    const contextValue = React.useMemo<OverlayInstanceContextValue>(
      () => ({
        token,
        enabled,
        ownerDocument,
        sourceDocument:
          portalContext?.sourceDocument ??
          ownerDocument ??
          providerDocument,
        isTopmost,
      }),
      [
        enabled,
        isTopmost,
        ownerDocument,
        portalContext?.sourceDocument,
        providerDocument,
        token,
      ]
    );

    return (
      <OverlayInstanceContext.Provider value={contextValue}>
        <div ref={setRefs} {...rest}>
          {children}
        </div>
      </OverlayInstanceContext.Provider>
    );
  }
);

DismissableLayer.displayName = "DismissableLayer";

export function useOverlayInstanceContext(): OverlayInstanceContextValue {
  const context = React.useContext(OverlayInstanceContext);

  if (!context) {
    throw new Error(
      "Overlay focus and scroll resources must be rendered inside <DismissableLayer />"
    );
  }

  return context;
}
