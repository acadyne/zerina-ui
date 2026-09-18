# BITACORA

## Objetivo actual

Llevar `zerina-ui` a un hito `0.3.0` estable pre-1.0 mediante fases funcionales de estabilización: contratos compartidos, deduplicación, interacción/overlay, superficie pública deliberada, limpieza, distribución y validación integral.

## Estado actual

- Versión cerrada y declarada en `package.json`: `0.2.5`.
- Fases `0.2.1` a `0.2.5`: cerradas.
- Proceso en curso: candidato `0.2.6` — interacción + overlay.
- `0.2.6` está implementado y revisado sintácticamente; falta validación con el toolchain real y Chromium.
- La advertencia pnpm `Ignored build scripts: esbuild` sigue pendiente para la fase de reproducibilidad `0.2.8`.

## Decisiones e invariantes

- No crear compatibilidad legacy sin consumidor/restricción vigente.
- No conservar una implementación sólo porque ya existe.
- Una mecánica transversal debe tener un único owner.
- Las APIs familiares pueden conservar nombres distintos cuando expresan semánticas/layouts distintos.
- `preventDefault()` representa cancelación explícita de la conducta compuesta posterior.
- Foco, dismiss, portal, scroll lock y presencia modal no deben reimplementarse por superficie.
- Cada `0.2.x` representa una fase funcional sustancial, no un cambio microscópico.
- No se incrementa una versión candidata antes de validarla.
- Cuando el usuario deba validar, todos los comandos se entregan juntos y en orden.

## Fases cerradas

### `0.2.1` — SettingsList

Contrato nativo de Switch/Checkbox, ownership único de estado y cancelación con `preventDefault`.

Validado con 14/14 Vitest, 1/1 Chromium, typechecks y build.

### `0.2.2` — acciones cancelables de slots

SearchInput y PasswordInput comparten composición externa → interna.

Validado con 10/10 Vitest, typechecks y build.

### `0.2.3` — tokens

69 hojas canónicas y paridad manifiesto/runtime/SSR/browser.

Validado con 50/50 Vitest, 2/2 Chromium, typechecks y build.

### `0.2.4` — contratos internos compartidos

Presencia de ReactNode y composición ARIA centralizadas; 10 consumidores migrados.

Validación efectiva cerrada al ejecutar el typecheck completo del harness durante `0.2.5`; regresiones dirigidas previas 33/33 PASS.

### `0.2.5` — deduplicación estructural

- BottomNavigation / NavigationRail comparten selection engine y renderer de destino.
- DataTable desktop/editable comparten renderer estructural.
- ConfirmDialog / ActionDialog comparten frame.
- Targets falsy no-null (`0`, `""`, `false`) son válidos.

Validación final:
- `internal-test` typecheck: PASS.
- tests específicos de deduplicación: 11/11 PASS.
- regresiones anteriores de la fase: 44/44 PASS.
- raíz typecheck: PASS.
- raíz build/DTS: PASS.

## `0.2.6` — interacción + overlay — CANDIDATO

### A. TriggerRuntime — cancelación multicapa

Contrato implementado:

```text
child
  ↓
slot local
  ↓
slot heredado
  ↓
conducta interna
```

Después de cada capa se consulta `event.defaultPrevented`.

Si una capa llama `preventDefault()`:

- esa capa sí se ejecuta;
- ninguna capa posterior se ejecuta;
- la conducta interna tampoco se ejecuta.

`stopPropagation()` conserva semántica DOM y no reemplaza este contrato de composición.

Esto cierra la ambigüedad anteriormente registrada como P4.1.

### B. Menu — época de intención de foco

Una intención `first` / `last` producida por `requestOpen` queda asociada únicamente al intento de apertura que la creó.

Mecánica:

- `requestOpen` registra intención y fuerza un commit local;
- si el owner controlado acepta la apertura en ese commit (`open=true`), la intención sigue vigente;
- si el owner ignora/difiere la solicitud y el commit continúa cerrado, la intención se invalida;
- una apertura programática posterior usa `configured`, no una intención obsoleta;
- cerrar el menú invalida cualquier intención pendiente.

Esto cierra la deuda anteriormente registrada como P3.1.

### C. Drawer / BottomSheet — runtime modal único

Nuevo owner:

`src/primitives/overlay/shared/ModalOverlayRuntime.tsx`

Posee una sola composición:

```text
MotionOverlayPresence
  → MotionOverlayRoot
  → Backdrop
  → DismissableLayer
  → FocusScope
  → MotionOverlayPanel
  → ScrollLock
  → Portal opcional
```

Drawer y BottomSheet conservan:

- recipes visuales;
- slots/nombres `data-ui-*`;
- placement/tamaño/handle;
- Header/Body/Footer/Title/Description/Close públicos.

Ya no poseen directamente:

- DismissableLayer;
- FocusScope;
- ScrollLock;
- MotionOverlayPresence;
- Portal.

Las props de slot se aplican antes de las invariantes del runtime para que un slot no pueda sustituir accidentalmente role modal, ownership de foco o dismiss.

### D. Pruebas preparadas

Unit/DOM:

