# Validación

## Regla obligatoria

Todo bloque de validación local comienza con:

```bash
pnpm install --frozen-lockfile
```

Los snapshots no incluyen `node_modules`.

## Estado cerrado

`0.2.1`–`0.2.6` están validados para sus scopes.

`0.2.6` cerró con:

- harness typecheck PASS;
- unit/DOM PASS;
- Chromium 3/3 PASS;
- root typecheck PASS;
- build + DTS PASS.

## Validación de `0.2.7`

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run \
  tests/public-surface-contract.test.ts \
  tests/forms-public-api-and-source.test.ts \
  tests/family-deduplication-source.test.ts \
  tests/interaction-overlay-source.test.ts

pnpm typecheck

pnpm build
```

Criterio de cierre:

- imports públicos vigentes siguen resolviendo;
- internals retirados no aparecen desde `zerina-ui`;
- API raíz no vuelve a usar wildcard para motion/viewport;
- contratos source anteriores siguen verdes;
- root typecheck y DTS confirman que los exports explícitos son completos.
