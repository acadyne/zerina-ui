// internal-test/src/ScreenDebug.tsx

import React from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Screen,
  ScrollArea,
  Stack,
  useUIViewport,
} from "zerina-ui";


const SETTINGS =
  Array.from(
    {
      length: 28,
    },
    (_, index) =>
      index + 1
  );


export function ScreenDebug() {
  const viewport =
    useUIViewport();


  const [
    safeArea,
    setSafeArea,
  ] =
    React.useState(false);


  const [
    scrollEnabled,
    setScrollEnabled,
  ] =
    React.useState(true);


  const [
    stickyHeader,
    setStickyHeader,
  ] =
    React.useState(true);


  const [
    stickyFooter,
    setStickyFooter,
  ] =
    React.useState(true);


  return (
    <Card>
      <CardBody>
        <Stack spacing="0.75rem">

          <Heading size="sm">
            Screen
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
            Valida composición de pantalla,
            regiones semánticas, scroll,
            safe-area, insets y comportamiento sticky.
          </Box>


          <Box
            style={{
              display:
                "flex",

              flexWrap:
                "wrap",

              gap:
                "0.5rem",
            }}
          >
            <Button
              size="sm"
              variant={
                safeArea
                  ? "solid"
                  : "outline"
              }
              onPress={() =>
                setSafeArea(
                  (value) =>
                    !value
                )
              }
            >
              Safe Area
            </Button>


            <Button
              size="sm"
              variant={
                scrollEnabled
                  ? "solid"
                  : "outline"
              }
              onPress={() =>
                setScrollEnabled(
                  (value) =>
                    !value
                )
              }
            >
              Scroll
            </Button>


            <Button
              size="sm"
              variant={
                stickyHeader
                  ? "solid"
                  : "outline"
              }
              onPress={() =>
                setStickyHeader(
                  (value) =>
                    !value
                )
              }
            >
              Header Sticky
            </Button>


            <Button
              size="sm"
              variant={
                stickyFooter
                  ? "solid"
                  : "outline"
              }
              onPress={() =>
                setStickyFooter(
                  (value) =>
                    !value
                )
              }
            >
              Footer Sticky
            </Button>
          </Box>


          <Box
            style={{
              height:
                viewport.isShort
                  ? "360px"
                  : "480px",

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-lg)",

              overflow:
                "hidden",

              background:
                "var(--ui-bg)",
            }}
          >

            <Screen
              fullHeight={false}

              safeArea={
                safeArea
              }

              topInset="0px"

              bottomInset="0px"

              style={{
                height:
                  "100%",

                minHeight:
                  "100%",
              }}
            >

              <Screen.Header
                sticky={
                  stickyHeader
                }

                style={{
                  height:
                    "48px",

                  paddingInline:
                    "0.75rem",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  borderBottom:
                    "1px solid var(--ui-border)",

                  background:
                    "var(--ui-surface)",
                }}
              >

                <Box>
                  <Box
                    style={{
                      fontWeight:
                        "var(--ui-font-weight-bold)",
                    }}
                  >
                    Ajustes
                  </Box>

                  <Box
                    style={{
                      fontSize:
                        "var(--ui-font-size-xs)",

                      color:
                        "var(--ui-text-muted)",
                    }}
                  >
                    Screen.Header
                  </Box>
                </Box>


                <Stack
                  spacing="0.25rem"
                >
                  <Badge
                    variant="subtle"
                    colorScheme="success"
                  >
                    {viewport.kind}
                  </Badge>

                  <Badge
                    variant="subtle"
                    colorScheme="neutral"
                  >
                    {viewport.orientation}
                  </Badge>
                </Stack>

              </Screen.Header>


              <Screen.Body>

                {
                  scrollEnabled ? (
                    <ScrollArea
                      scrollbar="thin"

                      style={{
                        height:
                          "100%",

                        padding:
                          "0.75rem",

                        background:
                          "linear-gradient(180deg, var(--ui-surface-2), var(--ui-surface))",
                      }}
                    >

                      <SettingsList />

                    </ScrollArea>
                  ) : (

                    <Box
                      style={{
                        height:
                          "100%",

                        overflow:
                          "hidden",

                        padding:
                          "0.75rem",

                        background:
                          "var(--ui-surface-2)",
                      }}
                    >

                      <SettingsList />

                    </Box>
                  )
                }

              </Screen.Body>


              <Screen.Footer
                sticky={
                  stickyFooter
                }

                style={{
                  height:
                    "48px",

                  paddingInline:
                    "0.75rem",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  borderTop:
                    "1px solid var(--ui-border)",

                  background:
                    "var(--ui-surface)",
                }}
              >

                <Box
                  style={{
                    fontSize:
                      "var(--ui-font-size-sm)",

                    color:
                      "var(--ui-text-muted)",
                  }}
                >
                  Screen.Footer
                </Box>


                <Button
                  size="sm"
                >
                  Guardar
                </Button>

              </Screen.Footer>

            </Screen>

          </Box>


        </Stack>
      </CardBody>
    </Card>
  );
}


function SettingsList() {
  return (
    <Stack spacing="0.5rem">
      {
        SETTINGS.map(
          (item) => (
            <Box
              key={
                item
              }

              style={{
                padding:
                  "0.75rem",

                borderRadius:
                  "var(--ui-radius-md)",

                border:
                  "1px solid var(--ui-border)",

                background:
                  "var(--ui-surface)",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap:
                  "1rem",
              }}
            >

              <Box>
                <Box
                  style={{
                    fontWeight:
                      "var(--ui-font-weight-medium)",
                  }}
                >
                  Setting #{item}
                </Box>

                <Box
                  style={{
                    fontSize:
                      "var(--ui-font-size-xs)",

                    color:
                      "var(--ui-text-muted)",
                  }}
                >
                  Screen content item
                </Box>
              </Box>


              <Button
                size="sm"
                variant="outline"
              >
                Editar
              </Button>

            </Box>
          )
        )
      }
    </Stack>
  );
}


ScreenDebug.displayName =
  "ScreenDebug";