// src/components/tree/tree.types.ts

import type {
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
} from "react";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../helpers/css";

export type TreeNodeId = string | number;

export type TreeSelectionMode = "none" | "single" | "multiple";

export type TreeNodeLoadStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "refreshing"
  | "error";

export type TreeSlot =
  | "root"
  | "group"
  | "item"
  | "row"
  | "toggle"
  | "toggleIcon"
  | "nodeIcon"
  | "label"
  | "actions"
  | "children"
  | "loading"
  | "empty"
  | "error"
  | "retry";

export type TreeStyles = SlotStyleMap<TreeSlot>;

export type TreeSlotProps = SlotPropsMap<TreeSlot>;

export interface TreeNodeLoadState<TNode> {
  status: TreeNodeLoadStatus;
  children: readonly TNode[];
  error: unknown | null;
}

export interface TreeLoadChildrenContext<TNode> {
  node: TNode;
  nodeId: TreeNodeId;
  signal: AbortSignal;
}

export type TreeLoadChildren<TNode> = (
  context: TreeLoadChildrenContext<TNode>
) => Promise<readonly TNode[]>;

export interface TreeNodeRenderState {
  depth: number;

  branch: boolean;
  expanded: boolean;
  selected: boolean;
  focused: boolean;
  disabled: boolean;

  loadStatus: TreeNodeLoadStatus;
  loading: boolean;
  refreshing: boolean;
  loaded: boolean;
  empty: boolean;
  failed: boolean;
}

export interface TreeNodeRenderContext<TNode>
  extends TreeNodeRenderState {
  node: TNode;
  nodeId: TreeNodeId;

  expand: () => Promise<void>;
  collapse: () => void;
  toggle: () => Promise<void>;

  select: () => void;
  focus: () => void;
  activate: () => void;

  reload: () => Promise<void>;
  retry: () => Promise<void>;
}

export interface TreeToggleRenderContext<TNode>
  extends TreeNodeRenderContext<TNode> {
  defaultToggle: ReactNode;
}

export interface TreeLoadingRenderContext<TNode>
  extends TreeNodeRenderContext<TNode> {}

export interface TreeEmptyRenderContext<TNode>
  extends TreeNodeRenderContext<TNode> {}

export interface TreeErrorRenderContext<TNode>
  extends TreeNodeRenderContext<TNode> {
  error: unknown;
}

export interface TreeExpandedChangeContext<TNode> {
  node: TNode;
  nodeId: TreeNodeId;
  expanded: boolean;
}

export interface TreeSelectionChangeContext<TNode> {
  node: TNode;
  nodeId: TreeNodeId;
  selected: boolean;
}

export interface TreeActivationContext<TNode> {
  node: TNode;
  nodeId: TreeNodeId;
}

export interface TreeFocusChangeContext<TNode> {
  node: TNode;
  nodeId: TreeNodeId;
}

export interface TreeNodeKeyDownContext<TNode> {
  event: KeyboardEvent<HTMLElement>;
  node: TNode;
  nodeId: TreeNodeId;
}

export interface TreeApi<TNode> {
  getNode: (nodeId: TreeNodeId) => TNode | undefined;

  getExpandedIds: () => ReadonlySet<TreeNodeId>;
  getSelectedIds: () => ReadonlySet<TreeNodeId>;
  getFocusedId: () => TreeNodeId | null;

  isExpanded: (nodeId: TreeNodeId) => boolean;
  isSelected: (nodeId: TreeNodeId) => boolean;

  getLoadState: (
    nodeId: TreeNodeId
  ) => TreeNodeLoadState<TNode>;

  expand: (nodeId: TreeNodeId) => Promise<void>;
  collapse: (nodeId: TreeNodeId) => void;
  toggle: (nodeId: TreeNodeId) => Promise<void>;

  select: (nodeId: TreeNodeId) => void;
  deselect: (nodeId: TreeNodeId) => void;
  clearSelection: () => void;

  focus: (nodeId: TreeNodeId) => void;

  load: (nodeId: TreeNodeId) => Promise<void>;
  reload: (nodeId: TreeNodeId) => Promise<void>;

  invalidate: (nodeId: TreeNodeId) => void;
  invalidateAll: () => void;

  setChildren: (
    nodeId: TreeNodeId,
    children: readonly TNode[]
  ) => void;
}

