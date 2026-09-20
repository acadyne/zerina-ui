import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  FloatingActionButton,
  Heading,
  IconButton,
  ScreenContent,
  Stack,
  TabScaffold,
  TopAppBar,
  type NavigationStackEntry,
  type NavigationStackParams,
  type NavigationStackScreenRenderProps,
  type NavigationStackTransitionDirection,
  type TabScaffoldScreen,
  type TabScaffoldTab,
  useTabScaffold,
  useToast,
} from "zerina-ui";

const initialParams: NavigationStackParams = {
  source: "tab-scaffold-debug",
  initialized: true,
};

const tabs: TabScaffoldTab[] = [
  {
    value: "home",
    label: "Inicio",
    icon: "⌂",
  },
  {
    value: "tasks",
    label: "Tareas",
    icon: "▣",
    badge: (
      <Badge
        variant="solid"
        colorScheme="danger"
      >
        5
      </Badge>
    ),
  },
  {
    value: "activity",
    label: "Actividad",
    icon: "≡",
  },
  {
    value: "profile",
    label: "Perfil",
    icon: "◉",
  },
  {
    value: "disabled",
    label: "Bloqueado",
    icon: "×",
    disabled: true,
  },
];

const orphanTabs: TabScaffoldTab[] = [
  ...tabs,
  {
    value: "orphan",
    label: "Sin pantalla",
    icon: "?",
  },
];

const screenBoxStyle: React.CSSProperties = {
  padding: "0.85rem",
  borderRadius: "var(--ui-radius-lg)",
  border: "1px solid var(--ui-border)",
  background: "var(--ui-surface)",
};

function nextEntry(
  key: string,
  name: string,
  params?: NavigationStackParams
): NavigationStackEntry {
  return {
    key,
    name,
    params,
  };
}

function ScreenFrame({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ScreenContent
      padded
      scrollable
      scrollbar="thin"
    >
      {children}
    </ScreenContent>
  );
}

function DebugSection({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardBody>
        <Stack spacing="0.75rem">
          <Heading size="sm">
            {title}
          </Heading>

          {description !== undefined ? (
            <Box
              style={{
                color:
                  "var(--ui-text-muted)",
                fontSize:
                  "var(--ui-font-size-sm)",
                lineHeight: 1.5,
              }}
            >
              {description}
            </Box>
          ) : null}

          {children}
        </Stack>
      </CardBody>
    </Card>
  );
}

function ContextPanel() {
  const context = useTabScaffold();

  return (
    <Box
      data-debug-context-panel=""
      style={{
        padding: "0.75rem",
        borderRadius:
          "var(--ui-radius-md)",
        border:
          "1px solid var(--ui-border)",
        background:
          "color-mix(in srgb, var(--ui-primary) 5%, var(--ui-surface))",
      }}
    >
      <Stack spacing="0.35rem">
        <Box
          style={{
            fontWeight:
              "var(--ui-font-weight-bold)",
          }}
        >
          Estado del contexto
        </Box>

        <Box
          style={{
            color:
              "var(--ui-text-muted)",
            fontSize:
              "var(--ui-font-size-sm)",
            lineHeight: 1.5,
          }}
        >
          activeTab:{" "}
          <strong>
            {context.activeTab || "—"}
          </strong>
          <br />
          current:{" "}
          <strong>
            {context.current?.name ?? "null"}
          </strong>
          <br />
          canGoBack:{" "}
          <strong>
            {String(context.canGoBack)}
          </strong>
          <br />
          depth:{" "}
          <strong>
            {context.entries.length}
          </strong>
        </Box>

        <pre
          style={{
            margin: 0,
            maxHeight: 150,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            color:
              "var(--ui-text-muted)",
            fontSize: "0.75rem",
            lineHeight: 1.45,
          }}
        >
          {JSON.stringify(
            context.entries,
            null,
            2
          )}
        </pre>
      </Stack>
    </Box>
  );
}

