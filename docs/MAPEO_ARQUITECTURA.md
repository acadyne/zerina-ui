# Mapeo arquitectónico — ciclo posterior a 0.3.0

## Propósito

Este documento no propone refactors por similitud visual.

Busca lugares donde una misma decisión semántica puede divergir porque existe más de un owner o porque familias equivalentes mantienen mecánica paralela.

Baseline:

```text
zerina-ui 0.3.0
Vitest     393/393
Chromium    65/65
React 18 consumer PASS
React 19 consumer PASS
```

Durante este mapeo no se modifica código de producto.

## Método

Cada candidato se clasifica por:

- **owner actual**;
- **consumidores**;
- **contrato observable**;
- **diferencias legítimas**;
- **diferencias accidentales**;
- **riesgo de divergencia**;
- **acción propuesta**.

Acciones posibles:

```text
MANTENER SEPARADO
COMPARTIR HELPER
COMPARTIR ENGINE
FUSIONAR
ELIMINAR
INVESTIGAR
```

La prioridad conceptual es:

```text
impacto × duplicación × riesgo de divergencia × frecuencia de cambio
```

---

## Estado de Fase A

**CERRADA**

Cambios realizados:

- `targetDialogContract.ts` es owner único de target presence/renderables;
- `TargetFormDialog` ya no usa truthiness;
- `FormDialog` posee cancel + close exactamente una vez;
- dialogs usan `nodePresence` para ReactNode opcional;
- `composeEventHandlerChain` es owner de cancelación progresiva;
- TriggerRuntime y Menu delegan en el mismo owner;
- se añadieron tests de comportamiento y matriz de cancelación.

Decisión deliberada:

`FormDialog` no se fusiona con `TargetDialogFrame`. El `<form>` debe envolver header/body/footer para preservar submit nativo y `formProps`; compartir el contrato semántico es suficiente.

Pendiente:

- typecheck real del workspace;
- tests dirigidos;
- Chromium/integración mediante `pnpm validate`.

---

# P0 — inconsistencias de contrato / correctness

## P0.1 — TargetFormDialog bifurca el contrato de target

### Evidencia

`TargetDialogFrame` y los diálogos de acción actuales usan:

```ts
target !== null
```

como definición de presencia de target.

`TargetFormDialog` mantiene otra implementación local:

```ts
return target ? fn(target) : null;
```

y además:

```ts
if (!target) {
  return;
}

disabled={disabled || !target}
```

Esto vuelve a rechazar targets válidos como:

```text
0
""
false
```

Es la misma clase de bug que ya se corrigió en ActionDialog/ConfirmDialog.

### Segunda bifurcación en el mismo componente

`TargetFormDialog` entrega a `FormDialog`:

- `onCancel={handleCancel}`
- `onOpenChange={handleDialogOpenChange}`

`FormDialog.handleCancel` ejecuta primero `onCancel()` y después `onOpenChange(false)`.

Pero el `handleCancel` de TargetFormDialog ya ejecuta:

```text
onCancel(target)
→ onOpenChange(false)
```

y su `handleDialogOpenChange(false)` vuelve a ejecutar:

```text
onCancel(target)
→ onOpenChange(false)
```

Por inspección del camino de código, el botón Cancel puede duplicar ambos callbacks.

### Cobertura

No existe actualmente ningún test del harness que mencione:

- `TargetFormDialog`
- `FormDialog`

### Clasificación

**RESUELTO EN FASE A**

### Acción

**COMPARTIR ENGINE / FRAME**

No parchear sólo `!target`.

Primero definir un único contrato para:

- presencia de target;
- submit;
- cancel;
- close;
- renderables dependientes de target;
- frame visual de form dialog.

---

## P0.2 — Menu y TriggerRuntime tienen reglas distintas de cancelación

### TriggerRuntime

Contrato actual:

```text
child
→ slot local
→ slot heredado
→ interno
```

Después de cada capa:

```text
defaultPrevented
→ detener la cadena
```

### Menu

`composeMenuExternalHandlers` documenta explícitamente otra regla:

```text
prop pública
→ slot local
→ slot contexto
```

