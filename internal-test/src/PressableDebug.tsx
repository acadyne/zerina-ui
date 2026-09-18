// internal-test/src/PressableDebug.tsx

import {
  Badge,
  Box,
  Card,
  CardBody,
  Heading,
  Pressable,
  Stack,
  useToast,
} from "zerina-ui";

const PRESSABLE_STYLE = {
  width: "100%",
  minHeight: "7rem",
  padding: "0.85rem",
  borderRadius: "var(--ui-radius-lg)",
  border: "1px solid var(--ui-border)",
  background: "var(--ui-surface)",
  color: "var(--ui-text)",
  alignItems: "stretch",
  justifyContent: "flex-start",
  textAlign: "left",
} as const;

function StateBadges({
  pressed,
  hovered,
  focused,
  focusVisible,
  disabled,
  pointerType,
}: {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
  focusVisible: boolean;
  disabled: boolean;
  pointerType: string | null;
}) {
  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.4rem",
      }}
    >
      <Badge
        variant="subtle"
        colorScheme={
          pressed
            ? "success"
            : "neutral"
        }
      >
        pressed: {String(pressed)}
      </Badge>

      <Badge
        variant="subtle"
        colorScheme={
          hovered
            ? "success"
            : "neutral"
        }
      >
        hovered: {String(hovered)}
      </Badge>

      <Badge
        variant="subtle"
        colorScheme={
          focused
            ? "success"
            : "neutral"
        }
      >
        focused: {String(focused)}
      </Badge>

      <Badge
        variant="subtle"
        colorScheme={
          focusVisible
            ? "success"
            : "neutral"
        }
      >
        focusVisible:{" "}
        {String(focusVisible)}
      </Badge>

      <Badge
        variant="subtle"
        colorScheme={
          disabled
            ? "success"
            : "neutral"
        }
      >
        disabled: {String(disabled)}
      </Badge>

      <Badge
        variant="subtle"
        colorScheme={
          pointerType
            ? "success"
            : "neutral"
        }
      >
        pointer:{" "}
        {pointerType ?? "null"}
      </Badge>
    </Box>
  );
}

