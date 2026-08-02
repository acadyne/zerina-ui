// src/primitives/overlay/menu/menu.utils.ts

import type React from "react";

import {
  getComposedParentNode,
} from "../../../core/dom";

import type {
  FloatingPlacement,
} from "../../../core/overlay";


function isOwnedHTMLSlotElement(
  node: Node
): node is HTMLSlotElement {
  if (node.nodeType !== 1) {
    return false;
  }

  const element =
    node as Element;

  const ownerWindow =
    element.ownerDocument.defaultView;

  /*
   * localName no basta entre realms o namespaces. La distribución pertenece al
   * constructor HTMLSlotElement del Document propietario.
   */
  return !!(
    ownerWindow &&
    typeof ownerWindow.HTMLSlotElement ===
      "function" &&
    element instanceof
      ownerWindow.HTMLSlotElement
  );
}


function getPresentedChildren(
  parent: Node
): Node[] {
  if (
    isOwnedHTMLSlotElement(
      parent
    )
  ) {
    /*
     * Un slot con asignaciones presenta esos nodos, no su fallback. flatten se
     * mantiene desactivado para no borrar slots anidados como fronteras reales.
     */
    const assignedNodes =
      parent.assignedNodes();

    return assignedNodes.length > 0
      ? assignedNodes
      : Array.from(
          parent.childNodes
        );
  }

  if (parent.nodeType === 1) {
    const shadowRoot =
      (
        parent as Element
      ).shadowRoot;

    /*
     * getComposedParentNode conecta ShadowRoot con su host. Por eso el hijo
     * compuesto inmediato del host es la raíz, no los light DOM children que la
     * raíz presenta posteriormente mediante slots.
     */
    if (
      shadowRoot &&
      shadowRoot.ownerDocument ===
        parent.ownerDocument
    ) {
      return [
        shadowRoot,
      ];
    }
  }

  /*
   * El filtro elimina hijos DOM cuyo padre compuesto real es otro owner, como un
   * nodo light DOM distribuido mediante assignedSlot.
   */
  return Array.from(
    parent.childNodes
  ).filter(
    (child) =>
      getComposedParentNode(
        child
      ) === parent
  );
}


function getComposedAncestorChain(
  node: Node
): Node[] {
  const chain:
    Node[] =
    [];

  const visited =
    new Set<Node>();

  let current:
    Node | null =
    node;

  while (
    current &&
    !visited.has(current)
  ) {
    visited.add(current);

    chain.push(current);

    current =
      getComposedParentNode(
        current
      );
  }

  return chain.reverse();
}


/**
 * Compara dos nodos según su posición observable en el árbol compuesto.
 *
 * Esta operación no usa tabindex, focusability, roles ni orden de registro.
 * MenuItem utiliza tabIndex=-1, por lo que reutilizar el pipeline de navegación
 * secuencial borraría precisamente los candidatos que esta colección necesita.
 *
 * La comparación reconoce slots asignados, fallback de slots, shadow roots
 * abiertos y hosts. Las raíces cerradas siguen fuera del DOM observable y no se
 * intenta fabricar una representación que el navegador no expone.
 */
export function compareComposedNodeOrder(
  left: Node,
  right: Node
): number {
  if (left === right) {
    return 0;
  }

  const leftDocument =
    left.nodeType === 9
      ? left as Document
      : left.ownerDocument;

  const rightDocument =
    right.nodeType === 9
      ? right as Document
      : right.ownerDocument;

  if (
    !leftDocument ||
    leftDocument !==
      rightDocument
  ) {
    return 0;
  }

  const leftChain =
    getComposedAncestorChain(
      left
    );

  const rightChain =
    getComposedAncestorChain(
      right
    );

  let index =
    0;

  while (
    index < leftChain.length &&
    index < rightChain.length &&
    leftChain[index] ===
      rightChain[index]
  ) {
    index += 1;
  }

  if (
    index ===
    leftChain.length
  ) {
    return -1;
  }

  if (
    index ===
    rightChain.length
  ) {
    return 1;
  }

  const parent =
    leftChain[index - 1];

  const leftChild =
    leftChain[index];

  const rightChild =
    rightChain[index];

  if (parent) {
    const children =
      getPresentedChildren(
        parent
      );

    const leftIndex =
      children.indexOf(
        leftChild
      );

    const rightIndex =
      children.indexOf(
        rightChild
      );

    if (
      leftIndex >= 0 &&
      rightIndex >= 0 &&
      leftIndex !==
        rightIndex
    ) {
      return (
        leftIndex -
        rightIndex
      );
    }
  }

  /*
   * Este fallback solo resuelve estructuras DOM ordinarias que continúan siendo
   * comparables. No reemplaza las relaciones compuestas calculadas arriba.
   */
  const position =
    left.compareDocumentPosition(
      right
    );

  const nodeConstructor =
    leftDocument.defaultView?.Node;

  if (
    nodeConstructor &&
    position &
      nodeConstructor
        .DOCUMENT_POSITION_FOLLOWING
  ) {
    return -1;
  }

  if (
    nodeConstructor &&
    position &
      nodeConstructor
        .DOCUMENT_POSITION_PRECEDING
  ) {
    return 1;
  }

  return 0;
}


export function getFloatingSide(
  placement: FloatingPlacement
):
  | "top"
  | "bottom"
  | "left"
  | "right" {
  return placement.split("-")[0] as
    | "top"
    | "bottom"
    | "left"
    | "right";
}


export function getMenuTransformOrigin(
  placement: FloatingPlacement
): React.CSSProperties["transformOrigin"] {
  switch (placement) {
    case "top":
      return "bottom center";

    case "top-start":
      return "bottom left";

    case "top-end":
      return "bottom right";

    case "bottom":
      return "top center";

    case "bottom-start":
      return "top left";

    case "bottom-end":
      return "top right";

    case "left":
      return "center right";

    case "left-start":
      return "top right";

    case "left-end":
      return "bottom right";

    case "right":
      return "center left";

    case "right-start":
      return "top left";

    case "right-end":
      return "bottom left";

    default:
      return "top left";
  }
}
