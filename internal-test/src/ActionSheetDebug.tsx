// internal-test/src/ActionSheetDebug.tsx

import React from "react";
import {
  ActionSheet,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  useToast,
} from "zerina-ui";

type DebugEvent = {
  id: number;
  message: string;
};

const nativeButtonStyle: React.CSSProperties = {
  minHeight: "2.5rem",
  padding: "0.55rem 0.85rem",
  border: "1px solid var(--ui-border)",
  borderRadius: "var(--ui-radius-md)",
  background: "var(--ui-surface)",
  color: "var(--ui-text)",
  font: "inherit",
  cursor: "pointer",
};

function getActiveElementLabel(): string {
  const activeElement =
    document.activeElement;

  if (
    !activeElement ||
    activeElement ===
    document.body
  ) {
    return "body";
  }

  return (
    activeElement.getAttribute(
      "aria-label"
    ) ??
    activeElement.getAttribute(
      "data-debug-focus"
    ) ??
    activeElement.textContent?.trim() ??
    activeElement.tagName.toLowerCase()
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

function StatePanel({
  open,
  lastItem,
  lastEvent,
  closeRequested,
  activeElement,
  events,
}: {
  open: boolean;
  lastItem: string;
  lastEvent: string;
  closeRequested: number;
  activeElement: string;
  events: DebugEvent[];
}) {
  return (
    <Box
      data-debug-action-sheet-state=""
      style={{
        padding: "0.75rem",
        border:
          "1px solid var(--ui-border)",
        borderRadius:
          "var(--ui-radius-md)",
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
          Estado visible
        </Box>

        <Box
          style={{
            color:
              "var(--ui-text-muted)",
            fontSize:
              "var(--ui-font-size-sm)",
            lineHeight: 1.55,
          }}
        >
          open:{" "}
          <strong>
            {String(open)}
          </strong>
          <br />
          último item:{" "}
          <strong>
            {lastItem || "—"}
          </strong>
          <br />
          último evento:{" "}
          <strong>
            {lastEvent || "—"}
          </strong>
          <br />
          cierres solicitados:{" "}
          <strong>
            {closeRequested}
          </strong>
          <br />
          elemento activo:{" "}
          <strong>
            {activeElement || "—"}
          </strong>
        </Box>

        <Box
          style={{
            maxHeight: 130,
            overflow: "auto",
            paddingTop: "0.25rem",
          }}
        >
          {events.length > 0 ? (
            <Stack spacing="0.2rem">
              {events.map(
                (event) => (
                  <Box
                    key={
                      event.id
                    }
                    style={{
                      color:
                        "var(--ui-text-muted)",
                      fontSize:
                        "0.75rem",
                    }}
                  >
                    {event.message}
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
      </Stack>
    </Box>
  );
}

function PrimaryActionSheetExample() {
  const { toast } =
    useToast();

  const triggerRef =
    React.useRef<HTMLButtonElement>(
      null
    );

  const initialFocusRef =
    React.useRef<HTMLButtonElement>(
      null
    );

  const eventSequenceRef =
    React.useRef(1);

  const [open, setOpen] =
    React.useState(false);

  const [
    lastItem,
    setLastItem,
  ] =
    React.useState("");

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState("");

  const [
    closeRequested,
    setCloseRequested,
  ] =
    React.useState(0);

  const [
    activeElement,
    setActiveElement,
  ] =
    React.useState("body");

  const [
    events,
    setEvents,
  ] =
    React.useState<
      DebugEvent[]
    >([]);

  const recordEvent =
    React.useCallback(
      (message: string) => {
        const id =
          eventSequenceRef.current;

        eventSequenceRef.current += 1;

        setLastEvent(
          message
        );

        setEvents(
          (current) => [
            {
              id,
              message,
            },
            ...current,
          ].slice(0, 14)
        );
      },
      []
    );

  const handleOpenChange =
    React.useCallback(
      (nextOpen: boolean) => {
        if (!nextOpen) {
          setCloseRequested(
            (current) =>
              current + 1
          );
        }

        setOpen(
          nextOpen
        );

        recordEvent(
          `onOpenChange(${String(
            nextOpen
          )})`
        );

        window.setTimeout(
          () => {
            setActiveElement(
              getActiveElementLabel()
            );
          },
          0
        );
      },
      [recordEvent]
    );

  const handleItem = (
    item: string
  ) => {
    setLastItem(item);
    recordEvent(
      `onPress: ${item}`
    );

    toast({
      title: item,
      description:
        "ActionSheet.Item ejecutó onPress.",
      variant: "info",
    });
  };

  return (
    <DebugSection
      title="Contrato principal"
      description="Prueba onPress, cierre automático, secciones, separator, disabled, foco inicial, restauración, Escape, pointer fuera, slots y scroll."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <button
          ref={triggerRef}
          type="button"
          data-debug-focus="trigger-principal"
          style={
            nativeButtonStyle
          }
          onClick={() => {
            setOpen(true);
            recordEvent(
              "abrir desde trigger"
            );
          }}
        >
          Abrir ActionSheet
        </button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setActiveElement(
              getActiveElementLabel()
            );
          }}
        >
          Leer foco
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            setEvents([]);
            setLastEvent("");
            setLastItem("");
            setCloseRequested(
              0
            );
          }}
        >
          Limpiar estado
        </Button>
      </Stack>

      <StatePanel
        open={open}
        lastItem={
          lastItem
        }
        lastEvent={
          lastEvent
        }
        closeRequested={
          closeRequested
        }
        activeElement={
          activeElement
        }
        events={events}
      />

      <ActionSheet
        open={open}
        onOpenChange={
          handleOpenChange
        }
        title="Opciones"
        description="Selecciona una acción para el elemento actual."
        overlayId="action-sheet-debug-primary"
        showHandle
        showCloseButton
        closeOnEscape
        closeOnPointerDownOutside
        autoFocus
        restoreFocus
        initialFocusRef={
          initialFocusRef
        }
        data-debug-root-prop="action-sheet-primary"
        styles={{
          panel: {
            outline:
              "1px solid color-mix(in srgb, var(--ui-primary) 20%, transparent)",
            outlineOffset:
              "-1px",
          },
          body: {
            background:
              "color-mix(in srgb, var(--ui-primary) 3%, var(--ui-surface))",
          },
        }}
        slotProps={{
          root: {
            "data-debug-slot-root":
              "preserved",
          },
          backdrop: {
            "data-debug-slot-backdrop":
              "preserved",
          },
          positioner: {
            "data-debug-slot-positioner":
              "preserved",
          },
          focusScope: {
            "data-debug-slot-focus-scope":
              "preserved",
          },
          panel: {
            "data-debug-slot-panel":
              "preserved",
            "aria-label":
              "ActionSheet principal",
          },
          handle: {
            "data-debug-slot-handle":
              "preserved",
          },
          handleIndicator: {
            "data-debug-slot-handle-indicator":
              "preserved",
          },
          header: {
            "data-debug-slot-header":
              "preserved",
          },
          title: {
            "data-debug-slot-title":
              "preserved",
          },
          description: {
            "data-debug-slot-description":
              "preserved",
          },
          closeButton: {
            "data-debug-slot-close":
              "preserved",
          },
          body: {
            "data-debug-slot-body":
              "preserved",
          },
        }}
      >


        <button
          ref={initialFocusRef}
          type="button"
          data-debug-focus="initial-focus"
          style={nativeButtonStyle}
          onClick={() => {
            recordEvent(
              "botón de foco inicial"
            );
          }}
        >
          Foco inicial
        </button>

        <ActionSheet.Section
          label="Archivo"
          description="Acciones comunes."
          data-debug-section="file"
          aria-label="Acciones de archivo"
        >
          <ActionSheet.Item
            icon="✎"
            onPress={() =>
              handleItem(
                "Renombrar"
              )
            }
            data-debug-focus="item-renombrar"
            data-debug-item="rename"
          >
            Renombrar
          </ActionSheet.Item>

          <ActionSheet.Item
            icon="⧉"
            tone="success"
            description="Crea una copia del archivo."
            onPress={() =>
              handleItem(
                "Duplicar"
              )
            }
          >
            Duplicar
          </ActionSheet.Item>

          <ActionSheet.Item
            icon="↗"
            tone="primary"
            label="Mover a carpeta"
            onPress={() =>
              handleItem(
                "Mover"
              )
            }
          />
        </ActionSheet.Section>

        <ActionSheet.Separator
          data-debug-separator=""
        />


        <ActionSheet.Section
          label="Zona peligrosa"
          description="Las acciones destructivas tienen prioridad visual."
          data-debug-section="danger"
        >
          <ActionSheet.Item
            destructive
            tone="success"
            icon="⌫"
            description="destructive debe ganar sobre tone=success."
            onPress={() => {
              handleItem(
                "Eliminar"
              );

              toast({
                title:
                  "Eliminar",
                description:
                  "destructive prevalece sobre success.",
                variant:
                  "danger",
                duration: 0,
              });
            }}
          >
            Eliminar archivo
          </ActionSheet.Item>

          <ActionSheet.Item
            disabled
            onPress={() => {
              handleItem(
                "Disabled ejecutado"
              );
            }}
          >
            Acción deshabilitada
          </ActionSheet.Item>
        </ActionSheet.Section>

        <ActionSheet.Separator />

        <ActionSheet.Item
          tone="warning"
          onLongPress={() => {
            setLastItem(
              "Long press"
            );
            recordEvent(
              "onLongPress ejecutado"
            );
          }}
          onPress={() =>
            handleItem(
              "Item directo"
            )
          }
        >
          Item directo sin sección
        </ActionSheet.Item>

        {Array.from(
          {
            length: 14,
          },
          (_, index) => (
            <ActionSheet.Item
              key={index}
              closeOnPress={
                false
              }
              onPress={() => {
                setLastItem(
                  `Extra ${index + 1
                  }`
                );

                recordEvent(
                  `extra ${index + 1
                  } sin cierre`
                );
              }}
            >
              Acción larga #
              {index + 1}
            </ActionSheet.Item>
          )
        )}
      </ActionSheet>
    </DebugSection>
  );
}

function ClosePolicyExample() {
  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState("—");

  const [
    closeRequests,
    setCloseRequests,
  ] =
    React.useState(0);

  const handleOpenChange = (
    nextOpen: boolean
  ) => {
    if (!nextOpen) {
      setCloseRequests(
        (current) =>
          current + 1
      );
    }

    setOpen(nextOpen);
    setLastEvent(
      `onOpenChange(${String(
        nextOpen
      )})`
    );
  };

  return (
    <DebugSection
      title="Política de cierre"
      description="closeOnPress global desactivado, override por item y cancelación mediante event.preventDefault()."
    >
      <Button
        onPress={() =>
          setOpen(true)
        }
      >
        Abrir políticas
      </Button>

      <Box
        style={{
          padding: "0.75rem",
          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "var(--ui-radius-md)",
          background:
            "var(--ui-surface)",
          color:
            "var(--ui-text-muted)",
          fontSize:
            "var(--ui-font-size-sm)",
          lineHeight: 1.5,
        }}
      >
        open:{" "}
        <strong>
          {String(open)}
        </strong>
        <br />
        último evento:{" "}
        <strong>
          {lastEvent}
        </strong>
        <br />
        cierres solicitados:{" "}
        <strong>
          {closeRequests}
        </strong>
      </Box>

      <ActionSheet
        open={open}
        onOpenChange={
          handleOpenChange
        }
        closeOnPress={
          false
        }
        title="Políticas de cierre"
        description="El cierre global está desactivado."
      >
        <ActionSheet.Item
          onPress={() => {
            setLastEvent(
              "global false: permanece abierto"
            );
          }}
        >
          Heredar closeOnPress=false
        </ActionSheet.Item>

        <ActionSheet.Item
          closeOnPress
          onPress={() => {
            setLastEvent(
              "override true: debe cerrar"
            );
          }}
        >
          Override closeOnPress=true
        </ActionSheet.Item>

        <ActionSheet.Item
          closeOnPress
          onPress={(event) => {
            event.preventDefault();

            setLastEvent(
              "preventDefault: permanece abierto"
            );
          }}
        >
          Cancelar cierre con preventDefault
        </ActionSheet.Item>

        <ActionSheet.Item
          closeOnPress={
            false
          }
          onLongPress={() => {
            setLastEvent(
              "onLongPress: no solicita cierre"
            );
          }}
          onPress={() => {
            setLastEvent(
              "onPress sin cierre"
            );
          }}
        >
          Long press independiente
        </ActionSheet.Item>
      </ActionSheet>
    </DebugSection>
  );
}

function ToneAndContentExample() {
  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const [
    lastItem,
    setLastItem,
  ] =
    React.useState("—");

  return (
    <DebugSection
      title="Tonos y formas de contenido"
      description="Cubre neutral, primary, success, warning, danger, destructive, children, label y nodos numéricos."
    >
      <Button
        onPress={() =>
          setOpen(true)
        }
      >
        Abrir tonos y contenido
      </Button>

      <Box
        style={{
          color:
            "var(--ui-text-muted)",
          fontSize:
            "var(--ui-font-size-sm)",
        }}
      >
        Último item:{" "}
        <strong>
          {lastItem}
        </strong>
      </Box>

      <ActionSheet
        open={open}
        onOpenChange={
          setOpen
        }
        closeOnPress={
          false
        }
        title="Tonos"
        description="Cada item conserva su contenido y tono."
      >
        <ActionSheet.Item
          tone="neutral"
          onPress={() =>
            setLastItem(
              "neutral"
            )
          }
        >
          Neutral
        </ActionSheet.Item>

        <ActionSheet.Item
          tone="primary"
          onPress={() =>
            setLastItem(
              "primary"
            )
          }
        >
          Primary
        </ActionSheet.Item>

        <ActionSheet.Item
          tone="success"
          onPress={() =>
            setLastItem(
              "success"
            )
          }
        >
          Success
        </ActionSheet.Item>

        <ActionSheet.Item
          tone="warning"
          onPress={() =>
            setLastItem(
              "warning"
            )
          }
        >
          Warning
        </ActionSheet.Item>

        <ActionSheet.Item
          tone="danger"
          onPress={() =>
            setLastItem(
              "danger"
            )
          }
        >
          Danger
        </ActionSheet.Item>

        <ActionSheet.Item
          destructive
          tone="success"
          onPress={() =>
            setLastItem(
              "destructive gana"
            )
          }
        >
          destructive + success
        </ActionSheet.Item>

        <ActionSheet.Item
          label="Solo label"
          description="No utiliza children."
          onPress={() =>
            setLastItem(
              "label"
            )
          }
        />

        <ActionSheet.Item
          icon={0}
          onPress={() =>
            setLastItem(
              "icon 0"
            )
          }
        >
          icon=0
        </ActionSheet.Item>

        <ActionSheet.Item
          onPress={() =>
            setLastItem(
              "children 0"
            )
          }
        >
          {0}
        </ActionSheet.Item>

        <ActionSheet.Item
          label={0}
          onPress={() =>
            setLastItem(
              "label 0"
            )
          }
        />

        <ActionSheet.Item
          description={0}
          onPress={() =>
            setLastItem(
              "description 0"
            )
          }
        >
          Description numérica
        </ActionSheet.Item>
      </ActionSheet>
    </DebugSection>
  );
}

function FalsyStructureExample() {
  const [
    normalOpen,
    setNormalOpen,
  ] =
    React.useState(false);

  const [
    falsyOpen,
    setFalsyOpen,
  ] =
    React.useState(false);

  return (
    <DebugSection
      title="Contenido falsy estructural"
      description="Valida secciones con label={0}, description={0} y BottomSheet con title={0}, description={0}."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <Button
          onPress={() =>
            setNormalOpen(
              true
            )
          }
        >
          Abrir sección falsy
        </Button>

        <Button
          variant="outline"
          onPress={() =>
            setFalsyOpen(
              true
            )
          }
        >
          Abrir título falsy
        </Button>
      </Stack>

      <ActionSheet
        open={normalOpen}
        onOpenChange={
          setNormalOpen
        }
        title="Secciones numéricas"
        description="La cabecera de la sección debe conservar ceros."
        closeOnPress={
          false
        }
      >
        <ActionSheet.Section
          label={0}
          description={0}
          data-debug-falsy-section=""
        >
          <ActionSheet.Item
            onPress={() => {
              // Cobertura visual.
            }}
          >
            Sección con label y description 0
          </ActionSheet.Item>
        </ActionSheet.Section>

        <ActionSheet.Section
          label={false}
          description={false}
          data-debug-boolean-section=""
        >
          <ActionSheet.Item
            onPress={() => {
              // Cobertura visual.
            }}
          >
            Booleanos sin header
          </ActionSheet.Item>
        </ActionSheet.Section>
      </ActionSheet>

      <ActionSheet
        open={falsyOpen}
        onOpenChange={
          setFalsyOpen
        }
        title={0}
        description={0}
        showHandle
        showCloseButton
        slotProps={{
          title: {
            "data-debug-falsy-title":
              "0",
          },
          description: {
            "data-debug-falsy-description":
              "0",
          },
        }}
      >
        <ActionSheet.Item
          onPress={() => {
            // El cierre automático valida onOpenChange.
          }}
        >
          Cerrar desde item
        </ActionSheet.Item>
      </ActionSheet>
    </DebugSection>
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
    React.useState(true);

  const [
    closeOnOutside,
    setCloseOnOutside,
  ] =
    React.useState(true);

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState("—");

  return (
    <DebugSection
      title="Contrato de dismiss"
      description="Permite inspeccionar el cierre por Escape y pointer fuera con cada política activa o desactivada."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <Button
          onPress={() =>
            setOpen(true)
          }
        >
          Abrir dismiss
        </Button>

        <Button
          size="sm"
          variant={
            closeOnEscape
              ? "solid"
              : "outline"
          }
          onPress={() =>
            setCloseOnEscape(
              (current) =>
                !current
            )
          }
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
          onPress={() =>
            setCloseOnOutside(
              (current) =>
                !current
            )
          }
        >
          Outside:{" "}
          {closeOnOutside
            ? "on"
            : "off"}
        </Button>
      </Stack>

      <Box
        style={{
          color:
            "var(--ui-text-muted)",
          fontSize:
            "var(--ui-font-size-sm)",
        }}
      >
        Último evento:{" "}
        <strong>
          {lastEvent}
        </strong>
      </Box>

      <ActionSheet
        open={open}
        onOpenChange={(
          nextOpen
        ) => {
          setOpen(
            nextOpen
          );

          setLastEvent(
            `onOpenChange(${String(
              nextOpen
            )})`
          );
        }}
        title="Dismiss"
        description="Prueba Escape y pointer fuera."
        closeOnEscape={
          closeOnEscape
        }
        closeOnPointerDownOutside={
          closeOnOutside
        }
        closeOnPress={
          false
        }
      >
        <ActionSheet.Item
          onPress={() =>
            setLastEvent(
              "item presionado"
            )
          }
        >
          Mantener abierto
        </ActionSheet.Item>
      </ActionSheet>
    </DebugSection>
  );
}

function ReadOnlyControlledExample() {
  const [
    open,
    setOpen,
  ] =
    React.useState(false);

  const [
    lastEvent,
    setLastEvent,
  ] =
    React.useState("—");

  return (
    <DebugSection
      title="Controlado sin onOpenChange"
      description="El consumidor controla open externamente. CloseButton, dismiss e items no pueden mutarlo sin callback."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <Button
          onPress={() => {
            setOpen(true);
            setLastEvent(
              "abierto externamente"
            );
          }}
        >
          Abrir externamente
        </Button>

        <Button
          variant="outline"
          onPress={() => {
            setOpen(false);
            setLastEvent(
              "cerrado externamente"
            );
          }}
        >
          Cerrar externamente
        </Button>
      </Stack>

      <Box
        style={{
          padding: "0.75rem",
          border:
            "1px solid var(--ui-border)",
          borderRadius:
            "var(--ui-radius-md)",
          background:
            "var(--ui-surface)",
          color:
            "var(--ui-text-muted)",
          fontSize:
            "var(--ui-font-size-sm)",
          lineHeight: 1.5,
        }}
      >
        open:{" "}
        <strong>
          {String(open)}
        </strong>
        <br />
        último evento:{" "}
        <strong>
          {lastEvent}
        </strong>
      </Box>

      <ActionSheet
        open={open}
        title="Solo lectura"
        description="No existe onOpenChange."
        showHandle={false}
        showCloseButton={false}
        closeOnEscape={false}
        closeOnPointerDownOutside={false}
      >
        <ActionSheet.Item
          closeOnPress={false}
          onPress={() =>
            setLastEvent(
              "item ejecutado; cierre ignorado por falta de onOpenChange"
            )
          }
        >
          Intentar cerrar sin callback
        </ActionSheet.Item>

        <ActionSheet.Item
          closeOnPress={false}
          onPress={() => {
            setOpen(false);
            setLastEvent(
              "cerrado externamente desde el contenido"
            );
          }}
        >
          Cerrar externamente
        </ActionSheet.Item>
      </ActionSheet>
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
          lineHeight: 1.75,
        }}
      >
        <li>
          onPress se ejecuta antes del cierre
          automático.
        </li>

        <li>
          preventDefault cancela el cierre.
        </li>

        <li>
          closeOnPress del item prevalece sobre
          el valor global.
        </li>

        <li>
          onLongPress no solicita cierre por sí
          mismo.
        </li>

        <li>
          El item disabled no ejecuta acciones.
        </li>

        <li>
          destructive prevalece visualmente
          sobre tone.
        </li>

        <li>
          children, label, icon y description
          conservan el valor 0.
        </li>

        <li>
          Las secciones conservan label=0 y
          description=0, pero no crean header
          para booleanos.
        </li>

        <li>
          title=0 y description=0 crean IDs y
          referencias ARIA válidas.
        </li>

        <li>
          Escape y pointer fuera respetan sus
          props de dismiss.
        </li>

        <li>
          Al abrir, el foco llega al botón marcado por
          initialFocusRef; al cerrar, vuelve al trigger.
        </li>

        <li>
          La lista larga hace scroll dentro del
          sheet.
        </li>

        <li>
          Los data-debug-slot-* aparecen en los
          elementos correspondientes.
        </li>

        <li>
          Sin onOpenChange, el estado controlado
          solo cambia desde los controles
          externos.
        </li>
      </Box>
    </DebugSection>
  );
}

export function ActionSheetDebug() {
  return (
    <Stack spacing="1rem">
      <PrimaryActionSheetExample />
      <ClosePolicyExample />
      <ToneAndContentExample />
      <FalsyStructureExample />
      <DismissContractExample />
      <ReadOnlyControlledExample />
      <ManualChecklist />
    </Stack>
  );
}

ActionSheetDebug.displayName =
  "ActionSheetDebug";