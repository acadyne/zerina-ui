// internal-test/src/ScreenStateDebug.tsx

import React from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Screen,
  ScreenState,
  Stack,
  type ScreenStateStatus,
  useToast,
} from "zerina-ui";


type DemoItem = {
  id: number;
  title: string;
  description: string;
};


function DemoContent({
  items,
}: {
  items: DemoItem[];
}) {
  return (
    <Stack spacing="0.75rem">
      <Box
        style={{
          padding: "1rem",

          borderRadius:
            "var(--ui-radius-xl)",

          border:
            "1px solid var(--ui-border)",

          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--ui-primary) 10%, var(--ui-surface)), var(--ui-surface))",
        }}
      >
        <Stack spacing="0.45rem">
          <Heading size="sm">
            Contenido cargado
          </Heading>

          <Box
            style={{
              color:
                "var(--ui-text-muted)",

              fontSize:
                "var(--ui-font-size-sm)",

              lineHeight:
                1.5,
            }}
          >
            ScreenState deja pasar contenido
            cuando el estado resuelto es success.
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
              "var(--ui-elevation-1)",
          }}
        >
          <Box
            style={{
              fontWeight:
                "var(--ui-font-weight-bold)",
            }}
          >
            {item.title}
          </Box>

          <Box
            style={{
              marginTop: "0.2rem",

              color:
                "var(--ui-text-muted)",

              fontSize:
                "var(--ui-font-size-sm)",

              lineHeight:
                1.45,
            }}
          >
            {item.description}
          </Box>
        </Box>
      ))}
    </Stack>
  );
}


const demoItems: DemoItem[] =
  Array.from(
    {
      length: 8,
    },
    (_, index) => ({
      id: index + 1,

      title:
        `Elemento #${index + 1}`,

      description:
        "Elemento de prueba para validar success dentro de ScreenState.",
    })
  );


