# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C — triggers y overlays: **CERRADA**.
- Fase activa: **D — state engines y shells de producto**.
- D1 DataTable shell: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- D2 NavigationStack / TabScaffold: pendiente.
- D3 MotionPresence / MotionSwitch: pendiente.
- No se asignó todavía una versión siguiente.

## Validación que cerró Fase C

```text
tests dirigidos C3       18/18 PASS
Vitest completo         467/467 PASS
Chromium                  65/65 PASS
internal-test typecheck       PASS
package typecheck             PASS
build ESM/CJS/DTS             PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
git whitespace                PASS
Validation complete.
```

## Fase C — owners resultantes

- `TriggerRuntime` con modos press/passive;
- `FloatingOverlayRuntime`;
- `ModalOverlayRuntime`.

## D1 — decisión

DataTable y EditableDataTable no necesitan un componente público común.

Sí necesitan dos owners internos complementarios:

### Estado

`src/components/data-table/useDataTableShell.ts`

Posee:

- `useDataTableState`;
- responsive mode;
- row identity;
- selection;
- CSV export;
- skeleton row/column counts.

### Composición

`src/components/data-table/DataTableShellFrame.tsx`

Posee:

- DataTableRoot;
- DataTableToolbar;
- loading/skeleton;
- mobile/desktop branch;
- DataTablePagination.

## D1 — diferencias preservadas

### DataTable

Conserva:

- `DataTableMobileCards` estático;
- `DataTableDesktop`;
- `renderActions`.

### EditableDataTable

Conserva:

- derivación de searchable columns;
- `handleCellChange`;
- coerción;
- validación de identidad post-edit;
- `handleAddRow`;
- `handleDeleteRows`;
- renderers editables.

El shell común no conoce `onDataChange` ni semántica de edición.

## D1 — tests

Nuevos:

- `state-phase-d1-data-table-shell-ownership.test.ts`;
- `state-phase-d1-data-table-shell-behavior.test.tsx`.

Protegen:

- owners únicos;
- wrappers sin hooks/shell JSX duplicado;
- mutaciones editables fuera del shell;
- mismo lifecycle root/toolbar/pagination;
- mismo loading/skeleton branch.

## Criterio de cierre D1

Debe pasar:

```text
internal-test typecheck
tests D1 dirigidos
regresión DataTable/family
pnpm validate
```

Sólo después se abre D2.
