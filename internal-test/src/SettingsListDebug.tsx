// internal-test/src/SettingsListDebug.tsx

import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  SettingsList,
  Stack,
  useToast,
} from "zerina-ui";

type GraphicsQuality =
  | "battery"
  | "balanced"
  | "high"
  | "ultra";

type ChangeSnapshot = {
  control: string;
  previous: boolean;
  proposed: boolean;
  inputName: string;
  inputValue: string;
  eventChecked: boolean;
  defaultPrevented: boolean;
  changes: number;
};

const initialSnapshot: ChangeSnapshot = {
  control: "—",
  previous: false,
  proposed: false,
  inputName: "—",
  inputValue: "—",
  eventChecked: false,
  defaultPrevented: false,
  changes: 0,
};

function getNativeChoiceEventSnapshot(
  event:
    React.ChangeEvent<HTMLInputElement>
): Pick<
  ChangeSnapshot,
  | "inputName"
  | "inputValue"
  | "eventChecked"
  | "defaultPrevented"
> {
  const input =
    event.currentTarget;

  return {
    inputName:
      input.name || "—",

    inputValue:
      input.value || "—",

    eventChecked:
      input.checked,

    defaultPrevented:
      event.defaultPrevented,
  };
}

const nativeButtonStyle:
  React.CSSProperties = {
  appearance: "none",
  border:
    "1px solid var(--ui-border)",
  borderRadius:
    "var(--ui-radius-md)",
  background:
    "var(--ui-surface)",
  color:
    "var(--ui-text)",
  padding:
    "0.5rem 0.75rem",
  font: "inherit",
  cursor: "pointer",
};

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
          <Stack spacing="0.25rem">
            <Heading size="sm">
              {title}
            </Heading>

            {description !==
              undefined ? (
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
          </Stack>

          {children}
        </Stack>
      </CardBody>
    </Card>
  );
}

function StatePanel({
  snapshot,
}: {
  snapshot: ChangeSnapshot;
}) {
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "0.5rem",
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
      <Box>
        último control:{" "}
        <strong>
          {snapshot.control}
        </strong>
      </Box>

      <Box>
        valor anterior:{" "}
        <strong>
          {String(
            snapshot.previous
          )}
        </strong>
      </Box>

      <Box>
        valor propuesto:{" "}
        <strong>
          {String(
            snapshot.proposed
          )}
        </strong>
      </Box>

      <Box>
        input name:{" "}
        <strong>
          {snapshot.inputName}
        </strong>
      </Box>

      <Box>
        input value:{" "}
        <strong>
          {snapshot.inputValue}
        </strong>
      </Box>

      <Box>
        event checked:{" "}
        <strong>
          {String(
            snapshot.eventChecked
          )}
        </strong>
      </Box>

      <Box>
        defaultPrevented:{" "}
        <strong>
          {String(
            snapshot.defaultPrevented
          )}
        </strong>
      </Box>

      <Box>
        cambios:{" "}
        <strong>
          {snapshot.changes}
        </strong>
      </Box>
    </Box>
  );
}