- `trigger-runtime-cancellation.test.ts` — matriz exacta de cuatro niveles.
- `menu-open-intent-epoch.test.tsx` — request aceptado y rechazado.
- `modal-overlay-runtime.test.tsx` — smoke de Drawer/BottomSheet.
- `interaction-overlay-source.test.ts` — ownership estructural y ausencia de marcadores P3.1/P4.1.

Browser:

- `interaction-overlay.chromium.spec.ts`
  - request de teclado rechazado no filtra foco a apertura programática;
  - Drawer enfoca target, cierra con Escape y restaura foco;
  - BottomSheet cierra por outside/backdrop y restaura foco.

Harness:
- `browser-interaction-overlay.html`
- `src/browser-interaction-overlay.tsx`

### Estado de revisión

- Los archivos TS/TSX modificados y los nuevos tests transpilan sintácticamente con TypeScript 5.8.3.
- No quedan marcadores P3.1/P4.1 en el source de producto.
- Drawer/BottomSheet ya no contienen JSX directo de los owners del runtime modal.

## No validado / riesgos

`0.2.6` aún no está cerrado hasta ejecutar:

- typecheck del harness;
- los tests dirigidos;
- Chromium específico;
- typecheck raíz;
- build/DTS raíz.

La semántica de foco/dismiss depende de browser real, por eso Chromium es obligatorio en esta fase.

## Siguiente paso

Validar `0.2.6`.

Si pasa:

1. incrementar versión a `0.2.6`;
2. consolidar estado;
3. entrar a `0.2.7` — auditoría de superficie pública + eliminación de código/residuos sin contrato vigente.

## Resultado de la primera validación de `0.2.6`

Reportado por el usuario:

- `internal-test` typecheck: **PASS**.
- pruebas dirigidas: **10/10 PASS**.
- Menu epoch Chromium: **PASS**.
- Drawer restore-focus Chromium: **FAIL**.
- BottomSheet outside-dismiss Chromium: **FAIL** por expectativa incorrecta de restore.
- raíz `pnpm typecheck`: **PASS**.
- raíz `pnpm build` + DTS: **PASS**.

### Diagnóstico

#### Drawer / Escape

Bug real localizado en `FocusScope`:

- al cerrar, `DismissableLayer` restaura foco durante layout;
- el listener pasivo de containment de `FocusScope` todavía podía seguir conectado durante ese mismo commit;
- ese listener utilizaba valores cerrados de `interactive/isTopmost` y podía reatrapar el foco dentro del overlay.

Corrección:

- `FocusScope` mantiene refs de ownership actualizadas en `useIsomorphicLayoutEffect`;
- listeners de keydown/focusin consultan esas refs;
- un listener pasivo todavía conectado deja de atrapar foco tan pronto el scope pierde ownership.

#### BottomSheet / pointer-down outside

No era un bug de producto.

`DismissableLayer` ya define deliberadamente que un pointer-down externo que causa dismiss **suprime restoreFocus**, para no robar foco a la interacción externa.

Se corrigió el test browser para comprobar:

- dismiss efectivo;
- foco no retenido dentro del BottomSheet;
- no se fuerza el opener como destino.

### Estado

Falta revalidar únicamente el área modificada de foco/modal y el build/typecheck por haber cambiado código de producto.

## Segundo intento de revalidación de `0.2.6`

Reportado por el usuario:

- `internal-test` no ejecutó porque `internal-test/node_modules` estaba ausente en la copia usada para validar.
- raíz `pnpm typecheck`: **FAIL** por `TS2304` — `FocusScope` usaba `useIsomorphicLayoutEffect` sin importarlo.
- raíz bundling ESM/CJS: completó, pero DTS falló por el mismo error TypeScript.
- Chromium no ejecutó porque Playwright no estaba instalado en esa copia.

Clasificación:

- ausencia de `internal-test/node_modules`: bloqueo de entorno;
- import faltante en `FocusScope`: bug del candidato `0.2.6`.

Corrección aplicada:

```ts
import {
  useIsomorphicLayoutEffect,
} from "../react/useIsomorphicLayoutEffect";
```

No se modifica la semántica de la corrección de restore-focus; sólo se completa su dependencia explícita.

La siguiente validación debe comenzar por `pnpm install --frozen-lockfile` y repetir el bloque focalizado completo.

## Tercer resultado de revalidación de `0.2.6`

Reportado por el usuario:

- `internal-test` typecheck: **PASS**.
- smoke/ownership Vitest: **4/4 PASS**.
- Menu Chromium: **PASS**.
- Drawer Escape + restore-focus Chromium: **PASS**.
- BottomSheet outside-dismiss: el panel se desmonta y el opener no recupera foco; el único fallo fue de la aserción del test.
- raíz `pnpm typecheck`: **PASS**.
- raíz `pnpm build` + DTS: **PASS**.

El fallo restante no representa un bug de producto:

tras desmontar el BottomSheet, Chromium puede dejar `document.activeElement` en `body`, por lo que el selector `:focus` no necesariamente resuelve un elemento. `not.toHaveAttribute()` requiere que el locator exista y produjo un falso negativo.

La prueba se corrigió para consultar directamente `document.activeElement` y afirmar únicamente el contrato relevante:

- el foco no vuelve al opener;
- el foco no permanece en `sheet-input`.

No cambió código de producto en este ajuste.
