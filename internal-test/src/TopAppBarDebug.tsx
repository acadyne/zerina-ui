// internal-test/src/TopAppBarDebug.tsx

import React from "react";

import {
  BackButton,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  IconButton,
  Input,
  Stack,
  TopAppBar,
} from "zerina-ui";


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
                  color: "var(--ui-text-muted)",
                  lineHeight: 1.5,
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


function StatusPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      role="status"
      aria-live="polite"
      style={{
        padding: "0.75rem",
        border: "1px solid var(--ui-border)",
        borderRadius: "var(--ui-radius-md)",
        background: "var(--ui-surface-container)",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        lineHeight: 1.55,
      }}
    >
      {children}
    </Box>
  );
}


function BarSandbox({
  children,
  width = "100%",
}: {
  children: React.ReactNode;
  width?: number | string;
}) {
  return (
    <Box
      style={{
        width,
        minWidth: 0,
        overflow: "hidden",
        border: "1px solid var(--ui-border)",
        borderRadius: "var(--ui-radius-xl)",
        background: "var(--ui-surface-canvas)",
      }}
    >
      {children}
    </Box>
  );
}


export function TopAppBarDebug() {
  const headerRef =
    React.useRef<HTMLElement>(
      null
    );

  const [
    lastAction,
    setLastAction,
  ] = React.useState(
    "Sin interacción."
  );

  const [
    query,
    setQuery,
  ] = React.useState("");

  const [
    refAttached,
    setRefAttached,
  ] = React.useState(false);

  React.useEffect(() => {
    setRefAttached(
      headerRef.current?.tagName ===
        "HEADER"
    );
  }, []);

  return (
    <Box
      data-ui-top-app-bar-debug=""
      style={{
        width: "100%",
        maxWidth: 1120,
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <Stack spacing="1.5rem">
        <Box>
          <Heading>
            TopAppBar
          </Heading>

          <Box
            as="p"
            style={{
              marginTop: "0.5rem",
              marginBottom: 0,
              color: "var(--ui-text-muted)",
              lineHeight: 1.6,
            }}
          >
            Validación de tamaños, variantes, centrado visual,
            contenido personalizado, valores ReactNode falsy,
            sticky, safe area, slots y ref al elemento header.
          </Box>
        </Box>


        <DebugSection
          title="Tamaños y variantes"
          description="Comparación de sm, md y lg con solid, transparent y blur."
        >
          <Stack spacing="1rem">
            <BarSandbox>
              <TopAppBar
                size="sm"
                variant="solid"
                title="TopAppBar pequeño"
                subtitle="Variante solid"
                leading={
                  <BackButton
                    ariaLabel="Volver"
                    icon="‹"
                    size="sm"
                    variant="ghost"
                    onBack={() => {
                      setLastAction(
                        "BackButton en sm."
                      );
                    }}
                  />
                }
                actions={
                  <IconButton
                    ariaLabel="Buscar"
                    size="sm"
                    variant="ghost"
                    icon="⌕"
                  />
                }
              />
            </BarSandbox>

            <BarSandbox>
              <TopAppBar
                size="md"
                variant="transparent"
                title="TopAppBar mediano"
                subtitle="Variante transparent"
                leading={
                  <IconButton
                    ariaLabel="Abrir menú"
                    size="sm"
                    variant="ghost"
                    icon="☰"
                  />
                }
                actions={
                  <>
                    <IconButton
                      ariaLabel="Buscar"
                      size="sm"
                      variant="ghost"
                      icon="⌕"
                    />

                    <IconButton
                      ariaLabel="Más opciones"
                      size="sm"
                      variant="ghost"
                      icon="⋯"
                    />
                  </>
                }
              />
            </BarSandbox>

            <BarSandbox>
              <TopAppBar
                size="lg"
                variant="blur"
                title="TopAppBar grande"
                subtitle="Variante blur"
                leading={
                  <Box
                    aria-label="Zerina UI"
                    style={{
                      width: 34,
                      height: 34,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "9999px",
                      background:
                        "color-mix(in srgb, var(--ui-primary) 16%, transparent)",
                      color: "var(--ui-primary)",
                      fontWeight:
                        "var(--ui-font-weight-bold)",
                    }}
                  >
                    Z
                  </Box>
                }
                actions={
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    Acción
                  </Button>
                }
              />
            </BarSandbox>
          </Stack>
        </DebugSection>


        <DebugSection
          title="centerTitle y anchos asimétricos"
          description="El título debe permanecer visualmente centrado aunque leading y actions tengan anchos distintos."
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            <BarSandbox>
              <TopAppBar
                centerTitle={false}
                title="Título alineado al inicio"
                subtitle="centerTitle=false"
                leading={
                  <IconButton
                    ariaLabel="Volver"
                    size="sm"
                    variant="ghost"
                    icon="‹"
                  />
                }
                actions={
                  <>
                    <IconButton
                      ariaLabel="Buscar"
                      size="sm"
                      variant="ghost"
                      icon="⌕"
                    />

                    <IconButton
                      ariaLabel="Compartir"
                      size="sm"
                      variant="ghost"
                      icon="↗"
                    />
                  </>
                }
              />
            </BarSandbox>

            <BarSandbox>
              <TopAppBar
                centerTitle
                title="Título centrado"
                subtitle="leading corto, actions largas"
                leading={
                  <IconButton
                    ariaLabel="Volver"
                    size="sm"
                    variant="ghost"
                    icon="‹"
                  />
                }
                actions={
                  <>
                    <IconButton
                      ariaLabel="Buscar"
                      size="sm"
                      variant="ghost"
                      icon="⌕"
                    />

                    <Button
                      size="sm"
                      variant="outline"
                    >
                      Guardar
                    </Button>
                  </>
                }
              />
            </BarSandbox>
          </Box>
        </DebugSection>


        <DebugSection
          title="Viewport estrecho"
          description="El centro usa porcentaje del propio TopAppBar, no unidades vw del navegador."
        >
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BarSandbox width={320}>
              <TopAppBar
                centerTitle
                title="Título muy largo que debe recortarse sin desbordar el contenedor"
                subtitle="Subtítulo igualmente largo para validar ellipsis"
                leading={
                  <IconButton
                    ariaLabel="Volver"
                    size="sm"
                    variant="ghost"
                    icon="‹"
                  />
                }
                actions={
                  <>
                    <IconButton
                      ariaLabel="Buscar"
                      size="sm"
                      variant="ghost"
                      icon="⌕"
                    />

                    <IconButton
                      ariaLabel="Más opciones"
                      size="sm"
                      variant="ghost"
                      icon="⋯"
                    />
                  </>
                }
              />
            </BarSandbox>
          </Box>
        </DebugSection>


        <DebugSection
          title="Center personalizado y slots"
          description="El contenido custom debe seguir recibiendo styles.center y slotProps.center."
        >
          <StatusPanel>
            Ref apunta a header:{" "}
            {String(refAttached)}
            <br />
            Query:{" "}
            {query || "vacío"}
            <br />
            Última acción:{" "}
            {lastAction}
          </StatusPanel>

          <BarSandbox>
            <TopAppBar
              ref={headerRef}
              centerTitle
              center={
                <Input
                  aria-label="Buscar en TopAppBar"
                  value={query}
                  placeholder="Buscar..."
                  onChange={(event) => {
                    setQuery(
                      event.target.value
                    );
                  }}
                />
              }
              leading={
                <IconButton
                  ariaLabel="Abrir navegación"
                  size="sm"
                  variant="ghost"
                  icon="☰"
                  onPress={() => {
                    setLastAction(
                      "Navegación abierta."
                    );
                  }}
                />
              }
              actions={
                <IconButton
                  ariaLabel="Limpiar búsqueda"
                  size="sm"
                  variant="ghost"
                  icon="×"
                  onPress={() => {
                    setQuery("");
                    setLastAction(
                      "Búsqueda limpiada."
                    );
                  }}
                />
              }
              className="debug-top-app-bar-root"
              style={{
                outline:
                  "2px solid color-mix(in srgb, var(--ui-primary) 14%, transparent)",
                outlineOffset: "-2px",
              }}
              styles={{
                center: {
                  width: "100%",
                  maxWidth: 360,
                },

                actions: {
                  minWidth: 40,
                },
              }}
              slotProps={{
                root: {
                  "data-debug-top-app-bar-root":
                    "",
                },

                center: {
                  "data-debug-top-app-bar-center":
                    "",
                  "aria-label":
                    "Centro personalizado",
                },

                actions: {
                  "data-debug-top-app-bar-actions":
                    "",
                },
              }}
            />
          </BarSandbox>
        </DebugSection>


        <DebugSection
          title="ReactNode falsy y regiones ausentes"
          description="0 debe renderizarse. Los booleanos y valores nullish no deben crear contenido visible."
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            <BarSandbox>
              <TopAppBar
                title={0}
                subtitle={0}
                leading={0}
                actions={0}
                variant="solid"
              />
            </BarSandbox>

            <BarSandbox>
              <TopAppBar
                title={null}
                subtitle={undefined}
                leading={false}
                actions={undefined}
                variant="transparent"
              />
            </BarSandbox>

            <BarSandbox>
              <TopAppBar
                title="Este título no debe aparecer"
                subtitle="Este subtítulo tampoco"
                center={false}
                variant="solid"
              />
            </BarSandbox>
          </Box>
        </DebugSection>


        <DebugSection
          title="Sticky y safe area"
          description="La barra sticky debe permanecer arriba dentro del sandbox y safeAreaTop debe aplicar padding superior."
        >
          <Box
            style={{
              height: 320,
              overflow: "auto",
              border: "1px solid var(--ui-border)",
              borderRadius: "var(--ui-radius-xl)",
              background: "var(--ui-surface-canvas)",
            }}
          >
            <TopAppBar
              sticky
              safeAreaTop
              title="TopAppBar sticky"
              subtitle="Con safe area superior"
              leading={
                <IconButton
                  ariaLabel="Volver"
                  size="sm"
                  variant="ghost"
                  icon="‹"
                />
              }
              actions={
                <IconButton
                  ariaLabel="Más opciones"
                  size="sm"
                  variant="ghost"
                  icon="⋯"
                />
              }
              slotProps={{
                root: {
                  "data-debug-sticky-root":
                    "",
                },
              }}
            />

            <Box
              style={{
                minHeight: 680,
                padding: "1rem",
                boxSizing: "border-box",
              }}
            >
              {Array.from(
                {
                  length: 10,
                },
                (_, index) => (
                  <Box
                    key={index}
                    style={{
                      marginBottom: "0.75rem",
                      padding: "0.85rem",
                      border:
                        "1px solid var(--ui-border)",
                      borderRadius:
                        "var(--ui-radius-lg)",
                      background:
                        "var(--ui-surface)",
                    }}
                  >
                    Elemento #{index + 1}
                  </Box>
                )
              )}
            </Box>
          </Box>
        </DebugSection>


        <DebugSection
          title="Inspección"
          description="Puntos concretos para revisar en DevTools y durante la interacción."
        >
          <Box
            as="ul"
            style={{
              margin: 0,
              paddingLeft: "1.25rem",
              lineHeight: 1.7,
            }}
          >
            <li>
              El root real es un elemento{" "}
              <code>header</code>.
            </li>

            <li>
              El ref de TopAppBar apunta al header.
            </li>

            <li>
              El center personalizado conserva atributos y estilos del slot center.
            </li>

            <li>
              El input central continúa siendo interactivo con{" "}
              <code>centerTitle</code>.
            </li>

            <li>
              El título centrado no usa unidades{" "}
              <code>vw</code>.
            </li>

            <li>
              Los títulos largos aplican ellipsis dentro de un viewport estrecho.
            </li>

            <li>
              Los valores numéricos <code>0</code> permanecen renderizados.
            </li>

            <li>
              <code>center=false</code> suprime título y subtítulo.
            </li>

            <li>
              El wrapper actions permanece estable incluso sin contenido.
            </li>

            <li>
              La barra sticky conserva su posición dentro del sandbox.
            </li>
          </Box>
        </DebugSection>
      </Stack>
    </Box>
  );
}


TopAppBarDebug.displayName =
  "TopAppBarDebug";