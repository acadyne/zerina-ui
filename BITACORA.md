# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase activa: **C — triggers y overlays**.
- C1 trigger runtime único: **CERRADA**.
- C2 floating overlays: **CERRADA**.
- C3 Dialog → modal runtime: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- No se asignó todavía una versión siguiente.

## Validación que cerró C2

```text
tests dirigidos C2       14/14 PASS
Vitest completo         460/460 PASS
Chromium                  65/65 PASS
internal-test typecheck       PASS
package typecheck             PASS
build ESM/CJS/DTS             PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
git whitespace                PASS
Validation complete.
```

## C3 — objetivo

Eliminar el último owner paralelo de mecánica modal.

Familias:

- Dialog;
- Drawer;
- BottomSheet.

Invariantes:

- preservar `Dialog modal=false`;
- no cambiar API pública;
- no mover recipes;
- no cambiar timing de dismiss;
- no cambiar autoFocus/restoreFocus;
- no ampliar accidentalmente slot forwarding de Dialog;
- Drawer/BottomSheet deben seguir siendo modales.

## C3 — decisión

`ModalOverlayRuntime` ahora posee modalidad atómica.

```text
modal=true
→ backdrop
→ contain focus
→ scroll lock
→ aria-modal="true"

modal=false
→ sin backdrop
→ sin contain
→ sin scroll lock
→ sin aria-modal
```

Se mantienen independientes:

- autoFocus;
- restoreFocus;
- initialFocusRef;
- closeOnEscape;
- closeOnPointerDownOutside;
- portalled/container.

## C3 — cambios implementados

### ModalOverlayRuntime

Generalizado para:

- Dialog;
- Drawer;
- BottomSheet.

Prop interna nueva:

`modal?: boolean` con default `true`.

El antiguo prop interno `positionerSlot` se renombró a:

`dismissableLayerSlot`

para describir el owner real y permitir que cada familia adapte su nombre público.

### Dialog

Ya no posee directamente:

- DismissableLayer;
- FocusScope;
- ScrollLock;
- MotionOverlayPresence;
- MotionOverlayRoot;
- MotionOverlayBackdrop;
- MotionOverlayPanel;
- Portal.

Ahora delega todo ese kernel en `ModalOverlayRuntime`.

Conserva local:

- `dialogRecipe`;
- IDs/title/description mounting;
- public `modal`;
- slots;
- context;
- subcomponentes;
- close/domain callbacks.

Panel:

```text
panelAs="div"
panelKind="dialog"
```

### Drawer / BottomSheet

No cambia su semántica.

Siguen usando el default:

```text
modal=true
```

Sólo adaptan su slot público `positioner` al prop interno `dismissableLayerSlot`.

## Compatibilidad de slots Dialog

Antes de C3, Dialog sólo reenviaba:

```text
dismissableLayer.className
dismissableLayer.style
focusScope.className
focusScope.style
```

C3 conserva exactamente esa frontera al adaptar los slots al runtime.

No se amplió el forwarding de props/eventos.

## Tests C3

Nuevos:

- `overlay-phase-c3-modal-runtime-ownership.test.ts`;
- `overlay-phase-c3-modal-runtime-behavior.test.tsx`.

Actualizado:

- `interaction-overlay-source.test.ts`.

Cubren:

- tres familias sobre un owner;
- ausencia de kernels directos;
- modalidad atómica en runtime;
- Dialog modal con backdrop/aria-modal/scroll lock;
- Dialog non-modal sin backdrop/aria-modal/scroll lock;
- recipe y decisión pública modal permanecen en Dialog.

## Verificación estática disponible

```text
Dialog direct modal-runtime internals      0
Drawer direct modal-runtime internals      0
BottomSheet direct modal-runtime internals 0
ModalOverlayRuntime consumers              3
relative imports broken                    0
```

## Criterio de cierre C3 / Fase C

Debe pasar:

```text
internal-test typecheck
tests C3 dirigidos
modal runtime regression
Dialog regression
pnpm validate
```

Si queda verde:

1. C3 se marca CERRADA;
2. Fase C completa se marca CERRADA;
3. mapa/contratos/bitácora se consolidan;
4. se abre Fase D — state engines y product shells.
