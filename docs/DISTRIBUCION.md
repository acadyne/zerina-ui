# Distribución y proceso

## Package manager

El repositorio declara:

```json
{
  "packageManager": "pnpm@10.34.5"
}
```

`pnpm-workspace.yaml` incluye explícitamente `internal-test` y aprueba únicamente el build script de `esbuild`:

```yaml
packages:
  - "internal-test"

allowBuilds:
  esbuild: true
```

No se usa `pnpm approve-builds` como paso manual del proceso normal: la decisión está codificada en el workspace.

## Puerta canónica

La única puerta completa de validación es:

```bash
pnpm validate
```

Owner: `scripts/validate.mjs`.

El script ejecuta, en orden:

1. install congelado;
2. instalación/verificación de Chromium;
3. typecheck del harness;
4. Vitest completo;
5. build del harness;
6. Playwright Chromium completo;
7. typecheck del paquete;
8. `pnpm package:verify`;
9. `git diff --check` cuando existe `.git`.

No mantener un segundo pipeline paralelo en shell.

## Verificación del paquete

Comando:

```bash
pnpm package:verify
```

Owners:

- script de package: build;
- `scripts/verify-package.mjs`: pack + consumidor limpio.

El verificador:

1. crea un tarball con `pnpm pack`;
2. crea un proyecto temporal fuera del workspace;
3. instala el tarball como dependencia;
4. comprueba que existen JS ESM/CJS, DTS y CSS;
5. comprueba que source/docs internas/scripts no se distribuyen;
6. confirma los tres entry points públicos;
7. compila un consumidor TypeScript/React;
8. prueba resolución runtime ESM y CJS;
9. prueba resolución de `styles.css` y `reset.css`;
10. elimina el proyecto temporal.

## Contenido distribuible

`package.json#files` limita el paquete a:

- `dist`;
- `README.md`;
- `LICENSE`.

`package.json#exports` limita la superficie instalable a:

- `.`;
- `./styles.css`;
- `./reset.css`.

## Build

Owner: `tsup.config.ts`.

Entradas:

- `src/index.ts`;
- `src/styles.css`;
- `src/reset.css`.

Formatos JS:

- ESM;
- CJS.

Tipos:

- `dist/index.d.ts`;
- `dist/index.d.cts`.

Peers externos al bundle:

- React;
- React DOM.

Dependencias runtime externas:

- framer-motion;
- lucide-react.

## Release pre-1.0

Antes de considerar una versión lista:

```bash
pnpm validate
```

debe terminar en verde desde la raíz del repositorio.

No publicar basándose únicamente en `pnpm build`.
