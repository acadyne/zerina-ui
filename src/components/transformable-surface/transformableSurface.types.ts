import type {
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
  WheelEvent as ReactWheelEvent,
} from "react";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../helpers/css";

export interface TransformableSurfacePoint {
  x: number;
  y: number;
}

export interface TransformableSurfaceSize {
  width: number;
  height: number;
}

export interface TransformableSurfaceTransform {
  scale: number;
  position: TransformableSurfacePoint;
}

export type TransformableSurfaceGesture =
  | "idle"
  | "panning"
  | "pinching"
  | "wheel";

export type TransformableSurfaceChangeReason =
  | "pan"
  | "pinch"
  | "wheel"
  | "double-click"
  | "double-tap"
  | "reset"
  | "programmatic"
  | "constraint";

export type TransformableSurfaceBounds =
  | "contain"
  | "cover"
  | "none";

export type TransformableSurfaceSlot =
  | "root"
  | "viewport"
  | "content";

export type TransformableSurfaceStyles =
  SlotStyleMap<TransformableSurfaceSlot>;

export type TransformableSurfaceSlotProps =
  SlotPropsMap<TransformableSurfaceSlot>;

export interface TransformableSurfaceChangeContext {
  transform: TransformableSurfaceTransform;
  previousTransform: TransformableSurfaceTransform;
  reason: TransformableSurfaceChangeReason;
  gesture: TransformableSurfaceGesture;
}

export interface TransformableSurfaceGestureContext {
  gesture: Exclude<
    TransformableSurfaceGesture,
    "idle"
  >;

  transform: TransformableSurfaceTransform;
  pointerCount: number;
}

export interface TransformableSurfaceRenderContext {
  transform: TransformableSurfaceTransform;

  scale: number;
  position: TransformableSurfacePoint;

  gesture: TransformableSurfaceGesture;

  isIdle: boolean;
  isPanning: boolean;
  isPinching: boolean;
  isWheelZooming: boolean;

  viewportSize: TransformableSurfaceSize;
  contentSize: TransformableSurfaceSize;

  zoomIn: () => void;
  zoomOut: () => void;

  setScale: (
    scale: number,
    origin?: TransformableSurfacePoint
  ) => void;

  setPosition: (
    position: TransformableSurfacePoint
  ) => void;

  setTransform: (
    transform: TransformableSurfaceTransform
  ) => void;

  reset: () => void;
}

export interface TransformableSurfaceApi {
  getTransform: () => TransformableSurfaceTransform;

  getScale: () => number;

  getPosition: () => TransformableSurfacePoint;

  getGesture: () => TransformableSurfaceGesture;

  getViewportSize: () => TransformableSurfaceSize;

  getContentSize: () => TransformableSurfaceSize;

  zoomIn: (
    origin?: TransformableSurfacePoint
  ) => void;

  zoomOut: (
    origin?: TransformableSurfacePoint
  ) => void;

  setScale: (
    scale: number,
    origin?: TransformableSurfacePoint
  ) => void;

  setPosition: (
    position: TransformableSurfacePoint
  ) => void;

  setTransform: (
    transform: TransformableSurfaceTransform
  ) => void;

  reset: () => void;

  constrain: () => void;

  measure: () => void;
}

