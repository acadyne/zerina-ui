// internal-test/src/ImageViewerDebug.tsx

import React from "react";
import {
  Button,
  ImageViewer,
  type ImageViewerApi,
  type ImageViewerFit,
  type TransformableSurfaceBounds,
  type TransformableSurfaceChangeContext,
  type TransformableSurfaceGesture,
  type TransformableSurfaceGestureContext,
  type TransformableSurfacePoint,
  type TransformableSurfaceTransform,
} from "zerina-ui";

const SMALL_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="160"
      height="100"
      viewBox="0 0 160 100"
    >
      <rect
        width="160"
        height="100"
        fill="#18181b"
      />
      <circle
        cx="52"
        cy="42"
        r="22"
        fill="#f472b6"
      />
      <path
        d="M0 88 L42 54 L72 76 L108 34 L160 88 Z"
        fill="#38bdf8"
      />
      <text
        x="80"
        y="94"
        fill="#ffffff"
        font-size="10"
        text-anchor="middle"
      >
        160 × 100
      </text>
    </svg>
  `);

const SOURCES = [
  {
    id: "landscape",
    label: "Paisaje grande",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
    alt: "Paisaje de montañas",
  },
  {
    id: "architecture",
    label: "Arquitectura grande",
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=85",
    alt: "Edificio moderno",
  },
  {
    id: "small",
    label: "Imagen natural pequeña",
    src: SMALL_IMAGE,
    alt: "Ilustración pequeña de prueba",
  },
  {
    id: "invalid",
    label: "URL inválida",
    src: "/image-viewer-debug/not-found-image.jpg",
    alt: "Imagen inválida de prueba",
  },
  {
    id: "empty",
    label: "Sin src",
    src: "",
    alt: "",
  },
] as const;

type SourceId =
  (typeof SOURCES)[number]["id"];

type ControlMode =
  | "uncontrolled"
  | "scale"
  | "position"
  | "both";

type ViewerPhase =
  | "empty"
  | "loading"
  | "loaded"
  | "failed";

const panelStyle: React.CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1rem",
  border:
    "1px solid var(--ui-border, #d4d4d8)",
  borderRadius:
    "var(--ui-radius-xl, 0.9rem)",
  background:
    "var(--ui-surface, #ffffff)",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.6rem",
};

const viewerFrameStyle: React.CSSProperties = {
  width: "100%",
  height: "min(68vh, 640px)",
  minHeight: 420,
  overflow: "hidden",
  border:
    "1px solid var(--ui-border, #a1a1aa)",
  borderRadius:
    "var(--ui-radius-xl, 0.9rem)",
  background:
    "var(--ui-surface-canvas, #f4f4f5)",
};

const statusStyle: React.CSSProperties = {
  display: "grid",
  gap: "0.3rem",
  padding: "0.75rem",
  border:
    "1px solid var(--ui-border, #d4d4d8)",
  borderRadius:
    "var(--ui-radius-md, 0.55rem)",
  background:
    "var(--ui-surface-container, #f4f4f5)",
  fontFamily: "monospace",
  fontSize: "0.78rem",
  overflowWrap: "anywhere",
};

const logsStyle: React.CSSProperties = {
  ...statusStyle,
  maxHeight: 320,
  overflow: "auto",
  whiteSpace: "pre-wrap",
};

function formatPoint(
  point: TransformableSurfacePoint
): string {
  return [
    `x=${point.x.toFixed(2)}`,
    `y=${point.y.toFixed(2)}`,
  ].join(" ");
}

function formatTransform(
  transform: TransformableSurfaceTransform
): string {
  return [
    `scale=${transform.scale.toFixed(4)}`,
    formatPoint(transform.position),
  ].join(" ");
}

function getTime(): string {
  return new Date()
    .toISOString()
    .slice(11, 23);
}

export function ImageViewerDebug() {
  const apiRef =
    React.useRef<ImageViewerApi>(null);

  const rootRef =
    React.useRef<HTMLDivElement>(null);

  const renderCountRef =
    React.useRef(0);

  renderCountRef.current += 1;

  const [sourceId, setSourceId] =
    React.useState<SourceId>(
      "landscape"
    );

  const [fit, setFit] =
    React.useState<ImageViewerFit>(
      "contain"
    );

  const [bounds, setBounds] =
    React.useState<TransformableSurfaceBounds>(
      "contain"
    );

  const [controlMode, setControlMode] =
    React.useState<ControlMode>(
      "uncontrolled"
    );

  const [
    controlledScale,
    setControlledScale,
  ] = React.useState(1);

  const [
    controlledPosition,
    setControlledPosition,
  ] =
    React.useState<TransformableSurfacePoint>({
      x: 0,
      y: 0,
    });

  const [
    resetOnSourceChange,
    setResetOnSourceChange,
  ] = React.useState(true);

  const [showControls, setShowControls] =
    React.useState(true);

  const [showStatus, setShowStatus] =
    React.useState(true);

  const [
    blockIntegratedControls,
    setBlockIntegratedControls,
  ] = React.useState(false);

  const [phase, setPhase] =
    React.useState<ViewerPhase>(
      "loading"
    );

  const [gesture, setGesture] =
    React.useState<TransformableSurfaceGesture>(
      "idle"
    );

  const [pointerCount, setPointerCount] =
    React.useState(0);

  const [transform, setTransform] =
    React.useState<TransformableSurfaceTransform>({
      scale: 1,
      position: {
        x: 0,
        y: 0,
      },
    });

  const [naturalSize, setNaturalSize] =
    React.useState({
      width: 0,
      height: 0,
    });

  const [inspection, setInspection] =
    React.useState(
      "Sin inspección"
    );

  const [lastEvent, setLastEvent] =
    React.useState(
      "Sin eventos"
    );

  const [logs, setLogs] = React.useState<
    readonly string[]
  >([]);

  const selectedSource =
    SOURCES.find(
      (source) =>
        source.id === sourceId
    ) ?? SOURCES[0];

  const isScaleControlled =
    controlMode === "scale" ||
    controlMode === "both";

  const isPositionControlled =
    controlMode === "position" ||
    controlMode === "both";

  const appendLog = React.useCallback(
    (
      type: string,
      message: string,
      data?: unknown
    ): void => {
      const serializedData =
        data === undefined
          ? ""
          : ` ${JSON.stringify(data)}`;

      const entry =
        `[${getTime()}] ${type}: ` +
        `${message}${serializedData}`;

      setLastEvent(entry);

      setLogs((current) =>
        [entry, ...current].slice(0, 80)
      );
    },
    []
  );

  const logApiState = React.useCallback(
    (label: string): void => {
      const api =
        apiRef.current;

      if (!api) {
        appendLog(
          "API",
          `${label}: apiRef=null`
        );

        return;
      }

      const image =
        api.getImageElement();

      appendLog(
        "API",
        label,
        {
          transform:
            api.getTransform(),
          scale:
            api.getScale(),
          position:
            api.getPosition(),
          gesture:
            api.getGesture(),
          viewportSize:
            api.getViewportSize(),
          contentSize:
            api.getContentSize(),
          naturalSize:
            api.getNaturalSize(),
          imageElement:
            image?.tagName.toLowerCase() ??
            null,
        }
      );
    },
    [appendLog]
  );

  const runApiAction = React.useCallback(
    (
      label: string,
      action: (
        api: ImageViewerApi
      ) => void
    ): void => {
      const api =
        apiRef.current;

      if (!api) {
        appendLog(
          "ACTION",
          `${label}: apiRef no disponible`
        );

        return;
      }

      appendLog(
        "ACTION",
        `${label} before`,
        api.getTransform()
      );

      action(api);

      appendLog(
        "ACTION",
        `${label} immediate`,
        api.getTransform()
      );

      requestAnimationFrame(() => {
        appendLog(
          "ACTION",
          `${label} next-frame`,
          apiRef.current
            ?.getTransform()
        );
      });
    },
    [appendLog]
  );

  React.useEffect(() => {
    if (!selectedSource.src) {
      setPhase("empty");
    } else {
      setPhase("loading");
    }

    setNaturalSize({
      width: 0,
      height: 0,
    });

    appendLog(
      "SOURCE",
      `src cambió a ${selectedSource.id}`,
      {
        resetOnSourceChange,
      }
    );
  }, [
    appendLog,
    selectedSource.id,
    selectedSource.src,
  ]);

  const handleTransformChange =
    React.useCallback(
      (
        context:
          TransformableSurfaceChangeContext
      ): void => {
        setTransform(
          context.transform
        );

        if (isScaleControlled) {
          setControlledScale(
            context.transform.scale
          );
        }

        if (isPositionControlled) {
          setControlledPosition(
            context.transform.position
          );
        }

        appendLog(
          "TRANSFORM",
          context.reason,
          {
            previous:
              context.previousTransform,
            next:
              context.transform,
            gesture:
              context.gesture,
          }
        );
      },
      [
        appendLog,
        isPositionControlled,
        isScaleControlled,
      ]
    );

  const handleGestureStart =
    React.useCallback(
      (
        context:
          TransformableSurfaceGestureContext
      ): void => {
        setGesture(
          context.gesture
        );

        setPointerCount(
          context.pointerCount
        );

        appendLog(
          "GESTURE_START",
          context.gesture,
          context
        );
      },
      [appendLog]
    );

  const handleGestureEnd =
    React.useCallback(
      (
        context:
          TransformableSurfaceGestureContext
      ): void => {
        setGesture("idle");

        setPointerCount(
          context.pointerCount
        );

        appendLog(
          "GESTURE_END",
          context.gesture,
          context
        );
      },
      [appendLog]
    );

  const inspectElements =
    React.useCallback((): void => {
      const root =
        rootRef.current;

      const api =
        apiRef.current;

      const image =
        api?.getImageElement();

      const surface =
        root?.querySelector(
          "[data-debug-surface='preserved']"
        );

      const nextInspection = [
        `root=${
          root?.tagName.toLowerCase() ??
          "null"
        }`,
        `image=${
          image?.tagName.toLowerCase() ??
          "null"
        }`,
        `surfaceData=${
          surface?.getAttribute(
            "data-debug-surface"
          ) ?? "null"
        }`,
        `surfaceAria=${
          surface?.getAttribute(
            "aria-label"
          ) ?? "null"
        }`,
      ].join(" · ");

      setInspection(
        nextInspection
      );

      appendLog(
        "INSPECT",
        nextInspection
      );
    }, [appendLog]);

  return (
    <section style={panelStyle}>
      <header>
        <h2 style={{ margin: 0 }}>
          ImageViewer Debug
        </h2>

        <p
          style={{
            marginBottom: 0,
            color:
              "var(--ui-text-muted, #71717a)",
            lineHeight: 1.5,
          }}
        >
          Valida carga, error, retry, estado vacío,
          API, refs, slots, transformaciones
          controladas, fit, bounds y cambio de
          fuente.
        </p>
      </header>

      <div style={rowStyle}>
        <label>
          Fuente:{" "}
          <select
            value={sourceId}
            onChange={(event) => {
              setSourceId(
                event.target
                  .value as SourceId
              );
            }}
          >
            {SOURCES.map((source) => (
              <option
                key={source.id}
                value={source.id}
              >
                {source.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fit:{" "}
          <select
            value={fit}
            onChange={(event) => {
              setFit(
                event.target
                  .value as ImageViewerFit
              );
            }}
          >
            <option value="contain">
              contain
            </option>

            <option value="cover">
              cover
            </option>

            <option value="natural">
              natural
            </option>
          </select>
        </label>

        <label>
          Bounds:{" "}
          <select
            value={bounds}
            onChange={(event) => {
              setBounds(
                event.target
                  .value as TransformableSurfaceBounds
              );
            }}
          >
            <option value="contain">
              contain
            </option>

            <option value="cover">
              cover
            </option>

            <option value="none">
              none
            </option>
          </select>
        </label>

        <label>
          Control:{" "}
          <select
            value={controlMode}
            onChange={(event) => {
              setControlMode(
                event.target
                  .value as ControlMode
              );
            }}
          >
            <option value="uncontrolled">
              no controlado
            </option>

            <option value="scale">
              solo escala
            </option>

            <option value="position">
              solo posición
            </option>

            <option value="both">
              escala y posición
            </option>
          </select>
        </label>
      </div>

      <div style={rowStyle}>
        <label>
          <input
            type="checkbox"
            checked={
              resetOnSourceChange
            }
            onChange={(event) => {
              setResetOnSourceChange(
                event.target.checked
              );
            }}
          />{" "}
          Reset al cambiar src
        </label>

        <label>
          <input
            type="checkbox"
            checked={showControls}
            onChange={(event) => {
              setShowControls(
                event.target.checked
              );
            }}
          />{" "}
          Mostrar controles
        </label>

        <label>
          <input
            type="checkbox"
            checked={showStatus}
            onChange={(event) => {
              setShowStatus(
                event.target.checked
              );
            }}
          />{" "}
          Mostrar estado
        </label>

        <label>
          <input
            type="checkbox"
            checked={
              blockIntegratedControls
            }
            onChange={(event) => {
              setBlockIntegratedControls(
                event.target.checked
              );
            }}
          />{" "}
          Cancelar controles integrados
        </label>
      </div>

      <div style={rowStyle}>
        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            runApiAction(
              "zoomIn",
              (api) => {
                api.zoomIn();
              }
            );
          }}
        >
          Acercar API
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            runApiAction(
              "zoomOut",
              (api) => {
                api.zoomOut();
              }
            );
          }}
        >
          Alejar API
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            runApiAction(
              "setScale(2)",
              (api) => {
                api.setScale(2);
              }
            );
          }}
        >
          Escala API 2
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            runApiAction(
              "setPosition",
              (api) => {
                api.setPosition({
                  x: 90,
                  y: -55,
                });
              }
            );
          }}
        >
          Posición API
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            runApiAction(
              "setTransform",
              (api) => {
                api.setTransform({
                  scale: 2.5,
                  position: {
                    x: 80,
                    y: -40,
                  },
                });
              }
            );
          }}
        >
          Transformación API
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            runApiAction(
              "reset",
              (api) => {
                api.reset();
              }
            );
          }}
        >
          Reset API
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setPhase("loading");

            apiRef.current?.retry();

            appendLog(
              "ACTION",
              "retry API"
            );
          }}
        >
          Retry API
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            logApiState(
              "lectura manual"
            );
          }}
        >
          Leer API
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={inspectElements}
        >
          Inspeccionar refs y slots
        </Button>
      </div>

      <div style={rowStyle}>
        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setControlledScale(1.75);

            appendLog(
              "CONTROLLED",
              "escala externa=1.75"
            );
          }}
        >
          Escala externa 1.75
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setControlledPosition({
              x: 110,
              y: -70,
            });

            appendLog(
              "CONTROLLED",
              "posición externa",
              {
                x: 110,
                y: -70,
              }
            );
          }}
        >
          Posición externa
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setControlledScale(1);

            setControlledPosition({
              x: 0,
              y: 0,
            });

            appendLog(
              "CONTROLLED",
              "valores externos restablecidos"
            );
          }}
        >
          Reset externo
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setLogs([]);
            setLastEvent(
              "Sin eventos"
            );
          }}
        >
          Limpiar logs
        </Button>
      </div>

      <div style={viewerFrameStyle}>
        <ImageViewer
          ref={rootRef}
          apiRef={apiRef}
          src={
            selectedSource.src ||
            undefined
          }
          alt={selectedSource.alt}
          fit={fit}
          scale={
            isScaleControlled
              ? controlledScale
              : undefined
          }
          position={
            isPositionControlled
              ? controlledPosition
              : undefined
          }
          minScale={0.75}
          maxScale={6}
          defaultScale={1}
          defaultPosition={{
            x: 0,
            y: 0,
          }}
          scaleStep={0.5}
          bounds={bounds}
          boundsPadding={24}
          panEnabled
          pinchEnabled
          wheelZoomEnabled
          wheelZoomRequiresModifier={
            false
          }
          doubleClickZoomEnabled
          doubleTapZoomEnabled
          doubleInteractionScale={2.5}
          resetOnSourceChange={
            resetOnSourceChange
          }
          showControls={
            showControls
          }
          showStatus={
            showStatus
          }
          zoomInContent="＋"
          zoomOutContent="−"
          resetContent="100%"
          zoomInLabel="Acercar imagen de prueba"
          zoomOutLabel="Alejar imagen de prueba"
          resetLabel="Restablecer imagen de prueba"
          emptyContent={
            <span>
              Estado vacío personalizado
            </span>
          }
          imageProps={{
            loading: "eager",
            decoding: "async",
            "data-debug-image-prop":
              "preserved",
          }}
          renderLoading={(context) => (
            <div>
              Cargando contenido personalizado
              <br />
              src={context.src}
              <br />
              scale=
              {context.scale.toFixed(2)}
            </div>
          )}
          renderError={(context) => (
            <div
              style={{
                display: "grid",
                justifyItems: "center",
                gap: "0.65rem",
              }}
            >
              <strong>
                Error personalizado
              </strong>

              <span>
                {context.src}
              </span>

              <Button
                size="sm"
                variant="outline"
                onPress={() => {
                  setPhase("loading");

                  appendLog(
                    "RETRY",
                    "retry desde renderError"
                  );

                  context.retry();
                }}
              >
                Reintentar
              </Button>
            </div>
          )}
          onLoad={(context) => {
            setPhase("loaded");

            setNaturalSize({
              width:
                context.naturalWidth,
              height:
                context.naturalHeight,
            });

            appendLog(
              "LOAD",
              "imagen cargada",
              context
            );
          }}
          onError={(context) => {
            setPhase("failed");

            appendLog(
              "ERROR",
              "falló la imagen",
              {
                src:
                  context.src,
                error:
                  context.error instanceof
                  Error
                    ? context.error.message
                    : String(
                        context.error
                      ),
              }
            );
          }}
          onTransformChange={
            handleTransformChange
          }
          onGestureStart={
            handleGestureStart
          }
          onGestureEnd={
            handleGestureEnd
          }
          styles={{
            root: {
              width: "100%",
              height: "100%",
            },

            surface: {
              width: "100%",
              height: "100%",
            },

            image: {
              borderRadius:
                "var(--ui-radius-md, 0.55rem)",
              boxShadow:
                "var(--ui-elevation-4)",
            },
          }}
          slotProps={{
            root: {
              "data-debug-root":
                "preserved",
            },

            surface: {
              "data-debug-surface":
                "preserved",
              "aria-label":
                "Superficie del visor de prueba",
            },

            image: {
              "data-debug-image":
                "preserved",
            },

            controls: {
              "data-debug-controls":
                "preserved",
            },

            controlButton: {
              "data-debug-control-button":
                "preserved",

              onClick: (event) => {
                appendLog(
                  "CONTROL_BUTTON",
                  "click observado",
                  {
                    blocked:
                      blockIntegratedControls,
                  }
                );

                if (
                  blockIntegratedControls
                ) {
                  event.preventDefault();
                }
              },
            },

            status: {
              "data-debug-status":
                "preserved",
            },

            loading: {
              "data-debug-loading":
                "preserved",
            },

            error: {
              "data-debug-error":
                "preserved",
            },

            empty: {
              "data-debug-empty":
                "preserved",
            },
          }}
        />
      </div>

      <div style={statusStyle}>
        <strong>
          Estado visible — render #
          {renderCountRef.current}
        </strong>

        <span>
          source: {sourceId}
        </span>

        <span>
          src:{" "}
          {selectedSource.src ||
            "(vacío)"}
        </span>

        <span>
          phase: {phase}
        </span>

        <span>
          fit: {fit}
        </span>

        <span>
          bounds: {bounds}
        </span>

        <span>
          controlMode: {controlMode}
        </span>

        <span>
          gesture: {gesture}
        </span>

        <span>
          pointerCount:{" "}
          {pointerCount}
        </span>

        <span>
          transform:{" "}
          {formatTransform(transform)}
        </span>

        <span>
          controlledScale:{" "}
          {controlledScale.toFixed(2)}
        </span>

        <span>
          controlledPosition:{" "}
          {formatPoint(
            controlledPosition
          )}
        </span>

        <span>
          naturalSize:{" "}
          {naturalSize.width}×
          {naturalSize.height}
        </span>

        <span>
          root element:{" "}
          {rootRef.current
            ?.tagName.toLowerCase() ??
            "null"}
        </span>

        <span>
          image element:{" "}
          {apiRef.current
            ?.getImageElement()
            ?.tagName.toLowerCase() ??
            "null"}
        </span>

        <span>
          inspection: {inspection}
        </span>

        <span>
          lastEvent: {lastEvent}
        </span>
      </div>

      <div style={logsStyle}>
        <strong>
          Eventos recientes
        </strong>

        {logs.length === 0 ? (
          <span>(sin eventos)</span>
        ) : (
          logs.map(
            (entry, index) => (
              <span
                key={`${index}-${entry}`}
              >
                {entry}
              </span>
            )
          )
        )}
      </div>

      <div
        style={{
          lineHeight: 1.55,
          color:
            "var(--ui-text-muted, #71717a)",
        }}
      >
        <strong>
          Pruebas manuales
        </strong>

        <ol>
          <li>
            Cambia entre imagen grande, pequeña,
            inválida y sin src. Verifica loading,
            loaded, failed y empty.
          </li>

          <li>
            En la URL inválida, usa el botón de
            renderError y Retry API. Confirma que se
            crea un nuevo intento.
          </li>

          <li>
            Pulsa “Inspeccionar refs y slots” y
            confirma root=div, image=img y que
            data-debug-surface y aria-label se
            conservaron.
          </li>

          <li>
            Cambia entre contain, cover y natural
            independientemente de bounds contain,
            cover y none.
          </li>

          <li>
            Activa los cuatro modos de control y usa
            tanto los botones API como los botones
            externos. El porcentaje y el estado
            visible deben sincronizarse.
          </li>

          <li>
            Cambia de fuente con
            resetOnSourceChange activado y
            desactivado. Compara la transformación.
          </li>

          <li>
            Oculta controles y status por separado.
          </li>

          <li>
            Activa “Cancelar controles integrados” y
            confirma que los clics se observan, pero
            no modifican la transformación.
          </li>

          <li>
            Usa rueda, pan, pinch, doble clic, doble
            toque y teclado dentro del visor.
          </li>

          <li>
            Verifica que getImageElement,
            getNaturalSize y los getters de la API
            coinciden con el panel visible.
          </li>
        </ol>
      </div>
    </section>
  );
}