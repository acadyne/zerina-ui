# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C: **CERRADA**.
- Fase activa: **D — state engines y shells de producto**.
- D1 DataTable shell: **CERRADA**.
- D2 NavigationStack / TabScaffold: **CERRADA**.
- D3 MotionPresence / MotionSwitch: **CANDIDATO CORREGIDO — PENDIENTE DE VALIDACIÓN**.
- No se asignó todavía una versión siguiente.

## Validación que cerró D2

```text
tests dirigidos D2       33/33 PASS
Vitest completo         487/487 PASS
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

La corrida final fue limpia: no reapareció el warning `act(...)` de AnimatePresence.

## D1 — resultado vigente

Owners:

- `useDataTableShell`;
- `DataTableShellFrame`.

## D2 — resultado vigente

Owner interno:

`src/patterns/navigation-stack/useNavigationEntries.ts`

Posee:

- IDs y sequence;
- controlled/uncontrolled;
- normalization;
- transition direction;
- current/currentIndex/canGoBack;
- set/update entries;
- push/replace/pop/popToRoot/reset.

NavigationStack y TabScaffold conservan sus políticas de producto.

## D3 — decisión

MotionPresence y MotionSwitch duplicaban la misma mecánica de app-transition.

Nuevo owner interno:

`src/core/motion/MotionAppFrame.tsx`

Posee:

```text
useOptionalUIMotion
→ effective preset
→ getAppTransitionVariants
→ getTransition
→ AnimatePresence
→ motion.div
```

## D3 — APIs preservadas

### MotionPresence

Conserva:

- `present`;
- `motionKey?`;
- default key `"motion-presence"`.

### MotionSwitch

Conserva:

- `motionKey` obligatorio;
- siempre presenta un frame.

Ambos conservan sin cambios:

- preset;
- direction;
- mode;
- initial;
- transitionIntent;
- className;
- style;
- remaining motion div props.

`MotionAppFrame` no se exporta por ningún barrel público.

## D3 — verificación estática

```text
MotionPresence direct motion engine owners    0
MotionSwitch direct motion engine owners      0
MotionAppFrame public exposure                0
broken relative imports                       0
```

## D3 — tests

Nuevos:

- `state-phase-d3-motion-frame-ownership.test.ts`;
- `state-phase-d3-motion-frame-behavior.test.tsx`.

Cubren:

- owner único;
- wrappers sin mecánica duplicada;
- key contract opcional/obligatorio;
- MotionAppFrame interno;
- MotionPresence `present=false`;
- forwarding de host props;
- MotionSwitch siempre presente.

## Criterio de cierre D3 / Fase D

Debe pasar:

```text
internal-test typecheck
tests D3 dirigidos
regresión D2/public surface
pnpm validate
```

Si queda verde:

1. D3 se marca CERRADA;
2. Fase D completa se marca CERRADA;
3. se abre Fase E — slot/layout/recipes/types.

## Corrección del candidato D3

La primera validación D3 mostró:

```text
internal-test typecheck                     PASS
behavior D3                              3/3 PASS
regresión D2                            5/5 PASS
public surface                         17/17 PASS
ownership D3                            3/5 PASS
```

Los dos fallos eran falsos positivos del test de ownership.

Causa:

los wrappers ya no renderizan `<AnimatePresence>` ni lo importan como valor, pero conservan legítimamente el tipo público:

```text
AnimatePresenceProps["mode"]
```

El test prohibía la cadena genérica `AnimatePresence`, por lo que confundía dependencia de tipos con ownership de runtime.

Corrección:

- ahora prohíbe `<AnimatePresence`, que es la mecánica JSX duplicada real;
- además prohíbe un import de valor de `AnimatePresence` desde `framer-motion`;
- permite `AnimatePresenceProps` como type-only dependency.

No se modificó producto, API ni `MotionAppFrame`.
