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
