# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase activa: **C — triggers y overlays**.
- C1 trigger runtime único: **CERRADA**.
- C2 floating overlays: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- C3 Dialog → modal runtime: pendiente.
- No se asignó todavía una versión siguiente.

## Validación que cerró C1

```text
tests dirigidos C1       11/11 PASS
Vitest completo         454/454 PASS
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

La revalidación fue limpia: no reapareció el warning de `onPress` sobre hosts DOM.

## C2 — decisión final

La inspección concreta mostró que el owner común correcto es estructural.

Nuevo:

`src/core/overlay/FloatingOverlayRuntime.tsx`

Posee:

```text
present
→ MotionPresenceGroup
→ optional Portal
→ FloatingLayer
→ floating ref/style/placement plumbing
```

Consumidores:

- PopoverContent;
- MenuContent;
- NavigationMenuPanel;
- TooltipContent.

## C2 — responsabilidades centralizadas

- anchor ref;
- open/present plumbing;
- placement;
- offset;
- flip;
- shift;
- viewport padding;
- z-index;
- matchAnchorWidth;
- resize/scroll updates;
- floating element ref;
- MotionPresenceGroup;
- portal/container.

Resultado estático:

```text
direct <FloatingLayer> en los 4 consumidores        0
direct <MotionPresenceGroup> en los 4 consumidores  0
direct <Portal> en los 4 consumidores                0
FloatingOverlayRuntime consumers                     4
```

## C2 — diferencias preservadas

### Popover

Mantiene local:

- recipe;
- DismissableLayer;
- FocusScope;
- trapFocus;
- autoFocus;
- restoreFocus;
- role/ARIA.

### Menu

Mantiene local:

- layered dismissable slot;
- DismissableLayer;
- roving/menu keyboard;
- restore-focus policy;
- menu role/ARIA.

### NavigationMenuPanel

Mantiene local:

- DismissableLayer;
- Escape/outside callbacks específicos;
- depth/layer;
- navigation semantics.

### Tooltip

Mantiene local:

- hover/focus/touch lifecycle;
- custom outside-pointer detection;
- role tooltip;
- recipe.

Tooltip NO se migra a DismissableLayer en C2 porque eso introduciría dependencia de OverlayProvider y cambiaría su estructura/semántica no-portalled.

## Invariante `portalled={false}`

`FloatingOverlayRuntime` no usa `<Portal disabled>`.

Hace branch explícito:

```text
portalled
→ Portal
else
→ animated directamente
```

Motivo: `Portal` consulta OverlayProvider antes de procesar `disabled`.

## Tests C2

Nuevos:

- `overlay-phase-c2-floating-runtime-ownership.test.ts`;
- `overlay-phase-c2-floating-runtime-behavior.test.tsx`.

Protegen:

- owner estructural único;
- ausencia de dismiss/focus en el runtime;
- diferencias locales deliberadas;
- no ejecutar floating render cuando `present=false`;
- `portalled=false` sin OverlayProvider;
- Tooltip no-portalled sin OverlayProvider.

## Verificación disponible en snapshot

- TypeScript syntax parse de archivos modificados: PASS.
- No quedan usos JSX directos de FloatingLayer/MotionPresenceGroup/Portal en los cuatro consumidores.

## Criterio de cierre C2

Debe pasar:

```text
internal-test typecheck
tests C2 dirigidos
regresión C1/overlay/modal
pnpm validate
```

Si queda verde:

1. C2 se marca CERRADA;
2. se abre C3;
3. C3 generaliza ModalOverlayRuntime sólo donde pueda expresar Dialog modal/non-modal sin borrar diferencias.