function HomeScreen({
  navigation,
  route,
}: NavigationStackScreenRenderProps) {
  const sequenceRef =
    React.useRef(1);

  return (
    <ScreenFrame>
      <Stack spacing="0.75rem">
        <Heading size="sm">
          Home por component
        </Heading>

        <ContextPanel />

        <Box style={screenBoxStyle}>
          <Box
            style={{
              fontWeight:
                "var(--ui-font-weight-bold)",
            }}
          >
            Initial params
          </Box>

          <pre
            style={{
              margin:
                "0.5rem 0 0",
              whiteSpace:
                "pre-wrap",
              color:
                "var(--ui-text-muted)",
              fontSize:
                "0.78rem",
            }}
          >
            {JSON.stringify(
              route.params ?? {},
              null,
              2
            )}
          </pre>
        </Box>

        <Button
          onPress={() => {
            const id =
              sequenceRef.current;

            sequenceRef.current += 1;

            navigation.push(
              "details",
              {
                from: "home",
                id,
              }
            );
          }}
        >
          Push detail
        </Button>

        <Button
          variant="outline"
          onPress={() => {
            navigation.push(
              "details",
              {
                from: "home",
                repeated: true,
              }
            );

            navigation.push(
              "details",
              {
                from: "home",
                repeated: true,
              }
            );
          }}
        >
          Push repetido
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            navigation.replace(
              "tasks",
              {
                replacedFrom:
                  "home",
              }
            )
          }
        >
          Replace con tasks
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            navigation.reset(
              "profile",
              {
                resetFrom: "home",
              }
            )
          }
        >
          Reset a profile
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            navigation.push(
              "missing-screen",
              {
                expected:
                  "fallback",
              }
            )
          }
        >
          Push pantalla faltante
        </Button>

        {Array.from(
          {
            length: 10,
          },
          (_, index) => (
            <Box
              key={index}
              style={
                screenBoxStyle
              }
            >
              Fila scrolleable #
              {index + 1}
            </Box>
          )
        )}
      </Stack>
    </ScreenFrame>
  );
}

function TasksScreen({
  navigation,
}: NavigationStackScreenRenderProps) {
  return (
    <ScreenFrame>
      <Stack spacing="0.75rem">
        <Heading size="sm">
          Tasks por render
        </Heading>

        <ContextPanel />

        {Array.from(
          {
            length: 12,
          },
          (_, index) => (
            <Box
              key={index}
              style={
                screenBoxStyle
              }
            >
              <Stack spacing="0.4rem">
                <Box
                  style={{
                    fontWeight:
                      "var(--ui-font-weight-bold)",
                  }}
                >
                  Tarea #{index + 1}
                </Box>

                <Button
                  size="sm"
                  variant="outline"
                  onPress={() =>
                    navigation.push(
                      "details",
                      {
                        from:
                          "tasks",
                        taskId:
                          index + 1,
                      }
                    )
                  }
                >
                  Abrir detalle
                </Button>
              </Stack>
            </Box>
          )
        )}
      </Stack>
    </ScreenFrame>
  );
}

function ProfileScreen() {
  const context =
    useTabScaffold();

  return (
    <ScreenFrame>
      <Stack spacing="0.75rem">
        <Heading size="sm">
          Profile
        </Heading>

        <ContextPanel />

        <Box style={screenBoxStyle}>
          <Stack spacing="0.5rem">
            <Box
              style={{
                fontWeight:
                  "var(--ui-font-weight-bold)",
              }}
            >
              Fabian
            </Box>

            <Box
              style={{
                color:
                  "var(--ui-text-muted)",
                fontSize:
                  "var(--ui-font-size-sm)",
              }}
            >
              Developer · Zerina UI
            </Box>
          </Stack>
        </Box>

        <Button
          onPress={() =>
            context.push(
              "details",
              {
                from:
                  "profile",
              }
            )
          }
        >
          Abrir detalle
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            context.resetToTab(
              "home"
            )
          }
        >
          resetToTab home
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            context.resetToTab(
              "disabled"
            )
          }
        >
          Intentar tab disabled
        </Button>
      </Stack>
    </ScreenFrame>
  );
}

