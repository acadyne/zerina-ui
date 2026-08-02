/*
 * FRONTERA DEL PIPELINE DE NAVEGACIÓN DE FOCO
 *
 * Esta unidad concentra las operaciones que descubren candidatos o resuelven
 * relaciones entre varios de ellos. focusability.ts conserva la clasificación
 * de un candidato individual, aunque para calcularla deba observar sus
 * ancestros compuestos.
 *
 * RESPONSABILIDAD ACTUAL
 *
 * - recorrer la presentación compuesta;
 * - aplicar la elegibilidad individual;
 * - reducir dentro de la colección grupos radio por identidad HTML nativa;
 * - producir candidatos en orden compuesto de descubrimiento.
 *
 * RESPONSABILIDAD DEL PIPELINE COMPLETO
 *
 * - preservar fronteras y relaciones HTML nativas antes de construir scopes;
 * - ordenar cada scope mediante el tabIndex efectivo;
 * - aplanar los scopes en la secuencia final consumida por FocusScope.
 *
 * Este módulo define el único lugar donde esas reglas deben implementarse, pero
 * su existencia no afirma que ya estén resueltas. Mientras la API exportada sea
 * collectComposedFocusCandidates, solo ofrece la fase estructural descrita arriba.
 *
 * Roles ARIA, componentes React, keys, IDs, roots de overlays y patrones roving
 * no crean por sí mismos una frontera nativa de navegación.
 *
 * Dirección de dependencias:
 *
 * focusNavigation.ts -> focusability.ts
 *
 * focusability.ts nunca debe importar este módulo.
 */

import {
  isSequentialFocusCandidate,
} from "./focusability";

/*
 * El pipeline solo emite HTMLElement porque attemptFocus valida esa misma clase
 * en el realm propietario y confirma después que quedó como foco profundo.
 * Admitir otros Element produciría candidatos que el consumidor no puede usar.
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

function isOwnedHTMLInputElement(
  element: HTMLElement
): element is HTMLInputElement {
  const ownerWindow =
    element.ownerDocument
      .defaultView;

  return !!(
    ownerWindow &&
    typeof ownerWindow
      .HTMLInputElement ===
        "function" &&
    element instanceof
      ownerWindow.HTMLInputElement
  );
}

type NamedRadioCandidate = {
  radio: HTMLInputElement;
  name: string;
};

type RadioGroupState = {
  firstEligible:
    HTMLInputElement;

  checkedEligible:
    HTMLInputElement | null;
};

type RadioGroupsByName =
  Map<
    string,
    RadioGroupState
  >;

type RadioGroupsByFormOwner =
  Map<
    HTMLFormElement | null,
    RadioGroupsByName
  >;

/*
 * La identidad del grupo sigue el árbol DOM nativo, no la presentación
 * compuesta. getRootNode() mantiene separados Document y ShadowRoot incluso
 * cuando un radio light DOM se presenta mediante un slot.
 *
 * El atributo debe existir y no puede estar vacío. El valor se conserva sin
 * normalización porque la igualdad del nombre forma parte de la identidad HTML.
 */
function getNamedRadioCandidate(
  element: HTMLElement
): NamedRadioCandidate | null {
  if (
    !isOwnedHTMLInputElement(
      element
    ) ||
    element.type !== "radio"
  ) {
    return null;
  }

  const name =
    element.getAttribute(
      "name"
    );

  if (
    name === null ||
    name === ""
  ) {
    return null;
  }

  return {
    radio: element,
    name,
  };
}

