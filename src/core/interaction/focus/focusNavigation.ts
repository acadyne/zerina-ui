/*
 * FRONTERA DEL PIPELINE DE NAVEGACIÓN DE FOCO
 *
 * Esta unidad concentra las operaciones que descubren candidatos o resuelven
 * relaciones entre varios de ellos. focusability.ts conserva la clasificación
 * de un candidato individual, aunque para calcularla deba observar sus
 * ancestros compuestos.
 *
 * PIPELINE IMPLEMENTADO
 *
 * - descubrir estructura sin borrar hosts ni slots;
 * - clasificar candidatos mediante focusability.ts;
 * - reducir radios alcanzables antes de cualquier ordenación;
 * - materializar entradas dentro de su scope de navegación;
 * - ordenar localmente cada scope por su tabindex efectivo;
 * - aplanar los scopes en la secuencia final consumida por FocusScope.
 *
 * La frontera del contenedor actúa como root sintético: conserva únicamente sus
 * descendientes presentados y nunca devuelve al propio contenedor.
 *
 * ALCANCE OBSERVABLE
 *
 * - shadow roots abiertos;
 * - shadow hosts y delegatesFocus;
 * - slots con distribución directa y contenido fallback;
 * - orden local de tabindex positivo;
 * - grupos radio mediante identidad DOM nativa.
 *
 * No se infiere ownership dinámico de popovers HTML nativos y no se entra en
 * el Document interno de un iframe.
 *
 * Las raíces cerradas no son observables mediante element.shadowRoot: null no
 * distingue entre ausencia de raíz y una raíz cerrada. En ese caso no es
 * posible reconstruir los owners internos ni la distribución real del light
 * DOM. El colector conserva una aproximación basada únicamente en información
 * DOM observable y puede divergir de la navegación nativa en componentes con
 * shadow roots cerrados.
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
  isElementFocusable,
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
 * El filtro conserva exactamente el orden recibido. La alcanzabilidad ya fue
 * resuelta antes de invocarlo y el orden local por scope se aplica después.
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
 * El parser HTML termina después de la primera secuencia de dígitos. El sufijo
 * puede ser no conforme para autores, pero no invalida el valor procesado.
 */
const TAB_INDEX_PREFIX_PATTERN =
  /^[\t\n\f\r ]*([+-]?)(\d+)/;

type TabIndexValue =
  bigint | null;

type FocusNavigationScopeEntries = {
  /*
   * Esta colección conserva descubrimiento estructural. Todavía no representa
   * el scope ordenado: radio y tabindex se resuelven en fases posteriores.
   */
  discovered:
    DiscoveredFocusElement[];
};

/*
 * La unión conserva qué creó cada frontera. El contenedor es una frontera local
 * de la utilidad, no un focus navigation scope owner del documento.
 */
type FocusNavigationScope =
  | (
      FocusNavigationScopeEntries & {
        kind:
          "container";

        owner:
          null;
      }
    )
  | (
      FocusNavigationScopeEntries & {
        kind:
          "shadow-host";

        owner:
          HTMLElement;
      }
    )
  | (
      FocusNavigationScopeEntries & {
        kind:
          "slot";

        owner:
          HTMLSlotElement;
      }
    );

type DiscoveredFocusElement = {
  element:
    HTMLElement;

  childScope:
    FocusNavigationScope | null;

  /*
   * Clasificación individual antes de aplicar reglas propias del owner.
   */
  isCandidate:
    boolean;

  /*
   * Un host delegante permanece como frontera, pero no se materializa como
   * objetivo secuencial directo.
   */
  delegatesFocus:
    boolean;

  /*
   * La reducción radio modifica representación, no elegibilidad individual.
   */
  isRadioRepresentative:
    boolean;

  tabIndexValue:
    TabIndexValue;

  discoveryIndex:
    number;
};

type FocusDiscoveryState = {
  ownerDocument:
    Document;

  visited:
    Set<Node>;

  nextDiscoveryIndex:
    number;
};

/*
 * tabIndex y tabindex value no son equivalentes:
 *
 * - el getter IDL aplica defaults por tipo de elemento y limita el resultado a
 *   long;
 * - el algoritmo de navegación usa el atributo, acepta un prefijo entero y no
 *   limita conceptualmente su magnitud.
 *
 * bigint evita perder orden entre valores positivos grandes.
 */
