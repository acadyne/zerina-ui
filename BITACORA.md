# BITACORA

## Estado actual

- Versión estable de trabajo: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C: **CERRADA**.
- Fase D: **CERRADA**.
- Fase E: **CERRADA**.
- Fase F — test architecture y sweep final: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- Hito G — validación integrada del ciclo: pendiente.
- No se asigna una versión siguiente hasta cerrar G.

## Última puerta verde

La validación que cerró E4 y Fase E terminó con:

```text
Vitest                   543/543 PASS
Chromium                   65/65 PASS
internal-test typecheck        PASS
package typecheck              PASS
build ESM/CJS/DTS              PASS
React 18 consumer              PASS
React 19 consumer              PASS
ESM/CJS/CSS                    PASS
git whitespace                 PASS
Validation complete.
```

## Fase F — scope

Objetivo:

```text
clasificar tests de source
→ repetir análisis estructural
→ revisar wrappers/residuos
→ consolidar docs
```

Fuera de scope:

- nuevos cambios de comportamiento público;
- compatibilidad legacy sin consumidor;
- nuevos refactors de producto que no sean residuos inequívocos.

## F1 — arquitectura de tests

Clasificación vigente:

```text
A — ownership boundary
B — public/API contract
C — implementation snapshot
```

Los seis archivos antes ambiguamente llamados `*source.test*` quedaron renombrados:

```text
family-deduplication-ownership.test.ts          A
interaction-overlay-ownership.test.ts           A
forms-block5-architecture-contract.test.ts      A/B
forms-block6-architecture-contract.test.ts      A/B
forms-block7-architecture-contract.test.ts      A/B
forms-api-and-architecture-contract.test.ts     A/B
```

Clase C residual en esos archivos:

```text
0
```

Se retiraron de Block 7 snapshots redundantes de forma sintáctica ya cubiertos por behavior tests:

- formato literal de `data-ui`;
- posición textual de `boxShadow` respecto de `rootSlot`;
- presencia textual de `scale` / `translate`.

Se mantienen source/architecture assertions sólo cuando protegen:

- ownership;
- ausencia de residuos;
- CSS/token ownership;
- API pública;
- fronteras internas.

## F2 — segundo corte estructural

Baseline: `zerina-ui-0.3.0-final`.

```text
métrica                         0.3.0    actual
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

Los tres owners actuales de `isControlled` son deliberados:

```text
useControllableValue
useNavigationEntries
AdaptiveScaffold
```

`FloatingLayer` tiene un único consumidor JSX:

```text
FloatingOverlayRuntime
```

## F3 — wrappers y residuos

Residuo eliminado:

```text
navigationStack.motion.ts
→ getNavigationStackMotionPreset(animation)
→ función identidad sin política
```

`NavigationStack` pasa `animation` directamente a `MotionSwitch.preset`.

Wrappers revisados y mantenidos porque conservan contrato propio:

- HelpText / FormErrorMessage;
- MotionPresence / MotionSwitch;
- BottomNavigation / NavigationRail;
- ActionDialog / ConfirmDialog;
- DataTableSkeleton / SkeletonTable.

No quedan:

```text
phase markers Pn.n en src
*source.test* ambiguos
test/spec files dentro de src
backup/generated residue dentro de src
```

## F4 — documentación

Documentos consolidados para estado vigente:

- `BITACORA.md`;
- `docs/MAPEO_ARQUITECTURA.md`;
- `docs/CONTRATOS.md`;
- `docs/ARQUITECTURA.md`;
- `docs/VALIDACION.md`;
- `docs/SUPERFICIE_PUBLICA.md`;
- `docs/DISTRIBUCION.md`;
- `docs/ROADMAP_POST_0_3.md`.

## Tests nuevos de F

`architecture-phase-f-sweep.test.ts` protege:

- reachability total;
- imports relativos TS;
- owners deliberados de controlled state;
- único consumer directo de FloatingLayer;
- ausencia de phase markers;
- ausencia de generated/test residue;
- ausencia de filenames `*source.test*`;
- eliminación del identity adapter de NavigationStack.

## Criterio de cierre F

Debe pasar:

```text
internal-test typecheck
architecture-phase-f-sweep
contratos A/B reclasificados
public surface
E4 type-equivalence regression
pnpm validate
```

Si queda verde:

1. F se marca **CERRADA**;
2. se abre G;
3. G no introduce refactors: sólo cierre integrado y decisión de versión.

## Corrección del candidato F

La primera validación integral de F detectó un contrato histórico de D2 que todavía exigía `getNavigationStackMotionPreset`, aunque F eliminó ese adapter identidad.

La corrección vigente mantiene el contrato semántico:

```text
NavigationStack conserva MotionSwitch
animation se pasa directamente como preset
getNavigationStackMotionPreset no reaparece
```

El primer intento de corregir este test generó accidentalmente saltos `\n` literales en tres archivos de texto. Este candidato restaura desde el snapshot F anterior y reaplica la corrección con saltos reales.

Archivos afectados por esa reparación:

- `state-phase-d2-navigation-entries-ownership.test.ts`;
- `BITACORA.md`;
- `docs/VALIDACION.md`.

No cambió código de producto.
