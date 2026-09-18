# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase activa: **B — convergencia de formularios**.
- B1 text controls + field messages: **CERRADA**.
- B2 choice controls: **CERRADA**.
- B3 press bridge: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- B4 controlled/uncontrolled simple: pendiente.
- No se asignó todavía una versión siguiente.

## Validación que cerró B2

```text
tests dirigidos B2       55/55 PASS
Vitest completo         421/421 PASS
Chromium                  65/65 PASS
internal-test typecheck       PASS
package typecheck             PASS
build ESM/CJS/DTS             PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
Validation complete.
```

## B2 — resultado vigente

Owner:

`src/primitives/forms/use-choice-control-runtime.ts`

Consumers:

- Checkbox;
- Radio;
- Switch.

El runtime posee:

- `useChoiceControl`;
- focus/blur;
- click/change;
- readOnly guard;
- root state attrs;
- native input/ARIA común.

Wrappers conservan:

- Checkbox: indeterminate;
- Radio: RadioGroup/name/value;
- Switch: role/track/thumb.

`ChoiceControlRoot` usa `hasRenderableNode`.

## B3 — scope

Familia:

- Button;
- IconButton;
- Pressable;
- Card interactiva.

Objetivo:

centralizar únicamente el puente:

```text
public handlers
→ root slot handlers
→ usePress
```

sin compartir markup, recipe ni API pública.

## B3 — cambios implementados

Nuevo owner interno:

`src/core/interaction/press/usePressSlotBridge.ts`

Posee:

- composición public → slot;
- configuración común de `usePress`;
- política de cancelación progresiva;
- política explícita de cleanup.

### Eventos activos

```text
public prop
→ root slot
→ internal
```

`preventDefault()` corta toda capa posterior.

### Eventos de cleanup

```text
pointerleave
pointerup
pointercancel
lostpointercapture
blur
```

public + slot + cleanup interno siguen ejecutándose aunque una capa anterior llame `preventDefault()`.

Esto conserva liberación de pressed/focus/pointer state.

## B3 — diferencias preservadas

### Button

- loading;
- icons;
- action recipe;
- native button.

### IconButton

- icon-only;
- aria label;
- icon recipe.

### Pressable

- polymorphism;
- `onLongPress`;
- `longPressDelay`;
- native-interactive detection.

### Card

- sólo interactiva cuando existe `onPress`;
- loading;
- role/tabIndex condicional;
- layout/context propio.

No se creó `ButtonBase`.

`usePressSlotBridge` permanece interno y no se exporta desde `core/interaction/press/index.ts`.

## Tests B3 añadidos/ajustados

Nuevos:

- `forms-phase-b3-ownership.test.ts`;
- `forms-phase-b3-behavior.test.tsx`.

Actualizado:

- `interaction-use-press-consumers.test.ts`.

Protegen:

- owner único del bridge;
- wrappers sin `composeEventHandlers` local;
- wrappers sin llamada directa a `usePress`;
- cancelación progresiva de pointer-down;
- cleanup después de preventDefault;
- slot click cancelando `onPress`;
- diferencias propias de Pressable/Card.

## Verificación estática disponible

- imports relativos de archivos modificados: **0 rotos**;
- Button/IconButton/Pressable/Card: sin `composeEventHandlers` local;
- Button/IconButton/Pressable/Card: sin llamada directa a `usePress`;
- bridge no exportado por el barrel público.

## Criterio de cierre B3

Debe pasar:

```text
internal-test typecheck
tests B3 dirigidos
Block 7 completo
interaction-use-press-consumers
pnpm validate
```

Sólo después se abre B4.
