# Arquitectura vigente

## Propósito

`zerina-ui` es una librería React/TypeScript con estilos distribuibles. Su arquitectura observable combina composición visual, interacción, overlays, tema y patrones de interfaz.

## Capas

```text
Aplicación consumidora
        │
        ▼
Patterns / Components
        │
        ▼
Primitives
        │
        ├───────────────┐
        ▼               ▼
Core transversal      Theme
overlay               tokens
interaction           runtime / SSR
motion
viewport
        │               │
        └──────┬────────┘
               ▼
         ZerinaProvider
```

### `src/primitives/`

Contratos reutilizables de bajo nivel: layout, forms, overlay, navegación y otras primitivas. Deben concentrar semánticas básicas y evitar que los patrones reimplementen utilidades de accesibilidad o interacción.

### `src/components/`

Componentes de producto más concretos que combinan primitivas y estilos.

### `src/patterns/`

Composiciones con significado de interfaz mayor: scaffolds, settings, navegación y patrones relacionados. Pueden expresar semántica propia, pero no deberían copiar mecánica transversal ya resuelta por primitivas/core.

### `src/core/`

Infraestructura transversal. En el estado actual destaca:

- overlay;
- interacción/trigger;
- motion;
- viewport.

Esta capa es crítica porque un cambio puede propagarse a muchos componentes.

### `src/theme/`

Tokens, resolución de tema, estilo runtime/SSR y contratos asociados.

### `src/provider/`

`ZerinaProvider` compone proveedores transversales. La composición observada incluye overlay, viewport, motion, theme y toast.

## Distribución CSS

- `src/styles.css` agrega los estilos funcionales de la librería.
- `src/reset.css` es una exportación separada y opcional.
- `package.json` declara CSS como `sideEffects`, evitando que bundlers lo eliminen de forma incorrecta.

## Superficie pública

`src/index.ts` expone una superficie amplia: primitivas, patrones, componentes, tema y parte del core transversal.

La superficie raíz se protege mediante `public-surface-contract.test.ts` y la verificación del tarball real.

Los conteos aproximados de exports usados durante la auditoría inicial no forman parte del contrato: el contrato vigente son los entry points declarados, los símbolos públicos intencionales y el paquete efectivamente distribuido.

## Reglas arquitectónicas vigentes

1. No preservar una abstracción sólo porque ya existe.
2. No duplicar mecánica transversal en patrones cuando puede vivir en una primitiva/core compartido.
3. No fusionar componentes semánticamente distintos únicamente por similitud de código.
4. Extraer el núcleo común y mantener en cada componente únicamente la diferencia que justifica su existencia.
5. No introducir wrappers/aliases de compatibilidad sin consumidor o restricción vigente.
6. Los contratos de accesibilidad, eventos, controlado/no controlado y overlays deben tener una única interpretación reutilizable.

## Motores internos compartidos

Las familias públicas pueden conservar componentes distintos cuando expresan semánticas o layouts diferentes, pero la mecánica idéntica debe tener un único owner.

### Navegación de destinos

`src/primitives/navigation/shared/` contiene los owners únicos de la familia:

- `navigationSelection.ts`: estado controlled/uncontrolled y `change/reselect`;
- `navigationDestination.types.ts`: contrato base de props root/item;
- `navigationDestinationContext.tsx`: contrato y factory de contexto;
- `navigationDestinationState.ts`: resolución de overrides de item;
- `navigationDestination.styles.ts`: base recipe, densidad, shape, badge placement y data-attributes;
- `createNavigationDestinationItem.tsx`: adapter único de item;
- `NavigationDestinationItem.tsx`: render e interacción final comunes.

`BottomNavigation` y `NavigationRail` conservan únicamente las diferencias reales de presentación:

- horizontal vs vertical;
- alto vs ancho;
- `iconPosition` en bottom;
- `placement`, `alignment`, `header/footer` e `itemMinHeight` en rail;
- recipe de root y geometría específica del indicator.

Los conceptos compartidos usan un solo vocabulario público `NavigationDestination*` / `NavigationSurface*`; no existen aliases por familia para el mismo dominio.

### DataTable desktop

`DataTableDesktopBase.tsx` es el único owner de la estructura desktop:

- sorting;
- selección;
- slots;
- filas/celdas;
- empty state.

`DataTableDesktop` aporta lectura/render de datos.
`DataTableEditableDesktop` aporta edición de celdas.

### Diálogos orientados a target

`patterns/shared/TargetDialogFrame.tsx` posee la estructura visual y resolución de contenido por target.

`ConfirmDialog` conserva semántica de confirmación y cierre async.
`ActionDialog` conserva semántica de acción.

### Overlay lateral/inferior

`primitives/overlay/shared/ModalOverlayRuntime.tsx` es el owner común de:

