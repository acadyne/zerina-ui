// internal-test/src/NavigationListDebug.tsx

import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  NavigationList,
  Stack,
  useToast,
} from "zerina-ui";
import type {
  NavigationNode,
} from "zerina-ui/patterns/navigation";

const controlledItems:
  NavigationNode[] = [
    {
      id: "home",
      label: "Inicio",
      icon: "⌂",
    },
    {
      id: "projects",
      label: "Proyectos",
      icon: "▣",
      badge: (
        <Badge
          variant="subtle"
          colorScheme="primary"
        >
          4
        </Badge>
      ),
      children: [
        {
          id: "projects-active",
          label: "Activos",
          icon: "•",
        },
        {
          id: "projects-archived",
          label: "Archivados",
          icon: "•",
        },
      ],
    },
    {
      id: "workspace",
      label: "Espacio de trabajo",
      icon: "◇",
      selectable: true,
      children: [
        {
          id: "workspace-members",
          label: "Miembros",
          icon: "•",
        },
        {
          id: "workspace-billing",
          label: "Facturación",
          icon: "•",
        },
      ],
    },
    {
      id: "system",
      label: "Sistema",
      icon: "⚙",
      children: [
        {
          id: "settings",
          label: "Ajustes",
          icon: "⚙",
        },
        {
          id: "appearance",
          label: "Apariencia",
          icon: "◐",
        },
        {
          id: "logs",
          label: "Logs",
          icon: "≡",
          disabled: true,
        },
      ],
    },
    {
      id: "disabled-group",
      label: "Grupo deshabilitado",
      icon: "⊘",
      disabled: true,
      children: [
        {
          id: "disabled-group-child",
          label: "Hijo inaccesible",
          icon: "•",
        },
      ],
    },
    {
      id: "profile",
      label: "Perfil",
      icon: "◉",
    },
  ];

const collapsedItems:
  NavigationNode[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "reports",
      label: "Reportes",
      icon: "▤",
      children: [
        {
          id: "reports-daily",
          label: "Reporte diario",
          icon: "•",
        },
        {
          id: "reports-monthly",
          label: "Reporte mensual",
          icon: "•",
        },
      ],
    },
    {
      id: "selectable-parent",
      label: "Organización",
      icon: "◇",
      selectable: true,
      children: [
        {
          id: "selectable-parent-team",
          label: "Equipo",
          icon: "•",
        },
      ],
    },
    {
      id: "complex-label",
      label: (
        <Box
          as="span"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <span>Laboratorio</span>

          <Badge
            variant="subtle"
            colorScheme="success"
          >
            Beta
          </Badge>
        </Box>
      ),
      ariaLabel: "Laboratorio Beta",
      icon: "◈",
    },
    {
      id: "disabled-leaf",
      label: "Elemento deshabilitado",
      icon: "⊘",
      disabled: true,
    },
  ];

const uncontrolledItems:
  NavigationNode[] = [
    {
      id: "library",
      label: "Biblioteca",
      icon: "▦",
      children: [
        {
          id: "library-books",
          label: "Libros",
          icon: "•",
        },
        {
          id: "library-notes",
          label: "Notas",
          icon: "•",
        },
      ],
    },
    {
      id: "account",
      label: "Cuenta",
      icon: "◉",
      children: [
        {
          id: "account-security",
          label: "Seguridad",
          icon: "•",
        },
        {
          id: "account-sessions",
          label: "Sesiones",
          icon: "•",
        },
      ],
    },
  ];

const panelStyle:
  React.CSSProperties = {
    minWidth: 0,
    padding: "0.75rem",

    border:
      "1px solid var(--ui-border)",

    borderRadius:
      "var(--ui-radius-lg)",

    background:
      "var(--ui-surface)",
  };

const mutedTextStyle:
  React.CSSProperties = {
    color:
      "var(--ui-text-muted)",

    fontSize:
      "var(--ui-font-size-sm)",

    lineHeight: 1.6,
  };