function getTabIndexValue(
  element: HTMLElement
): TabIndexValue {
  const attribute =
    element.getAttribute(
      "tabindex"
    );

  if (attribute === null) {
    return null;
  }

  const match =
    TAB_INDEX_PREFIX_PATTERN.exec(
      attribute
    );

  if (!match) {
    return null;
  }

  const sign =
    match[1] === "-"
      ? -1n
      : 1n;

  const digits =
    match[2];

  if (!digits) {
    return null;
  }

  return (
    sign *
    BigInt(digits)
  );
}

/*
 * Un valor explícito procesable posee autoridad sobre el getter IDL. Cuando el
 * valor es null, los defaults del navegador siguen resolviéndose mediante la
 * clasificación individual existente.
 *
 * tabIndexValue participa en orden y pertenencia secuencial; no sustituye las
 * reglas de presencia, disabled, inert o visibilidad de isElementFocusable().
 */
function isSequentialCandidateForTabIndex(
  element: HTMLElement,
  tabIndexValue: TabIndexValue
): boolean {
  if (tabIndexValue === null) {
    return isSequentialFocusCandidate(
      element
    );
  }

  return (
    tabIndexValue >= 0n &&
    isElementFocusable(
      element
    )
  );
}

function createContainerFocusNavigationScope():
  FocusNavigationScope {
  return {
    kind: "container",
    owner: null,
    discovered: [],
  };
}

function createShadowHostFocusNavigationScope(
  owner: HTMLElement
): FocusNavigationScope {
  return {
    kind: "shadow-host",
    owner,
    discovered: [],
  };
}

function createSlotFocusNavigationScope(
  owner: HTMLSlotElement
): FocusNavigationScope {
  return {
    kind: "slot",
    owner,
    discovered: [],
  };
}

/*
 * structuralParent, navigation owner y candidate element son conceptos
 * distintos:
 *
 * - el recorrido decide qué nodos están presentados;
 * - el scope receptor expresa ownership de navegación;
 * - isCandidate decide si el HTMLElement puede aparecer en el resultado.
 *
 * Ninguna de esas decisiones se deduce de roles ARIA ni componentes React.
 */
function discoverFocusNode(
  node: Node,
  scope: FocusNavigationScope,
  state: FocusDiscoveryState
): void {
  if (
    state.visited.has(node) ||
    node.ownerDocument !==
      state.ownerDocument
  ) {
    return;
  }

  state.visited.add(node);

  if (!isOwnedHTMLElement(node)) {
    for (
      const child
      of Array.from(
        node.childNodes
      )
    ) {
      discoverFocusNode(
        child,
        scope,
        state
      );
    }

    return;
  }

  const element =
    node;

  const slot =
    isOwnedHTMLSlotElement(
      element
    )
      ? element
      : null;

  /*
   * shadowRoot solo expone raíces abiertas. null no distingue entre ausencia de
   * raíz y una raíz cerrada.
   *
   * Cuando existe una raíz cerrada, la distribución interna y sus owners no son
   * reconstruibles desde esta utilidad; cualquier recorrido posterior permanece
   * dentro del dominio DOM observable.
   */
  const shadowRoot =
    element.shadowRoot;

  const childScope =
    slot
      ? createSlotFocusNavigationScope(
          slot
        )
      : shadowRoot
        ? createShadowHostFocusNavigationScope(
            element
          )
        : null;

  const delegatesFocus =
    !!shadowRoot?.delegatesFocus;

  const tabIndexValue =
    getTabIndexValue(
      element
    );

  /*
   * La entrada conserva por separado estructura, elegibilidad y materialización.
   * Un host delegante sigue presente como owner aunque no sea objetivo directo.
   */
  const discovered: DiscoveredFocusElement = {
    element,
    childScope,

    isCandidate:
      isSequentialCandidateForTabIndex(
        element,
        tabIndexValue
      ),

    delegatesFocus,

    isRadioRepresentative:
      true,

    tabIndexValue,

    discoveryIndex:
      state.nextDiscoveryIndex,
  };

  state.nextDiscoveryIndex += 1;

  scope.discovered.push(
    discovered
  );

  if (slot && childScope) {
    /*
     * flatten queda deliberadamente desactivado. Un slot asignado a otro slot
     * debe conservar su propia frontera en vez de desaparecer en esta fase.
     */
    const assignedNodes =
      slot.assignedNodes();

    if (assignedNodes.length > 0) {
      for (
        const assignedNode
        of assignedNodes
      ) {
        discoverFocusNode(
          assignedNode,
          childScope,
          state
        );
      }

      return;
    }

    /*
     * Sin nodos asignados no existe distribución hacia el owner slot. Sus hijos
     * fallback heredan el owner exterior mediante la cadena DOM; el slot conserva
     * su identidad estructural, pero su scope propio permanece vacío.
     */
    for (
      const fallbackChild
      of Array.from(
        slot.childNodes
      )
    ) {
      discoverFocusNode(
        fallbackChild,
        scope,
        state
      );
    }

    return;
  }

  if (shadowRoot && childScope) {
    for (
      const shadowChild
      of Array.from(
        shadowRoot.childNodes
      )
    ) {
      discoverFocusNode(
        shadowChild,
        childScope,
        state
      );
    }

    return;
  }

  for (
    const child
    of Array.from(
      element.childNodes
    )
  ) {
    discoverFocusNode(
      child,
      scope,
      state
    );
  }
}

