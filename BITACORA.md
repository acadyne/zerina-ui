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
- E3 Recipe convergence: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- E4 Tipos estructuralmente equivalentes: pendiente.
- No se asignó todavía una versión siguiente.

## Validación que cerró E2

```text
tests dirigidos E2       34/34 PASS
Vitest completo         523/523 PASS
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

## E3 — scope

Candidato principal:

```text
Badge / Tag
```

Ambos duplicaban exactamente:

- variants `solid/subtle/outline`;
- schemes `primary/secondary/success/warning/danger/neutral`;
- tokens por scheme;
- resolución cromática por variant;
- inline root frame común;
- truncado del content.

## E3 — decisión

Nuevo owner interno:

`src/components/display/status-label-recipe.ts`

Posee:

```text
StatusLabelVariant
StatusLabelColorScheme
STATUS_LABEL_SCHEMES
getStatusLabelVariantStyle
statusLabelRecipe
```

La recipe devuelve estilos para:

```text
root
content
```

## E3 — semántica compartida

Root común:

```text
display inline-flex
align-items center
justify-content center
gap 0.35rem
max-width 100%
line-height 1
white-space nowrap
```

Content común:

```text
min-width 0
overflow hidden
text-overflow ellipsis
```

Color/variant común:

```text
solid
subtle
outline
×
primary
secondary
success
warning
danger
neutral
```

Los valores token son exactamente los que Badge y Tag ya usaban.

## E3 — diferencias preservadas

### Badge

Permanece local:

```text
minHeight 22
padding 0.2rem 0.55rem
fontSize 0.75rem
fontWeight 700
letterSpacing 0.02em
```

### Tag

Permanece local:

```text
minHeight 28
padding 0.28rem 0.7rem
fontSize 0.78rem
fontWeight 600
letterSpacing 0.01em
leftIcon
rightIcon
removeButton
usePress
stopPropagation de remove
```

No se fusionaron Badge y Tag.

## E3 — otros candidatos

Se inspeccionaron action-control y choice-control recipes.

Decisión:

**MANTENER SEPARADAS**.

Razón:

- action controls tienen schemes y estados hover/pressed propios;
- choice controls tienen tamaño/labelPlacement/accent state;
- no expresan el mismo concepto que una status label.

## E3 — superficie pública

`statusLabelRecipe`, `StatusLabelVariant` y `StatusLabelColorScheme` permanecen internos.

BadgeProps/TagProps conservan estructuralmente los mismos valores aceptados para `variant` y `colorScheme`.

No se añade entrypoint ni export público.

## E3 — verificación estática

```text
schemeMap copies in Badge/Tag          0
solidBg owners                         1
subtleBg owners                        1
outlineBorder owners                   1
status-label recipe public exposure    0
broken relative imports                0
```

## E3 — tests

Nuevos:

- `semantics-phase-e3-status-label-recipe-ownership.test.ts`;
- `semantics-phase-e3-status-label-recipe-behavior.test.tsx`.

Cubren:

- owner único de schemes/variants;
- Badge/Tag consumen la recipe;
- recipe permanece interna;
- solid/subtle/outline conservan tokens;
- root/content common frame;
- densidades Badge/Tag siguen distintas;
- slot styles siguen por encima de la recipe;
- Tag remove conserva `usePress`/stopPropagation.

## Criterio de cierre E3

Debe pasar:

```text
internal-test typecheck
tests E3 dirigidos
regresión E2
regresión usePress Tag
public surface
pnpm validate
```

Sólo después se abre E4.
