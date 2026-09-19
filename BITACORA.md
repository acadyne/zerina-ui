# BITACORA

## Objetivo actual

Refactorizar `zerina-ui` sin obligaciones de compatibilidad histórica, eliminando procesos duplicados y dejando un único owner por mecánica transversal.

La demo permanece como consumidor de integración para fases posteriores.

## Invariante de compatibilidad

El usuario autorizó cambios breaking y no desea legacy.

Por tanto:

- no mantener aliases deprecated para responsabilidades eliminadas;
- no conservar dos procesos para la misma mecánica;
- actualizar todos los consumidores al owner único;
- no dejar implementaciones parciales ni adapters temporales;
- cada extracción debe quedar acompañada de regresión.

La evolución apunta semánticamente a `0.5.0`; la metadata se cambiará al cierre.

## Estado actual

- Fase 1 — superficie pública + package gate: **CERRADA Y VALIDADA**.
- Fase 2A — fundamentos unificados: **IMPLEMENTADA R3, PENDIENTE DE `pnpm validate`**.
- Fase 2B — Navigation Destinations: no iniciada.
- Fase 2C — ownership de Scaffold: no iniciada.
- Fase 3 — Navigation Presenter/política responsive: no iniciada.

## Fase 2A — owners consolidados

### Safe-area

Owner único:

```text
src/helpers/safeArea.ts
```

Eliminados:

- `SafeEdges`;
- `ScreenContentSafeAreaEdges`;
- resolvers locales;
- conocimiento directo de variables safe-area en consumidores TS/TSX.

Los consumidores importan el owner central; `src/styles/safe-area.css` continúa definiendo las variables funcionales `--ui-safe-*-offset`.

### CSS sizing

Owner único:

```text
src/helpers/css.ts#cssSize
```

Firma única:

```ts
cssSize(
  value: number | string | undefined
): string | undefined
```

Eliminados:

- overloads redundantes;
- `px`;
- `toCssSize`;
- `adaptiveScaffold.utils#cssSize`;
- aliases de sizing en navegación.

### Scroll

`PageScroll` eliminado completamente.

`ScrollArea` queda como motor. El ownership de shell/content se resolverá en Fase 2C.

### Responsive

Owner único:

```text
src/core/viewport/useAdaptiveViewport.ts
```

Consumido por:

- AdaptiveScaffold;
- DataTable shell.

Eliminados:

- `useDataTableResponsiveMode`;
- `resolveAdaptiveScaffoldMode`.

Breakpoints normalizados por `resolveUIViewportBreakpoints`.

## Validaciones del usuario durante Fase 2A

### Intento 1

`pnpm validate` falló en typecheck con TS2769 por los overloads de `cssSize`.

Corrección R2:

- eliminar overloads;
- una sola firma union-safe;
- regresión de typecheck/runtime.

### Intento 2 / siguiente avance real del gate

El typecheck ya avanzó hasta Vitest.

Vitest reportó:

```text
1 failed | 81 passed
588 passed | 1 failed
```

Fallo:

```text
css-distribution.test.ts
"uses only --ui-safe-* variables in safe-area consumers"
```

Causa:

La prueba pertenecía a la arquitectura anterior y exigía que `Screen`, `SafeArea` y `TopAppBar` conocieran directamente `--ui-safe-*`.

Eso contradice la nueva invariante de owner único.

### Corrección R3

La regresión de distribución ahora exige:

1. `src/helpers/safeArea.ts` es el único owner TypeScript de las variables normalizadas;
2. los consumidores importan `helpers/safeArea`;
3. los consumidores no contienen variables safe-area directas;
4. no existen variables legacy `--safe-*`;
5. `src/styles/safe-area.css` continúa definiendo `--ui-safe-*-offset`.

Esto no relaja el contrato: lo actualiza para verificar la centralización buscada.

## Validado en el runtime actual después de R3

- las aserciones nuevas de ownership safe-area: PASS;
- las cuatro variables `--ui-safe-*-offset` siguen definidas en `safe-area.css`: PASS;
- consumidores seleccionados no contienen variables safe-area directas: PASS;
- owner central no contiene variables legacy: PASS;
- no se ha reintroducido ningún owner retirado.

## No validado

- Falta un nuevo `pnpm validate` del usuario después de R3.
- Fase 2A NO se considera cerrada hasta ese PASS integral.
- Fase 2B no debe comenzar antes del PASS.

## Siguiente paso

Aplicar R3 y ejecutar primero:

```bash
pnpm --filter zerina-ui-internal-test test -- css-distribution.test.ts
```

Si pasa, ejecutar:

```bash
pnpm validate
```

Sólo después cerrar Fase 2A.
