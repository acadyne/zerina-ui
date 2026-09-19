# BITACORA

## Estado actual

- Versión estable candidata: `0.4.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C: **CERRADA**.
- Fase D: **CERRADA**.
- Fase E: **CERRADA**.
- Fase F: **CERRADA**.
- Hito G: **CERRADO**.
- Ciclo A–G: **CERRADO**.
- `0.3.0` permanece como baseline del ciclo.
- `0.4.0` es la versión elegida para publicar este conjunto coherente de cambios.

## Validación que cerró G

```text
Vitest completo           548/548 PASS
Chromium                    65/65 PASS
internal-test typecheck         PASS
internal-test build             PASS
package typecheck               PASS
build ESM/CJS/DTS               PASS
React 18 consumer               PASS
React 19 consumer               PASS
ESM/CJS/CSS                     PASS
pack content                    PASS
git whitespace                  PASS
Validation complete.
```

## Decisión de versión

Se elige:

```text
0.4.0
```

Razón:

- el ciclo contiene correcciones y convergencia interna compatibles;
- la topología pública de entry points no cambia;
- `src/index.ts` permanece estable respecto a `0.3.0`;
- existe una ampliación pública compatible: `mx/my` en `Inline` y `Wrap`;
- por tanto el conjunto es mayor que un patch, sin evidencia de breaking change que justifique otro tipo de corte.

## Estado estructural final

Baseline: `zerina-ui-0.3.0-final`.

```text
métrica                         0.3.0    0.4.0
TS/TSX productivos                291       305
alcanzables desde src/index.ts    291       305
huérfanos                           0         0
imports relativos TS rotos          0         0

resolveSlot files                  68        65
resolveLayeredSlot files            8         7
resolveContextualSlot files         0         7
resolveSlotLayers files             0         2

composeEventHandlers files         21        12
composeEventHandlerChain files      0         4

direct usePress calls              11         8
manual isControlled                 9         3
FloatingLayer JSX consumers         4         1
DismissableLayer JSX files          6         5
FocusScope JSX files                3         2
```

Los módulos adicionales corresponden a owners explícitos; reachability permanece completa.

## Owners transversales vigentes

```text
events
→ composeEventHandlerChain / composeEventHandlers

press
→ usePress / usePressSlotBridge

controlled simple state
→ useControllableValue

triggers
→ TriggerRuntime

floating overlays
→ FloatingOverlayRuntime

modal overlays
→ ModalOverlayRuntime

target dialogs
→ TargetDialogFrame

text controls
→ useTextControlRuntime

choice controls
→ useChoiceControlRuntime

data-table shell
→ useDataTableShell / DataTableShellFrame

navigation history
→ useNavigationEntries

app motion
→ MotionAppFrame

slot precedence
→ resolveSlotLayers / resolveContextualSlot

status labels
→ statusLabelRecipe
```

## API y distribución

Respecto a `0.3.0`:

```text
src/index.ts                     sin cambios
package.json#exports             sin cambios
package.json#files               sin cambios
react peer range                 >=18 <20
react-dom peer range             >=18 <20
framer-motion                    ^12.38.0
lucide-react                     ^0.507.0
packageManager                   pnpm@10.34.5
```

Entry points:

```text
zerina-ui
zerina-ui/styles.css
zerina-ui/reset.css
```

Cambio público compatible:

```text
Inline / Wrap
→ añaden mx / my
```

## Diferencias mantenidas deliberadamente

No son duplicación pendiente:

- BottomNavigation / NavigationRail;
- DataTableSkeleton / SkeletonTable;
- ActionDialog / ConfirmDialog;
- NavigationMenu / Tree;
- HelpText / FormErrorMessage;
- MotionPresence / MotionSwitch;
- AdaptiveScaffold controlled state;
- NavigationStack history state;
- unions iguales estructuralmente pero distintas semánticamente documentadas en `CONTRATOS.md`.

## Arquitectura de tests

```text
A — ownership boundary
B — public/API contract
C — implementation snapshot
```

Estado final:

```text
ambiguous *source.test* files    0
class C residual                 0
```

## Puerta del candidato 0.4.0

Estado observado en la nueva auditoría sobre el snapshot `zerina-ui.zip` recibido:

```text
package.json#version             0.4.0
packageManager                   pnpm@10.34.5
README.md                        presente
internal-test/                   presente
TS/TSX productivos              305
alcanzables desde src/index.ts  305
huérfanos                       0
imports relativos TS rotos      0
```

Respecto al snapshot incompleto anterior, este árbol añade `README.md` y `internal-test/` sin modificar código productivo ni metadata de paquete. El archivo raíz `zerina.zip` es una copia exacta del snapshot anterior; es residuo de workspace y queda fuera del paquete publicable por `package.json#files`.