pero ejecuta **todas las capas externas**, incluso cuando una anterior llama `preventDefault()`.

Sólo la conducta interna posterior queda cancelada.

### Riesgo

Dos triggers/interacciones visualmente equivalentes pueden dar significados diferentes a:

```ts
event.preventDefault()
```

según la familia que los implemente.

No existe hoy un test específico que fije la semántica de `composeMenuExternalHandlers`.

### Clasificación

**RESUELTO EN FASE A**

### Acción

**INVESTIGAR → UNIFICAR CONTRATO**

Antes de cambiar código, decidir explícitamente si `preventDefault()`:

1. cancela sólo conducta interna, o
2. cancela también capas externas posteriores.

La decisión debe ser transversal.

---

## P0.3 — presencia de ReactNode volvió a bifurcarse en dialogs

Existe un owner central:

```text
core/react/nodePresence.ts
```

Sin embargo `TargetDialogFrame` y `FormDialog` mantienen truthiness directa:

```tsx
resolvedDescription || resolvedTargetLabel
resolvedTargetLabel ? ...
resolvedFooter ? resolvedFooter : defaultFooter
error ? ...
```

Esto no equivale al contrato de `hasRenderableNode`.

Ejemplo:

```text
0
```

es ReactNode renderizable pero falsy.

### Clasificación

**RESUELTO EN FASE A**

### Acción

**COMPARTIR HELPER**

Primero dialogs; después auditar otros ReactNode opcionales por intención semántica. No reemplazar todos los `if (children)` mecánicamente.

---

# P1 — duplicación estructural con alto retorno

## P1.1 — Input / Textarea

### Evidencia

Comparación normalizada:

```text
Input       ~302 líneas lógicas
Textarea    ~294 líneas lógicas
similaridad ~0.876
261 líneas normalizadas coincidentes
```

Comparten:

- `useFieldControl`;
- estado de InputGroup descendant;
- `useFocusVisible`;
- slots;
- handlers;
- ARIA;
- estados disabled/invalid/readOnly/required;
- data attributes;
- composición de eventos.

Diferencias reales:

- elemento nativo;
- `type`;
- `resize`;
- padding/layout específicos.

### Clasificación

**DUPLICACIÓN REAL**

### Acción

**COMPARTIR ENGINE**

Candidato:

```text
useTextControlRuntime
```

o un frame interno equivalente.

Input y Textarea deben seguir siendo componentes públicos distintos.

---

## P1.2 — Checkbox / Radio / Switch

### Evidencia

Comparación normalizada:

```text
Checkbox ↔ Radio   ~0.842
Checkbox ↔ Switch  ~0.826
```

Cientos de líneas coinciden.

Ya comparten:

- `useChoiceControl`;
- `ChoiceControlRoot`.

Todavía duplican:

- composición de eventos;
- resolución root/input;
- label;
- IDs y ARIA;
- data attributes;
- estado visual;
- wiring hacia input nativo.

Diferencias reales:

- Checkbox: indeterminate/mark;
- Radio: integración con RadioGroup;
- Switch: role switch + track/thumb.

### Clasificación

**DUPLICACIÓN REAL DESPUÉS DEL ENGINE ACTUAL**

### Acción

**COMPARTIR ENGINE / FRAME**

No fusionar componentes públicos.

---

## P1.3 — Button / IconButton / Pressable / Card

### Evidencia

`Button`, `IconButton` y `Pressable` repiten el bridge de:

```text
slot event handlers
→ composeEventHandlers
→ usePress
→ cleanup/cancellation flags
```

`Card` implementa una variante muy similar.

Comparación normalizada:

```text
Button ↔ IconButton ~0.649
```

La similitud textual no cuenta toda la duplicación porque cambia el markup, pero la mecánica de eventos es la misma.

### Riesgo

Si cambia una regla de:

- pointer cleanup;
- keyboard;
- click;
- focus;
- cancellation;

hay varios owners que deben actualizarse correctamente.

### Acción

**COMPARTIR HELPER / HOOK**

Candidato:

```text
usePressWithSlotHandlers
```

No crear un “ButtonBase” público.

---

## P1.4 — Popover / Tooltip mantienen un trigger runtime paralelo

