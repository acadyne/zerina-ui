# BITACORA

## Objetivo actual

Llevar `zerina-ui` a una versión pre-1.0 estable mediante fases funcionales sustanciales: contratos compartidos, deduplicación real, superficie pública deliberada, limpieza, empaquetado y validación integral.

## Criterio de versionado vigente

A partir de `0.2.4`, un incremento `0.2.x` representa una **fase coherente de estabilización**, no un cambio microscópico.

Una fase puede incluir varias mejoras relacionadas siempre que:

- compartan un objetivo técnico;
- tengan scope cerrado;
- puedan validarse como unidad;
- dejen el sistema en un estado comprensible.

`0.2.1–0.2.3` quedan como normalización inicial ya validada. No se reescribe su historia, pero no se repetirá esa granularidad.

Cuando se solicite validación al usuario, todos los comandos se enviarán juntos en un único bloque y en orden.

## Estado actual

- Versión cerrada: `0.2.3`.
- Proceso en curso: candidato `0.2.4` — normalización de contratos internos compartidos.
- `0.2.3` está cerrado y validado.
- `0.2.4` ya modifica de forma transversal 10 consumidores de `ReactNode`, corrige una incoherencia real de `List`, centraliza ARIA y añade regresiones. Falta ejecución.

## Fases cerradas

### `0.2.1` — SettingsList

- eventos change nativos;
- una sola máquina de estado;
- cancelación con `preventDefault`.

Validación: 14/14 Vitest + 1/1 Chromium + typechecks/build.

### `0.2.2` — composición cancelable de slots

- `SearchInput` y `PasswordInput` reutilizan `composeEventHandlers`;
- orden externo → interno;
- cancelación explícita.

Validación: 10/10 Vitest + typechecks/build.

### `0.2.3` — contrato de tokens

- 69 hojas canónicas;
- rama interaction con 6 hojas;
- runtime/SSR/browser derivados del manifiesto;
- una sola aserción explícita de cardinalidad total.

Validación reportada:

- `internal-test` typecheck: PASS;
- 4 archivos Vitest: 50/50 PASS;
- Chromium: 2/2 PASS;
- raíz typecheck: PASS;
- raíz build: PASS.

La versión del paquete fue incrementada a `0.2.3`.

## `0.2.4` — normalización de contratos internos compartidos — CANDIDATO

### Objetivo

Eliminar implementaciones locales divergentes de contratos básicos utilizados por múltiples capas.

### 1. Presencia/renderabilidad de ReactNode

Antes:

- 10 implementaciones locales de `hasRenderableNode`;
- tres interpretaciones diferentes;
- `List` trataba `true`/`false` como contenido presente.

Ahora:

`src/core/react/nodePresence.ts` define:

- `hasRenderableNode`: ausentes `null`, `undefined` y booleanos; `0` permanece válido.
- `hasNonEmptyRenderableNode`: misma regla y además `""` ausente.

Consumidores migrados:

- ActionSheet;
- DrawerNavigation;
- Scaffold;
- TopAppBar;
- TabScaffold;
- SettingsList;
- Field;
- List;
- BottomSheet;
- Drawer.

Consecuencia:

`List.Section` ya no genera header, IDs o referencias ARIA cuando `label`/`description` son booleanos que React no renderiza.

`Field` conserva de forma explícita su semántica más estricta para `""`.

### 2. IDs ARIA

Antes:

- `field-semantics.ts` tenía una implementación robusta;
- `SettingsList` tenía otra implementación local más débil.

Ahora:

`src/core/dom/aria.ts` contiene la única implementación de `mergeAriaIds`.

Contrato:

- separa listas por whitespace;
- elimina vacíos;
- deduplica;
- conserva orden;
- devuelve `undefined` cuando no existen IDs útiles.

`field-semantics.ts` reexporta la utilidad.
`SettingsList` la consume desde core.

### 3. Estado estructural

Verificado por inspección:

- no quedan implementaciones locales de `hasRenderableNode` fuera del core;
- sólo existe una definición de `mergeAriaIds`;
- los 10 consumidores identificados importan el contrato compartido.

### 4. Pruebas añadidas

`internal-test/tests/core-shared-contracts.test.tsx` cubre:

- `null`;
- `undefined`;
- booleanos;
- `0`;
- string vacío;
- regresión de `List.Section` con booleanos;
- `List.Section` con `0`;
- normalización y deduplicación de IDs ARIA.

Además se ejecutarán regresiones existentes de Field y SettingsList.

### Pendiente de validación

- typecheck `internal-test`;
- nuevo test de contratos;
- Field semantics;
- SettingsList contract;
- typecheck raíz;
- build raíz.

## Roadmap grande vigente

### `0.2.5` — deduplicación estructural de familias

Objetivo: eliminar implementaciones paralelas conservando sólo diferencias semánticas reales.

Familias:

- NavigationRail / BottomNavigation;
- DataTable desktop/editable;
- ConfirmDialog / ActionDialog;
- Drawer / BottomSheet.

### `0.2.6` — interacción y overlay

Cerrar juntos:

- Menu P3.1;
- TriggerRuntime P4.1;
- foco;
- apertura/cierre;
- cancelación;
- ownership entre capas.

### `0.2.7` — superficie pública y código no vigente

- clasificar exports;
- retirar implementación accidentalmente pública;
- eliminar código sin contrato vigente;
- eliminar backups/artefactos generados confirmados.

### `0.2.8` — proceso, paquete y documentación

- `pnpm validate`;
- reproducibilidad pnpm/esbuild;
- higiene de repo;
- README de consumidor;
- pack;
- instalación desde tarball limpio.

### `0.3.0` — hito estable pre-1.0

Validación integral de paquete, browser y consumidor limpio.

## Siguiente paso

Validar `0.2.4`. Si queda verde, cerrar la fase y entrar a la deduplicación estructural de `0.2.5`.
