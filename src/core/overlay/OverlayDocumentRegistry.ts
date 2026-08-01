import { assertValidOverlayId } from "./overlayId";
import {
  getNodeEventRoot,
  isEventInsideNode,
  isShadowRoot,
  type DOMEventRoot,
} from "../dom/ownerDocument";

export type OverlayToken = symbol;
export type OverlayProviderToken = symbol;
export type OverlayPortalToken = symbol;

export type OverlayBranchRef = {
  readonly current: HTMLElement | null;
};

export type OverlayDismissEvent = {
  readonly defaultPrevented: boolean;
  preventDefault: () => void;
};

export interface OverlayRegistration {
  overlayId: string;
  layer: number;
  element: HTMLElement;
  providerToken: OverlayProviderToken;
  portalContainer: Element | DocumentFragment | null;
  branches: readonly OverlayBranchRef[];
  dismissOnEscape: boolean;
  dismissOnPointerDownOutside: boolean;
  onDismiss?: () => void;
  onEscapeKeyDown?: (
    event: KeyboardEvent,
    context: OverlayDismissEvent
  ) => void;
  onPointerDownOutside?: (
    event: PointerEvent,
    context: OverlayDismissEvent
  ) => void;
}

type RegisteredOverlay = OverlayRegistration & {
  token: OverlayToken;
  order: number;
};

type OverlayRootRecord = {
  rootId: string;
  node: HTMLElement;
  createdByRegistry: boolean;
  providerOwners: Set<OverlayProviderToken>;
  portalOwners: Set<OverlayPortalToken>;
};

type OverlayEventRootListeners = {
  pointerDown: EventListener;
  keyDown: EventListener;
};

interface OverlayDocumentState {
  readonly ownerDocument: Document;
  readonly overlays: Map<OverlayToken, RegisteredOverlay>;
  readonly subscribers: Set<() => void>;
  readonly rootsById: Map<string, OverlayRootRecord>;
  readonly rootsByNode: Map<HTMLElement, OverlayRootRecord>;
  readonly eventRoots: Map<DOMEventRoot, OverlayEventRootListeners>;
  readonly processedPointerEvents: WeakSet<Event>;
  readonly processedKeyEvents: WeakSet<Event>;
  order: number;
  version: number;
}

const overlayDocumentStates =
  new WeakMap<Document, OverlayDocumentState>();

function createDismissEvent(event: Event): OverlayDismissEvent {
  let prevented = event.defaultPrevented;

  return {
    get defaultPrevented() {
      return prevented;
    },
    preventDefault() {
      prevented = true;
    },
  };
}

function compareOverlays(a: RegisteredOverlay, b: RegisteredOverlay): number {
  if (a.layer !== b.layer) {
    return a.layer - b.layer;
  }

  return a.order - b.order;
}

function getTopmostOverlay(
  state: OverlayDocumentState
): RegisteredOverlay | null {
  let topmost: RegisteredOverlay | null = null;

  state.overlays.forEach((overlay) => {
    if (!topmost || compareOverlays(topmost, overlay) < 0) {
      topmost = overlay;
    }
  });

  return topmost;
}

function publishOverlayState(state: OverlayDocumentState): void {
  state.version += 1;
  state.subscribers.forEach((subscriber) => subscriber());
}

function handlePointerDown(
  state: OverlayDocumentState,
  event: PointerEvent
): void {
  if (state.processedPointerEvents.has(event)) {
    return;
  }

  /*
   * Un evento compuesto puede atravesar primero su ShadowRoot y después el
   * Document. Marcarlo antes de ejecutar callbacks garantiza una única
   * decisión global incluso si el callback desmonta el overlay superior.
   */
  state.processedPointerEvents.add(event);

  const overlay = getTopmostOverlay(state);

  if (
    !overlay ||
    (!overlay.dismissOnPointerDownOutside &&
      !overlay.onPointerDownOutside)
  ) {
    return;
  }

  if (isEventInsideNode(event, overlay.element)) {
    return;
  }

  const insideBranch = overlay.branches.some((branchRef) => {
    const branch = branchRef.current;

    return branch !== null && isEventInsideNode(event, branch);
  });

  if (insideBranch) {
    return;
  }

  const context = createDismissEvent(event);
  overlay.onPointerDownOutside?.(event, context);

  if (!context.defaultPrevented && overlay.dismissOnPointerDownOutside) {
    overlay.onDismiss?.();
  }
}

