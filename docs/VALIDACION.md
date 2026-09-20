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

Además, el consumer empaquetado importa explícitamente tipos semánticos públicos
desde `zerina-ui` (navegación, theme, viewport, forms, overlay, layout y media).
Esto evita que una declaración interna utilizada por una prop pública quede
inaccesible desde el entry point raíz.

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

## Fase F cerrada

Resultado reportado:

```text
tests dirigidos F        38/38 PASS
Vitest completo         548/548 PASS
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

## Hito G cerrado

Resultado reportado:

```text
Vitest completo         548/548 PASS
Chromium                  65/65 PASS
internal-test typecheck       PASS
internal-test build           PASS
package typecheck             PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
pack content                  PASS
git whitespace                PASS
Validation complete.
```

## Candidato 0.4.0

La decisión de versión cambia únicamente metadata publicable.

La puerta integral fue ejecutada sobre `package.json#version = 0.4.0` y terminó en:

```text
Vitest completo         578/578 PASS
Chromium                  65/65 PASS
internal-test typecheck       PASS
internal-test build           PASS
package typecheck             PASS
build ESM/CJS/DTS             PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
pack content                  PASS
git whitespace                PASS
Validation complete.
```

Por tanto el candidato exacto `0.4.0` queda validado para release.


## Candidato 0.5.0

La versión objetivo actual es:

```text
0.5.0
```

El gate debe ejecutarse sobre esa metadata exacta. Además de las comprobaciones
generales anteriores, `package:verify` hace smoke de los owners públicos
visuales y de entorno tanto en ESM como en CJS:

```text
toneRecipe
surfaceRecipe
interactiveStateRecipe
typographyRecipe
UIThemeProvider / useUITheme
UIViewportProvider / useUIViewport
UIMotionProvider / useUIMotion
```

El cierre de `0.5.0` requiere también que la demo hermana pase `pnpm validate`
y levante con `pnpm dev`. La demo es un gate de integración; no reemplaza el
tarball clean-consumer de la librería.