function ControlledSettingsExample() {
  const { toast } =
    useToast();

  const [
    sound,
    setSound,
  ] =
    React.useState(true);

  const [
    vibration,
    setVibration,
  ] =
    React.useState(true);

  const [
    accepted,
    setAccepted,
  ] =
    React.useState(false);

  const [
    quality,
    setQuality,
  ] =
    React.useState<GraphicsQuality>(
      "balanced"
    );

  const [
    snapshot,
    setSnapshot,
  ] =
    React.useState<ChangeSnapshot>(
      initialSnapshot
    );

  const recordChange = (
    control: string,
    previous: boolean,
    proposed: boolean,
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    setSnapshot(
      (current) => ({
        control,
        previous,
        proposed,
        ...getNativeChoiceEventSnapshot(
          event
        ),
        changes:
          current.changes +
          1,
      })
    );
  };

  return (
    <DebugSection
      title="Contrato controlado"
      description="Switch y Checkbox controlados mediante eventos change nativos, Select con options y valores de formulario."
    >
      <StatePanel
        snapshot={snapshot}
      />

      <Box
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        <SettingsList
          variant="outlined"
          density="comfortable"
          data-debug-list="controlled"
        >
          <SettingsList.Section
            label="Juego"
            description="Preferencias controladas."
          >
            <SettingsList.Switch
              label="Sonido"
              description="Activa directamente el switch nativo."
              checked={sound}
              name="sound"
              value="enabled"
              rowValue={
                sound
                  ? "Activo"
                  : "Inactivo"
              }
              onCheckedChange={(
                next,
                event
              ) => {
                recordChange(
                  "Sonido",
                  sound,
                  next,
                  event
                );

                setSound(next);

                toast({
                  title:
                    "Sonido",
                  description:
                    `${event.currentTarget.name || "switch"}: ${String(
                      next
                    )}`,
                  variant:
                    "info",
                });
              }}
            />

            <SettingsList.Switch
              label="Vibración"
              description="Segundo caso controlado."
              checked={
                vibration
              }
              name="vibration"
              value="enabled"
              onCheckedChange={(
                next,
                event
              ) => {
                recordChange(
                  "Vibración",
                  vibration,
                  next,
                  event
                );

                setVibration(
                  next
                );
              }}
            />

            <SettingsList.Checkbox
              label="Aceptar modo experimental"
              description="Checkbox controlado."
              checked={
                accepted
              }
              name="experimental"
              value="accepted"
              rowValue={
                accepted
                  ? "Aceptado"
                  : "Pendiente"
              }
              onCheckedChange={(
                next,
                event
              ) => {
                recordChange(
                  "Experimental",
                  accepted,
                  next,
                  event
                );

                setAccepted(
                  next
                );
              }}
            />
          </SettingsList.Section>
        </SettingsList>

        <SettingsList
          variant="surface"
          density="compact"
        >
          <SettingsList.Section
            label="Gráficos"
            description="Select mediante options."
          >
            <SettingsList.Select
              label="Calidad"
              description="Preset gráfico activo."
              name="graphics-quality"
              value={quality}
              onValueChange={(
                next
              ) => {
                setQuality(
                  next as GraphicsQuality
                );

                toast({
                  title:
                    "Calidad gráfica",
                  description:
                    `Nuevo preset: ${next}`,
                  variant:
                    "success",
                });
              }}
              options={[
                {
                  label:
                    "Battery",
                  value:
                    "battery",
                },
                {
                  label:
                    "Balanced",
                  value:
                    "balanced",
                },
                {
                  label:
                    "High",
                  value:
                    "high",
                },
                {
                  label:
                    "Ultra",
                  value:
                    "ultra",
                },
              ]}
            />

            <SettingsList.Item
              label="Estado actual"
              description="Resumen del perfil."
              value={
                <Badge
                  variant="subtle"
                  colorScheme="success"
                >
                  {quality}
                </Badge>
              }
            />

            <SettingsList.Item
              label="Avanzado"
              description="Item interactivo."
              showChevron
              onPress={() => {
                toast({
                  title:
                    "Avanzado",
                  description:
                    "onPress ejecutado.",
                  variant:
                    "info",
                });
              }}
            />
          </SettingsList.Section>
        </SettingsList>
      </Box>
    </DebugSection>
  );
}

