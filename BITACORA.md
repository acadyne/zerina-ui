# BITACORA

## Estado actual

- Versión estable candidata: `0.4.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C: **CERRADA**.
- Fase D: **CERRADA**.
- Fase E: **CERRADA**.
- Fase F: **CERRADA**.
- Hito G: **CERRADO**.
- Ciclo A–G: **CERRADO**.
- `0.3.0` permanece como baseline del ciclo.
- `0.4.0` es la versión elegida para publicar este conjunto coherente de cambios.

## Validación que cerró G

```text
Vitest completo           548/548 PASS
Chromium                    65/65 PASS
internal-test typecheck         PASS
internal-test build             PASS
package typecheck               PASS
build ESM/CJS/DTS               PASS
React 18 consumer               PASS
React 19 consumer               PASS
ESM/CJS/CSS                     PASS
pack content                    PASS
git whitespace                  PASS
Validation complete.
```

## Decisión de versión

Se elige:

```text
0.4.0
```

Razón:

- el ciclo contiene correcciones y convergencia interna compatibles;
- la topología pública de entry points no cambia;
- `src/index.ts` permanece estable respecto a `0.3.0`;
- existe una ampliación pública compatible: `mx/my` en `Inline` y `Wrap`;
- por tanto el conjunto es mayor que un patch, sin evidencia de breaking change que justifique otro tipo de corte.

## Estado estructural final

Baseline: `zerina-ui-0.3.0-final`.

```text
métrica                         0.3.0    0.4.0
TS/TSX productivos                291       305
alcanzables desde src/index.ts    291       305
huérfanos                           0         0
imports relativos TS rotos          0         0

resolveSlot files                  68        65
resolveLayeredSlot files            8         7
resolveContextualSlot files         0         7
resolveSlotLayers files             0         2

composeEventHandlers files         21        12
composeEventHandlerChain files      0         4

direct usePress calls              11         8
manual isControlled                 9         3
FloatingLayer JSX consumers         4         1
DismissableLayer JSX files          6         5
FocusScope JSX files                3         2
```

Los módulos adicionales corresponden a owners explícitos; reachability permanece completa.

## Owners transversales vigentes

```text
events
→ composeEventHandlerChain / composeEventHandlers

press
→ usePress / usePressSlotBridge

controlled simple state
→ useControllableValue

triggers
→ TriggerRuntime

floating overlays
→ FloatingOverlayRuntime

modal overlays
→ ModalOverlayRuntime

target dialogs
→ TargetDialogFrame

text controls
→ useTextControlRuntime

choice controls
→ useChoiceControlRuntime

data-table shell
→ useDataTableShell / DataTableShellFrame

navigation history
→ useNavigationEntries

app motion
→ MotionAppFrame

slot precedence
→ resolveSlotLayers / resolveContextualSlot

status labels
→ statusLabelRecipe
```

## API y distribución

Respecto a `0.3.0`:

```text
src/index.ts                     sin cambios
package.json#exports             sin cambios
package.json#files               sin cambios
react peer range                 >=18 <20
react-dom peer range             >=18 <20
framer-motion                    ^12.38.0
lucide-react                     ^0.507.0
packageManager                   pnpm@10.34.5
```

Entry points:

```text
zerina-ui
zerina-ui/styles.css
zerina-ui/reset.css
```

Cambio público compatible:

```text
Inline / Wrap
→ añaden mx / my
```

## Diferencias mantenidas deliberadamente

No son duplicación pendiente:

- BottomNavigation / NavigationRail;
- DataTableSkeleton / SkeletonTable;
- ActionDialog / ConfirmDialog;
- NavigationMenu / Tree;
- HelpText / FormErrorMessage;
- MotionPresence / MotionSwitch;
- AdaptiveScaffold controlled state;
- NavigationStack history state;
- unions iguales estructuralmente pero distintas semánticamente documentadas en `CONTRATOS.md`.

## Arquitectura de tests

```text
A — ownership boundary
B — public/API contract
C — implementation snapshot
```

Estado final:

```text
ambiguous *source.test* files    0
class C residual                 0
```

## Puerta del candidato 0.4.0

El cambio de versión modifica metadata publicable. Antes de publicar `0.4.0` debe ejecutarse una última vez:

```bash
pnpm validate
```

No se abre una nueva fase; esta corrida valida exclusivamente el candidato de release con `package.json#version = 0.4.0`.