- presence/motion;
- backdrop;
- dismiss;
- focus containment/initial focus;
- focus restore;
- scroll lock;
- portal.

`Drawer` y `BottomSheet` conservan sus recipes, slots públicos y contenido familiar, pero no duplican el runtime modal.

## Owners transversales consolidados

El ciclo posterior a `0.3.0` terminó concentrando las decisiones transversales en owners explícitos.

```text
events
→ composeEventHandlerChain / composeEventHandlers

press
→ usePress
→ usePressSlotBridge

controlled simple state
→ useControllableValue

triggers
→ TriggerRuntime

floating overlays
→ FloatingOverlayRuntime

modal overlays
→ ModalOverlayRuntime

dialogs por target
→ TargetDialogFrame

text controls
→ useTextControlRuntime

choice controls
→ useChoiceControlRuntime

data tables
→ useDataTableShell + DataTableShellFrame

navigation history
→ useNavigationEntries

app motion
→ MotionAppFrame

slot precedence
→ resolveSlotLayers / resolveContextualSlot

status labels
→ statusLabelRecipe

responsive component resolution
→ useAdaptiveViewport
→ resolveUIViewportBreakpoints / resolveUIViewportKind

safe-area
→ helpers/safeArea.ts
→ variables normalizadas --ui-safe-*-offset

scroll mechanics
→ ScrollArea
```

## Reachability y residuos

Segundo corte estructural:

```text
TS/TSX productivos                 305
alcanzables desde src/index.ts     305
huérfanos                            0
imports relativos TS rotos           0
```

El único adapter identidad detectado durante F fue eliminado:

`patterns/navigation-stack/navigationStack.motion.ts`.

Los wrappers pequeños que permanecen lo hacen por diferencia de contrato público, no por compatibilidad histórica.

En la consolidación 2A se eliminó `PageScroll`: no tenía semántica propia y reimplementaba el motor de `ScrollArea`. También se retiraron los aliases de safe-area duplicados; `SafeAreaEdges` es el contrato único.

## Arquitectura de tests

Los tests estructurales admitidos pertenecen a dos clases:

```text
A — ownership boundary
B — public/API contract
```

Los implementation snapshots de clase C se migran a behavior o a boundaries semánticos.

Al cierre de F no quedan archivos `*source.test*` ambiguos. G no modifica esta arquitectura; sólo la valida de forma integrada.

## Ownership de shell y contenido

La consolidación 2C deja una sola cadena de ownership para pantallas:

```text
Screen
→ root físico + viewport + safe-area externo

Scaffold
→ appBar + body + floating + footer

ScreenContent
→ layout semántico del contenido + opción de scroll

ScrollArea
→ única mecánica de scroll
```

No existen ya:

```text
Screen.Scroll
Scaffold.scrollable
Scaffold.scrollProps
Scaffold.screenProps
```

`Scaffold` recibe directamente las capacidades del `Screen` raíz
(`safeArea`, `topInset`, `bottomInset`, eventos, data/aria, className y
style). El contenido que necesita desplazamiento usa `ScreenContent
scrollable` o, cuando no existe semántica de pantalla, el primitive
`ScrollArea`.

`AdaptiveScaffold` y `TabScaffold` especializan este shell pero no
adquieren un segundo owner de scroll.

### Navegación dentro del shell

La Fase 3 separa árbol, proyección, presentación y placement:

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

`getNavigationNodeEntries` es el único walker estructural del árbol.
Búsqueda, ancestry, primer destino seleccionable, active-parent y
proyección compacta derivan de esa representación.

`NavigationPresenter` es el único owner de las presentaciones built-in:

- `sidebar` y `drawer` preservan la jerarquía completa;
- `bottom` y `rail` comparten `projectCompactNavigation`;
- los parents que son sólo grupos no ocupan un destino compacto;
- los destinations anidados sí son alcanzables en compact;
- cuando se excede el límite se reserva un único destino `Más`;
- `Más` abre un `DrawerNavigation` con el árbol completo;
- si el destino activo está en overflow, `Más` representa el estado activo.

Los límites por defecto son 5 destinos para bottom y 7 para rail,
incluyendo el slot `Más` cuando existe overflow.

`AdaptiveScaffold` ya no proyecta ni renderiza items. Su único contrato
responsive es `navigation`, y su responsabilidad termina en elegir la
presentación del modo y colocar el `NavigationPresenter` o el contenido
custom.

```text
navigation.mobile
navigation.tablet
navigation.desktop
navigation.compact
navigation.bottom
navigation.rail
navigation.list
navigation.drawer
```

El custom navigation de un modo reemplaza completamente la presentación
built-in de ese modo. `TabScaffold` no se fusiona con
`AdaptiveScaffold`: comparte infraestructura de navegación, pero mantiene
su semántica de tabs raíz + historial.
