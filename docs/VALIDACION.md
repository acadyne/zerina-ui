# Validación

## Puerta canónica

```bash
pnpm validate
```

## Estado de `0.3.0`

Última ejecución reportada:

```text
Vitest                393/393 PASS
Chromium               65/65 PASS
Package typecheck           PASS
Build ESM/CJS/DTS           PASS
React 18 consumer           PASS
React 19 consumer           PASS
ESM/CJS/CSS                 PASS
Git whitespace              PASS
Validation complete.
```

## Regla

El nuevo ciclo de arquitectura no debe reducir esta puerta.

Toda mejora futura deberá conservar:

- comportamiento;
- tipos;
- browser;
- distribución;
- compatibilidad React 18/19.

## Candidato Fase A

Verificación estática realizada en el snapshot:

- parse TypeScript de archivos modificados: PASS;
- imports relativos de `src`: 0 rotos.

Validación local requerida:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/dialog-contracts-phase-a.test.tsx \
  tests/event-layer-cancellation.test.ts \
  tests/trigger-runtime-cancellation.test.ts \
  tests/family-deduplication-contracts.test.tsx

pnpm validate
```

La fase no se considera cerrada hasta que `pnpm validate` termine en `Validation complete.`.

## Fase A cerrada

Resultado final:

```text
tests dirigidos      23/23 PASS
Vitest              405/405 PASS
Chromium              65/65 PASS
typechecks/build          PASS
React 18 consumer         PASS
React 19 consumer         PASS
Validation complete.
```

Fase B se abre desde este baseline.

## Candidato Fase B1

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/forms-phase-b1-ownership.test.ts \
  tests/forms-phase-b1-behavior.test.tsx \
  tests/forms-native-controls.test.tsx \
  tests/forms-field-semantics.test.tsx \
  tests/forms-block5-behavior.test.tsx \
  tests/forms-public-api-and-source.test.ts

pnpm validate
```

B1 sólo se cierra con `Validation complete.`.

## Fase B1 cerrada

Resultado reportado:

```text
tests dirigidos B1       78/78 PASS
Vitest completo         413/413 PASS
Chromium                  65/65 PASS
typechecks/build              PASS
React 18 consumer             PASS
React 19 consumer             PASS
Validation complete.
```

## Candidato Fase B2

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/forms-phase-b2-ownership.test.ts \
  tests/forms-phase-b2-behavior.test.tsx \
  tests/forms-block6-behavior.test.tsx \
  tests/forms-block6-source.test.ts \
  tests/forms-radio.test.tsx \
  tests/settings-list-current-contract.test.tsx

pnpm validate
```

B2 sólo se cierra con `Validation complete.`.

## Fase B2 cerrada

Resultado reportado:

```text
tests dirigidos B2       55/55 PASS
Vitest completo         421/421 PASS
Chromium                  65/65 PASS
typechecks/build              PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
Validation complete.
```

## Candidato Fase B3

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/forms-phase-b3-ownership.test.ts \
  tests/forms-phase-b3-behavior.test.tsx \
  tests/forms-block7-behavior.test.tsx \
  tests/forms-block7-source.test.ts \
  tests/interaction-use-press-consumers.test.ts

pnpm validate
```

B3 sólo se cierra con `Validation complete.`.

## Fase B3 cerrada

Resultado reportado:

```text
tests dirigidos B3       44/44 PASS
Vitest completo         431/431 PASS
Chromium                  65/65 PASS
typechecks/build              PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
Validation complete.
```

## Candidato Fase B4

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/forms-phase-b4-ownership.test.ts \
  tests/forms-phase-b4-behavior.test.tsx \
  tests/forms-block5-behavior.test.tsx \
  tests/forms-block6-behavior.test.tsx \
  tests/forms-radio.test.tsx \
  tests/settings-list-current-contract.test.tsx \
  tests/family-deduplication-contracts.test.tsx

pnpm validate
```

B4 sólo se cierra con `Validation complete.`.

### Corrección del primer candidato B4

El primer intento falló antes de la puerta integral porque `SearchInput` conservaba una rama JSX obsoleta con `isControlled/internalValue`.

El candidato corregido usa `currentValue` como única fuente renderizada y el source contract impide reintroducir esos símbolos locales.

## Fase B4 / Fase B cerradas

Resultado reportado:

```text
tests dirigidos B4       73/73 PASS
Vitest completo         447/447 PASS
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