Comprobaciones observacionales realizadas sin instalar dependencias:

- `npm pack --ignore-scripts` produce 13 entradas: `package.json`, `README.md`, `LICENSE` y `dist/*`; no incluye `src`, `internal-test`, `docs`, `scripts`, `BITACORA.md`, lockfile ni el ZIP anidado.
- Los source maps ESM/CJS/CSS corresponden al source actual. `GridItem.tsx` sólo difiere en finales de línea CRLF/LF dentro del source map; normalizando EOL el contenido es idéntico.
- `node --check` pasa para `dist/index.js`, `dist/index.cjs`, `scripts/validate.mjs` y `scripts/verify-package.mjs`.

No validado todavía:

```text
pnpm validate
```

La puerta integral no pudo ejecutarse en el entorno de auditoría porque `pnpm@10.34.5` no está disponible localmente y Corepack intenta descargarlo desde `registry.npmjs.org`, acceso de red no disponible en este sandbox. Esto es una limitación del entorno de auditoría; no constituye evidencia de fallo de producto.

Antes de publicar `0.4.0`, debe observarse sobre esta metadata exacta:

```bash
pnpm validate
```

con resultado final:

```text
Validation complete.
```

No reutilizar los conteos de la corrida que cerró G como si pertenecieran a esta puerta.

## Auditoría independiente actual

### Objetivo

Auditar el árbol real antes de modificar producto y, sólo después de cerrar la auditoría, producir un plan de cambios por etapas basado en evidencia.

### Scope vigente

- superficie pública y distribución;
- reachability y residuos;
- contratos transversales;
- familias productivas;
- arquitectura y cobertura de tests;
- coherencia entre documentación y realidad.

Fuera de scope durante esta auditoría:

- refactors preventivos;
- features;
- cambios de API;
- cambios de versión;
- modificaciones productivas antes de cerrar el mapa de hallazgos.

### Hechos confirmados hasta ahora

**Baseline / distribución**

- `305/305` módulos TS/TSX productivos son alcanzables desde `src/index.ts`.
- `0` módulos productivos huérfanos.
- `0` imports relativos TS rotos observados.
- La superficie de paquete continúa limitada a `zerina-ui`, `zerina-ui/styles.css` y `zerina-ui/reset.css`.
- El tarball observacional excluye source, tests, docs, scripts, bitácora y ZIPs de workspace.
- No se observó drift de `dist` respecto al source; la diferencia aparente de `GridItem.tsx` era únicamente CRLF/LF.

**Controlled / uncontrolled**

El contrato documentado asigna la fuente de verdad simple a `useControllableValue`, pero existen dos implementaciones manuales adicionales no declaradas como excepciones:

- `src/patterns/command/CommandPalette.tsx`
  - `useState(defaultValue)`;
  - `value ?? internalValue`;
  - escritura interna condicionada por `value === undefined`.
- `src/core/viewport/UIViewportProvider.tsx`
  - `isModeControlled = mode !== undefined`;
  - `useState(defaultMode)`;
  - `currentMode = isModeControlled ? mode : internalMode`;
  - escritura interna condicionada por `isModeControlled`.

El test `architecture-phase-f-sweep.test.ts` no detecta estas bifurcaciones porque sólo busca una variable llamada literalmente `isControlled`.

**Presencia de ReactNode**

El owner documentado es `core/react/nodePresence.ts`, donde `0` es renderizable y los booleanos no lo son. Persisten decisiones por truthiness fuera del owner.

Se observaron al menos 26 props/ramas `ReactNode` afectadas en 12 archivos, incluyendo:

- Button: `leftIcon`, `rightIcon`;
- FloatingActionButton: `icon` y label extendido;
- CommandPalette / CommandTrigger: icon/description/shortcut;
- EmptyState;
- Alert;
- LoadingState;
- Toast;
- Progress;
- Tag;
- Avatar;
- ThemeSwitcher;
- `withDividers`.

Además:

- `withDividers` usa `React.Children.toArray(children).filter(Boolean)`;
- `Wrap` usa el mismo patrón.

