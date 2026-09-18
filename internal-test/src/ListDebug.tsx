// internal-test/src/ListDebug.tsx

import {
  Badge,
  Box,
  Card,
  CardBody,
  Heading,
  List,
  Stack,
  useToast,
} from "zerina-ui";

export function ListDebug() {
  const { toast } = useToast();

  return (
    <Stack spacing="1rem">
      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              List: surface, comfortable y secciones
            </Heading>

            <List
              variant="outlined"
              density="comfortable"
              spacing="0.75rem"
            >
              <List.Section
                label="Cuenta"
                description="Items estáticos, interactivos y contenido falsy válido."
              >
                <List.Item
                  title="Perfil"
                  description="Editar información personal"
                  value="Invitado"
                  showChevron
                  aria-label="Abrir perfil"
                  data-debug-surface="profile"
                  onPress={() => {
                    toast({
                      title: "Perfil",
                      description:
                        "List.Item onPress funciona.",
                      variant: "success",
                    });
                  }}
                />

                <List.Item
                  title="Notificaciones"
                  description="Alertas y mensajes del sistema"
                  trailing={
                    <Badge
                      variant="subtle"
                      colorScheme="success"
                    >
                      Activo
                    </Badge>
                  }
                  onPress={() => {
                    toast({
                      title: "Notificaciones",
                      variant: "info",
                    });
                  }}
                />

                <List.Item
                  title="Errores pendientes"
                  description="Debe mostrar el valor numérico cero."
                  value={0}
                />

                <List.Item
                  title="Elemento con leading"
                  description="Valida la región inicial."
                  leading={
                    <Badge
                      variant="subtle"
                      colorScheme="primary"
                    >
                      L
                    </Badge>
                  }
                />

                <List.Item
                  selected
                  aria-current="page"
                  title="Plan actual"
                  description="selected es visual; aria-current aporta la semántica."
                  value="Free"
                />

                <List.Item
                  title="Zona peligrosa"
                  description="Acciones destructivas"
                  value="Bloqueado"
                  disabled
                  showChevron
                  onPress={() => {
                    toast({
                      title:
                        "No debería ejecutarse",
                      variant: "danger",
                    });
                  }}
                />
              </List.Section>
            </List>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              List: compact, divided e interacción
            </Heading>

            <List
              variant="surface"
              density="compact"
              spacing="0.5rem"
              divided
            >
              <List.Section
                label="Preferencias"
                description="Los divisores deben aparecer solo entre items."
              >
                <List.Item
                  title="Sonido"
                  description="Efectos y música"
                  trailing={
                    <Badge
                      variant="outline"
                      colorScheme="primary"
                    >
                      On
                    </Badge>
                  }
                  selected
                  aria-current="page"
                  onPress={() => {
                    toast({
                      title: "Sonido",
                      description:
                        "Item seleccionado con aria-current.",
                      variant: "success",
                    });
                  }}
                />

                <List.Item
                  title="Vibración"
                  description="Respuesta háptica"
                  value="Auto"
                  showChevron
                  onPress={() => {
                    toast({
                      title: "Vibración",
                      variant: "info",
                    });
                  }}
                />

                <List.Item
                  title="Gráficos"
                  description="Calidad visual"
                  value="Balanced"
                  showChevron
                  onPress={() => {
                    toast({
                      title: "Gráficos",
                      variant: "success",
                    });
                  }}
                  onLongPress={() => {
                    toast({
                      title:
                        "Long press en Gráficos",
                      description:
                        "Acción secundaria de una fila con onPress.",
                      variant: "info",
                    });
                  }}
                />

                <List.Item
                  title="Logs de rendimiento"
                  description="Solo para debug"
                  value="Off"
                />
              </List.Section>
            </List>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              List: plain, spacious y contenido personalizado
            </Heading>

            <List
              variant="plain"
              density="spacious"
              spacing="1rem"
            >
              <List.Item
                title="Elemento espacioso"
                description="Área visual y táctil ampliada."
                showChevron
                onPress={() => {
                  toast({
                    title:
                      "Spacious funciona",
                    variant: "success",
                  });
                }}
              />

              <List.Item>
                <Box
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <Box>
                    Contenido completamente
                    personalizado
                  </Box>

                  <Badge
                    variant="outline"
                    colorScheme="neutral"
                  >
                    Custom
                  </Badge>
                </Box>
              </List.Item>

              <List.Item
                title="Fondo personalizado"
                description="El fondo del consumidor debe ser fallback, no bloquear hover o pressed."
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in srgb, var(--ui-primary) 8%, transparent), transparent)",
                }}
                onPress={() => {
                  toast({
                    title:
                      "Fondo personalizado",
                    description:
                      "Los estados internos deben seguir teniendo prioridad.",
                    variant: "info",
                  });
                }}
              />
            </List>
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
                El valor numérico 0 debe mostrarse.
              </li>

              <li>
                Hover, pressed y selected deben cubrir toda la superficie, incluido el padding.
              </li>

              <li>
                En la lista divided no debe aparecer borde después del último item.
              </li>

              <li>
                El spacing debe respetarse dentro de List.Section.
              </li>

              <li>
                Al inspeccionar Perfil, aria-label y data-debug-surface deben estar en el mismo nodo con role=&quot;button&quot;.
              </li>

              <li>
                selected no debe inferir semántica; aria-current se aporta explícitamente.
              </li>

              <li>
                Gráficos debe responder a onPress y onLongPress.
              </li>

              <li>
                La fila disabled no debe recibir foco por Tab ni ejecutar onPress.
              </li>

              <li>
                El fondo personalizado debe verse en reposo, pero hover y pressed deben tener prioridad.
              </li>

              <li>
                La sección debe exponerse como un listitem que contiene una lista interna.
              </li>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}