export function PressableDebug() {
  const { toast } = useToast();

  const notifyPress = (
    label: string,
    pointerType: string
  ) => {
    toast({
      title: label,
      description:
        `onPress ejecutado con ${pointerType}.`,
      variant: "success",
    });
  };

  const notifyLongPress = (
    label: string,
    pointerType: string
  ) => {
    toast({
      title: label,
      description:
        `onLongPress ejecutado con ${pointerType}.`,
      variant: "info",
    });
  };

  return (
    <Stack spacing="1rem">
      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              Pressable: estados e interacción
            </Heading>

            <Box
              style={{
                color:
                  "var(--ui-text-muted)",
                fontSize:
                  "var(--ui-font-size-sm)",
              }}
            >
              Prueba click, touch, long press,
              Tab, Enter y Espacio. Cada ejemplo
              muestra el estado real entregado por
              la render prop.
            </Box>

            <Box
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <Pressable
                onPress={(event) => {
                  notifyPress(
                    "Button nativo",
                    event.pointerType
                  );
                }}
                onLongPress={(event) => {
                  notifyLongPress(
                    "Long press en button",
                    event.pointerType
                  );
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      button por defecto
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Activación nativa con mouse,
                      touch, Enter y Espacio.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>

              <Pressable
                as="div"
                onPress={(event) => {
                  notifyPress(
                    "Div interactivo",
                    event.pointerType
                  );
                }}
                onLongPress={(event) => {
                  notifyLongPress(
                    "Long press en div",
                    event.pointerType
                  );
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      as=&quot;div&quot;
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Debe recibir role=&quot;button&quot;,
                      tabIndex=0 y activación sintética
                      por teclado.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>

              <Pressable
                as="span"
                onPress={(event) => {
                  notifyPress(
                    "Span interactivo",
                    event.pointerType
                  );
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      as=&quot;span&quot;
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Valida semántica y teclado en
                      otro elemento no nativo.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>

              <Pressable
                as="a"
                href="#pressable-anchor-target"
                onPress={(event) => {
                  event.preventDefault();

                  notifyPress(
                    "Anchor nativo",
                    event.pointerType
                  );
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      as=&quot;a&quot; con href
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Usa la interacción nativa del
                      enlace. El debug previene la
                      navegación.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>
            </Box>

            <Box
              id="pressable-anchor-target"
              aria-hidden="true"
            />
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              Variantes de comportamiento
            </Heading>

            <Box
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <Pressable
                longPressDelay={1000}
                onPress={(event) => {
                  notifyPress(
                    "Press normal",
                    event.pointerType
                  );
                }}
                onLongPress={(event) => {
                  notifyLongPress(
                    "Long press de 1000 ms",
                    event.pointerType
                  );
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      longPressDelay=1000
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Mantén presionado durante un
                      segundo. El click posterior no
                      debe ejecutar onPress.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>

              <Pressable
                pressEffect={false}
                onPress={(event) => {
                  notifyPress(
                    "Sin efecto visual",
                    event.pointerType
                  );
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      pressEffect=false
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      El estado pressed cambia, pero
                      no debe aplicarse scale ni
                      translate.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>

              <Pressable
                touchAction="pan-y"
                onPress={(event) => {
                  notifyPress(
                    "Touch action pan-y",
                    event.pointerType
                  );
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      touchAction=&quot;pan-y&quot;
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Permite validar la interacción
                      dentro de superficies con
                      desplazamiento vertical.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>

              <Pressable
                styles={{
                  root: {
                    borderStyle: "dashed",
                  },
                }}
                slotProps={{
                  root: {
                    "data-debug-slot":
                      "pressable-root",
                    style: {
                      background:
                        "var(--ui-surface-2)",
                    },
                  },
                }}
                onPress={(event) => {
                  notifyPress(
                    "Styles y slotProps",
                    event.pointerType
                  );
                }}
                style={{
                  ...PRESSABLE_STYLE,
                  borderWidth: "2px",
                }}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      styles + slotProps + style
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Valida la composición del slot
                      root y la prioridad de estilos.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              Estado disabled
            </Heading>

            <Box
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <Pressable
                disabled
                onPress={() => {
                  toast({
                    title: "Error",
                    description:
                      "Un button disabled no debe ejecutar onPress.",
                    variant: "info",
                  });
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      button disabled
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Debe tener disabled nativo y
                      quedar fuera de la navegación
                      por Tab.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>

              <Pressable
                as="div"
                disabled
                tabIndex={0}
                onPress={() => {
                  toast({
                    title: "Error",
                    description:
                      "Un div disabled no debe ejecutar onPress.",
                    variant: "info",
                  });
                }}
                style={PRESSABLE_STYLE}
              >
                {({
                  pressed,
                  hovered,
                  focused,
                  focusVisible,
                  disabled,
                  pointerType,
                }) => (
                  <Stack spacing="0.5rem">
                    <Box
                      style={{
                        fontWeight:
                          "var(--ui-font-weight-bold)",
                      }}
                    >
                      div disabled con tabIndex=0
                    </Box>

                    <Box
                      style={{
                        color:
                          "var(--ui-text-muted)",
                        fontSize:
                          "var(--ui-font-size-sm)",
                      }}
                    >
                      Disabled debe ganar y resolver
                      tabIndex=-1, aria-disabled=true
                      y bloquear onPress.
                    </Box>

                    <StateBadges
                      pressed={pressed}
                      hovered={hovered}
                      focused={focused}
                      focusVisible={
                        focusVisible
                      }
                      disabled={disabled}
                      pointerType={
                        pointerType
                      }
                    />
                  </Stack>
                )}
              </Pressable>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.5rem">
            <Heading size="sm">
              Comprobaciones manuales
            </Heading>

            <Box
              as="ol"
              style={{
                margin: 0,
                paddingLeft: "1.25rem",
                color:
                  "var(--ui-text-muted)",
                fontSize:
                  "var(--ui-font-size-sm)",
                lineHeight: 1.7,
              }}
            >
              <li>
                Usa Tab y confirma que button,
                div, span y anchor reciben foco.
              </li>

              <li>
                Confirma que focusVisible aparece
                con teclado y no con click normal.
              </li>

              <li>
                Activa los elementos con Enter y
                Espacio una sola vez.
              </li>

              <li>
                Mantén presionado el ejemplo de
                1000 ms y confirma que no se dispara
                onPress después de onLongPress.
              </li>

              <li>
                Presiona, arrastra fuera y suelta.
                La secuencia cancelada no debe
                ejecutar onPress.
              </li>

              <li>
                Los dos elementos disabled no deben
                recibir foco por Tab ni ejecutar
                callbacks.
              </li>

              <li>
                En touch o emulación móvil,
                hovered debe permanecer false.
              </li>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}