Esto elimina contenido numérico `0` antes de renderizarlo y contradice el owner transversal vigente.

**Eventos**

- `Select` compone `slotOnFocus -> onFocus`, `slotOnBlur -> onBlur` y `slotOnChange -> onChange`, en dirección inversa al contrato `prop pública -> slot -> internal`.
- `SearchInput` compone el input principal como `slot -> internal/onValueChange -> onChange público`; el test actual incluso fija el orden `["slot", "value", "direct"]`.
- `CommandPalette` actualiza búsqueda antes de notificar `slotProps.input.onChange`; no existe test de comportamiento propio para este componente.
- `Toast` compone manualmente handlers raíz `public -> slot -> internal`, pero no aplica la regla progresiva de `defaultPrevented`.
- En `usePress`, `onKeyUp` usa composición cancelable normal aunque `internalKeyUp` también libera `pressed` y `keyboardActivationRef`. Si una capa externa cancela el `keyup`, la función de cleanup interna no se ejecuta. La reproducción runtime dirigida queda pendiente, pero la ruta estructural está confirmada.

**CommandPalette / ARIA**

- `getCommandPaletteDomId` reemplaza todo carácter no `[a-zA-Z0-9_-]` por `-`; IDs distintos como `a/b` y `a?b` producen el mismo DOM id.
- `listSlot` permite reemplazar el `id`/`role` base mediante `slotProps.list`, mientras el input conserva `aria-controls={listId}` calculado internamente. Un override de `id` puede dejar una asociación ARIA apuntando a un id inexistente.
- No se encontraron tests de comportamiento de `CommandPalette`; su única referencia de test actual es de ownership/equivalencia de tipos.

**Arquitectura de tests**

La afirmación previa `class C residual = 0` no está completamente respaldada por la suite actual:

- existen 26 tests que leen source directamente;
- varios son guards de ownership válidos;
- pero persisten aserciones dependientes de formato exacto, por ejemplo `indexOf("composeEventHandlers(\n ...")` y aliases con saltos de línea exactos;
- el sweep de F verifica que no existan filenames `source.test`, no que no existan snapshots sintácticos;
- el guard de controlled ownership depende del nombre exacto `isControlled` y deja pasar implementaciones equivalentes con otra forma sintáctica.

### Owners estructurales sin drift nuevo observado

El inventario actual conserva, sin nuevos consumidores paralelos detectados:

- `TriggerRuntime`;
- `FloatingOverlayRuntime`;
- `ModalOverlayRuntime`;
- `useTextControlRuntime` para Input/Textarea;
- `useChoiceControlRuntime` para Checkbox/Radio/Switch;
- `DataTableShellFrame` / `useDataTableShell`;
- `useNavigationEntries`;
- `MotionAppFrame`;
- `TargetDialogFrame`;
- `statusLabelRecipe`.

Esto no equivale a validación runtime, pero no apareció una segunda implementación estructural de esos owners en el sweep estático.

### Auditoría por etapas — corte consolidado

No se ha modificado código productivo durante esta auditoría.

#### A — correctness / accesibilidad

Hallazgos confirmados por inspección estructural:

- `CommandPalette`
  - `slotProps.list` puede reemplazar `id` y `role` del listbox aunque el input fija `aria-controls` al `listId` interno;
  - `getCommandPaletteDomId` no es inyectivo: `a/b` y `a?b` colisionan;
  - las opciones son `<button role="option">` sin `tabIndex={-1}` mientras el combobox usa `aria-activedescendant`; por tanto quedan focos adicionales dentro del patrón de listbox;
  - `id`, `role` y asociaciones ARIA necesitan quedar en el owner semántico, no en overrides libres.
- `RadioGroup`
  - `id`, `role="radiogroup"` y estados/asociaciones ARIA se colocan únicamente en `baseProps` de `resolveSlot`; `slotProps.root` puede reemplazarlos.
- `Progress`
  - `role="progressbar"` y `aria-valuemin/max/now` permanecen sobreescribibles desde `slotProps.root`;
  - `label={0}` no materializa label ni `aria-labelledby`.
- `usePress`
  - `internalKeyUp` realiza cleanup de `pressed`/`keyboardActivationRef`, pero la composición externa de `onKeyUp` es cancelable; un `preventDefault()` externo impide el cleanup completo;
  - la solución no puede ser sólo `checkDefaultPrevented:false`: el cleanup debe ejecutarse siempre, pero la activación de Space debe seguir siendo cancelable.

