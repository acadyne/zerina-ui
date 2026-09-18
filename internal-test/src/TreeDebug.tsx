// internal-test/src/TreeDebug.tsx

import React from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Tree,
  type TreeApi,
  type TreeNodeId,
  type TreeNodeRenderContext,
  type TreeSelectionMode,
} from "zerina-ui";

type DemoTreeNode = {
  id: string;
  label: string;

  kind:
    | "file"
    | "directory";

  children?: DemoTreeNode[];
  asyncChildren?: DemoTreeNode[];

  delayMs?: number;
  shouldFail?: boolean;
  disabled?: boolean;
};

const rootNodes: DemoTreeNode[] = [
  {
    id: "src",
    label: "src",
    kind: "directory",

    children: [
      {
        id: "src/components",
        label: "components",
        kind: "directory",

        asyncChildren: [
          {
            id: "src/components/Tree.tsx",
            label: "Tree.tsx",
            kind: "file",
          },
          {
            id: "src/components/TreeItem.tsx",
            label: "TreeItem.tsx",
            kind: "file",
          },
          {
            id: "src/components/tree.types.ts",
            label: "tree.types.ts",
            kind: "file",
          },
        ],

        delayMs: 900,
      },

      {
        id: "src/hooks",
        label: "hooks",
        kind: "directory",

        asyncChildren: [
          {
            id: "src/hooks/useTreeState.ts",
            label: "useTreeState.ts",
            kind: "file",
          },
        ],

        delayMs: 1400,
      },

      {
        id: "src/index.ts",
        label: "index.ts",
        kind: "file",
      },
    ],
  },

  {
    id: "remote",
    label: "remote-ssh",
    kind: "directory",

    asyncChildren: [
      {
        id: "remote/home",
        label: "home",
        kind: "directory",

        asyncChildren: [
          {
            id: "remote/home/readme.md",
            label: "readme.md",
            kind: "file",
          },
          {
            id: "remote/home/package.json",
            label: "package.json",
            kind: "file",
          },
        ],

        delayMs: 1800,
      },

      {
        id: "remote/logs",
        label: "logs",
        kind: "directory",
        children: [],
      },
    ],

    delayMs: 2200,
  },

  {
    id: "error-directory",
    label: "error-directory",
    kind: "directory",
    shouldFail: true,
    delayMs: 800,
  },

  {
    id: "empty-directory",
    label: "empty-directory",
    kind: "directory",
    children: [],
  },

  {
    id: "disabled-directory",
    label: "disabled-directory",
    kind: "directory",
    disabled: true,

    children: [
      {
        id: "disabled-directory/hidden.txt",
        label: "hidden.txt",
        kind: "file",
      },
    ],
  },

  {
    id: "README.md",
    label: "README.md",
    kind: "file",
  },
];

