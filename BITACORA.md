# BITACORA

## Objetivo actual

Refactorizar `zerina-ui` sin obligaciones de compatibilidad histórica, eliminando procesos duplicados y dejando un único owner por mecánica transversal.

La demo permanece como consumidor real para la fase de integración posterior.

## Invariantes vigentes

- no mantener legacy ni aliases deprecated para responsabilidades eliminadas;
- no conservar dos procesos para la misma mecánica;
- actualizar consumidores y pruebas al owner único;
- no ocultar errores mediante casts;
- no dejar implementaciones parciales;
- cada extracción debe tener regresiones;
- la evolución apunta semánticamente a `0.5.0`.

## Estado actual

- Fase 1 — superficie pública + package gate: **CERRADA Y VALIDADA**.
- Fase 2A — fundamentos unificados: **CERRADA Y VALIDADA**.
- Fase 2B — Navigation Destinations: **CERRADA Y VALIDADA**.
- Fase 2C — ownership de Scaffold: **CERRADA Y VALIDADA**.
- Fase 3 — Navigation Presenter / política responsive: **IMPLEMENTADA, PENDIENTE DE `pnpm validate`**.
- Fase 4 — dialog contextual typing: no iniciada.

## Fase 3 — arquitectura implementada

```text
NavigationNode[]
      ↓
getNavigationNodeEntries
      ↓
projectCompactNavigation
      ↓
NavigationPresenter
      ↓
BottomNavigation / NavigationRail / NavigationList / DrawerNavigation
      ↓
AdaptiveScaffold placement
```

### Árbol

Owner estructural:

```text
src/patterns/navigation/navigation.utils.ts
```

`getNavigationNodeEntries` es el único walker recursivo del árbol.

Derivan de él:

- búsqueda por id;
- ancestry/path;
- active-parent;
- primer destino seleccionable;
- detección de containment;
- proyección compacta.

Retirado:

```text
flattenNavigationNodes
```

`NavigationList` ya no posee un segundo traversal para active-parent.

### Proyección compacta

Owner:

```text
src/patterns/navigation/navigationProjection.ts
```

Política:

- bottom y rail usan exactamente la misma proyección;
- orden depth-first estable;
- group-only parents no ocupan destino compacto;
- parent `selectable=true` sí es destination;
- destinations disabled permanecen visibles y disabled;
- default bottom: 5 slots;
- default rail: 7 slots;
- cuando hay overflow, el último slot se reserva para `Más`;
- `Más` abre un drawer con el árbol completo;
- si el active destination está en overflow, `Más` queda activo.

### Presenter

Owner:

```text
src/patterns/navigation/NavigationPresenter.tsx
```

Presentaciones soportadas:

```text
bottom
rail
sidebar
drawer
```

Responsabilidades:

- bottom/rail consumen `projectCompactNavigation`;
- sidebar usa el árbol completo;
- drawer usa el árbol completo;
- overflow de compact abre un único `DrawerNavigation`;
- placement semántico usa `NavigationSide = "start" | "end"`.

El estado del drawer de overflow se limpia cuando cambia la presentación
o deja de existir overflow.

### AdaptiveScaffold

`AdaptiveScaffold` ya no:

- itera `items`;
- renderiza `BottomNavigation`;
- renderiza `NavigationRail`;
- renderiza `NavigationList`;
- decide flattening;
- decide overflow.

Sólo resuelve modo + placement y delega built-ins a:

```text
NavigationPresenter
```

Existe un solo canal:

```ts
navigation={{
  mobile: { presentation: "bottom" },
  tablet: { presentation: "rail", placement: "end" },
  desktop: { presentation: "sidebar" },
  compact: {
    maxVisible: {
      bottom: 5,
      rail: 7,
    },
  },
  bottom: {},
  rail: {},
  list: {},
  drawer: {},
}}
```

Retirados de `AdaptiveScaffold`:

```text
mobileNavigation
tabletNavigation
desktopNavigation
navigationSlots
bottomNavigationProps
navigationRailProps
navigationListProps
```

No hay aliases de compatibilidad.

`bottomNavigationProps` continúa existiendo únicamente en `TabScaffold`,
donde configura una navegación de tabs con semántica propia; no es un
segundo canal de AdaptiveScaffold.

### Tipos semánticos compartidos

Owner:

```text
src/patterns/navigation/navigation.types.ts
```

Añadidos:

```text
NavigationActiveBehavior
NavigationPresentation
NavigationSide
NavigationNodeEntry
```

`NavigationNodeEntry` es infraestructura interna; no forma parte del barrel raíz.

### Superficie pública nueva

Runtime:

```text
NavigationPresenter
```

Tipos:

```text
NavigationActiveBehavior
NavigationPresentation
NavigationSide
NavigationCompactPolicy
NavigationCompactPresentation
NavigationPresenterProps
NavigationPresenterBottomProps
NavigationPresenterRailProps
NavigationPresenterListProps
NavigationPresenterDrawerProps
AdaptiveScaffoldNavigation
AdaptiveScaffoldMobileNavigationConfig
AdaptiveScaffoldTabletNavigationConfig
AdaptiveScaffoldDesktopNavigationConfig
```

## Regresiones de Fase 3

Añadidas:

```text
internal-test/tests/navigation-projection-phase-3.test.ts
internal-test/tests/navigation-presenter-phase-3.test.tsx
internal-test/tests/navigation-presenter-ownership-phase-3.test.ts
internal-test/tests/navigation-presenter-public-contract-phase-3.test.ts
```

Actualizados:

```text
internal-test/tests/public-surface-types.test.ts
internal-test/tests/scaffold-ownership-phase-2c.test.tsx
internal-test/src/AdaptiveScaffoldDebug.tsx
internal-test/src/app/DocumentationLayout.tsx
scripts/verify-package.mjs
```

El clean consumer de package verification ahora importa y usa
`NavigationPresenter`, `NavigationPresenterProps`,
`AdaptiveScaffoldNavigation`, `NavigationCompactPolicy`,
`NavigationPresentation` y `NavigationSide`.

## Validación realizada en este runtime

No hay dependencias instaladas para ejecutar el gate canónico completo.

Sí se verificó:

- 461 archivos TS/TSX parseados;
- 0 errores sintácticos;
- imports relativos productivos rotos: 0;
- ciclos runtime productivos: 0;
- módulos TS/TSX productivos no alcanzables desde `src/index.ts`: 0;
- named re-exports locales inválidos: 0;
- `node --check scripts/verify-package.mjs`: PASS;
- `getNavigationNodeEntries` implementations: 1;
- traversal local en `navigationProjection`: 0;
- renders directos Bottom/Rail/List dentro de AdaptiveScaffold: 0;
- `items.map` dentro de AdaptiveScaffold: 0;
- `<NavigationPresenter` dentro de AdaptiveScaffold: 1;
- contratos retirados en `AdaptiveScaffoldProps`: 0;
- runtime cycles introducidos: 0;
- whitespace nuevo detectado en los 24 archivos modificados: 0;
- typecheck estricto aislado de tree + projection: PASS;
- ejecución aislada de la proyección nested/overflow: PASS;
- typecheck semántico aislado de `NavigationPresenter`: PASS;
- typecheck semántico aislado de `AdaptiveScaffold` con sus contratos nuevos: PASS.

Estas comprobaciones no sustituyen `pnpm validate`.

## No validado

Falta el gate canónico del usuario:

```bash
pnpm install
pnpm validate
```

Fase 3 NO está cerrada hasta obtener `Validation complete.`.

## Siguiente paso tras el PASS

Fase 4 — corregir contextual typing de dialogs sin mantener el contrato ambiguo
`ReactNode | ((target) => ReactNode)`.

La solución debe mantener una sola forma de render props y no introducir
aliases legacy.