/*
 * El contenedor define una frontera local y no participa como entrada. Si el
 * propio contenedor es host o slot, su scope nativo se rebasa mediante el root
 * sintético para conservar únicamente sus descendientes presentados.
 */
function discoverContainerContents(
  container: HTMLElement,
  rootScope: FocusNavigationScope,
  state: FocusDiscoveryState
): void {
  if (
    isOwnedHTMLSlotElement(
      container
    )
  ) {
    const assignedNodes =
      container.assignedNodes();

    const presentedNodes =
      assignedNodes.length > 0
        ? assignedNodes
        : Array.from(
            container.childNodes
          );

    for (
      const presentedNode
      of presentedNodes
    ) {
      discoverFocusNode(
        presentedNode,
        rootScope,
        state
      );
    }

    return;
  }

  const shadowRoot =
    container.shadowRoot;

  const presentedNodes =
    shadowRoot
      ? Array.from(
          shadowRoot.childNodes
        )
      : Array.from(
          container.childNodes
        );

  for (
    const presentedNode
    of presentedNodes
  ) {
    discoverFocusNode(
      presentedNode,
      rootScope,
      state
    );
  }
}

function isMaterializedSequentialCandidate(
  entry: DiscoveredFocusElement
): boolean {
  return (
    entry.isCandidate &&
    entry.isRadioRepresentative &&
    !entry.delegatesFocus
  );
}

function hasNegativeTabIndexValue(
  entry: DiscoveredFocusElement
): boolean {
  return (
    entry.tabIndexValue !== null &&
    entry.tabIndexValue < 0n
  );
}

/*
 * Un childScope solo puede alcanzar el aplanado cuando su owner pertenece al
 * tabindex-ordered focus navigation scope de su padre.
 *
 * Esta regla se aplica exclusivamente a hosts y slots, identificados aquí por
 * childScope. Una entrada DOM ordinaria no controla la alcanzabilidad de sus
 * descendientes, que ya existen como entradas independientes del mismo scope.
 */
function isIncludedFocusNavigationScopeOwner(
  entry: DiscoveredFocusElement
): boolean {
  return (
    entry.childScope !== null &&
    !hasNegativeTabIndexValue(
      entry
    )
  );
}

/*
 * La reducción radio solo observa candidatos cuya cadena de owners pertenece a
 * los scopes ordenados que pueden alcanzar el root sintético.
 *
 * Una entrada ordinaria negativa se excluye únicamente a sí misma. Sus
 * descendientes continúan como entradas independientes del mismo scope.
 *
 * Un host o slot negativo no satisface
 * isIncludedFocusNavigationScopeOwner(); por ello su childScope no participa.
 *
 * Esta fase no ordena: solo decide pertenencia antes de materializar la
 * secuencia.
 */
function collectReachableRadioCandidates(
  scope: FocusNavigationScope,
  result:
    DiscoveredFocusElement[]
): void {
  for (
    const entry
    of scope.discovered
  ) {
    if (
      isMaterializedSequentialCandidate(
        entry
      )
    ) {
      result.push(
        entry
      );
    }

    if (
      entry.childScope &&
      isIncludedFocusNavigationScopeOwner(
        entry
      )
    ) {
      collectReachableRadioCandidates(
        entry.childScope,
        result
      );
    }
  }
}

/*
 * Radio se resuelve después de conocer alcanzabilidad, pero antes de comparar
 * valores positivos o aplanar scopes. Así un candidato dentro de un owner
 * excluido no puede suprimir al representante que sí llegará a FocusScope.
 */
