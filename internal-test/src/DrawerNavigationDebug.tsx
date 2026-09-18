// internal-test/src/DrawerNavigationDebug.tsx

import React from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  DrawerNavigation,
  Heading,
  Stack,
  useToast,
} from "zerina-ui";

import {
  type NavigationNode,
} from "zerina-ui/patterns/navigation";


type DrawerPlacement =
  | "left"
  | "right";


type DebugSectionProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};


type DrawerStatePanelProps = {
  open: boolean;
  activeId: string;
  openIds: string[];
  selectedId: string;
  lastEvent: string;
  activeElement: string;
};


const drawerItems:
  NavigationNode[] = [
    {
      id: "home",
      label: "Inicio",
      ariaLabel:
        "Ir a inicio",
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
          id:
            "projects-active",
          label:
            "Activos",
          icon: "•",
        },

        {
          id:
            "projects-archived",
          label:
            "Archivados",
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
          label: (
            <Box
              as="span"
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "center",

                gap:
                  "0.35rem",
              }}
            >
              <span>
                Apariencia
              </span>

              <Badge
                variant="subtle"
                colorScheme="primary"
              >
                Nuevo
              </Badge>
            </Box>
          ),

          ariaLabel:
            "Abrir configuración de apariencia",

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
      id: "profile",
      label: "Perfil",
      icon: "◉",
    },

    ...Array.from(
      {
        length: 12,
      },
      (_, index) => ({
        id:
          `extra-${index + 1}`,

        label:
          `Sección adicional ${index + 1}`,

        icon: "•",
      })
    ),
  ];


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
                  marginTop:
                    "0.35rem",

                  marginRight: 0,
                  marginBottom: 0,
                  marginLeft: 0,

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


function DrawerStatePanel({
  open,
  activeId,
  openIds,
  selectedId,
  lastEvent,
  activeElement,
}: DrawerStatePanelProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      style={{
        padding:
          "0.75rem",

        border:
          "1px solid var(--ui-border)",

        borderRadius:
          "var(--ui-radius-md)",

        background:
          "var(--ui-surface)",

        fontFamily:
          "monospace",

        fontSize:
          "0.8rem",

        lineHeight: 1.6,
      }}
    >
      open:{" "}
      <strong>
        {String(open)}
      </strong>

      <br />

      activeId:{" "}
      <strong>
        {activeId}
      </strong>

      <br />

      openIds:{" "}
      <strong>
        {openIds.join(", ") ||
          "ninguno"}
      </strong>

      <br />

      seleccionado:{" "}
      <strong>
        {selectedId ||
          "ninguno"}
      </strong>

      <br />

      último evento:{" "}
      <strong>
        {lastEvent}
      </strong>

      <br />

      elemento activo:{" "}
      <strong>
        {activeElement ||
          "desconocido"}
      </strong>
    </Box>
  );
}


function getActiveElementLabel():
  string {
  const activeElement =
    document.activeElement;

  if (
    !(activeElement instanceof
      HTMLElement)
  ) {
    return "ninguno";
  }

  return (
    activeElement.getAttribute(
      "aria-label"
    ) ??
    activeElement.textContent
      ?.trim() ??
    activeElement.tagName
  );
}


