// internal-test/src/NavigationStackDebug.tsx

import React from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  NavigationStack,
  Screen,
  Stack,
  type NavigationStackAnimation,
  type NavigationStackEntry,
  type NavigationStackTransitionDirection,
  useNavigationStack,
} from "zerina-ui";


const animations:
  NavigationStackAnimation[] = [
    "slide",
    "shared-axis",
    "fade-through",
    "fade",
    "none",
  ];


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
                  color:
                    "var(--ui-text-muted)",
                  lineHeight: 1.55,
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


function StackSandbox({
  children,
  height = 460,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <Box
      style={{
        width: "100%",
        height,
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        border:
          "1px solid var(--ui-border)",
        borderRadius:
          "var(--ui-radius-lg)",
        background:
          "var(--ui-bg)",
      }}
    >
      {children}
    </Box>
  );
}


function StatePanel({
  label,
}: {
  label: string;
}) {
  const navigation =
    useNavigationStack();

  return (
    <Box
      data-debug-navigation-state=""
      style={{
        padding: "0.75rem",
        border:
          "1px solid var(--ui-border)",
        borderRadius:
          "var(--ui-radius-md)",
        background:
          "var(--ui-surface)",
        fontFamily: "monospace",
        fontSize: "0.8rem",
        lineHeight: 1.55,
        overflow: "auto",
      }}
    >
      <strong>{label}</strong>

      <br />

      index: {navigation.index}

      <br />

      current:{" "}
      {navigation.current?.name ??
        "null"}

      <br />

      canGoBack:{" "}
      {String(
        navigation.canGoBack
      )}

      <br />

      entries:

      <pre
        style={{
          marginTop: "0.5rem",
          marginBottom: 0,
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(
          navigation.entries,
          null,
          2
        )}
      </pre>
    </Box>
  );
}


function ScreenShell({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  const navigation =
    useNavigationStack();

  return (
    <Screen
      fullHeight={false}
      safeArea={false}
      style={{
        height: "100%",
      }}
    >
      <Screen.Header
        style={{
          minHeight: 52,
          paddingTop: "0.55rem",
          paddingRight: "0.85rem",
          paddingBottom: "0.55rem",
          paddingLeft: "0.85rem",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "0.75rem",
          borderBottom:
            "1px solid var(--ui-border)",
          background:
            "var(--ui-surface)",
          boxSizing: "border-box",
        }}
      >
        <Box
          style={{
            minWidth: 0,
          }}
        >
          <Box
            style={{
              fontWeight:
                "var(--ui-font-weight-bold)",
            }}
          >
            {title}
          </Box>

          <Box
            style={{
              marginTop: "0.15rem",
              color:
                "var(--ui-text-muted)",
              fontSize:
                "var(--ui-font-size-xs)",
            }}
          >
            index {navigation.index}
            {" · "}
            {navigation.entries.length}
            {" entradas"}
          </Box>
        </Box>

        {navigation.canGoBack ? (
          <Button
            size="sm"
            variant="ghost"
            onPress={() => {
              navigation.pop();
            }}
          >
            Atrás
          </Button>
        ) : null}
      </Screen.Header>

      <Screen.Body>
        <Screen.Scroll
          style={{
            padding: "0.85rem",
          }}
        >
          <Stack spacing="0.75rem">
            {children}
          </Stack>
        </Screen.Scroll>
      </Screen.Body>
    </Screen>
  );
}


function HomeScreen() {
  const navigation =
    useNavigationStack();

  const sequenceRef =
    React.useRef(1);

  function nextDetailParams() {
    const sequence =
      sequenceRef.current;

    sequenceRef.current += 1;

    return {
      sequence,
      from: "home",
    };
  }

  return (
    <ScreenShell title="Home · component">
      <StatePanel label="Estado actual" />

      <Button
        onPress={() => {
          navigation.push(
            "details",
            nextDetailParams()
          );
        }}
      >
        Push details
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.push(
            "details",
            nextDetailParams()
          );
        }}
      >
        Push repetido de details
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.replace(
            "render",
            {
              source:
                "replace desde home",
            }
          );
        }}
      >
        Replace con render
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.pop();
        }}
      >
        Pop en root — no-op
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.reset(
            "element",
            {
              source:
                "reset desde home",
            }
          );
        }}
      >
        Reset a element
      </Button>
    </ScreenShell>
  );
}


