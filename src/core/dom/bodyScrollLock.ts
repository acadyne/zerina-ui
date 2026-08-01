type BodyStyleSnapshot = {
  overflow: string;
  paddingRight: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
};

const activeBodyScrollLocks =
  new Set<string>();

let bodyStyleSnapshot:
  | BodyStyleSnapshot
  | null = null;

let savedScrollY = 0;

function canUseDOM(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined"
  );
}

function assertValidBodyScrollLockId(
  lockId: string
): void {
  if (
    typeof lockId !== "string" ||
    lockId.trim().length === 0
  ) {
    throw new Error(
      "Body scroll lock ID must be a non-empty string."
    );
  }
}

function isIOSLikeEnvironment(): boolean {
  if (!canUseDOM()) {
    return false;
  }

  const {
    userAgent,
    platform,
    maxTouchPoints = 0,
  } = window.navigator;

  return (
    /iPad|iPhone|iPod/.test(
      userAgent
    ) ||
    (
      platform === "MacIntel" &&
      maxTouchPoints > 1
    )
  );
}

function captureBodyStyle(
  body: HTMLElement
): BodyStyleSnapshot {
  return {
    overflow:
      body.style.overflow,

    paddingRight:
      body.style.paddingRight,

    position:
      body.style.position,

    top:
      body.style.top,

    left:
      body.style.left,

    right:
      body.style.right,

    width:
      body.style.width,
  };
}

function restoreBodyStyle(
  body: HTMLElement,
  snapshot: BodyStyleSnapshot
): void {
  body.style.overflow =
    snapshot.overflow;

  body.style.paddingRight =
    snapshot.paddingRight;

  body.style.position =
    snapshot.position;

  body.style.top =
    snapshot.top;

  body.style.left =
    snapshot.left;

  body.style.right =
    snapshot.right;

  body.style.width =
    snapshot.width;
}

function getDocumentScrollbarWidth(): number {
  if (!canUseDOM()) {
    return 0;
  }

  return Math.max(
    0,
    window.innerWidth -
      document.documentElement.clientWidth
  );
}

function applyBodyScrollLock(): void {
  if (!canUseDOM()) {
    return;
  }

  const body =
    document.body;

  if (!bodyStyleSnapshot) {
    bodyStyleSnapshot =
      captureBodyStyle(body);
  }

  if (
    isIOSLikeEnvironment()
  ) {
    savedScrollY =
      window.scrollY;

    body.style.position =
      "fixed";

    body.style.top =
      `-${savedScrollY}px`;

    body.style.left =
      "0";

    body.style.right =
      "0";

    body.style.width =
      "100%";

    return;
  }

  const scrollbarWidth =
    getDocumentScrollbarWidth();

  const computedPaddingRight =
    Number.parseFloat(
      window.getComputedStyle(
        body
      ).paddingRight
    );

  const existingPaddingRight =
    Number.isFinite(
      computedPaddingRight
    )
      ? computedPaddingRight
      : 0;

  body.style.overflow =
    "hidden";

  if (scrollbarWidth > 0) {
    /*
     * La compensación se suma al padding computado. Reemplazarlo desplazaría
     * el contenido de aplicaciones que ya reservan espacio en el body.
     * El snapshot conserva el valor inline exacto para restaurarlo después.
     */
    body.style.paddingRight =
      `${
        existingPaddingRight +
        scrollbarWidth
      }px`;
  }
}

function restoreBodyScrollState(): void {
  if (!canUseDOM()) {
    return;
  }

  const body =
    document.body;

  const shouldRestoreScroll =
    isIOSLikeEnvironment();

  if (bodyStyleSnapshot) {
    restoreBodyStyle(
      body,
      bodyStyleSnapshot
    );

    bodyStyleSnapshot =
      null;
  }

  if (shouldRestoreScroll) {
    window.scrollTo(
      0,
      savedScrollY
    );
  }
}

export function acquireBodyScrollLock(
  lockId: string
): void {
  assertValidBodyScrollLockId(
    lockId
  );

  if (
    activeBodyScrollLocks.has(
      lockId
    )
  ) {
    return;
  }

  const shouldApply =
    activeBodyScrollLocks.size ===
    0;

  activeBodyScrollLocks.add(
    lockId
  );

  if (shouldApply) {
    applyBodyScrollLock();
  }
}

export function releaseBodyScrollLock(
  lockId: string
): void {
  assertValidBodyScrollLockId(
    lockId
  );

  const existed =
    activeBodyScrollLocks.delete(
      lockId
    );

  if (!existed) {
    return;
  }

  if (
    activeBodyScrollLocks.size ===
    0
  ) {
    restoreBodyScrollState();
  }
}