function ControlledDrawerExample() {
  const { toast } =
    useToast();

  const triggerRef =
    React.useRef<
      HTMLButtonElement | null
    >(null);

  const initialFocusRef =
    React.useRef<
      HTMLButtonElement | null
    >(null);

  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const [
    placement,
    setPlacement,
  ] =
    React.useState<
      DrawerPlacement
    >("left");

  const [
    size,
    setSize,
  ] =
    React.useState<
      number | string
    >("min(340px, 92vw)");

  const [
    activeId,
    setActiveId,
  ] =
    React.useState("home");

  const [
    openIds,
    setOpenIds,
  ] =
    React.useState<
      string[]
    >([
      "projects",
    ]);

  const [
    selectedId,
    setSelectedId,
  ] =
    React.useState("");

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState(
      "Sin interacción."
    );

  const [
    activeElement,
    setActiveElement,
  ] =
    React.useState(
      "desconocido"
    );

  function handleOpenChange(
    nextOpen: boolean
  ) {
    setOpen(nextOpen);

    setLastEvent(
      nextOpen
        ? "Solicitud de apertura."
        : "Solicitud de cierre."
    );

    if (!nextOpen) {
      window.setTimeout(
        () => {
          setActiveElement(
            getActiveElementLabel()
          );
        },
        80
      );
    }
  }

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
          ref={triggerRef}
          onPress={() => {
            setOpen(true);

            setLastEvent(
              "Abierto desde trigger."
            );
          }}
        >
          Abrir drawer controlado
        </Button>

        <Button
          size="sm"
          variant={
            placement === "left"
              ? "solid"
              : "outline"
          }
          onPress={() => {
            setPlacement("left");
          }}
        >
          placement left
        </Button>

        <Button
          size="sm"
          variant={
            placement === "right"
              ? "solid"
              : "outline"
          }
          onPress={() => {
            setPlacement("right");
          }}
        >
          placement right
        </Button>

        <Button
          size="sm"
          variant={
            size === 300
              ? "solid"
              : "outline"
          }
          onPress={() => {
            setSize(300);
          }}
        >
          size 300
        </Button>

        <Button
          size="sm"
          variant={
            size ===
            "min(420px, 94vw)"
              ? "solid"
              : "outline"
          }
          onPress={() => {
            setSize(
              "min(420px, 94vw)"
            );
          }}
        >
          size amplio
        </Button>
      </Box>

      <DrawerStatePanel
        open={open}
        activeId={activeId}
        openIds={openIds}
        selectedId={
          selectedId
        }
        lastEvent={lastEvent}
        activeElement={
          activeElement
        }
      />

      <DrawerNavigation
        open={open}
        onOpenChange={
          handleOpenChange
        }
        placement={placement}
        size={size}
        title="Navegación"
        description="Selecciona una sección del producto."
        navigationLabel="Navegación principal del debug"
        items={drawerItems}
        activeId={activeId}
        openIds={openIds}
        onOpenIdsChange={(
          nextOpenIds
        ) => {
          setOpenIds(
            nextOpenIds
          );

          setLastEvent(
            `openIds: ${
              nextOpenIds.join(
                ", "
              ) || "ninguno"
            }.`
          );
        }}
        activeBehavior="contains"
        openActiveParents
        initialFocusRef={
          initialFocusRef
        }
        restoreFocus
        onSelect={(
          item
        ) => {
          setActiveId(
            item.id
          );

          setSelectedId(
            item.id
          );

          setLastEvent(
            `Seleccionado ${item.id}.`
          );

          toast({
            title:
              "DrawerNavigation",

            description:
              `Seleccionado: ${item.id}`,

            variant:
              "success",
          });
        }}
        className="debug-drawer-navigation-panel"
        style={{
          outline:
            "2px solid color-mix(in srgb, var(--ui-primary) 14%, transparent)",

          outlineOffset:
            "-2px",
        }}
        styles={{
          root: {
            background:
              "var(--ui-surface)",
          },

          body: {
            padding:
              "0.65rem",
          },

          navigation: {
            minWidth: 0,
          },

          footer: {
            justifyContent:
              "stretch",
          },

          footerContent: {
            width: "100%",
          },
        }}
        slotProps={{
          root: {
            "data-debug-drawer-navigation-root":
              "",

            "aria-label":
              "Panel de navegación del debug",
          },

          body: {
            "data-debug-drawer-navigation-body":
              "",
          },

          navigation: {
            "data-debug-drawer-navigation-list":
              "",
          },

          footer: {
            "data-debug-drawer-navigation-footer":
              "",
          },

          footerContent: {
            "data-debug-drawer-navigation-footer-content":
              "",
          },
        }}
        footer={
          <Stack spacing="0.5rem">
            <Box
              style={{
                color:
                  "var(--ui-text-muted)",

                fontSize:
                  "var(--ui-font-size-xs)",

                lineHeight: 1.4,
              }}
            >
              Footer visible con
              estado y acciones
              secundarias.
            </Box>

            <Button
              ref={
                initialFocusRef
              }
              size="sm"
              variant="outline"
              onPress={() => {
                setActiveId(
                  "home"
                );

                setOpenIds([]);

                setSelectedId("");

                setLastEvent(
                  "Navegación restablecida."
                );
              }}
            >
              Reset navigation
            </Button>
          </Stack>
        }
      />
    </Stack>
  );
}