function UncontrolledSettingsExample() {
  const [
    snapshot,
    setSnapshot,
  ] =
    React.useState<ChangeSnapshot>(
      initialSnapshot
    );

  const recordChange = (
    control: string,
    previous: boolean,
    proposed: boolean,
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    setSnapshot(
      (current) => ({
        control,
        previous,
        proposed,
        ...getNativeChoiceEventSnapshot(
          event
        ),
        changes:
          current.changes +
          1,
      })
    );
  };

  const switchRef =
    React.useRef<HTMLInputElement>(
      null
    );

  const checkboxRef =
    React.useRef<HTMLInputElement>(
      null
    );

  const readRefState = () => {
    const switchValue =
      switchRef.current
        ?.checked;

    const checkboxValue =
      checkboxRef.current
        ?.checked;

    setSnapshot(
      (current) => ({
        ...current,
        control:
          `refs switch=${String(
            switchValue
          )}, checkbox=${String(
            checkboxValue
          )}`,
      })
    );
  };

  return (
    <DebugSection
      title="Contrato no controlado"
      description="defaultChecked, eventos nativos opcionales, refs a inputs y estado interno administrado por SettingsList."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <Button
          size="sm"
          variant="outline"
          onPress={
            readRefState
          }
        >
          Leer refs
        </Button>

        <button
          type="button"
          style={
            nativeButtonStyle
          }
          onClick={() => {
            switchRef.current
              ?.focus();
          }}
        >
          Enfocar switch
        </button>

        <button
          type="button"
          style={
            nativeButtonStyle
          }
          onClick={() => {
            checkboxRef.current
              ?.focus();
          }}
        >
          Enfocar checkbox
        </button>
      </Stack>

      <StatePanel
        snapshot={snapshot}
      />

      <SettingsList
        variant="outlined"
        density="comfortable"
      >
        <SettingsList.Section
          label="No controlados"
          description="Cada control nativo administra o comunica su estado resuelto."
        >
          <SettingsList.Switch
            ref={switchRef}
            label="Sin callback"
            description="El input administra su estado aunque no exista onCheckedChange."
            defaultChecked
            name="uncontrolled-switch-no-callback"
            value="enabled"
            rowValue="defaultChecked"
          />

          <SettingsList.Switch
            label="Con observador"
            description="Registra name, value y checked sin controlar el valor."
            defaultChecked={
              false
            }
            name="uncontrolled-switch-observed"
            value="enabled"
            onCheckedChange={(
              next,
              event
            ) => {
              const previous =
                !next;

              recordChange(
                "Switch no controlado",
                previous,
                next,
                event
              );
            }}
          />

          <SettingsList.Checkbox
            ref={checkboxRef}
            label="Checkbox no controlado"
            description="Debe alternar desde el checkbox nativo."
            defaultChecked
            name="uncontrolled-checkbox"
            value="accepted"
            onCheckedChange={(
              next,
              event
            ) => {
              recordChange(
                "Checkbox no controlado",
                !next,
                next,
                event
              );
            }}
          />

          <SettingsList.Checkbox
            label="Indeterminate"
            description="El input conserva aria-checked=mixed."
            indeterminate
            defaultChecked={
              false
            }
            name="indeterminate-checkbox"
            value="mixed"
          />
        </SettingsList.Section>
      </SettingsList>
    </DebugSection>
  );
}

function PreventDefaultExample() {
  const [
    snapshot,
    setSnapshot,
  ] =
    React.useState<ChangeSnapshot>(
      initialSnapshot
    )

  const preventChange = (
    control: string,
    proposed: boolean,
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    const previous =
      !proposed;

    event.preventDefault();

    setSnapshot(
      (current) => ({
        control,
        previous,
        proposed,
        ...getNativeChoiceEventSnapshot(
          event
        ),
        changes:
          current.changes +
          1,
      })
    );
  };

  return (
    <DebugSection
      title="Cancelación con preventDefault"
      description="Ambos cambios se cancelan desde el evento nativo del control. El valor visual debe permanecer estable."
    >
      <StatePanel
        snapshot={snapshot}
      />

      <SettingsList>
        <SettingsList.Section
          label="Cambios cancelados"
        >
          <SettingsList.Switch
            label="Cancelar switch"
            description="Pulsa el switch; debe permanecer apagado."
            defaultChecked={
              false
            }
            onCheckedChange={(
              next,
              event
            ) => {
              preventChange(
                "Switch cancelado",
                next,
                event
              );
            }}
          />

          <SettingsList.Checkbox
            label="Cancelar checkbox"
            description="Pulsa el checkbox; debe permanecer desmarcado."
            defaultChecked={
              false
            }
            onCheckedChange={(
              next,
              event
            ) => {
              preventChange(
                "Checkbox cancelado",
                next,
                event
              );
            }}
          />
        </SettingsList.Section>
      </SettingsList>
    </DebugSection>
  );
}

