# BITACORA

## Objetivo actual

Cerrar `0.2.8` y preparar el hito `0.3.0` estable pre-1.0.

## Estado actual

- Versión cerrada y declarada: `0.2.7`.
- Fases `0.2.1`–`0.2.7`: cerradas.
- Proceso en curso: candidato `0.2.8` — proceso, distribución y documentación.
- `0.2.8` está implementado y pendiente de su primera ejecución integral.
- Después de `0.2.8`, sólo queda la revisión/validación de hito `0.3.0`.

## Invariantes

- No legacy sin necesidad vigente.
- No pipelines paralelos para la misma garantía.
- Una release no se valida sólo con build.
- La distribución se prueba desde el tarball, no importando source del workspace.
- Los entry points públicos son `.`, `styles.css` y `reset.css`.
- Todo bloque **manual/parcial** enviado al usuario comienza con `pnpm install --frozen-lockfile`.
- La puerta automatizada canónica `pnpm validate` es autosuficiente y no necesita un install externo.

## `0.2.7` — superficie pública + limpieza — CERRADO

Validación reportada:

- workspace install: PASS;
- harness typecheck: PASS;
- tests de superficie/source: 44/44 PASS;
- raíz typecheck: PASS;
- build ESM/CJS/DTS: PASS.

Resultado vigente:

- motion/viewport raíz con exports explícitos;
- runtimes/helpers internos no forman parte de la API raíz;
- 0 módulos TS/TSX huérfanos detectados;
- backups/resultados generados/.git anidado eliminados;
- política de ignores normalizada.

La versión se incrementó a `0.2.7`.

## `0.2.8` — proceso + distribución + documentación — CANDIDATO

### 1. Reproducibilidad de pnpm

`package.json` declara:

```json
"packageManager": "pnpm@10.34.5"
```

El workspace conserva:

```yaml
packages:
  - "internal-test"

allowBuilds:
  esbuild: true
```

Esto elimina la discrepancia observada al inicio entre pnpm antiguo y la política de build scripts actual.

### 2. Validación única

Nuevo:

```bash
pnpm validate
```

Owner: `scripts/validate.mjs`.

El script empieza por `pnpm install --frozen-lockfile`, instala/verifica Chromium y ejecuta todo el harness, typechecks, package verification y git whitespace check.

`validate.sh` fue eliminado para no mantener dos pipelines.

### 3. Clean portable

`pnpm clean` ya no depende de `rm -rf`; usa `scripts/clean.mjs`.

### 4. Verificación de distribución

Nuevo:

```bash
pnpm package:verify
```

Hace build y ejecuta `scripts/verify-package.mjs`.

El verificador:

- empaca el paquete real;
- instala el `.tgz` en un proyecto temporal fuera del workspace;
- valida contenido del paquete;
- valida los tres entry points;
- compila un consumidor TSX;
- carga ESM;
- carga CJS;
- resuelve ambos CSS entry points;
- elimina el consumidor temporal.

### 5. README

README reescrito como documento de consumidor actual:

- instalación/peers;
- estilos/reset;
- quick start;
- capas públicas;
- controlled/uncontrolled;
- cancelación;
- tema/motion/viewport;
- accesibilidad;
- desarrollo;
- validación;
- distribución.

Se eliminó el badge estático de “build passing” sin CI observable y la nota “README pendiente”.

### 6. Documentación operativa

Nuevo `docs/DISTRIBUCION.md`.

`docs/VALIDACION.md`, `VERSIONADO.md` y `ESTABILIZACION.md` fueron consolidados al estado actual.

## Pendiente para cerrar `0.2.8`

Ejecutar:

```bash
pnpm validate
```

Cualquier fallo debe clasificarse como:

- producto;
- harness;
- distribución;
- entorno.

No incrementar a `0.2.8` hasta quedar en verde.

## Siguiente paso

Si `pnpm validate` pasa:

1. incrementar a `0.2.8`;
2. consolidar bitácora;
3. preparar `0.3.0`;
4. ejecutar validación final de hito sin abrir nuevas refactorizaciones salvo blocker real.

## Primera ejecución integral de `0.2.8`

`pnpm validate` alcanzó la suite completa de Vitest.

Resultado observado:

