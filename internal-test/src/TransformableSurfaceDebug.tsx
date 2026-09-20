import React from "react";
import {
  TransformableSurface,
  type TransformableSurfaceApi,
  type TransformableSurfaceBounds,
  type TransformableSurfaceGesture,
  type TransformableSurfacePoint,
  type TransformableSurfaceTransform,
} from "zerina-ui";

const DEMO_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85";

const panelStyle: React.CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1rem",
  border: "1px solid var(--ui-border, #d4d4d8)",
  borderRadius: "0.8rem",
  background: "var(--ui-surface, #ffffff)",
};

const controlsStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.5rem",
};

const buttonStyle: React.CSSProperties = {
  minHeight: 34,
  padding: "0.4rem 0.7rem",
  border: "1px solid var(--ui-border, #a1a1aa)",
  borderRadius: "0.45rem",
  background: "var(--ui-surface-container, #f4f4f5)",
  color: "var(--ui-text, #18181b)",
  cursor: "pointer",
};

const statusStyle: React.CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  padding: "0.75rem",
  borderRadius: "0.55rem",
  background: "rgba(127, 127, 127, 0.1)",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  overflowWrap: "anywhere",
};

function formatPoint(
  point: TransformableSurfacePoint
): string {
  return `x=${point.x.toFixed(1)}, y=${point.y.toFixed(1)}`;
}

function formatTransform(
  transform: TransformableSurfaceTransform
): string {
  return `scale=${transform.scale.toFixed(2)}, ${formatPoint(
    transform.position
  )}`;
}