function DetailsScreen({
  navigation,
  route,
}: NavigationStackScreenRenderProps) {
  return (
    <ScreenFrame>
      <Stack spacing="0.75rem">
        <Heading size="sm">
          Detalle
        </Heading>

        <ContextPanel />

        <Box style={screenBoxStyle}>
          <Box
            style={{
              fontWeight:
                "var(--ui-font-weight-bold)",
              marginBottom:
                "0.45rem",
            }}
          >
            Route params
          </Box>

          <pre
            style={{
              margin: 0,
              overflow: "auto",
              whiteSpace:
                "pre-wrap",
              color:
                "var(--ui-text-muted)",
              fontSize:
                "0.78rem",
              lineHeight: 1.45,
            }}
          >
            {JSON.stringify(
              route.params ?? {},
              null,
              2
            )}
          </pre>
        </Box>

        <Button
          onPress={() =>
            navigation.push(
              "details",
              {
                nested: true,
              }
            )
          }
        >
          Push otro detail
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            navigation.pop()
          }
        >
          Pop
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            navigation.popToRoot()
          }
        >
          Pop to root
        </Button>
      </Stack>
    </ScreenFrame>
  );
}

const screens: TabScaffoldScreen[] = [
  {
    name: "home",
    title: "Inicio",
    subtitle:
      "Pantalla declarada con component",
    component: HomeScreen,
  },
  {
    name: "tasks",
    title: "Tareas",
    subtitle: ({
      entries,
    }) =>
      `Profundidad ${entries.length}`,
    render: (props) => (
      <TasksScreen
        {...props}
      />
    ),
  },
  {
    name: "activity",
    title: 0,
    subtitle: false,
    element: (
      <ScreenFrame>
        <Stack spacing="0.75rem">
          <Heading size="sm">
            Activity por element
          </Heading>

          <ContextPanel />

          {Array.from(
            {
              length: 18,
            },
            (_, index) => (
              <Box
                key={index}
                style={
                  screenBoxStyle
                }
              >
                <Box
                  style={{
                    display:
                      "flex",
                    gap: "0.65rem",
                    alignItems:
                      "flex-start",
                  }}
                >
                  <Badge
                    variant="subtle"
                    colorScheme="primary"
                  >
                    {index + 1}
                  </Badge>

                  <Box>
                    Evento de actividad

                    <Box
                      style={{
                        marginTop:
                          "0.2rem",
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Pantalla declarada con
                      element.
                    </Box>
                  </Box>
                </Box>
              </Box>
            )
          )}
        </Stack>
      </ScreenFrame>
    ),
  },
  {
    name: "profile",
    title: "",
    subtitle: 0,
    component: ProfileScreen,
  },
  {
    name: "details",
    title: "Detalle",
    subtitle: ({
      activeTab,
      entries,
    }) =>
      `Desde ${activeTab} · profundidad ${entries.length}`,
    component: DetailsScreen,
  },
];

function PhoneFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        justifyContent:
          "center",
      }}
    >
      <Box
        style={{
          width:
            "min(100%, 390px)",
          height: 700,
          position:
            "relative",
          overflow: "hidden",
          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "28px",
          background:
            "var(--ui-bg)",
          boxShadow:
            "var(--ui-shadow-lg)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function EventLog({
  entries,
}: {
  entries: string[];
}) {
  return (
    <Box
      style={{
        padding: "0.75rem",
        maxHeight: 180,
        overflow: "auto",
        borderRadius:
          "var(--ui-radius-md)",
        border:
          "1px solid var(--ui-border)",
        background:
          "var(--ui-surface)",
      }}
    >
      <Box
        style={{
          fontWeight:
            "var(--ui-font-weight-bold)",
          marginBottom:
            "0.4rem",
        }}
      >
        Eventos
      </Box>

      {entries.length > 0 ? (
        <Stack spacing="0.25rem">
          {entries.map(
            (entry, index) => (
              <Box
                key={`${entry}-${index}`}
                style={{
                  color:
                    "var(--ui-text-muted)",
                  fontSize:
                    "var(--ui-font-size-sm)",
                }}
              >
                {entry}
              </Box>
            )
          )}
        </Stack>
      ) : (
        <Box
          style={{
            color:
              "var(--ui-text-muted)",
            fontSize:
              "var(--ui-font-size-sm)",
          }}
        >
          Sin eventos.
        </Box>
      )}
    </Box>
  );
}

