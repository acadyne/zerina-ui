# Validación

## Puerta canónica

La única puerta integral es:

```bash
pnpm validate
```

Es autocontenida. Para una validación completa no se requiere ejecutar ningún comando antes.

Comprueba, en orden:

1. versión exacta de pnpm;
2. `pnpm install --frozen-lockfile`;
3. disponibilidad de Playwright Chromium;
4. typecheck de `internal-test`;
5. Vitest completo;
6. build del harness;
7. Playwright Chromium;
8. typecheck del paquete;
9. build/pack y consumidores limpios;
10. React 18;
11. React 19;
12. ESM;
13. CJS;
14. CSS entry points;
15. contenido del tarball;
16. whitespace Git.

Cierre válido:

```text
Validation complete.
```

## Validación parcial

Toda corrida manual o dirigida comienza con:

```bash
pnpm install --frozen-lockfile
```

Una corrida dirigida sirve para localizar fallos, pero no cierra una fase por sí sola.

## Matriz de consumidores

La verificación del tarball usa:

```text
React       18.3.1
React DOM   18.3.1
@types      18.3.x

React       19.0.0
React DOM   19.0.0
@types      19.0.0

TypeScript  5.9.3
```

`skipLibCheck:false` se mantiene en los consumidores temporales.

## Arquitectura de tests

Los tests estructurales se clasifican por el contrato que protegen.

### A — ownership boundary

Permitidos cuando verifican que una decisión tiene un solo owner.

Ejemplos:

- runtime modal;
- floating runtime;
- trigger runtime;
- DataTable shell;
- navigation entries;
- motion frame;
- family deduplication.

No deben exigir formato incidental.

### B — public/API contract

Protegen:

- exports;
- props;
- tipos;
- entry points;
- ausencia de API retirada.

Preferir `expectTypeOf` o behavior observable cuando sea posible.

### C — implementation snapshot

No deben permanecer como contrato de arquitectura.

Ejemplos a evitar:

```text
"esta línea debe aparecer después de aquella"
"el JSX debe tener exactamente este formato"
"este helper debe declararse inline"
```

Al cierre del sweep F:

```text
source-test files ambiguos   0
class C residual             0
```

Los antiguos source tests quedaron como:

```text
family-deduplication-ownership.test.ts          A
interaction-overlay-ownership.test.ts           A
forms-block5-architecture-contract.test.ts      A/B
forms-block6-architecture-contract.test.ts      A/B
forms-block7-architecture-contract.test.ts      A/B
forms-api-and-architecture-contract.test.ts     A/B
```

## Sweep estructural

`architecture-phase-f-sweep.test.ts` comprueba automáticamente:

- todos los módulos TS/TSX de `src` son alcanzables desde `src/index.ts`;
- no existen imports relativos TS sin resolver;
- `isControlled` sólo tiene los owners deliberados;
- `FloatingLayer` queda detrás de `FloatingOverlayRuntime`;
- no hay phase markers históricos en source productivo;
- no hay backups/tests/snapshots dentro de `src`;
- no quedan filenames `*source.test*`;
- el adapter identidad de NavigationStack no reaparece.

## Candidato Fase F

Ejecutar:

```bash
pnpm install --frozen-lockfile

pnpm --filter zerina-ui-internal-test typecheck

pnpm --filter zerina-ui-internal-test exec vitest run   tests/architecture-phase-f-sweep.test.ts   tests/family-deduplication-ownership.test.ts   tests/interaction-overlay-ownership.test.ts   tests/forms-block5-architecture-contract.test.ts   tests/forms-block6-architecture-contract.test.ts   tests/forms-block7-architecture-contract.test.ts   tests/forms-api-and-architecture-contract.test.ts   tests/semantics-phase-e4-type-equivalence-ownership.test.ts   tests/public-surface-contract.test.ts

pnpm validate
```

F sólo se cierra con `Validation complete.`.

### Corrección del candidato F

La primera corrida dirigida de F pasó `81/81`, pero `pnpm validate` detectó que el ownership test histórico de D2 seguía exigiendo el adapter identidad `getNavigationStackMotionPreset`.

La corrección valida ahora:

```text
MotionSwitch permanece en NavigationStack
preset={animation}
getNavigationStackMotionPreset ausente
```

Un primer intento de fix escribió `\n` literales en D2 ownership, BITACORA y VALIDACION. El candidato actual restaura esos tres archivos desde el snapshot F anterior y reaplica la corrección con saltos reales.

No hay cambios de producto.

## Hito G

G no abre nuevos refactors.

Su puerta es exclusivamente:

```bash
pnpm validate
```

Además se revisa el resultado ya incluido en esa puerta:

```text
React 18 consumer
React 19 consumer
ESM
CJS
CSS
public exports
pack content
browser
```

Sólo después de G se decide la siguiente versión estable.