function DetailsScreen() {
  const navigation =
    useNavigationStack();

  const route =
    navigation.current;

  return (
    <ScreenShell title="Details · component">
      <StatePanel label="Estado actual" />

      <Box
        style={{
          padding: "0.75rem",
          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "var(--ui-radius-md)",
          background:
            "var(--ui-surface)",
        }}
      >
        Params:

        <pre
          style={{
            marginTop: "0.5rem",
            marginBottom: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(
            route?.params ?? {},
            null,
            2
          )}
        </pre>
      </Box>

      <Button
        onPress={() => {
          const nextSequence =
            navigation.entries.length;

          navigation.push(
            "details",
            {
              sequence:
                nextSequence,
              nested: true,
            }
          );
        }}
      >
        Push otro details
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.replace(
            "render",
            {
              source:
                "replace desde details",
            }
          );
        }}
      >
        Replace con render
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.popToRoot();
        }}
      >
        Pop to root
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.reset(
            "home",
            {
              reset:
                "desde details",
            }
          );
        }}
      >
        Reset a home
      </Button>
    </ScreenShell>
  );
}


function RenderScreen() {
  const navigation =
    useNavigationStack();

  return (
    <ScreenShell title="Render screen">
      <StatePanel label="Pantalla registrada con render" />

      <Box
        style={{
          padding: "0.75rem",
          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "var(--ui-radius-md)",
          background:
            "var(--ui-surface)",
        }}
      >
        Params:

        <pre
          style={{
            marginTop: "0.5rem",
            marginBottom: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(
            navigation.current
              ?.params ?? {},
            null,
            2
          )}
        </pre>
      </Box>

      <Button
        onPress={() => {
          navigation.push(
            "element",
            {
              source:
                "push desde render",
            }
          );
        }}
      >
        Push element
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.pop();
        }}
      >
        Pop
      </Button>
    </ScreenShell>
  );
}


function ElementScreen() {
  const navigation =
    useNavigationStack();

  return (
    <ScreenShell title="Element screen">
      <StatePanel label="Pantalla registrada con element" />

      <Button
        onPress={() => {
          navigation.push(
            "missing",
            {
              source:
                "pantalla no registrada",
            }
          );
        }}
      >
        Push pantalla inexistente
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.reset(
            "home",
            {
              reset:
                "desde element",
            }
          );
        }}
      >
        Reset a home
      </Button>
    </ScreenShell>
  );
}

function AnimationSelector({
  value,
  onChange,
}: {
  value:
    NavigationStackAnimation;
  onChange: (
    animation:
      NavigationStackAnimation
  ) => void;
}) {
  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      {animations.map(
        (animation) => (
          <Button
            key={animation}
            size="sm"
            variant={
              value === animation
                ? "solid"
                : "outline"
            }
            onPress={() => {
              onChange(
                animation
              );
            }}
          >
            {animation}
          </Button>
        )
      )}
    </Box>
  );
}


