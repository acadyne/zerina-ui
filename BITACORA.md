# BITACORA

## Objetivo actual

Refactorizar `zerina-ui` sin obligaciones de compatibilidad histórica,
eliminando procesos duplicados y dejando un único owner por mecánica
transversal.

La demo permanece como consumidor real para la fase de integración posterior.

## Invariantes vigentes

- no mantener legacy ni aliases deprecated para responsabilidades eliminadas;
- no conservar dos procesos para la misma mecánica;
- actualizar consumidores y pruebas al owner único;
- no ocultar errores mediante casts de conveniencia;
- no dejar implementaciones parciales;
- cada extracción debe tener regresiones;
- la evolución apunta semánticamente a `0.5.0`.

## Estado actual

- Fase 1 — superficie pública + package gate: **CERRADA Y VALIDADA**.
- Fase 2A — fundamentos unificados: **CERRADA Y VALIDADA**.
- Fase 2B — Navigation Destinations: **CERRADA Y VALIDADA**.
- Fase 2C — ownership de Scaffold: **CERRADA Y VALIDADA**.
- Fase 3 — Navigation Presenter / política responsive: **CERRADA Y VALIDADA**.
- Fase 4 — dialog contextual typing: **CERRADA Y VALIDADA**.
- Fase 5 — RoutedAdaptiveScaffold metadata generic: **IMPLEMENTADA, PENDIENTE DE `pnpm validate`**.
- Fase 6 — demo integration: no iniciada.

## Validación canónica de Fase 4

El usuario ejecutó:

```bash
pnpm install
pnpm validate
```

Resultado final: **PASS integral**.

Confirmado:

- internal-test typecheck: PASS;
- Vitest:
  - 93 archivos PASS;
  - 621 tests PASS;
- internal-test build: PASS;
- Chromium:
  - 65 tests PASS;
- package typecheck: PASS;
- package build: PASS;
- package pack: PASS;
- clean consumer React 18: PASS;
- clean consumer React 19: PASS;
- runtime ESM/CJS/CSS smoke: PASS;
- git whitespace check: PASS;
- `Validation complete.`

## Fase 5 — objetivo

Preservar metadata de aplicación desde:

```text
NavigationNode<TMeta>[]
        ↓
AdaptiveScaffold<TMeta>
        ↓
RoutedAdaptiveScaffold<TMeta>
        ↓
onItemChange(item)
navigate(href, item)
```

sin estrecharla a `NavigationLinkMeta`.

## Contrato genérico

```ts
RoutedAdaptiveScaffoldProps<
  TMeta extends NavigationLinkMeta =
    NavigationLinkMeta
>
```

Hereda:

```ts
AdaptiveScaffoldProps<TMeta>
```

y expone:

```ts
items: NavigationNode<TMeta>[]

navigate?: (
  href: string,
  item: NavigationNode<TMeta>
) => void

onItemChange?: (
  item: NavigationNode<TMeta>
) => void
```

## Implementación routed

`RoutedAdaptiveScaffold` mantiene el mismo `TMeta` a través de `forwardRef`.

El componente delega a:

```tsx
<AdaptiveScaffold<TMeta> />
```

y recibe directamente el item ya seleccionado.

Eliminado del routed wrapper:

```text
findNavigationNode
```

No existe una segunda búsqueda por `id`.

La secuencia ahora es:

```text
AdaptiveScaffold selecciona NavigationNode<TMeta>
        ↓
RoutedAdaptiveScaffold recibe exactamente ese objeto
        ↓
onItemChange(item)
        ↓
item.meta?.href
        ↓
navigate(href, item)
```

Si no existe `href`:

- `onItemChange` sí se ejecuta;
- `navigate` no se ejecuta.

## Superficie pública

`RoutedAdaptiveScaffoldProps<TMeta>` ya era un export público por barrel;
ahora preserva el metadata concreto.

La inferencia JSX permite:

```tsx
<RoutedAdaptiveScaffold
  items={items}
  navigate={(href, item) => {
    void item.meta?.analyticsId;
  }}
/>
```

sin anotar manualmente el genérico cuando `items` lo determina.

## Regresiones añadidas

```text
internal-test/tests/routed-adaptive-scaffold-phase-5.test.tsx
internal-test/tests/routed-adaptive-scaffold-public-contract-phase-5.test.tsx
internal-test/tests/routed-adaptive-scaffold-ownership-phase-5.test.ts
```

También actualizado:

```text
internal-test/tests/public-surface-types.test.ts
scripts/verify-package.mjs
```

El clean consumer React 18/19 ahora verifica:

- runtime export de `RoutedAdaptiveScaffold`;
- `RoutedAdaptiveScaffoldProps<ConsumerNavigationMeta>`;
- inferencia de metadata custom en JSX;
- `navigate` tipado con metadata custom;
- `onItemChange` tipado con metadata custom;
- ESM/CJS runtime export.

## Validación disponible en este runtime

Sin dependencias del workspace instaladas, no se sustituye el gate canónico.

Sí se verificó:

- 467 archivos TS/TSX parseados: PASS;
- errores sintácticos: 0;
- imports relativos productivos rotos: 0;
- `node --check scripts/verify-package.mjs`: PASS;
- `findNavigationNode` dentro de RoutedAdaptiveScaffold: 0;
- `NavigationNode<NavigationLinkMeta>` fijo en routed types/component: 0;
- `AdaptiveScaffold<TMeta>` explícito: presente;
- `RoutedAdaptiveScaffoldProps<TMeta>` explícito: presente;
- fixture aislado `strict` con el source real de RoutedAdaptiveScaffold: PASS;
- inferencia JSX de metadata custom en fixture aislado: PASS;
- problemas nuevos de whitespace en archivos modificados: 0.

## Gate pendiente

Ejecutar sobre el proyecto completo de Fase 5:

```bash
pnpm install
pnpm validate
```

Fase 5 sólo se cerrará con:

```text
Validation complete.
```

## Siguiente paso tras el PASS

Fase 6 — integración de la demo real con el contrato consolidado actual.

Regla:

si la demo revela un defecto de la librería, se corrige primero la librería;
no se introduce un workaround silencioso en la demo.
