// internal-test/src/ScaffoldDebug.tsx

import React from "react";

import {
  Badge,
  BottomNavigation,
  Box,
  Button,
  Card,
  CardBody,
  FloatingActionButton,
  Heading,
  IconButton,
  Scaffold,
  ScreenContent,
  Stack,
  TopAppBar,
} from "zerina-ui";


type ScaffoldTab =
  | "home"
  | "tasks"
  | "activity"
  | "profile";


type Measurements = {
  parentHeight: number;
  scaffoldHeight: number;
  scrollClientHeight: number;
  scrollHeight: number;
  rootSlotPresent: boolean;
  scrollSlotPresent: boolean;
  screenPropsPresent: boolean;
  scrollPropsPresent: boolean;
};


type DebugSectionProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};


const TAB_LABELS: Record<
  ScaffoldTab,
  string
> = {
  home: "Inicio",
  tasks: "Tareas",
  activity: "Actividad",
  profile: "Perfil",
};


const TAB_SUBTITLES: Record<
  ScaffoldTab,
  string
> = {
  home: "Resumen de hoy",
  tasks: "Pendientes y seguimiento",
  activity: "Eventos recientes",
  profile: "Cuenta y preferencias",
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
                  color:
                    "var(--ui-text-muted)",
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
        border:
          "1px solid var(--ui-border)",
        borderRadius:
          "var(--ui-radius-md)",
        background:
          "var(--ui-surface-2)",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        lineHeight: 1.55,
      }}
    >
      {children}
    </Box>
  );
}


function ControlRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      {children}
    </Box>
  );
}


