# Contratos transversales

## 1. Presencia de ReactNode

Owner: `src/core/react/nodePresence.ts`.

- `hasRenderableNode`: ausentes `null`, `undefined` y booleanos; `0` es válido.
- `hasNonEmptyRenderableNode`: además considera `""` ausente.
- No crear implementaciones locales equivalentes.

## 2. IDs ARIA compuestos

Owner: `src/core/dom/aria.ts`.

`mergeAriaIds`:

- separa por whitespace;
- elimina vacíos;
- deduplica;
- conserva orden;
- devuelve `undefined` sin IDs útiles.

## 3. Composición progresiva de eventos

Owner:

`src/core/interaction/events/composeEventHandlers.ts`

La regla transversal es:

```text
capa 1
→ capa 2
→ capa 3
→ conducta interna
```

Cada capa observa el mismo evento como máximo una vez.

Después de cada capa:

```text
event.defaultPrevented === true
    → detener toda capa posterior
```

`preventDefault()` cancela progresivamente tanto callbacks externos posteriores como conducta interna.

`stopPropagation()` conserva sólo su semántica DOM y no corta por sí mismo una cadena compuesta.

Owners consumidores:

- `TriggerRuntime` delega en `composeEventHandlerChain`;
- Menu usa la misma cadena para `prop pública → slot local → slot contexto`;
- `composeEventHandlers` conserva el caso simple external/internal.

Excepción explícita:

`checkDefaultPrevented: false` existe únicamente para composiciones donde una segunda capa es cleanup técnico que debe ejecutarse aunque el evento haya sido cancelado.

## 4. Época de apertura de Menu

Una intención de foco diferida (`configured`, `first`, `last`) sólo puede pertenecer al intento de apertura que la produjo.

- request aceptado en el mismo commit: intención vigente;
- request rechazado/diferido mientras el componente commitea cerrado: intención invalidada;
- cierre: intención invalidada;
- apertura posterior sin intención vigente: `configured`.

Nunca reutilizar una intención de foco de una época cerrada.

## 5. SettingsList

Switch/Checkbox:

- activación desde el input nativo;
- evento `React.ChangeEvent<HTMLInputElement>`;
- estado controlled propiedad del consumidor;
- estado uncontrolled propiedad de la primitiva;
- `preventDefault()` impide commit uncontrolled;
- disabled no cambia ni emite.

## 6. Acciones cancelables de slots

SearchInput clear y PasswordInput toggle:

- handler externo primero;
- `preventDefault()` cancela acción interna;
- sin cancelación, acción interna exactamente una vez;
- implementación mediante `composeEventHandlers`.

## 7. Tokens

Fuente de verdad: `THEME_TOKEN_MANIFEST`.

- esquema actual: 69 hojas;
- rama `interaction`: 6 hojas;
- runtime/SSR/browser derivan el conjunto del manifiesto;
- una sola prueba fija cardinalidad total explícita;
- no conservar variables eliminadas por compatibilidad histórica sin consumidor vigente.

## 8. Navegación de destinos

BottomNavigation y NavigationRail comparten:

- controlled/uncontrolled;
- `change` / `reselect`;
- previousValue;
- cancelación antes del commit;
- item active semantics;
- badge anchoring y label visibility.

Recipes/layouts permanecen por familia.

## 9. DataTable desktop

Owner estructural único: `DataTableDesktopBase`.

Comparte:

- sorting;
- selección;
- slots;
- row identity;
- thead/tbody;
- empty state.

Las variantes aportan únicamente política de celda/edición.

## 10. Diálogos y targets

Owner semántico del target:

`src/patterns/shared/targetDialogContract.ts`

Un target existe cuando:

```text
target !== null
```

Por tanto:

```text
0
""
false
```

son targets válidos.

`resolveRenderableWithTarget` sólo ejecuta una función dependiente del target cuando ese contrato se cumple.

### FormDialog

`FormDialog` es el único owner de la transición:

```text
cancelar
→ onCancel una vez
→ onOpenChange(false) una vez
```

Tanto el botón Cancel como un dismiss del Dialog llegan a ese mismo owner.

`TargetFormDialog` sólo adapta el payload del target. No vuelve a cerrar ni redispara cancelación.

### ReactNode en dialogs

Para contenido textual opcional:

- description;
- targetLabel;
- error;

se usa `hasNonEmptyRenderableNode`.

`0` es contenido válido; `""` no materializa estructura textual vacía.

