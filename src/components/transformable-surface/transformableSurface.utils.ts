import type {
  TransformableSurfaceBounds,
  TransformableSurfacePoint,
  TransformableSurfaceSize,
  TransformableSurfaceTransform,
} from "./transformableSurface.types";

const TRANSFORM_EPSILON = 0.0001;

export interface TransformableSurfaceConstraintOptions {
  transform: TransformableSurfaceTransform;

  viewportSize: TransformableSurfaceSize;
  contentSize: TransformableSurfaceSize;

  minScale: number;
  maxScale: number;

  bounds: TransformableSurfaceBounds;
  boundsPadding?: number;
  centerContent?: boolean;
}

export interface TransformableSurfaceZoomOptions {
  transform: TransformableSurfaceTransform;

  nextScale: number;
  origin: TransformableSurfacePoint;

  viewportSize: TransformableSurfaceSize;

  minScale: number;
  maxScale: number;
}

export interface TransformableSurfaceAxisBounds {
  min: number;
  max: number;
}

export function clampNumber(
  value: number,
  minimum: number,
  maximum: number
): number {
  const safeMinimum = Math.min(minimum, maximum);
  const safeMaximum = Math.max(minimum, maximum);

  return Math.min(
    safeMaximum,
    Math.max(safeMinimum, value)
  );
}

export function toFiniteNumber(
  value: number,
  fallback = 0
): number {
  return Number.isFinite(value)
    ? value
    : fallback;
}

export function normalizeSurfacePoint(
  point?: Partial<TransformableSurfacePoint> | null
): TransformableSurfacePoint {
  return {
    x: toFiniteNumber(point?.x ?? 0),
    y: toFiniteNumber(point?.y ?? 0),
  };
}

export function normalizeSurfaceSize(
  size?: Partial<TransformableSurfaceSize> | null
): TransformableSurfaceSize {
  return {
    width: Math.max(
      0,
      toFiniteNumber(size?.width ?? 0)
    ),
    height: Math.max(
      0,
      toFiniteNumber(size?.height ?? 0)
    ),
  };
}

export function normalizeScaleRange(
  minScale: number,
  maxScale: number
): {
  minScale: number;
  maxScale: number;
} {
  const normalizedMinimum = Math.max(
    TRANSFORM_EPSILON,
    toFiniteNumber(minScale, 1)
  );

  const normalizedMaximum = Math.max(
    normalizedMinimum,
    toFiniteNumber(maxScale, normalizedMinimum)
  );

  return {
    minScale: normalizedMinimum,
    maxScale: normalizedMaximum,
  };
}

export function clampSurfaceScale(
  scale: number,
  minScale: number,
  maxScale: number
): number {
  const range = normalizeScaleRange(
    minScale,
    maxScale
  );

  return clampNumber(
    toFiniteNumber(scale, range.minScale),
    range.minScale,
    range.maxScale
  );
}

export function normalizeSurfaceTransform(
  transform?: Partial<TransformableSurfaceTransform> | null,
  options?: {
    minScale?: number;
    maxScale?: number;
  }
): TransformableSurfaceTransform {
  const minScale = options?.minScale ?? 1;
  const maxScale = options?.maxScale ?? 4;

  return {
    scale: clampSurfaceScale(
      transform?.scale ?? minScale,
      minScale,
      maxScale
    ),
    position: normalizeSurfacePoint(
      transform?.position
    ),
  };
}

export function addSurfacePoints(
  first: TransformableSurfacePoint,
  second: TransformableSurfacePoint
): TransformableSurfacePoint {
  return {
    x: first.x + second.x,
    y: first.y + second.y,
  };
}

export function subtractSurfacePoints(
  first: TransformableSurfacePoint,
  second: TransformableSurfacePoint
): TransformableSurfacePoint {
  return {
    x: first.x - second.x,
    y: first.y - second.y,
  };
}

export function multiplySurfacePoint(
  point: TransformableSurfacePoint,
  multiplier: number
): TransformableSurfacePoint {
  return {
    x: point.x * multiplier,
    y: point.y * multiplier,
  };
}

export function getSurfacePointDistance(
  first: TransformableSurfacePoint,
  second: TransformableSurfacePoint
): number {
  return Math.hypot(
    second.x - first.x,
    second.y - first.y
  );
}

