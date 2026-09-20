// internal-test/src/NavigationRailDebug.tsx
import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  NavigationRail,
  Stack,
} from "zerina-ui";

type ControlledDestination =
  | "home"
  | "tasks"
  | "activity"
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
        <Stack spacing="1rem">
          <Box>
            <Heading size="sm">
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

function RailSandbox({
  children,
  height = 420,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <Box
      style={{
        height,
        minWidth: 0,
        display: "flex",
        overflow: "hidden",
        border: "1px solid var(--ui-border)",
        borderRadius: "var(--ui-radius-xl)",
        background: "var(--ui-surface-canvas)",
      }}
    >
      {children}
    </Box>
  );
}

function RailContent({
  title,
  children,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Box
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        padding: "1rem",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <Stack spacing="0.75rem">
        <Heading size="sm">
          {title}
        </Heading>

        <Box
          style={{
            padding: "1rem",
            borderRadius: "var(--ui-radius-xl)",
            border: "1px solid var(--ui-border)",
            background: "var(--ui-surface)",
            color: "var(--ui-text-muted)",
            lineHeight: 1.5,
          }}
        >
          {children ??
            "Esta zona simula el contenido principal asociado al destino activo."}
        </Box>
      </Stack>
    </Box>
  );
}

export function NavigationRailDebug() {
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
    "Valor inicial: tasks."
  );

  const [
    cancelledPresses,
    setCancelledPresses,
  ] = React.useState(0);

  const labels: Record<
    ControlledDestination,
    string
  > = {
    home: "Inicio",
    tasks: "Tareas",
    activity: "Actividad",
    profile: "Perfil",
  };

  return (
    <Box
      data-ui-navigation-rail-debug=""
      style={{
        width: "100%",
        maxWidth: 1080,
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <Stack spacing="1.5rem">
        <Box>
          <Heading>
            NavigationRail
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
            reselección, cancelación, labels accesibles, valores
            ReactNode falsy, indicadores, densidades, posiciones,
            placement, safe area, alignment, header y footer.
          </Box>
        </Box>

        <DebugSection
          title="Selección controlada"
          description={
            <>
              Usa <code>labelBehavior="active"</code>. Los labels
              inactivos deben seguir dentro de sus botones aunque
              estén visualmente ocultos.
            </>
          }
        >
          <StatusPanel>
            Valor actual:{" "}
            <strong>
              {controlledValue}
            </strong>
            <br />
            Último evento: {controlledEvent}
          </StatusPanel>

          <RailSandbox>
            <NavigationRail
              value={controlledValue}
              position="static"
              placement="left"
              safeArea={false}
              variant="surface"
              indicator="pill"
              labelBehavior="active"
              density="comfortable"
              alignment="start"
              aria-label="Navegación lateral controlada"
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
              header={
                <Box
                  aria-label="Zerina UI"
                  style={{
                    width: 32,
                    height: 32,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "9999px",
                    background:
                      "color-mix(in srgb, var(--ui-primary) 18%, transparent)",
                    color: "var(--ui-primary)",
                    fontWeight:
                      "var(--ui-font-weight-bold)",
                  }}
                >
                  Z
                </Box>
              }
              footer={
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Configuración del rail"
                >
                  ⚙
                </Button>
              }
              styles={{
                root: {
                  outline:
                    "1px solid color-mix(in srgb, var(--ui-primary) 10%, transparent)",
                  outlineOffset: "-1px",
                },

                container: {
                  outline:
                    "1px solid color-mix(in srgb, var(--ui-primary) 14%, transparent)",
                  outlineOffset: "-3px",
                },

                activeItem: {
                  background:
                    "color-mix(in srgb, var(--ui-primary) 14%, transparent)",
                  boxShadow:
                    "inset 0 0 0 1px color-mix(in srgb, var(--ui-primary) 22%, transparent)",
                },

                activeIcon: {
                  color: "var(--ui-primary)",
                },

                badge: {
                  filter:
                    "drop-shadow(0 2px 4px rgb(0 0 0 / 0.18))",
                },
              }}
              slotProps={{
                root: {
                  "data-demo-slot-root":
                    "navigation-rail",
                },

                container: {
                  "data-demo-slot-container":
                    "navigation-rail-container",
                },

                list: {
                  "data-demo-slot-list":
                    "navigation-rail-list",
                },

                item: {
                  "data-demo-slot-item":
                    "navigation-rail-item",
                },

                icon: {
                  "data-demo-slot-icon":
                    "navigation-rail-icon",
                },

                badge: {
                  "data-demo-slot-badge":
                    "navigation-rail-badge",
                },
              }}
            >
              <NavigationRail.Item
                value="home"
                icon="⌂"
              >
                Inicio
              </NavigationRail.Item>

              <NavigationRail.Item
                value="tasks"
                icon="▣"
                badge={
                  <Badge
                    variant="solid"
                    colorScheme="danger"
                  >
                    5
                  </Badge>
                }
              >
                Tareas
              </NavigationRail.Item>

              <NavigationRail.Item
                value="activity"
                icon="≡"
              >
                <Box
                  as="span"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <span>Actividad</span>
                  <span aria-hidden="true">
                    ·
                  </span>
                  <strong>Live</strong>
                </Box>
              </NavigationRail.Item>

              <NavigationRail.Item
                value="profile"
                icon="◉"
                aria-label="Perfil"
              />
            </NavigationRail>

            <RailContent
              title={
                labels[controlledValue]
              }
            >
              Al volver a presionar el destino activo, el valor no
              cambia y el evento debe informar{" "}
              <code>reason: "reselect"</code>. El destino activo debe
              conservar <code>aria-current="page"</code>.
            </RailContent>
          </RailSandbox>
        </DebugSection>

        <DebugSection
          title="Labels always, active y never"
          description="Los tres ejemplos deben conservar nombres accesibles aunque cambie la visibilidad visual del label."
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            <RailSandbox height={340}>
              <NavigationRail
                position="static"
                safeArea={false}
                defaultValue="alpha"
                labelBehavior="always"
                indicator="background"
                density="compact"
                aria-label="Labels siempre visibles"
              >
                <NavigationRail.Item
                  value="alpha"
                  icon="A"
                >
                  Alfa
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="zero"
                  icon={0}
                  label={0}
                  badge={0}
                />

                <NavigationRail.Item
                  value="gamma"
                  icon="G"
                >
                  Gamma
                </NavigationRail.Item>
              </NavigationRail>

              <RailContent title="always">
                El item central valida label, icono y badge con valor{" "}
                <code>0</code>.
              </RailContent>
            </RailSandbox>

            <RailSandbox height={340}>
              <NavigationRail
                position="static"
                safeArea={false}
                defaultValue="one"
                labelBehavior="active"
                indicator="dot"
                density="compact"
                aria-label="Solo label activo visible"
              >
                <NavigationRail.Item
                  value="one"
                  icon="1"
                >
                  Uno
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="two"
                  icon="2"
                >
                  Dos
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="three"
                  icon="3"
                >
                  Tres
                </NavigationRail.Item>
              </NavigationRail>

              <RailContent title="active">
                Solo el label activo debe verse; los demás siguen
                presentes para tecnologías de asistencia.
              </RailContent>
            </RailSandbox>

            <RailSandbox height={340}>
              <NavigationRail
                position="static"
                safeArea={false}
                defaultValue="left"
                labelBehavior="never"
                indicator="none"
                density="comfortable"
                aria-label="Labels visualmente ocultos"
              >
                <NavigationRail.Item
                  value="left"
                  icon="←"
                >
                  Anterior
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="center"
                  icon="•"
                >
                  Centro
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="right"
                  icon="→"
                >
                  Siguiente
                </NavigationRail.Item>
              </NavigationRail>

              <RailContent title="never">
                Ningún label se ve, pero todos deben permanecer dentro
                de sus botones.
              </RailContent>
            </RailSandbox>
          </Box>
        </DebugSection>

        <DebugSection
          title="Selección no controlada y cancelación"
          description={
            <>
              El estado interno parte de <code>defaultValue="tasks"</code>.
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

          <RailSandbox>
            <NavigationRail
              position="static"
              safeArea={false}
              defaultValue="tasks"
              variant="surface"
              indicator="background"
              labelBehavior="always"
              density="comfortable"
              alignment="start"
              aria-label="Navegación lateral no controlada"
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
              <NavigationRail.Item
                value="home"
                icon="⌂"
              >
                Inicio
              </NavigationRail.Item>

              <NavigationRail.Item
                value="tasks"
                icon="▣"
              >
                Tareas
              </NavigationRail.Item>

              <NavigationRail.Item
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
              </NavigationRail.Item>

              <NavigationRail.Item
                value="disabled"
                icon="×"
                disabled
              >
                Deshabilitado
              </NavigationRail.Item>
            </NavigationRail>

            <RailContent title="Estado interno">
              El item deshabilitado no debe producir cambio ni
              reselección. El item protegido ejecuta su handler local,
              pero no cambia el valor.
            </RailContent>
          </RailSandbox>
        </DebugSection>

        <DebugSection
          title="Indicadores"
          description="Comparación directa de background, pill, dot y none."
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
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
              <RailSandbox
                key={indicator}
                height={300}
              >
                <NavigationRail
                  position="static"
                  safeArea={false}
                  defaultValue="middle"
                  variant="plain"
                  indicator={indicator}
                  labelBehavior="always"
                  density="compact"
                  aria-label={`Indicador ${indicator}`}
                >
                  <NavigationRail.Item
                    value="start"
                    icon="1"
                  >
                    Inicio
                  </NavigationRail.Item>

                  <NavigationRail.Item
                    value="middle"
                    icon="2"
                  >
                    Centro
                  </NavigationRail.Item>

                  <NavigationRail.Item
                    value="end"
                    icon="3"
                  >
                    Final
                  </NavigationRail.Item>
                </NavigationRail>

                <RailContent title={indicator}>
                  Indicador activo:{" "}
                  <code>{indicator}</code>.
                </RailContent>
              </RailSandbox>
            ))}
          </Box>
        </DebugSection>

        <DebugSection
          title="Placement left y right"
          description="Comprueba bordes, safe area lateral y anclaje visual en ambos lados."
        >
          <Stack spacing="1rem">
            <RailSandbox height={320}>
              <NavigationRail
                position="static"
                placement="left"
                safeArea
                defaultValue="first"
                variant="surface"
                indicator="pill"
                labelBehavior="active"
                density="comfortable"
                aria-label="Rail colocado a la izquierda"
              >
                <NavigationRail.Item
                  value="first"
                  icon="Ⅰ"
                >
                  Primero
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="second"
                  icon="Ⅱ"
                >
                  Segundo
                </NavigationRail.Item>
              </NavigationRail>

              <RailContent title="placement left">
                El borde de superficie debe aparecer en el lado
                derecho del rail.
              </RailContent>
            </RailSandbox>

            <RailSandbox height={320}>
              <RailContent title="placement right">
                El borde de superficie debe aparecer en el lado
                izquierdo del rail.
              </RailContent>

              <NavigationRail
                position="static"
                placement="right"
                safeArea
                defaultValue="first"
                variant="surface"
                indicator="pill"
                labelBehavior="active"
                density="comfortable"
                aria-label="Rail colocado a la derecha"
              >
                <NavigationRail.Item
                  value="first"
                  icon="Ⅰ"
                >
                  Primero
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="second"
                  icon="Ⅱ"
                >
                  Segundo
                </NavigationRail.Item>
              </NavigationRail>
            </RailSandbox>
          </Stack>
        </DebugSection>

        <DebugSection
          title="Alignment"
          description="Comparación de start, center, end y stretch. Stretch se conserva para inspección porque su efecto actual puede ser indistinguible."
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {(
              [
                "start",
                "center",
                "end",
                "stretch",
              ] as const
            ).map((alignment) => (
              <RailSandbox
                key={alignment}
                height={360}
              >
                <NavigationRail
                  position="static"
                  safeArea={false}
                  defaultValue="one"
                  alignment={alignment}
                  variant="floating"
                  indicator="pill"
                  labelBehavior="never"
                  density="compact"
                  aria-label={`Alignment ${alignment}`}
                >
                  <NavigationRail.Item
                    value="one"
                    icon="1"
                  >
                    Uno
                  </NavigationRail.Item>

                  <NavigationRail.Item
                    value="two"
                    icon="2"
                  >
                    Dos
                  </NavigationRail.Item>

                  <NavigationRail.Item
                    value="three"
                    icon="3"
                  >
                    Tres
                  </NavigationRail.Item>
                </NavigationRail>

                <RailContent title={alignment}>
                  Observa la distribución vertical de los destinos.
                </RailContent>
              </RailSandbox>
            ))}
          </Box>
        </DebugSection>

        <DebugSection
          title="Posición sticky"
          description="El rail debe permanecer adherido al borde superior mientras se desplaza este sandbox."
        >
          <Box
            style={{
              height: 360,
              overflow: "auto",
              border: "1px solid var(--ui-border)",
              borderRadius: "var(--ui-radius-xl)",
              background: "var(--ui-surface-canvas)",
            }}
          >
            <Box
              style={{
                minHeight: 720,
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <NavigationRail
                position="sticky"
                placement="left"
                safeArea={false}
                defaultValue="one"
                variant="surface"
                indicator="pill"
                labelBehavior="active"
                density="comfortable"
                aria-label="Rail sticky"
              >
                <NavigationRail.Item
                  value="one"
                  icon="1"
                >
                  Uno
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="two"
                  icon="2"
                >
                  Dos
                </NavigationRail.Item>

                <NavigationRail.Item
                  value="three"
                  icon="3"
                >
                  Tres
                </NavigationRail.Item>
              </NavigationRail>

              <Box
                style={{
                  flex: 1,
                  padding: "1rem",
                  boxSizing: "border-box",
                }}
              >
                <Heading size="sm">
                  Área desplazable
                </Heading>

                {Array.from(
                  {
                    length: 10,
                  },
                  (_, index) => (
                    <Box
                      key={index}
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.85rem",
                        border:
                          "1px solid var(--ui-border)",
                        borderRadius:
                          "var(--ui-radius-lg)",
                        background:
                          "var(--ui-surface)",
                      }}
                    >
                      Elemento #{index + 1}
                    </Box>
                  )
                )}
              </Box>
            </Box>
          </Box>
        </DebugSection>

        <DebugSection
          title="Fixed aislado"
          description="La recipe recibe position=fixed, pero el slot root se restringe al sandbox para evitar que cubra la aplicación de pruebas."
        >
          <Box
            style={{
              position: "relative",
              height: 360,
              overflow: "hidden",
              border: "1px solid var(--ui-border)",
              borderRadius: "var(--ui-radius-xl)",
              background: "var(--ui-surface-canvas)",
              display: "flex",
            }}
          >
            <NavigationRail
              position="fixed"
              placement="left"
              safeArea={false}
              defaultValue="primary"
              variant="floating"
              indicator="pill"
              labelBehavior="active"
              density="comfortable"
              aria-label="Rail fixed aislado"
              styles={{
                root: {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                },
              }}
            >
              <NavigationRail.Item
                value="primary"
                icon="●"
              >
                Principal
              </NavigationRail.Item>

              <NavigationRail.Item
                value="secondary"
                icon="○"
              >
                Secundario
              </NavigationRail.Item>
            </NavigationRail>

            <Box
              style={{
                flex: 1,
                minWidth: 0,
                marginLeft: 100,
                padding: "1rem",
              }}
            >
              <Heading size="sm">
                Simulación de viewport
              </Heading>

              <Box
                as="p"
                style={{
                  color: "var(--ui-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                El override de posición mantiene el ejemplo dentro del
                catálogo sin cambiar el valor real de{" "}
                <code>position</code>.
              </Box>
            </Box>
          </Box>
        </DebugSection>

        <DebugSection
          title="Inspección accesible"
          description="Puntos concretos para revisar en DevTools o con un lector de pantalla."
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
              Los labels ocultos siguen siendo descendientes de sus
              botones.
            </li>

            <li>
              El destino activo contiene{" "}
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

            <li>
              El botón de footer tiene nombre accesible explícito.
            </li>

            <li>
              <code>alignment="stretch"</code> se conserva solo para
              validación visual antes de redefinir su contrato.
            </li>
          </Box>
        </DebugSection>
      </Stack>
    </Box>
  );
}

NavigationRailDebug.displayName =
  "NavigationRailDebug";