function wait(
  delayMs: number,
  signal: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const handleAbort = (): void => {
      window.clearTimeout(timeoutId);

      reject(
        new DOMException(
          "Aborted",
          "AbortError"
        )
      );
    };

    const timeoutId = window.setTimeout(
      () => {
        signal.removeEventListener(
          "abort",
          handleAbort
        );

        resolve();
      },
      delayMs
    );

    if (signal.aborted) {
      handleAbort();
      return;
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

function getNodeIcon({
  branch,
  expanded,
  loading,
  refreshing,
}: TreeNodeRenderContext<DemoTreeNode>) {
  if (loading || refreshing) {
    return "◌";
  }

  if (branch) {
    return expanded
      ? "▾"
      : "▸";
  }

  return "•";
}

function normalizeSelectionForMode(
  selectedIds: ReadonlySet<TreeNodeId>,
  mode: TreeSelectionMode
): ReadonlySet<TreeNodeId> {
  if (mode === "none") {
    return new Set();
  }

  if (
    mode === "single" &&
    selectedIds.size > 1
  ) {
    const firstSelectedId =
      selectedIds.values().next().value;

    return firstSelectedId === undefined
      ? new Set()
      : new Set([firstSelectedId]);
  }

  return new Set(selectedIds);
}

export function TreeDebug() {
  const treeApiRef =
    React.useRef<TreeApi<DemoTreeNode>>(null);

  const [
    activatedNodeId,
    setActivatedNodeId,
  ] = React.useState<string | null>(null);

  const [
    expandedIds,
    setExpandedIds,
  ] = React.useState<
    ReadonlySet<TreeNodeId>
  >(
    () =>
      new Set([
        "src",
        "src/components",
      ])
  );

  const [
    selectedIds,
    setSelectedIds,
  ] = React.useState<
    ReadonlySet<TreeNodeId>
  >(() => new Set());

  const [
    selectionMode,
    setSelectionMode,
  ] = React.useState<TreeSelectionMode>(
    "single"
  );

  const [
    failuresEnabled,
    setFailuresEnabled,
  ] = React.useState(true);

  const changeSelectionMode =
    React.useCallback(
      (
        nextMode: TreeSelectionMode
      ): void => {
        setSelectionMode(nextMode);

        setSelectedIds((current) =>
          normalizeSelectionForMode(
            current,
            nextMode
          )
        );
      },
      []
    );

  return (
    <Card>
      <CardBody>
        <Stack spacing="0.75rem">
          <Heading size="sm">
            Tree
          </Heading>

          <Box
            style={{
              color:
                "var(--ui-text-muted)",

              fontSize:
                "var(--ui-font-size-sm)",

              lineHeight: 1.5,
            }}
          >
            Árbol genérico con nodos síncronos y
            asíncronos, selección configurable,
            expansión controlada, navegación por
            teclado, errores, reintento,
            invalidación y recarga.
          </Box>

          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Box
              style={{
                color:
                  "var(--ui-text-muted)",

                fontSize:
                  "var(--ui-font-size-sm)",
              }}
            >
              Selección:
            </Box>

            {(
              [
                "none",
                "single",
                "multiple",
              ] as const
            ).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={
                  selectionMode === mode
                    ? "solid"
                    : "outline"
                }
                onPress={() => {
                  changeSelectionMode(mode);
                }}
              >
                {mode}
              </Button>
            ))}
          </Box>

          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                void treeApiRef.current?.expand(
                  "remote"
                );
              }}
            >
              Expandir remote
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                treeApiRef.current?.collapse(
                  "remote"
                );
              }}
            >
              Contraer remote
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                void treeApiRef.current?.reload(
                  "remote"
                );
              }}
            >
              Recargar remote
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                treeApiRef.current?.invalidate(
                  "remote"
                );
              }}
            >
              Invalidar remote
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={() => {
                treeApiRef.current?.invalidateAll();
              }}
            >
              Invalidar todo
            </Button>

            <Button
              size="sm"
              variant={
                failuresEnabled
                  ? "solid"
                  : "outline"
              }
              onPress={() => {
                setFailuresEnabled(
                  (current) => !current
                );

                treeApiRef.current?.invalidate(
                  "error-directory"
                );
              }}
            >
              Error activo:{" "}
              {String(failuresEnabled)}
            </Button>
          </Box>

          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <Button
              size="sm"
              variant="outline"
              disabled={
                selectionMode === "none"
              }
              onPress={() => {
                treeApiRef.current?.select(
                  "README.md"
                );

                treeApiRef.current?.select(
                  "README.md"
                );
              }}
            >
              Seleccionar README ×2
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={
                selectionMode === "none"
              }
              onPress={() => {
                treeApiRef.current?.deselect(
                  "README.md"
                );
              }}
            >
              Deseleccionar README
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={
                selectionMode === "none"
              }
              onPress={() => {
                treeApiRef.current?.clearSelection();
              }}
            >
              Limpiar selección
            </Button>
          </Box>

          <Box
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",

              gap: "0.75rem",
            }}
          >
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
              <strong>Modo</strong>
              <br />
              {selectionMode}
            </Box>

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
              <strong>Expandidos</strong>
              <br />
              {[...expandedIds].join(", ") ||
                "ninguno"}
            </Box>

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
              <strong>Seleccionados</strong>
              <br />
              {[...selectedIds].join(", ") ||
                "ninguno"}
            </Box>

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
              <strong>Activado</strong>
              <br />
              {activatedNodeId ||
                "ninguno"}
            </Box>
          </Box>

          <Box
            style={{
              minHeight: 320,
              maxHeight: 520,

              overflow: "auto",

              padding: "0.5rem",

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-lg)",

              background:
                "var(--ui-surface)",
            }}
          >
            <Tree
              apiRef={treeApiRef}
              nodes={rootNodes}
              getNodeId={(node) =>
                node.id
              }
              getNodeLabel={(node) =>
                node.label
              }
              isNodeBranch={(node) =>
                node.kind === "directory"
              }
              getNodeChildren={(node) =>
                node.children
              }
              isNodeDisabled={(node) =>
                Boolean(node.disabled)
              }
              expandedIds={expandedIds}
              onExpandedIdsChange={
                setExpandedIds
              }
              selectedIds={selectedIds}
              onSelectedIdsChange={
                setSelectedIds
              }
              selectionMode={
                selectionMode
              }
              loadChildren={async ({
                node,
                signal,
              }) => {
                await wait(
                  node.delayMs ?? 700,
                  signal
                );

                if (
                  node.shouldFail &&
                  failuresEnabled
                ) {
                  throw new Error(
                    "No fue posible cargar este directorio."
                  );
                }

                return (
                  node.asyncChildren ?? []
                );
              }}
              onNodeActivate={({
                node,
              }) => {
                setActivatedNodeId(
                  node.id
                );
              }}
              renderNodeIcon={
                getNodeIcon
              }
              renderNodeActions={({
                node,
                branch,
              }) => (
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => {
                    setActivatedNodeId(
                      `acción:${node.id}`
                    );
                  }}
                >
                  {branch
                    ? "⋯"
                    : "Abrir"}
                </Button>
              )}
              renderLoading={({
                refreshing,
              }) =>
                refreshing
                  ? "Actualizando contenido…"
                  : "Cargando contenido remoto…"
              }
              renderEmpty={() =>
                "Este directorio está vacío"
              }
              renderError={({ error }) =>
                error instanceof Error
                  ? error.message
                  : "Error desconocido"
              }
              styles={{
                root: {
                  width: "100%",
                },

                row: {
                  minHeight: 36,
                },

                item: {
                  marginBlock: "0.1rem",
                },

                actions: {
                  opacity: 0.85,
                },
              }}
              slotProps={{
                root: {
                  "data-demo-slot-root":
                    "tree",
                },

                item: {
                  "data-demo-slot-item":
                    "tree-item",
                },

                row: {
                  "data-demo-slot-row":
                    "tree-row",
                },

                label: {
                  "data-demo-slot-label":
                    "tree-label",
                },

                actions: {
                  "data-demo-slot-actions":
                    "tree-actions",
                },

                loading: {
                  "data-demo-slot-loading":
                    "tree-loading",
                },

                error: {
                  "data-demo-slot-error":
                    "tree-error",
                },
              }}
            />
          </Box>

          <Box
            style={{
              padding: "0.75rem",

              borderRadius:
                "var(--ui-radius-md)",

              border:
                "1px solid var(--ui-border)",

              background:
                "var(--ui-surface)",

              color:
                "var(--ui-text-muted)",

              fontSize:
                "var(--ui-font-size-sm)",

              lineHeight: 1.5,
            }}
          >
            Checklist: cambia entre none, single y
            multiple; en multiple selecciona varios
            nodos y vuelve a pulsarlos para
            deseleccionarlos; “Seleccionar README ×2”
            debe mantener una sola selección. Abre
            remote y sus hijos para validar la carga
            asíncrona. error-directory debe mostrar
            error y reintento; desactiva el error y
            reintenta. empty-directory debe mostrar
            estado vacío. El nodo disabled debe
            ignorarse con ArrowUp y ArrowDown. Usa
            Home, End, ArrowLeft, ArrowRight, Enter y
            Space para validar el teclado.
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}