function SurfaceAndRefsExample() {
  const rootRef =
    React.useRef<HTMLDivElement>(
      null
    );

  const sectionRef =
    React.useRef<HTMLElement>(
      null
    );

  const itemRef =
    React.useRef<HTMLDivElement>(
      null
    );

  const selectRef =
    React.useRef<HTMLSelectElement>(
      null
    );

  const [
    result,
    setResult,
  ] =
    React.useState("—");

  const [
    childValue,
    setChildValue,
  ] =
    React.useState("");

  const inspectRefs = () => {
    setResult(
      [
        `root=${rootRef.current?.tagName ?? "null"}`,
        `section=${sectionRef.current?.tagName ?? "null"}`,
        `item=${itemRef.current?.tagName ?? "null"}`,
        `select=${selectRef.current?.tagName ?? "null"}`,
      ].join(", ")
    );
  };

  return (
    <DebugSection
      title="Superficie DOM y refs"
      description="Root, Section, Item y Select preservan refs, atributos DOM, clases, estilos, ARIA y data-*."
    >
      <Stack
        direction="row"
        spacing="0.5rem"
        wrap="wrap"
      >
        <Button
          size="sm"
          onPress={
            inspectRefs
          }
        >
          Inspeccionar refs
        </Button>

        <Button
          size="sm"
          variant="outline"
          onPress={() => {
            selectRef.current
              ?.focus();
          }}
        >
          Enfocar select
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
        {result}
      </Box>

      <SettingsList
        ref={rootRef}
        id="settings-list-debug-root"
        aria-label="SettingsList con superficie DOM"
        data-debug-root="preserved"
        className="settings-list-debug-root"
        style={{
          outline:
            "1px dashed var(--ui-border)",
          outlineOffset:
            "2px",
        }}
        variant="surface"
        density="compact"
      >
        <SettingsList.Section
          ref={sectionRef}
          id="settings-list-debug-section"
          aria-label="Sección de superficie"
          data-debug-section="preserved"
          className="settings-list-debug-section"
          style={{
            padding:
              "0.25rem",
          }}
          label="Superficie pública"
          description="Props delegadas a List.Section."
        >
          <SettingsList.Item
            ref={itemRef}
            id="settings-list-debug-item"
            aria-label="Item estático"
            data-debug-item="static"
            className="settings-list-debug-item"
            style={{
              minHeight: 52,
            }}
            label="Item estático"
            description="Con ref y props DOM."
            leading="L"
            trailing="T"
            value="Valor"
          />

          <SettingsList.Item
            label="Seleccionado"
            description="selected=true"
            selected
          />

          <SettingsList.Item
            label="Deshabilitado"
            description="No debe ejecutar onPress."
            disabled
            showChevron
            onPress={() => {
              setResult(
                "ERROR: item disabled ejecutado"
              );
            }}
          />

          <SettingsList.Item
            label="Interactivo"
            description="Con showChevron y onPress."
            showChevron
            onPress={() => {
              setResult(
                "item interactivo ejecutado"
              );
            }}
          />

          <SettingsList.Select
            ref={selectRef}
            label="Select con children"
            description="Sin prop options."
            value={childValue}
            placeholder="Selecciona"
            selectWidth={180}
            onValueChange={(
              next
            ) => {
              setChildValue(
                next
              );
            }}
          >
            <option value="one">
              Uno
            </option>

            <option value="two">
              Dos
            </option>
          </SettingsList.Select>
        </SettingsList.Section>
      </SettingsList>
    </DebugSection>
  );
}

function FalsyContentExample() {
  return (
    <DebugSection
      title="Contenido falsy"
      description="label, description, value, leading, trailing y rowValue deben conservar el número 0. Los booleanos de Section no deben crear header."
    >
      <SettingsList>
        <SettingsList.Section
          label={0}
          description={0}
          data-debug-falsy-section=""
        >
          <SettingsList.Item
            label={0}
            description={0}
            value={0}
            leading={0}
            trailing={0}
          />

          <SettingsList.Switch
            label="Switch rowValue=0"
            description={0}
            rowValue={0}
            defaultChecked
          />

          <SettingsList.Checkbox
            label="Checkbox rowValue=0"
            description={0}
            rowValue={0}
            defaultChecked
          />
        </SettingsList.Section>

        <SettingsList.Section
          label={false}
          description={false}
          data-debug-boolean-section=""
        >
          <SettingsList.Item
            label="Booleanos sin header"
            description="La sección no debe crear cabecera vacía."
          />
        </SettingsList.Section>
      </SettingsList>
    </DebugSection>
  );
}

