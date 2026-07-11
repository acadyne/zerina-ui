// src/core/interaction/events/composeRefs.ts

import type React from "react";

export function setRef<T>(
  ref: React.Ref<T> | undefined,
  value: T | null
): void {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  (
    ref as React.MutableRefObject<T | null>
  ).current = value;
}

export function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      setRef(ref, value);
    }
  };
}