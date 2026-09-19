# BITACORA

## Objetivo actual

Cerrar la auditoría independiente de `zerina-ui`, preservar únicamente los contratos vigentes y dejar `0.4.0` en un estado verificable para release.

## Estado actual

```text
versión                         0.4.0
baseline anterior               0.3.0
auditoría independiente         CERRADA
Etapas 1–6                      CERRADAS
release gate                    PASS
estado                          READY FOR RELEASE
```

La última puerta integral fue ejecutada por Fabian sobre la metadata exacta `0.4.0` y terminó en:

```text
Validation complete.
```

No existe una fase de producto pendiente derivada de esta auditoría.

## Validación observada

Comando:

```bash
pnpm validate
```

Resultado:

```text
pnpm                              10.34.5
workspace install                PASS
internal-test typecheck          PASS
Vitest                           578/578 PASS
internal-test build              PASS
Chromium                         65/65 PASS
package typecheck                PASS
build ESM/CJS/DTS                PASS
tarball                          PASS
React 18 consumer               PASS
React 19 consumer               PASS
ESM/CJS/CSS                     PASS
pack content                    PASS
git whitespace                  PASS
Validation complete.
```

El build del harness emitió el warning de Vite por chunks mayores de 500 kB. No es blocker: `internal-test` no se distribuye y `docs/DISTRIBUCION.md` documenta explícitamente que no debe introducirse code splitting artificial sólo para ocultar ese warning.

## Resultado de la auditoría

### Correctness / accesibilidad

Corregido:

- `CommandPalette`
  - IDs de opción sin las colisiones observadas del reemplazo simple por `-`;
  - `id`/`role` del listbox permanecen bajo ownership del componente;
  - opciones fuera del tab order cuando se usa `aria-activedescendant`;
  - estado disabled expuesto mediante ARIA;
  - tests de identidad, foco, selección y estado.
- `usePress`
  - un `preventDefault()` en `keyup` ya no puede impedir el cleanup de `pressed`;
  - la activación continúa siendo cancelable.

### Eventos

Corregido:

- `Select`: orden público → slot → comportamiento interno.
- `SearchInput`: orden público → slot → commit/callback de dominio.
- `Toast`
  - pause cancelable;
  - resume/cleanup no cancelable cuando debe garantizar restauración.
- `CommandPalette`: slot → commit interno con cancelación por `preventDefault()` donde no existe una prop pública equivalente.

### Controlled / uncontrolled

`useControllableValue` vuelve a ser el owner simple de source-of-truth para:

- `CommandPalette`;
- `UIViewportProvider`.

Los engines deliberadamente especializados permanecen separados.

### ReactNode presence

Se eliminaron decisiones por truthiness en consumidores confirmados donde `0` es contenido renderizable.

Incluye:

- `Wrap`;
- `Inline`;
- `withDividers`;
- Button / FloatingActionButton;
- CommandPalette;
- EmptyState;
- Alert;
- LoadingState;
- Toast;
- Progress;
- Tag;
- Avatar;
- ThemeSwitcher.

No se hicieron reemplazos globales sobre truthiness que no corresponda a `ReactNode`.

### Invariantes de slots

Protegidas después del resolver declarativo:

- `RadioGroup`: identidad, `radiogroup` y asociaciones/estados ARIA.
- `Progress`: role, value ARIA y linkage del label.

El resolver de slots sigue sin componer handlers automáticamente ni bloquear personalización que no sea una invariante real.

### Arquitectura de tests

- guards relevantes dejaron de depender de whitespace/indentation incidental;
- el sweep de controlled state ya no depende de una variable llamada literalmente `isControlled`;
- se añadieron pruebas de comportamiento para los gaps confirmados;
- los source tests que protegen boundaries/owners deliberados se mantienen.

## Diff consolidado respecto al snapshot recibido

```text
src productivo modificado         20 archivos
tests existentes modificados       8 archivos
tests nuevos                        6 archivos
residuo de workspace retirado       1 archivo (`zerina.zip`)
```

No se modificaron:

```text
package.json#version
package.json#exports
package.json#files
peer range React
entry points públicos
```

## Superficie y distribución vigentes

Entry points públicos:

```text
zerina-ui
zerina-ui/styles.css
zerina-ui/reset.css
```

Compatibilidad verificada mediante tarball real:

```text
React       18.3.1
React DOM   18.3.1

React       19.0.0
React DOM   19.0.0

TypeScript  5.9.3
skipLibCheck false
```

El tarball contiene únicamente lo permitido por `package.json#files`.

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

## Decisiones e invariantes

- `0.4.0` sigue siendo el corte correcto; no apareció un breaking change nuevo ni un cambio de superficie que justifique otra decisión semver.
- No reabrir las Etapas 1–6 sin evidencia nueva.
- No refactorizar familias sólo por similitud estructural.
- No centralizar tipos sólo porque compartan literales.
- No introducir compatibilidad histórica sin consumidor o contrato vigente.
- No usar reducción de contadores como objetivo arquitectónico.
- `pnpm validate` es la única puerta integral.
- `prepublishOnly` ejecuta `pnpm validate`.

## Incertidumbres / bloqueos

No queda un bloqueo técnico conocido de esta auditoría.

La publicación efectiva depende únicamente del flujo Git/registry y credenciales del proyecto, no de una validación pendiente del código.

## Siguiente paso

No abrir trabajo de producto por inercia.

Si el objetivo inmediato es publicar:

1. revisar el diff final y `git status`;
2. confirmar que no existen cambios locales ajenos a este ciclo;
3. crear el commit/tag de release según el flujo Git vigente;
4. publicar `0.4.0`.

Una publicación normal volverá a ejecutar `pnpm validate` mediante `prepublishOnly`.

Si la publicación se difiere, este árbol es el checkpoint canónico release-ready de `0.4.0`. Cualquier trabajo posterior debe comenzar como un ciclo nuevo y derivarse de evidencia nueva.