export interface TransformableSurfaceProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | "children"
    | "onChange"
    | "onPointerDown"
    | "onPointerMove"
    | "onPointerUp"
    | "onPointerCancel"
    | "onWheel"
    | "style"
    | "className"
  > {
  children?:
    | ReactNode
    | ((
        context: TransformableSurfaceRenderContext
      ) => ReactNode);

  /**
   * Escala controlada.
   */
  scale?: number;

  /**
   * Escala inicial no controlada.
   *
   * @default 1
   */
  defaultScale?: number;

  /**
   * Posición controlada.
   */
  position?: TransformableSurfacePoint;

  /**
   * Posición inicial no controlada.
   *
   * @default { x: 0, y: 0 }
   */
  defaultPosition?: TransformableSurfacePoint;

  /**
   * Escala mínima permitida.
   *
   * @default 1
   */
  minScale?: number;

  /**
   * Escala máxima permitida.
   *
   * @default 4
   */
  maxScale?: number;

  /**
   * Incremento usado por zoomIn y zoomOut.
   *
   * @default 0.5
   */
  scaleStep?: number;

  /**
   * Activa desplazamiento con un puntero.
   *
   * El pan solo tiene efecto cuando el contenido puede desplazarse
   * dentro de los límites configurados.
   *
   * @default true
   */
  panEnabled?: boolean;

  /**
   * Activa pinch-to-zoom con dos punteros.
   *
   * @default true
   */
  pinchEnabled?: boolean;

  /**
   * Activa zoom con rueda o trackpad.
   *
   * @default true
   */
  wheelZoomEnabled?: boolean;

  /**
   * Exige Ctrl o Meta para hacer zoom con rueda.
   *
   * Evita interceptar el scroll normal de una página.
   *
   * @default true
   */
  wheelZoomRequiresModifier?: boolean;

  /**
   * Sensibilidad del zoom por rueda.
   *
   * @default 0.002
   */
  wheelZoomSensitivity?: number;

  /**
   * Activa zoom alternado mediante doble clic.
   *
   * @default true
   */
  doubleClickZoomEnabled?: boolean;

  /**
   * Activa zoom alternado mediante doble toque.
   *
   * @default true
   */
  doubleTapZoomEnabled?: boolean;

  /**
   * Escala usada por doble clic o doble toque.
   *
   * Si la escala actual ya es mayor que minScale,
   * el gesto regresa a minScale.
   *
   * @default 2
   */
  doubleInteractionScale?: number;

  /**
   * Tiempo máximo entre dos toques.
   *
   * @default 280
   */
  doubleTapDelay?: number;

  /**
   * Distancia máxima entre dos toques consecutivos.
   *
   * @default 24
   */
  doubleTapDistance?: number;

  /**
   * Estrategia para limitar la posición.
   *
   * contain:
   * mantiene el contenido dentro del viewport cuando es posible.
   *
   * cover:
   * evita que aparezcan espacios vacíos dentro del viewport.
   *
   * none:
   * permite desplazamiento sin límites.
   *
   * @default "contain"
   */
  bounds?: TransformableSurfaceBounds;

  /**
   * Espacio adicional permitido alrededor de los límites.
   *
   * @default 0
   */
  boundsPadding?: number;

  /**
   * Centra el contenido cuando es menor que el viewport.
   *
   * @default true
   */
  centerContent?: boolean;

  /**
   * Restringe la posición nuevamente al cambiar el tamaño.
   *
   * @default true
   */
  constrainOnResize?: boolean;

  /**
   * Reinicia el estado cuando cambia este valor.
   *
   * Es útil al cambiar de imagen, página o documento.
   */
  resetKey?: string | number;

  /**
   * Desactiva todas las interacciones.
   *
   * @default false
   */
  disabled?: boolean;

  onTransformChange?: (
    context: TransformableSurfaceChangeContext
  ) => void;

  onScaleChange?: (
    scale: number,
    context: TransformableSurfaceChangeContext
  ) => void;

  onPositionChange?: (
    position: TransformableSurfacePoint,
    context: TransformableSurfaceChangeContext
  ) => void;

  onGestureStart?: (
    context: TransformableSurfaceGestureContext
  ) => void;

  onGestureEnd?: (
    context: TransformableSurfaceGestureContext
  ) => void;

  /**
   * Observadores opcionales ejecutados después de la lógica interna.
   */
  onSurfacePointerDown?: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  onSurfacePointerMove?: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  onSurfacePointerUp?: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  onSurfacePointerCancel?: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  onSurfaceWheel?: (
    event: ReactWheelEvent<HTMLDivElement>
  ) => void;

  /**
   * Estilo aplicado al elemento raíz.
   */
  className?: string;
  style?: CSSProperties;

  styles?: TransformableSurfaceStyles;
  slotProps?: TransformableSurfaceSlotProps;

  apiRef?: Ref<TransformableSurfaceApi>;
}