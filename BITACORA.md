# BITACORA

## Objetivo actual

Cerrar el hito `0.3.0` estable pre-1.0.

## Estado

- Versión cerrada y declarada: `0.2.8`.
- Todas las fases `0.2.1`–`0.2.8`: cerradas.
- Candidato actual: `0.3.0` — release hardening.
- No hay refactors funcionales abiertos.
- No hay blockers conocidos de producto después de la validación integral de `0.2.8`.

## Validación que cerró `0.2.8`

Reportado por el usuario:

- pnpm exacto `10.34.5`: PASS;
- install congelado: PASS;
- harness typecheck: PASS;
- Vitest: **389/389 PASS**;
- harness build: PASS;
- Chromium: **65/65 PASS**;
- package typecheck: PASS;
- ESM/CJS/DTS: PASS;
- pack: PASS;
- instalación fuera del workspace: PASS;
- TypeScript del consumidor: PASS;
- ESM/CJS/CSS: PASS;
- whitespace Git: PASS.

El tarball observado contiene únicamente dist + README + LICENSE + manifest.

`0.2.8` queda cerrado y `package.json` se incrementó a `0.2.8`.

## Candidato `0.3.0`

### Alcance

Sólo garantías de release. No reabrir componentes, overlay, forms, theme ni navegación salvo blocker demostrado por validación.

### 1. Pack siempre fresco

Nuevo lifecycle:

```json
"prepack": "pnpm build"
```

`pnpm pack` y el pack previo a publicación construyen desde source antes de generar el tarball.

`package:verify` ya no ejecuta un build manual separado; usa el mismo camino real:

```text
package:verify
→ pnpm pack
→ prepack
→ pnpm build
```

### 2. Publish detrás de la puerta canónica

Nuevo lifecycle:

```json
"prepublishOnly": "pnpm validate"
```

La publicación normal exige la misma validación integral usada por el repositorio.

No hay recursión:

- `publish` ejecuta `prepublishOnly`;
- `validate` ejecuta `package:verify`;
- `package:verify` ejecuta `pack`;
- `pack` ejecuta `prepack`, no `prepublishOnly`.

### 3. Peer range realmente probado

El manifest declara:

```text
react      >=18 <20
react-dom  >=18 <20
```

Hasta `0.2.8`, el consumidor limpio sólo verificaba React 18.

`package:verify` ahora instala el mismo tarball en dos consumidores independientes:

- React 18.3.1 + tipos 18;
- React 19.0.0 + tipos 19.

En ambos ejecuta:

- install fuera del workspace;
- typecheck TSX;
- ESM smoke;
- CJS smoke;
- CSS resolution;
- contenido/exports del paquete.

### 4. Contrato automatizado

Nuevo:

`internal-test/tests/release-process-contract.test.ts`

Impide relajar accidentalmente:

- `prepack`;
- `prepublishOnly`;
- pnpm exacto;
- cobertura React 18/19 del verifier.

## No blockers

El warning de Vite por chunk >500 kB pertenece sólo al harness interno y no se considera blocker. No se distribuye y no representa el tamaño/estructura del paquete instalado.

## Criterio final

Ejecutar únicamente:

```bash
pnpm validate
```

Si queda verde con ambos consumidores, incrementar `package.json` a `0.3.0` y declarar cerrado el hito.

## Primera validación del candidato `0.3.0`

La puerta avanzó hasta el segundo consumidor limpio.

Resultados:

- pnpm/version/install: PASS;
- harness typecheck: PASS;
- Vitest: **392/392 PASS**;
- harness build: PASS;
- Chromium: **65/65 PASS**;
- package typecheck: PASS;
- prepack/build ESM/CJS/DTS: PASS;
- tarball: PASS;
- consumidor React 18: install + typecheck + ESM/CJS/CSS PASS;
- consumidor React 19: install PASS, typecheck FAIL.

### Causa

No es un fallo de tipos de Zerina UI.

El error nace en:

`lucide-react@0.468.0/dist/lucide-react.d.ts`

que importa `ReactSVG` desde React. Ese tipo fue eliminado en `@types/react` 19.

Además, la propia versión 0.468.0 declara React 19 RC en su peer range, no React 19 estable.

Esto demuestra que el peer range de Zerina UI (`>=18 <20`) no podía considerarse verdadero con la dependencia anterior.

### Corrección

Actualizado `lucide-react` en root y harness:

```json
"lucide-react": "^0.475.0"
```

Actualizado `pnpm-lock.yaml` a `0.475.0`.

La versión 0.475.0 declara:

```text
react: ^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0
```

y ya no depende del tipo removido `ReactSVG`.

No se cambia `framer-motion`: la versión actual 12.38.0 ya declara React 18 y 19 en sus peer dependencies.

### Contrato añadido

`release-process-contract.test.ts` fija `^0.475.0` como baseline de Lucide para evitar volver accidentalmente a una versión que sólo soporte React 19 RC.

La versión sigue en `0.2.8`. `0.3.0` no se cierra hasta que `pnpm validate` confirme ambos consumidores.

## Segunda validación del candidato `0.3.0`

La actualización a Lucide `0.475.0` resolvió el bloqueo de tipos React 19, pero la puerta encontró un segundo defecto de distribución antes incluso de llegar al consumidor React 19.

Resultados antes del fallo:

- pnpm/version/install: PASS;
- harness typecheck: PASS;
- Vitest: **393/393 PASS**;
- harness build: PASS;
- Chromium: **65/65 PASS**;
- package typecheck: PASS;
- prepack/build ESM/CJS/DTS: PASS;
- tarball: PASS;
- consumidor React 18: install + typecheck PASS;
- consumidor React 18: runtime CJS FAIL.

### Causa

`lucide-react@0.475.0` publica:

```text
main -> dist/cjs/lucide-react.js
```

pero su paquete quedó marcado como ESM en esa serie. En Node 24, `require("zerina-ui")` termina resolviendo el CJS de Lucide como módulo ESM y falla con:

```text
ReferenceError: require is not defined in ES module scope
```

No es correcto:

- quitar el smoke CJS;
- usar un loader especial;
- ocultarlo con bundling accidental;
- declarar CJS en Zerina UI si una dependencia runtime rompe ese camino.

### Corrección

Baseline actualizado a:

```json
"lucide-react": "^0.507.0"
```

`0.507.0` cumple simultáneamente:

- peer de React 19 estable;
- tipos sin `ReactSVG`;
- `main: dist/cjs/lucide-react.js`;
- paquete publicado sin `"type": "module"`, por lo que ese `main` vuelve a ser CommonJS real.

El lockfile queda fijado en `0.507.0`.

### Criterio reforzado

La compatibilidad de una dependencia runtime no se valida sólo por peerDependencies o typecheck.

Para `0.3.0` debe pasar, desde el tarball:

```text
React 18:
  TS + ESM + CJS + CSS

React 19:
  TS + ESM + CJS + CSS
```

La versión sigue en `0.2.8` hasta una puerta completamente verde.