Ambos usan:

```text
primitives/overlay/triggerProps.ts
→ mergeTriggerProps
```

Mientras:

- MenuTrigger;
- CollapsibleTrigger;

usan `core/interaction/trigger/TriggerRuntime`.

PopoverTrigger y TooltipTrigger tienen prácticamente la misma forma pública:

- `asChild`;
- children;
- className;
- style;
- styles;
- slotProps.

Duplican:

- refs;
- cloneElement;
- fallback `<button>`;
- merge class/style;
- composición child/slot;
- ownership ARIA.

### Diferencia real

Tooltip necesita eventos internos adicionales:

- pointer enter/leave;
- focus/blur;
- touch timing.

El TriggerRuntime actual no modela todavía todo ese vector.

### Acción

**COMPARTIR ENGINE**

Extender el runtime sólo si puede expresar esas diferencias sin convertirlo en un objeto genérico opaco.

Objetivo posterior:

```text
retirar triggerProps.ts
```

si deja de tener consumidores.

---

## P1.5 — runtime de overlays flotantes repetido

Aparecen cuatro owners de `FloatingLayer`:

- MenuContent;
- Popover;
- Tooltip;
- NavigationMenuPanel.

Tres owners de dismiss/focus relacionados:

- MenuContent;
- Popover;
- NavigationMenuPanel;

Tooltip implementa parte de la interacción outside por otra ruta.

Patrón repetido:

```text
FloatingLayer
→ DismissableLayer opcional
→ motion surface
→ MotionPresenceGroup
→ Portal
```

### Diferencias reales

- role;
- navegación;
- modal/no modal;
- dismiss;
- focus;
- hover/touch;
- branches;
- placement.

### Acción

**COMPARTIR ENGINE**

Candidato conceptual:

```text
FloatingOverlayRuntime
```

No fusionar Menu/Popover/Tooltip.

---

## P1.6 — Dialog no usa todavía el runtime modal compartido

Drawer y BottomSheet ya delegan en:

```text
ModalOverlayRuntime
```

Dialog todavía posee directamente:

- MotionOverlayPresence;
- root/backdrop;
- DismissableLayer;
- FocusScope;
- ScrollLock;
- Portal.

### Diferencia real

Dialog puede ser:

```text
modal = false
```

El runtime actual de Drawer/BottomSheet asume modalidad más rígida.

### Acción

**COMPARTIR ENGINE**

Generalizar `ModalOverlayRuntime` sólo con opciones semánticas explícitas:

- modal;
- backdrop;
- contain focus;
- scroll lock;
- aria-modal.

Después migrar Dialog.

---

## P1.7 — DataTable / EditableDataTable todavía duplican shell

`DataTableDesktopBase` ya resolvió la duplicación del renderer desktop.

Pero los componentes raíz todavía comparten:

- state;
- responsive selection;
- row IDs;
- selection;
- export;
- skeleton counts;
- toolbar;
- loading;
- mobile/desktop switch;
- pagination.

Comparación normalizada aproximada:

```text
~0.693
151 líneas normalizadas coincidentes
```

Editable añade semántica legítima:

- add/edit/delete;
- search keys;
- editors;
- mobile editable.

### Acción

**COMPARTIR ENGINE / SHELL**

No fusionar DataTable y EditableDataTable.

---

## P1.8 — NavigationStack / TabScaffold

Comparten ownership de:

- controlled entries;
- internal entries;
- transition direction;
- IDs;
- normalize/update entries.

Las diferencias de UI y políticas de empty/initial state son legítimas.

### Acción

**COMPARTIR ENGINE**

Candidato:

```text
useNavigationEntries
```

con política de normalización explícita.

---

# P2 — simplificaciones con menor riesgo

## P2.1 — MotionPresence / MotionSwitch

Comparación normalizada:

```text
similaridad ~0.908
89 líneas coincidentes de ~96–100
```

Diferencia esencial:

- Presence recibe `present`;
- Switch trabaja por `key`.

### Acción

**COMPARTIR HELPER / FRAME INTERNO**

Buen candidato de bajo riesgo.

---

## P2.2 — Badge / Tag

Comparten:

