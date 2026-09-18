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
