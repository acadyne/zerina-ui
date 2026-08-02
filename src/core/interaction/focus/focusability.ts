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
 * Identifica candidatos individuales para foco secuencial.
 *
 * El orden global y las reglas de grupos radio pertenecen a la colección, no a
 * una propiedad aislada del elemento.
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

/*
 * La colección comparte deliberadamente el contrato HTML de attemptFocus.
 * Incluir otro tipo de Element produciría candidatos que la operación central
 * no podría confirmar como foco committed.
 */
function isOwnedHTMLElement(
  node: Node
): node is HTMLElement {
  if (node.nodeType !== 1) {
    return false;
  }

  const element =
    node as Element;

  const ownerWindow =
    element.ownerDocument
      .defaultView;

  return !!(
    ownerWindow &&
    element instanceof
      ownerWindow.HTMLElement
  );
}

function isOwnedHTMLSlotElement(
  element: Element
): element is HTMLSlotElement {
  const ownerWindow =
    element.ownerDocument
      .defaultView;

  /*
   * localName no basta: otro namespace puede contener un elemento llamado
   * slot sin implementar distribución ni assignedNodes().
   */
  return !!(
    ownerWindow &&
    typeof ownerWindow
      .HTMLSlotElement ===
        "function" &&
    element instanceof
      ownerWindow.HTMLSlotElement
  );
}

function getComposedChildNodes(
  node: Node
): Node[] {
  if (node.nodeType === 1) {
    const element =
      node as Element;

    /*
     * Un slot presenta primero sus nodos asignados. Su contenido DOM solo
     * participa como fallback cuando no existe distribución efectiva.
     */
    if (
      isOwnedHTMLSlotElement(
        element
      )
    ) {
      const assignedNodes =
        element.assignedNodes({
          flatten: true,
        });

      if (assignedNodes.length > 0) {
        return assignedNodes;
      }
    }

    /*
     * Cuando un host posee un shadow root abierto, sus hijos light DOM no son
     * hijos compuestos directos. La distribución se resolverá al visitar slots.
     */
    if (element.shadowRoot) {
      return Array.from(
        element.shadowRoot
          .childNodes
      );
    }
  }

  return Array.from(
    node.childNodes
  );
}

/**
 * Obtiene candidatos secuenciales en el orden observable del árbol compuesto.
 *
 * La función no cruza documentos ni entra en el Document de un iframe. El
 * iframe puede ser candidato, pero su browsing context mantiene ownership
 * independiente.
 *
 * Esta colección todavía conserva el orden compuesto natural. La prioridad de
 * tabIndex positivo y la reducción de grupos radio se aplicarán en la siguiente
 * frontera.
 */
export function getComposedSequentialFocusCandidates(
  container: HTMLElement
): HTMLElement[] {
  const ownerDocument =
    container.ownerDocument;

  const visited =
    new Set<Node>();

  const candidates:
    HTMLElement[] =
    [];

  const visit = (
    node: Node
  ): void => {
    if (
      visited.has(node) ||
      node.ownerDocument !==
        ownerDocument
    ) {
      return;
    }

    visited.add(node);

    if (
      isOwnedHTMLElement(node) &&
      isSequentialFocusCandidate(
        node
      )
    ) {
      candidates.push(node);
    }

    for (
      const child
      of getComposedChildNodes(
        node
      )
    ) {
      visit(child);
    }
  };

  /*
   * El contenedor define la frontera, pero no forma parte de su propia
   * colección de descendientes. FocusScope lo conserva como fallback explícito.
   */
  for (
    const child
    of getComposedChildNodes(
      container
    )
  ) {
    visit(child);
  }

  return candidates;
}
