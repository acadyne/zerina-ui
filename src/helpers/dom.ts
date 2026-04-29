// src/helpers/dom.ts
import React from "react";

export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(value);
        return;
      }

      try {
        (ref as React.MutableRefObject<T | null>).current = value;
      } catch {
        // noop
      }
    });
  };
}

export function callAll<EventType>(
  ...handlers: Array<((event: EventType) => void) | undefined>
) {
  return (event: EventType) => {
    handlers.forEach((handler) => handler?.(event));
  };
}

export function dataAttr(condition?: boolean): true | undefined {
  return condition ? true : undefined;
}

export function ariaBool(value?: boolean): true | undefined {
  return value ? true : undefined;
}

export function isInputLikeElement(
  node: EventTarget | null
): node is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    node instanceof HTMLInputElement ||
    node instanceof HTMLTextAreaElement ||
    node instanceof HTMLSelectElement
  );
}

export function containsRelatedTarget(
  currentTarget: HTMLElement,
  relatedTarget: EventTarget | null
): boolean {
  return relatedTarget instanceof Node
    ? currentTarget.contains(relatedTarget)
    : false;
}