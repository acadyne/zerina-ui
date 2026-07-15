import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  getElementLayoutSize,
  getElementRect,
  getElementSize,
  observeElementSizes,
} from "../../../core/dom";
import type {
  TransformableSurfaceApi,
  TransformableSurfaceBounds,
  TransformableSurfaceChangeContext,
  TransformableSurfaceChangeReason,
  TransformableSurfaceGesture,
  TransformableSurfaceGestureContext,
  TransformableSurfacePoint,
  TransformableSurfaceSize,
  TransformableSurfaceTransform,
} from "../transformableSurface.types";
import {
  addSurfacePoints,
  areSurfaceSizesEqual,
  areSurfaceTransformsEqual,
  clampSurfaceScale,
  constrainSurfaceTransform,
  getPointerEventPoint,
  getRelativeSurfacePoint,
  getSurfacePointDistance,
  getSurfacePointMidpoint,
  getSurfaceViewportCenter,
  normalizeSurfacePoint,
  normalizeSurfaceSize,
  normalizeSurfaceTransform,
  subtractSurfacePoints,
  zoomSurfaceAtPoint,
} from "../transformableSurface.utils";

interface ActivePointer {
  id: number;
  pointerType: string;
  point: TransformableSurfacePoint;
}

interface PanStartState {
  pointerId: number;
  point: TransformableSurfacePoint;
  position: TransformableSurfacePoint;
}

interface PinchStartState {
  distance: number;
  midpoint: TransformableSurfacePoint;
  transform: TransformableSurfaceTransform;
}

interface TapCandidate {
  pointerId: number;
  point: TransformableSurfacePoint;
  startedAt: number;
  moved: boolean;
}

interface LastTap {
  point: TransformableSurfacePoint;
  timestamp: number;
}

export interface UseTransformableSurfaceOptions {
  scale?: number;
  defaultScale?: number;

  position?: TransformableSurfacePoint;
  defaultPosition?: TransformableSurfacePoint;

  minScale?: number;
  maxScale?: number;
  scaleStep?: number;

  panEnabled?: boolean;
  pinchEnabled?: boolean;

  wheelZoomEnabled?: boolean;
  wheelZoomRequiresModifier?: boolean;
  wheelZoomSensitivity?: number;

  doubleClickZoomEnabled?: boolean;
  doubleTapZoomEnabled?: boolean;
  doubleInteractionScale?: number;
  doubleTapDelay?: number;
  doubleTapDistance?: number;

  bounds?: TransformableSurfaceBounds;
  boundsPadding?: number;
  centerContent?: boolean;
  constrainOnResize?: boolean;

  resetKey?: string | number;
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
}

export interface UseTransformableSurfaceResult {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;

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

  contentTransformStyle: React.CSSProperties;

  handlePointerDown: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  handlePointerMove: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  handlePointerUp: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  handlePointerCancel: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  handleLostPointerCapture: (
    event: ReactPointerEvent<HTMLDivElement>
  ) => void;

  handleWheel: (
    event: WheelEvent
  ) => void;

  handleDoubleClick: (
    event: ReactMouseEvent<HTMLDivElement>
  ) => void;

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

  api: TransformableSurfaceApi;
}

function getNow(): number {
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    return performance.now();
  }

  return Date.now();
}

