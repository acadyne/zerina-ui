# BITACORA

## Objetivo actual

Refactorizar `zerina-ui` sin obligaciones de compatibilidad histórica,
eliminando procesos duplicados y dejando un único owner por mecánica
transversal.

## Estado actual

- Fase 1 — superficie pública + package gate: **CERRADA Y VALIDADA**.
- Fase 2A — fundamentos unificados: **CERRADA Y VALIDADA**.
- Fase 2B — Navigation Destinations: **CERRADA Y VALIDADA**.
- Fase 2C — ownership de Scaffold: **CERRADA Y VALIDADA**.
- Fase 3 — Navigation Presenter / política responsive: **CERRADA Y VALIDADA**.
- Fase 4 — dialog contextual typing: **IMPLEMENTADA R3, PENDIENTE DE `pnpm validate`**.
- Fase 5 — RoutedAdaptiveScaffold metadata generic: no iniciada.

## Invariantes vigentes

- no legacy ni aliases deprecated;
- un solo owner por mecánica;
- no ocultar errores con casts;
- no dejar implementaciones parciales;
- cada extracción debe tener regresiones;
- evolución semántica hacia `0.5.0`.

## Fase 4 — contrato vigente

Owner:

```text
src/patterns/shared/targetDialogContract.ts
```

Contrato único:

```ts
type TargetDialogRender<TTarget> =
  (target: TTarget) => ReactNode;
```

Regiones target-aware:

```text
renderDescription
renderTargetLabel
renderBody
renderFooter
```

Familias migradas:

```text
ConfirmDialog
ActionDialog
TargetFormDialog
TargetDialogFrame
```

Eliminados sin compatibilidad:

```text
RenderableWithTarget
resolveRenderableWithTarget
description
targetLabel
children
footer
```

de las APIs target-aware.

## Gates de Fase 4

### R1

Falló en `internal-test typecheck` por un `import React` default no usado
dentro del test nuevo.

Corregido en R2 sin tocar código productivo.

### R2

`internal-test typecheck`: PASS.

Vitest avanzó hasta:

```text
1 failed | 92 passed
620 passed | 1 failed
```

Fallo:

```text
tests/dialog-render-props-phase-4.test.tsx
```

La aserción buscaba:

```text
container.querySelector(...)
```

pero `Dialog` usa portal por defecto.

El `container` retornado por `renderDOM` contiene la raíz React original,
mientras que el overlay/dialog se monta en `document`.

Los tests existentes de dialogs ya utilizan:

```text
document.querySelector(...)
```

por esta razón.

## Corrección R3

Se corrigió exclusivamente la regresión de comportamiento:

- `renderWithOverlay` ya no retorna el container como si fuera owner del DOM del dialog;
- las cuatro regiones del dialog se consultan mediante `document.querySelector`;
- no se cambió `ConfirmDialog`;
- no se cambió `ActionDialog`;
- no se cambió `TargetFormDialog`;
- no se cambió `TargetDialogFrame`;
- no se cambió `targetDialogContract`.

No se relajó el test: sigue verificando que las cuatro callbacks producen
exactamente el contenido del target abierto, sólo que ahora observa el DOM
donde el overlay realmente se renderiza.

## Validación disponible después de R3

- 464 archivos TS/TSX parseados: PASS;
- errores sintácticos: 0;
- queries `container.querySelector` en tests Fase 4: 0;
- imports default React no usados en tests Fase 4: 0;
- trailing whitespace en el archivo corregido: 0;
- EOF del archivo corregido: normalizado.

Estas comprobaciones no sustituyen el gate canónico.

## Gate pendiente

Ejecutar sobre el proyecto completo R3:

```bash
pnpm install
pnpm validate
```

Fase 4 sólo se cerrará con:

```text
Validation complete.
```

## Siguiente fase tras el PASS

Fase 5 — `RoutedAdaptiveScaffold` metadata generic.
