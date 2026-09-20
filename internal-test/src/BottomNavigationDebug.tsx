// internal-test/src/BottomNavigationDebug.tsx
import React from "react";
import {
  Badge,
  BottomNavigation,
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
} from "zerina-ui";

type ControlledDestination =
  | "home"
  | "files"
  | "settings"
  | "profile";

type DebugSectionProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};

function DebugSection({
  title,
  description,
  children,
}: DebugSectionProps) {
  return (
    <Card>
      <CardBody>
        <Stack
  style={{
    gap: "1rem",
  }}
>
          <Box>
            <Heading as="h2">
              {title}
            </Heading>

            {description ? (
              <Box
                as="p"
                style={{
                  marginTop: "0.35rem",
                  marginBottom: 0,
                  color: "var(--ui-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Box>
            ) : null}
          </Box>

          {children}
        </Stack>
      </CardBody>
    </Card>
  );
}

function StatusPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      role="status"
      aria-live="polite"
      style={{
        padding: "0.75rem",
        border: "1px solid var(--ui-border)",
        borderRadius: "var(--ui-radius-md)",
        background: "var(--ui-surface-container)",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        lineHeight: 1.5,
      }}
    >
      {children}
    </Box>
  );
}

export function BottomNavigationDebug() {
  const [
    controlledValue,
    setControlledValue,
  ] = React.useState<ControlledDestination>(
    "home"
  );

  const [
    controlledEvent,
    setControlledEvent,
  ] = React.useState(
    "Todavía no hay selección."
  );

  const [
    uncontrolledEvent,
    setUncontrolledEvent,
  ] = React.useState(
    "Valor inicial: files."
  );

  const [
    cancelledPresses,
    setCancelledPresses,
  ] = React.useState(0);

  return (
    <Box
      data-ui-bottom-navigation-debug=""
      style={{
        width: "100%",
        maxWidth: 980,
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <Stack
  style={{
    gap: "1.5rem",
  }}
>
        <Box>
          <Heading as="h1">
            BottomNavigation
          </Heading>

          <Box
            as="p"
            style={{
              marginTop: "0.5rem",
              marginBottom: 0,
              color: "var(--ui-text-muted)",
              lineHeight: 1.6,
            }}
          >
            Validación de selección controlada y no controlada,
            reselección, cancelación, labels ocultos accesiblemente,
            valores ReactNode falsy, indicadores, densidades,
            posiciones y safe area.
          </Box>
        </Box>

        <DebugSection
          title="Selección controlada"
          description={
            <>
              Usa <code>labelBehavior="active"</code>. Los labels
              inactivos deben seguir presentes dentro de sus botones,
              aunque estén visualmente ocultos.
            </>
          }
        >
          <StatusPanel>
            Valor actual: <strong>{controlledValue}</strong>
            <br />
            Último evento: {controlledEvent}
          </StatusPanel>

          <BottomNavigation
            position="static"
            safeArea={false}
            value={controlledValue}
            variant="floating"
            indicator="pill"
            labelBehavior="active"
            density="comfortable"
            aria-label="Navegación controlada"
            onValueChange={(
              nextValue,
              _event,
              selection
            ) => {
              setControlledEvent(
                `${selection.reason}: ${selection.previousValue ?? "null"} → ${nextValue}`
              );

              if (
                selection.reason ===
                "change"
              ) {
                setControlledValue(
                  nextValue as ControlledDestination
                );
              }
            }}
          >
            <BottomNavigation.Item
              value="home"
              icon="⌂"
            >
              Inicio
            </BottomNavigation.Item>

            <BottomNavigation.Item
              value="files"
              icon="▤"
              badge={
                <Badge>
                  3
                </Badge>
              }
            >
              Archivos
            </BottomNavigation.Item>

            <BottomNavigation.Item
              value="settings"
              icon="⚙"
            >
              <Box
                as="span"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                }}
              >
                <span>Ajustes</span>
                <span aria-hidden="true">
                  ·
                </span>
                <strong>Pro</strong>
              </Box>
            </BottomNavigation.Item>

            <BottomNavigation.Item
              value="profile"
              icon="●"
              aria-label="Perfil"
            />
          </BottomNavigation>

          <Box
            as="p"
            style={{
              margin: 0,
              color: "var(--ui-text-muted)",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            Al volver a presionar el destino activo, el estado no
            cambia y el evento debe informar{" "}
            <code>reason: "reselect"</code>. El destino activo debe
            tener <code>aria-current="page"</code>.
          </Box>
        </DebugSection>

        <DebugSection
          title="Labels always, active y never"
          description="Los tres ejemplos deben conservar nombres accesibles aunque cambie la visibilidad visual del label."
        >
          <Stack
  style={{
    gap: "1rem",
  }}
>
            <Box>
              <Heading as="h3">
                always
              </Heading>

              <BottomNavigation
                position="static"
                safeArea={false}
                defaultValue="alpha"
                labelBehavior="always"
                indicator="background"
                density="compact"
                aria-label="Labels siempre visibles"
              >
                <BottomNavigation.Item
                  value="alpha"
                  icon="A"
                >
                  Alfa
                </BottomNavigation.Item>

                <BottomNavigation.Item
                  value="zero"
                  icon="0"
                  label={0}
                  badge={0}
                />

                <BottomNavigation.Item
                  value="gamma"
                  icon="G"
                >
                  Gamma
                </BottomNavigation.Item>
              </BottomNavigation>
            </Box>

            <Box>
              <Heading as="h3">
                active
              </Heading>

              <BottomNavigation
                position="static"
                safeArea={false}
                defaultValue="one"
                labelBehavior="active"
                indicator="dot"
                density="compact"
                aria-label="Solo label activo visible"
              >
                <BottomNavigation.Item
                  value="one"
                  icon="1"
                >
                  Uno
                </BottomNavigation.Item>

                <BottomNavigation.Item
                  value="two"
                  icon="2"
                >
                  Dos
                </BottomNavigation.Item>

                <BottomNavigation.Item
                  value="three"
                  icon="3"
                >
                  Tres
                </BottomNavigation.Item>
              </BottomNavigation>
            </Box>

            <Box>
              <Heading as="h3">
                never
              </Heading>

              <BottomNavigation
                position="static"
                safeArea={false}
                defaultValue="left"
                labelBehavior="never"
                indicator="none"
                density="comfortable"
                aria-label="Labels visualmente ocultos"
              >
                <BottomNavigation.Item
                  value="left"
                  icon="←"
                >
                  Anterior
                </BottomNavigation.Item>

                <BottomNavigation.Item
                  value="center"
                  icon="•"
                >
                  Centro
                </BottomNavigation.Item>

                <BottomNavigation.Item
                  value="right"
                  icon="→"
                >
                  Siguiente
                </BottomNavigation.Item>
              </BottomNavigation>
            </Box>
          </Stack>
        </DebugSection>

        <DebugSection
          title="Selección no controlada y cancelación"
          description={
            <>
              El estado interno parte de <code>defaultValue="files"</code>.
              El destino protegido cancela la selección mediante{" "}
              <code>event.preventDefault()</code>.
            </>
          }
        >
          <StatusPanel>
            {uncontrolledEvent}
            <br />
            Presiones canceladas: {cancelledPresses}
          </StatusPanel>

          <BottomNavigation
            position="static"
            safeArea={false}
            defaultValue="files"
            variant="surface"
            indicator="background"
            labelBehavior="always"
            density="comfortable"
            aria-label="Navegación no controlada"
            onValueChange={(
              nextValue,
              _event,
              selection
            ) => {
              setUncontrolledEvent(
                `${selection.reason}: ${selection.previousValue ?? "null"} → ${nextValue}`
              );
            }}
          >
            <BottomNavigation.Item
              value="home"
              icon="⌂"
            >
              Inicio
            </BottomNavigation.Item>

            <BottomNavigation.Item
              value="files"
              icon="▤"
            >
              Archivos
            </BottomNavigation.Item>

            <BottomNavigation.Item
              value="protected"
              icon="⊘"
              onPress={(event) => {
                event.preventDefault();

                setCancelledPresses(
                  (current) =>
                    current + 1
                );

                setUncontrolledEvent(
                  "La selección de “Protegido” fue cancelada."
                );
              }}
            >
              Protegido
            </BottomNavigation.Item>

            <BottomNavigation.Item
              value="disabled"
              icon="×"
              disabled
            >
              Deshabilitado
            </BottomNavigation.Item>
          </BottomNavigation>
        </DebugSection>

        <DebugSection
          title="Indicadores"
          description="Comparación directa de background, pill, dot y none."
        >
          <Stack
  style={{
    gap: "1rem",
  }}
>
            {(
              [
                "background",
                "pill",
                "dot",
                "none",
              ] as const
            ).map((indicator) => (
              <Box key={indicator}>
                <Heading as="h3">
                  {indicator}
                </Heading>

                <BottomNavigation
                  position="static"
                  safeArea={false}
                  defaultValue="middle"
                  variant="plain"
                  indicator={indicator}
                  labelBehavior="always"
                  density="compact"
                  aria-label={`Indicador ${indicator}`}
                >
                  <BottomNavigation.Item
                    value="start"
                    icon="1"
                  >
                    Inicio
                  </BottomNavigation.Item>

                  <BottomNavigation.Item
                    value="middle"
                    icon="2"
                  >
                    Centro
                  </BottomNavigation.Item>

                  <BottomNavigation.Item
                    value="end"
                    icon="3"
                  >
                    Final
                  </BottomNavigation.Item>
                </BottomNavigation>
              </Box>
            ))}
          </Stack>
        </DebugSection>

        <DebugSection
          title="Posición sticky y safe area"
          description="El contenedor tiene altura limitada para comprobar el comportamiento sticky durante el desplazamiento."
        >
          <Box
            style={{
              height: 260,
              overflow: "auto",
              border: "1px solid var(--ui-border)",
              borderRadius: "var(--ui-radius-lg)",
              background: "var(--ui-surface-container)",
            }}
          >
            <Box
              style={{
                minHeight: 520,
                padding: "1rem",
                boxSizing: "border-box",
              }}
            >
              <Heading as="h3">
                Área desplazable
              </Heading>

              <Box
                as="p"
                style={{
                  lineHeight: 1.6,
                  color: "var(--ui-text-muted)",
                }}
              >
                Desplaza este panel. La navegación permanece adherida
                a su borde inferior.
              </Box>
            </Box>

            <BottomNavigation
              position="sticky"
              safeArea
              defaultValue="first"
              variant="surface"
              indicator="pill"
              labelBehavior="active"
              density="comfortable"
              aria-label="Navegación sticky con safe area"
            >
              <BottomNavigation.Item
                value="first"
                icon="Ⅰ"
              >
                Primero
              </BottomNavigation.Item>

              <BottomNavigation.Item
                value="second"
                icon="Ⅱ"
              >
                Segundo
              </BottomNavigation.Item>

              <BottomNavigation.Item
                value="third"
                icon="Ⅲ"
              >
                Tercero
              </BottomNavigation.Item>
            </BottomNavigation>
          </Box>
        </DebugSection>

        <DebugSection
          title="Fixed aislado"
          description="La recipe recibe position=fixed, pero el slot root se restringe a este sandbox para no cubrir toda la aplicación de pruebas."
        >
          <Box
            style={{
              position: "relative",
              height: 220,
              overflow: "hidden",
              border: "1px solid var(--ui-border)",
              borderRadius: "var(--ui-radius-lg)",
              background: "var(--ui-surface-container)",
            }}
          >
            <Box
              style={{
                padding: "1rem",
              }}
            >
              <Heading as="h3">
                Simulación de viewport
              </Heading>

              <Box
                as="p"
                style={{
                  color: "var(--ui-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                El override de posición solo evita que el ejemplo
                escape del catálogo.
              </Box>
            </Box>

            <BottomNavigation
              position="fixed"
              safeArea={false}
              defaultValue="primary"
              variant="floating"
              indicator="pill"
              labelBehavior="active"
              density="comfortable"
              aria-label="Navegación fixed aislada"
              styles={{
                root: {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
              }}
            >
              <BottomNavigation.Item
                value="primary"
                icon="●"
              >
                Principal
              </BottomNavigation.Item>

              <BottomNavigation.Item
                value="secondary"
                icon="○"
              >
                Secundario
              </BottomNavigation.Item>
            </BottomNavigation>
          </Box>
        </DebugSection>

        <DebugSection
          title="Inspección accesible"
          description="Puntos concretos que deben verificarse en DevTools o con un lector de pantalla."
        >
          <Box
            as="ul"
            style={{
              margin: 0,
              paddingLeft: "1.25rem",
              lineHeight: 1.7,
            }}
          >
            <li>
              Los labels ocultos siguen siendo descendientes del
              botón.
            </li>

            <li>
              El item activo contiene{" "}
              <code>aria-current="page"</code>.
            </li>

            <li>
              El item icon-only “Perfil” obtiene su nombre mediante{" "}
              <code>aria-label</code>.
            </li>

            <li>
              El label, icono y badge numéricos con valor{" "}
              <code>0</code> permanecen renderizados.
            </li>

            <li>
              El item deshabilitado no emite cambio ni reselección.
            </li>

            <li>
              El item “Protegido” cancela la transición mediante{" "}
              <code>preventDefault()</code>.
            </li>
          </Box>
        </DebugSection>
      </Stack>
    </Box>
  );
}

BottomNavigationDebug.displayName =
  "BottomNavigationDebug";