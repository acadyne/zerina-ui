/*
 * CONTRATO DE ESTE MÓDULO
 *
 * Esta unidad responde únicamente preguntas sobre un HTMLElement individual:
 *
 * - si conserva presencia efectiva dentro de su árbol compuesto;
 * - si puede recibir foco programático;
 * - si puede participar como candidato de navegación secuencial.
 *
 * No descubre candidatos ni decide relaciones entre ellos. Puede recorrer
 * ancestros cuando una propiedad individual —como la visibilidad efectiva—
 * depende del contexto compuesto del elemento evaluado.
 *
 * Regla de mantenimiento:
 * si el resultado compara, agrupa, reduce u ordena varios candidatos, pertenece
 * a focusNavigation.ts.
 */

import {
  getComposedParentNode,
} from "../../dom";

/*
 * El selector solo identifica elementos cuya clase DOM puede participar en el
 * foco. La elegibilidad efectiva se decide después mediante estado, ancestros
 * compuestos y la propiedad normalizada tabIndex.
 */
const FOCUSABLE_CANDIDATE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "summary",
  '[contenteditable]:not([contenteditable="false"])',
  "[tabindex]",
].join(",");

/**
 * Determina si un elemento conserva presencia efectiva para recibir foco.
 *
 * El recorrido sigue slots y hosts para que hidden, inert y aria-hidden en un
 * ancestro compuesto invaliden al descendiente. Cada estilo se consulta desde
 * la Window propietaria del elemento y nunca desde el realm global.
 */
export function isElementVisibleForFocus(
  element: HTMLElement
): boolean {
  if (!element.isConnected) {
    return false;
  }

  let current:
    Node | null =
    element;

  while (current) {
    if (current.nodeType === 1) {
      const currentElement =
        current as Element;

      const ownerWindow =
        currentElement
          .ownerDocument
          .defaultView;

      if (!ownerWindow) {
        return false;
      }

      const style =
        ownerWindow.getComputedStyle(
          currentElement
        );

      if (
        currentElement.hasAttribute(
          "hidden"
        ) ||
        currentElement.hasAttribute(
          "inert"
        ) ||
        currentElement.getAttribute(
          "aria-hidden"
        ) === "true" ||
        style.display === "none" ||
        style.visibility ===
          "hidden" ||
        style.visibility ===
          "collapse"
      ) {
        return false;
      }
    }

    current =
      getComposedParentNode(
        current
      );
  }

  return (
    element.getClientRects()
      .length > 0
  );
}

/**
 * Clasifica focusability programática sin confundirla con participación en Tab.
 *
 * :disabled conserva la semántica nativa, incluidas relaciones como fieldset.
 * Un tabIndex negativo sigue siendo focusable programáticamente y se excluye
 * únicamente al clasificar candidatos para foco secuencial.
 */
export function isElementFocusable(
  element: HTMLElement
): boolean {
  if (
    !element.matches(
      FOCUSABLE_CANDIDATE_SELECTOR
    )
  ) {
    return false;
  }

  if (
    element.matches(
      ":disabled"
    )
  ) {
    return false;
  }

  return isElementVisibleForFocus(
    element
  );
}

/**
 * Clasifica un HTMLElement individual como candidato secuencial.
 *
 * Esta función no decide qué elemento representa a un grupo radio ni en qué
 * posición aparece respecto de otros candidatos. Ambas decisiones requieren una
 * colección y pertenecen exclusivamente a focusNavigation.ts.
 */
export function isSequentialFocusCandidate(
  element: HTMLElement
): boolean {
  return (
    element.tabIndex >= 0 &&
    isElementFocusable(
      element
    )
  );
}