Para footer custom se usa `hasRenderableNode`, de modo que un ReactNode renderizable puede reemplazar deliberadamente el footer por defecto.

ConfirmDialog y ActionDialog comparten `TargetDialogFrame`; FormDialog permanece separado porque el elemento `<form>` necesita envolver header/body/footer para conservar submit nativo y `formProps`.

## 11. Runtime modal Drawer/BottomSheet

Owner: `primitives/overlay/shared/ModalOverlayRuntime.tsx`.

Posee:

- AnimatePresence/Motion overlay;
- DismissableLayer;
- FocusScope;
- ScrollLock;
- Portal;
- role/aria-modal;
- asociaciones aria-labelledby/aria-describedby;
- flags de Escape/outside dismiss;
- restore/initial focus.

Drawer/BottomSheet aportan recipes, contenido y diferencias de presentación.

Los slots no pueden reemplazar invariantes de ownership/foco/dismiss.

## 12. Modalidad y focus-visible

Owner: `src/core/interaction/focus/useFocusVisible.ts`.

El contrato visual de Zerina UI no delega su semántica a `:focus-visible` del navegador.

Reglas:

- `pointerdown` / actividad de puntero → foco lógico sí, ring de teclado no;
- `keydown` sin modificadores → foco posterior puede ser focus-visible;
- focus programático sigue la última modalidad observada;
- blur/disabled limpian focused y focus-visible;
- el tracker es compartido por `Document`;
- el tracker debe estar activo **antes del primer focus**, para no perder el evento que causó ese foco.

`:focus-visible` nativo sólo puede actuar como fallback excepcional cuando aparece un `ownerDocument` que no estaba siendo observado. No es la fuente primaria del contrato visual.

## 13. Choice controls

Semantic runtime:

`src/primitives/forms/use-choice-control-runtime.ts`

Consumers:

- Checkbox;
- Radio;
- Switch.

The runtime owns:

- `useChoiceControl`;
- focus composition;
- click/change composition;
- readOnly change guard;
- common root state attributes;
- common native input/ARIA props.

Event order:

```text
public prop
→ input slot
→ internal choice behavior
```

The global progressive-cancellation contract applies: `preventDefault()` stops every later layer.

Wrappers retain real differences:

- Checkbox: `indeterminate` and mixed ARIA state;
- Radio: RadioGroup management, value/name and radio indicator;
- Switch: `role="switch"`, track and thumb.

`ChoiceControlRoot` uses `hasRenderableNode` for labels. Numeric `0` is therefore a valid label; booleans/null/undefined are absent according to the central ReactNode contract.

## 14. Press bridge

Internal owner:

`src/core/interaction/press/usePressSlotBridge.ts`

Consumers:

- Button;
- IconButton;
- Pressable;
- interactive Card.

The bridge owns only the event-layer policy around `usePress`.

Active events use:

```text
public prop
→ root slot
→ usePress internal behavior
```

`preventDefault()` stops every later layer.

Cleanup events are deliberately different:

```text
pointerleave
pointerup
pointercancel
lostpointercapture
blur
```

For these events, public + slot + internal cleanup still run even when an earlier layer calls `preventDefault()`.

This exception preserves release/reset semantics and is explicit through `checkDefaultPrevented: false`.

Wrappers retain their real differences:

- Button: loading, icons, button recipe, native button;
- IconButton: icon-only contract and aria label;
- Pressable: polymorphic element, long press, native-interactive detection;
- Card: interactivity only when `onPress` exists, loading/layout semantics.

`usePressSlotBridge` is internal and is not exported from the public interaction barrel.

## 15. Controlled / uncontrolled simple

Owner:

`src/core/react/useControllableValue.ts`

This helper owns only:

```text
controlled when value !== undefined
uncontrolled value initialized from defaultValue
internal writes ignored while controlled
controlled values are not copied into internal state
```

It deliberately does NOT own:

- domain callbacks;
- validation;
- disabled/readOnly policy;
- normalization;
- reselect semantics;
- paired/multi-state transitions.

Consumers currently using it:

- Collapsible;
- Accordion;
- NavigationList;
- SearchInput;
- RadioGroup;
- UIMotionProvider;
- useNavigationSelection;
- useChoiceControl.

Specialized engines remain specialized; they only delegate the source-of-truth layer.

Not migrated:

- AdaptiveScaffold;
- NavigationStack;
- TabScaffold.

Those owners coordinate normalization and/or multiple pieces of state and belong to the later state-engine phase.

