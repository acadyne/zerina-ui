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