- schemes;
- `schemeMap`;
- solid/subtle/outline;
- geometría visual base.

Tag añade:

- iconos;
- remove;
- press/interacción.

### Acción

**COMPARTIR RECIPE / HELPER**

No fusionar componentes.

---

## P2.3 — HelpText / FormErrorMessage

Tienen casi el mismo contrato estructural y repiten:

- FieldContext;
- presencia de children;
- tipografía/base style.

FormErrorMessage añade:

- invalid gating;
- alert semantics;
- error ID/color.

### Acción

**COMPARTIR HELPER / FIELD MESSAGE FRAME**

Además deben volver al owner `hasRenderableNode`.

---

# P2 — decisiones que requieren diseño antes de tocar código

## P2.4 — layout primitives

Flex/Grid/Stack usan los contratos canónicos completos:

- SizeProps;
- SpaceProps;
- SurfaceProps.

Inline/Wrap redeclaran subsets manuales y no ofrecen exactamente la misma matriz.

Ejemplos de diferencias:

- ausencia de `mx`/`my`;
- subset de width/height;
- surfaces diferentes.

### Acción

**INVESTIGAR**

Puede ser una diferencia deliberada de API o una bifurcación histórica.

No crear un LayoutBase antes de decidir la matriz pública deseada.

---

## P2.5 — slot precedence

`resolveLayeredSlot` modela capas explícitas en Menu y navigation destination.

En otras familias aparece frecuentemente un patrón parecido a:

```ts
styles: styles ?? context.styles
slotProps: slotProps ?? context.slotProps
```

Eso reemplaza mapas completos en vez de componer contexto + local de forma granular.

### Pregunta de contrato

¿Un slot local:

1. complementa al slot de contexto, o
2. sustituye completamente esa capa?

Actualmente no parece existir una única respuesta transversal.

### Acción

**INVESTIGAR → DEFINIR CONTRATO**

Después decidir si debe expandirse `resolveLayeredSlot`.

---

## P2.6 — controlled/uncontrolled

No existe un `useControllableState` genérico.

Implementaciones manuales identificadas, entre otras:

- UIMotionProvider;
- Accordion;
- Collapsible;
- SearchInput;
- RadioGroup;
- NavigationList;
- AdaptiveScaffold;
- NavigationStack;
- TabScaffold.

### Acción

**INVESTIGAR POR COMPLEJIDAD**

No usar un hook universal automáticamente.

Probables candidatos simples:

- Collapsible;
- SearchInput;
- RadioGroup;
- UIMotionProvider.

Probables owners especializados que deben conservar engine propio:

- AdaptiveScaffold;
- navigation stacks;
- Tree state.

---

# Tests — bifurcación de mantenimiento

Existen varios tests que inspeccionan texto source mediante regex.

Esto fue útil para boundaries, pero durante la estabilización ya produjo contratos obsoletos que fallaban aunque el comportamiento correcto estuviera centralizado.

### Mantener

Source tests que protegen:

- ownership;
- ausencia de wildcard exports;
- entry points;
- wrappers que no deben recuperar runtime interno.

### Migrar

Tests que exigen una forma sintáctica específica, por ejemplo:

```text
“debe existir exactamente este bloque inline”
```

cuando el verdadero contrato es conductual.

### Acción

Clasificar source tests en:

```text
A — ownership boundary        → mantener
B — public surface            → mantener
C — implementation snapshot   → reemplazar
```

---

# Similitudes que NO deben tratarse como duplicación pendiente

## BottomNavigation / NavigationRail

Ya comparten:

- selection engine;
- NavigationDestinationItem.

Los wrappers conservan recipes/layout distintos.

**MANTENER SEPARADO**

## Drawer / BottomSheet

Ya comparten `ModalOverlayRuntime`.

**MANTENER SEPARADO**

## ActionDialog / ConfirmDialog

Ya comparten `TargetDialogFrame`.

Confirm conserva semántica async/auto-close distinta.

**MANTENER SEPARADO**

## NavigationMenu / Tree

El estado de NavigationMenu ya reutiliza `useTreeState`.

Los renderers tienen contratos distintos.

**MANTENER SEPARADO**

## DataTableSkeleton / SkeletonTable