function NoCloseDrawerExample() {
  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const [
    activeId,
    setActiveId,
  ] =
    React.useState(
      "projects-active"
    );

  const [
    selectedId,
    setSelectedId,
  ] =
    React.useState("");

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState(
      "Sin interacción."
    );

  return (
    <Stack spacing="0.75rem">
      <Button
        onPress={() => {
          setOpen(true);

          setLastEvent(
            "Abierto."
          );
        }}
      >
        Abrir closeOnSelect=false
      </Button>

      <Box
        role="status"
        aria-live="polite"
        style={{
          padding:
            "0.75rem",

          border:
            "1px solid var(--ui-border)",

          borderRadius:
            "var(--ui-radius-md)",

          background:
            "var(--ui-surface)",

          lineHeight: 1.55,
        }}
      >
        open:{" "}
        <strong>
          {String(open)}
        </strong>

        <br />

        seleccionado:{" "}
        <strong>
          {selectedId ||
            "ninguno"}
        </strong>

        <br />

        evento:{" "}
        <strong>
          {lastEvent}
        </strong>
      </Box>

      <DrawerNavigation
        open={open}
        onOpenChange={(
          nextOpen
        ) => {
          setOpen(nextOpen);

          setLastEvent(
            nextOpen
              ? "Solicitud de apertura."
              : "Solicitud de cierre manual."
          );
        }}
        placement="right"
        size="min(360px, 92vw)"
        title="Selección persistente"
        description="Seleccionar un item no debe cerrar el drawer."
        items={drawerItems}
        activeId={activeId}
        defaultOpenIds={[
          "projects",
          "system",
        ]}
        closeOnSelect={false}
        activeBehavior="exact"
        openActiveParents={
          false
        }
        onSelect={(item) => {
          setActiveId(
            item.id
          );

          setSelectedId(
            item.id
          );

          setLastEvent(
            `Seleccionado ${item.id}; drawer permanece abierto.`
          );
        }}
      />
    </Stack>
  );
}


function PreventDefaultDrawerExample() {
  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const [
    selectedId,
    setSelectedId,
  ] =
    React.useState("");

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState(
      "Sin interacción."
    );

  return (
    <Stack spacing="0.75rem">
      <Button
        onPress={() => {
          setOpen(true);

          setLastEvent(
            "Abierto."
          );
        }}
      >
        Abrir preventDefault
      </Button>

      <Box
        role="status"
        aria-live="polite"
        style={{
          padding:
            "0.75rem",

          border:
            "1px solid var(--ui-border)",

          borderRadius:
            "var(--ui-radius-md)",

          background:
            "var(--ui-surface)",

          lineHeight: 1.55,
        }}
      >
        open:{" "}
        <strong>
          {String(open)}
        </strong>

        <br />

        seleccionado:{" "}
        <strong>
          {selectedId ||
            "ninguno"}
        </strong>

        <br />

        evento:{" "}
        <strong>
          {lastEvent}
        </strong>
      </Box>

      <DrawerNavigation
        open={open}
        onOpenChange={(
          nextOpen
        ) => {
          setOpen(nextOpen);

          setLastEvent(
            nextOpen
              ? "Solicitud de apertura."
              : "Solicitud de cierre."
          );
        }}
        title="Cierre cancelable"
        description="La selección ejecuta al consumidor, pero preventDefault cancela el cierre."
        items={
          drawerItems.slice(
            0,
            4
          )
        }
        activeId={
          selectedId ||
          "home"
        }
        onSelect={(
          item,
          event
        ) => {
          event.preventDefault();

          setSelectedId(
            item.id
          );

          setLastEvent(
            `Seleccionado ${item.id}; cierre cancelado con preventDefault.`
          );
        }}
      />
    </Stack>
  );
}


