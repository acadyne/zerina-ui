// src/components/navigation-menu/navigationMenu.types.ts

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
import type {
  TreeLoadChildren,
  TreeNodeId,
  TreeNodeLoadState,
} from "../tree/tree.types";

export type NavigationMenuItemId = TreeNodeId;

export type NavigationMenuOrientation =
  | "horizontal"
  | "vertical";

export type NavigationMenuSemantics =
  | "navigation"
  | "menubar";

export type NavigationMenuRootPlacement =
  | "bottom-start"
  | "bottom"
  | "bottom-end"
  | "top-start"
  | "top"
  | "top-end";

export type NavigationMenuSubmenuPlacement =
  | "right-start"
  | "right"
  | "right-end"
  | "left-start"
  | "left"
  | "left-end";

export type NavigationMenuOpenReason =
  | "click"
  | "hover"
  | "keyboard"
  | "programmatic";

export type NavigationMenuCloseReason =
  | "click"
  | "keyboard"
  | "selection"
  | "escape"
  | "outside"
  | "hover"
  | "programmatic";

export type NavigationMenuSlot =
  | "root"
  | "list"
  | "item"
  | "trigger"
  | "triggerContent"
  | "activeTrigger"
  | "icon"
  | "label"
  | "indicator"
  | "panel"
  | "panelList"
  | "panelItem"
  | "panelItemContent"
  | "panelItemActive"
  | "panelIcon"
  | "panelLabel"
  | "panelIndicator"
  | "loading"
  | "empty"
  | "error"
  | "retry";

export type NavigationMenuStyles =
  SlotStyleMap<NavigationMenuSlot>;

export type NavigationMenuSlotProps =
  SlotPropsMap<NavigationMenuSlot>;

export interface NavigationMenuItemState {
  depth: number;

  branch: boolean;
  open: boolean;
  active: boolean;
  focused: boolean;
  disabled: boolean;

  loading: boolean;
  refreshing: boolean;
  loaded: boolean;
  empty: boolean;
  failed: boolean;
}

export interface NavigationMenuItemRenderContext<TItem>
  extends NavigationMenuItemState {
  item: TItem;
  itemId: NavigationMenuItemId;

  openItem: () => Promise<void>;
  closeItem: () => void;
  toggleItem: () => Promise<void>;

  focusItem: () => void;
  selectItem: () => void;

  reload: () => Promise<void>;
  retry: () => Promise<void>;
}

export interface NavigationMenuIndicatorRenderContext<TItem>
  extends NavigationMenuItemRenderContext<TItem> {
  defaultIndicator: ReactNode;
}

export interface NavigationMenuLoadingRenderContext<TItem>
  extends NavigationMenuItemRenderContext<TItem> { }

export interface NavigationMenuEmptyRenderContext<TItem>
  extends NavigationMenuItemRenderContext<TItem> { }

export interface NavigationMenuErrorRenderContext<TItem>
  extends NavigationMenuItemRenderContext<TItem> {
  error: unknown;
}

export interface NavigationMenuItemSelectContext<TItem> {
  item: TItem;
  itemId: NavigationMenuItemId;
  depth: number;
}

export interface NavigationMenuItemOpenChangeContext<TItem> {
  item: TItem;
  itemId: NavigationMenuItemId;
  depth: number;
  open: boolean;
  reason: NavigationMenuOpenReason | NavigationMenuCloseReason;
}

export interface NavigationMenuItemFocusContext<TItem> {
  item: TItem;
  itemId: NavigationMenuItemId;
  depth: number;
}

export interface NavigationMenuItemKeyDownContext<TItem> {
  event: KeyboardEvent<HTMLElement>;
  item: TItem;
  itemId: NavigationMenuItemId;
  depth: number;
}

export interface NavigationMenuApi<TItem> {
  getItem: (
    itemId: NavigationMenuItemId
  ) => TItem | undefined;