export function ScreenStateDebug() {
  const {
    toast,
  } = useToast();


  const [
    status,
    setStatus,
  ] =
    React.useState<ScreenStateStatus>(
      "success"
    );


  const [
    explicitStatus,
    setExplicitStatus,
  ] =
    React.useState(false);


  const [
    customRenderers,
    setCustomRenderers,
  ] =
    React.useState(false);


  const [
    insideScreen,
    setInsideScreen,
  ] =
    React.useState(false);


  const [
    scrollable,
    setScrollable,
  ] =
    React.useState(false);


  const loading =
    status === "loading";


  const empty =
    status === "empty";


  const error =
    status === "error"
      ? new Error(
        "No pudimos cargar los datos de la pantalla."
      )
      : null;


  const handleRetry =
    async (): Promise<void> => {
      setStatus("loading");

      await new Promise(
        (resolve) => {
          window.setTimeout(
            resolve,
            900
          );
        }
      );

      setStatus("success");

      toast({
        title:
          "Reintento",

        description:
          "La pantalla volvió a success.",

        variant:
          "success",
      });
    };


  const stateProps = {
    status:
      explicitStatus
        ? status
        : undefined,

    loading:
      explicitStatus
        ? false
        : loading,

    empty:
      explicitStatus
        ? false
        : empty,

    error:
      explicitStatus
        ? null
        : error,

    scrollable,

    loadingTitle:
      "Cargando datos",

    loadingDescription:
      "Estamos preparando la información de la pantalla.",

    emptyTitle:
      "Sin resultados",

    emptyDescription:
      "No encontramos elementos para mostrar.",

    emptyActionLabel:
      "Crear elemento",

    errorTitle:
      "No se pudo cargar",

    errorDescription:
      "La operación falló. Intenta nuevamente.",

    onRetry:
      handleRetry,
  };


  return (
    <Card>
      <CardBody>
        <Stack spacing="0.75rem">
          <Box
            style={{
              display: "flex",

              flexWrap: "wrap",

              gap: "0.5rem",
            }}
          >
            {(
              [
                "success",
                "loading",
                "empty",
                "error",
              ] as ScreenStateStatus[]
            ).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={
                  status === item
                    ? "solid"
                    : "outline"
                }
                onPress={() => {
                  setStatus(item);
                }}
              >
                {item}
              </Button>
            ))}
          </Box>


          <Box
            style={{
              display: "flex",

              flexWrap: "wrap",

              gap: "0.5rem",
            }}
          >
            <Button
              size="sm"
              variant={
                explicitStatus
                  ? "solid"
                  : "outline"
              }
              onPress={() => {
                setExplicitStatus(
                  (value) => !value
                );
              }}
            >
              Status explícito
            </Button>


            <Button
              size="sm"
              variant={
                customRenderers
                  ? "solid"
                  : "outline"
              }
              onPress={() => {
                setCustomRenderers(
                  (value) => !value
                );
              }}
            >
              Renderers custom
            </Button>


            <Button
              size="sm"
              variant={
                insideScreen
                  ? "solid"
                  : "outline"
              }
              onPress={() => {
                setInsideScreen(
                  (value) => !value
                );
              }}
            >
              Dentro de Screen
            </Button>


            <Button
              size="sm"
              variant={
                scrollable
                  ? "solid"
                  : "outline"
              }
              onPress={() => {
                setScrollable(
                  (value) => !value
                );
              }}
            >
              Scroll interno
            </Button>
          </Box>


          <Box
            style={{
              height: 460,

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-xl)",

              overflow: "hidden",

              background:
                "var(--ui-surface-canvas)",
            }}
          >
            {
              insideScreen ? (
                <Screen
                  fullHeight={false}
                  style={{
                    height: "100%",
                  }}
                >
                  <Screen.Body>
                    <ScreenState
                      {...stateProps}
                      renderLoading={
                        customRenderers
                          ? () => (
                            <Box
                              style={{
                                padding:
                                  "2rem",

                                textAlign:
                                  "center",

                                color:
                                  "var(--ui-primary)",
                              }}
                            >
                              Loading custom renderer
                            </Box>
                          )
                          : undefined
                      }
                      renderEmpty={
                        customRenderers
                          ? () => (
                            <Box
                              style={{
                                padding:
                                  "2rem",

                                textAlign:
                                  "center",

                                color:
                                  "var(--ui-warning)",
                              }}
                            >
                              Empty custom renderer
                            </Box>
                          )
                          : undefined
                      }
                      renderError={
                        customRenderers
                          ? () => (
                            <Box
                              style={{
                                padding:
                                  "2rem",

                                textAlign:
                                  "center",

                                color:
                                  "var(--ui-danger)",
                              }}
                            >
                              Error custom renderer
                            </Box>
                          )
                          : undefined
                      }
                      renderSuccess={
                        customRenderers
                          ? () => (
                            <Box
                              style={{
                                padding:
                                  "1rem",

                                border:
                                  "1px solid var(--ui-border)",

                                borderRadius:
                                  "var(--ui-radius-lg)",
                              }}
                            >
                              Success custom renderer
                            </Box>
                          )
                          : undefined
                      }
                    >
                      {
                        !customRenderers && (
                          <DemoContent
                            items={demoItems}
                          />
                        )
                      }
                    </ScreenState>
                  </Screen.Body>
                </Screen>
              ) : (
                <ScreenState
                  {...stateProps}
                  renderLoading={
                    customRenderers
                      ? () => (
                        <Box
                          style={{
                            padding:
                              "2rem",

                            textAlign:
                              "center",

                            color:
                              "var(--ui-primary)",
                          }}
                        >
                          Loading custom renderer
                        </Box>
                      )
                      : undefined
                  }
                  renderEmpty={
                    customRenderers
                      ? () => (
                        <Box
                          style={{
                            padding:
                              "2rem",

                            textAlign:
                              "center",

                            color:
                              "var(--ui-warning)",
                          }}
                        >
                          Empty custom renderer
                        </Box>
                      )
                      : undefined
                  }
                  renderError={
                    customRenderers
                      ? () => (
                        <Box
                          style={{
                            padding:
                              "2rem",

                            textAlign:
                              "center",

                            color:
                              "var(--ui-danger)",
                          }}
                        >
                          Error custom renderer
                        </Box>
                      )
                      : undefined
                  }
                  renderSuccess={
                    customRenderers
                      ? () => (
                        <Box
                          style={{
                            padding:
                              "1rem",

                            border:
                              "1px solid var(--ui-border)",

                            borderRadius:
                              "var(--ui-radius-lg)",
                          }}
                        >
                          Success custom renderer
                        </Box>
                      )
                      : undefined
                  }
                >
                  {
                    !customRenderers && (
                      <DemoContent
                        items={demoItems}
                      />
                    )
                  }
                </ScreenState>
              )
            }
          </Box>


          <Box
            style={{
              padding:
                "0.75rem",

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

              lineHeight:
                1.5,
            }}
          >
            Checklist:

            <ul>
              <li>
                loading muestra estado de carga.
              </li>

              <li>
                empty muestra estado vacío.
              </li>

              <li>
                error muestra error con retry.
              </li>

              <li>
                success deja pasar contenido.
              </li>

              <li>
                status explícito tiene prioridad.
              </li>

              <li>
                render functions reemplazan presentación.
              </li>

              <li>
                ScreenState funciona dentro de Screen.
              </li>

              <li>
                Scroll interno puede ser controlado.
              </li>
            </ul>
          </Box>

        </Stack>
      </CardBody>
    </Card>
  );
}


ScreenStateDebug.displayName =
  "ScreenStateDebug";