function DismissContractExample() {
  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const [
    closeOnEscape,
    setCloseOnEscape,
  ] =
    React.useState(false);

  const [
    closeOnOutside,
    setCloseOnOutside,
  ] =
    React.useState(false);

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState(
      "Sin interacción."
    );

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
          onPress={() => {
            setOpen(true);

            setLastEvent(
              "Abierto."
            );
          }}
        >
          Abrir dismiss configurable
        </Button>

        <Button
          size="sm"
          variant={
            closeOnEscape
              ? "solid"
              : "outline"
          }
          onPress={() => {
            setCloseOnEscape(
              (current) =>
                !current
            );
          }}
        >
          Escape:{" "}
          {closeOnEscape
            ? "on"
            : "off"}
        </Button>

        <Button
          size="sm"
          variant={
            closeOnOutside
              ? "solid"
              : "outline"
          }
          onPress={() => {
            setCloseOnOutside(
              (current) =>
                !current
            );
          }}
        >
          Outside:{" "}
          {closeOnOutside
            ? "on"
            : "off"}
        </Button>
      </Box>

      <Box
        role="status"
        aria-live="polite"
        style={{
          padding:
            "0.75rem",

          border:
            "1px solid var(--ui-border)",

          borderRadius:
            "var(--ui-radius-md)",

          background:
            "var(--ui-surface)",

          lineHeight: 1.55,
        }}
      >
        open:{" "}
        <strong>
          {String(open)}
        </strong>

        <br />

        closeOnEscape:{" "}
        <strong>
          {String(
            closeOnEscape
          )}
        </strong>

        <br />

        closeOnPointerDownOutside:{" "}
        <strong>
          {String(
            closeOnOutside
          )}
        </strong>

        <br />

        evento:{" "}
        <strong>
          {lastEvent}
        </strong>
      </Box>

      <DrawerNavigation
        open={open}
        onOpenChange={(
          nextOpen
        ) => {
          setOpen(nextOpen);

          setLastEvent(
            nextOpen
              ? "Solicitud de apertura."
              : "Drawer cerrado por acción dismiss o botón."
          );
        }}
        title="Dismiss configurable"
        description="Prueba Escape, pointer fuera y botón cerrar."
        items={
          drawerItems.slice(
            0,
            4
          )
        }
        closeOnEscape={
          closeOnEscape
        }
        closeOnPointerDownOutside={
          closeOnOutside
        }
        showCloseButton
        closeOnSelect={false}
      />
    </Stack>
  );
}


function FalsyRegionsExample() {
  const [
    footerZeroOpen,
    setFooterZeroOpen,
  ] =
    React.useState(false);

  const [
    booleanFooterOpen,
    setBooleanFooterOpen,
  ] =
    React.useState(false);

  const [
    falsyTitleOpen,
    setFalsyTitleOpen,
  ] =
    React.useState(false);

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
          onPress={() => {
            setFooterZeroOpen(
              true
            );
          }}
        >
          footer=0
        </Button>

        <Button
          variant="outline"
          onPress={() => {
            setBooleanFooterOpen(
              true
            );
          }}
        >
          footer=false
        </Button>

        <Button
          variant="outline"
          onPress={() => {
            setFalsyTitleOpen(
              true
            );
          }}
        >
          title=0 y description=0
        </Button>
      </Box>

      <DrawerNavigation
        open={footerZeroOpen}
        onOpenChange={
          setFooterZeroOpen
        }
        title="Footer numérico"
        items={
          drawerItems.slice(
            0,
            3
          )
        }
        footer={0}
        slotProps={{
          footer: {
            "data-debug-footer-zero":
              "",
          },

          footerContent: {
            "data-debug-footer-zero-content":
              "",
          },
        }}
      />

      <DrawerNavigation
        open={
          booleanFooterOpen
        }
        onOpenChange={
          setBooleanFooterOpen
        }
        title="Footer booleano"
        items={
          drawerItems.slice(
            0,
            3
          )
        }
        footer={false}
        slotProps={{
          footer: {
            "data-debug-footer-boolean":
              "",
          },
        }}
      />

      <DrawerNavigation
        open={
          falsyTitleOpen
        }
        onOpenChange={
          setFalsyTitleOpen
        }
        title={0}
        description={0}
        items={
          drawerItems.slice(
            0,
            3
          )
        }
        showCloseButton
      />
    </Stack>
  );
}


function ReadOnlyControlledExample() {
  const [
    open,
    setOpen,
  ] =
    React.useState(false);

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
          onPress={() => {
            setOpen(true);
          }}
        >
          Abrir controlado sin callback
        </Button>

        <Button
          variant="outline"
          onPress={() => {
            setOpen(false);
          }}
        >
          Cerrar desde el padre
        </Button>
      </Box>

      <Box
        style={{
          padding:
            "0.75rem",

          border:
            "1px solid var(--ui-border)",

          borderRadius:
            "var(--ui-radius-md)",

          background:
            "var(--ui-surface)",

          color:
            "var(--ui-text-muted)",

          lineHeight: 1.55,
        }}
      >
        Sin <code>onOpenChange</code>,
        Escape, backdrop, selección y
        botón cerrar no pueden modificar
        el valor controlado. El padre debe
        cerrarlo explícitamente.
      </Box>

      <DrawerNavigation
        open={open}
        title="Controlado de solo lectura"
        description="Este drawer no recibe onOpenChange."
        items={
          drawerItems.slice(
            0,
            4
          )
        }
      />
    </Stack>
  );
}