export function getSurfacePointMidpoint(
  first: TransformableSurfacePoint,
  second: TransformableSurfacePoint
): TransformableSurfacePoint {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

export function getPointerEventPoint(
  event: Pick<PointerEvent, "clientX" | "clientY">
): TransformableSurfacePoint {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

export function getRelativeSurfacePoint(
  point: TransformableSurfacePoint,
  viewportRect: Pick<
    DOMRect,
    "left" | "top"
  >
): TransformableSurfacePoint {
  return {
    x: point.x - viewportRect.left,
    y: point.y - viewportRect.top,
  };
}

export function getCenteredSurfacePoint(
  point: TransformableSurfacePoint,
  viewportSize: TransformableSurfaceSize
): TransformableSurfacePoint {
  return {
    x: point.x - viewportSize.width / 2,
    y: point.y - viewportSize.height / 2,
  };
}

export function getScaledSurfaceSize(
  contentSize: TransformableSurfaceSize,
  scale: number
): TransformableSurfaceSize {
  const safeSize =
    normalizeSurfaceSize(contentSize);

  const safeScale = Math.max(
    0,
    toFiniteNumber(scale, 1)
  );

  return {
    width: safeSize.width * safeScale,
    height: safeSize.height * safeScale,
  };
}

export function getMinimumCoverScale(
  viewportSize: TransformableSurfaceSize,
  contentSize: TransformableSurfaceSize
): number {
  const viewport =
    normalizeSurfaceSize(viewportSize);

  const content =
    normalizeSurfaceSize(contentSize);

  if (
    viewport.width <= 0 ||
    viewport.height <= 0 ||
    content.width <= 0 ||
    content.height <= 0
  ) {
    return 1;
  }

  return Math.max(
    viewport.width / content.width,
    viewport.height / content.height
  );
}

export function getMinimumContainScale(
  viewportSize: TransformableSurfaceSize,
  contentSize: TransformableSurfaceSize
): number {
  const viewport =
    normalizeSurfaceSize(viewportSize);

  const content =
    normalizeSurfaceSize(contentSize);

  if (
    viewport.width <= 0 ||
    viewport.height <= 0 ||
    content.width <= 0 ||
    content.height <= 0
  ) {
    return 1;
  }

  return Math.min(
    viewport.width / content.width,
    viewport.height / content.height
  );
}

/**
 * Devuelve los límites de traslación de un eje.
 *
 * El contenido se considera centrado en el viewport antes de aplicar
 * `position`. Por eso los límites son simétricos alrededor de cero.
 */
export function getSurfaceAxisBounds(
  viewportLength: number,
  scaledContentLength: number,
  options?: {
    bounds?: TransformableSurfaceBounds;
    padding?: number;
    centerContent?: boolean;
  }
): TransformableSurfaceAxisBounds {
  const bounds = options?.bounds ?? "contain";
  const padding = Math.max(
    0,
    toFiniteNumber(options?.padding ?? 0)
  );

  const centerContent =
    options?.centerContent ?? true;

  const safeViewportLength = Math.max(
    0,
    toFiniteNumber(viewportLength)
  );

  const safeContentLength = Math.max(
    0,
    toFiniteNumber(scaledContentLength)
  );

  if (bounds === "none") {
    return {
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY,
    };
  }

  if (
    safeViewportLength <= 0 ||
    safeContentLength <= 0
  ) {
    return {
      min: 0,
      max: 0,
    };
  }

  if (safeContentLength <= safeViewportLength) {
    if (centerContent) {
      return {
        min: -padding,
        max: padding,
      };
    }

    const freeSpace =
      safeViewportLength -
      safeContentLength;

    return {
      min: -padding,
      max: freeSpace + padding,
    };
  }

  const overflow =
    (safeContentLength -
      safeViewportLength) /
    2;

  return {
    min: -overflow - padding,
    max: overflow + padding,
  };
}

export function constrainSurfacePosition(
  position: TransformableSurfacePoint,
  options: {
    viewportSize: TransformableSurfaceSize;
    contentSize: TransformableSurfaceSize;
    scale: number;
    bounds: TransformableSurfaceBounds;
    boundsPadding?: number;
    centerContent?: boolean;
  }
): TransformableSurfacePoint {
  const safePosition =
    normalizeSurfacePoint(position);

  if (options.bounds === "none") {
    return safePosition;
  }

  const viewport =
    normalizeSurfaceSize(
      options.viewportSize
    );

  const scaledContent =
    getScaledSurfaceSize(
      options.contentSize,
      options.scale
    );

  const xBounds = getSurfaceAxisBounds(
    viewport.width,
    scaledContent.width,
    {
      bounds: options.bounds,
      padding: options.boundsPadding,
      centerContent: options.centerContent,
    }
  );

  const yBounds = getSurfaceAxisBounds(
    viewport.height,
    scaledContent.height,
    {
      bounds: options.bounds,
      padding: options.boundsPadding,
      centerContent: options.centerContent,
    }
  );

  return {
    x: clampNumber(
      safePosition.x,
      xBounds.min,
      xBounds.max
    ),
    y: clampNumber(
      safePosition.y,
      yBounds.min,
      yBounds.max
    ),
  };
}

export function constrainSurfaceTransform({
  transform,
  viewportSize,
  contentSize,
  minScale,
  maxScale,
  bounds,
  boundsPadding = 0,
  centerContent = true,
}: TransformableSurfaceConstraintOptions): TransformableSurfaceTransform {
  const scale = clampSurfaceScale(
    transform.scale,
    minScale,
    maxScale
  );

  const position =
    constrainSurfacePosition(
      transform.position,
      {
        viewportSize,
        contentSize,
        scale,
        bounds,
        boundsPadding,
        centerContent,
      }
    );

  return {
    scale,
    position,
  };
}

/**
 * Calcula la nueva posición necesaria para mantener estable visualmente
 * un punto del viewport mientras cambia la escala.
 *
 * `origin` debe estar expresado en coordenadas locales del viewport.
 */
export function zoomSurfaceAtPoint({
  transform,
  nextScale,
  origin,
  viewportSize,
  minScale,
  maxScale,
}: TransformableSurfaceZoomOptions): TransformableSurfaceTransform {
  const previousScale = clampSurfaceScale(
    transform.scale,
    minScale,
    maxScale
  );

  const resolvedScale = clampSurfaceScale(
    nextScale,
    minScale,
    maxScale
  );

  if (
    Math.abs(
      resolvedScale - previousScale
    ) <= TRANSFORM_EPSILON
  ) {
    return {
      scale: previousScale,
      position: normalizeSurfacePoint(
        transform.position
      ),
    };
  }

  const centeredOrigin =
    getCenteredSurfacePoint(
      normalizeSurfacePoint(origin),
      normalizeSurfaceSize(viewportSize)
    );

  const scaleRatio =
    resolvedScale / previousScale;

  const previousPosition =
    normalizeSurfacePoint(
      transform.position
    );

  return {
    scale: resolvedScale,
    position: {
      x:
        centeredOrigin.x -
        (
          centeredOrigin.x -
          previousPosition.x
        ) *
          scaleRatio,
      y:
        centeredOrigin.y -
        (
          centeredOrigin.y -
          previousPosition.y
        ) *
          scaleRatio,
    },
  };
}

export function getSurfaceViewportCenter(
  viewportSize: TransformableSurfaceSize
): TransformableSurfacePoint {
  const viewport =
    normalizeSurfaceSize(viewportSize);

  return {
    x: viewport.width / 2,
    y: viewport.height / 2,
  };
}

export function areSurfacePointsEqual(
  first: TransformableSurfacePoint,
  second: TransformableSurfacePoint,
  epsilon = TRANSFORM_EPSILON
): boolean {
  return (
    Math.abs(first.x - second.x) <= epsilon &&
    Math.abs(first.y - second.y) <= epsilon
  );
}

export function areSurfaceSizesEqual(
  first: TransformableSurfaceSize,
  second: TransformableSurfaceSize,
  epsilon = TRANSFORM_EPSILON
): boolean {
  return (
    Math.abs(
      first.width - second.width
    ) <= epsilon &&
    Math.abs(
      first.height - second.height
    ) <= epsilon
  );
}

export function areSurfaceTransformsEqual(
  first: TransformableSurfaceTransform,
  second: TransformableSurfaceTransform,
  epsilon = TRANSFORM_EPSILON
): boolean {
  return (
    Math.abs(
      first.scale - second.scale
    ) <= epsilon &&
    areSurfacePointsEqual(
      first.position,
      second.position,
      epsilon
    )
  );
}

export function isSurfaceTransformAtRest(
  transform: TransformableSurfaceTransform,
  options?: {
    restScale?: number;
    restPosition?: TransformableSurfacePoint;
    epsilon?: number;
  }
): boolean {
  const restScale =
    options?.restScale ?? 1;

  const restPosition =
    options?.restPosition ?? {
      x: 0,
      y: 0,
    };

  const epsilon =
    options?.epsilon ??
    TRANSFORM_EPSILON;

  return (
    Math.abs(
      transform.scale -
      restScale
    ) <= epsilon &&
    areSurfacePointsEqual(
      transform.position,
      restPosition,
      epsilon
    )
  );
}