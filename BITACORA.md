# BITACORA

## Objetivo actual

Refactorizar `zerina-ui` sin obligaciones de compatibilidad histórica, eliminando procesos duplicados y dejando un único owner por mecánica transversal.

La demo sigue disponible como consumidor real y se retomará después de consolidar la arquitectura.

## Invariante de compatibilidad vigente

El usuario autorizó explícitamente cambios breaking y no desea legacy.

Por tanto:

- no crear aliases deprecated para APIs redundantes;
- no mantener dos caminos para la misma mecánica;
- si una abstracción deja de tener responsabilidad propia, eliminarla;
- actualizar consumidores y tests al contrato único;
- cada fase debe quedar completa dentro de su scope, sin adapters temporales.

Dado este criterio, la siguiente versión objetivo debe tratarse como una evolución breaking respecto a `0.4.0`; semánticamente encaja mejor como `0.5.0` que como patch `0.4.1`. La metadata final se cambiará sólo al cierre.

## Estado actual

- Fase 1 — superficie pública + package gate: CERRADA Y VALIDADA.
- Fase 2A — fundamentos unificados: IMPLEMENTADA, pendiente únicamente del `pnpm validate` canónico del usuario.
- Fase 2B — Navigation Destinations: no iniciada.
- Fase 2C — ownership de Scaffold: no iniciada.
- Fase 3 — Navigation Presenter/política responsive: no iniciada.

## Fase 1 validada

El usuario ejecutó `pnpm validate` con PASS integral:

- 79 archivos Vitest;
- 579 tests;
- 65 Chromium;
- typechecks;
- build;
- pack;
- consumers React 18 y 19;
- ESM/CJS/CSS smoke;
- whitespace.

## Fase 2A implementada

### Safe-area

Owner único:

```text
src/helpers/safeArea.ts
```

Eliminados:

- `SafeEdges`;
- `ScreenContentSafeAreaEdges`;
- resolvers locales duplicados;
- cálculos directos `env(safe-area-inset-*)` del código productivo TS/TSX.

Consumidores migrados al owner:

- SafeArea;
- Screen;
- ScreenContent;
- TopAppBar;
- FloatingActionButton;
- BottomNavigation;
- NavigationRail;
- Dialog;
- Drawer;
- BottomSheet;
- ToastProvider.

`Screen` suma ahora inset + safe-area.

### CSS sizing

Owner único:

```text
src/helpers/css.ts#cssSize
```

Eliminados:

- `px`;
- `toCssSize`;
- `adaptiveScaffold.utils#cssSize`;
- aliases internos de `cssSize` en navegación.

### Scroll

`PageScroll` eliminado completamente, incluido export público.

No se conservó alias.

`ScrollArea` queda como motor de scroll. El ownership entre Scaffold/ScreenContent se resolverá en Fase 2C.

### Responsive

Owner único de resolución responsive de componentes:

```text
src/core/viewport/useAdaptiveViewport.ts
```

Consumido por:

- AdaptiveScaffold;
- useDataTableShell.

Eliminados:

- `useDataTableResponsiveMode`;
- `resolveAdaptiveScaffoldMode`.

Nuevo normalizador único:

```text
resolveUIViewportBreakpoints
```

consumido por `UIViewportProvider` y `useAdaptiveViewport`.

## Regresiones añadidas

- `foundation-ownership-phase-2a.test.ts`;
- `foundation-safe-area-phase-2a.test.tsx`;
- `foundation-responsive-phase-2a.test.tsx`.

Ajustados:

- `public-surface-types.test.ts`;
- `state-phase-d1-data-table-shell-ownership.test.ts`;
- `scripts/verify-package.mjs`.

## Validado en el runtime actual

- parse TypeScript/TSX: 446 archivos, 0 errores sintácticos;
- imports relativos productivos rotos: 0;
- `scripts/verify-package.mjs`: sintaxis Node PASS;
- `cssSize`: una sola implementación;
- `resolveSafeAreaEdges`: una sola implementación;
- `PageScroll`: eliminado;
- `useDataTableResponsiveMode`: eliminado;
- `resolveAdaptiveScaffoldMode`: eliminado;
- `env(safe-area-inset-*)` en TS/TSX productivo: 0.

## No validado

- `pnpm validate` de Fase 2A aún debe ejecutarse en el entorno del usuario con dependencias instaladas.
- No se ha iniciado Fase 2B.
- No se han resuelto todavía las decisiones de ownership de scroll de Fase 2C.
- No se ha modificado todavía la política de navegación jerárquica de Fase 3.

## Siguiente paso

Ejecutar:

```bash
pnpm validate
```

sobre el checkpoint de Fase 2A.

Si pasa, cerrar Fase 2A y comenzar Fase 2B:

1. consolidar contexts de BottomNavigation/NavigationRail;
2. consolidar resolución de props de destination item;
3. consolidar recipe/helpers compartidos;
4. eliminar implementaciones duplicadas;
5. mantener APIs públicas distintas únicamente por sus diferencias reales de orientación/layout.
