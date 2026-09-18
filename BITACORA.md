# BITACORA

## Objetivo actual

Llevar `zerina-ui` a una versión pre-1.0 estable mediante fases funcionales sustanciales: contratos compartidos, deduplicación real, interacción/overlay, superficie pública deliberada, limpieza, empaquetado y validación integral.

## Criterio de versionado vigente

Cada `0.2.x` representa una fase funcional de estabilización, no un helper ni un cambio microscópico.

Una fase puede contener varias correcciones/refactors relacionados si comparten objetivo, scope y criterio de validación.

Cuando se solicite validación al usuario, todos los comandos se envían juntos en un único bloque y en orden.

## Estado actual

- Versión declarada en `package.json`: `0.2.3`.
- `0.2.4` está implementado; sus 33/33 pruebas dirigidas y el typecheck/build de raíz pasaron. El último `internal-test typecheck` posterior a retirar un import no usado no se ejecutó porque el usuario decidió avanzar. Esa comprobación se integra en la validación de `0.2.5`; no se afirma todavía que `0.2.4` esté validado al 100%.
- Proceso en curso: candidato `0.2.5` — deduplicación estructural de familias.
- `0.2.5` contiene cambios sustanciales en navegación, DataTable y diálogos orientados a target.
- `Drawer/BottomSheet` se retiraron deliberadamente de `0.2.5`: su duplicación incluye runtime de overlay/motion/foco/dismiss y se resolverá en `0.2.6` junto con los contratos transversales correspondientes.

## Fases cerradas y confirmadas

### `0.2.1` — SettingsList

Contrato nativo de Switch/Checkbox y ownership único del estado.

Validación: 14/14 Vitest + 1/1 Chromium + typechecks/build.

### `0.2.2` — acciones cancelables de slots

SearchInput y PasswordInput comparten `composeEventHandlers`.

Validación: 10/10 Vitest + typechecks/build.

### `0.2.3` — contrato de tokens

69 hojas canónicas; runtime/SSR/browser derivados del manifiesto.

Validación: 50/50 Vitest + 2/2 Chromium + typechecks/build.

## `0.2.4` — contratos internos compartidos — IMPLEMENTADO / VALIDACIÓN FINAL PENDIENTE

Implementado:

- presencia/renderabilidad de ReactNode central;
- 10 consumidores migrados;
- corrección de `List` con booleanos;
- `mergeAriaIds` único;
- regresiones de ReactNode/ARIA.

Evidencia ya obtenida:

- 33/33 tests dirigidos PASS;
- raíz typecheck PASS;
- raíz build PASS.

Pendiente:

- `internal-test typecheck` posterior a eliminar el único import no usado.

Se ejecutará como primera parte de la validación de `0.2.5`.

## `0.2.5` — deduplicación estructural de familias — CANDIDATO

### Objetivo

Que familias que comparten un contrato no mantengan copias completas de la misma mecánica.

No se eliminan nombres públicos por similitud; se conserva la API familiar y se centraliza la implementación que realmente es común.

### A. BottomNavigation / NavigationRail

Realidad previa:

- `BottomNavigationItem` y `NavigationRailItem` eran aproximadamente 93% similares;
- ambos roots implementaban por separado el mismo estado controlled/uncontrolled, `change/reselect` y callback de selección.

Implementado:

1. `src/primitives/navigation/shared/navigationSelection.ts`
   - una sola máquina controlled/uncontrolled;
   - una sola definición de `change` / `reselect`;
   - un solo contrato de previousValue.

2. `src/primitives/navigation/shared/NavigationDestinationItem.tsx`
   - slots activo/inactivo;
   - composición de `onPress`;
   - cancelación mediante `preventDefault`;
   - badge anchoring;
   - label visibility;
   - `aria-current`;
   - commit de selección.

Los wrappers `BottomNavigationItem` y `NavigationRailItem` conservan únicamente:

- contexto de su familia;
- recipe propia;
- diferencias de dimensiones;
- atributos `data-ui-*`;
- colocación visual del badge;
- opciones específicas (`iconPosition` frente a `itemMinHeight`).

### B. DataTableDesktop / DataTableEditableDesktop

Realidad previa:

Las dos implementaciones repetían prácticamente toda la tabla:

- root/viewport/table;
- thead/tbody;
- sorting;
- selección;
- filas;
- slots;
- empty state;
- estilos de celdas.

Implementado:

`src/components/data-table/DataTableDesktopBase.tsx` es ahora el único renderer estructural desktop.

La variante estándar sólo aporta:

- render de `Cell`/valor;
- título/exportValue;
- densidad y minWidth propios.

La variante editable sólo aporta:

