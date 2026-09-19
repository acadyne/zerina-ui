# Distribución y proceso

## Estado

La serie `0.2.x` terminó en `0.2.8`.

`0.3.0` es el baseline estable del ciclo actual. No se asigna una versión siguiente hasta cerrar el hito G.

## Package manager

El repositorio fija:

```json
"packageManager": "pnpm@10.34.5"
```

`pnpm validate` comprueba que la versión activa coincida exactamente.

## Workspace

```yaml
packages:
  - "internal-test"

allowBuilds:
  esbuild: true
```

La decisión de permitir el build script de esbuild está codificada; no depende de aprobación manual.

## Puerta canónica

```bash
pnpm validate
```

Ejecuta:

1. versión de pnpm;
2. install congelado;
3. Chromium;
4. typecheck del harness;
5. Vitest completo;
6. build del harness;
7. Chromium completo;
8. typecheck del paquete;
9. `package:verify`;
10. whitespace Git cuando existe repositorio.

## Pack

`prepack` ejecuta:

```bash
pnpm build
```

Por tanto `pnpm pack` y el pack que precede a una publicación nunca deben reutilizar un `dist` obsoleto.

## Publish

`prepublishOnly` ejecuta:

```bash
pnpm validate
```

Una publicación normal queda detrás de la misma puerta que se usa para estabilizar el repositorio.

## Verificación del paquete

```bash
pnpm package:verify
```

`package:verify`:

- ejecuta `pnpm pack`;
- `prepack` genera el build;
- instala el mismo tarball en consumidores temporales fuera del workspace;
- prueba React 18.3.1;
- prueba React 19.0.0;
- compila TypeScript con los tipos correspondientes;
- carga ESM y CJS;
- resuelve ambos CSS entry points;
- valida contenido y `exports`.

La matriz refleja el peer range publicado:

```text
react      >=18 <20
react-dom  >=18 <20
```

## Contenido distribuible

`package.json#files` limita el paquete a:

- `dist`;
- `README.md`;
- `LICENSE`.

Entry points:

- `.`;
- `./styles.css`;
- `./reset.css`.

No se distribuyen source, harness, docs internas, scripts ni bitácora.

## Warning del harness

Vite puede advertir que el bundle monolítico del harness supera 500 kB.

No es un blocker del paquete:

- el harness existe para integración y cobertura;
- no se distribuye;
- el tamaño del paquete se verifica en el tarball real.

No introducir code splitting artificial únicamente para ocultar ese warning.

## Compatibilidad transitiva del peer range React

El peer range de Zerina UI sólo se considera válido si las dependencias runtime directas también lo soportan.

Baseline actual:

```text
framer-motion  ^12.38.0  → React 18/19
lucide-react   ^0.507.0  → React 18/19 + ESM/CJS compatible
```

La compatibilidad se considera válida sólo si el tarball funciona en los consumidores limpios. `peerDependencies`, typecheck aislado o `skipLibCheck` no sustituyen esa prueba.

La serie Lucide `0.470–0.475` tuvo una regresión de empaquetado ESM/CJS; no debe usarse como baseline de distribución de Zerina UI.

## Estado del ciclo A–G

```text
A–E   cerradas
F     implementada, pendiente de validación
G     pendiente
```

F no cambia entry points ni contenido distribuible.

G será el cierre integrado y volverá a comprobar el mismo tarball real en React 18/19, ESM/CJS/CSS y browser antes de decidir la siguiente versión.