function DisabledSelectExample() {
  const [
    first,
    setFirst,
  ] =
    React.useState(
      "balanced"
    );

  const [
    second,
    setSecond,
  ] =
    React.useState(
      "balanced"
    );

  const [
    third,
    setThird,
  ] =
    React.useState(
      "balanced"
    );

  return (
    <DebugSection
      title="Disabled e isDisabled"
      description="Valida disabled, isDisabled y la precedencia de isDisabled sobre disabled."
    >
      <SettingsList
        variant="outlined"
        density="comfortable"
      >
        <SettingsList.Section
          label="Select"
        >
          <SettingsList.Select
            label="disabled=true"
            value={first}
            disabled
            onValueChange={
              setFirst
            }
            options={[
              {
                label:
                  "Balanced",
                value:
                  "balanced",
              },
              {
                label:
                  "High",
                value:
                  "high",
              },
            ]}
          />

          <SettingsList.Select
            label="disabled=true"
            value={second}
            disabled
            onValueChange={
              setSecond
            }
            options={[
              {
                label:
                  "Balanced",
                value:
                  "balanced",
              },
              {
                label:
                  "High",
                value:
                  "high",
              },
            ]}
          />

          <SettingsList.Select
            label="enabled"
            description="Sin disabled: debe permanecer habilitado."
            value={third}
            onValueChange={
              setThird
            }
            options={[
              {
                label:
                  "Balanced",
                value:
                  "balanced",
              },
              {
                label:
                  "High",
                value:
                  "high",
              },
            ]}
          />
        </SettingsList.Section>
      </SettingsList>
    </DebugSection>
  );
}

function DensityAndScrollExample() {
  return (
    <DebugSection
      title="Densidades, variantes y contenido largo"
      description="Compara compact/comfortable, outlined/surface y comportamiento con listas extensas."
    >
      <Box
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        <SettingsList
          density="compact"
          variant="outlined"
        >
          <SettingsList.Section
            label="Compact outlined"
          >
            {Array.from(
              {
                length: 6,
              },
              (
                _,
                index
              ) => (
                <SettingsList.Item
                  key={index}
                  label={`Compact ${index + 1}`}
                  value={
                    index
                  }
                />
              )
            )}
          </SettingsList.Section>
        </SettingsList>

        <Box
          style={{
            maxHeight: 280,
            overflow: "auto",
          }}
        >
          <SettingsList
            density="comfortable"
            variant="surface"
          >
            <SettingsList.Section
              label="Comfortable surface"
              description="Contenedor con scroll."
            >
              {Array.from(
                {
                  length: 16,
                },
                (
                  _,
                  index
                ) => (
                  <SettingsList.Item
                    key={index}
                    label={`Preferencia larga ${index + 1}`}
                    description="Contenido de prueba para inspeccionar altura y scroll."
                    value={
                      index
                    }
                  />
                )
              )}
            </SettingsList.Section>
          </SettingsList>
        </Box>
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
          lineHeight: 1.75,
        }}
      >
        <li>
          Root, Section, Item, Switch,
          Checkbox y Select exponen sus refs.
        </li>

        <li>
          Section e Item conservan ARIA,
          data-*, className y style.
        </li>

        <li>
          Switch y Checkbox cambian únicamente
          desde sus inputs nativos.
        </li>

        <li>
          Pulsar la superficie estática de la fila
          no alterna el control.
        </li>

        <li>
          onCheckedChange expone name, value,
          checked y defaultPrevented nativos.
        </li>

        <li>
          preventDefault mantiene estable el
          estado no controlado.
        </li>

        <li>
          disabled no alterna ni emite cambios.
        </li>

        <li>
          Checkbox indeterminate conserva su
          estado visual y ARIA mixed.
        </li>

        <li>
          name y value llegan al input nativo;
          rowValue solo representa contenido
          visual.
        </li>

        <li>
          label, description, value, leading,
          trailing y rowValue conservan 0.
        </li>

        <li>
          Section no crea cabecera para valores
          booleanos.
        </li>

        <li>
          Select admite options, children,
          placeholder, disabled e isDisabled.
        </li>

        <li>
          isDisabled tiene precedencia sobre
          disabled.
        </li>

        <li>
          Las densidades, variantes y listas
          largas mantienen composición y scroll.
        </li>
      </Box>
    </DebugSection>
  );
}

export function SettingsListDebug() {
  return (
    <Stack spacing="1rem">
      <ControlledSettingsExample />
      <UncontrolledSettingsExample />
      <PreventDefaultExample />
      <SurfaceAndRefsExample />
      <FalsyContentExample />
      <DisabledSelectExample />
      <DensityAndScrollExample />
      <ManualChecklist />
    </Stack>
  );
}

SettingsListDebug.displayName =
  "SettingsListDebug";