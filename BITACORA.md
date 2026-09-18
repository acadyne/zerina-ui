# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B — convergencia de formularios: **CERRADA**.
- Fase activa: **C — triggers y overlays**.
- C1 trigger runtime único: **CORREGIDA — PENDIENTE DE REVALIDACIÓN LIMPIA**.
- C2 floating overlays: **MAPEADA — IMPLEMENTACIÓN BLOQUEADA HASTA CIERRE LIMPIO DE C1**.
- C3 Dialog → modal runtime: pendiente.
- No se asignó todavía una versión siguiente.

## Validación que cerró Fase B

```text
tests dirigidos B4       73/73 PASS
Vitest completo         447/447 PASS
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

## Fase B — owners resultantes

- `useTextControlRuntime`;
- `FieldMessageFrame`;
- `useChoiceControlRuntime`;
- `usePressSlotBridge`;
- `useControllableValue`.

Engines complejos deliberadamente diferidos a Fase D:

- AdaptiveScaffold;
- NavigationStack;
- TabScaffold.

## Fase C — objetivo

Reducir runtimes paralelos de interacción/overlay sin fusionar componentes con semánticas distintas.

Scope:

1. C1 — trigger runtime;
2. C2 — floating overlays;
3. C3 — Dialog hacia modal runtime.

Fuera de scope:

- DataTable;
- navigation state;
- layout;
- slot precedence global;
- rediseño visual.

## C1 — decisión

Popover y Tooltip compartían infraestructura de trigger pero NO la misma semántica.

### Modo `press`

Consumidores:

- MenuTrigger;
- CollapsibleTrigger;
- PopoverTrigger.

Adquiere activación vía `usePress` y protocolo press-target.

### Modo `passive`

Consumidor:

- TooltipTrigger.

Comparte:

- refs;
- asChild;
- merge class/style;
- element props;
- event layers;
- ARIA ownership.

Pero no convierte automáticamente un elemento `asChild` pasivo en botón.

Ejemplo:

```text
TooltipTrigger asChild + <span>
→ sigue siendo span
→ sin role="button"
→ sin tabIndex inventado
```

## C1 — cambios implementados

`TriggerRuntime` ahora expone internamente:

```text
interactionMode="press" | "passive"
```

PopoverTrigger:

```text
TriggerRuntime press
```

TooltipTrigger:

```text
TriggerRuntime passive
```

El modo passive también reconoce Zerina press-targets:

- Button;
- IconButton;
- Pressable.

Conserva el `onPress` del hijo y sólo entrega un click real a la capa pasiva cuando el native event corresponde a click. No sintetiza un segundo press.

Retirado:

`src/primitives/overlay/triggerProps.ts`

Ya no existen consumidores de:

`mergeTriggerProps`.

## C1 — tests añadidos

- `overlay-phase-c1-trigger-ownership.test.ts`;
- `overlay-phase-c1-trigger-behavior.test.tsx`.

Cubren:

- Popover/Tooltip con owner único;
- eliminación del runtime paralelo;
- Tooltip span sin button semantics;
- child preventDefault cortando slot + internal;
- Popover activado por Pressable press-target;
- child cancelando activación Popover.

## Verificación estática disponible

- imports relativos de `src`: 0 rotos;
- `mergeTriggerProps`: 0 consumidores;
- `triggerProps.ts`: eliminado.

## Criterio de cierre C1

Debe pasar:

```text
internal-test typecheck
tests C1 dirigidos
trigger/event regression
pnpm validate
```

Sólo después se abre C2.

## C1 — residuo detectado por validación

La validación funcional fue verde:

```text
tests dirigidos C1       18/18 PASS
Vitest completo         454/454 PASS
Chromium                  65/65 PASS
typechecks/build              PASS
React 18/19 consumers         PASS
Validation complete.
```

Pero React emitió:

```text
Unknown event handler property `onPress`
```

sobre un `<span>` pasivo.

Causa:

`PassiveTriggerRoot` incluía la key `onPress` en `renderedProps` aun cuando su valor era `undefined`.

Corrección:

- `onPress` ya no existe en el objeto DOM por defecto;
- sólo se materializa si `pressTarget === true`;
- el test C1 ahora espía `console.error` y prohíbe explícitamente ese warning.

C1 no se declara cerrada hasta una revalidación limpia.

## C2 — mapa listo

La frontera elegida es un `FloatingOverlayRuntime` estructural.

Debe compartir:

```text
FloatingLayer
presence/portal
optional dismiss wrapper
optional focus wrapper
floating ref/style/side plumbing
```

No debe poseer:

- open state;
- recipes;
- roles/ARIA;
- menu navigation;
- tooltip timers/touch;
- domain callbacks.

Orden propuesto:

```text
Popover
→ NavigationMenuPanel
→ Menu
→ Tooltip
```

No se implementa C2 hasta cerrar C1 sin warnings.
