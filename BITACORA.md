# BITACORA

## Objetivo actual

Llevar `zerina-ui` a `0.3.0` estable pre-1.0 mediante fases funcionales: contratos, deduplicación, interacción/overlay, superficie pública, limpieza, distribución y validación integral.

## Estado actual

- Versión cerrada y declarada: `0.2.6`.
- Fases `0.2.1`–`0.2.6`: cerradas.
- Proceso en curso: candidato `0.2.7` — superficie pública + eliminación de residuos.
- `0.2.7` está implementado y pendiente de validación.
- `0.2.8` quedará reservado para proceso reproducible, README, pack y consumidor limpio.
- Todo bloque de validación enviado al usuario debe comenzar con `pnpm install --frozen-lockfile`.

## Invariantes

- No compatibilidad legacy sin consumidor/restricción vigente.
- No conservar código o exports sólo porque existen.
- Una API pública debe ser deliberada.
- Una implementación interna no se promueve a contrato por aparecer en un barrel.
- No borrar componentes públicos por similitud interna.
- No eliminar source sólo por heurística: primero demostrar que no existe reachability/contrato.
- La documentación describe el presente.

## `0.2.6` — interacción + overlay — CERRADO

Validación final:

- harness typecheck: PASS;
- pruebas unit/DOM dirigidas: PASS;
- Chromium: 3/3 PASS;
- raíz typecheck: PASS;
- raíz build + DTS: PASS.

Contratos cerrados:

- TriggerRuntime: cancelación progresiva por `preventDefault`;
- Menu: intención de foco ligada a época de apertura;
- Drawer/BottomSheet: runtime modal compartido;
- FocusScope: restore-focus no es reatrapado durante transición de ownership;
- pointer-down outside no fuerza restore al opener.

La versión se incrementó a `0.2.6`.

## `0.2.7` — superficie pública + eliminación — CANDIDATO

### 1. Reachability

Se analizó el grafo completo de imports/exports relativo a `src/index.ts`.

Resultado:

- 291 módulos TS/TSX analizados;
- 291 alcanzables desde la entrada pública;
- 0 módulos source huérfanos.

Decisión:

No eliminar módulos de producto por “unused” en esta fase. No existe evidencia estructural para hacerlo.

### 2. Frontera pública de core

`src/index.ts` dejó de hacer wildcard sobre:

- `./core/motion`;
- `./core/viewport`.

Motion raíz conserva únicamente API de consumidor:

- UIMotionProvider;
- useUIMotion;
- MotionPresence;
- MotionPresenceGroup;
- MotionSwitch;
- tipos públicos.

Se retiraron de la raíz piezas de implementación:

- MotionOverlayPresence/Root/Backdrop/Panel;
- helpers de presets;
- useOptionalUIMotion.

Viewport raíz conserva:

- UIViewportProvider;
- useUIViewport;
- DEFAULT_UI_VIEWPORT_BREAKPOINTS;
- tipos públicos.

Se retiraron de raíz:

- resolveUIViewportKind;
- useOptionalUIViewport.

`core/interaction` permanece público porque `usePress` tiene consumidores vigentes y constituye una abstracción reusable.

### 3. Entry points de paquete

`package.json` continúa publicando únicamente:

- `.`;
- `./styles.css`;
- `./reset.css`.

No existen subpaths públicos de implementación.

### 4. Residuos eliminados

Eliminados 8 backups `.bak.block4*` sin referencias activas.

Eliminado:

- `internal-test/test-results`;
- `internal-test/.git` anidado.

El `.git` anidado:

- no tenía remote;
- no constituye un paquete/submodule declarado;
- interfería conceptualmente con el workspace único.

### 5. Ignore policy

Creado `.gitignore` raíz.

Simplificado `internal-test/.gitignore` para ignorar sólo artefactos locales/generados relevantes, eliminando entradas históricas y contradictorias.

### 6. Contrato añadido

`internal-test/tests/public-surface-contract.test.ts` verifica:

- APIs públicas de motion/viewport siguen presentes;
- runtimes/helpers internos no reaparecen en raíz;
- no vuelven wildcard exports de motion/viewport;
- package exports siguen limitados a los tres entry points deliberados.

### 7. Documentación

Nuevo `docs/SUPERFICIE_PUBLICA.md` define:

- qué es API raíz;
- qué permanece interno;
- criterio de eliminación;
- política de higiene.

## Pendiente para cerrar `0.2.7`

- instalar workspace;
- typecheck harness;
- ejecutar contrato de superficie pública;
- ejecutar tests de API/source activos;
- typecheck raíz;
- build/DTS;
- confirmar que la API estrechada no rompe imports internos ni el harness.

## Siguiente paso

Si `0.2.7` pasa:

1. incrementar a `0.2.7`;
2. consolidar docs;
3. entrar a `0.2.8` — `pnpm validate`, reproducibilidad pnpm/esbuild, README real, pack e instalación desde tarball limpio.
