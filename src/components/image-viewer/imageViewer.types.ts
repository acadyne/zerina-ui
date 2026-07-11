import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../helpers/css";
import type {
  TransformableSurfaceApi,
  TransformableSurfaceBounds,
  TransformableSurfaceChangeContext,
  TransformableSurfaceGestureContext,
  TransformableSurfacePoint,
  TransformableSurfaceTransform,
} from "../transformable-surface";

export type ImageViewerFit =
  | "contain"
  | "cover"
  | "natural";

export type ImageViewerSlot =
  | "root"
  | "surface"
  | "image"
  | "controls"
  | "controlButton"
  | "status"
  | "loading"
  | "error"
  | "empty";

export type ImageViewerStyles =
  SlotStyleMap<ImageViewerSlot>;

export type ImageViewerSlotProps =
  SlotPropsMap<ImageViewerSlot>;

export interface ImageViewerLoadContext {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

export interface ImageViewerErrorContext {
  src: string;
  error: unknown;
  retry: () => void;
}

export interface ImageViewerRenderContext {
  src: string;

  transform: TransformableSurfaceTransform;
  scale: number;
  position: TransformableSurfacePoint;

  loading: boolean;
  loaded: boolean;
  failed: boolean;

  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

export interface ImageViewerApi
  extends TransformableSurfaceApi {
  retry: () => void;

  getImageElement: () =>
    | HTMLImageElement
    | null;

  getNaturalSize: () => {
    width: number;
    height: number;
  };
}

export interface ImageViewerProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | "children"
    | "onLoad"
    | "onError"
    | "style"
    | "className"
  > {
  /**
   * URL o recurso de la imagen.
   */
  src?: string | null;

  alt?: string;

  /**
   * Forma inicial de presentar la imagen.
   *
   * contain:
   * limita visualmente la imagen al viewport.
   *
   * cover:
   * cubre el viewport y puede recortar.
   *
   * natural:
   * conserva sus dimensiones naturales.
   *
   * @default "contain"
   */
  fit?: ImageViewerFit;

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
   * Escala mínima.
   *
   * @default 1
   */
  minScale?: number;

  /**
   * Escala máxima.
   *
   * @default 4
   */
  maxScale?: number;

  /**
   * Incremento de los controles de zoom.
   *
   * @default 0.5
   */
  scaleStep?: number;

  /**
   * Estrategia de límites de desplazamiento.
   *
   * @default "contain"
   */
  bounds?: TransformableSurfaceBounds;

  /**
   * Espacio adicional alrededor de los límites.
   *
   * @default 0
   */
  boundsPadding?: number;

  panEnabled?: boolean;
  pinchEnabled?: boolean;

  wheelZoomEnabled?: boolean;
  wheelZoomRequiresModifier?: boolean;

  doubleClickZoomEnabled?: boolean;
  doubleTapZoomEnabled?: boolean;

  /**
   * Escala utilizada por doble clic o doble toque.
   *
   * @default 2
   */
  doubleInteractionScale?: number;

  /**
   * Reinicia la transformación cuando cambia `src`.
   *
   * @default true
   */
  resetOnSourceChange?: boolean;

  /**
   * Muestra controles integrados.
   *
   * @default true
   */
  showControls?: boolean;

  /**
   * Muestra el nivel de zoom.
   *
   * @default true
   */
  showStatus?: boolean;

  /**
   * Contenido personalizado para el botón de acercar.
   */
  zoomInContent?: ReactNode;

  /**
   * Contenido personalizado para el botón de alejar.
   */
  zoomOutContent?: ReactNode;

  /**
   * Contenido personalizado para reset.
   */
  resetContent?: ReactNode;

  /**
   * Etiquetas accesibles de los controles.
   */
  zoomInLabel?: string;
  zoomOutLabel?: string;
  resetLabel?: string;

  /**
   * Contenido cuando no existe `src`.
   */
  emptyContent?: ReactNode;

  /**
   * Render personalizado de carga.
   */
  renderLoading?: (
    context: ImageViewerRenderContext
  ) => ReactNode;

  /**
   * Render personalizado de error.
   */
  renderError?: (
    context: ImageViewerErrorContext
  ) => ReactNode;

  onLoad?: (
    context: ImageViewerLoadContext
  ) => void;

  onError?: (
    context: ImageViewerErrorContext
  ) => void;

  onTransformChange?: (
    context: TransformableSurfaceChangeContext
  ) => void;

  onGestureStart?: (
    context: TransformableSurfaceGestureContext
  ) => void;

  onGestureEnd?: (
    context: TransformableSurfaceGestureContext
  ) => void;

  /**
   * Props nativas aplicadas al elemento `<img>`.
   */
  imageProps?: Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    | "src"
    | "alt"
    | "style"
    | "className"
    | "onLoad"
    | "onError"
  >;

  className?: string;
  style?: CSSProperties;

  styles?: ImageViewerStyles;
  slotProps?: ImageViewerSlotProps;

  apiRef?: Ref<ImageViewerApi>;
}