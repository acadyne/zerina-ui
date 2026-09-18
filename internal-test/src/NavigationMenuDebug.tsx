// internal-test/src/NavigationMenuDebug.tsx

import {
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  Button,
  NavigationMenu,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type NavigationMenuApi,
  type NavigationMenuItemId,
} from "zerina-ui";

type DebugNavigationItemKind =
  | "route"
  | "group"
  | "remote";

interface DebugNavigationItem {
  id: string;
  label: string;
  kind: DebugNavigationItemKind;

  path?: string;
  icon?: string;

  disabled?: boolean;
  children?: readonly DebugNavigationItem[];
}

const navigationItems: readonly DebugNavigationItem[] = [
  {
    id: "home",
    label: "Inicio",
    kind: "route",
    path: "/",
    icon: "⌂",
  },
  {
    id: "projects",
    label: "Proyectos",
    kind: "group",
    icon: "▣",
    children: [
      {
        id: "projects-active",
        label: "Activos",
        kind: "group",
        children: [
          {
            id: "projects-active-web",
            label: "Web",
            kind: "group",
            children: [
              {
                id: "projects-active-web-zerina",
                label: "Zerina UI",
                kind: "route",
                path: "/projects/zerina-ui",
              },
              {
                id: "projects-active-web-editor",
                label: "Editor",
                kind: "route",
                path: "/projects/editor",
              },
            ],
          },
          {
            id: "projects-active-mobile",
            label: "Móvil",
            kind: "group",
            children: [
              {
                id: "projects-active-mobile-ios",
                label: "iOS",
                kind: "route",
                path: "/projects/mobile/ios",
              },
              {
                id: "projects-active-mobile-android",
                label: "Android",
                kind: "route",
                path: "/projects/mobile/android",
              },
            ],
          },
        ],
      },
      {
        id: "projects-archive",
        label: "Archivo",
        kind: "route",
        path: "/projects/archive",
      },
      {
        id: "projects-disabled",
        label: "Proyecto deshabilitado",
        kind: "route",
        path: "/projects/disabled",
        disabled: true,
      },
    ],
  },
  {
    id: "remote",
    label: "Remoto",
    kind: "remote",
    icon: "☁",
  },
  {
    id: "empty",
    label: "Vacío",
    kind: "group",
    icon: "○",
    children: [],
  },
  {
    id: "error",
    label: "Error remoto",
    kind: "remote",
    icon: "!",
  },
  {
    id: "settings",
    label: "Configuración",
    kind: "group",
    icon: "⚙",
    children: [
      {
        id: "settings-profile",
        label: "Perfil",
        kind: "route",
        path: "/settings/profile",
      },
      {
        id: "settings-security",
        label: "Seguridad",
        kind: "group",
        children: [
          {
            id: "settings-security-password",
            label: "Contraseña",
            kind: "route",
            path: "/settings/security/password",
          },
          {
            id: "settings-security-sessions",
            label: "Sesiones",
            kind: "route",
            path: "/settings/security/sessions",
          },
        ],
      },
    ],
  },
];

function wait(
  milliseconds: number,
  signal: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(
        new DOMException(
          "La operación fue cancelada.",
          "AbortError"
        )
      );

      return;
    }

    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener(
        "abort",
        handleAbort
      );

      resolve();
    }, milliseconds);

    function handleAbort(): void {
      window.clearTimeout(timeoutId);

      signal.removeEventListener(
        "abort",
        handleAbort
      );

      reject(
        new DOMException(
          "La operación fue cancelada.",
          "AbortError"
        )
      );
    }

    signal.addEventListener(
      "abort",
      handleAbort,
      {
        once: true,
      }
    );
  });
}

const sectionStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,

  boxSizing: "border-box",

  display: "grid",
  gap: "1rem",

  padding: "1rem",

  border:
    "1px solid var(--ui-border, #d4d4d8)",

  borderRadius: "0.75rem",

  overflow: "hidden",
};

const menuContainerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,

  minHeight: "18rem",

  padding: "1rem",

  boxSizing: "border-box",

  border:
    "1px dashed var(--ui-border, #a1a1aa)",

  borderRadius: "0.75rem",

  overflow: "hidden",
};

const controlsStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,

  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const statusStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,

  display: "grid",
  gap: "0.25rem",

  padding: "0.75rem",

  boxSizing: "border-box",

  borderRadius: "0.5rem",

  background:
    "rgba(127, 127, 127, 0.08)",

  fontFamily: "monospace",
  fontSize: "0.8rem",

  overflow: "hidden",
  overflowWrap: "anywhere",
};

const manualTestsStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,

  overflowWrap: "anywhere",
};

const manualTestsListStyle: CSSProperties = {
  marginBottom: 0,
  paddingInlineStart: "1.5rem",
};

export function NavigationMenuDebug() {
  const apiRef =
    useRef<NavigationMenuApi<DebugNavigationItem>>(
      null
    );


  const [openPath, setOpenPath] = useState<
    readonly NavigationMenuItemId[]
  >([]);

  // Abrir automaticamente una rama
  // const [openPath, setOpenPath] = useState<
  //   readonly NavigationMenuItemId[]
  // >(["projects"]);

  //   página profunda puedes controlar:
  // openPath={[
  //   "projects",
  //   "projects-active",
  //   "projects-active-web",
  // ]}
  // activeId="projects-active-web-zerina"
  // focusedId="projects-active-web-zerina"

  const [activeId, setActiveId] =
    useState<NavigationMenuItemId | null>(
      "home"
    );

  const [focusedId, setFocusedId] =
    useState<NavigationMenuItemId | null>(
      "home"
    );

  const [selectedPath, setSelectedPath] =
    useState("/");

  const [events, setEvents] = useState<
    readonly string[]
  >([]);

  const appendEvent = (
    message: string
  ): void => {
    setEvents((current) =>
      [message, ...current].slice(0, 8)
    );
  };

  return (
    <section style={sectionStyle}>
      <header>
        <h2
          style={{
            margin: 0,
          }}
        >
          NavigationMenu Debug
        </h2>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          Prueba recursión, hover, teclado, carga
          asíncrona, estados vacíos, errores,
          deshabilitados y API imperativa.
        </p>
      </header>

      <div style={menuContainerStyle}>
        <NavigationMenu<DebugNavigationItem>
          apiRef={apiRef}
          semantics="menubar"
          items={navigationItems}
          getItemId={(item) => item.id}
          getItemLabel={(item) => item.label}
          getItemChildren={(item) =>
            item.children
          }
          isItemBranch={(item) =>
            item.kind !== "route"
          }
          isItemDisabled={(item) =>
            item.disabled === true
          }
          loadChildren={async ({
            node,
            signal,
          }): Promise<
            readonly DebugNavigationItem[]
          > => {
            appendEvent(
              `loadChildren: ${node.id}`
            );

            await wait(900, signal);

            if (node.id === "error") {
              throw new Error(
                "Error simulado al cargar el menú."
              );
            }

            if (node.id === "remote") {
              return [
                {
                  id: "remote-america",
                  label: "América",
                  kind: "remote",
                },
                {
                  id: "remote-europe",
                  label: "Europa",
                  kind: "group",
                  children: [
                    {
                      id: "remote-europe-spain",
                      label: "España",
                      kind: "group",
                      children: [
                        {
                          id: "remote-europe-spain-madrid",
                          label: "Madrid",
                          kind: "route",
                          path: "/remote/europe/spain/madrid",
                        },
                        {
                          id: "remote-europe-spain-barcelona",
                          label: "Barcelona",
                          kind: "route",
                          path: "/remote/europe/spain/barcelona",
                        },
                      ],
                    },
                  ],
                },
              ];
            }

            if (node.id === "remote-america") {
              return [
                {
                  id: "remote-america-mexico",
                  label: "México",
                  kind: "remote",
                },
                {
                  id: "remote-america-canada",
                  label: "Canadá",
                  kind: "route",
                  path: "/remote/america/canada",
                },
              ];
            }

            if (
              node.id ===
              "remote-america-mexico"
            ) {
              return [
                {
                  id: "remote-america-mexico-cdmx",
                  label: "Ciudad de México",
                  kind: "route",
                  path: "/remote/america/mexico/cdmx",
                },
                {
                  id: "remote-america-mexico-jalisco",
                  label: "Jalisco",
                  kind: "route",
                  path: "/remote/america/mexico/jalisco",
                },
              ];
            }

            return [];
          }}
          openPath={openPath}
          onOpenPathChange={(
            nextOpenPath
          ) => {
            setOpenPath(nextOpenPath);

            appendEvent(
              `openPath: ${nextOpenPath.length > 0
                ? nextOpenPath.join(" → ")
                : "(vacío)"
              }`
            );
          }}
          activeId={activeId}
          onActiveIdChange={(
            nextActiveId
          ) => {
            setActiveId(nextActiveId);

            appendEvent(
              `activeId: ${nextActiveId ?? "(null)"
              }`
            );
          }}
          focusedId={focusedId}
          onFocusedIdChange={(
            nextFocusedId
          ) => {
            setFocusedId(nextFocusedId);
          }}
          onItemOpenChange={({
            itemId,
            open,
            reason,
            depth,
          }) => {
            appendEvent(
              `${open ? "open" : "close"
              }: ${String(
                itemId
              )}, depth=${depth}, reason=${reason}`
            );
          }}
          onItemSelect={async ({
            item,
            itemId,
            depth,
          }) => {
            const path =
              item.path ??
              `/item/${String(itemId)}`;

            setSelectedPath(path);

            appendEvent(
              `select: ${String(
                itemId
              )}, depth=${depth}, path=${path}`
            );
          }}
          onItemFocus={({
            itemId,
            depth,
          }) => {
            appendEvent(
              `focus: ${String(
                itemId
              )}, depth=${depth}`
            );
          }}
          renderItemIcon={({ item }) =>
            item.icon ? (
              <span aria-hidden="true">
                {item.icon}
              </span>
            ) : null
          }
          renderItemLabel={({
            item,
            depth,
          }) => {
            const label = (
              <span
                style={{
                  display: "block",

                  width: "100%",
                  minWidth: 0,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            );

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  {label}
                </TooltipTrigger>

                <TooltipContent
                  placement={
                    depth === 0
                      ? "top"
                      : "right"
                  }
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }}
          renderLoading={({ refreshing }) =>
            refreshing
              ? "Actualizando opciones…"
              : "Consultando opciones…"
          }
          renderEmpty={({ item }) => (
            <span>
              “{item.label}” no contiene opciones.
            </span>
          )}
          renderError={({
            error,
            retry,
          }) => (
            <div
              style={{
                width: "100%",
                minWidth: 0,

                display: "grid",
                gap: "0.4rem",

                overflowWrap: "anywhere",
              }}
            >
              <strong>
                Falló la carga simulada
              </strong>

              <span>
                {error instanceof Error
                  ? error.message
                  : String(error)}
              </span>

              <Button
                onPress={() => {
                  void retry();
                }}
              >
                Reintentar desde renderError
              </Button>
            </div>
          )}
          styles={{
            root: {
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,

              boxSizing: "border-box",
            },

            list: {
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,

              display: "flex",
              flexWrap: "nowrap",

              overflowX: "hidden",
              overflowY: "hidden",

              gap: "0.25rem",

              padding: "0.35rem",

              boxSizing: "border-box",

              borderRadius: "0.6rem",

              background:
                "rgba(127, 127, 127, 0.08)",
            },

            item: {
              minWidth: 0,
              flex: "1 1 0",
            },

            trigger: {
              width: "100%",
              minWidth: 0,

              overflow: "hidden",

              fontWeight: 600,
            },

            triggerContent: {
              width: "100%",
              minWidth: 0,

              overflow: "hidden",
            },

            icon: {
              flex: "0 0 auto",
            },

            label: {
              width: "100%",
              minWidth: 0,

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },

            panel: {
              width:
                "min(15rem, calc(100vw - 2rem))",

              minWidth: 0,

              maxWidth:
                "calc(100vw - 2rem)",

              boxSizing: "border-box",
            },

            panelList: {
              width: "100%",
              minWidth: 0,
            },

            panelItem: {
              width: "100%",
              minWidth: 0,
            },

            panelTrigger: {
              width: "100%",
              minWidth: 0,

              overflow: "hidden",
            },

            panelItemContent: {
              width: "100%",
              minWidth: 0,

              overflow: "hidden",
            },

            panelLabel: {
              minWidth: 0,

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },

            error: {
              width: "100%",
              minWidth: 0,

              boxSizing: "border-box",
            },
          }}
          slotProps={{
            root: {
              "aria-label":
                "Navegación de depuración",
            },

            list: {
              "data-debug-slot":
                "navigation-list",
            },

            panel: {
              "data-debug-slot":
                "navigation-panel",
            },
          }}
        />
      </div>

      <div style={controlsStyle}>
        <Button
          onPress={() => {
            void apiRef.current?.open(
              "projects"
            );
          }}
        >
          Abrir Proyectos
        </Button>

        <Button
          onPress={() => {
            void apiRef.current?.open(
              "settings"
            );
          }}
        >
          Abrir Configuración
        </Button>

        <Button
          onPress={async () => {
            await apiRef.current?.open(
              "remote"
            );

            await apiRef.current?.open(
              "remote-america"
            );
          }}
        >
          Abrir remoto profundo
        </Button>

        <Button
          onPress={() => {
            apiRef.current?.focus(
              "settings"
            );
          }}
        >
          Enfocar Configuración
        </Button>

        <Button
          onPress={() => {
            setFocusedId(null);

            appendEvent(
              "focusedId: (null)"
            );
          }}
        >
          Limpiar foco lógico
        </Button>

        <Button
          onPress={() => {
            apiRef.current?.closeAll();
          }}
        >
          Cerrar todo
        </Button>

        <Button
          onPress={() => {
            apiRef.current?.invalidate(
              "remote"
            );

            appendEvent(
              "invalidate: remote"
            );
          }}
        >
          Invalidar Remoto
        </Button>

        <Button
          onPress={() => {
            void apiRef.current?.reload(
              "remote"
            );
          }}
        >
          Recargar Remoto
        </Button>

        <Button
          onPress={() => {
            setEvents([]);
          }}
        >
          Limpiar eventos
        </Button>
      </div>

      <div style={statusStyle}>
        <strong>Estado controlado</strong>

        <span>
          openPath:{" "}
          {openPath.length > 0
            ? openPath.join(" → ")
            : "(vacío)"}
        </span>

        <span>
          activeId:{" "}
          {activeId === null
            ? "(null)"
            : String(activeId)}
        </span>

        <span>
          focusedId:{" "}
          {focusedId === null
            ? "(null)"
            : String(focusedId)}
        </span>

        <span>
          selectedPath: {selectedPath}
        </span>
      </div>

      <div style={statusStyle}>
        <strong>Eventos recientes</strong>

        {events.length === 0 ? (
          <span>(sin eventos)</span>
        ) : (
          events.map((event, index) => (
            <span key={`${index}-${event}`}>
              {event}
            </span>
          ))
        )}
      </div>

      <div style={manualTestsStyle}>
        <strong>Pruebas manuales</strong>

        <ol style={manualTestsListStyle}>
          <li>
            Comprueba que Proyectos aparezca abierto
            desde el primer render.
          </li>

          <li>
            Pulsa Abrir Configuración y verifica los
            eventos de cierre de Proyectos y apertura
            de Configuración.
          </li>

          <li>
            Pulsa Limpiar foco lógico y usa Tab para
            entrar nuevamente al menubar.
          </li>

          <li>
            Usa flechas izquierda y derecha en el
            nivel raíz.
          </li>

          <li>
            Usa flechas arriba y abajo dentro de los
            paneles.
          </li>

          <li>
            Usa Enter o Espacio para abrir, cerrar y
            seleccionar.
          </li>

          <li>
            Usa Escape para cerrar un nivel y regresar
            al trigger padre.
          </li>

          <li>
            Abre Remoto y navega hasta México para
            probar carga asíncrona recursiva.
          </li>

          <li>
            Abre Error remoto y prueba el contenido
            personalizado de error y su reintento.
          </li>

          <li>
            Comprueba que Proyecto deshabilitado no
            reciba foco ni interacción.
          </li>

          <li>
            Coloca la ventana cerca del borde derecho
            para verificar el flip de los submenús.
          </li>
        </ol>
      </div>
    </section>
  );
}