# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase B: **CERRADA**.
- Fase C: **CERRADA**.
- Fase activa: **D — state engines y shells de producto**.
- D1 DataTable shell: **CERRADA**.
- D2 NavigationStack / TabScaffold: **CANDIDATO CORREGIDO — PENDIENTE DE VALIDACIÓN**.
- D3 MotionPresence / MotionSwitch: pendiente.
- No se asignó todavía una versión siguiente.

## Validación que cerró D1

```text
tests dirigidos D1       35/35 PASS
Vitest completo         474/474 PASS
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

## D1 — resultado vigente

Owners:

- `useDataTableShell`;
- `DataTableShellFrame`.

DataTable y EditableDataTable ya no duplican state/search/sort/pagination, responsive mode, row identity, selection, export, loading shell ni pagination.

Las mutaciones editables permanecen en EditableDataTable.

## D2 — decisión

NavigationStack y TabScaffold compartían un engine de historial real.

Nuevo owner interno:

`src/patterns/navigation-stack/useNavigationEntries.ts`

Posee:

- IDs y sequence;
- controlled/uncontrolled;
- normalización de vacío;
- transition direction;
- current/currentIndex/canGoBack;
- setEntries/updateEntries;
- push;
- replace;
- pop;
- popToRoot;
- reset.

## D2 — política de vacío

La diferencia no se expresa con un modo de producto.

Se expresa con:

```text
initialName: string | null
```

Semántica:

```text
null
→ historial vacío permitido

cualquier string, incluido ""
→ fallback entry válida
```

NavigationStack pasa `initialName` tal cual.

TabScaffold convierte “sin tab inicial válido” a `null`.

## D2 — ownership preservado

### NavigationStack

Conserva:

- screen registry;
- screen fallback;
- MotionSwitch;
- motion preset;
- NavigationStackContext.

### TabScaffold

Conserva:

- getInitialTab;
- getActiveTab;
- validación de tabs disabled;
- resetToTab;
- onTabChange;
- app bar;
- bottom navigation;
- scaffold composition.

## D2 — cleanup

Retirados:

- `createNavigationStackEntry`;
- `createTabScaffoldEntry`.

Ya no existen en los wrappers:

- React.useId para entries;
- entrySequenceRef;
- internalEntries;
- internalTransitionDirection.

`useNavigationEntries` no se exporta por API pública.

## D2 — tests

Nuevos:

- `state-phase-d2-navigation-entries-ownership.test.ts`;
- `state-phase-d2-navigation-entries-behavior.test.tsx`.

Cubren:

- owner único;
- helper interno no público;
- retiro de factories paralelos;
- push/replace/pop/popToRoot/reset;
- dirección de transición;
- controlled rejected update;
- diferencia `null` vs `""`;
- wiring real de NavigationStack;
- resetToTab real de TabScaffold.

## Verificación estática disponible

```text
broken relative imports                     0
NavigationStack local entry-state owners    0
TabScaffold local entry-state owners        0
```

## Criterio de cierre D2

Debe pasar:

```text
internal-test typecheck
tests D2 dirigidos
regresión state/family
pnpm validate
```

Sólo después se abre D3.

## Corrección del candidato D2

La primera validación detectó dos problemas en el test nuevo, no en el engine:

1. import `React` sin uso con `noUnusedLocals`;
2. una aserción que esperaba el swap de `MotionSwitch/AnimatePresence` de forma sincrónica.

Además, el test de `TabScaffold.resetToTab` provocaba un warning `act(...)` al cambiar realmente el `motionKey`.

Corrección:

- se retiró el import inutilizado;
- NavigationStack prueba ahora el wiring mediante `onEntriesChange` + transition direction;
- TabScaffold se prueba en modo controlled y rechazado:
  - `resetToTab("settings")` emite entries `["settings"]`;
  - direction `replace`;
  - `onTabChange("settings")`;
  - el render controlado permanece en `home`;
  - no cambia el motionKey, por lo que el test no depende del lifecycle asíncrono de Framer Motion.

No cambió `useNavigationEntries` ni el producto.

## Segunda corrección del candidato D2

La segunda validación fue funcionalmente verde:

```text
tests dirigidos D2       33/33 PASS
Vitest completo         487/487 PASS
Chromium                  65/65 PASS
Validation complete.
```

pero el test de wiring de NavigationStack todavía provocaba un warning `act(...)` de AnimatePresence.

Causa:

el test usaba NavigationStack uncontrolled. `navigation.push()` actualizaba realmente el stack y cambiaba el `motionKey`, por lo que Framer Motion programaba su lifecycle interno después del `act` del click helper.

Corrección:

NavigationStack se prueba ahora en modo controlled/rejected, igual que TabScaffold:

```text
entries=["home"]
transitionDirection="replace"
push("detail")
→ onEntriesChange(["home","detail"], "forward")
→ render controlado permanece en home
→ motionKey no cambia
```

Esto prueba el wiring real del shared history owner sin hacer depender D2 del lifecycle asíncrono de MotionSwitch, que pertenece a D3.

No cambió producto ni `useNavigationEntries`.