export function TransformableSurfaceDebug() {
  const apiRef =
    React.useRef<TransformableSurfaceApi>(null);

  const rootRef =
    React.useRef<HTMLDivElement>(null);

  const [inspection, setInspection] =
    React.useState(
      "Sin inspección"
    );

  const [bounds, setBounds] =
    React.useState<TransformableSurfaceBounds>(
      "contain"
    );

  const [disabled, setDisabled] =
    React.useState(false);

  const [panEnabled, setPanEnabled] =
    React.useState(true);

  const [pinchEnabled, setPinchEnabled] =
    React.useState(true);

  const [
    centerContent,
    setCenterContent,
  ] = React.useState(true);

  const [
    smallContent,
    setSmallContent,
  ] = React.useState(false);

  const [
    wheelZoomRequiresModifier,
    setWheelZoomRequiresModifier,
  ] = React.useState(true);

  const [gesture, setGesture] =
    React.useState<TransformableSurfaceGesture>(
      "idle"
    );

  const [transform, setTransform] =
    React.useState<TransformableSurfaceTransform>({
      scale: 1,
      position: {
        x: 0,
        y: 0,
      },
    });

  const [events, setEvents] = React.useState<
    readonly string[]
  >([]);

  const [resetKey, setResetKey] =
    React.useState(0);

  const appendEvent = React.useCallback(
    (message: string): void => {
      setEvents((current) =>
        [message, ...current].slice(0, 12)
      );
    },
    []
  );

  return (
    <section style={panelStyle}>
      <header>
        <h2 style={{ margin: 0 }}>
          TransformableSurface Debug
        </h2>

        <p
          style={{
            marginBottom: 0,
            color: "var(--ui-text-muted, #71717a)",
            lineHeight: 1.5,
          }}
        >
          Valida pan, pinch, doble toque, doble clic,
          rueda, límites, medición, slots y API
          imperativa.
        </p>
      </header>

      <div style={controlsStyle}>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.zoomIn();
          }}
        >
          Acercar
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.zoomOut();
          }}
        >
          Alejar
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.setScale(2.5);
          }}
        >
          Escala 2.5
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.setPosition({
              x: 120,
              y: -80,
            });
          }}
        >
          Mover
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.setTransform({
              scale: 3,
              position: {
                x: -160,
                y: 90,
              },
            });
          }}
        >
          Transformación completa
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.constrain();
          }}
        >
          Aplicar límites
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.measure();

            appendEvent(
              "API measure ejecutado"
            );
          }}
        >
          Medir
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            const api =
              apiRef.current;

            const root =
              rootRef.current;

            if (!api || !root) {
              setInspection(
                "API o root ref no disponible"
              );

              return;
            }

            const nextInspection = [
              `root=${root.tagName.toLowerCase()}`,
              `gesture=${api.getGesture()}`,
              `transform=${formatTransform(
                api.getTransform()
              )}`,
              `scale=${api
                .getScale()
                .toFixed(2)}`,
              `position=${formatPoint(
                api.getPosition()
              )}`,
              `viewport=${api
                .getViewportSize()
                .width.toFixed(0)}×${api
                .getViewportSize()
                .height.toFixed(0)}`,
              `content=${api
                .getContentSize()
                .width.toFixed(0)}×${api
                .getContentSize()
                .height.toFixed(0)}`,
            ].join(" · ");

            setInspection(
              nextInspection
            );

            appendEvent(
              "API getters inspeccionados"
            );
          }}
        >
          Inspeccionar API y refs
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            apiRef.current?.reset();
          }}
        >
          Reset API
        </button>

        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setResetKey((value) => value + 1);
          }}
        >
          Cambiar resetKey
        </button>
      </div>

      <div style={controlsStyle}>
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
          <input
            type="checkbox"
            checked={panEnabled}
            onChange={(event) => {
              setPanEnabled(
                event.target.checked
              );
            }}
          />{" "}
          Pan
        </label>

        <label>
          <input
            type="checkbox"
            checked={pinchEnabled}
            onChange={(event) => {
              setPinchEnabled(
                event.target.checked
              );
            }}
          />{" "}
          Pinch
        </label>

        <label>
          <input
            type="checkbox"
            checked={centerContent}
            onChange={(event) => {
              setCenterContent(
                event.target.checked
              );
            }}
          />{" "}
          Centrar contenido
        </label>

        <label>
          <input
            type="checkbox"
            checked={smallContent}
            onChange={(event) => {
              setSmallContent(
                event.target.checked
              );
            }}
          />{" "}
          Contenido pequeño
        </label>

        <label>
          <input
            type="checkbox"
            checked={
              wheelZoomRequiresModifier
            }
            onChange={(event) => {
              setWheelZoomRequiresModifier(
                event.target.checked
              );
            }}
          />{" "}
          Rueda requiere Ctrl/Meta
        </label>

        <label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(event) => {
              setDisabled(
                event.target.checked
              );
            }}
          />{" "}
          Disabled
        </label>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "min(65vh, 620px)",
          minHeight: 360,
          border:
            "1px solid var(--ui-border, #a1a1aa)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(127,127,127,0.08), rgba(127,127,127,0.16))",
        }}
      >
        <TransformableSurface
          ref={rootRef}
          apiRef={apiRef}
          resetKey={resetKey}
          minScale={0.75}
          maxScale={5}
          defaultScale={1}
          scaleStep={0.5}
          bounds={bounds}
          boundsPadding={24}
          centerContent={centerContent}
          constrainOnResize
          panEnabled={panEnabled}
          pinchEnabled={pinchEnabled}
          wheelZoomEnabled
          wheelZoomRequiresModifier={
            wheelZoomRequiresModifier
          }
          doubleClickZoomEnabled
          doubleTapZoomEnabled
          doubleInteractionScale={2.5}
          keyboardControls
          keyboardPanStep={40}
          viewportAriaLabel="Viewport transformable de prueba"
          disabled={disabled}
          onTransformChange={(context) => {
            setTransform(context.transform);

            appendEvent(
              `${context.reason}: ${formatTransform(
                context.transform
              )}`
            );
          }}
          onGestureStart={(context) => {
            setGesture(context.gesture);

            appendEvent(
              `gesture start: ${context.gesture}, pointers=${context.pointerCount}`
            );
          }}
          onGestureEnd={(context) => {
            setGesture("idle");

            appendEvent(
              `gesture end: ${context.gesture}, pointers=${context.pointerCount}`
            );
          }}
          onSurfaceKeyDown={(event) => {
            appendEvent(
              `key: ${event.key}, prevented=${String(
                event.defaultPrevented
              )}`
            );
          }}
          styles={{
            root: {
              width: "100%",
              height: "100%",
            },

            viewport: {
              background:
                "radial-gradient(circle at center, rgba(127,127,127,0.09), transparent 65%)",
            },

            content: {
              borderRadius: "0.5rem",
            },
          }}
          slotProps={{
            root: {
              "aria-label":
                "Superficie transformable de prueba",
            },

            viewport: {
              "data-debug-slot":
                "transformable-viewport",

              onFocus: () => {
                appendEvent(
                  "viewport focus"
                );
              },

              onBlur: () => {
                appendEvent(
                  "viewport blur"
                );
              },
            },

            content: {
              "data-debug-slot":
                "transformable-content",
            },
          }}
        >
          {({
            scale,
            gesture: currentGesture,
            viewportSize,
            contentSize,
          }) => (
            <div
              style={{
                position: "relative",
                width: smallContent
                  ? "240px"
                  : "min(900px, 82vw)",
                aspectRatio: "16 / 10",
                borderRadius: "0.65rem",
                overflow: "hidden",
                boxShadow:
                  "0 18px 50px rgba(0, 0, 0, 0.28)",
                background: "#18181b",
                pointerEvents: "none",
              }}
            >
              <img
                src={DEMO_IMAGE}
                alt="Paisaje de prueba"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: 12,
                  bottom: 12,
                  padding: "0.35rem 0.55rem",
                  borderRadius: "0.4rem",
                  background:
                    "rgba(0, 0, 0, 0.65)",
                  color: "#ffffff",
                  fontFamily: "monospace",
                  fontSize: "0.72rem",
                }}
              >
                {scale.toFixed(2)}× ·{" "}
                {currentGesture}
                <br />
                viewport{" "}
                {viewportSize.width.toFixed(0)}
                ×
                {viewportSize.height.toFixed(0)}
                <br />
                content{" "}
                {contentSize.width.toFixed(0)}
                ×
                {contentSize.height.toFixed(0)}
              </div>
            </div>
          )}
        </TransformableSurface>

        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem",
            touchAction: "manipulation",
          }}
        >
          <button
            type="button"
            style={buttonStyle}
            onClick={() => {
              apiRef.current?.zoomIn();
            }}
          >
            +
          </button>

          <button
            type="button"
            style={buttonStyle}
            onClick={() => {
              apiRef.current?.zoomOut();
            }}
          >
            −
          </button>

          <button
            type="button"
            style={buttonStyle}
            onClick={() => {
              apiRef.current?.reset();
            }}
          >
            1:1
          </button>
        </div>
      </div>

      <div style={statusStyle}>
        <strong>Estado</strong>

        <span>
          gesture: {gesture}
        </span>

        <span>
          transform:{" "}
          {formatTransform(transform)}
        </span>

        <span>
          bounds: {bounds}
        </span>

        <span>
          panEnabled: {String(panEnabled)}
        </span>

        <span>
          pinchEnabled:{" "}
          {String(pinchEnabled)}
        </span>

        <span>
          centerContent:{" "}
          {String(centerContent)}
        </span>

        <span>
          smallContent:{" "}
          {String(smallContent)}
        </span>

        <span>
          disabled: {String(disabled)}
        </span>

        <span>
          resetKey: {resetKey}
        </span>

        <span>
          inspection: {inspection}
        </span>
      </div>

      <div style={statusStyle}>
        <strong>Eventos recientes</strong>

        {events.length === 0 ? (
          <span>(sin eventos)</span>
        ) : (
          events.map((event, index) => (
            <span key={`${index}-${event}`}>
              {event}
            </span>
          ))
        )}

        <button
          type="button"
          style={{
            ...buttonStyle,
            justifySelf: "start",
          }}
          onClick={() => {
            setEvents([]);
          }}
        >
          Limpiar eventos
        </button>
      </div>

      <div
        style={{
          lineHeight: 1.55,
          color:
            "var(--ui-text-muted, #71717a)",
        }}
      >
        <strong>Pruebas manuales</strong>

        <ol>
          <li>
            Arrastra la imagen con mouse o un dedo.
          </li>

          <li>
            Haz pinch con dos dedos en móvil o
            trackpad táctil.
          </li>

          <li>
            Haz doble clic para alternar el zoom.
          </li>

          <li>
            Haz doble toque en una zona concreta y
            verifica que el zoom conserve ese punto.
          </li>

          <li>
            Usa Ctrl + rueda en Windows/Linux o
            Meta + rueda en macOS.
          </li>

          <li>
            Desactiva el requisito de modificador y
            prueba la rueda directamente.
          </li>

          <li>
            Activa “Contenido pequeño” y cambia entre
            contain y cover. En contain debe conservar
            su escala permitiendo espacio libre; en
            cover debe aumentar hasta cubrir el
            viewport, sin superar maxScale.
          </li>

          <li>
            Con contenido pequeño y contain, desactiva
            “Centrar contenido”. Arrastra hacia ambos
            lados y verifica que el rango sea simétrico
            respecto del centro.
          </li>

          <li>
            Cambia a bounds none y confirma que la
            posición deja de estar restringida.
          </li>

          <li>
            Amplía y arrastra hasta los bordes para
            validar los límites.
          </li>

          <li>
            Desactiva pan o pinch por separado.
          </li>

          <li>
            Activa disabled y confirma que la
            superficie deja de responder.
          </li>

          <li>
            Redimensiona la ventana para validar
            ResizeObserver y constrainOnResize.
          </li>

          <li>
            Usa los botones flotantes y comprueba que
            no se transforman junto con la imagen.
          </li>

          <li>
            Enfoca el viewport con Tab y prueba +, -,
            0 y las cuatro flechas. Confirma en el
            registro que onSurfaceKeyDown recibe la
            tecla y que defaultPrevented es true para
            los controles reconocidos.
          </li>

          <li>
            Pulsa “Inspeccionar API y refs” y confirma
            que el root es un div, que todos los
            getters responden y que sus valores
            coinciden con el estado visible.
          </li>
        </ol>
      </div>
    </section>
  );
}