function UncontrolledExample() {
  const [
    animation,
    setAnimation,
  ] =
    React.useState<NavigationStackAnimation>(
      "slide"
    );

  const rootRef =
    React.useRef<HTMLDivElement>(
      null
    );

  const [
    refAttached,
    setRefAttached,
  ] =
    React.useState(false);

  const [
    lastDirection,
    setLastDirection,
  ] =
    React.useState<
      NavigationStackTransitionDirection
      | "none"
    >("none");

  const [
    lastEntries,
    setLastEntries,
  ] =
    React.useState<
      NavigationStackEntry[]
    >([]);

  React.useEffect(() => {
    setRefAttached(
      rootRef.current instanceof
        HTMLDivElement
    );
  }, []);

  return (
    <Stack spacing="0.75rem">
      <AnimationSelector
        value={animation}
        onChange={
          setAnimation
        }
      />

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
            "var(--ui-surface)",
          fontFamily: "monospace",
          fontSize: "0.8rem",
          lineHeight: 1.55,
        }}
      >
        ref al div:{" "}
        {String(refAttached)}

        <br />

        última dirección emitida:{" "}
        {lastDirection}

        <br />

        entradas emitidas:{" "}
        {lastEntries.length}
      </Box>

      <StackSandbox>
        <NavigationStack
          ref={rootRef}
          id="debug-navigation-stack-root"
          aria-label="NavigationStack no controlado"
          data-debug-navigation-stack-root=""
          tabIndex={0}
          initialName="home"
          initialParams={{
            source:
              "initialParams",
            mode:
              "uncontrolled",
          }}
          animation={animation}
          onEntriesChange={(
            entries,
            direction
          ) => {
            setLastEntries(
              entries
            );

            setLastDirection(
              direction
            );
          }}
          className="debug-navigation-stack"
          style={{
            outline:
              "1px solid transparent",
          }}
          styles={{
            root: {
              isolation:
                "isolate",
            },

            screen: {
              background:
                "var(--ui-bg)",
            },
          }}
          slotProps={{
            root: {
              "data-debug-root-slot":
                "",
            },

            screen: {
              "data-debug-screen-slot":
                "",
            },
          }}
        >
          <>
            <NavigationStack.Screen
              name="home"
              component={HomeScreen}
            />

            <>
              <NavigationStack.Screen
                name="details"
                component={DetailsScreen}
              />

              <NavigationStack.Screen
                name="render"
                render={() => (
                  <RenderScreen />
                )}
              />
            </>

            <NavigationStack.Screen
              name="element"
              element={
                <ElementScreen />
              }
            />
          </>
        </NavigationStack>
      </StackSandbox>
    </Stack>
  );
}


function ControlledHomeScreen() {
  const navigation =
    useNavigationStack();

  return (
    <ScreenShell title="Controlled home">
      <StatePanel label="Estado controlado" />

      <Button
        onPress={() => {
          navigation.push(
            "controlled-details",
            {
              step: 1,
            }
          );
        }}
      >
        Push controlled-details
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.reset(
            "controlled-home",
            {
              reset: true,
            }
          );
        }}
      >
        Reset controlled-home
      </Button>
    </ScreenShell>
  );
}


function ControlledDetailsScreen() {
  const navigation =
    useNavigationStack();

  return (
    <ScreenShell title="Controlled details">
      <StatePanel label="Estado controlado" />

      <Button
        onPress={() => {
          navigation.push(
            "controlled-details",
            {
              step:
                navigation.entries
                  .length,
            }
          );
        }}
      >
        Push mismo name
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.pop();
        }}
      >
        Pop
      </Button>

      <Button
        variant="outline"
        onPress={() => {
          navigation.popToRoot();
        }}
      >
        Pop to root
      </Button>
    </ScreenShell>
  );
}


function ControlledExample() {
  const [
    entries,
    setEntries,
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
    proposalCount,
    setProposalCount,
  ] =
    React.useState(0);

  return (
    <Stack spacing="0.75rem">
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setEntries([]);
            setDirection(
              "replace"
            );
          }}
        >
          Forzar entries=[]
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setEntries([
              {
                key:
                  "controlled-manual-home",
                name:
                  "controlled-home",
                params: {
                  manual: true,
                },
              },
            ]);

            setDirection(
              "replace"
            );
          }}
        >
          Restaurar entrada manual
        </Button>
      </Box>

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
            "var(--ui-surface)",
          fontFamily: "monospace",
          fontSize: "0.8rem",
          lineHeight: 1.55,
        }}
      >
        entries controladas:{" "}
        {entries.length}

        <br />

        dirección controlada:{" "}
        {direction}

        <br />

        propuestas recibidas:{" "}
        {proposalCount}
      </Box>

      <StackSandbox>
        <NavigationStack
          initialName="controlled-home"
          initialParams={{
            source:
              "controlled fallback",
          }}
          entries={entries}
          transitionDirection={
            direction
          }
          animation="none"
          onEntriesChange={(
            nextEntries,
            nextDirection
          ) => {
            setProposalCount(
              (current) =>
                current + 1
            );

            setEntries(
              nextEntries
            );

            setDirection(
              nextDirection
            );
          }}
        >
          <>
            <NavigationStack.Screen
              name="controlled-home"
              component={
                ControlledHomeScreen
              }
            />

            <NavigationStack.Screen
              name="controlled-details"
              component={
                ControlledDetailsScreen
              }
            />
          </>
        </NavigationStack>
      </StackSandbox>
    </Stack>
  );
}


