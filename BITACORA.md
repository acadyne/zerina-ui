# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C: **CERRADA**.
- Fase D: **CERRADA**.
- Fase activa: **E — semántica de slots, layout y tipos**.
- E1 Slot precedence: **CERRADA**.
- E2 Layout prop matrix: **CERRADA**.
- E3 Recipe convergence: **CERRADA**.
- E4 Tipos estructuralmente equivalentes: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- No se asignó todavía una versión siguiente.

## Validación que cerró E3

```text
tests dirigidos E3       41/41 PASS
Vitest completo         534/534 PASS
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

Pipeline semántico:

```text
public/child → local slot → inherited slot → internal
```

## E2 — resultado vigente

Dos familias de layout deliberadas:

```text
Full layout frame
→ Flex / Grid / Stack
→ SizeProps + SpaceProps + SurfaceProps

Flow layout frame
→ Inline / Wrap
→ SpaceProps + w + minH
```

Inline/Wrap soportan `mx/my`.

No se añadieron surface props ni todo SizeProps a flow primitives.

## E3 — resultado vigente

Owner interno:

`src/components/display/status-label-recipe.ts`

Comparte Badge / Tag:

```text
solid / subtle / outline
primary / secondary / success / warning / danger / neutral
tokens cromáticos
root inline frame
content truncation
```

Permanece local:

```text
Badge density
Tag density
Tag icons
Tag remove/usePress
```

No se fusionaron los componentes.

## E4 — criterio de centralización

La igualdad estructural no es suficiente.

Se centraliza sólo cuando dos o más tipos expresan el mismo concepto y ya participan del mismo runtime/familia semántica.

Los nombres públicos existentes se conservan mediante aliases o interfaces que extienden el owner interno.

## E4 — forms

Nuevo owner interno:

`src/primitives/forms/shared-control-types.ts`

Posee:

```text
ControlSize
→ sm | md | lg

ControlColorScheme
→ primary | secondary | danger
```

Aliases:

```text
ActionControlSize → ControlSize
ChoiceControlSize → ControlSize
TextControlSize   → ControlSize

ActionControlColorScheme → ControlColorScheme
ChoiceControlColorScheme → ControlColorScheme
```

No se centralizan los tamaños `sm/md/lg` de CommandPalette, TopAppBar, FloatingActionButton o Progress: comparten literales pero no el mismo contrato de control.

## E4 — navigation destination family

Nuevo owner interno:

`src/primitives/navigation/shared/navigation-shared.types.ts`

Posee:

```text
NavigationSurfacePosition
NavigationSurfaceVariant
NavigationDestinationLabelBehavior
NavigationDestinationIndicator
NavigationDestinationDensity
NavigationDestinationBadgeAnchor
NavigationDestinationBadgePlacement
NavigationDestinationItemShape
NavigationDestinationBadgeOffset
```

BottomNavigation y NavigationRail mantienen sus nombres públicos como aliases.

La selección usa el owner ya existente:

`src/primitives/navigation/shared/navigationSelection.ts`

```text
BottomNavigationSelectionReason
NavigationRailSelectionReason
→ NavigationSelectionReason

BottomNavigationSelectionContext
NavigationRailSelectionContext
→ NavigationSelectionContext
```

`NavigationDestinationItem` consume los mismos types compartidos y deja de declarar sus propias copies.

## E4 — aliases semánticos entre subsistemas

```text
PopoverPlacement
→ FloatingPlacement

DrawerPlacement
→ UIOverlayPlacement

NavigationStackTransitionDirection
→ UIMotionTransitionDirection

ListDensity
→ UIDensity

AlertVariant / ToastVariant
→ FeedbackVariant

BadgeSlot
→ StatusLabelRecipeSlot
```

Nuevo owner de feedback:

`src/components/feedback/feedback.types.ts`

```text
FeedbackVariant
→ info | success | warning | danger | neutral
```

Todos los nombres públicos actuales permanecen intactos.

## E4 — coincidencias deliberadamente NO centralizadas

Quedan separadas aunque hoy sean estructuralmente iguales:

```text
CommandTriggerSize / TopAppBarSize / FloatingActionButtonSize / ProgressSize
→ no son el mismo contrato de control

ActionSheetTone / ProgressVariant
→ tone de acción vs estado visual de progreso

AdaptiveScaffoldSideNavigationPlacement /
ChoiceControlLabelPlacement /
InputAdornmentPosition
→ distintos dominios de start/end

single-slot "root" types
→ namespace de slots por componente, no un concepto compartido

PressableElement / SupportedTriggerHost
→ contratos de host distintos y frontera core/primitives

NavigationRailPlacement / UIOverlayPlacement
→ side de layout vs edge de overlay
```

E4 no crea aliases genéricos sólo para reducir conteo de unions.

## E4 — verificación estática

```text
broken relative imports                         0
remaining duplicate simple-union groups         6
all 6 remaining groups explicitly intentional
new internal owners root-public                 0
```

## E4 — tests

Nuevos:

- `semantics-phase-e4-type-equivalence-ownership.test.ts`;
- `semantics-phase-e4-type-equivalence.test.ts`.

Cubren:

- ownership de control sizes/schemes;
- ownership de navigation destination types;
- aliases públicos BottomNavigation / NavigationRail;
- shared selection reason/context;
- Popover/Floating placement;
- Drawer/overlay placement;
- navigation/motion direction;
- List/viewport density;
- Alert/Toast feedback variant;
- Badge/status-label slots;
- owners internos fuera de barrels públicos;
- no-merges deliberados.

## Criterio de cierre E4 / Fase E

Debe pasar:

```text
internal-test typecheck
tests E4 dirigidos
public surface
forms public/source regression
navigation family regression
E3 recipe regression
overlay floating regression
pnpm validate
```

Si queda verde:

1. E4 se marca **CERRADA**;
2. Fase E completa se marca **CERRADA**;
3. se abre Fase F — clasificación de source tests + residuos/reachability.

## Corrección del candidato E4

La primera validación dirigida de E4 pasó `62/62`, pero `pnpm validate` detectó un contrato fuente histórico de Block 7 desactualizado:

```text
forms-block7-source.test.ts
→ exigía ActionControlSize como union inline
→ exigía ActionControlColorScheme como union inline
```

Eso contradice la centralización deliberada de E4:

```text
ActionControlSize → ControlSize
ActionControlColorScheme → ControlColorScheme
```

Corrección:

- Block 7 ahora verifica los aliases nominales en `action-control-types.ts`;
- y verifica que `shared-control-types.ts` conserve exactamente los literales públicos anteriores.

No cambió código de producto ni superficie pública.