function handleKeyDown(
  state: OverlayDocumentState,
  event: KeyboardEvent
): void {
  if (state.processedKeyEvents.has(event)) {
    return;
  }

  state.processedKeyEvents.add(event);

  if (event.key !== "Escape") {
    return;
  }

  const overlay = getTopmostOverlay(state);

  if (
    !overlay ||
    (!overlay.dismissOnEscape && !overlay.onEscapeKeyDown)
  ) {
    return;
  }

  const context = createDismissEvent(event);
  overlay.onEscapeKeyDown?.(event, context);

  if (!context.defaultPrevented && overlay.dismissOnEscape) {
    event.preventDefault();
    overlay.onDismiss?.();
  }
}

function attachEventRoot(
  state: OverlayDocumentState,
  root: DOMEventRoot
): void {
  if (state.eventRoots.has(root)) {
    return;
  }

  const pointerDown: EventListener = (event) => {
    handlePointerDown(state, event as PointerEvent);
  };

  const keyDown: EventListener = (event) => {
    handleKeyDown(state, event as KeyboardEvent);
  };

  root.addEventListener("pointerdown", pointerDown);
  root.addEventListener("keydown", keyDown);

  state.eventRoots.set(root, {
    pointerDown,
    keyDown,
  });
}

function detachEventRoot(
  state: OverlayDocumentState,
  root: DOMEventRoot
): void {
  const listeners = state.eventRoots.get(root);

  if (!listeners) {
    return;
  }

  root.removeEventListener("pointerdown", listeners.pointerDown);
  root.removeEventListener("keydown", listeners.keyDown);
  state.eventRoots.delete(root);
}

function reconcileEventRoots(state: OverlayDocumentState): void {
  const requiredRoots = new Set<DOMEventRoot>();

  if (state.overlays.size > 0) {
    requiredRoots.add(state.ownerDocument);

    state.overlays.forEach((overlay) => {
      requiredRoots.add(getNodeEventRoot(overlay.element));

      overlay.branches.forEach((branchRef) => {
        const branch = branchRef.current;

        if (branch?.ownerDocument === state.ownerDocument) {
          requiredRoots.add(getNodeEventRoot(branch));
        }
      });
    });
  }

  requiredRoots.forEach((root) => attachEventRoot(state, root));

  Array.from(state.eventRoots.keys()).forEach((root) => {
    if (!requiredRoots.has(root)) {
      detachEventRoot(state, root);
    }
  });
}

function createOverlayDocumentState(
  ownerDocument: Document
): OverlayDocumentState {
  return {
    ownerDocument,
    overlays: new Map(),
    subscribers: new Set(),
    rootsById: new Map(),
    rootsByNode: new Map(),
    eventRoots: new Map(),
    processedPointerEvents: new WeakSet(),
    processedKeyEvents: new WeakSet(),
    order: 0,
    version: 0,
  };
}

function getOverlayDocumentState(
  ownerDocument: Document
): OverlayDocumentState {
  const existing = overlayDocumentStates.get(ownerDocument);

  if (existing) {
    return existing;
  }

  const state = createOverlayDocumentState(ownerDocument);
  overlayDocumentStates.set(ownerDocument, state);

  return state;
}

export function registerDocumentOverlay(
  ownerDocument: Document,
  token: OverlayToken,
  registration: OverlayRegistration
): void {
  assertValidOverlayId(registration.overlayId, "DismissableLayer");

  if (registration.element.ownerDocument !== ownerDocument) {
    throw new Error(
      "DismissableLayer must register with the ownerDocument of its rendered element."
    );
  }

  const state = getOverlayDocumentState(ownerDocument);
  const existing = state.overlays.get(token);
  const stackChanged =
    !existing ||
    existing.layer !== registration.layer;

  if (existing) {
    state.overlays.set(token, {
      ...registration,
      token,
      order: existing.order,
    });
  } else {
    state.order += 1;
    state.overlays.set(token, {
      ...registration,
      token,
      order: state.order,
    });
  }

  reconcileEventRoots(state);

  if (stackChanged) {
    publishOverlayState(state);
  }
}

export function unregisterDocumentOverlay(
  ownerDocument: Document,
  token: OverlayToken
): void {
  const state = overlayDocumentStates.get(ownerDocument);

  if (!state || !state.overlays.delete(token)) {
    return;
  }

  reconcileEventRoots(state);
  publishOverlayState(state);
}

export function subscribeOverlayDocument(
  ownerDocument: Document,
  subscriber: () => void
): () => void {
  const state = getOverlayDocumentState(ownerDocument);
  state.subscribers.add(subscriber);

  return () => {
    state.subscribers.delete(subscriber);
  };
}