Existe composición explícita.

**MANTENER SEPARADO**

---

# Métricas del primer corte

Source productivo:

```text
291 módulos TS/TSX
291 alcanzables desde src/index.ts
0 módulos completamente huérfanos detectados
```

Concentración de mecanismos:

```text
resolveSlot          presente en 68 archivos
resolveLayeredSlot   presente en 7 archivos
composeEventHandlers presente en 21 archivos
usePress             presente en 11 archivos
DismissableLayer JSX en 6 archivos
FocusScope JSX       en 3 archivos
FloatingLayer JSX    en 4 archivos
```

Implementaciones manuales con `isControlled` detectadas en 9 archivos.

Estas cifras no son defectos por sí mismas. Sirven para localizar lugares donde una regla transversal podría tener más de un owner.

---

# Orden recomendado para el segundo corte

Antes de escribir código:

1. probar y documentar `TargetFormDialog`;
2. construir matriz de event-layer cancellation;
3. construir matriz de ReactNode presence para props semánticas;
4. mapear Trigger families;
5. mapear Floating/Modal overlay families;
6. mapear Forms:
   - text controls;
   - choice controls;
   - action controls;
7. mapear DataTable shell;
8. mapear navigation stack state;
9. definir slot precedence;
10. clasificar source-shape tests.

Después del mapa completo, agrupar cambios en fases coherentes.

No asignar todavía una versión siguiente.

---

# Asignación a fases

El plan operativo completo está en `ROADMAP_POST_0_3.md`.

| Hallazgo | Fase |
| --- | --- |
| TargetFormDialog / FormDialog | A |
| ReactNode presence en dialogs | A |
| Menu vs TriggerRuntime cancellation | A |
| Input / Textarea | B |
| Checkbox / Radio / Switch | B |
| Button / IconButton / Pressable / Card | B |
| HelpText / FormErrorMessage | B |
| controlled/uncontrolled simple | B |
| Popover / Tooltip trigger runtime | C |
| floating overlay runtime | C |
| Dialog → modal runtime | C |
| DataTable / EditableDataTable shell | D |
| NavigationStack / TabScaffold | D |
| MotionPresence / MotionSwitch | D |
| slot precedence | E |
| layout prop matrix | E |
| Badge / Tag recipe | E |
| tipos equivalentes | E |
| source-test classification | F |
| wrappers/residuos/reachability final | F |
| validación integrada | G |

La asignación de fase no implica todavía una solución concreta; sólo ordena cuándo debe tomarse la decisión.

---

# Estado de Fase B

**ABIERTA — MAPEO DIRIGIDO**

No se modifica producto hasta terminar la matriz interna de forms.

Familias:

- Input / Textarea;
- Checkbox / Radio / Switch;
- Button / IconButton / Pressable / Card;
- HelpText / FormErrorMessage;
- controlled/uncontrolled simple.

Objetivo del siguiente corte:

para cada familia identificar exactamente:

- estado compartido;
- ARIA compartida;
- handlers compartidos;
- slot wiring compartido;
- differences legítimas;
- tests de equivalencia necesarios;
- owner interno candidato.

## Corte detallado de Fase B

### B1 — text controls + field messages

Estado:

**CERRADO**

#### Input / Textarea

Owner nuevo:

`src/primitives/forms/use-text-control-runtime.ts`

Posee únicamente semántica compartida:

- `useFieldControl`;
- `useFocusVisible`;
- `useInputGroupDescendantState`;
- ARIA final;
- native field state;
- data attributes compartidos.

Permanece en `Input`:

- `<input>`;
- `type`;
- `appearance`;
- `leftPadding`;
- layout/padding específico;
- `data-ui="input"`.

Permanece en `Textarea`:

- `<textarea>`;
- `resize`;
- layout/padding específico;
- `data-ui="textarea"`.

Decisión:

**COMPARTIR ENGINE, MANTENER WRAPPERS**

No se creó un helper visual parametrizado porque habría convertido diferencias nativas simples en flags artificiales.

La precedencia actual de focus handlers (`slot local → prop pública → interno`) se conserva deliberadamente y se revisará en Fase E, donde pertenece el contrato global de slots.