## Candidato Fase C1

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/overlay-phase-c1-trigger-ownership.test.ts \
  tests/overlay-phase-c1-trigger-behavior.test.tsx \
  tests/trigger-runtime-cancellation.test.ts \
  tests/event-layer-cancellation.test.ts \
  tests/interaction-overlay-source.test.ts

pnpm validate
```

C1 sólo se cierra con `Validation complete.`.

### C1 — revalidación por warning React

La primera puerta C1 terminó en `Validation complete.`, pero emitió un warning de React porque `onPress: undefined` seguía materializado como key DOM en un trigger pasivo.

El candidato corregido elimina la key para hosts DOM y añade una aserción explícita de ausencia del warning.

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/overlay-phase-c1-trigger-behavior.test.tsx \
  tests/overlay-phase-c1-trigger-ownership.test.ts \
  tests/trigger-runtime-cancellation.test.ts

pnpm validate
```

## Fase C1 cerrada

Revalidación limpia reportada:

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

No reapareció el warning React de `onPress` sobre hosts DOM.

## Candidato Fase C2

Verificación estática del snapshot:

```text
TypeScript syntax parse                         PASS
direct FloatingLayer consumers (target family) 0
direct MotionPresenceGroup consumers            0
direct Portal consumers                         0
FloatingOverlayRuntime consumers                4
```

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/overlay-phase-c2-floating-runtime-ownership.test.ts \
  tests/overlay-phase-c2-floating-runtime-behavior.test.tsx \
  tests/overlay-phase-c1-trigger-behavior.test.tsx \
  tests/interaction-overlay-source.test.ts \
  tests/modal-overlay-runtime.test.tsx

pnpm validate
```

C2 sólo se cierra con `Validation complete.`.

## Fase C2 cerrada

Resultado reportado:

```text
tests dirigidos C2       14/14 PASS
Vitest completo         460/460 PASS
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

## Candidato Fase C3

Verificación estática del snapshot:

```text
Dialog direct modal-runtime internals      0
Drawer direct modal-runtime internals      0
BottomSheet direct modal-runtime internals 0
ModalOverlayRuntime consumers              3
relative imports broken                    0
```

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/overlay-phase-c3-modal-runtime-ownership.test.ts \
  tests/overlay-phase-c3-modal-runtime-behavior.test.tsx \
  tests/modal-overlay-runtime.test.tsx \
  tests/interaction-overlay-source.test.ts \
  tests/dialog-contracts-phase-a.test.tsx

pnpm validate
```

C3 y Fase C sólo se cierran con `Validation complete.`.

## Fase C3 / Fase C cerradas

Resultado reportado:

```text
tests dirigidos C3       18/18 PASS
Vitest completo         467/467 PASS
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

## Candidato Fase D1

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/state-phase-d1-data-table-shell-ownership.test.ts \
  tests/state-phase-d1-data-table-shell-behavior.test.tsx \
  tests/family-deduplication-contracts.test.tsx \
  tests/family-deduplication-source.test.ts \
  tests/forms-block6-behavior.test.tsx

pnpm validate
```

D1 sólo se cierra con `Validation complete.`.

## Fase D1 cerrada

Resultado reportado:

```text
tests dirigidos D1       35/35 PASS
Vitest completo         474/474 PASS
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

## Candidato Fase D2

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/state-phase-d2-navigation-entries-ownership.test.ts \
  tests/state-phase-d2-navigation-entries-behavior.test.tsx \
  tests/forms-phase-b4-ownership.test.ts \
  tests/family-deduplication-contracts.test.tsx

pnpm validate
```

D2 sólo se cierra con `Validation complete.`.

### Corrección del primer candidato D2

El primer intento falló por dos defectos del test nuevo:

- import React sin uso;
- expectativa síncrona sobre un swap gestionado por AnimatePresence.

El candidato corregido prueba contratos síncronos observables del state engine y usa TabScaffold controlled para evitar que la prueba dependa del lifecycle motion.

Revalidar con el mismo bloque D2.

### Segunda corrección del candidato D2

La segunda corrida pasó completa pero conservó un warning `act(...)` de AnimatePresence porque el test de NavigationStack seguía cambiando realmente el motion key.

El test ahora usa NavigationStack controlled/rejected y verifica `onEntriesChange` sin disparar una transición MotionSwitch.

Revalidar D2 con el mismo bloque.

## Fase D2 cerrada

Resultado limpio reportado:

```text
tests dirigidos D2       33/33 PASS
Vitest completo         487/487 PASS
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

Sin warning `act(...)` en la corrida final.

