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

Para TriggerRuntime:

```text
child → slot local → slot heredado → conducta interna
```

Cada capa observa el evento una vez.

Después de cada capa:

```text
event.defaultPrevented === true
    → detener la cadena
```

`preventDefault()` de una capa impide todas las capas posteriores.

`stopPropagation()` sigue siendo propagación DOM; no altera por sí solo la cadena interna de composición.

Para composiciones simples external/internal se mantiene `composeEventHandlers`.

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

## 10. Diálogos orientados a target

Un target existe cuando `target !== null`.

`0`, `""` y `false` son targets válidos.

ConfirmDialog y ActionDialog comparten frame; mantienen semánticas de operación distintas.

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