export function useTransformableSurface({
  scale: controlledScale,
  defaultScale = 1,

  position: controlledPosition,
  defaultPosition = {
    x: 0,
    y: 0,
  },

  minScale = 1,
  maxScale = 4,
  scaleStep = 0.5,

  panEnabled = true,
  pinchEnabled = true,

  wheelZoomEnabled = true,
  wheelZoomRequiresModifier = true,
  wheelZoomSensitivity = 0.002,

  doubleClickZoomEnabled = true,
  doubleTapZoomEnabled = true,
  doubleInteractionScale = 2,
  doubleTapDelay = 280,
  doubleTapDistance = 24,

  bounds = "contain",
  boundsPadding = 0,
  centerContent = true,
  constrainOnResize = true,

  resetKey,
  disabled = false,

  onTransformChange,
  onScaleChange,
  onPositionChange,

  onGestureStart,
  onGestureEnd,
}: UseTransformableSurfaceOptions = {}): UseTransformableSurfaceResult {
  const viewportRef =
    useRef<HTMLDivElement | null>(null);

  const contentRef =
    useRef<HTMLDivElement | null>(null);

  const initialTransformRef =
    useRef<TransformableSurfaceTransform>(
      normalizeSurfaceTransform(
        {
          scale: defaultScale,
          position: defaultPosition,
        },
        {
          minScale,
          maxScale,
        }
      )
    );

  const [
    uncontrolledTransform,
    setUncontrolledTransform,
  ] = useState<TransformableSurfaceTransform>(
    initialTransformRef.current
  );

  const [gesture, setGestureState] =
    useState<TransformableSurfaceGesture>(
      "idle"
    );

  const [viewportSize, setViewportSize] =
    useState<TransformableSurfaceSize>({
      width: 0,
      height: 0,
    });

  const [contentSize, setContentSize] =
    useState<TransformableSurfaceSize>({
      width: 0,
      height: 0,
    });

  const transform = useMemo(
    (): TransformableSurfaceTransform => ({
      scale:
        controlledScale ??
        uncontrolledTransform.scale,

      position:
        controlledPosition ??
        uncontrolledTransform.position,
    }),
    [
      controlledPosition,
      controlledScale,
      uncontrolledTransform,
    ]
  );

  const transformRef = useRef(transform);
  const gestureRef = useRef(gesture);
  const viewportSizeRef =
    useRef(viewportSize);
  const contentSizeRef =
    useRef(contentSize);

  transformRef.current = transform;
  gestureRef.current = gesture;
  viewportSizeRef.current = viewportSize;
  contentSizeRef.current = contentSize;

  const activePointersRef = useRef(
    new Map<number, ActivePointer>()
  );

  const panStartRef =
    useRef<PanStartState | null>(null);

  const pinchStartRef =
    useRef<PinchStartState | null>(null);

  const tapCandidateRef =
    useRef<TapCandidate | null>(null);

  const lastTapRef =
    useRef<LastTap | null>(null);

  const wheelEndTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const isScaleControlled =
    controlledScale !== undefined;

  const isPositionControlled =
    controlledPosition !== undefined;

  const getPointerCount = useCallback(
    (): number =>
      activePointersRef.current.size,
    []
  );

  const setGesture = useCallback(
    (
      nextGesture: TransformableSurfaceGesture
    ): void => {
      const previousGesture =
        gestureRef.current;

      if (previousGesture === nextGesture) {
        return;
      }

      const pointerCount =
        getPointerCount();

      if (previousGesture !== "idle") {
        onGestureEnd?.({
          gesture: previousGesture,
          transform: transformRef.current,
          pointerCount,
        });
      }

      gestureRef.current = nextGesture;
      setGestureState(nextGesture);

      if (nextGesture !== "idle") {
        onGestureStart?.({
          gesture: nextGesture,
          transform: transformRef.current,
          pointerCount,
        });
      }
    },
    [
      getPointerCount,
      onGestureEnd,
      onGestureStart,
    ]
  );

  const constrainTransform =
    useCallback(
      (
        nextTransform: TransformableSurfaceTransform
      ): TransformableSurfaceTransform => {
        return constrainSurfaceTransform({
          transform: nextTransform,
          viewportSize:
            viewportSizeRef.current,
          contentSize:
            contentSizeRef.current,
          minScale,
          maxScale,
          bounds,
          boundsPadding,
          centerContent,
        });
      },
      [
        bounds,
        boundsPadding,
        centerContent,
        maxScale,
        minScale,
      ]
    );

  const commitTransform = useCallback(
    (
      nextTransform: TransformableSurfaceTransform,
      reason: TransformableSurfaceChangeReason,
      options?: {
        constrain?: boolean;
      }
    ): void => {
      const previousTransform =
        transformRef.current;

      const normalized =
        normalizeSurfaceTransform(
          nextTransform,
          {
            minScale,
            maxScale,
          }
        );

      const resolvedTransform =
        options?.constrain === false
          ? normalized
          : constrainTransform(normalized);

      if (
        areSurfaceTransformsEqual(
          previousTransform,
          resolvedTransform
        )
      ) {
        return;
      }

      transformRef.current =
        resolvedTransform;

      setUncontrolledTransform(
        (current) => ({
          scale: isScaleControlled
            ? current.scale
            : resolvedTransform.scale,

          position:
            isPositionControlled
              ? current.position
              : resolvedTransform.position,
        })
      );

      const context: TransformableSurfaceChangeContext =
      {
        transform: resolvedTransform,
        previousTransform,
        reason,
        gesture:
          gestureRef.current,
      };

      onTransformChange?.(context);

      if (
        previousTransform.scale !==
        resolvedTransform.scale
      ) {
        onScaleChange?.(
          resolvedTransform.scale,
          context
        );
      }

      if (
        previousTransform.position.x !==
        resolvedTransform.position.x ||
        previousTransform.position.y !==
        resolvedTransform.position.y
      ) {
        onPositionChange?.(
          resolvedTransform.position,
          context
        );
      }
    },
    [
      constrainTransform,
      isPositionControlled,
      isScaleControlled,
      maxScale,
      minScale,
      onPositionChange,
      onScaleChange,
      onTransformChange,
    ]
  );

  const getLocalPoint = useCallback(
    (
      point: TransformableSurfacePoint
    ): TransformableSurfacePoint => {
      const viewport =
        viewportRef.current;

      if (!viewport) {
        return point;
      }

      return getRelativeSurfacePoint(
        point,
        getElementRect(viewport)
      );
    },
    []
  );

  const measure = useCallback((): void => {
    const nextViewportSize =
      normalizeSurfaceSize(
        getElementSize(
          viewportRef.current
        )
      );

    if (
      !areSurfaceSizesEqual(
        viewportSizeRef.current,
        nextViewportSize
      )
    ) {
      viewportSizeRef.current =
        nextViewportSize;

      setViewportSize(
        nextViewportSize
      );
    }

    const nextContentSize =
      normalizeSurfaceSize(
        getElementLayoutSize(
          contentRef.current
        )
      );

    if (
      !areSurfaceSizesEqual(
        contentSizeRef.current,
        nextContentSize
      )
    ) {
      contentSizeRef.current =
        nextContentSize;

      setContentSize(
        nextContentSize
      );
    }
  }, []);

  const constrain = useCallback((): void => {
    commitTransform(
      constrainTransform(
        transformRef.current
      ),
      "constraint"
    );
  }, [
    commitTransform,
    constrainTransform,
  ]);

  const setScale = useCallback(
    (
      nextScale: number,
      origin?: TransformableSurfacePoint
    ): void => {
      const resolvedOrigin =
        origin ??
        getSurfaceViewportCenter(
          viewportSizeRef.current
        );

      const nextTransform =
        zoomSurfaceAtPoint({
          transform:
            transformRef.current,
          nextScale,
          origin: resolvedOrigin,
          viewportSize:
            viewportSizeRef.current,
          minScale,
          maxScale,
        });

      commitTransform(
        nextTransform,
        "programmatic"
      );
    },
    [
      commitTransform,
      maxScale,
      minScale,
    ]
  );

  const setPosition = useCallback(
    (
      nextPosition: TransformableSurfacePoint
    ): void => {
      commitTransform(
        {
          ...transformRef.current,
          position:
            normalizeSurfacePoint(
              nextPosition
            ),
        },
        "programmatic"
      );
    },
    [commitTransform]
  );

  const setTransform = useCallback(
    (
      nextTransform: TransformableSurfaceTransform
    ): void => {
      commitTransform(
        nextTransform,
        "programmatic"
      );
    },
    [commitTransform]
  );

  const zoomIn = useCallback(
    (
      origin?: TransformableSurfacePoint
    ): void => {
      setScale(
        transformRef.current.scale +
        Math.abs(scaleStep),
        origin
      );
    },
    [
      scaleStep,
      setScale,
    ]
  );

  const zoomOut = useCallback(
    (
      origin?: TransformableSurfacePoint
    ): void => {
      setScale(
        transformRef.current.scale -
        Math.abs(scaleStep),
        origin
      );
    },
    [
      scaleStep,
      setScale,
    ]
  );

  const reset = useCallback((): void => {
    commitTransform(
      initialTransformRef.current,
      "reset"
    );
  }, [commitTransform]);

  const resetRef = useRef(reset);

  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  const previousResetKeyRef =
    useRef(resetKey);

  useEffect(() => {
    if (
      Object.is(
        previousResetKeyRef.current,
        resetKey
      )
    ) {
      return;
    }

    previousResetKeyRef.current =
      resetKey;

    resetRef.current();
  }, [resetKey]);

  const toggleInteractionZoom =
    useCallback(
      (
        origin: TransformableSurfacePoint,
        reason:
          | "double-click"
          | "double-tap"
      ): void => {
        const currentScale =
          transformRef.current.scale;

        const resetScale =
          clampSurfaceScale(
            initialTransformRef.current
              .scale,
            minScale,
            maxScale
          );

        const targetScale =
          currentScale >
            resetScale + 0.0001
            ? resetScale
            : clampSurfaceScale(
              doubleInteractionScale,
              minScale,
              maxScale
            );

        if (targetScale === resetScale) {
          commitTransform(
            {
              scale: resetScale,
              position:
                initialTransformRef.current
                  .position,
            },
            reason
          );

          return;
        }

        commitTransform(
          zoomSurfaceAtPoint({
            transform:
              transformRef.current,
            nextScale: targetScale,
            origin,
            viewportSize:
              viewportSizeRef.current,
            minScale,
            maxScale,
          }),
          reason
        );
      },
      [
        commitTransform,
        doubleInteractionScale,
        maxScale,
        minScale,
      ]
    );

  const startPan = useCallback(
    (
      pointer: ActivePointer
    ): void => {
      if (!panEnabled) {
        panStartRef.current = null;
        return;
      }

      panStartRef.current = {
        pointerId: pointer.id,
        point: pointer.point,
        position:
          transformRef.current.position,
      };

      pinchStartRef.current = null;
      setGesture("panning");
    },
    [
      panEnabled,
      setGesture,
    ]
  );

  const startPinch = useCallback((): void => {
    if (!pinchEnabled) {
      return;
    }

    const pointers = Array.from(
      activePointersRef.current.values()
    );

    if (pointers.length < 2) {
      return;
    }

    const first = pointers[0];
    const second = pointers[1];

    const distance =
      getSurfacePointDistance(
        first.point,
        second.point
      );

    if (distance <= 0) {
      return;
    }

    pinchStartRef.current = {
      distance,
      midpoint:
        getSurfacePointMidpoint(
          first.point,
          second.point
        ),
      transform:
        transformRef.current,
    };

    panStartRef.current = null;
    setGesture("pinching");
  }, [
    pinchEnabled,
    setGesture,
  ]);

  const handlePointerDown = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>
    ): void => {
      if (disabled) {
        return;
      }

      const currentTarget =
        event.currentTarget;

      try {
        currentTarget.setPointerCapture(
          event.pointerId
        );
      } catch {
        // El navegador puede rechazar la captura
        // si el puntero ya dejó de estar activo.
      }

      const point = getLocalPoint(
        getPointerEventPoint(
          event.nativeEvent
        )
      );

      const pointer: ActivePointer = {
        id: event.pointerId,
        pointerType:
          event.pointerType,
        point,
      };

      activePointersRef.current.set(
        event.pointerId,
        pointer
      );

      if (
        event.pointerType === "touch"
      ) {
        tapCandidateRef.current = {
          pointerId: event.pointerId,
          point,
          startedAt: getNow(),
          moved: false,
        };
      }

      if (
        activePointersRef.current.size >=
        2 &&
        pinchEnabled
      ) {
        tapCandidateRef.current = null;
        startPinch();
        return;
      }

      if (
        activePointersRef.current.size ===
        1
      ) {
        startPan(pointer);
      }
    },
    [
      disabled,
      getLocalPoint,
      pinchEnabled,
      startPan,
      startPinch,
    ]
  );

  const handlePointerMove = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>
    ): void => {
      if (disabled) {
        return;
      }

      const current =
        activePointersRef.current.get(
          event.pointerId
        );

      if (!current) {
        return;
      }

      const point = getLocalPoint(
        getPointerEventPoint(
          event.nativeEvent
        )
      );

      activePointersRef.current.set(
        event.pointerId,
        {
          ...current,
          point,
        }
      );

      const tapCandidate =
        tapCandidateRef.current;

      if (
        tapCandidate &&
        tapCandidate.pointerId ===
        event.pointerId &&
        getSurfacePointDistance(
          tapCandidate.point,
          point
        ) > 8
      ) {
        tapCandidate.moved = true;
      }

      const pointers = Array.from(
        activePointersRef.current.values()
      );

      if (
        pointers.length >= 2 &&
        pinchEnabled
      ) {
        if (!pinchStartRef.current) {
          startPinch();
        }

        const pinchStart =
          pinchStartRef.current;

        if (!pinchStart) {
          return;
        }

        const first = pointers[0];
        const second = pointers[1];

        const currentDistance =
          getSurfacePointDistance(
            first.point,
            second.point
          );

        if (currentDistance <= 0) {
          return;
        }

        const currentMidpoint =
          getSurfacePointMidpoint(
            first.point,
            second.point
          );

        const scaleRatio =
          currentDistance /
          pinchStart.distance;

        const targetScale =
          pinchStart.transform.scale *
          scaleRatio;

        const zoomed =
          zoomSurfaceAtPoint({
            transform:
              pinchStart.transform,
            nextScale: targetScale,
            origin:
              pinchStart.midpoint,
            viewportSize:
              viewportSizeRef.current,
            minScale,
            maxScale,
          });

        const midpointDelta =
          subtractSurfacePoints(
            currentMidpoint,
            pinchStart.midpoint
          );

        commitTransform(
          {
            scale: zoomed.scale,
            position:
              addSurfacePoints(
                zoomed.position,
                midpointDelta
              ),
          },
          "pinch"
        );

        return;
      }

      const panStart =
        panStartRef.current;

      if (
        !panEnabled ||
        !panStart ||
        panStart.pointerId !==
        event.pointerId
      ) {
        return;
      }

      const delta =
        subtractSurfacePoints(
          point,
          panStart.point
        );

      commitTransform(
        {
          ...transformRef.current,
          position:
            addSurfacePoints(
              panStart.position,
              delta
            ),
        },
        "pan"
      );
    },
    [
      commitTransform,
      disabled,
      getLocalPoint,
      maxScale,
      minScale,
      panEnabled,
      pinchEnabled,
      startPinch,
    ]
  );

  const processDoubleTap =
    useCallback(
      (
        point: TransformableSurfacePoint
      ): void => {
        if (!doubleTapZoomEnabled) {
          return;
        }

        const now = getNow();
        const previousTap =
          lastTapRef.current;

        if (
          previousTap &&
          now - previousTap.timestamp <=
          doubleTapDelay &&
          getSurfacePointDistance(
            previousTap.point,
            point
          ) <= doubleTapDistance
        ) {
          lastTapRef.current = null;

          toggleInteractionZoom(
            point,
            "double-tap"
          );

          return;
        }

        lastTapRef.current = {
          point,
          timestamp: now,
        };
      },
      [
        doubleTapDelay,
        doubleTapDistance,
        doubleTapZoomEnabled,
        toggleInteractionZoom,
      ]
    );

  const finishPointer = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>,
      options?: {
        cancelled?: boolean;
      }
    ): void => {
      const pointerCountBefore =
        activePointersRef.current.size;

      const tapCandidate =
        tapCandidateRef.current;

      const pointer =
        activePointersRef.current.get(
          event.pointerId
        );

      activePointersRef.current.delete(
        event.pointerId
      );

      try {
        if (
          event.currentTarget.hasPointerCapture(
            event.pointerId
          )
        ) {
          event.currentTarget.releasePointerCapture(
            event.pointerId
          );
        }
      } catch {
        // noop
      }

      const remainingPointers =
        Array.from(
          activePointersRef.current.values()
        );

      if (
        !options?.cancelled &&
        pointerCountBefore === 1 &&
        pointer?.pointerType === "touch" &&
        tapCandidate &&
        tapCandidate.pointerId ===
        event.pointerId &&
        !tapCandidate.moved &&
        getNow() -
        tapCandidate.startedAt <=
        doubleTapDelay
      ) {
        processDoubleTap(
          tapCandidate.point
        );
      }

      tapCandidateRef.current = null;

      if (
        remainingPointers.length >= 2 &&
        pinchEnabled
      ) {
        startPinch();
        return;
      }

      if (
        remainingPointers.length === 1 &&
        panEnabled
      ) {
        startPan(
          remainingPointers[0]
        );

        return;
      }

      panStartRef.current = null;
      pinchStartRef.current = null;

      setGesture("idle");
    },
    [
      doubleTapDelay,
      panEnabled,
      pinchEnabled,
      processDoubleTap,
      setGesture,
      startPan,
      startPinch,
    ]
  );

  const handlePointerUp = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>
    ): void => {
      finishPointer(event);
    },
    [finishPointer]
  );

  const handlePointerCancel = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>
    ): void => {
      finishPointer(event, {
        cancelled: true,
      });
    },
    [finishPointer]
  );

  const handleLostPointerCapture =
    useCallback(
      (
        event: ReactPointerEvent<HTMLDivElement>
      ): void => {
        if (
          !activePointersRef.current.has(
            event.pointerId
          )
        ) {
          return;
        }

        finishPointer(event, {
          cancelled: true,
        });
      },
      [finishPointer]
    );

  const handleWheel = useCallback(
    (
      event: WheelEvent
    ): void => {
      if (
        disabled ||
        !wheelZoomEnabled
      ) {
        return;
      }

      if (
        wheelZoomRequiresModifier &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        return;
      }

      event.preventDefault();

      const origin = getLocalPoint({
        x: event.clientX,
        y: event.clientY,
      });

      const factor = Math.exp(
        -event.deltaY *
        wheelZoomSensitivity
      );

      const nextScale =
        transformRef.current.scale *
        factor;

      if (
        gestureRef.current !== "wheel"
      ) {
        setGesture("wheel");
      }

      commitTransform(
        zoomSurfaceAtPoint({
          transform:
            transformRef.current,
          nextScale,
          origin,
          viewportSize:
            viewportSizeRef.current,
          minScale,
          maxScale,
        }),
        "wheel"
      );

      if (
        wheelEndTimerRef.current !== null
      ) {
        clearTimeout(
          wheelEndTimerRef.current
        );
      }

      wheelEndTimerRef.current =
        setTimeout(() => {
          wheelEndTimerRef.current = null;

          if (
            activePointersRef.current
              .size === 0
          ) {
            setGesture("idle");
          }
        }, 120);
    },
    [
      commitTransform,
      disabled,
      getLocalPoint,
      maxScale,
      minScale,
      setGesture,
      wheelZoomEnabled,
      wheelZoomRequiresModifier,
      wheelZoomSensitivity,
    ]
  );

  useEffect(() => {
    const viewport =
      viewportRef.current;

    if (!viewport) {
      return;
    }

    const listener = (
      event: WheelEvent
    ): void => {
      handleWheel(event);
    };

    viewport.addEventListener(
      "wheel",
      listener,
      {
        passive: false,
      }
    );

    return () => {
      viewport.removeEventListener(
        "wheel",
        listener
      );
    };
  }, [handleWheel]);

  const handleDoubleClick = useCallback(
    (
      event: ReactMouseEvent<HTMLDivElement>
    ): void => {
      if (
        disabled ||
        !doubleClickZoomEnabled
      ) {
        return;
      }

      event.preventDefault();

      toggleInteractionZoom(
        getLocalPoint({
          x: event.clientX,
          y: event.clientY,
        }),
        "double-click"
      );
    },
    [
      disabled,
      doubleClickZoomEnabled,
      getLocalPoint,
      toggleInteractionZoom,
    ]
  );

  useEffect(() => {
    const nodes = [
      viewportRef.current,
      contentRef.current,
    ].filter(
      (
        node
      ): node is HTMLDivElement =>
        node !== null
    );

    if (nodes.length === 0) {
      return;
    }

    measure();

    return observeElementSizes(
      nodes,
      () => {
        measure();

        if (constrainOnResize) {
          requestAnimationFrame(() => {
            constrain();
          });
        }
      }
    );
  }, [
    constrain,
    constrainOnResize,
    measure,
  ]);

  useEffect(() => {
    if (!constrainOnResize) {
      return;
    }

    constrain();
  }, [
    constrain,
    constrainOnResize,
    contentSize,
    viewportSize,
  ]);

  useEffect(() => {
    return () => {
      if (
        wheelEndTimerRef.current !== null
      ) {
        clearTimeout(
          wheelEndTimerRef.current
        );
      }

      activePointersRef.current.clear();
    };
  }, []);

  const contentTransformStyle =
    useMemo<React.CSSProperties>(
      () => ({
        transform: `translate3d(${transform.position.x}px, ${transform.position.y}px, 0) scale(${transform.scale})`,
        transformOrigin: "center center",
        willChange:
          gesture === "idle"
            ? undefined
            : "transform",
      }),
      [
        gesture,
        transform.position.x,
        transform.position.y,
        transform.scale,
      ]
    );

  const api = useMemo<
    TransformableSurfaceApi
  >(
    () => ({
      getTransform: () =>
        transformRef.current,

      getScale: () =>
        transformRef.current.scale,

      getPosition: () =>
        transformRef.current.position,

      getGesture: () =>
        gestureRef.current,

      getViewportSize: () =>
        viewportSizeRef.current,

      getContentSize: () =>
        contentSizeRef.current,

      zoomIn,
      zoomOut,

      setScale,
      setPosition,
      setTransform,

      reset,
      constrain,
      measure,
    }),
    [
      constrain,
      measure,
      reset,
      setPosition,
      setScale,
      setTransform,
      zoomIn,
      zoomOut,
    ]
  );

  return {
    viewportRef,
    contentRef,

    transform,
    scale: transform.scale,
    position: transform.position,

    gesture,

    isIdle: gesture === "idle",
    isPanning: gesture === "panning",
    isPinching: gesture === "pinching",
    isWheelZooming:
      gesture === "wheel",

    viewportSize,
    contentSize,

    contentTransformStyle,

    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,

    handleWheel,
    handleDoubleClick,

    zoomIn,
    zoomOut,

    setScale,
    setPosition,
    setTransform,

    reset,
    constrain,
    measure,

    api,
  };
}