export interface TreeProps<TNode>
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onSelect"
  > {
  /**
   * Nodos visibles en el nivel raíz.
   */
  nodes: readonly TNode[];

  /**
   * Obtiene la identidad estable de un nodo.
   */
  getNodeId: (node: TNode) => TreeNodeId;

  /**
   * Obtiene el contenido principal del nodo.
   */
  getNodeLabel: (node: TNode) => ReactNode;

  /**
   * Indica si el nodo puede contener hijos.
   */
  isNodeBranch: (node: TNode) => boolean;

  /**
   * Hijos síncronos conocidos por el consumidor.
   *
   * Si devuelve `undefined`, el tree puede recurrir a `loadChildren`.
   * Si devuelve un arreglo vacío, el nodo se considera cargado y vacío.
   */
  getNodeChildren?: (
    node: TNode
  ) => readonly TNode[] | undefined;

  /**
   * Carga asíncrona de hijos.
   */
  loadChildren?: TreeLoadChildren<TNode>;

  /**
   * Indica si un nodo no puede seleccionarse, activarse o expandirse.
   */
  isNodeDisabled?: (node: TNode) => boolean;

  /**
   * Expansión controlada.
   */
  expandedIds?: ReadonlySet<TreeNodeId>;

  /**
   * Expansión inicial no controlada.
   */
  defaultExpandedIds?: Iterable<TreeNodeId>;

  /**
   * Notifica el conjunto completo de nodos expandidos.
   */
  onExpandedIdsChange?: (
    expandedIds: ReadonlySet<TreeNodeId>
  ) => void;

  /**
   * Notifica el nodo que produjo el cambio de expansión.
   */
  onNodeExpandedChange?: (
    context: TreeExpandedChangeContext<TNode>
  ) => void;

  /**
   * Selección controlada.
   */
  selectedIds?: ReadonlySet<TreeNodeId>;

  /**
   * Selección inicial no controlada.
   */
  defaultSelectedIds?: Iterable<TreeNodeId>;

  /**
   * Comportamiento de selección.
   *
   * @default "single"
   */
  selectionMode?: TreeSelectionMode;

  /**
   * Notifica el conjunto completo de nodos seleccionados.
   */
  onSelectedIdsChange?: (
    selectedIds: ReadonlySet<TreeNodeId>
  ) => void;

  /**
   * Notifica el nodo que produjo el cambio de selección.
   */
  onNodeSelectionChange?: (
    context: TreeSelectionChangeContext<TNode>
  ) => void;

  /**
   * Nodo enfocado de forma controlada.
   */
  focusedId?: TreeNodeId | null;

  /**
   * Nodo enfocado inicialmente.
   */
  defaultFocusedId?: TreeNodeId | null;

  /**
   * Notifica cambios del foco roving.
   */
  onFocusedIdChange?: (
    focusedId: TreeNodeId | null
  ) => void;

  /**
   * Notifica el nodo que recibió foco lógico.
   */
  onNodeFocus?: (
    context: TreeFocusChangeContext<TNode>
  ) => void;

  /**
   * Se ejecuta al activar un nodo.
   *
   * La activación es distinta de la selección. Por ejemplo, un archivo puede
   * seleccionarse con Space y abrirse con Enter o doble clic.
   */
  onNodeActivate?: (
    context: TreeActivationContext<TNode>
  ) => void | Promise<void>;

  /**
   * Permite observar o extender el manejo de teclado del nodo.
   */
  onNodeKeyDown?: (
    context: TreeNodeKeyDownContext<TNode>
  ) => void;

  /**
   * Carga automáticamente los hijos al expandir una rama sin datos conocidos.
   *
   * @default true
   */
  loadOnExpand?: boolean;

  /**
   * Conserva los hijos anteriores mientras se recarga una rama.
   *
   * @default true
   */
  preserveChildrenOnReload?: boolean;

  /**
   * Selecciona el nodo al activarlo.
   *
   * @default true
   */
  selectOnActivate?: boolean;

  /**
   * Expande o contrae una rama al activarla.
   *
   * @default true
   */
  toggleOnBranchActivate?: boolean;

  /**
   * Renderiza el icono o contenido visual anterior a la etiqueta.
   */
  renderNodeIcon?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  /**
   * Renderiza el control de expansión.
   */
  renderToggle?: (
    context: TreeToggleRenderContext<TNode>
  ) => ReactNode;

  /**
   * Renderiza acciones situadas al final de la fila.
   */
  renderNodeActions?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  /**
   * Reemplaza el contenido completo de la fila.
   */
  renderNodeContent?: (
    context: TreeNodeRenderContext<TNode>
  ) => ReactNode;

  /**
   * Renderiza el estado de carga inicial de una rama.
   */
  renderLoading?: (
    context: TreeLoadingRenderContext<TNode>
  ) => ReactNode;

  /**
   * Renderiza el estado vacío de una rama cargada.
   */
  renderEmpty?: (
    context: TreeEmptyRenderContext<TNode>
  ) => ReactNode;

  /**
   * Renderiza el error de carga de una rama.
   */
  renderError?: (
    context: TreeErrorRenderContext<TNode>
  ) => ReactNode;

  /**
   * Contenido cuando no existen nodos raíz.
   */
  emptyContent?: ReactNode;

  /**
   * Personalización visual por slots.
   */
  styles?: TreeStyles;

  /**
   * Props y atributos por slots.
   */
  slotProps?: TreeSlotProps;

  /**
   * API imperativa opcional.
   */
  apiRef?: Ref<TreeApi<TNode>>;
}