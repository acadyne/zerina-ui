export type DOMEventRoot = Document | ShadowRoot;

export type OwnedWindowTimeout = {
  ownerWindow: Window;
  id: number;
};

export type OwnedAnimationFrame = {
  ownerWindow: Window;
  id: number;
};

export function isDOMNode(value: EventTarget | null): value is Node {
  return value !== null && typeof (value as Node).nodeType === "number";
}

export function isShadowRoot(value: Node): value is ShadowRoot {
  return value.nodeType === 11 && "host" in value;
}

type SlottableNode = Node & {
  readonly assignedSlot?: HTMLSlotElement | null;
};

/**
 * Devuelve el padre efectivo de un nodo dentro del árbol compuesto.
 *
 * Un nodo distribuido pertenece primero al slot que lo presenta. Al alcanzar
 * un ShadowRoot, el recorrido continúa por su host. `parentNode` por sí solo
 * describe el árbol DOM y omite ambas relaciones, por lo que no es suficiente
 * para resolver ownership visual de portals y overlays.
 *
 * La función nunca consulta el document global y no cruza al Document de otro
 * realm. Los nodos desconectados terminan de forma segura en null.
 */
export function getComposedParentNode(
  node: Node
): Node | null {
  const ownerDocument =
    node.nodeType === 9
      ? node as Document
      : node.ownerDocument;

  /*
   * assignedSlot debe evaluarse antes que parentNode. El padre DOM de un nodo
   * distribuido sigue en light DOM, mientras que su padre compuesto es el slot
   * mediante el cual participa en el shadow tree.
   */
  const assignedSlot =
    (node as SlottableNode)
      .assignedSlot ??
    null;

  if (
    assignedSlot &&
    assignedSlot.ownerDocument ===
      ownerDocument
  ) {
    return assignedSlot;
  }

  /*
   * Un ShadowRoot no tiene parentNode. Su continuación dentro del árbol
   * compuesto es el host que lo presenta en el documento propietario.
   */
  if (isShadowRoot(node)) {
    return node.host.ownerDocument ===
      ownerDocument
      ? node.host
      : null;
  }

  const parent =
    node.parentNode;

  if (parent) {
    const parentDocument =
      parent.nodeType === 9
        ? parent as Document
        : parent.ownerDocument;

    return parentDocument ===
      ownerDocument
      ? parent
      : null;
  }

  /*
   * Este fallback cubre nodos cuyo root compuesto es un ShadowRoot aunque no
   * expongan parentNode en el momento de la consulta.
   */
  const root =
    node.getRootNode();

  if (
    root !== node &&
    isShadowRoot(root) &&
    root.ownerDocument ===
      ownerDocument
  ) {
    return root;
  }

  return null;
}

export function getNodeEventRoot(node: Node): DOMEventRoot {
  const root = node.getRootNode();

  if (isShadowRoot(root)) {
    return root;
  }

  if (root.nodeType === 9) {
    return root as Document;
  }

  const ownerDocument = node.ownerDocument;

  if (!ownerDocument) {
    throw new Error("A DOM event root requires an owning Document.");
  }

  return ownerDocument;
}

export function isEventInsideNode(event: Event, node: Node): boolean {
  const path =
    typeof event.composedPath === "function"
      ? event.composedPath()
      : [];

  if (path.includes(node)) {
    return true;
  }

  return isDOMNode(event.target) && node.contains(event.target);
}

export function setOwnedWindowTimeout(
  ownerWindow: Window,
  callback: () => void,
  delay: number
): OwnedWindowTimeout {
  return {
    ownerWindow,
    id: ownerWindow.setTimeout(callback, delay),
  };
}

export function clearOwnedWindowTimeout(
  timeout: OwnedWindowTimeout | null
): void {
  if (timeout) {
    timeout.ownerWindow.clearTimeout(timeout.id);
  }
}

export function requestOwnedAnimationFrame(
  ownerWindow: Window,
  callback: FrameRequestCallback
): OwnedAnimationFrame {
  return {
    ownerWindow,
    id: ownerWindow.requestAnimationFrame(callback),
  };
}

export function cancelOwnedAnimationFrame(
  frame: OwnedAnimationFrame | null
): void {
  if (frame) {
    frame.ownerWindow.cancelAnimationFrame(frame.id);
  }
}