## 16. Trigger runtime modes

Owner:

`src/core/interaction/trigger/TriggerRuntime.tsx`

There is one structural trigger runtime with two explicit interaction modes.

### `press`

Used by activation triggers:

- MenuTrigger;
- CollapsibleTrigger;
- PopoverTrigger.

It owns:

- `asChild`;
- refs;
- class/style merge;
- child → slot layer composition;
- press-target protocol;
- disabled activation semantics;
- `usePress`;
- keyboard activation.

### `passive`

Used by TooltipTrigger.

It owns the same structural composition but does not invent activation semantics for `asChild`.

Therefore a passive trigger wrapping:

```tsx
<span />
```

does not automatically gain:

```text
role="button"
tabIndex=0
```

Passive event order is:

```text
child
→ event layer(s)
→ passive internal handler
```

with progressive `preventDefault()` cancellation.

When a passive trigger wraps a Zerina press-target (`Button`, `IconButton`, `Pressable`), the runtime preserves the child's `onPress` owner. A real click from that press cycle is exposed to the passive click layer through the same native React event; no second click/press is synthesized.

`src/primitives/overlay/triggerProps.ts` is retired. Popover and Tooltip no longer own independent child/ref/class/style/event merge code.

## 17. Floating overlay runtime

Owner estructural:

`src/core/overlay/FloatingOverlayRuntime.tsx`

Consumidores:

- PopoverContent;
- MenuContent;
- NavigationMenuPanel;
- TooltipContent.

El runtime posee únicamente:

```text
present
→ MotionPresenceGroup
→ optional Portal
→ FloatingLayer
→ floating render props
```

Incluye la configuración mecánica compartida de:

- anchor ref;
- placement;
- offset;
- flip;
- shift;
- viewport padding;
- z-index;
- matchAnchorWidth;
- resize/scroll updates;
- floating element ref;
- portal/container.

El runtime NO posee:

- open state de dominio;
- recipes;
- roles/ARIA;
- dismiss callbacks;
- FocusScope;
- navegación de Menu;
- timers/hover/touch de Tooltip.

### `portalled={false}`

No se implementa mediante `<Portal disabled>`.

Se conserva un branch estructural explícito:

```text
portalled
  ? <Portal>...</Portal>
  : animated
```

porque `Portal` consulta `OverlayProvider` antes de evaluar `disabled`. De este modo los overlays no portalled que antes podían operar sin `OverlayProvider` conservan esa propiedad.

### Dismiss / focus

No se añade un segundo runtime universal.

- Popover mantiene `DismissableLayer + FocusScope`;
- Menu mantiene `DismissableLayer`;
- NavigationMenuPanel mantiene `DismissableLayer`;
- Tooltip mantiene su outside-pointer owner actual.

La razón es estructural: esas capas no ocupan la misma posición ni comparten la misma política. El engine común de dismiss ya existe en `DismissableLayer`; forzar otra abstracción superior introduciría callbacks/opciones opacas sin eliminar un segundo engine real.

## 18. Modal overlay runtime

Owner:

`src/primitives/overlay/shared/ModalOverlayRuntime.tsx`

Consumers:

- Dialog;
- Drawer;
- BottomSheet.

The runtime owns:

```text
MotionOverlayPresence
→ MotionOverlayRoot
→ optional MotionOverlayBackdrop
→ DismissableLayer
→ FocusScope
→ MotionOverlayPanel
→ optional ScrollLock
→ optional Portal
```

### Atomic modality

`modal` is one semantic decision:

```text
modal=true
→ backdrop
→ contain focus
→ body scroll lock
→ aria-modal="true"

modal=false
→ no backdrop
→ no focus containment
→ no scroll lock
→ no aria-modal
```

This matches Dialog's existing public contract and keeps Drawer/BottomSheet modal by default.

Independent decisions remain independent:

- autoFocus;
- restoreFocus;
- initialFocusRef;
- dismiss on Escape;
- dismiss on pointer-down outside;
- portal/container.

### Family ownership

The runtime does not own recipes, family slot names, title/description mounting, header/body/footer, close buttons or domain callbacks.

Panel differences remain explicit:

- Dialog: `panelAs="div"`, `panelKind="dialog"`;
- Drawer: `panelAs="aside"`, `panelKind="drawer"`, placement;
- BottomSheet: `panelAs="section"`, `panelKind="bottom-sheet"`.

### Dialog slot compatibility