No se encontró cobertura de comportamiento de `CommandPalette` ni `Progress` que proteja estos contratos.

#### B — contratos transversales

**Eventos**

- `Select` usa orden `slot -> public` en focus/blur/change, inverso al contrato vigente.
- `SearchInput` usa `slot -> internal/onValueChange -> public onChange`; existe un test que fija explícitamente ese orden incorrecto.
- `Toast` usa composición manual `public -> slot -> internal` sin cancelación progresiva. Pointer/focus de entrada y cleanup de salida deben distinguir política cancelable vs cleanup obligatorio.

**Controlled/uncontrolled**

Implementaciones simples paralelas al owner `useControllableValue`:

- `CommandPalette` para `value/defaultValue`;
- `UIViewportProvider` para `mode/defaultMode`.

No se observó diferencia de dominio que requiera un segundo owner para la capa de source-of-truth. `AdaptiveScaffold`, `useNavigationEntries` y engines complejos continúan siendo excepciones deliberadas.

**ReactNode presence**

Violaciones confirmadas del owner `nodePresence.ts`:

- `Wrap` y `withDividers` eliminan `0` mediante `filter(Boolean)`;
- `Progress`, `Alert`, `Toast`, `LoadingState`, `EmptyState`, Button icons, CommandPalette item adornments y otros branches usan truthiness sobre props `ReactNode`;
- `Inline` hereda el problema de `withDividers`, y además decide `gap` mediante truthiness de `divider`.

El cambio debe hacerse por contrato de presencia, no mediante sustituciones indiscriminadas de todos los booleanos del repositorio.

#### C — familias / ownership

Sweep estructural sin nuevo owner paralelo observado en:

- `TriggerRuntime`;
- `FloatingOverlayRuntime`;
- `ModalOverlayRuntime`;
- `useTextControlRuntime`;
- `useChoiceControlRuntime`;
- `DataTableShellFrame` / `useDataTableShell`;
- `useNavigationEntries`;
- `MotionAppFrame`;
- `TargetDialogFrame`;
- `statusLabelRecipe`.

Consumidores observados continúan coincidiendo con las familias documentadas. No se justifica reabrir BottomNavigation/NavigationRail, DataTableSkeleton/SkeletonTable, ActionDialog/ConfirmDialog, NavigationMenu/Tree, HelpText/FormErrorMessage ni MotionPresence/MotionSwitch por similitud estructural solamente.

#### D — superficie / distribución

Sin drift estático observado:

- `src/index.ts` mantiene la topología pública esperada;
- `package.json#exports` sigue limitado a raíz JS/TS, `styles.css` y `reset.css`;
- el tarball observacional contiene sólo `package.json`, `README.md`, `LICENSE` y `dist/*`;
- `src`, tests, docs, scripts, bitácora y ZIPs del workspace quedan fuera;
- `dist` corresponde al source incluido; la única diferencia detectada en source maps fue CRLF/LF de `GridItem.tsx`;
- React peer range sigue `>=18 <20`.

`validate.sh` no tiene consumidor vigente encontrado y ejecuta una puerta más débil que `scripts/validate.mjs`; queda como residuo P3 candidato.

La validación integral de `0.4.0` sigue pendiente porque el sandbox no puede obtener `pnpm@10.34.5`.

#### E — arquitectura de tests

Gaps confirmados:

- no hay comportamiento dirigido de `CommandPalette`;
- no hay comportamiento dirigido de `Progress`;
- `UIViewportProvider` sólo aparece en contrato de superficie, no en comportamiento controlled/uncontrolled;
- no existe test `keyup + preventDefault` para cleanup de `usePress`;
- `SearchInput` protege actualmente un orden de eventos contrario al contrato transversal;
- el guard de controlled ownership busca literalmente una variable `isControlled` y no detecta implementaciones equivalentes;
- existen al menos 13 aserciones de ownership que dependen de saltos de línea/formato exacto en dos archivos de tests.

Los source tests que protegen boundaries/owners siguen siendo válidos; sólo deben reemplazarse los que protegen forma textual incidental.

### Clasificación consolidada

