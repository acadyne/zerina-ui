import {
  forwardRef,
  useImperativeHandle,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { setRef } from "../../core/interaction/events";
import { resolveSlot } from "../../helpers/css";
import { useTransformableSurface } from "./hooks";
import type {
  TransformableSurfaceProps,
  TransformableSurfaceRenderContext,
  TransformableSurfaceSlot,
} from "./transformableSurface.types";

export const TransformableSurface = forwardRef<
  HTMLDivElement,
  TransformableSurfaceProps
>(
  (
    {
      children,

      scale,
      defaultScale = 1,

      position,
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
      keyboardControls = false,
      keyboardPanStep = 40,
      viewportAriaLabel = "Superficie transformable",
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

      onSurfacePointerDown,
      onSurfacePointerMove,
      onSurfacePointerUp,
      onSurfacePointerCancel,
      onSurfaceWheel,
      onSurfaceKeyDown,

      className = "",
      style,

      styles,
      slotProps,

      apiRef,

      ...rest
    },
    forwardedRef
  ) => {
    const surface = useTransformableSurface({
      scale,
      defaultScale,

      position,
      defaultPosition,

      minScale,
      maxScale,
      scaleStep,

      panEnabled,
      pinchEnabled,

      wheelZoomEnabled,
      wheelZoomRequiresModifier,
      wheelZoomSensitivity,

      doubleClickZoomEnabled,
      doubleTapZoomEnabled,
      doubleInteractionScale,
      doubleTapDelay,
      doubleTapDistance,

      bounds,
      boundsPadding,
      centerContent,
      constrainOnResize,

      resetKey,
      disabled,

      onTransformChange,
      onScaleChange,
      onPositionChange,

      onGestureStart,
      onGestureEnd,
    });

    useImperativeHandle(apiRef, () => surface.api, [surface.api]);

    const rootSlot = resolveSlot<TransformableSurfaceSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        "data-ui-transformable-surface": "",
        "data-ui-transformable-surface-disabled": disabled || undefined,
        "data-ui-transformable-surface-gesture": surface.gesture,
        "data-ui-transformable-surface-scale": surface.scale,
        "data-ui-transformable-surface-bounds": bounds,
      },
      baseStyle: {
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      },
    });

    const viewportSlot = resolveSlot<TransformableSurfaceSlot>({
      slot: "viewport",
      styles,
      slotProps,
      baseProps: {
        role: keyboardControls ? "group" : undefined,
        tabIndex: keyboardControls && !disabled ? 0 : undefined,
        "aria-label": keyboardControls ? viewportAriaLabel : undefined,
        "aria-disabled": disabled || undefined,
        "data-ui-transformable-surface-viewport": "",
        "data-gesture": surface.gesture,
        "data-panning": surface.isPanning || undefined,
        "data-pinching": surface.isPinching || undefined,
        "data-wheel-zooming": surface.isWheelZooming || undefined,
      },
      baseStyle: {
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,

        position: "relative",
        display: "grid",
        placeItems: "center",

        overflow: "hidden",
        boxSizing: "border-box",

        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",

        touchAction:
          disabled || (!panEnabled && !pinchEnabled) ? "auto" : "none",

        cursor: disabled
          ? "default"
          : surface.isPanning || surface.isPinching
            ? "grabbing"
            : panEnabled
              ? "grab"
              : "default",

        WebkitTapHighlightColor: "transparent",
      },
    });

    const contentSlot = resolveSlot<TransformableSurfaceSlot>({
      slot: "content",
      styles,
      slotProps,
      baseProps: {
        "data-ui-transformable-surface-content": "",
        "data-gesture": surface.gesture,
      },
      baseStyle: {
        minWidth: 0,
        minHeight: 0,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        boxSizing: "border-box",

        transform: surface.contentTransformStyle.transform,

        transformOrigin: surface.contentTransformStyle.transformOrigin,

        willChange: surface.contentTransformStyle.willChange,

        transition: surface.isIdle
          ? "transform var(--ui-duration-normal) var(--ui-ease-standard)"
          : "none",

        userSelect:
          disabled || (!panEnabled && !pinchEnabled) ? undefined : "none",

        WebkitUserSelect:
          disabled || (!panEnabled && !pinchEnabled) ? undefined : "none",
      },
    });

    const {
      onPointerDown: viewportOnPointerDown,
      onPointerMove: viewportOnPointerMove,
      onPointerUp: viewportOnPointerUp,
      onPointerCancel: viewportOnPointerCancel,
      onLostPointerCapture: viewportOnLostPointerCapture,
      onWheel: viewportOnWheel,
      onDoubleClick: viewportOnDoubleClick,
      onKeyDown: viewportOnKeyDown,
      ...viewportSlotRest
    } = viewportSlot;

    const handlePointerDown = (
      event: PointerEvent<HTMLDivElement>
    ): void => {
      surface.handlePointerDown(event);

      viewportOnPointerDown?.(event);
      onSurfacePointerDown?.(event);
    };

    const handlePointerMove = (
      event: PointerEvent<HTMLDivElement>
    ): void => {
      surface.handlePointerMove(event);

      viewportOnPointerMove?.(event);
      onSurfacePointerMove?.(event);
    };

    const handlePointerUp = (
      event: PointerEvent<HTMLDivElement>
    ): void => {
      surface.handlePointerUp(event);

      viewportOnPointerUp?.(event);
      onSurfacePointerUp?.(event);
    };

    const handlePointerCancel = (
      event: PointerEvent<HTMLDivElement>
    ): void => {
      surface.handlePointerCancel(event);

      viewportOnPointerCancel?.(event);
      onSurfacePointerCancel?.(event);
    };

    const handleLostPointerCapture = (
      event: PointerEvent<HTMLDivElement>
    ): void => {
      surface.handleLostPointerCapture(event);

      viewportOnLostPointerCapture?.(event);
    };

    const handleWheel = (
      event: WheelEvent<HTMLDivElement>
    ): void => {
      viewportOnWheel?.(event);
      onSurfaceWheel?.(event);
    };

    const handleKeyDown = (
      event: KeyboardEvent<HTMLDivElement>
    ): void => {
      if (!keyboardControls || disabled) {
        viewportOnKeyDown?.(event);
        onSurfaceKeyDown?.(event);
        return;
      }

      const currentPosition = surface.position;

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        surface.zoomIn();
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        surface.zoomOut();
      } else if (event.key === "0") {
        event.preventDefault();
        surface.reset();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        surface.setPosition({
          x: currentPosition.x + keyboardPanStep,
          y: currentPosition.y,
        });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        surface.setPosition({
          x: currentPosition.x - keyboardPanStep,
          y: currentPosition.y,
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        surface.setPosition({
          x: currentPosition.x,
          y: currentPosition.y + keyboardPanStep,
        });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        surface.setPosition({
          x: currentPosition.x,
          y: currentPosition.y - keyboardPanStep,
        });
      }

      viewportOnKeyDown?.(event);
      onSurfaceKeyDown?.(event);
    };

    const renderContext: TransformableSurfaceRenderContext = {
      transform: surface.transform,

      scale: surface.scale,
      position: surface.position,

      gesture: surface.gesture,

      isIdle: surface.isIdle,
      isPanning: surface.isPanning,
      isPinching: surface.isPinching,
      isWheelZooming: surface.isWheelZooming,

      viewportSize: surface.viewportSize,
      contentSize: surface.contentSize,

      zoomIn: surface.zoomIn,
      zoomOut: surface.zoomOut,

      setScale: surface.setScale,
      setPosition: surface.setPosition,
      setTransform: surface.setTransform,

      reset: surface.reset,
    };

    const resolvedChildren =
      typeof children === "function" ? children(renderContext) : children;

    return (
      <div
        {...rootSlot}
        {...rest}
        ref={(node) => {
          setRef(forwardedRef, node);
        }}
      >
        <div
          {...viewportSlotRest}
          ref={(node) => {
            setRef(surface.viewportRef, node);
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handleLostPointerCapture}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          onDoubleClick={(event) => {
            surface.handleDoubleClick(event);
            viewportOnDoubleClick?.(event);
          }}
        >
          <div
            {...contentSlot}
            ref={(node) => {
              setRef(surface.contentRef, node);
            }}
          >
            {resolvedChildren}
          </div>
        </div>
      </div>
    );
  }
);

TransformableSurface.displayName = "TransformableSurface";