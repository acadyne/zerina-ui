import {
  getComposedParentNode,
  isDOMNode,
} from "../../dom";

interface ComposedPathSource {
  composedPath?: () => EventTarget[];
}

/**
 * Forma estructural compartida por eventos DOM y eventos sintéticos de React.
 *
 * El módulo no depende de React ni de instanceof Event. Un SyntheticEvent
 * expone el evento DOM original mediante nativeEvent, mientras que un evento
 * nativo puede implementar composedPath directamente.
 */
export interface NodeOwnershipEvent
  extends ComposedPathSource {
  readonly target:
    EventTarget | null;

  readonly nativeEvent?:
    ComposedPathSource | null;
}

type PotentialInteractiveElement =
  Element & {
    readonly isContentEditable?:
      boolean;

    readonly tabIndex?:
      number;
  };

const INTERACTIVE_ROLES =
  new Set([
    "button",
    "checkbox",
    "combobox",
    "link",
    "listbox",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "tab",
    "textbox",
    "treeitem",
  ]);

function readComposedPath(
  source:
    ComposedPathSource | null | undefined
): EventTarget[] | null {
  const composedPath =
    source?.composedPath;

  if (
    typeof composedPath !==
      "function"
  ) {
    return null;
  }

  try {
    const path =
      composedPath.call(source);

    return (
      Array.isArray(path) &&
      path.length > 0
    )
      ? path
      : null;
  } catch {
    /*
     * Una implementación parcial o instrumentada puede exponer el método sin
     * poder ejecutarlo. Solo en ese caso se intenta la siguiente fuente y,
     * finalmente, el recorrido estructural.
     */
    return null;
  }
}

function getEventComposedPath(
  event: NodeOwnershipEvent
): EventTarget[] | null {
  /*
   * En React, la ruta autoritativa pertenece al evento DOM original. Consultar
   * nativeEvent primero evita depender del retargeting del wrapper sintético.
   */
  return (
    readComposedPath(
      event.nativeEvent
    ) ??
    readComposedPath(event)
  );
}

function getNodeDocument(
  node: Node
): Document | null {
  return node.nodeType === 9
    ? node as Document
    : node.ownerDocument;
}

function hasInteractiveRole(
  element: Element
): boolean {
  const role =
    element.getAttribute("role");

  if (!role) {
    return false;
  }

  /*
   * La clasificación es deliberadamente conservadora: cualquier token
   * interactivo reconocido establece una frontera. No intenta reproducir la
   * resolución completa de fallback roles del árbol de accesibilidad.
   */
  return role
    .trim()
    .toLowerCase()
    .split(/\s+/u)
    .some((token) =>
      INTERACTIVE_ROLES.has(
        token
      )
    );
}

function isInteractiveBoundary(
  node: Node
): boolean {
  if (node.nodeType !== 1) {
    return false;
  }

  const element =
    node as PotentialInteractiveElement;

  /*
   * isContentEditable refleja la editabilidad efectiva, incluida la heredada
   * desde un ancestro. Comprobar solo el atributo local perdería ese caso.
   */
  if (
    element.isContentEditable ===
      true
  ) {
    return true;
  }

  const tagName =
    element.tagName.toLowerCase();

  if (
    tagName === "button" ||
    tagName === "input" ||
    tagName === "select" ||
    tagName === "textarea" ||
    tagName === "summary"
  ) {
    return true;
  }

  if (
    (
      tagName === "a" ||
      tagName === "area"
    ) &&
    element.hasAttribute("href")
  ) {
    return true;
  }

  if (
    (
      tagName === "audio" ||
      tagName === "video"
    ) &&
    element.hasAttribute(
      "controls"
    )
  ) {
    return true;
  }

  if (
    hasInteractiveRole(element)
  ) {
    return true;
  }

  /*
   * tabIndex se consulta como propiedad efectiva. Así se reconocen controles
   * personalizados focusables aunque el índice proceda de comportamiento
   * nativo o de una asignación programática y no de un atributo literal.
   */
  return (
    typeof element.tabIndex ===
      "number" &&
    element.tabIndex >= 0
  );
}

/**
 * Indica si un nodo owner debe adoptar un evento que burbujeó hasta él.
 *
 * El contenido visual ordinario pertenece al owner. Un control interactivo o
 * editable encontrado antes del owner constituye una frontera independiente y
 * conserva su propia semántica.
 *
 * Cuando existe composedPath, la ruta es autoritativa: si no alcanza al owner,
 * el evento no se considera suyo. El fallback compuesto se utiliza únicamente
 * cuando ninguna fuente ofrece una ruta utilizable.
 */
export function isEventOwnedByNode(
  event: NodeOwnershipEvent,
  owner: Node
): boolean {
  const ownerDocument =
    getNodeDocument(owner);

  if (!ownerDocument) {
    return false;
  }

  const path =
    getEventComposedPath(event);

  if (path) {
    for (
      const entry of path
    ) {
      /*
       * El owner termina el recorrido antes de ser evaluado como una frontera
       * interactiva. Su propia semántica es precisamente la que se decide aquí.
       */
      if (entry === owner) {
        return true;
      }

      if (isDOMNode(entry)) {
        /*
         * Los eventos DOM ordinarios no cruzan Documents, pero el contrato es
         * estructural y también admite wrappers o eventos instrumentados. La
         * frontera documental debe garantizarla la propia primitiva.
         */
        if (
          getNodeDocument(entry) !==
            ownerDocument
        ) {
          return false;
        }

        if (
          isInteractiveBoundary(
            entry
          )
        ) {
          return false;
        }
      }
    }

    return false;
  }

  if (
    !isDOMNode(event.target)
  ) {
    return false;
  }

  const targetDocument =
    getNodeDocument(
      event.target
    );

  if (
    targetDocument !==
      ownerDocument
  ) {
    return false;
  }

  let current:
    Node | null =
    event.target;

  while (current) {
    if (current === owner) {
      return true;
    }

    if (
      isInteractiveBoundary(
        current
      )
    ) {
      return false;
    }

    current =
      getComposedParentNode(
        current
      );
  }

  return false;
}