function FallbackExamples() {
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1rem",
      }}
    >
      <Box>
        <Box
          style={{
            marginBottom:
              "0.5rem",
            fontWeight:
              "var(--ui-font-weight-bold)",
          }}
        >
          Fallback por defecto
        </Box>

        <StackSandbox height={180}>
          <NavigationStack
            initialName="missing"
            animation="none"
          >
            <NavigationStack.Screen
              name="home"
              element={
                <Box>
                  Home
                </Box>
              }
            />
          </NavigationStack>
        </StackSandbox>
      </Box>

      <Box>
        <Box
          style={{
            marginBottom:
              "0.5rem",
            fontWeight:
              "var(--ui-font-weight-bold)",
          }}
        >
          Fallback personalizado 0
        </Box>

        <StackSandbox height={180}>
          <NavigationStack
            initialName="missing"
            animation="none"
            fallback={0}
          >
            <NavigationStack.Screen
              name="home"
              element={
                <Box>
                  Home
                </Box>
              }
            />
          </NavigationStack>
        </StackSandbox>
      </Box>
    </Box>
  );
}


export function NavigationStackDebug() {
  return (
    <Box
      data-ui-navigation-stack-debug=""
      style={{
        width: "100%",
        maxWidth: 1120,
        marginTop: 0,
        marginRight: "auto",
        marginBottom: 0,
        marginLeft: "auto",
        padding: "1rem",
        boxSizing:
          "border-box",
      }}
    >
      <Stack spacing="1.5rem">
        <Box>
          <Heading>
            NavigationStack
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
            Validación del historial,
            modo controlado y no
            controlado, parámetros,
            fragments, formas de
            registro, fallbacks,
            animaciones, slots, props
            DOM y ref.
          </Box>
        </Box>


        <DebugSection
          title="Modo no controlado"
          description="Incluye initialParams, push repetido, replace, pop, popToRoot, reset, fragments y los presets de motion."
        >
          <UncontrolledExample />
        </DebugSection>


        <DebugSection
          title="Modo controlado y entries=[]"
          description="El stack debe exponer una entrada fallback efectiva cuando el consumidor entrega un array vacío. Las operaciones emiten la propuesta mediante onEntriesChange."
        >
          <ControlledExample />
        </DebugSection>


        <DebugSection
          title="Pantallas inexistentes y fallback"
          description="El fallback por defecto debe informar la pantalla faltante. fallback={0} debe conservar el cero como ReactNode válido."
        >
          <FallbackExamples />
        </DebugSection>


        <DebugSection
          title="Checklist de inspección"
          description="Puntos concretos para validar en interacción y DevTools."
        >
          <Box
            as="ul"
            style={{
              marginTop: 0,
              marginRight: 0,
              marginBottom: 0,
              marginLeft: 0,
              paddingLeft:
                "1.25rem",
              lineHeight: 1.75,
            }}
          >
            <li>
              El root real es un{" "}
              <code>div</code> y recibe
              ref, id, ARIA, data-* y
              tabIndex.
            </li>

            <li>
              Los atributos internos{" "}
              <code>
                data-ui-navigation-stack-*
              </code>{" "}
              reflejan animación y
              dirección reales.
            </li>

            <li>
              Las pantallas declaradas
              dentro de fragments se
              registran.
            </li>

            <li>
              component, render y element
              producen pantallas válidas.
            </li>

            <li>
              Cada push repetido crea una
              nueva key.
            </li>

            <li>
              Pop en root no cambia el
              estado.
            </li>

            <li>
              Pop y popToRoot conservan
              las keys existentes.
            </li>

            <li>
              Replace y reset crean una
              nueva instancia.
            </li>

            <li>
              <code>entries=[]</code>{" "}
              conserva una entrada
              efectiva con initialName e
              initialParams.
            </li>

            <li>
              Los slots root y screen
              conservan estilos y
              atributos.
            </li>

            <li>
              slide, shared-axis,
              fade-through, fade y none
              mantienen la dirección
              semántica.
            </li>
          </Box>
        </DebugSection>
      </Stack>
    </Box>
  );
}


NavigationStackDebug.displayName =
  "NavigationStackDebug";