```text
P0 — CommandPalette: asociaciones ARIA/IDs + patrón de foco listbox/combobox.
P0 — usePress: keyup cancelado puede impedir cleanup de estado.
P1 — Select/SearchInput/Toast: orden y cancelación de eventos divergentes.
P1 — CommandPalette/UIViewportProvider: owners paralelos de controlled state simple.
P1 — RadioGroup/Progress: invariantes semánticas sobreescribibles desde slots.
P1/P2 — ReactNode presence: pérdida de 0 y ramas inconsistentes.
P2 — cobertura faltante y tests de ownership demasiado sintácticos.
P3 — validate.sh sin consumidor vigente; zerina.zip como residuo de workspace.
```

### Plan de cambios por etapas

#### Etapa 1 — correctness y accesibilidad crítica

Scope:

- corregir `CommandPalette`:
  - IDs de opción sin colisiones;
  - `listId`/`role` como invariantes;
  - foco de opciones coherente con `aria-activedescendant`;
  - tests de comportamiento ARIA/foco/selección;
- corregir `usePress`:
  - cleanup de keyup no cancelable;
  - activación de Space todavía cancelable;
  - tests de regresión con `preventDefault()`.

Fuera de scope:

- refactors de familias;
- API nueva;
- cambios de versión.

Cierre:

- tests dirigidos nuevos;
- suites relacionadas;
- `pnpm validate`.

#### Etapa 2 — coherencia de eventos

Scope:

- `Select`: `public -> slot -> internal`;
- `SearchInput`: `public event -> slot -> internal/domain callback`;
- `Toast`: composición mediante owners canónicos, distinguiendo eventos cancelables y cleanup.

Cierre:

- tests de orden;
- tests de `preventDefault`;
- `pnpm validate`.

#### Etapa 3 — estado simple + presencia semántica

Scope:

- migrar `CommandPalette` y `UIViewportProvider` a `useControllableValue` sólo para source-of-truth;
- conservar callbacks y política de dominio en cada consumidor;
- migrar branches `ReactNode` confirmados a `hasRenderableNode` / `hasNonEmptyRenderableNode`;
- eliminar `filter(Boolean)` que destruye `0` en layout/dividers.

Cierre:

- controlled/uncontrolled behavior;
- `0`, `""`, boolean, null/undefined según contrato;
- `pnpm validate`.

#### Etapa 4 — invariantes de slots

Scope:

- `RadioGroup` y `Progress` primero;
- sweep dirigido de roles, IDs y enlaces ARIA puestos únicamente en `baseProps`;
- sólo proteger atributos que sean invariantes reales; no quitar personalización legítima.

Cierre:

- tests que intenten override desde `slotProps` y prueben que la invariante permanece;
- `pnpm validate`.

#### Etapa 5 — arquitectura de tests

Scope:

- reemplazar guards dependientes de formato por guards de ownership/behavior;
- corregir el guard de controlled state;
- añadir cobertura de CommandPalette, Progress y UIViewportProvider;
- no convertir tests de source válidos en snapshots de implementación.

Cierre:

- ninguna aserción nueva depende de whitespace/posición textual sin razón semántica;
- `pnpm validate`.

#### Etapa 6 — cleanup y release

Scope:

- decidir/remover `validate.sh` si continúa sin consumidor;
- retirar residuos de workspace que no tengan función operativa;
- actualizar contratos/docs sólo según cambios realmente hechos;
- ejecutar puerta exacta de `0.4.0`.

Cierre de release:

```text
pnpm validate
→ Validation complete.
```

Registrar los counts reales de esa corrida; no reutilizar los de G.

### Etapa 1 — estado de implementación

Implementado sin ampliar scope:

- `src/patterns/command/CommandPalette.tsx`
  - IDs de opción derivados mediante `encodeURIComponent`, evitando las colisiones observadas del reemplazo por `-`;
  - `listId` y `role="listbox"` se reaplican después de `listSlot`, por lo que `slotProps.list` ya no puede romper el enlace `aria-controls`;
  - las opciones `role="option"` quedan fuera del tab order mediante `tabIndex={-1}`;
  - las opciones disabled exponen además `aria-disabled`.
- `src/core/interaction/press/usePress.ts`
  - `onKeyUp` permite que el cleanup interno ejecute aunque una capa externa haya llamado `preventDefault()`;
  - `internalKeyUp` limpia `pressed` y `keyboardActivationRef` antes de consultar `defaultPrevented`;
  - si el evento fue cancelado, no continúa hacia la activación de Space.

Pruebas nuevas:

