# Mapeo arquitectónico final — ciclo posterior a 0.3.0

## Propósito

Este documento describe el mapa **vigente** al cierre de F y durante G.

No conserva el orden histórico de cada refactor; registra owners, decisiones y diferencias que permanecen intencionalmente separadas.

## Estado del mapa

```text
P0 correctness / contratos       RESUELTO
P1 duplicación estructural       RESUELTO
P2 simplificaciones              RESUELTO o MANTENER SEPARADO
source-test bifurcation          RESUELTO
reachability                     LIMPIO
wrappers/residuos                DECIDIDOS
```

No quedan P0/P1 sin decisión.

## Correctness y contratos

### Dialogs orientados a target

Owners:

- `patterns/shared/targetDialogContract.ts`: tipo único de callback y resolución;
- `patterns/shared/TargetDialogFrame.tsx`: estructura visual compartida.

Contrato:

- `TargetDialogRender<T>` es siempre `(target: T) => ReactNode`;
- `renderDescription`, `renderTargetLabel`, `renderBody` y `renderFooter`
  son los únicos slots target-aware;
- no existe `ReactNode | function`;
- `FormDialog` cancela exactamente una vez;
- `TargetFormDialog` adapta target al contrato;
- ActionDialog y ConfirmDialog mantienen políticas distintas.

Decisión:

**UN SOLO CONTRATO DE RENDER, COMPARTIR FRAME, MANTENER SEMÁNTICAS DE CIERRE SEPARADAS**

### Eventos cancelables

Owners:

- `composeEventHandlerChain`;
- `composeEventHandlers`;
- `TriggerRuntime`;
- `usePressSlotBridge`.

Contrato transversal:

```text
public / child
→ local slot
→ inherited slot
→ internal behavior
```

`preventDefault()` detiene las capas posteriores salvo cleanup explícito con `checkDefaultPrevented:false`.

## Forms

### Text controls

Owner:

`useTextControlRuntime`

Consumidores:

- Input;
- Textarea.

Se mantiene markup nativo propio.

### Choice controls

Owner:

`useChoiceControlRuntime`

Consumidores:

- Checkbox;
- Radio;
- Switch.

Se conservan indicator/track/thumb y semánticas específicas.

### Action controls

Owner de bridge:

`usePressSlotBridge`

Consumidores migrados:

- Button;
- IconButton;
- Pressable;
- Card interactiva.

No existe `ButtonBase`.

### Controlled/uncontrolled simple

Owner:

`useControllableValue`

Consumidores simples migrados:

- Collapsible;
- Accordion;
- NavigationList;
- SearchInput;
- RadioGroup;
- UIMotionProvider;
- navigation selection;
- choice control.

Owners deliberadamente separados:

- `useNavigationEntries`;
- `AdaptiveScaffold`.

## Overlays

### Triggers

Owner:

`TriggerRuntime`

Modos:

```text
press
passive
```

Consumidores:

- Collapsible;
- Popover;
- Menu;
- Tooltip.

### Floating

Owner estructural:

`FloatingOverlayRuntime`

`FloatingLayer` conserva sólo posicionamiento.

Consumidores:

- PopoverContent;
- MenuContent;
- NavigationMenuPanel;
- TooltipContent.

Dismiss/focus específicos permanecen locales cuando la semántica difiere.

### Modal

Owner:

`ModalOverlayRuntime`

Consumidores:

- Dialog;
- Drawer;
- BottomSheet.

La modalidad controla atómicamente:

- backdrop;
- focus contain;
- scroll lock;
- `aria-modal`.

## State y shells

### DataTable

Owners:

- `useDataTableShell`;
- `DataTableShellFrame`;
- `DataTableDesktopBase`.

DataTable y EditableDataTable conservan su dominio de mutación/render.

### Navigation history

Owner:

`useNavigationEntries`

Consumidores:

- NavigationStack;
- TabScaffold.

No se migró AdaptiveScaffold.

### App motion

Owner:

`MotionAppFrame`

Wrappers públicos preservados:

- MotionPresence;
- MotionSwitch.

## Slots

Owners:

- `resolveSlot`;
- `resolveLayeredSlot`;
- `resolveSlotLayers`;
- `resolveContextualSlot`.

Precedencia declarativa:

```text
base
→ context layers broad-to-specific
→ local
→ direct className/style
```

Reglas:

- `className` concatena;
- `style` mergea;
- props normales usan last-defined-wins;
- `undefined` no borra;
- handlers declarativos no se componen automáticamente.

## Layout

Familias deliberadas:

```text
FULL FRAME
Flex / Grid / Stack
→ SizeProps + SpaceProps + SurfaceProps

FLOW FRAME
Inline / Wrap
→ SpaceProps + w + minH
```

Inline/Wrap soportan `mx/my`.

No se amplían con SurfaceProps ni todo SizeProps.

## Recipes

Owner:

`statusLabelRecipe`

Comparte Badge/Tag:

- schemes;
- solid/subtle/outline;
- tokens cromáticos;
- frame inline básico;
- truncado.

Se mantiene local:

- densidad Badge;
- densidad Tag;
- iconos/remove/interacción Tag.

## Tipos equivalentes

Se comparte owner sólo cuando coinciden **estructura y concepto**.

Owners internos:

- `shared-control-types.ts`;
- `navigation-shared.types.ts`;
- `feedback.types.ts`.

Aliases semánticos:

- PopoverPlacement → FloatingPlacement;
- DrawerPlacement → UIOverlayPlacement;
- NavigationStackTransitionDirection → UIMotionTransitionDirection;
- ListDensity → UIDensity;
- AlertVariant / ToastVariant → FeedbackVariant;
- BadgeSlot → StatusLabelRecipeSlot.

No se centralizan unions coincidentes de dominios distintos.

## Familias deliberadamente separadas

### BottomNavigation / NavigationRail

Comparten:

- navigation selection;
- NavigationDestinationItem;
- tipos semánticos comunes.

Mantienen layout/recipe propios.

### DataTableSkeleton / SkeletonTable

Existe composición explícita.

### ActionDialog / ConfirmDialog

Comparten TargetDialogFrame; difieren en política de acción/cierre.

### NavigationMenu / Tree

Comparten tree state; render y navegación difieren.

### HelpText / FormErrorMessage

Comparten FieldMessageFrame; nombres/roles públicos permanecen.

### MotionPresence / MotionSwitch

Comparten MotionAppFrame; presencia y `motionKey` difieren.

## Test architecture

Clases válidas:

```text
A — ownership boundary
B — public/API contract
```

Clase C implementation snapshot:

```text
0 residual
```

No quedan filenames ambiguos `*source.test*`.

## Segundo corte estructural

Comparación contra `0.3.0`:

```text
métrica                         0.3.0    final
TS/TSX productivos                291      305
alcanzables                        291      305
huérfanos                            0        0

resolveSlot files                  68       65
resolveLayeredSlot files            8        7
composeEventHandlers files         21       12
direct usePress calls              11        8
manual isControlled                 9        3
FloatingLayer JSX consumers         4        1
DismissableLayer JSX files          6        5
FocusScope JSX files                3        2
```

Residuo eliminado en F:

`navigationStack.motion.ts`, adapter identidad sin política.

Barrido final:

```text
imports relativos TS rotos        0
phase markers históricos          0
test/spec files bajo src          0
backup/generated residue           0
```

## Resultado del mapa

El mapa queda cubierto.

Las diferencias restantes tienen una justificación semántica explícita; no representan trabajo pendiente de deduplicación.

La única puerta restante es G: validación integrada y decisión de versión.