function UncontrolledExample() {
  const { toast } =
    useToast();

  const rootRef =
    React.useRef<HTMLDivElement>(
      null
    );

  const [
    events,
    setEvents,
  ] =
    React.useState<string[]>(
      []
    );

  const appendEvent =
    React.useCallback(
      (message: string) => {
        setEvents(
          (current) => [
            message,
            ...current,
          ].slice(0, 12)
        );
      },
      []
    );

  return (
    <DebugSection
      title="No controlado"
      description="Camino principal: initialParams, cambios de tab, reselección, stack, slots, DOM props, ref, app bar, floating y bottom navigation."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            const root =
              rootRef.current;

            toast({
              title:
                "TabScaffold ref",
              description:
                root
                  ? `Root: ${root.tagName.toLowerCase()} · slot=${root.getAttribute(
                      "data-debug-root"
                    )}`
                  : "Ref no disponible.",
              variant:
                root
                  ? "success"
                  : "danger",
            });
          }}
        >
          Inspeccionar root ref
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() =>
            setEvents([])
          }
        >
          Limpiar eventos
        </Button>
      </Stack>

      <PhoneFrame>
        <TabScaffold
          ref={rootRef}
          data-debug-root="uncontrolled"
          aria-label="Tab Scaffold no controlado"
          viewport="contained"
          tabs={tabs}
          screens={screens}
          initialTab="home"
          initialParams={
            initialParams
          }
          animation="slide"
          onTabChange={(tab) => {
            appendEvent(
              `onTabChange: ${tab}`
            );
          }}
          onEntriesChange={(
            nextEntries,
            direction
          ) => {
            appendEvent(
              `onEntriesChange: ${direction} · ${nextEntries
                .map(
                  (entry) =>
                    entry.name
                )
                .join(" > ")}`
            );
          }}
          rootLeading={() => (
            <IconButton
              ariaLabel="Menú"
              size="sm"
              variant="ghost"
              icon="≡"
              onPress={() =>
                toast({
                  title: "Menú",
                  description:
                    "rootLeading visible en root.",
                  variant:
                    "info",
                })
              }
            />
          )}
          actions={(context) => (
            <IconButton
              ariaLabel="Nueva pantalla"
              size="sm"
              variant="ghost"
              icon="+"
              onPress={() =>
                context.push(
                  "details",
                  {
                    via:
                      "top-app-bar",
                  }
                )
              }
            />
          )}
          floating={(context) => (
            <FloatingActionButton
              aria-label="Nuevo detalle"
              icon="+"
              onPress={() =>
                context.push(
                  "details",
                  {
                    via:
                      "floating-action",
                  }
                )
              }
            />
          )}
          styles={{
            root: {
              outline:
                "1px solid color-mix(in srgb, var(--ui-primary) 14%, transparent)",
              outlineOffset:
                "-1px",
            },
            appBar: {
              boxShadow:
                "0 1px 0 color-mix(in srgb, var(--ui-primary) 14%, transparent)",
            },
            stack: {
              background:
                "color-mix(in srgb, var(--ui-primary) 3%, var(--ui-bg))",
            },
            screen: {
              background:
                "color-mix(in srgb, var(--ui-surface) 97%, transparent)",
            },
            bottomNavigation: {
              paddingInline:
                "0.5rem",
              paddingBottom:
                "0.25rem",
            },
            floating: {
              pointerEvents:
                "auto",
            },
          }}
          slotProps={{
            root: {
              "data-debug-slot-root":
                "preserved",
              onClick: () => {
                appendEvent(
                  "root slot onClick"
                );
              },
            },
            appBar: {
              "data-debug-slot-app-bar":
                "preserved",
            },
            stack: {
              "data-debug-slot-stack":
                "preserved",
            },
            screen: {
              "data-debug-slot-screen":
                "preserved",
              tabIndex: 0,
              "aria-label":
                "Pantalla activa de TabScaffold",
            },
            bottomNavigation: {
              "data-debug-slot-bottom-navigation":
                "preserved",
            },
            floating: {
              "data-debug-slot-floating":
                "preserved",
            },
          }}
          bottomNavigationProps={{
            variant:
              "floating",
            indicator:
              "pill",
            labelBehavior:
              "active",
            density:
              "comfortable",
            badgeAnchor:
              "icon",
            badgePlacement:
              "top-end",
            itemMinWidth: 58,
          }}
        />
      </PhoneFrame>

      <EventLog
        entries={events}
      />
    </DebugSection>
  );
}