- `internal-test/tests/command-palette-behavior.test.tsx`
  - identidad/listbox invariant;
  - IDs distintos para `a/b` y `a?b`;
  - enlace `aria-controls` / `aria-activedescendant`;
  - opciones fuera del tab order;
  - selección por teclado;
  - estado disabled.
- `internal-test/tests/interaction-use-press-keyup-cleanup.test.tsx`
  - `preventDefault()` público en keyup: cleanup sí, slot posterior no, activación no;
  - `preventDefault()` de slot en keyup: cleanup sí, activación no.

Control de scope observado:

```text
src productivo modificado:
- src/core/interaction/press/usePress.ts
- src/patterns/command/CommandPalette.tsx

tests añadidos:
- internal-test/tests/command-palette-behavior.test.tsx
- internal-test/tests/interaction-use-press-keyup-cleanup.test.tsx

version:
0.4.0 sin cambios
```

No se ha modificado Etapa 2 ni posteriores.

### Validación de Etapa 1

Pendiente:

```text
pnpm validate
```

No puede ejecutarse en el sandbox de auditoría porque Corepack necesita obtener `pnpm@10.34.5` desde npm y la red está bloqueada.

Etapa 1 está **implementada pero no cerrada**. No iniciar Etapa 2 como fase cerrada hasta observar `Validation complete.` o corregir cualquier fallo real de esta candidata.

### Siguiente paso

Entregar la candidata de Etapa 1 para ejecutar `pnpm validate` sobre un entorno con `pnpm@10.34.5`. Si pasa, consolidar Etapa 1 como cerrada y continuar con Etapa 2 — coherencia de eventos. Si falla, clasificar el primer fallo antes de ampliar scope.

### Etapa 2 — estado de implementación

Implementado sobre la candidata de Etapa 1, sin modificar API pública ni versión:

- `src/primitives/forms/Select.tsx`
  - focus/blur/change pasan de `slot -> public` a `public -> slot`;
  - `useFocusVisible` continúa siendo el owner de la conducta interna de foco;
  - `preventDefault()` público detiene la capa de slot y, para focus, la conducta interna cancelable.
- `src/primitives/forms/SearchInput.tsx`
  - el input principal usa `composeEventHandlerChain`;
  - orden vigente: `onChange público -> slotProps.input.onChange -> commit/onValueChange`;
  - `preventDefault()` en público o slot detiene las capas posteriores;
  - la acción `clearButton` conserva su contrato específico `slot -> internal` porque no existe una prop pública de evento equivalente para esa acción.
- `src/components/feedback/Toast.tsx`
  - pointer enter / focus capture usan cadena progresivamente cancelable `public -> slot -> pause`;
  - pointer leave / blur capture usan `composeEventHandlers(..., { checkDefaultPrevented: false })` para garantizar cleanup `public -> slot -> resume` incluso si una capa externa cancela;
  - no se cambió el engine `usePress` del botón de cierre.

Pruebas:

- nuevo `internal-test/tests/event-consumer-contract.test.tsx`
  - orden y cancelación de Select;
  - orden y cancelación de SearchInput;
  - pause de Toast cancelable;
  - resume de Toast no cancelable para pointer/focus.
- `forms-block5-behavior.test.tsx`
  - expectativa de SearchInput actualizada al contrato `direct -> slot -> value`.
- `forms-block5-architecture-contract.test.ts`
  - guard temporal actualizado al nuevo owner/orden; su dependencia de source sigue reservada para Etapa 5.

Comprobación disponible en el sandbox:

```text
TypeScript parser sobre todos los archivos modificados  PASS
contratos estáticos de orden/owner                         PASS
```

No ejecutado:

```text
Vitest
Chromium
typecheck semántico
pnpm validate
```

Motivo: dependencias no instaladas y `pnpm@10.34.5` no disponible localmente; Corepack requiere red.

Etapa 2 está **implementada pero no cerrada**.

### Etapa 3 — estado de implementación

Implementado sobre el checkpoint de Etapa 2, sin cambiar API pública ni versión:

**Controlled/uncontrolled simple**

- `CommandPalette` usa `useControllableValue<string>` como único owner de `value/defaultValue`;
  - el componente conserva `onValueChange` como política de dominio;
  - en modo controlado la intención se reporta pero el valor público continúa siendo la fuente de verdad.