  getOpenPath: () => readonly NavigationMenuItemId[];

  getActiveId: () => NavigationMenuItemId | null;

  getFocusedId: () => NavigationMenuItemId | null;

  getLoadState: (
    itemId: NavigationMenuItemId
  ) => TreeNodeLoadState<TItem>;

  isOpen: (
    itemId: NavigationMenuItemId
  ) => boolean;

  open: (
    itemId: NavigationMenuItemId
  ) => Promise<void>;

  close: (
    itemId: NavigationMenuItemId
  ) => void;

  toggle: (
    itemId: NavigationMenuItemId
  ) => Promise<void>;

  closeFromDepth: (
    depth: number
  ) => void;

  closeAll: () => void;

  focus: (
    itemId: NavigationMenuItemId
  ) => void;

  select: (
    itemId: NavigationMenuItemId
  ) => void;

  load: (
    itemId: NavigationMenuItemId
  ) => Promise<void>;

  reload: (
    itemId: NavigationMenuItemId
  ) => Promise<void>;

  invalidate: (
    itemId: NavigationMenuItemId
  ) => void;

  invalidateAll: () => void;

  setChildren: (
    itemId: NavigationMenuItemId,
    children: readonly TItem[]
  ) => void;
}

export interface NavigationMenuProps<TItem>
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onSelect"
  > {
  /**
   * Elementos del nivel raíz.
   */
  items: readonly TItem[];

  /**
   * Identidad estable del elemento.
   */
  getItemId: (
    item: TItem
  ) => NavigationMenuItemId;

  /**
   * Contenido principal mostrado como etiqueta.
   */
  getItemLabel: (
    item: TItem
  ) => ReactNode;

  /**
   * Indica si el elemento puede contener hijos.
   */
  isItemBranch: (
    item: TItem
  ) => boolean;

  /**
   * Hijos síncronos conocidos.
   *
   * `undefined` significa que todavía no se conocen.
   * `[]` significa que el elemento está cargado y vacío.
   */
  getItemChildren?: (
    item: TItem
  ) => readonly TItem[] | undefined;

  /**
   * Carga asíncrona de hijos en cualquier profundidad.
   */
  loadChildren?: TreeLoadChildren<TItem>;

  /**
   * Indica si el elemento está deshabilitado.
   */
  isItemDisabled?: (
    item: TItem
  ) => boolean;

  /**
   * Orientación del primer nivel.
   *
   * @default "horizontal"
   */
  orientation?: NavigationMenuOrientation;

  /**
   * Semántica ARIA del componente.
   *
   * navigation:
   *   Usa semántica de navegación general. Es el modo recomendado
   *   para navegación de app/sitio con aria-current.
   *
   * menubar:
   *   Usa roles menubar/menu/menuitem. Úsalo solo cuando quieras
   *   comportamiento de menú de aplicación.
   *
   * @default "navigation"
   */
  semantics?: NavigationMenuSemantics;

  /**
   * Ruta abierta controlada.
   *
   * Debe contener como máximo un elemento por profundidad.
   */
  openPath?: readonly NavigationMenuItemId[];

  /**
   * Ruta abierta inicial no controlada.
   */
  defaultOpenPath?: readonly NavigationMenuItemId[];

  /**
   * Notifica la ruta completa actualmente abierta.
   */
  onOpenPathChange?: (
    openPath: readonly NavigationMenuItemId[]
  ) => void;

  /**
   * Notifica el elemento concreto que abrió o cerró.
   */
  onItemOpenChange?: (
    context: NavigationMenuItemOpenChangeContext<TItem>
  ) => void;

  /**
   * Elemento activo controlado.
   *
   * Representa normalmente la página o ruta actual.
   */
  activeId?: NavigationMenuItemId | null;

  /**
   * Elemento activo inicial no controlado.
   */
  defaultActiveId?: NavigationMenuItemId | null;

  /**
   * Notifica cambios del elemento activo.
   */
  onActiveIdChange?: (
    activeId: NavigationMenuItemId | null
  ) => void;

  /**
   * Elemento enfocado de manera controlada.
   */
  focusedId?: NavigationMenuItemId | null;

  /**
   * Elemento enfocado inicialmente.
   */
  defaultFocusedId?: NavigationMenuItemId | null;

  /**
   * Notifica cambios del foco lógico.
   */
  onFocusedIdChange?: (
    focusedId: NavigationMenuItemId | null
  ) => void;

  /**
   * Se ejecuta al activar una hoja o seleccionar explícitamente un elemento.
   */
  onItemSelect?: (
    context: NavigationMenuItemSelectContext<TItem>
  ) => void | Promise<void>;

  /**
   * Notifica foco lógico sobre un elemento.
   */
  onItemFocus?: (
    context: NavigationMenuItemFocusContext<TItem>
  ) => void;

  /**
   * Permite observar o extender el manejo de teclado.
   */
  onItemKeyDown?: (
    context: NavigationMenuItemKeyDownContext<TItem>
  ) => void;

  /**
   * Abre ramas al pasar el puntero.
   *
   * @default true
   */
  openOnHover?: boolean;

  /**
   * Tiempo antes de abrir por hover.
   *
   * @default 120
   */
  hoverOpenDelay?: number;

  /**
   * Tiempo antes de cerrar por hover.
   *
   * @default 1200
   */
  hoverCloseDelay?: number;

  /**
   * Carga hijos automáticamente al abrir.
   *
   * @default true
   */
  loadOnOpen?: boolean;

  /**
   * Conserva hijos visibles durante una recarga.
   *
   * @default true
   */
  preserveChildrenOnReload?: boolean;

  /**
   * Cierra todo el menú después de seleccionar una hoja.
   *
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Marca como activo el elemento seleccionado.
   *
   * @default true
   */
  activateOnSelect?: boolean;

  /**
   * Ubicación de paneles abiertos desde el nivel raíz.
   *
   * @default "bottom-start"
   */
  rootPlacement?: NavigationMenuRootPlacement;

  /**
   * Ubicación preferida de paneles anidados.
   *
   * `FloatingLayer` podrá invertirla si no hay espacio.
   *
   * @default "right-start"
   */
  submenuPlacement?: NavigationMenuSubmenuPlacement;

  /**
   * Separación entre trigger y panel.
   *
   * @default 6
   */
  panelOffset?: number;

  /**
   * Contenido visual anterior a la etiqueta.
   */
  renderItemIcon?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => ReactNode;

  /**
   * Indicador de que un elemento contiene hijos.
   */
  renderIndicator?: (
    context: NavigationMenuIndicatorRenderContext<TItem>
  ) => ReactNode;

  renderItemLeading?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => ReactNode;

  renderItemLabel?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => ReactNode;

  renderItemTrailing?: (
    context: NavigationMenuItemRenderContext<TItem>
  ) => ReactNode;

  /**
   * Estado de carga inicial.
   */
  renderLoading?: (
    context: NavigationMenuLoadingRenderContext<TItem>
  ) => ReactNode;

  /**
   * Estado vacío.
   */
  renderEmpty?: (
    context: NavigationMenuEmptyRenderContext<TItem>
  ) => ReactNode;

  /**
   * Error de carga.
   */
  renderError?: (
    context: NavigationMenuErrorRenderContext<TItem>
  ) => ReactNode;

  /**
   * Mensaje cuando no existen elementos raíz.
   */
  emptyContent?: ReactNode;

  /**
   * Personalización visual por slots.
   */
  styles?: NavigationMenuStyles;

  /**
   * Props y atributos por slots.
   */
  slotProps?: NavigationMenuSlotProps;

  /**
   * API imperativa opcional.
   */
  apiRef?: Ref<NavigationMenuApi<TItem>>;
}