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

`src/primitives/navigation/shared/` contiene:

- `navigationSelection.ts`: estado controlled/uncontrolled y `change/reselect`;
- `NavigationDestinationItem.tsx`: render e interacción comunes de items.

`BottomNavigation` y `NavigationRail` conservan recipes, contextos y opciones propias.

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

## Arquitectura de tests

Los tests estructurales admitidos pertenecen a dos clases:

```text
A — ownership boundary
B — public/API contract
```

Los implementation snapshots de clase C se migran a behavior o a boundaries semánticos.

Al cierre del sweep F no quedan archivos `*source.test*` ambiguos.