Dialog historically forwarded only `className` and `style` from its `dismissableLayer` and `focusScope` slots.

The migration preserves that boundary when adapting those slots into `ModalOverlayRuntime`; it does not silently expose new DOM/event forwarding.

## 18. DataTable shell

State owner:

`src/components/data-table/useDataTableShell.ts`

Structural owner:

`src/components/data-table/DataTableShellFrame.tsx`

Both `DataTable` and `EditableDataTable` consume these owners.

`useDataTableShell` owns:

- table/search/sort/pagination state;
- responsive mode;
- row identity resolver;
- selection;
- CSV export;
- loading skeleton cardinality.

`DataTableShellFrame` owns:

- DataTableRoot;
- toolbar;
- loading/skeleton branch;
- mobile/desktop switch;
- pagination.

Variant-specific ownership remains outside:

### DataTable

- static mobile renderer;
- static desktop renderer;
- custom toolbar `renderActions`.

### EditableDataTable

- searchable-column derivation;
- cell coercion/edit mutation;
- row identity validation after edit;
- add row;
- delete selected rows;
- editable mobile/desktop renderers.

The shared shell does not know `onDataChange`, cell editors, add/delete policies or editable column types.

## 19. Navigation history owner

Internal owner:

`src/patterns/navigation-stack/useNavigationEntries.ts`

Consumers:

- NavigationStack;
- TabScaffold.

The hook owns:

- entry IDs;
- entry sequence;
- controlled/uncontrolled source of truth;
- empty/fallback normalization;
- transition direction;
- current/currentIndex/canGoBack;
- set/update entries;
- push;
- replace;
- pop;
- popToRoot;
- reset.

Empty policy is explicit:

```text
initialName === null
→ history may be empty

initialName is any string, including ""
→ a fallback entry exists
```

NavigationStack passes its `initialName` directly.

TabScaffold maps “no valid initial tab” to `null`.

Domain-specific ownership remains local:

### NavigationStack

- screen registry;
- missing-screen fallback;
- motion preset/rendering;
- NavigationStackContext shape.

### TabScaffold

- initial-tab selection;
- active-tab derivation;
- tab validation;
- disabled-tab policy;
- `resetToTab`;
- `onTabChange`;
- app bar / bottom navigation / scaffold composition.

`useNavigationEntries` is internal and is not exported from the navigation-stack public barrel.

## 20. Motion app frame

Internal owner:

`src/core/motion/MotionAppFrame.tsx`

Consumers:

- MotionPresence;
- MotionSwitch.

The frame owns:

```text
useOptionalUIMotion
→ effective preset
→ app transition variants
→ transition intent/transition
→ AnimatePresence
→ motion.div
```

Public wrapper policy remains separate:

### MotionPresence

- `present` decides whether a frame exists;
- `motionKey` remains optional;
- default key remains `"motion-presence"`.

### MotionSwitch

- always presents one frame;
- `motionKey` remains required.

The following public props keep the same meaning in both wrappers:

- preset;
- direction;
- mode;
- initial;
- transitionIntent;
- className;
- style;
- remaining motion div props.

`MotionAppFrame` is internal and is not exported by `core/motion` or the package root.

## 21. Precedencia transversal de slots

Owners:

- `resolveSlotLayers`;
- `resolveLayeredSlot`;
- `resolveContextualSlot`;
- `resolveSlot`.

### Valores y estilos

La precedencia declarativa es de menor a mayor especificidad:

```text
base
→ contexto amplio
→ contexto intermedio
→ local
→ className/style directos
```

`resolveSlotLayers` expresa N capas explícitas.

`resolveLayeredSlot` es el caso contexto + local sobre uno o varios slots.

`resolveContextualSlot` es el caso contexto + local para un único slot.

`resolveSlot` sigue siendo el caso sin contexto heredado.

Reglas:

- `className` se concatena en orden;
- `style` se mergea en orden;
- props normales usan last-defined-wins;
- `undefined` no borra una capa anterior;
- `false`, `0` y `""` son valores explícitos.

No usar:

```text
styles ?? context.styles
slotProps ?? context.slotProps
```

para compound components. Un mapa local no debe borrar slots de contexto que no redefine.

### Handlers dentro del resolver

Los resolvers de slots NO componen eventos automáticamente.

Para una misma key:

```text
context onClick
→ local onClick
```

el handler local reemplaza al de contexto.

Motivo: un resolver declarativo no puede decidir si el evento representa:

- conducta cancelable;
- cleanup técnico;
- evento ya consumido por otro runtime.

### Pipelines semánticos de eventos

Cuando un componente posee conducta interna sobre un evento, las capas externas se componen explícitamente mediante los owners de `core/interaction`.

Orden transversal:

```text
prop pública / child
→ slot local
→ slot contexto / heredado
→ conducta interna
```

Después de cada capa:

```text
defaultPrevented
→ detener capas posteriores
```

Las excepciones de cleanup siguen requiriendo `checkDefaultPrevented:false`.

### Invariantes internas

IDs estructurales, `type`, roles, enlaces ARIA y otros invariantes que el componente necesita para ser válido no se delegan al resolver como overrides libres. El componente los aplica después de las capas externas o los mantiene en su runtime semántico.

### Migración E1

Se eliminaron fallbacks de mapa completo en:

- Card;
- Accordion;
- Drawer;
- BottomSheet;
- Popover;
- Tooltip;
- Dialog.

Accordion usa tres capas explícitas:

```text
Accordion
→ AccordionItem
→ subcomponente local
```

Input/Textarea ahora siguen:

```text
prop pública
→ slot local
→ focus-visible internal
```

igual que los demás controles con pipeline semántico.

## 22. Layout prop matrix

La familia se divide en dos contratos deliberados.

### Full layout frame

Consumidores:

- Flex;
- Grid;
- Stack.

Tipo interno:

`LayoutFrameProps`

Incluye:

```text
SizeProps
+ SpaceProps
+ SurfaceProps
```

Por tanto comparten:

- `w/h/minW/maxW/minH/maxH`;
- `p/px/py/pt/pb/pl/pr`;
- `m/mx/my/mt/mb/ml/mr`;
- `bg/color/rounded/shadow/border`.

### Flow layout frame

Consumidores:

- Inline;
- Wrap.

Tipo interno:

`FlowLayoutFrameProps`

Incluye:

```text
SpaceProps
+ w
+ minH
```

Es deliberadamente más estrecho:

- no surface props;
- no `h/minW/maxW/maxH`;
- no `inline` toggle porque cada primitive fija su display;
- no overflow genérico.

E2 completa `mx` y `my` para Inline/Wrap al dejar de duplicar manualmente `SpaceProps`.

### Diferencias semánticas preservadas

| Primitive | Display | Gap API | Wrap policy | Extra semantics |
| --- | --- | --- | --- | --- |
| Flex | flex / inline-flex | `gap` | configurable | direction, overflow |
| Grid | grid / inline-grid | `gap/rowGap/columnGap` | grid-owned | columns/rows/auto tracks |
| Stack | flex / inline-flex | `spacing` | configurable | divider suppresses gap |
| Inline | inline-flex | `gap` | configurable | divider + child normalization |
| Wrap | flex | `spacing/rowSpacing/columnSpacing` | always wrap | optional WrapItem |

No se renombran `gap`/`spacing`: expresan APIs históricas y semántica de divider distinta.

### Precedencia de style

En los cinco primitives:

```text
layout props/helpers
→ style directo
```

`style` permanece como override final.

## 23. Status label recipe

Internal owner:

`src/components/display/status-label-recipe.ts`

Consumers:

- Badge;
- Tag.

The recipe owns the concept shared by both components:

```text
variant
→ solid / subtle / outline

colorScheme
→ primary / secondary / success / warning / danger / neutral

shared root frame
→ inline-flex
→ centered alignment
→ gap
→ max-width
→ line-height
→ nowrap

shared content frame
→ min-width 0
→ overflow hidden
→ ellipsis
```

The recipe also owns the exact scheme tokens for solid, subtle and outline rendering.

Component-specific geometry remains local.

### Badge

Keeps:

```text
minHeight 22
padding 0.2rem 0.55rem
fontSize 0.75rem
fontWeight 700
letterSpacing 0.02em
```

### Tag

Keeps:

```text
minHeight 28
padding 0.28rem 0.7rem
fontSize 0.78rem
fontWeight 600
letterSpacing 0.01em
icons
remove button
usePress interaction
```

The shared recipe does not own Tag remove/press semantics.

`StatusLabelVariant`, `StatusLabelColorScheme` and `statusLabelRecipe` are internal implementation contracts and are not root-public.

No other recipe family was merged in E3. Action controls and choice controls have different scheme domains and interactive-state semantics, so structural similarity is not sufficient to share this owner.