- `UIViewportProvider` usa `useControllableValue<UIViewportMode>` para `mode/defaultMode`;
  - `setMode` conserva callbacks y resolución de acciones;
  - `densityMode` no se mezcló con este cambio porque no posee el mismo engine de escritura.

**ReactNode presence**

- `Wrap` y `withDividers` ya no eliminan `0` mediante `filter(Boolean)`;
- `Inline` decide la presencia de divider mediante `hasRenderableNode`, por lo que `divider={0}` es contenido válido y desactiva el gap CSS;
- ramas confirmadas de `Button`, `FloatingActionButton`, `CommandPalette`, `EmptyState`, `Alert`, `LoadingState`, `Toast`, `Progress`, `Tag`, `Avatar` y `ThemeSwitcher` usan `hasRenderableNode` o `hasNonEmptyRenderableNode` según si `""` debe crear estructura;
- no se hicieron sustituciones globales de truthiness: `filter(Boolean)` que opera sobre class names, handlers o valores no-ReactNode permanece intacto.

Pruebas añadidas/extendidas:

- `command-palette-behavior.test.tsx`
  - comportamiento uncontrolled;
  - comportamiento controlled con callback de intención y valor público estable.
- `viewport-controllable-behavior.test.tsx`
  - cambio de mode uncontrolled;
  - mode controlado no muta internamente pero reporta intención.
- `node-presence-consumers.test.tsx`
  - `Wrap` conserva `0`;
  - `Inline divider={0}` conserva contenido y no usa gap;
  - `Progress label={0}` conserva asociación semántica;
  - `Progress label=""` no crea asociación vacía;
  - adornments/feedback conservan `0`.
- `forms-phase-b4-ownership.test.ts`
  - `CommandPalette` y `UIViewportProvider` quedan incluidos entre consumidores del owner compartido.

Comprobación disponible en el sandbox:

```text
TypeScript parser sobre src + tests (385 archivos)  PASS
sweep de owners manuales                            sin nuevo owner simple confirmado
scope vs checkpoint Etapa 2                         19 archivos; sólo Etapa 3 + tests
```

No ejecutado:

```text
Vitest
Chromium
typecheck semántico
pnpm validate
```

Motivo vigente: el sandbox no dispone de las dependencias instaladas ni de `pnpm@10.34.5` local, y Corepack requiere red.

Etapa 3 está **implementada pero no cerrada**.

### Etapa 2.1 — residual de eventos de CommandPalette

Estado observado en el árbol actual:

- `CommandPalette` compone `slotProps.input.onChange -> internal search commit` mediante `composeEventHandlerChain`;
- `preventDefault()` del slot cancela el commit interno;
- existen pruebas dirigidas de orden y cancelación en `command-palette-behavior.test.tsx`.

El residual registrado anteriormente ya no está vigente. Etapa 2.1 queda **implementada**; su cierre integrado continúa dependiendo de `pnpm validate`.

### Etapa 4 — invariantes semánticas de slots

Implementado sin ampliar la política global del resolver:

- `RadioGroup`
  - `id`, `role="radiogroup"` y asociaciones/estados ARIA derivados de `useFieldControl` se reaplican después de `rootSlot`;
  - `slotProps.root` conserva personalización visual/auxiliar pero no puede reemplazar esas invariantes.
- `Progress`
  - `role="progressbar"` y `aria-valuemin/max/now` se reaplican después de `rootSlot`;
  - cuando existe `label`, `aria-labelledby` apunta al id generado por el componente y `slotProps.label.id` no puede romper la asociación;
  - en modo indeterminate los atributos de valor permanecen ausentes aunque el slot intente introducirlos.

Prueba nueva:

- `internal-test/tests/slot-semantic-invariants.test.tsx`
  - intenta sobreescribir las invariantes de `RadioGroup`;
  - intenta sobreescribir role/value/linkage de `Progress`;
  - verifica ausencia de value ARIA en `Progress` indeterminate.

Sweep dirigido:

- `ModalOverlayRuntime` ya reaplica `role`, `aria-modal`, `aria-labelledby` y `aria-describedby` después de los slots;
- no se confirmó otro caso equivalente que justifique ampliar Etapa 4 por contador.

Etapa 4 está **implementada pero no cerrada** hasta validación integrada.

### Etapa 5 — arquitectura de tests

Cambios realizados:

- `semantics-phase-e1-slot-precedence-ownership.test.ts`
  - guards de composición de eventos ya no dependen de saltos de línea exactos.
