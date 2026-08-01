type BodyStyleSnapshot = {
  overflow: string;
  paddingRight: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
};

type BodyScrollLockState = {
  locks: Set<symbol>;
  body: HTMLElement | null;
  snapshot: BodyStyleSnapshot | null;
  savedScrollY: number;
  restoreScroll: boolean;
};

/* Cada Document conserva su propio recurso y su snapshot de restauración. */
const documentScrollLocks =
  new WeakMap<Document, BodyScrollLockState>();

function getBodyScrollLockState(
  ownerDocument: Document
): BodyScrollLockState {
  const existing = documentScrollLocks.get(ownerDocument);

  if (existing) {
    return existing;
  }

  const state: BodyScrollLockState = {
    locks: new Set(),
    body: null,
    snapshot: null,
    savedScrollY: 0,
    restoreScroll: false,
  };

  documentScrollLocks.set(ownerDocument, state);
  return state;
}

function isIOSLikeEnvironment(ownerWindow: Window): boolean {
  const {
    userAgent,
    platform,
    maxTouchPoints = 0,
  } = ownerWindow.navigator;

  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && maxTouchPoints > 1)
  );
}

function captureBodyStyle(body: HTMLElement): BodyStyleSnapshot {
  return {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
  };
}

function restoreBodyStyle(
  body: HTMLElement,
  snapshot: BodyStyleSnapshot
): void {
  body.style.overflow = snapshot.overflow;
  body.style.paddingRight = snapshot.paddingRight;
  body.style.position = snapshot.position;
  body.style.top = snapshot.top;
  body.style.left = snapshot.left;
  body.style.right = snapshot.right;
  body.style.width = snapshot.width;
}

function applyBodyScrollLock(
  ownerDocument: Document,
  state: BodyScrollLockState
): boolean {
  const ownerWindow = ownerDocument.defaultView;
  const body = ownerDocument.body;

  if (!ownerWindow || !body) {
    return false;
  }

  state.body = body;
  state.snapshot = captureBodyStyle(body);
  state.restoreScroll = isIOSLikeEnvironment(ownerWindow);

  if (state.restoreScroll) {
    state.savedScrollY = ownerWindow.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${state.savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return true;
  }

  const scrollbarWidth = Math.max(
    0,
    ownerWindow.innerWidth - ownerDocument.documentElement.clientWidth
  );
  const computedPaddingRight = Number.parseFloat(
    ownerWindow.getComputedStyle(body).paddingRight
  );
  const existingPaddingRight = Number.isFinite(computedPaddingRight)
    ? computedPaddingRight
    : 0;

  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${existingPaddingRight + scrollbarWidth}px`;
  }

  return true;
}

function restoreBodyScrollState(
  ownerDocument: Document,
  state: BodyScrollLockState
): void {
  const ownerWindow = ownerDocument.defaultView;

  if (state.body && state.snapshot) {
    restoreBodyStyle(state.body, state.snapshot);
  }

  if (ownerWindow && state.restoreScroll) {
    ownerWindow.scrollTo(0, state.savedScrollY);
  }

  state.body = null;
  state.snapshot = null;
  state.savedScrollY = 0;
  state.restoreScroll = false;
}

export function acquireBodyScrollLock(
  ownerDocument: Document,
  lockToken: symbol
): void {
  const state = getBodyScrollLockState(ownerDocument);

  if (state.locks.has(lockToken)) {
    return;
  }

  if (state.locks.size === 0 && !applyBodyScrollLock(ownerDocument, state)) {
    documentScrollLocks.delete(ownerDocument);
    return;
  }

  state.locks.add(lockToken);
}

export function releaseBodyScrollLock(
  ownerDocument: Document,
  lockToken: symbol
): void {
  const state = documentScrollLocks.get(ownerDocument);

  if (!state || !state.locks.delete(lockToken)) {
    return;
  }

  if (state.locks.size > 0) {
    return;
  }

  restoreBodyScrollState(ownerDocument, state);
  documentScrollLocks.delete(ownerDocument);
}