- editores Input/Select;
- conversión visual de valor;
- callback `onCellChange`;
- densidad y minWidth propios.

Sorting, selección, slots y estructura ya no tienen dos implementaciones que puedan divergir.

### C. ConfirmDialog / ActionDialog

Realidad previa:

Ambos duplicaban:

- resolución de renderables por target;
- Dialog/header/title/description;
- targetLabel;
- error;
- body;
- footer;
- configuración de foco/dismiss.

Implementado:

`src/patterns/shared/TargetDialogFrame.tsx` concentra la estructura común.

Cada patrón conserva su semántica propia:

- ConfirmDialog mantiene guardas de operación async y cierre seguro;
- ActionDialog mantiene su acción sin auto-close implícito;
- cada uno conserva su esquema visual de botón.

Bug corregido durante la extracción:

Targets falsy válidos (`0`, `""`, `false`) antes eran tratados como target ausente por checks truthy. El contrato compartido usa ahora `target !== null`.

### D. Drawer / BottomSheet — MOVIDO A `0.2.6`

La similitud sigue confirmada, pero su núcleo común atraviesa:

- DismissableLayer;
- FocusScope;
- ScrollLock;
- MotionOverlayPresence/Panel/Backdrop;
- restore/initial focus;
- dismiss;
- overlay IDs.

Extraer sólo JSX ahora crearía una abstracción incompleta. Se deduplicará después de fijar el contrato transversal de overlay/interacción en `0.2.6`.

## Resultado de la primera validación de `0.2.5`

Reportado por el usuario:

- suite dirigida: **44/44 PASS**;
- `family-deduplication-source.test.ts`: **4/4 PASS**;
- `family-deduplication-contracts.test.tsx`: **7/7 PASS**;
- regresiones de `0.2.4`: **33/33 PASS**;
- `internal-test` typecheck: **FAIL** por dos errores de compilación;
- raíz `pnpm typecheck`: **FAIL** por el mismo error genérico de DataTable;
- bundling ESM/CJS/CSS llegó a completarse, pero el build completo no se considera validado mientras typecheck/DTS no queden verdes.

Errores encontrados:

1. import `getByTestId` no usado en el test nuevo (`TS6133`);
2. `Boolean(value)` produjo una inferencia genérica incompatible sobre `T[keyof T]` en `DataTableEditableDesktop`.

Correcciones aplicadas:

- eliminado el import no usado;
- reemplazado `String(Boolean(value))` por la expresión equivalente `value ? "true" : "false"`, evitando la inferencia genérica sin cambiar la semántica observable.

`0.2.5` sigue como candidato hasta repetir typecheck, sus pruebas específicas y build.

## Validación preparada para `0.2.5`

Nuevas pruebas:

- `family-deduplication-contracts.test.tsx`
  - BottomNavigation change/reselect;
  - NavigationRail change/reselect;
  - cancelación de selección;
  - DataTable estándar sorting/render;
  - DataTable editable change propagation;
  - targets falsy de diálogos.

- `family-deduplication-source.test.ts`
  - ownership estructural;
  - wrappers sin segunda implementación del renderer/estado.

Verificado localmente por inspección:

- los 14 archivos TS/TSX modificados transpilan sintácticamente;
- los wrappers de navegación ya no contienen `resolveLayeredSlot` ni `Pressable`;
- los roots ya no contienen `setInternalValue` ni lógica `reselect`;
- los wrappers DataTable ya no contienen `<table>`;
- ConfirmDialog/ActionDialog ya no contienen DialogHeader ni el markup de error.

No validado todavía mediante el toolchain completo del proyecto.

## Roadmap vigente

### `0.2.6` — interacción + overlay

- Menu P3.1;
- TriggerRuntime P4.1;
- Drawer / BottomSheet runtime común;
- foco;
- dismiss;
- apertura/cierre;
- ownership/cancelación entre capas.

### `0.2.7` — superficie pública y eliminación

- clasificar exports;
- retirar exposición accidental;
- eliminar código sin contrato vigente;
- eliminar backups/resultados generados confirmados.

### `0.2.8` — distribución, proceso y documentación

- `pnpm validate`;
- reproducibilidad de workspace/esbuild;
- README;
- pack;
- instalación/consumo desde tarball limpio.

### `0.3.0` — hito estable pre-1.0

Validación integral de paquete, browser y consumidor limpio.

## Siguiente paso

Ejecutar la validación agrupada de `0.2.4` + `0.2.5`.

Si pasa:

1. considerar `0.2.4` confirmado;
2. cerrar `0.2.5`;
3. actualizar la versión distribuible hasta `0.2.5`;
4. consolidar documentación;
5. entrar a `0.2.6`.