function ControlledExample() {
  const [
    controlledEntries,
    setControlledEntries,
  ] =
    React.useState<
      NavigationStackEntry[]
    >([]);

  const [
    direction,
    setDirection,
  ] =
    React.useState<NavigationStackTransitionDirection>(
      "replace"
    );

  const [
    events,
    setEvents,
  ] =
    React.useState<string[]>(
      []
    );

  return (
    <DebugSection
      title="Controlado con entries=[]"
      description="El stack efectivo debe seguir mostrando la raíz fallback. El primer push debe emitir raíz + pantalla nueva."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setControlledEntries(
              []
            );
            setDirection(
              "replace"
            );
          }}
        >
          Vaciar entries
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setControlledEntries([
              nextEntry(
                "controlled-home",
                "home",
                {
                  controlled:
                    true,
                }
              ),
            ]);
            setDirection(
              "replace"
            );
          }}
        >
          Inyectar root
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setControlledEntries([
              nextEntry(
                "invalid-root",
                "external-root",
                {
                  invalid:
                    true,
                }
              ),
            ]);
            setDirection(
              "replace"
            );
          }}
        >
          Root controlado inválido
        </Button>
      </Stack>

      <Box
        style={{
          padding: "0.75rem",
          borderRadius:
            "var(--ui-radius-md)",
          border:
            "1px solid var(--ui-border)",
          background:
            "var(--ui-surface)",
          fontSize:
            "var(--ui-font-size-sm)",
          color:
            "var(--ui-text-muted)",
        }}
      >
        entries controladas:{" "}
        {controlledEntries.length}
        <br />
        direction: {direction}
      </Box>

      <PhoneFrame>
        <TabScaffold
          viewport="contained"
          tabs={tabs}
          screens={screens}
          initialTab="home"
          initialParams={{
            controlledFallback:
              true,
          }}
          entries={
            controlledEntries
          }
          transitionDirection={
            direction
          }
          onEntriesChange={(
            nextEntries,
            nextDirection
          ) => {
            setControlledEntries(
              nextEntries
            );
            setDirection(
              nextDirection
            );

            setEvents(
              (current) => [
                `${nextDirection}: ${nextEntries
                  .map(
                    (entry) =>
                      entry.name
                  )
                  .join(" > ")}`,
                ...current,
              ].slice(0, 12)
            );
          }}
          onTabChange={(tab) => {
            setEvents(
              (current) => [
                `tab: ${tab}`,
                ...current,
              ].slice(0, 12)
            );
          }}
          actions={(context) => (
            <IconButton
              ariaLabel="Push controlado"
              icon="+"
              size="sm"
              variant="ghost"
              onPress={() =>
                context.push(
                  "details",
                  {
                    controlled:
                      true,
                  }
                )
              }
            />
          )}
          bottomNavigationProps={{
            labelBehavior:
              "active",
            indicator:
              "pill",
          }}
        />
      </PhoneFrame>

      <EventLog
        entries={events}
      />
    </DebugSection>
  );
}

function VisibilityExample() {
  return (
    <DebugSection
      title="Visibilidad y renderers"
      description="Contratos de showAppBar, showBottomNavigation, renderAppBar y renderBottomNavigation."
    >
      <Stack spacing="1rem">
        <Box>
          <Heading size="sm">
            Sin app bar
          </Heading>

          <PhoneFrame>
            <TabScaffold
              viewport="contained"
              tabs={tabs.slice(
                0,
                3
              )}
              screens={screens}
              initialTab="home"
              showAppBar={false}
                />
          </PhoneFrame>
        </Box>

        <Box>
          <Heading size="sm">
            Sin bottom navigation
          </Heading>

          <PhoneFrame>
            <TabScaffold
              viewport="contained"
              tabs={tabs.slice(
                0,
                3
              )}
              screens={screens}
              initialTab="home"
              showBottomNavigation={
                false
              }
                />
          </PhoneFrame>
        </Box>

        <Box>
          <Heading size="sm">
            Renderers personalizados
          </Heading>

          <PhoneFrame>
            <TabScaffold
              viewport="contained"
              tabs={tabs.slice(
                0,
                3
              )}
              screens={screens}
              initialTab="home"
                  renderAppBar={(
                context
              ) => (
                <TopAppBar
                  title={`Custom · ${context.activeTab}`}
                  subtitle={`Depth ${context.entries.length}`}
                  variant="blur"
                />
              )}
              renderBottomNavigation={(
                context
              ) => (
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
                  Custom bottom ·{" "}
                  {context.activeTab}
                </Box>
              )}
            />
          </PhoneFrame>
        </Box>
      </Stack>
    </DebugSection>
  );
}

