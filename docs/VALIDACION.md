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
