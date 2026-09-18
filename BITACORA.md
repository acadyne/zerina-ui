# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C: **CERRADA**.
- Fase D: **CERRADA**.
- Fase activa: **E — semántica de slots, layout y tipos**.
- E1 Slot precedence: **CERRADA**.
- E2 Layout prop matrix: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- E3 Recipe convergence: pendiente.
- E4 Tipos estructuralmente equivalentes: pendiente.
- No se asignó todavía una versión siguiente.

## Validación que cerró E1

```text
tests dirigidos E1       52/52 PASS
Vitest completo         512/512 PASS
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

## E1 — resultado vigente

Owners:

- `resolveSlotLayers`;
- `resolveLayeredSlot`;
- `resolveContextualSlot`;
- `resolveSlot`.

Precedencia declarativa:

```text
base → context(s) → local → direct className/style
```

Pipeline semántico de eventos:

```text
public/child → local slot → inherited slot → internal
```

## E2 — decisión

La familia de layout no debe tener una API plana artificial.

Hay dos contratos deliberados.

### Full layout frame

`Flex`, `Grid`, `Stack`

Owner de tipo interno:

`LayoutFrameProps`

Incluye:

```text
SizeProps
+ SpaceProps
+ SurfaceProps
```

### Flow layout frame

`Inline`, `Wrap`

Owner de tipo interno:

`FlowLayoutFrameProps`

Incluye:

```text
SpaceProps
+ w
+ minH
```

No incluye deliberadamente:

- surface props;
- `h`;
- `minW/maxW/maxH`;
- overflow genérico.

## E2 — inconsistencia corregida

Inline y Wrap duplicaban manualmente casi todo `SpaceProps`, pero omitían:

- `mx`;
- `my`.

Ahora extienden `FlowLayoutFrameProps` y soportan ambos aliases.

No se añadieron surface props ni el resto de SizeProps.

## E2 — diferencias preservadas

```text
Flex
  display flex/inline-flex
  gap
  direction/wrap/overflow

Grid
  display grid/inline-grid
  gap/rowGap/columnGap
  columns/rows/auto tracks

Stack
  flex/inline-flex
  spacing
  direction/wrap/overflow
  divider suppresses gap

Inline
  inline-flex
  gap
  configurable wrap
  divider + child normalization

Wrap
  flex
  spacing/rowSpacing/columnSpacing
  flex-wrap always wrap
  optional WrapItem
```

`gap` y `spacing` no se renombran.

## E2 — invariantes

En los cinco primitives:

```text
layout props/helpers
→ style directo
```

`style` sigue siendo override final.

Los tipos helper de matriz permanecen internos; no se agregan al barrel público.

## E2 — tests

Nuevos:

- `semantics-phase-e2-layout-matrix-ownership.test.ts`;
- `semantics-phase-e2-layout-matrix-behavior.test.tsx`.

Cubren:

- full-frame vs flow-frame ownership;
- helper types no públicos;
- size/space/surface comunes en full frames;
- `mx/my` en Inline/Wrap;
- defaults distintos de los cinco primitives;
- `style` como override final.

## Verificación estática disponible

```text
broken relative imports   0
```

## Criterio de cierre E2

Debe pasar:

```text
internal-test typecheck
tests E2 dirigidos
regresión E1/public surface
pnpm validate
```

Sólo después se abre E3.