- `semantics-phase-e4-type-equivalence-ownership.test.ts`
  - aliases semánticos se verifican con patrones tolerantes a whitespace.
- `semantics-phase-e3-status-label-recipe-ownership.test.ts`
  - ownership de densidad se comprueba sobre source normalizado en lugar de formato exacto.
- `state-phase-d3-motion-frame-ownership.test.ts`
  - default de `motionKey` ya no depende de indentation exacta.
- `architecture-phase-f-sweep.test.ts`
  - se retiró el detector basado en una variable llamada literalmente `isControlled`;
  - ahora comprueba consumidores simples explícitos del owner compartido y engines especializados deliberados.

Se mantienen source tests cuando protegen ownership/boundaries; sólo se retiró sensibilidad incidental a whitespace/nombres locales.

Etapa 5 está **implementada pero no cerrada** hasta validación integrada.

### Etapa 6 — cleanup / docs / release candidate

Estado:

- `package.json#version` permanece `0.4.0`;
- no se añadió ni retiró API pública;
- `scripts/validate.sh` no existe en el árbol actual, por lo que el hallazgo histórico sobre ese archivo queda descartado;
- el `zerina.zip` anidado del snapshot anterior fue retirado del workspace candidato;
- `docs/CONTRATOS.md` ya expresa la regla vigente de invariantes internas, por lo que no requiere una nueva política documental para Etapa 4;
- no se actualizaron counts de validación ni se declaró release listo.

Comprobación disponible en este entorno:

```text
TypeScript transpile/parser sweep
src + internal-test/tests
386 archivos
syntax failures: 0
```

No ejecutado:

```text
Vitest
Chromium
typecheck semántico
build/package verify
pnpm validate
```

Motivo: `pnpm@10.34.5` y dependencias no están disponibles localmente; Corepack requiere acceso de red bloqueado en el sandbox.

### Última validación observada

Fabian ejecutó sobre el candidato corregido:

```bash
pnpm validate
```

Entorno y avance observado:

```text
pnpm 10.34.5
workspace install                         PASS
internal-test typecheck                  PASS
internal-test Vitest                     FAIL
```

Vitest observado:

```text
Test Files  1 failed | 77 passed (78)
Tests       1 failed | 577 passed (578)
```

Único fallo:

```text
internal-test/tests/command-palette-behavior.test.tsx
"keeps keyboard focus on the combobox while selecting the active option"
```

Evidencia:

- al momento de la primera aserción `document.activeElement` seguía siendo `body`;
- `CommandPalette` entrega `initialFocusRef={inputRef}` a `Dialog`;
- `FocusScope` realiza autofocus en un `requestAnimationFrame`, no de forma síncrona durante el render;
- la prueba pretendía verificar que la navegación/selección conserva el foco en el combobox, pero estaba mezclando ese contrato con el timing asincrónico del autofocus modal.

Clasificación:

- fallo introducido por la prueba nueva;
- no hay evidencia de fallo de producto en este punto;
- la corrida llegó hasta Vitest y se detuvo allí; Chromium/browser suites, build y package verify posteriores de esa corrida no deben considerarse validados.

Corrección aplicada:

- `command-palette-behavior.test.tsx` ahora enfoca explícitamente el combobox mediante `input.focus()` dentro de `act()` antes de ejecutar ArrowDown/Enter;
- se mantiene la aserción posterior que exige que la navegación/selección no desplace el foco;
- no se modificó `CommandPalette`, `Dialog`, `FocusScope` ni otra parte de producto.

### Estado operativo actual

```text
Etapa 1    implementada, pendiente revalidate
Etapa 2    implementada, pendiente revalidate
Etapa 2.1  implementada, pendiente revalidate
Etapa 3    implementada, pendiente revalidate
Etapa 4    implementada, pendiente revalidate
Etapa 5    implementada, pendiente revalidate
Etapa 6    candidata corregida, pendiente revalidate
```

Ninguna etapa queda cerrada todavía.

### Siguiente paso

Reejecutar sobre este árbol corregido:

```bash
pnpm validate
```

Criterio de cierre:

```text
Validation complete.
```

Si vuelve a fallar, registrar el primer fallo real y corregir únicamente su causa antes de ampliar scope. Si pasa, registrar counts reales, cerrar Etapas 1–6 y reevaluar `0.4.0` como release listo sin cambiar versión automáticamente.
