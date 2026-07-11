// src/helpers/dom.ts

export function dataAttr(condition?: boolean): true | undefined {
  return condition ? true : undefined;
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