// internal-test/src/ScrollAreaDebug.tsx

import React from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  ScrollArea,
  Stack,
  type ScrollAreaAxis,
  type ScrollAreaScrollbar,
} from "zerina-ui";


const ITEMS =
  Array.from(
    {
      length: 48,
    },
    (_, index) => index + 1
  );


const AXES:
  ScrollAreaAxis[] = [
    "y",
    "x",
    "both",
  ];


const SCROLLBARS:
  ScrollAreaScrollbar[] = [
    "native",
    "thin",
    "hidden",
  ];


function VerticalContent() {
  return (
    <Stack spacing="0.5rem">
      {
        ITEMS.map(
          (item) => (
            <Box
              key={item}
              style={{
                padding:
                  "0.65rem 0.75rem",

                borderRadius:
                  "var(--ui-radius-md)",

                border:
                  "1px solid var(--ui-border)",

                background:
                  "var(--ui-surface)",
              }}
            >
              Item vertical #{item}
            </Box>
          )
        )
      }
    </Stack>
  );
}


function HorizontalContent() {
  return (
    <Box
      style={{
        display: "flex",

        gap: "0.5rem",

        minWidth:
          "1200px",
      }}
    >
      {
        ITEMS.slice(0, 20).map(
          (item) => (
            <Box
              key={item}
              style={{
                width:
                  "120px",

                flexShrink:
                  0,

                padding:
                  "0.75rem",

                borderRadius:
                  "var(--ui-radius-md)",

                border:
                  "1px solid var(--ui-border)",

                background:
                  "var(--ui-surface)",

                textAlign:
                  "center",
              }}
            >
              Card #{item}
            </Box>
          )
        )
      }
    </Box>
  );
}


function MatrixContent() {
  return (
    <Box
      style={{
        width:
          "1200px",

        height:
          "900px",

        background:
          "linear-gradient(135deg, var(--ui-primary), var(--ui-surface))",

        display:
          "grid",

        placeItems:
          "center",

        fontSize:
          "3rem",

        color:
          "var(--ui-text)",
      }}
    >
      Both axis content
    </Box>
  );
}


export function ScrollAreaDebug() {
  const [
    axis,
    setAxis,
  ] =
    React.useState<ScrollAreaAxis>(
      "y"
    );


  const [
    scrollbar,
    setScrollbar,
  ] =
    React.useState<ScrollAreaScrollbar>(
      "thin"
    );


  const [
    contain,
    setContain,
  ] =
    React.useState(true);


  const [
    momentum,
    setMomentum,
  ] =
    React.useState(true);


  const content =
    axis === "y"
      ? <VerticalContent />
      : axis === "x"
        ? <HorizontalContent />
        : <MatrixContent />;


  return (
    <Card>
      <CardBody>

        <Stack spacing="0.75rem">

          <Heading size="sm">
            ScrollArea
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
            Laboratorio de ScrollArea:
            ejes, scrollbars, containment,
            momentum y composición con layouts
            restringidos.
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

            {
              AXES.map(
                (value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={
                      axis === value
                        ? "solid"
                        : "outline"
                    }
                    onPress={() =>
                      setAxis(value)
                    }
                  >
                    Axis {value}
                  </Button>
                )
              )
            }

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

            {
              SCROLLBARS.map(
                (value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={
                      scrollbar === value
                        ? "solid"
                        : "outline"
                    }
                    onPress={() =>
                      setScrollbar(value)
                    }
                  >
                    {value}
                  </Button>
                )
              )
            }

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
                contain
                  ? "solid"
                  : "outline"
              }
              onPress={() =>
                setContain(
                  (value) =>
                    !value
                )
              }
            >
              Contain {contain ? "ON" : "OFF"}
            </Button>


            <Button
              size="sm"
              variant={
                momentum
                  ? "solid"
                  : "outline"
              }
              onPress={() =>
                setMomentum(
                  (value) =>
                    !value
                )
              }
            >
              Momentum {momentum ? "ON" : "OFF"}
            </Button>

          </Box>


          <Box
            style={{
              height:
                "320px",

              width:
                "100%",

              minWidth:
                0,

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-xl)",

              overflow:
                "hidden",

              background:
                "var(--ui-surface-2)",
            }}
          >

            <ScrollArea
              axis={axis}

              scrollbar={scrollbar}

              contain={contain}

              momentum={momentum}

              style={{
                height:
                  "100%",

                padding:
                  "0.75rem",
              }}
            >
              {content}
            </ScrollArea>

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

              fontSize:
                "var(--ui-font-size-sm)",
            }}
          >
            <strong>
              Checklist:
            </strong>

            <ul>
              <li>
                Axis y permite scroll vertical.
              </li>

              <li>
                Axis x permite scroll horizontal.
              </li>

              <li>
                Axis both permite ambos ejes.
              </li>

              <li>
                Scrollbar cambia comportamiento visual.
              </li>

              <li>
                Contain controla scroll chaining.
              </li>

              <li>
                Momentum modifica comportamiento táctil.
              </li>

              <li>
                El área funciona dentro de un contenedor limitado.
              </li>
            </ul>
          </Box>

        </Stack>

      </CardBody>
    </Card>
  );
}


ScrollAreaDebug.displayName =
  "ScrollAreaDebug";