import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type ReactElement,
} from "react";
import { resolveSlot } from "../../helpers/css";
import {
  TransformableSurface,
  type TransformableSurfaceApi,
  type TransformableSurfaceTransform,
} from "../transformable-surface";
import type {
  ImageViewerApi,
  ImageViewerErrorContext,
  ImageViewerProps,
  ImageViewerRenderContext,
  ImageViewerSlot,
} from "./imageViewer.types";
import { setRef } from "../../core/interaction/events";

const EMPTY_TRANSFORM: TransformableSurfaceTransform = {
  scale: 1,
  position: {
    x: 0,
    y: 0,
  },
};

function getImageFitStyle(
  fit: NonNullable<ImageViewerProps["fit"]>
): React.CSSProperties {
  switch (fit) {
    case "cover":
      return {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      };

    case "natural":
      return {
        width: "auto",
        height: "auto",
        maxWidth: "none",
        maxHeight: "none",
        objectFit: "contain",
      };

    case "contain":
    default:
      return {
        width: "auto",
        height: "auto",
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
      };
  }
}

export const ImageViewer = forwardRef<
  HTMLDivElement,
  ImageViewerProps
>(
  (
    {
      src,
      alt = "",

      fit = "contain",

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

      bounds = "contain",
      boundsPadding = 0,

      panEnabled = true,
      pinchEnabled = true,

      wheelZoomEnabled = true,
      wheelZoomRequiresModifier = true,

      doubleClickZoomEnabled = true,
      doubleTapZoomEnabled = true,
      doubleInteractionScale = 2,

      resetOnSourceChange = true,

      showControls = true,
      showStatus = true,

      zoomInContent = "+",
      zoomOutContent = "−",
      resetContent = "1:1",

      zoomInLabel = "Acercar imagen",
      zoomOutLabel = "Alejar imagen",
      resetLabel = "Restablecer imagen",

      emptyContent = "No hay imagen disponible.",

      renderLoading,
      renderError,

      onLoad,
      onError,

      onTransformChange,
      onGestureStart,
      onGestureEnd,

      imageProps,

      className = "",
      style,

      styles,
      slotProps,

      apiRef,

      ...rest
    },
    forwardedRef
  ) => {
    const surfaceApiRef =
      useRef<TransformableSurfaceApi>(null);

    const imageRef =
      useRef<HTMLImageElement | null>(null);

    const transformRef =
      useRef<TransformableSurfaceTransform>(
        EMPTY_TRANSFORM
      );

    const naturalSizeRef = useRef({
      width: 0,
      height: 0,
    });

    const [transform, setTransform] =
      useState<TransformableSurfaceTransform>(
        () => ({
          scale:
            scale ??
            defaultScale,
          position:
            position ??
            defaultPosition,
        })
      );

    const [loading, setLoading] =
      useState(Boolean(src));

    const [loaded, setLoaded] =
      useState(false);

    const [error, setError] =
      useState<unknown>(null);

    const [retryKey, setRetryKey] =
      useState(0);

    const failed = error !== null;

    useEffect(() => {
      setLoading(Boolean(src));
      setLoaded(false);
      setError(null);

      naturalSizeRef.current = {
        width: 0,
        height: 0,
      };
    }, [src]);

    const retry = useCallback((): void => {
      if (!src) {
        return;
      }

      setError(null);
      setLoaded(false);
      setLoading(true);
      setRetryKey((current) => current + 1);
    }, [src]);

    const zoomIn = useCallback((): void => {
      surfaceApiRef.current?.zoomIn();
    }, []);

    const zoomOut = useCallback((): void => {
      surfaceApiRef.current?.zoomOut();
    }, []);

    const reset = useCallback((): void => {
      surfaceApiRef.current?.reset();
    }, []);

    useImperativeHandle(
      apiRef,
      (): ImageViewerApi => ({
        getTransform: () =>
          surfaceApiRef.current?.getTransform() ??
          transformRef.current,

        getScale: () =>
          surfaceApiRef.current?.getScale() ??
          transformRef.current.scale,

        getPosition: () =>
          surfaceApiRef.current?.getPosition() ??
          transformRef.current.position,

        getGesture: () =>
          surfaceApiRef.current?.getGesture() ??
          "idle",

        getViewportSize: () =>
          surfaceApiRef.current?.getViewportSize() ?? {
            width: 0,
            height: 0,
          },

        getContentSize: () =>
          surfaceApiRef.current?.getContentSize() ?? {
            width: 0,
            height: 0,
          },

        zoomIn: (origin) => {
          surfaceApiRef.current?.zoomIn(origin);
        },

        zoomOut: (origin) => {
          surfaceApiRef.current?.zoomOut(origin);
        },

        setScale: (
          nextScale,
          origin
        ) => {
          surfaceApiRef.current?.setScale(
            nextScale,
            origin
          );
        },

        setPosition: (nextPosition) => {
          surfaceApiRef.current?.setPosition(
            nextPosition
          );
        },

        setTransform: (
          nextTransform
        ) => {
          surfaceApiRef.current?.setTransform(
            nextTransform
          );
        },

        reset: () => {
          surfaceApiRef.current?.reset();
        },

        constrain: () => {
          surfaceApiRef.current?.constrain();
        },

        measure: () => {
          surfaceApiRef.current?.measure();
        },

        retry,

        getImageElement: () =>
          imageRef.current,

        getNaturalSize: () =>
          naturalSizeRef.current,
      }),
      [retry]
    );

    const renderContext =
      useMemo<ImageViewerRenderContext>(
        () => ({
          src: src ?? "",

          transform,
          scale: transform.scale,
          position: transform.position,

          loading,
          loaded,
          failed,

          zoomIn,
          zoomOut,
          reset,
        }),
        [
          failed,
          loaded,
          loading,
          reset,
          src,
          transform,
          zoomIn,
          zoomOut,
        ]
      );

    const rootSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "root",
        styles,
        slotProps,
        className,
        style,
        baseProps: {
          "data-ui-image-viewer": "",
          "data-ui-image-viewer-loading":
            loading || undefined,
          "data-ui-image-viewer-loaded":
            loaded || undefined,
          "data-ui-image-viewer-error":
            failed || undefined,
          "data-ui-image-viewer-empty":
            !src || undefined,
          "data-ui-image-viewer-fit":
            fit,
        },
        baseStyle: {
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          background:
            "var(--ui-surface)",
        },
      });

    const surfaceSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "surface",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-surface":
            "",
        },
        baseStyle: {
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
        },
      });

    const imageSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "image",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-image":
            "",
        },
        baseStyle: {
          display: "block",
          flexShrink: 0,

          userSelect: "none",
          WebkitUserSelect: "none",

          pointerEvents: "none",

          ...getImageFitStyle(fit),
        },
      });

    const controlsSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "controls",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-controls":
            "",
        },
        baseStyle: {
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          zIndex: 2,

          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",

          touchAction: "manipulation",
        },
      });

    const controlButtonSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "controlButton",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-control":
            "",
        },
        baseStyle: {
          minWidth: 36,
          minHeight: 36,

          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",

          padding: "0.4rem",

          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "var(--ui-radius-md)",

          background:
            "color-mix(in srgb, var(--ui-surface) 88%, transparent)",
          color: "var(--ui-text)",
          boxShadow:
            "var(--ui-shadow-sm)",

          cursor: "pointer",
          font: "inherit",
          fontWeight: 700,

          backdropFilter: "blur(8px)",
          WebkitBackdropFilter:
            "blur(8px)",

          touchAction: "manipulation",
          WebkitTapHighlightColor:
            "transparent",
        },
      });

    const statusSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "status",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-status":
            "",
          "aria-live": "polite",
        },
        baseStyle: {
          position: "absolute",
          left: "0.75rem",
          bottom: "0.75rem",
          zIndex: 2,

          padding: "0.3rem 0.5rem",

          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "var(--ui-radius-sm)",

          background:
            "color-mix(in srgb, var(--ui-surface) 88%, transparent)",
          color: "var(--ui-text)",

          boxShadow:
            "var(--ui-shadow-sm)",

          fontSize:
            "var(--ui-font-size-xs)",
          fontVariantNumeric:
            "tabular-nums",

          pointerEvents: "none",

          backdropFilter: "blur(8px)",
          WebkitBackdropFilter:
            "blur(8px)",
        },
      });

    const loadingSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "loading",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-loading-content":
            "",
          role: "status",
          "aria-live": "polite",
        },
        baseStyle: {
          position: "absolute",
          inset: 0,
          zIndex: 1,

          display: "grid",
          placeItems: "center",

          padding: "1rem",

          color:
            "var(--ui-text-muted)",
          textAlign: "center",

          pointerEvents: "none",
        },
      });

    const errorSlot =
      resolveSlot<ImageViewerSlot>({
        slot: "error",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-error-content":
            "",
          role: "alert",
        },
        baseStyle: {
          position: "absolute",
          inset: 0,
          zIndex: 1,

          display: "grid",
          placeItems: "center",

          padding: "1rem",

          color: "var(--ui-danger)",
          textAlign: "center",
        },
      });

    const emptySlot =
      resolveSlot<ImageViewerSlot>({
        slot: "empty",
        styles,
        slotProps,
        baseProps: {
          "data-ui-image-viewer-empty-content":
            "",
        },
        baseStyle: {
          position: "absolute",
          inset: 0,

          display: "grid",
          placeItems: "center",

          padding: "1rem",

          color:
            "var(--ui-text-muted)",
          textAlign: "center",
        },
      });

    const {
      onClick:
      controlButtonOnClick,
      ...controlButtonRest
    } = controlButtonSlot;

    const renderControl = (
      key: string,
      label: string,
      content: React.ReactNode,
      action: () => void,
      disabled: boolean
    ): ReactElement => {
      return (
        <button
          {...controlButtonRest}
          key={key}
          type="button"
          aria-label={label}
          disabled={disabled}
          data-disabled={
            disabled || undefined
          }
          onClick={(event) => {
            controlButtonOnClick?.(event);

            if (
              event.defaultPrevented ||
              disabled
            ) {
              return;
            }

            action();
          }}
          style={{
            ...controlButtonRest.style,
            opacity: disabled
              ? 0.5
              : controlButtonRest.style
                ?.opacity,
            cursor: disabled
              ? "not-allowed"
              : controlButtonRest.style
                ?.cursor,
          }}
        >
          {content}
        </button>
      );
    };

    const errorContext:
      ImageViewerErrorContext = {
      src: src ?? "",
      error,
      retry,
    };

    const resolvedResetKey =
      resetOnSourceChange
        ? `${src ?? ""}:${retryKey}`
        : retryKey;

    const mergedImageProps =
      imageProps as ImgHTMLAttributes<HTMLImageElement> | undefined;

    return (
      <div
        {...rootSlot}
        {...rest}
        ref={(node) => {
          setRef(
            forwardedRef,
            node
          );
        }}
      >
        {src ? (
          <TransformableSurface
            apiRef={surfaceApiRef}
            resetKey={resolvedResetKey}
            scale={scale}
            defaultScale={defaultScale}
            position={position}
            defaultPosition={
              defaultPosition
            }
            minScale={minScale}
            maxScale={maxScale}
            scaleStep={scaleStep}
            bounds={bounds}
            boundsPadding={
              boundsPadding
            }
            panEnabled={panEnabled}
            pinchEnabled={
              pinchEnabled
            }
            keyboardControls
            viewportAriaLabel="Visor de imagen"
            wheelZoomEnabled={
              wheelZoomEnabled
            }
            wheelZoomRequiresModifier={
              wheelZoomRequiresModifier
            }
            doubleClickZoomEnabled={
              doubleClickZoomEnabled
            }
            doubleTapZoomEnabled={
              doubleTapZoomEnabled
            }
            doubleInteractionScale={
              doubleInteractionScale
            }
            onTransformChange={(
              context
            ) => {
              transformRef.current =
                context.transform;

              setTransform(
                context.transform
              );

              onTransformChange?.(
                context
              );
            }}
            onGestureStart={
              onGestureStart
            }
            onGestureEnd={
              onGestureEnd
            }
            className={
              surfaceSlot.className
            }
            style={
              surfaceSlot.style
            }
          >
            <img
              {...mergedImageProps}
              {...imageSlot}
              key={`${src}:${retryKey}`}
              ref={(node) => {
                imageRef.current = node;
              }}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={(event) => {
                const image =
                  event.currentTarget;

                naturalSizeRef.current = {
                  width:
                    image.naturalWidth,
                  height:
                    image.naturalHeight,
                };

                setLoading(false);
                setLoaded(true);
                setError(null);

                requestAnimationFrame(
                  () => {
                    surfaceApiRef.current?.measure();
                    surfaceApiRef.current?.constrain();
                  }
                );

                onLoad?.({
                  src,
                  naturalWidth:
                    image.naturalWidth,
                  naturalHeight:
                    image.naturalHeight,
                });
              }}
              onError={() => {
                const nextError =
                  new Error(
                    `No se pudo cargar la imagen: ${src}`
                  );

                setLoading(false);
                setLoaded(false);
                setError(nextError);

                onError?.({
                  src,
                  error: nextError,
                  retry,
                });
              }}
            />
          </TransformableSurface>
        ) : (
          <div {...emptySlot}>
            {emptyContent}
          </div>
        )}

        {src && loading ? (
          <div {...loadingSlot}>
            {renderLoading?.(
              renderContext
            ) ?? "Cargando imagen…"}
          </div>
        ) : null}

        {src && failed ? (
          <div {...errorSlot}>
            {renderError?.(
              errorContext
            ) ?? (
                <div
                  style={{
                    display: "grid",
                    justifyItems: "center",
                    gap: "0.65rem",
                  }}
                >
                  <span>
                    No se pudo cargar la
                    imagen.
                  </span>

                  <button
                    type="button"
                    onClick={retry}
                    style={{
                      padding:
                        "0.4rem 0.7rem",
                      border:
                        "1px solid currentColor",
                      borderRadius:
                        "var(--ui-radius-md)",
                      background:
                        "transparent",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              )}
          </div>
        ) : null}

        {src &&
          loaded &&
          showControls ? (
          <div {...controlsSlot}>
            {renderControl(
              "zoom-in",
              zoomInLabel,
              zoomInContent,
              zoomIn,
              transform.scale >=
              maxScale - 0.0001
            )}

            {renderControl(
              "zoom-out",
              zoomOutLabel,
              zoomOutContent,
              zoomOut,
              transform.scale <=
              minScale + 0.0001
            )}

            {renderControl(
              "reset",
              resetLabel,
              resetContent,
              reset,
              Math.abs(
                transform.scale -
                defaultScale
              ) <= 0.0001 &&
              Math.abs(
                transform.position.x -
                defaultPosition.x
              ) <= 0.0001 &&
              Math.abs(
                transform.position.y -
                defaultPosition.y
              ) <= 0.0001
            )}
          </div>
        ) : null}

        {src &&
          loaded &&
          showStatus ? (
          <div {...statusSlot}>
            {Math.round(
              transform.scale * 100
            )}
            %
          </div>
        ) : null}
      </div>
    );
  }
);

ImageViewer.displayName =
  "ImageViewer";