#### HelpText / FormErrorMessage

Owner nuevo:

`src/primitives/forms/FieldMessageFrame.tsx`

Posee:

- `FieldContext`;
- presencia de ReactNode;
- resolución root;
- field IDs;
- invalid gating;
- role por defecto;
- base typography común.

Wrappers públicos conservan nombres/tipos propios.

Decisión:

**COMPARTIR FRAME, MANTENER WRAPPERS**

### B2 — choice controls

Estado:

**CERRADO**

Familia:

- Checkbox;
- Radio;
- Switch.

Owner existente:

`useChoiceControl`

Duplicación restante confirmada:

- lectura de handlers del `input` slot;
- composición focus/blur;
- composición click/change;
- readOnly guard;
- data attrs root;
- ARIA/native props del `<input>`;
- label slot;
- recipe invocation.

Diferencias legítimas:

Checkbox:
- `indeterminate`;
- mark/indicator;
- sincronización `HTMLInputElement.indeterminate`.

Radio:
- RadioGroup;
- `value`/`name`;
- managed selection;
- indicator dot.

Switch:
- `role="switch"`;
- `aria-checked`;
- track/thumb.

Owner candidato:

`useChoiceControlRuntime` sobre `useChoiceControl`, con helpers de root/input props.

No fusionar markup visual.

#### Implementación B2

Nuevo owner:

`src/primitives/forms/use-choice-control-runtime.ts`

Centraliza:

- composición de focus/blur;
- composición click/change;
- guard readOnly;
- root state attrs;
- native input props;
- ARIA compartida.

Checkbox/Radio/Switch ya no poseen `composeEventHandlers` ni llaman directamente a `useChoiceControl`.

La resolución visual de slots permanece deliberadamente en cada wrapper y se revisará en Fase E junto con la precedencia global de slots.

También se corrigió `ChoiceControlRoot` para usar `hasRenderableNode(label)` en lugar de `Boolean(label)`.

La composición de choice controls ahora obedece el contrato global:

```text
public prop
→ input slot
→ internal
```

con cancelación progresiva.

### B3 — press bridge

Estado:

**IMPLEMENTADO — PENDIENTE DE VALIDACIÓN**

Familia:

- Button;
- IconButton;
- Pressable;
- Card interactiva.

Duplicación común:

- extracción de handlers desde `slotProps.root`;
- `composeEventHandlers`;
- políticas cleanup con `checkDefaultPrevented: false`;
- configuración de `usePress`.

Diferencias legítimas:

- nativeInteractive;
- long press sólo Pressable;
- loading de Button/Card;
- polymorphism de Pressable;
- Card sólo es interactiva cuando existe `onPress`.

Owner candidato:

`usePressSlotBridge`.

Debe ser un hook interno pequeño, no un `ButtonBase`.

#### Implementación B3

Nuevo owner interno:

`src/core/interaction/press/usePressSlotBridge.ts`

Centraliza exclusivamente:

- public event handlers;
- root slot event handlers;
- `usePress`;
- cancelación progresiva;
- excepción explícita de cleanup.

Consumidores migrados:

- Button;
- IconButton;
- Pressable;
- Card.

Los cuatro ya no componen handlers localmente ni llaman directamente a `usePress`.

Diferencias preservadas:

- Button: loading/icons/recipe;
- IconButton: icon + aria label;
- Pressable: polymorphism, long press y detección nativeInteractive;
- Card: sólo interactiva cuando existe `onPress`.

No se creó un `ButtonBase` y no se exportó el bridge como API pública.

Tests nuevos protegen:

- ownership;
- cancelación public → slot → internal;
- cleanup que siempre libera estado;
- slot click capaz de cancelar `onPress`.

### B4 — controlled/uncontrolled simple

Estado:

**PENDIENTE DE CORTE FINAL**

No se introducirá un `useControllableState` hasta probar que los consumidores simples comparten exactamente:

```text
source of truth
default initialization
onChange timing
rejected controlled update semantics
```

Candidatos iniciales:

- Collapsible;
- SearchInput;
- RadioGroup;
- UIMotionProvider.

Engines complejos quedan fuera.