function getOrCreateRadioGroupState(
  groupsByRoot: Map<
    Node,
    RadioGroupsByFormOwner
  >,
  candidate: NamedRadioCandidate
): RadioGroupState {
  const {
    radio,
    name,
  } = candidate;

  const root =
    radio.getRootNode();

  let groupsByFormOwner =
    groupsByRoot.get(root);

  if (!groupsByFormOwner) {
    groupsByFormOwner =
      new Map();

    groupsByRoot.set(
      root,
      groupsByFormOwner
    );
  }

  /*
   * null representa ausencia de form owner. Solo comparte grupo con otros
   * radios sin formulario cuando también coinciden el root y el nombre.
   */
  const formOwner =
    radio.form;

  let groupsByName =
    groupsByFormOwner.get(
      formOwner
    );

  if (!groupsByName) {
    groupsByName =
      new Map();

    groupsByFormOwner.set(
      formOwner,
      groupsByName
    );
  }

  let state =
    groupsByName.get(name);

  if (!state) {
    state = {
      firstEligible:
        radio,

      checkedEligible:
        radio.checked
          ? radio
          : null,
    };

    groupsByName.set(
      name,
      state
    );

    return state;
  }

  /*
   * En árboles conectados el navegador mantiene una sola checkedness verdadera.
   * Si un árbol desconectado expone varias, el primer radio marcado conserva la
   * representación para mantener un resultado determinista.
   */
  if (
    !state.checkedEligible &&
    radio.checked
  ) {
    state.checkedEligible =
      radio;
  }

  return state;
}

/**
 * Reduce grupos radio dentro de la colección ya elegible.
 *
 * Cada grupo aporta el radio marcado elegible o, si no existe, su primer radio
 * elegible. La frontera es deliberadamente local: un radio marcado fuera del
 * contenedor, oculto, disabled o con tabIndex negativo no puede convertirse en
 * un elemento retornado por esta colección.
 *
 * El filtro conserva exactamente el orden recibido. No ordena candidatos ni
 * intenta resolver todavía focus navigation scopes.
 */
function reduceCollectedRadioGroups(
  candidates: HTMLElement[]
): HTMLElement[] {
  const groupsByRoot =
    new Map<
      Node,
      RadioGroupsByFormOwner
    >();

  const stateByRadio =
    new Map<
      HTMLInputElement,
      RadioGroupState
    >();

  for (
    const candidate
    of candidates
  ) {
    const namedRadio =
      getNamedRadioCandidate(
        candidate
      );

    if (!namedRadio) {
      continue;
    }

    const state =
      getOrCreateRadioGroupState(
        groupsByRoot,
        namedRadio
      );

    stateByRadio.set(
      namedRadio.radio,
      state
    );
  }

  return candidates.filter(
    (candidate) => {
      const namedRadio =
        getNamedRadioCandidate(
          candidate
        );

      if (!namedRadio) {
        return true;
      }

      const state =
        stateByRadio.get(
          namedRadio.radio
        );

      if (!state) {
        return true;
      }

      const representative =
        state.checkedEligible ??
        state.firstEligible;

      return (
        representative ===
        namedRadio.radio
      );
    }
  );
}

/*
 * Esta fase aplana slots y atraviesa hosts para conservar el comportamiento
 * actual. No representa fronteras de navegación: el pipeline completo deberá
 * reemplazar esta vista plana antes de construir y ordenar scopes.
 */
function getFlattenedComposedChildNodes(
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
 * Recoge HTMLElements elegibles en orden compuesto de descubrimiento.
 *
 * Esta operación conserva el comportamiento estructural existente:
 *
 * - atraviesa shadow roots abiertos;
 * - presenta nodos asignados mediante slots;
 * - no cruza hacia el Document de un iframe;
 * - excluye al contenedor de su propia colección.
 *
 * La colección normaliza grupos radio entre sus candidatos elegibles, pero el
 * resultado no es todavía el orden secuencial HTML completo: no representa
 * scopes de navegación ni aplica tabIndex positivo dentro de esos scopes.
 *
 * El verbo collect es intencional. Una API que prometa la secuencia final solo
 * debe existir después de resolver esas reglas dentro de este mismo módulo.
 */
export function collectComposedFocusCandidates(
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
      of getFlattenedComposedChildNodes(
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
    of getFlattenedComposedChildNodes(
      container
    )
  ) {
    visit(child);
  }

  return reduceCollectedRadioGroups(
    candidates
  );
}