function PhoneSandbox({
  children,
  parentRef,
  height = 680,
}: {
  children: React.ReactNode;
  parentRef?:
    React.Ref<HTMLDivElement>;
  height?: number;
}) {
  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        ref={parentRef}
        style={{
          width:
            "min(100%, 390px)",
          height,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
          border:
            "1px solid var(--ui-border)",
          borderRadius: "28px",
          background: "var(--ui-bg)",
          boxShadow:
            "var(--ui-shadow-lg)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}


function DemoContent({
  tab,
  count,
}: {
  tab: ScaffoldTab;
  count: number;
}) {
  const items = React.useMemo(
    () =>
      Array.from(
        {
          length: count,
        },
        (_, index) => {
          const id =
            index + 1;

          return {
            id,

            title:
              tab === "home"
                ? `Resumen #${id}`
                : tab === "tasks"
                  ? `Tarea #${id}`
                  : tab === "activity"
                    ? `Evento #${id}`
                    : `Opción #${id}`,

            description:
              tab === "home"
                ? "Bloque de contenido dentro del Scaffold."
                : tab === "tasks"
                  ? "Elemento para validar scroll, padding y navegación inferior."
                  : tab === "activity"
                    ? "Registro de actividad con suficiente contenido para desplazar."
                    : "Configuración de perfil dentro de una pantalla contenida.",
          };
        }
      ),
    [
      count,
      tab,
    ]
  );

  return (
    <Stack spacing="0.75rem">
      <Box
        style={{
          padding: "0.9rem",
          borderRadius:
            "var(--ui-radius-lg)",
          border:
            "1px solid var(--ui-border)",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--ui-primary) 10%, var(--ui-surface)), var(--ui-surface))",
        }}
      >
        <Stack spacing="0.45rem">
          <Heading size="sm">
            {TAB_LABELS[tab]}
          </Heading>

          <Box
            style={{
              color:
                "var(--ui-text-muted)",
              fontSize:
                "var(--ui-font-size-sm)",
              lineHeight: 1.5,
            }}
          >
            Contenido para validar la composición entre Scaffold,
            ScreenContent, regiones estructurales y superficies de
            desplazamiento.
          </Box>
        </Stack>
      </Box>

      {items.map((item) => (
        <Box
          key={item.id}
          style={{
            padding: "0.85rem",
            borderRadius:
              "var(--ui-radius-lg)",
            border:
              "1px solid var(--ui-border)",
            background:
              "var(--ui-surface)",
            boxShadow:
              "var(--ui-shadow-sm)",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems:
                "flex-start",
              justifyContent:
                "space-between",
              gap: "0.75rem",
            }}
          >
            <Box
              style={{
                minWidth: 0,
              }}
            >
              <Box
                style={{
                  marginBottom:
                    "0.2rem",
                  fontWeight:
                    "var(--ui-font-weight-bold)",
                }}
              >
                {item.title}
              </Box>

              <Box
                style={{
                  color:
                    "var(--ui-text-muted)",
                  fontSize:
                    "var(--ui-font-size-sm)",
                  lineHeight: 1.45,
                }}
              >
                {item.description}
              </Box>
            </Box>

            <Badge
              variant="subtle"
              colorScheme={
                item.id % 2 === 0
                  ? "success"
                  : "primary"
              }
            >
              {item.id}
            </Badge>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}


function DemoAppBar({
  tab,
  centered,
  onBack,
}: {
  tab: ScaffoldTab;
  centered: boolean;
  onBack: () => void;
}) {
  return (
    <TopAppBar
      title={TAB_LABELS[tab]}
      subtitle={TAB_SUBTITLES[tab]}
      centerTitle={centered}
      variant="blur"
      leading={
        <IconButton
          ariaLabel="Volver"
          size="sm"
          variant="ghost"
          icon="‹"
          onPress={onBack}
        />
      }
      actions={
        <>
          <IconButton
            ariaLabel="Buscar"
            size="sm"
            variant="ghost"
            icon="⌕"
          />

          <IconButton
            ariaLabel="Más opciones"
            size="sm"
            variant="ghost"
            icon="⋯"
          />
        </>
      }
    />
  );
}


function DemoBottomNavigation({
  value,
  onChange,
}: {
  value: ScaffoldTab;
  onChange: (
    value: ScaffoldTab,
    reason:
      | "change"
      | "reselect"
  ) => void;
}) {
  return (
    <BottomNavigation
      position="static"
      safeArea={false}
      value={value}
      variant="floating"
      indicator="pill"
      labelBehavior="active"
      density="comfortable"
      aria-label="Navegación principal del Scaffold"
      onValueChange={(
        nextValue,
        _event,
        selection
      ) => {
        onChange(
          nextValue as ScaffoldTab,
          selection.reason
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
        value="tasks"
        icon="▣"
        badge={
          <Badge
            variant="solid"
            colorScheme="danger"
          >
            3
          </Badge>
        }
      >
        Tareas
      </BottomNavigation.Item>

      <BottomNavigation.Item
        value="activity"
        icon="≡"
      >
        Actividad
      </BottomNavigation.Item>

      <BottomNavigation.Item
        value="profile"
        icon="◉"
      >
        Perfil
      </BottomNavigation.Item>
    </BottomNavigation>
  );
}


export function ScaffoldDebug() {
  const [
    tab,
    setTab,
  ] = React.useState<ScaffoldTab>(
    "home"
  );

  const [
    centerTitle,
    setCenterTitle,
  ] = React.useState(true);

  const [
    padded,
    setPadded,
  ] = React.useState(true);

  const [
    scrollable,
    setScrollable,
  ] = React.useState(true);

  const [
    showAppBar,
    setShowAppBar,
  ] = React.useState(true);

  const [
    showFooter,
    setShowFooter,
  ] = React.useState(true);

  const [
    showFloating,
    setShowFloating,
  ] = React.useState(true);

  const [
    lastAction,
    setLastAction,
  ] = React.useState(
    "Sin interacciones."
  );

  const parentRef =
    React.useRef<HTMLDivElement>(
      null
    );

  const scaffoldRef =
    React.useRef<HTMLDivElement>(
      null
    );

  const [
    measurements,
    setMeasurements,
  ] = React.useState<Measurements>({
    parentHeight: 0,
    scaffoldHeight: 0,
    scrollClientHeight: 0,
    scrollHeight: 0,
    rootSlotPresent: false,
    scrollSlotPresent: false,
    screenPropsPresent: false,
    scrollPropsPresent: false,
  });

  const updateMeasurements =
    React.useCallback(() => {
      const parent =
        parentRef.current;

      const scaffold =
        scaffoldRef.current;

      const scrollElement =
        scaffold?.querySelector<HTMLElement>(
          "[data-debug-scaffold-scroll]"
        ) ?? null;

      setMeasurements({
        parentHeight:
          parent?.clientHeight ?? 0,

        scaffoldHeight:
          scaffold?.clientHeight ?? 0,

        scrollClientHeight:
          scrollElement?.clientHeight ??
          0,

        scrollHeight:
          scrollElement?.scrollHeight ??
          0,

        rootSlotPresent:
          scaffold?.hasAttribute(
            "data-debug-root-slot"
          ) ?? false,

        scrollSlotPresent:
          scrollElement?.hasAttribute(
            "data-debug-scroll-slot"
          ) ?? false,

        screenPropsPresent:
          scaffold?.id ===
          "debug-scaffold-screen-props",

        scrollPropsPresent:
          scrollElement?.id ===
          "debug-scaffold-scroll-props",
      });
    }, []);

  React.useEffect(() => {
    updateMeasurements();

    const observer =
      typeof ResizeObserver ===
      "undefined"
        ? null
        : new ResizeObserver(
            updateMeasurements
          );

    if (parentRef.current) {
      observer?.observe(
        parentRef.current
      );
    }

    if (scaffoldRef.current) {
      observer?.observe(
        scaffoldRef.current
      );
    }

    window.addEventListener(
      "resize",
      updateMeasurements
    );

    return () => {
      observer?.disconnect();

      window.removeEventListener(
        "resize",
        updateMeasurements
      );
    };
  }, [
    scrollable,
    showAppBar,
    showFooter,
    showFloating,
    tab,
    updateMeasurements,
  ]);

  return (
    <Box
      data-ui-scaffold-debug=""
      style={{
        width: "100%",
        maxWidth: 1120,
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <Stack spacing="1.5rem">
        <Box>
          <Heading>
            Scaffold
          </Heading>

          <Box
            as="p"
            style={{
              marginTop: "0.5rem",
              marginBottom: 0,
              color:
                "var(--ui-text-muted)",
              lineHeight: 1.6,
            }}
          >
            Validación de viewport contenido y de ventana, composición
            de props y slots, scroll administrado, contenido flotante,
            regiones opcionales, valores ReactNode falsy y ref al
            elemento raíz.
          </Box>
        </Box>


        <DebugSection
          title="Viewport contained y composición"
          description={
            <>
              El Scaffold debe ocupar exactamente el alto del padre.
              También se combinan <code>screenProps</code>,{" "}
              <code>scrollProps</code>, <code>styles</code> y{" "}
              <code>slotProps</code>.
            </>
          }
        >
          <ControlRow>
            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                setCenterTitle(
                  (current) =>
                    !current
                );
              }}
            >
              centerTitle:{" "}
              {String(centerTitle)}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                setPadded(
                  (current) =>
                    !current
                );
              }}
            >
              padded:{" "}
              {String(padded)}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                setScrollable(
                  (current) =>
                    !current
                );
              }}
            >
              scaffold scrollable:{" "}
              {String(scrollable)}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                setShowAppBar(
                  (current) =>
                    !current
                );
              }}
            >
              appBar:{" "}
              {String(showAppBar)}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                setShowFooter(
                  (current) =>
                    !current
                );
              }}
            >
              footer:{" "}
              {String(showFooter)}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                setShowFloating(
                  (current) =>
                    !current
                );
              }}
            >
              floating:{" "}
              {String(showFloating)}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={
                updateMeasurements
              }
            >
              Actualizar medición
            </Button>
          </ControlRow>

          <StatusPanel>
            Alto del padre:{" "}
            {measurements.parentHeight}px
            <br />
            Alto del Scaffold:{" "}
            {measurements.scaffoldHeight}px
            <br />
            Coinciden:{" "}
            {String(
              measurements.parentHeight ===
                measurements.scaffoldHeight
            )}
            <br />
            Scroll clientHeight:{" "}
            {measurements.scrollClientHeight}px
            <br />
            Scroll scrollHeight:{" "}
            {measurements.scrollHeight}px
            <br />
            Tiene overflow:{" "}
            {String(
              measurements.scrollHeight >
                measurements.scrollClientHeight
            )}
            <br />
            slotProps.root presente:{" "}
            {String(
              measurements.rootSlotPresent
            )}
            <br />
            slotProps.scroll presente:{" "}
            {String(
              measurements.scrollSlotPresent
            )}
            <br />
            screenProps presente:{" "}
            {String(
              measurements.screenPropsPresent
            )}
            <br />
            scrollProps presente:{" "}
            {String(
              measurements.scrollPropsPresent
            )}
            <br />
            Responsable del scroll:{" "}
            {scrollable
              ? "Scaffold / Screen.Scroll"
              : "ninguno en este ejemplo"}
            <br />
            Última acción:{" "}
            {lastAction}
          </StatusPanel>

          <PhoneSandbox
            parentRef={parentRef}
          >
            <Scaffold
              ref={scaffoldRef}
              viewport="contained"
              scrollable={scrollable}
              appBar={
                showAppBar ? (
                  <DemoAppBar
                    tab={tab}
                    centered={
                      centerTitle
                    }
                    onBack={() => {
                      setLastAction(
                        "Acción leading del app bar."
                      );
                    }}
                  />
                ) : null
              }
              footer={
                showFooter ? (
                  <DemoBottomNavigation
                    value={tab}
                    onChange={(
                      nextTab,
                      reason
                    ) => {
                      setLastAction(
                        `${reason}: ${TAB_LABELS[nextTab]}`
                      );

                      if (
                        reason ===
                        "change"
                      ) {
                        setTab(
                          nextTab
                        );
                      }
                    }}
                  />
                ) : null
              }
              floating={
                showFloating ? (
                  <FloatingActionButton
                    aria-label="Nueva acción"
                    icon="+"
                    onPress={() => {
                      setLastAction(
                        `Acción flotante en ${TAB_LABELS[tab]}.`
                      );
                    }}
                  />
                ) : null
              }
              screenProps={{
                id:
                  "debug-scaffold-screen-props",

                safeArea: {
                  top: true,
                  bottom: true,
                },

                className:
                  "debug-scaffold-screen-props",

                style: {
                  outline:
                    "2px solid color-mix(in srgb, var(--ui-primary) 18%, transparent)",
                  outlineOffset:
                    "-2px",
                },
              }}
              scrollProps={{
                id:
                  "debug-scaffold-scroll-props",

                className:
                  "debug-scaffold-scroll-props",

                style: {
                  scrollPaddingTop:
                    "0.75rem",
                },
              }}
              styles={{
                root: {
                  background:
                    "linear-gradient(180deg, var(--ui-bg), color-mix(in srgb, var(--ui-primary) 4%, var(--ui-bg)))",
                },

                body: {
                  background:
                    "color-mix(in srgb, var(--ui-surface) 35%, transparent)",
                },

                scroll: {
                  paddingTop:
                    "0.25rem",
                },

                floating: {
                  padding: "1rem",
                },
              }}
              slotProps={{
                root: {
                  "data-debug-root-slot":
                    "",
                },

                body: {
                  "data-debug-body-slot":
                    "",
                },

                scroll: {
                  "data-debug-scaffold-scroll":
                    "",

                  "data-debug-scroll-slot":
                    "",
                },

                floating: {
                  "data-debug-floating-slot":
                    "",
                },

                footer: {
                  "data-debug-footer-slot":
                    "",
                },
              }}
            >
              <ScreenContent
                padded={padded}
                scrollable={false}
              >
                <DemoContent
                  tab={tab}
                  count={
                    tab ===
                    "activity"
                      ? 18
                      : 11
                  }
                />
              </ScreenContent>
            </Scaffold>
          </PhoneSandbox>

          <Box
            style={{
              padding: "0.75rem",
              borderRadius:
                "var(--ui-radius-md)",
              border:
                "1px solid var(--ui-border)",
              background:
                "var(--ui-surface)",
              color:
                "var(--ui-text-muted)",
              fontSize:
                "var(--ui-font-size-sm)",
              lineHeight: 1.55,
            }}
          >
            El floating debe permanecer en la esquina inferior derecha
            del body. No debe cubrir el footer, porque el overlay está
            contenido dentro de <code>Screen.Body</code>.
          </Box>
        </DebugSection>


        <DebugSection
          title="Scroll administrado por ScreenContent"
          description={
            <>
              En este ejemplo <code>Scaffold.scrollable=false</code> y{" "}
              <code>ScreenContent.scrollable=true</code>. Solo debe
              existir una superficie responsable del scroll.
            </>
          }
        >
          <PhoneSandbox height={520}>
            <Scaffold
              viewport="contained"
              scrollable={false}
              appBar={
                <TopAppBar
                  title="Scroll interno"
                  subtitle="Responsabilidad de ScreenContent"
                  centerTitle
                  variant="blur"
                />
              }
              footer={
                <Box
                  style={{
                    padding:
                      "0.75rem",
                    textAlign:
                      "center",
                    borderTop:
                      "1px solid var(--ui-border)",
                    background:
                      "var(--ui-surface)",
                  }}
                >
                  Footer fuera del scroll
                </Box>
              }
            >
              <ScreenContent
                padded
                scrollable
              >
                <DemoContent
                  tab="tasks"
                  count={16}
                />
              </ScreenContent>
            </Scaffold>
          </PhoneSandbox>
        </DebugSection>


        <DebugSection
          title="Viewport window aislado"
          description={
            <>
              El valor real continúa siendo <code>viewport="window"</code>,
              pero <code>styles.root</code> limita visualmente el
              ejemplo para que no invada el catálogo.
            </>
          }
        >
          <Box
            style={{
              position: "relative",
              height: 460,
              overflow: "hidden",
              border:
                "1px solid var(--ui-border)",
              borderRadius:
                "var(--ui-radius-xl)",
              background:
                "var(--ui-bg)",
            }}
          >
            <Scaffold
              viewport="window"
              scrollable
              appBar={
                <TopAppBar
                  title="Viewport window"
                  subtitle="Aislado dentro del catálogo"
                  centerTitle
                  variant="blur"
                />
              }
              floating={
                <FloatingActionButton
                  aria-label="Acción de ventana"
                  icon="+"
                />
              }
              footer={
                <Box
                  style={{
                    padding:
                      "0.75rem",
                    textAlign:
                      "center",
                    background:
                      "var(--ui-surface)",
                    borderTop:
                      "1px solid var(--ui-border)",
                  }}
                >
                  Footer del viewport window
                </Box>
              }
              styles={{
                root: {
                  position:
                    "absolute",
                  inset: 0,
                  height: "100%",
                  minHeight: 0,
                },
              }}
            >
              <ScreenContent
                padded
                scrollable={false}
              >
                <DemoContent
                  tab="activity"
                  count={14}
                />
              </ScreenContent>
            </Scaffold>
          </Box>
        </DebugSection>


        <DebugSection
          title="Regiones con ReactNode falsy válido"
          description={
            <>
              <code>0</code> es un ReactNode válido y debe conservarse
              como contenido de app bar, footer y floating. Los
              booleanos no deben crear regiones vacías.
            </>
          }
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <Box>
              <Heading size="sm">
                appBar, footer y floating = 0
              </Heading>

              <Box
                style={{
                  height: 260,
                  marginTop:
                    "0.75rem",
                  overflow:
                    "hidden",
                  border:
                    "1px solid var(--ui-border)",
                  borderRadius:
                    "var(--ui-radius-xl)",
                }}
              >
                <Scaffold
                  viewport="contained"
                  appBar={0}
                  footer={0}
                  floating={0}
                  styles={{
                    appBar: {
                      padding:
                        "0.5rem",
                      background:
                        "var(--ui-surface-2)",
                    },

                    footer: {
                      padding:
                        "0.5rem",
                      background:
                        "var(--ui-surface-2)",
                    },

                    floating: {
                      padding:
                        "1rem",
                      color:
                        "var(--ui-primary)",
                      fontWeight:
                        "var(--ui-font-weight-bold)",
                    },
                  }}
                >
                  <Box
                    style={{
                      padding: "1rem",
                    }}
                  >
                    Las tres regiones deben contener un cero visible.
                  </Box>
                </Scaffold>
              </Box>
            </Box>

            <Box>
              <Heading size="sm">
                Regiones booleanas
              </Heading>

              <Box
                style={{
                  height: 260,
                  marginTop:
                    "0.75rem",
                  overflow:
                    "hidden",
                  border:
                    "1px solid var(--ui-border)",
                  borderRadius:
                    "var(--ui-radius-xl)",
                }}
              >
                <Scaffold
                  viewport="contained"
                  appBar={false}
                  footer={true}
                  floating={false}
                >
                  <Box
                    style={{
                      padding: "1rem",
                    }}
                  >
                    No deben aparecer wrappers vacíos para valores
                    booleanos.
                  </Box>
                </Scaffold>
              </Box>
            </Box>
          </Box>
        </DebugSection>


        <DebugSection
          title="Inspección estructural"
          description="Puntos concretos para revisar en DevTools y durante la validación visual."
        >
          <Box
            as="ul"
            style={{
              margin: 0,
              paddingLeft:
                "1.25rem",
              lineHeight: 1.7,
            }}
          >
            <li>
              El Scaffold contained tiene el mismo{" "}
              <code>clientHeight</code> que su contenedor padre.
            </li>

            <li>
              El ref recibido apunta al elemento raíz de{" "}
              <code>Screen</code>.
            </li>

            <li>
              Los atributos de <code>screenProps</code>,{" "}
              <code>scrollProps</code> y <code>slotProps</code> están
              presentes simultáneamente.
            </li>

            <li>
              Los estilos de <code>screenProps.style</code> y{" "}
              <code>styles.root</code> se componen sin desaparecer.
            </li>

            <li>
              Los estilos de <code>scrollProps.style</code> y{" "}
              <code>styles.scroll</code> se conservan.
            </li>

            <li>
              Cuando Scaffold administra el scroll, ScreenContent usa{" "}
              <code>scrollable=false</code>.
            </li>

            <li>
              Cuando ScreenContent administra el scroll, Scaffold usa{" "}
              <code>scrollable=false</code>.
            </li>

            <li>
              El contenido flotante está limitado al body y no cubre
              el app bar ni el footer.
            </li>

            <li>
              Los valores numéricos <code>0</code> crean regiones; los
              booleanos no.
            </li>

            <li>
              App bar y footer continúan ocupando espacio estructural
              real.
            </li>
          </Box>
        </DebugSection>
      </Stack>
    </Box>
  );
}


ScaffoldDebug.displayName =
  "ScaffoldDebug";