export function getOverlayDocumentVersion(
  ownerDocument: Document
): number {
  return overlayDocumentStates.get(ownerDocument)?.version ?? 0;
}

export function isDocumentOverlayTopmost(
  ownerDocument: Document,
  token: OverlayToken
): boolean {
  const state = overlayDocumentStates.get(ownerDocument);

  return !!state && getTopmostOverlay(state)?.token === token;
}

function maybeReleaseOverlayRoot(
  state: OverlayDocumentState,
  rootId: string,
  record: OverlayRootRecord
): void {
  if (
    record.providerOwners.size > 0 ||
    record.portalOwners.size > 0
  ) {
    return;
  }

  state.rootsById.delete(rootId);

  if (state.rootsByNode.get(record.node) === record) {
    state.rootsByNode.delete(record.node);
  }

  if (record.createdByRegistry && record.node.parentNode) {
    record.node.parentNode.removeChild(record.node);
  }
}

export function acquireOverlayRoot(
  ownerDocument: Document,
  rootId: string,
  providerToken: OverlayProviderToken
): HTMLElement | null {
  assertValidOverlayId(rootId, "OverlayProvider rootId");

  const state = getOverlayDocumentState(ownerDocument);
  const registered = state.rootsById.get(rootId);

  if (registered) {
    registered.providerOwners.add(providerToken);
    return registered.node;
  }

  const existing = ownerDocument.getElementById(rootId);
  let node: HTMLElement;
  let createdByRegistry = false;

  if (existing) {
    const ownerWindow = ownerDocument.defaultView;

    if (
      !ownerWindow ||
      !(existing instanceof ownerWindow.HTMLElement)
    ) {
      throw new Error(
        `Overlay root "${rootId}" must resolve to an HTMLElement.`
      );
    }

    node = existing;
  } else {
    if (!ownerDocument.body) {
      return null;
    }

    node = ownerDocument.createElement("div");
    node.id = rootId;
    node.setAttribute("data-ui-overlay-root", rootId);
    ownerDocument.body.appendChild(node);
    createdByRegistry = true;
  }

  const record: OverlayRootRecord = {
    rootId,
    node,
    createdByRegistry,
    providerOwners: new Set([providerToken]),
    portalOwners: new Set(),
  };

  state.rootsById.set(rootId, record);
  state.rootsByNode.set(node, record);

  return node;
}

export function releaseOverlayRoot(
  ownerDocument: Document,
  rootId: string,
  providerToken: OverlayProviderToken
): void {
  const state = overlayDocumentStates.get(ownerDocument);
  const record = state?.rootsById.get(rootId);

  if (!state || !record || !record.providerOwners.delete(providerToken)) {
    return;
  }

  maybeReleaseOverlayRoot(state, rootId, record);
}

function getComposedParentNode(
  node: Node
): Node | null {
  if (isShadowRoot(node)) {
    return node.host;
  }

  if (node.parentNode) {
    return node.parentNode;
  }

  const root = node.getRootNode();

  return root !== node && isShadowRoot(root)
    ? root
    : null;
}

/*
 * El ownership se resuelve desde el container hacia fuera.
 * Recorrer el árbol compuesto conserva ShadowRoot.host y devuelve el root
 * administrado más cercano, sin depender del orden de rootsById.
 */
function findOwningOverlayRoot(
  state: OverlayDocumentState,
  container: Element | DocumentFragment
): OverlayRootRecord | null {
  let current: Node | null = container;

  while (current) {
    /*
     * Consultar el índice mientras ascendemos garantiza que un root anidado
     * gane sobre sus ancestros y evita depender del orden de inserción.
     */
    if (current.nodeType === 1) {
      const record =
        state.rootsByNode.get(
          current as HTMLElement
        );

      if (record) {
        return record;
      }
    }

    current = getComposedParentNode(current);
  }

  return null;
}

export function retainOverlayPortalContainer(
  container: Element | DocumentFragment,
  portalToken: OverlayPortalToken
): () => void {
  const ownerDocument = container.ownerDocument;

  if (!ownerDocument) {
    return () => undefined;
  }

  const state = overlayDocumentStates.get(ownerDocument);
  const record = state
    ? findOwningOverlayRoot(state, container)
    : null;

  if (!state || !record) {
    return () => undefined;
  }

  record.portalOwners.add(portalToken);

  return () => {
    if (!record.portalOwners.delete(portalToken)) {
      return;
    }

    maybeReleaseOverlayRoot(state, record.rootId, record);
  };
}