- 40 archivos de test ejecutados;
- 38 PASS;
- 2 FAIL;
- 388 tests totales;
- 386 PASS;
- 2 FAIL.

Los dos fallos fueron clasificados como **harness desactualizado**, no producto:

1. `forms-block5-source.test.ts` seguía buscando la implementación manual histórica de cancelación de `SearchInput`/`PasswordInput`.
   - contrato vigente: `composeEventHandlers(external, internal)`;
   - el test ahora comprueba esa composición central y que `ControlAction` usa el handler compuesto.

2. `interaction-use-press-consumers.test.ts` seguía esperando `isFocused || press.state.focused`.
   - contrato vigente de MenuItem: `press.state.focused` es la única fuente de foco lógico;
   - `focusVisible` sigue separado;
   - el test ahora comprueba además que no reaparezca `isFocused`.

No se cambió código de producto para resolver estos fallos.

`pnpm validate` debe ejecutarse de nuevo completo porque la primera ejecución se detuvo en Vitest y todavía falta comprobar las etapas posteriores de build del harness, Chromium completo, package verification y consumidor limpio.

## Segunda ejecución integral de `0.2.8`

`pnpm validate` avanzó más allá de Vitest.

Resultados confirmados:

- workspace install: PASS;
- Chromium disponible: PASS;
- internal-test typecheck: PASS;
- Vitest completo: **388/388 PASS**;
- internal-test build: PASS;
- Playwright Chromium: **63/65 PASS**;
- root typecheck/package verification: no ejecutados en esa corrida porque Chromium cortó el pipeline.

### Fallos Chromium

Los dos fallos comparten una sola causa de producto:

- `Block 5: InputGroup distinguishes pointer and keyboard focus`;
- `Block 4: pointer focus has no keyboard ring`.

Ambos recibían `data-focus-visible` después de un click/pointer focus.

### Causa raíz

Owner: `src/core/interaction/focus/useFocusVisible.ts`.

El tracker de modalidad se retenía por primera vez durante `handleFocus`.

Orden real del navegador:

```text
pointerdown
→ focus
```

Por tanto, cuando el tracker nacía dentro de `focus`, ya había perdido el
`pointerdown` que causó ese foco.

La implementación intentaba inferir la modalidad inicial con:

```text
element.matches(":focus-visible")
```

pero ese selector nativo no expresa exactamente el contrato de Zerina UI.
Chromium puede considerar focus-visible un input de texto enfocado por pointer.

Resultado: pointer focus podía clasificarse como keyboard focus.

### Corrección

`useFocusVisible` ahora retiene el tracker compartido del `document` en
`useIsomorphicLayoutEffect`, antes de la primera interacción posible.

El tracker sigue siendo único por Document y conserva reference counting.

Consecuencias:

- pointerdown queda observado antes de focus;
- keydown queda observado antes de focus;
- Input/InputGroup/Textarea/Select/usePress siguen consumiendo el mismo owner;
- no se agregan parches locales por componente;
- el fallback `:focus-visible` queda únicamente para un Document que aparezca
  excepcionalmente por primera vez durante focus (por ejemplo, un ownerDocument
  distinto).

Se añadió un contrato source que impide volver a crear el tracker sólo después
del primer focus.

### Limpieza derivada del pipeline

- El warning Vite de chunk >500 kB pertenece al harness interno y no es blocker
  de la distribución de la librería.
- No se hará code-splitting artificial del harness para ocultar ese warning.
- `package:verify` todavía no ha sido observado en ejecución completa; sigue
  pendiente después de que Chromium quede verde.

## Limpieza adicional del proceso detectada durante la segunda ejecución

El log mostró que ejecutar manualmente `pnpm install --frozen-lockfile` antes de `pnpm validate` duplicaba trabajo, porque `validate` ya instala el workspace.

Contrato corregido:

- validación completa: ejecutar sólo `pnpm validate`;
- validaciones parciales/manuales: comenzar con `pnpm install --frozen-lockfile`.

Además, `scripts/validate.mjs` ahora comprueba que la versión activa de pnpm coincida exactamente con `package.json#packageManager` antes de instalar o probar.

Con esto, la declaración `pnpm@10.34.5` deja de ser sólo documentación y se vuelve una precondición ejecutable.