function FalsyRegionsExample() {
  return (
    <DebugSection
      title="ReactNode falsy válido"
      description="Los valores 0 deben conservar wrapper; null, undefined y boolean no deben crearlo."
    >
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
        }}
      >
        Deben verse tres ceros: app
        bar, bottom navigation y
        floating.
      </Box>

      <PhoneFrame>
        <TabScaffold
          viewport="contained"
          tabs={[
            {
              value:
                "home",
              label: "Home",
            },
          ]}
          screens={screens}
          initialTab="home"
          renderAppBar={() =>
            0
          }
          renderBottomNavigation={() =>
            0
          }
          floating={0}
          slotProps={{
            appBar: {
              "data-debug-falsy-app-bar":
                "0",
            },
            bottomNavigation: {
              "data-debug-falsy-bottom-navigation":
                "0",
            },
            floating: {
              "data-debug-falsy-floating":
                "0",
            },
          }}
        />
      </PhoneFrame>
    </DebugSection>
  );
}

function OrphanTabExample() {
  return (
    <DebugSection
      title="Configuración inválida visible"
      description="El tab orphan no tiene una pantalla raíz registrada. TabScaffold no debe normalizar silenciosamente esta configuración."
    >
      <PhoneFrame>
        <TabScaffold
          viewport="contained"
          tabs={orphanTabs}
          screens={screens}
          initialTab="home"
          bottomNavigationProps={{
            labelBehavior:
              "active",
            indicator:
              "pill",
          }}
        />
      </PhoneFrame>
    </DebugSection>
  );
}

function NoEnabledTabsExample() {
  const noEnabledTabs: TabScaffoldTab[] =
    [
      {
        value: "disabled",
        label:
          "Solo disabled",
        disabled: true,
      },
    ];

  return (
    <DebugSection
      title="Sin tabs habilitados"
      description="No debe crearse una entrada con name vacío. Se renderiza el fallback del patrón."
    >
      <Box
        style={{
          height: 260,
          overflow: "hidden",
          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "var(--ui-radius-xl)",
        }}
      >
        <TabScaffold
          viewport="contained"
          tabs={noEnabledTabs}
          screens={[]}
          data-debug-no-enabled-tabs=""
        />
      </Box>
    </DebugSection>
  );
}

function ManualChecklist() {
  return (
    <DebugSection title="Checklist manual">
      <Box
        as="ul"
        style={{
          margin: 0,
          paddingLeft:
            "1.25rem",
          color:
            "var(--ui-text-muted)",
          fontSize:
            "var(--ui-font-size-sm)",
          lineHeight: 1.7,
        }}
      >
        <li>
          Cambiar de tab reemplaza todo
          el historial por una raíz nueva.
        </li>

        <li>
          Reseleccionar el tab activo con
          profundidad ejecuta popToRoot.
        </li>

        <li>
          Reseleccionar estando en root no
          emite onEntriesChange ni onTabChange.
        </li>

        <li>
          El tab disabled no cambia el
          estado.
        </li>

        <li>
          En profundidad aparece BackButton
          y desaparece rootLeading.
        </li>

        <li>
          Volviendo a root reaparece
          rootLeading.
        </li>

        <li>
          entries=[] controlado conserva una
          raíz efectiva.
        </li>

        <li>
          El primer push controlado desde
          entries=[] emite raíz + detalle.
        </li>

        <li>
          Los atributos data y ARIA del slot
          screen llegan al elemento visible.
        </li>

        <li>
          El ref apunta al root real de
          Scaffold.
        </li>

        <li>
          App bar, stack, bottom navigation y
          floating permanecen contenidos dentro
          del teléfono.
        </li>

        <li>
          Los títulos 0, false y string vacío
          conservan el contrato basado en
          nullish coalescing.
        </li>

        <li>
          El tab orphan muestra el fallback de
          pantalla faltante.
        </li>
      </Box>
    </DebugSection>
  );
}

export function TabScaffoldDebug() {
  return (
    <Stack spacing="1rem">
      <UncontrolledExample />
      <ControlledExample />
      <VisibilityExample />
      <FalsyRegionsExample />
      <OrphanTabExample />
      <NoEnabledTabsExample />
      <ManualChecklist />
    </Stack>
  );
}

TabScaffoldDebug.displayName =
  "TabScaffoldDebug";