function applyRadioGroupReduction(
  rootScope: FocusNavigationScope
): void {
  const candidates:
    DiscoveredFocusElement[] =
    [];

  collectReachableRadioCandidates(
    rootScope,
    candidates
  );

  const representatives =
    new Set(
      reduceCollectedRadioGroups(
        candidates.map(
          (entry) =>
            entry.element
        )
      )
    );

  for (
    const entry
    of candidates
  ) {
    if (
      !representatives.has(
        entry.element
      )
    ) {
      entry.isRadioRepresentative =
        false;
    }
  }
}

/*
 * Solo esta función ordena, y lo hace dentro de un único scope.
 *
 * Los valores positivos aparecen primero por valor ascendente. Los empates,
 * los ceros y los valores null conservan discoveryIndex, que representa el
 * orden estructural observado dentro de ese mismo scope.
 *
 * La pertenencia de un owner se decide mediante
 * isIncludedFocusNavigationScopeOwner(). Una entrada ordinaria negativa queda
 * fuera del orden sin controlar la continuidad de otras entradas del scope.
 */
function getOrderedScopeEntries(
  scope: FocusNavigationScope
): DiscoveredFocusElement[] {
  const positive:
    DiscoveredFocusElement[] =
    [];

  const natural:
    DiscoveredFocusElement[] =
    [];

  for (
    const entry
    of scope.discovered
  ) {
    const participates =
      isMaterializedSequentialCandidate(
        entry
      ) ||
      isIncludedFocusNavigationScopeOwner(
        entry
      );

    if (!participates) {
      continue;
    }

    if (
      entry.tabIndexValue !== null &&
      entry.tabIndexValue > 0n
    ) {
      positive.push(
        entry
      );

      continue;
    }

    natural.push(
      entry
    );
  }

  positive.sort(
    (
      left,
      right
    ) => {
      const leftTabIndex =
        left.tabIndexValue ?? 0n;

      const rightTabIndex =
        right.tabIndexValue ?? 0n;

      if (
        leftTabIndex <
        rightTabIndex
      ) {
        return -1;
      }

      if (
        leftTabIndex >
        rightTabIndex
      ) {
        return 1;
      }

      return (
        left.discoveryIndex -
        right.discoveryIndex
      );
    }
  );

  return [
    ...positive,
    ...natural,
  ];
}

/*
 * Un owner no candidato se sustituye por su scope interno. Cuando también es
 * candidato, permanece primero y su scope se inserta inmediatamente después.
 *
 * activeScopes protege la utilidad frente a relaciones de distribución
 * inesperadas sin convertir una anomalía estructural en recursión infinita.
 */
function flattenFocusNavigationScope(
  scope: FocusNavigationScope,
  activeScopes:
    Set<FocusNavigationScope>
): HTMLElement[] {
  if (
    activeScopes.has(scope)
  ) {
    return [];
  }

  activeScopes.add(scope);

  const result:
    HTMLElement[] =
    [];

  for (
    const entry
    of getOrderedScopeEntries(
      scope
    )
  ) {
    if (
      isMaterializedSequentialCandidate(
        entry
      )
    ) {
      result.push(
        entry.element
      );
    }

    if (entry.childScope) {
      result.push(
        ...flattenFocusNavigationScope(
          entry.childScope,
          activeScopes
        )
      );
    }
  }

  activeScopes.delete(scope);

  return result;
}

/**
 * Recoge descendientes elegibles en el orden secuencial soportado.
 *
 * La secuencia:
 *
 * - conserva hosts y slots como fronteras;
 * - reduce grupos radio antes de ordenar;
 * - aplica tabindex positivo solo dentro del scope propietario;
 * - aplana scopes después del orden local;
 * - excluye siempre al contenedor.
 *
 * No cruza documentos, no observa shadow roots cerrados y no reconstruye el
 * trigger dinámico de un popover HTML nativo.
 */
export function collectComposedFocusCandidates(
  container: HTMLElement
): HTMLElement[] {
  const rootScope =
    createContainerFocusNavigationScope();

  const state: FocusDiscoveryState = {
    ownerDocument:
      container.ownerDocument,

    visited:
      new Set<Node>(),

    nextDiscoveryIndex:
      0,
  };

  discoverContainerContents(
    container,
    rootScope,
    state
  );

  applyRadioGroupReduction(
    rootScope
  );

  return flattenFocusNavigationScope(
    rootScope,
    new Set<
      FocusNavigationScope
    >()
  );
}