## Candidato Fase D3

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/state-phase-d3-motion-frame-ownership.test.ts \
  tests/state-phase-d3-motion-frame-behavior.test.tsx \
  tests/state-phase-d2-navigation-entries-behavior.test.tsx \
  tests/public-surface-contract.test.ts

pnpm validate
```

D3 y Fase D sólo se cierran con `Validation complete.`.

### Corrección del primer candidato D3

El primer intento falló sólo en dos assertions de ownership: el test prohibía la cadena `AnimatePresence`, pero los wrappers conservan legítimamente `AnimatePresenceProps["mode"]` como tipo público.

El contrato corregido prohíbe:

```text
<AnimatePresence
runtime import de AnimatePresence
```

y permite `AnimatePresenceProps` como import type.

No hubo cambios de producto.

Revalidar D3 con el mismo bloque.

## Fase D3 / Fase D cerradas

Resultado reportado:

```text
tests dirigidos D3       30/30 PASS
Vitest completo         495/495 PASS
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

## Candidato Fase E1

Verificación estática del snapshot:

```text
whole-map styles fallback      0
whole-map slotProps fallback   0
resolveSlot/context mismatch   0
broken relative imports        0
```

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/semantics-phase-e1-slot-precedence-ownership.test.ts \
  tests/semantics-phase-e1-slot-precedence-behavior.test.tsx \
  tests/slot-resolution.test.ts \
  tests/forms-phase-b1-behavior.test.tsx \
  tests/forms-phase-b2-behavior.test.tsx \
  tests/forms-phase-b3-behavior.test.tsx \
  tests/overlay-phase-c1-trigger-behavior.test.tsx

pnpm validate
```

E1 sólo se cierra con `Validation complete.`.

## Candidato Fase E1 fix1

La primera corrida detectó:

```text
Dialog resolveSlot import      FAIL
ownership E1 false positive    FAIL
```

Fix1:

- restaura el import legítimo de `resolveSlot` en Dialog;
- corrige el ownership test para aceptar el owner N-layer de Accordion sin diluir el contrato.

Revalidar desde cero con el mismo bloque E1 completo.

## Fase E1 cerrada

Resultado reportado sobre fix1:

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

## Candidato Fase E2

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/semantics-phase-e2-layout-matrix-ownership.test.ts \
  tests/semantics-phase-e2-layout-matrix-behavior.test.tsx \
  tests/semantics-phase-e1-slot-precedence-behavior.test.tsx \
  tests/public-surface-contract.test.ts

pnpm validate
```

E2 sólo se cierra con `Validation complete.`.

## Fase E2 cerrada

Resultado reportado:

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

## Candidato Fase E3

Verificación estática del snapshot:

```text
schemeMap copies in Badge/Tag          0
solidBg owners                         1
subtleBg owners                        1
outlineBorder owners                   1
status-label recipe public exposure    0
broken relative imports                0
```

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/semantics-phase-e3-status-label-recipe-ownership.test.ts \
  tests/semantics-phase-e3-status-label-recipe-behavior.test.tsx \
  tests/semantics-phase-e2-layout-matrix-behavior.test.tsx \
  tests/interaction-use-press-consumers.test.ts \
  tests/public-surface-contract.test.ts

pnpm validate
```

E3 sólo se cierra con `Validation complete.`.

## Fase E3 cerrada

Resultado reportado:

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

## Candidato Fase E4

Verificación estática:

```text
broken relative imports                     0
remaining duplicate simple-union groups     6
remaining groups intentional                6/6
new internal owners root-public             0
```

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/semantics-phase-e4-type-equivalence-ownership.test.ts \
  tests/semantics-phase-e4-type-equivalence.test.ts \
  tests/public-surface-contract.test.ts \
  tests/forms-public-api-and-source.test.ts \
  tests/family-deduplication-contracts.test.tsx \
  tests/semantics-phase-e3-status-label-recipe-behavior.test.tsx \
  tests/overlay-phase-c2-floating-runtime-behavior.test.tsx

pnpm validate
```

E4 y Fase E sólo se cierran con `Validation complete.`.

### Corrección del candidato E4

La primera corrida dirigida de E4 pasó 62/62, pero el full suite detectó un source-contract histórico de Block 7 que todavía exigía las unions inline de `ActionControlSize` y `ActionControlColorScheme`.

El test se actualizó para verificar:

```text
ActionControlSize → ControlSize
ControlSize → sm | md | lg

ActionControlColorScheme → ControlColorScheme
ControlColorScheme → primary | secondary | danger
```

No hubo cambios de producto.