export function NavigationListDebug() {
  const { toast } = useToast();

  const [
    controlledActiveId,
    setControlledActiveId,
  ] = React.useState(
    "projects-active"
  );

  const [
    controlledOpenIds,
    setControlledOpenIds,
  ] = React.useState<string[]>([
    "projects",
  ]);

  const [
    collapsedActiveId,
    setCollapsedActiveId,
  ] = React.useState(
    "dashboard"
  );

  const [
    collapsedBehavior,
    setCollapsedBehavior,
  ] = React.useState<
    "icons-only" | "flyout"
  >("flyout");

  const [
    exactActiveId,
    setExactActiveId,
  ] = React.useState(
    "appearance"
  );

  const [
    uncontrolledActiveId,
    setUncontrolledActiveId,
  ] = React.useState(
    "library-books"
  );

  return (
    <Stack spacing="1rem">
      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              NavigationList: controlada
            </Heading>

            <Box
              style={
                mutedTextStyle
              }
            >
              Valida selección, expansión independiente,
              padres seleccionables, padres no seleccionables,
              disabled y listas anidadas.
            </Box>

            <Box
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",

                gap: "1rem",
                alignItems: "start",
              }}
            >
              <Box
                style={
                  panelStyle
                }
              >
                <NavigationList
                  items={
                    controlledItems
                  }
                  activeId={
                    controlledActiveId
                  }
                  activeBehavior="contains"
                  openIds={
                    controlledOpenIds
                  }
                  onOpenIdsChange={
                    setControlledOpenIds
                  }
                  ariaLabel="Navegación controlada"
                  onSelect={(
                    item
                  ) => {
                    setControlledActiveId(
                      item.id
                    );

                    toast({
                      title:
                        "NavigationList",
                      description:
                        `Seleccionado: ${item.id}`,
                      variant:
                        "success",
                    });
                  }}
                />
              </Box>

              <Box
                style={
                  panelStyle
                }
              >
                <Stack spacing="0.65rem">
                  <Box
                    style={{
                      fontWeight:
                        "var(--ui-font-weight-bold)",
                    }}
                  >
                    Estado controlado
                  </Box>

                  <Box
                    style={
                      mutedTextStyle
                    }
                  >
                    activeId:{" "}
                    <strong>
                      {
                        controlledActiveId
                      }
                    </strong>
                  </Box>

                  <Box
                    style={
                      mutedTextStyle
                    }
                  >
                    openIds:{" "}
                    <strong>
                      {controlledOpenIds.join(
                        ", "
                      ) ||
                        "ninguno"}
                    </strong>
                  </Box>

                  <Button
                    size="sm"
                    onPress={() => {
                      setControlledActiveId(
                        "workspace"
                      );
                    }}
                  >
                    Seleccionar padre
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => {
                      setControlledOpenIds(
                        (current) =>
                          current.includes(
                            "workspace"
                          )
                            ? current.filter(
                                (
                                  id
                                ) =>
                                  id !==
                                  "workspace"
                              )
                            : [
                                ...current,
                                "workspace",
                              ]
                      );
                    }}
                  >
                    Alternar hijos del padre
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => {
                      setControlledActiveId(
                        "projects-active"
                      );

                      setControlledOpenIds(
                        [
                          "projects",
                        ]
                      );
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Box>
            </Box>

            <Box
              as="ol"
              style={{
                ...mutedTextStyle,

                margin: 0,
                paddingLeft:
                  "1.25rem",
              }}
            >
              <li>
                Proyectos debe expandir desde toda la fila y no seleccionarse.
              </li>

              <li>
                Espacio de trabajo debe seleccionar desde la superficie principal.
              </li>

              <li>
                El chevron de Espacio de trabajo debe ser un botón hermano que solo expande.
              </li>

              <li>
                El grupo y el leaf deshabilitados no deben ejecutar acciones.
              </li>

              <li>
                Los hijos expandidos deben estar dentro de role=&quot;list&quot; y cada wrapper debe tener role=&quot;listitem&quot;.
              </li>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              NavigationList: colapsada
            </Heading>

            <Box
              style={
                mutedTextStyle
              }
            >
              Compara el contrato de icons-only con el flyout basado en Popover.
            </Box>

            <Box
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <Button
                size="sm"
                variant={
                  collapsedBehavior ===
                  "flyout"
                    ? "solid"
                    : "outline"
                }
                onPress={() => {
                  setCollapsedBehavior(
                    "flyout"
                  );
                }}
              >
                Flyout
              </Button>

              <Button
                size="sm"
                variant={
                  collapsedBehavior ===
                  "icons-only"
                    ? "solid"
                    : "outline"
                }
                onPress={() => {
                  setCollapsedBehavior(
                    "icons-only"
                  );
                }}
              >
                Icons only
              </Button>
            </Box>

            <Box
              style={{
                display: "grid",

                gridTemplateColumns:
                  "92px minmax(240px, 1fr)",

                gap: "1rem",
                alignItems: "start",
              }}
            >
              <Box
                style={{
                  ...panelStyle,

                  width: 72,
                  padding: "0.5rem",
                }}
              >
                <NavigationList
                  items={
                    collapsedItems
                  }
                  activeId={
                    collapsedActiveId
                  }
                  collapsed
                  collapsedBehavior={
                    collapsedBehavior
                  }
                  ariaLabel="Navegación colapsada"
                  onSelect={(
                    item
                  ) => {
                    setCollapsedActiveId(
                      item.id
                    );

                    toast({
                      title:
                        "Navegación colapsada",
                      description:
                        `Seleccionado: ${item.id}`,
                      variant:
                        "success",
                    });
                  }}
                />
              </Box>

              <Box
                style={
                  panelStyle
                }
              >
                <Stack spacing="0.65rem">
                  <Box
                    style={
                      mutedTextStyle
                    }
                  >
                    behavior:{" "}
                    <strong>
                      {
                        collapsedBehavior
                      }
                    </strong>
                  </Box>

                  <Box
                    style={
                      mutedTextStyle
                    }
                  >
                    activeId:{" "}
                    <strong>
                      {
                        collapsedActiveId
                      }
                    </strong>
                  </Box>

                  <Box
                    as="ol"
                    style={{
                      ...mutedTextStyle,

                      margin: 0,
                      paddingLeft:
                        "1.25rem",
                    }}
                  >
                    <li>
                      En flyout, Reportes debe abrir un Popover y no seleccionarse simultáneamente.
                    </li>

                    <li>
                      El flyout debe contener role=&quot;list&quot;, nunca role=&quot;menu&quot;.
                    </li>

                    <li>
                      Escape o click exterior deben cerrar el panel y restaurar el foco al trigger.
                    </li>

                    <li>
                      En icons-only, Reportes debe ser una superficie estática y no enfocable.
                    </li>

                    <li>
                      Organización debe seguir siendo seleccionable en icons-only.
                    </li>

                    <li>
                      Laboratorio Beta debe conservar nombre accesible mediante ariaLabel.
                    </li>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              NavigationList: exact frente a contains
            </Heading>

            <Box
              style={
                mutedTextStyle
              }
            >
              Ambos paneles usan el mismo activeId. Solo cambia la política visual de actividad.
            </Box>

            <Box
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",

                gap: "1rem",
                alignItems: "start",
              }}
            >
              <Box
                style={
                  panelStyle
                }
              >
                <Stack spacing="0.5rem">
                  <strong>
                    contains
                  </strong>

                  <NavigationList
                    items={
                      controlledItems
                    }
                    activeId={
                      exactActiveId
                    }
                    activeBehavior="contains"
                    defaultOpenIds={[
                      "system",
                    ]}
                    ariaLabel="Navegación con actividad contains"
                    onSelect={(
                      item
                    ) => {
                      setExactActiveId(
                        item.id
                      );
                    }}
                  />
                </Stack>
              </Box>

              <Box
                style={
                  panelStyle
                }
              >
                <Stack spacing="0.5rem">
                  <strong>
                    exact
                  </strong>

                  <NavigationList
                    items={
                      controlledItems
                    }
                    activeId={
                      exactActiveId
                    }
                    activeBehavior="exact"
                    defaultOpenIds={[
                      "system",
                    ]}
                    ariaLabel="Navegación con actividad exact"
                    onSelect={(
                      item
                    ) => {
                      setExactActiveId(
                        item.id
                      );
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing="0.75rem">
            <Heading size="sm">
              NavigationList: expansión no controlada
            </Heading>

            <Box
              style={
                mutedTextStyle
              }
            >
              Esta instancia usa defaultOpenIds y administra internamente sus grupos abiertos.
            </Box>

            <Box
              style={
                panelStyle
              }
            >
              <NavigationList
                items={
                  uncontrolledItems
                }
                activeId={
                  uncontrolledActiveId
                }
                defaultOpenIds={[
                  "library",
                ]}
                ariaLabel="Navegación no controlada"
                onSelect={(
                  item
                ) => {
                  setUncontrolledActiveId(
                    item.id
                  );

                  toast({
                    title:
                      "Navegación no controlada",
                    description:
                      `Seleccionado: ${item.id}`,
                    variant:
                      "info",
                  });
                }}
              />
            </Box>

            <Box
              style={
                mutedTextStyle
              }
            >
              Al montar, Biblioteca debe estar abierta. Después, ambos grupos deben conservar su estado sin depender de props externas.
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}