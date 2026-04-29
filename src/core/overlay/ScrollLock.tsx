// src/core/overlay/ScrollLock.tsx
import React from "react";
import { useIsOverlayTopmost } from "./OverlayProvider";

type BodyLockSnapshot = {
  overflow: string;
  paddingRight: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
};

type ScrollLockEntry = {
  id: string;
};

const scrollLockStack: ScrollLockEntry[] = [];

let bodySnapshot: BodyLockSnapshot | null = null;
let savedScrollY = 0;

function isIOSLike(): boolean {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const maxTouchPoints = window.navigator.maxTouchPoints ?? 0;

  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1)
  );
}

function captureBodyLockSnapshot(body: HTMLElement): BodyLockSnapshot {
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

function restoreBodyLockSnapshot(body: HTMLElement, snapshot: BodyLockSnapshot) {
  body.style.overflow = snapshot.overflow;
  body.style.paddingRight = snapshot.paddingRight;
  body.style.position = snapshot.position;
  body.style.top = snapshot.top;
  body.style.left = snapshot.left;
  body.style.right = snapshot.right;
  body.style.width = snapshot.width;
}

function applyBodyLock() {
  const body = document.body;
  const iosLike = isIOSLike();

  if (!bodySnapshot) {
    bodySnapshot = captureBodyLockSnapshot(body);
  }

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  if (iosLike) {
    savedScrollY = window.scrollY;

    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return;
  }

  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function releaseBodyLock() {
  const body = document.body;
  const iosLike = isIOSLike();

  if (bodySnapshot) {
    restoreBodyLockSnapshot(body, bodySnapshot);
    bodySnapshot = null;
  }

  if (iosLike) {
    window.scrollTo(0, savedScrollY);
  }
}

function registerScrollLock(id: string) {
  if (scrollLockStack.some((entry) => entry.id === id)) return;

  const wasEmpty = scrollLockStack.length === 0;
  scrollLockStack.push({ id });

  if (wasEmpty) {
    applyBodyLock();
  }
}

function unregisterScrollLock(id: string) {
  const next = scrollLockStack.filter((entry) => entry.id !== id);
  const hadEntries = scrollLockStack.length > 0;

  scrollLockStack.length = 0;
  scrollLockStack.push(...next);

  if (hadEntries && scrollLockStack.length === 0) {
    releaseBodyLock();
  }
}

export interface ScrollLockProps {
  overlayId: string;
  enabled?: boolean;
  active?: boolean;
}

export const ScrollLock: React.FC<ScrollLockProps> = ({
  overlayId,
  enabled = true,
  active = true,
}) => {
  const isTopmost = useIsOverlayTopmost(overlayId);

  React.useEffect(() => {
    if (!enabled) return;
    if (!active) return;
    if (!isTopmost) return;

    registerScrollLock(overlayId);

    return () => {
      unregisterScrollLock(overlayId);
    };
  }, [overlayId, enabled, active, isTopmost]);

  return null;
};

ScrollLock.displayName = "ScrollLock";