export function DrawerNavigationDebug() {
  return (
    <Box
      data-ui-drawer-navigation-debug=""
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
            DrawerNavigation
          </Heading>

          <Box
            as="p"
            style={{
              marginTop:
                "0.5rem",

              marginRight: 0,
              marginBottom: 0,
              marginLeft: 0,

              color:
                "var(--ui-text-muted)",

              lineHeight: 1.6,
            }}
          >
            Validación de slots,
            selección, cierre
            cancelable, expansión,
            placements, tamaños,
            dismiss, foco, contenido
            falsy y navegación con
            jerarquía.
          </Box>
        </Box>


        <DebugSection
          title="Controlado, slots, scroll y foco"
          description="Prueba placement, size, openIds controlado, jerarquía, badges, label complejo, item disabled, scroll del body, slots y restauración de foco."
        >
          <ControlledDrawerExample />
        </DebugSection>


        <DebugSection
          title="closeOnSelect=false y defaultOpenIds"
          description="La selección actualiza el estado, pero el drawer permanece abierto. La expansión es no controlada mediante defaultOpenIds."
        >
          <NoCloseDrawerExample />
        </DebugSection>


        <DebugSection
          title="preventDefault cancela el cierre"
          description="onSelect se ejecuta primero. event.preventDefault() evita que DrawerNavigation solicite el cierre."
        >
          <PreventDefaultDrawerExample />
        </DebugSection>


        <DebugSection
          title="Escape, pointer fuera y botón cerrar"
          description="Permite activar o desactivar cada mecanismo dismiss y comprobar que el botón cerrar sigue solicitando el cambio controlado."
        >
          <DismissContractExample />
        </DebugSection>


        <DebugSection
          title="ReactNode falsy"
          description="footer={0}, title={0} y description={0} deben conservarse. footer={false} no debe crear wrapper visible."
        >
          <FalsyRegionsExample />
        </DebugSection>


        <DebugSection
          title="Controlado sin onOpenChange"
          description="Demuestra el contrato de solo lectura cuando el consumidor no proporciona callback."
        >
          <ReadOnlyControlledExample />
        </DebugSection>


        <DebugSection
          title="Checklist manual"
          description="Puntos concretos para revisar durante la interacción y en DevTools."
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
              El panel visible contiene{" "}
              <code>
                data-ui-drawer-navigation
              </code>.
            </li>

            <li>
              Los atributos de{" "}
              <code>
                slotProps.root
              </code>{" "}
              llegan al mismo panel.
            </li>

            <li>
              Los slots body,
              navigation, footer y
              footerContent conservan sus
              atributos.
            </li>

            <li>
              Seleccionar una hoja cierra
              solo cuando{" "}
              <code>
                closeOnSelect
              </code>{" "}
              lo permite.
            </li>

            <li>
              Expandir un padre no
              seleccionable no cierra el
              drawer.
            </li>

            <li>
              El item disabled no
              selecciona ni cierra.
            </li>

            <li>
              <code>
                preventDefault()
              </code>{" "}
              cancela el cierre después
              de ejecutar al consumidor.
            </li>

            <li>
              Escape y pointer fuera
              respetan sus flags.
            </li>

            <li>
              El foco inicial llega al
              botón configurado y se
              restaura al trigger.
            </li>

            <li>
              El body conserva scroll con
              la lista extensa.
            </li>

            <li>
              <code>footer=0</code>{" "}
              crea footer y muestra el
              cero.
            </li>

            <li>
              <code>footer=false</code>{" "}
              no crea footer.
            </li>

            <li>
              <code>title=0</code> y{" "}
              <code>
                description=0
              </code>{" "}
              conservan sus IDs y
              referencias ARIA.
            </li>

            <li>
              El nombre del diálogo y el
              nombre del landmark{" "}
              <code>nav</code> permanecen
              separados.
            </li>
          </Box>
        </DebugSection>
      </Stack>
    </Box>
  );
}


DrawerNavigationDebug.displayName =
  "DrawerNavigationDebug";