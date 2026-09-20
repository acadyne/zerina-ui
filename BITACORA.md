# BITACORA CANÓNICA

## Objetivo actual

Preparar Zerina UI para `0.5.0` como un sistema visual rico, coherente y
mobile-first cuya personalidad se propaga desde pocos owners semánticos.

Proceso activo:

```text
Fase 7D — Interactive Families
```

La referencia de calidad es una interfaz sistémica comparable en coherencia a
Material/Flutter, sin copiar su API, sus componentes ni abrir familias
paralelas.

Regla visual:

> No agregar belleza por acumulación; hacer que la belleza se propague desde
> pocos owners semánticos.

## Invariantes vigentes

- no legacy ni aliases deprecated;
- un solo owner por mecánica;
- `usePress` conserva el ownership de la mecánica interactiva;
- recipes semánticas poseen la proyección visual compartida;
- no componentes `Material*` / `Flutter*`;
- no nuevo mega-provider;
- no segunda fuente de motion;
- no segunda fuente de density;
- no segundo resolver responsive;
- no mapas locales de tone/surface/elevation/state-layers por componente;
- la demo no es owner del sistema visual;
- la demo no oculta defectos de la librería;
- si un defecto pertenece a la librería se corrige primero allí;
- breaking changes son aceptables en pre-1.0;
- cada fase se cierra únicamente con validación canónica.

## Estado

- Fases 1–6: **CERRADAS Y VALIDADAS**.
- Fase 7A — Semantic Visual Foundation: **CERRADA Y VALIDADA**.
- Fase 7B — Dynamic Environment Projection: **CERRADA Y VALIDADA**.
- Fase 7C — Surface + Tone Recipes + Visual Cohesion:
  **CERRADA Y VALIDADA**.
- Fase 7D — Interactive Families:
  **IMPLEMENTADA, PENDIENTE DE VALIDACIÓN CANÓNICA**.
- Fase 7E — Typography + Control Density: no iniciada.
- Fase 7F — Visual Lab Demo: no iniciada.
- Fase 8 — release hardening / `0.5.0`: posterior.

El usuario confirmó que los gates de librería y demo del último estado 7C
pasaron. Ese gate incluye las estabilizaciones de DataTable, app bars
responsive, recipes de surface/tone y la demo visual coherente.

## Topología canónica

```text
prod/
├── zerina-ui/
└── zerina-ui-demo/
```

La demo consume:

```json
"zerina-ui": "file:../zerina-ui"
```

`pnpm dev` de la demo sincroniza la librería y fuerza la reoptimización de Vite
para evitar prebundles locales obsoletos.

## Owners visuales vigentes

```text
Theme semantic contract
├── toneRecipe
├── surfaceRecipe
└── interactiveStateRecipe
        ↓
existing component families
```

Owners funcionales preservados:

```text
UIThemeProvider
UIViewportProvider
UIMotionProvider
usePress
slot recipes
```

### `toneRecipe`

Owner de:

```text
UITone + emphasis
→ foreground / background / border
```

### `surfaceRecipe`

Owner de:

```text
UISurfaceRole + UIElevation + UIShape + border
→ surface style
```

### `interactiveStateRecipe` — 7D

Nuevo owner visual de:

```text
rest
hover
focus-visible
pressed
selected
disabled
```

Contrato:

```text
usePress
  = detecta y publica estado interactivo

interactiveStateRecipe
  = calcula variables visuales semánticas

interactive-state.css
  = proyecta data-* canónicos a CSS efectivo
```

`interactiveStateRecipe` no registra eventos, no contiene hooks y no crea
providers.

State-layer strengths viven en un solo lugar:

```text
hover    8%
focus   10%
pressed 14%
```

Las elevaciones de estado se resuelven mediante `surfaceRecipe`; no existe un
segundo mapa de elevación.

Focus y disabled reutilizan los tokens de interacción existentes:

```text
--ui-interaction-focus-ring-*
--ui-interaction-disabled-opacity
```

## Familias migradas en 7D

La proyección compartida cubre las familias que usan el vocabulario canónico de
press state:

```text
Button
IconButton
ControlAction
MenuItem
List interactiva
FloatingActionButton
Card interactiva
Tag remove
Toast close
CommandTrigger
NavigationList
BottomNavigation / NavigationRail destinations
```

`Button` e `IconButton` consumen el owner mediante `action-control-recipe`.

`Pressable` y `TriggerRuntime` permanecen como mecánica sin personalidad
visual. No se les agregó un styling owner.

Controles de texto/choice, DataTable selection, Tree selection y la opción
activa de CommandPalette conservan sus semánticas especializadas cuando no
representan el vocabulario `usePress` compartido.

## Cleanup de ownership

Retirado del source de producto:

```text
--ui-action-*
SCHEME_MAP
hover/pressed CSS local en familias migradas
```

Invariante reforzada:

```text
data-hovered / data-pressed en CSS
→ sólo interactive-state.css
```

Los CSS de familia pueden conservar geometría, layout o estados funcionales
especializados, pero no recrear state layers genéricos.

También se corrigieron dos bordes detectados durante la implementación:

- `Card` estático conserva la elevación de `surfaceRecipe` cuando no existe
  override `shadow`; la Card interactiva deja el shadow a
  `interactiveStateRecipe`;
- `MenuItem` y Card interactiva ya no bloquean el focus ring compartido con
  `outline: none` inline/local.

## Contrato público

`interactiveStateRecipe` y sus tipos se exportan desde `zerina-ui`.

El clean-consumer de `scripts/verify-package.mjs` ahora importa y usa:

```text
toneRecipe
surfaceRecipe
interactiveStateRecipe
```

para comprobar que las recipes semánticas forman parte del package real y no
sólo del source interno.

## Regresiones de 7D

Nuevas:

```text
interactive-state-recipe-phase-7d.test.ts
interactive-state-recipe-ownership-phase-7d.test.ts
```

Reforzadas:

```text
forms-block7-architecture-contract.test.ts
forms-block7-behavior.test.tsx
public-surface-contract.test.ts
forms-block7.chromium.spec.ts
scripts/verify-package.mjs
```

La regresión Chromium añadida comprueba sobre un Button real:

```text
rest
→ hover cambia surface
→ pressed cambia surface nuevamente
```

El test de ownership recorre CSS de producto y falla si reaparecen
`data-hovered` o `data-pressed` fuera del owner compartido.

## Demo

7D no añade un nuevo sistema visual a la demo.

Permanece vigente el estado validado de 7C:

- `Zerina Workspace` como experiencia principal;
- una sola entrada `Apariencia`;
- theme + viewport desde sus providers existentes;
- shell responsive sin superposición;
- iconografía Lucide coherente;
- DataTable responsive/estable;
- Visual System como observador, no segundo mutador de theme.

La demo consume los cambios interactivos indirectamente desde la librería.

## Validación disponible en este runtime

Estas comprobaciones son auxiliares y no sustituyen el gate canónico:

```text
TS/TSX parse librería + demo        517 / PASS
syntax errors                         0
interactive recipe strict typecheck PASS
verify-package Node syntax          PASS
demo contract verification          PASS
STATE_LAYER_STRENGTH owners           1
legacy --ui-action-* in src           0
legacy SCHEME_MAP in src              0
CSS local data-hovered/pressed         0
```


## Último intento canónico de 7D

El último gate real de la librería superó typecheck y llegó a Vitest:

```text
internal-test typecheck             PASS
Vitest files                        106 / 107
Vitest tests                        667 / 668
internal-test build                 no ejecutado
Chromium                            no ejecutado
package gate                        no ejecutado
demo gate                           no ejecutado
```

El único fallo fue una regresión de **test de ownership**, no de producto:

```text
interactive-state-recipe-ownership-phase-7d.test.ts
→ "keeps List background ownership static-only..."
```

Causa confirmada:

el test buscaba un `background` dentro de un selector exacto
`[data-ui-list-item] { ... }` mediante:

```text
[\s\S]*?
```

Ese patrón atraviesa cierres `}`. Por ello comenzaba en una regla de motion que
contiene `[data-ui-list-item] { transition-duration: ... }` y terminaba
encontrando el `background` de una regla estática posterior:

```text
[data-ui-list-item]:not([data-interactive]) { background: ... }
```

La implementación de producto ya expresa correctamente el ownership:

```text
List estática
  → list.css puede poseer background

List interactiva
  → interactiveStateRecipe posee background de estados
```

Corrección aplicada:

```text
ownership test
  → limita la búsqueda al mismo bloque CSS con [^}]*
  → ya no cruza reglas independientes
```

No se modificó:

```text
list.css
interactiveStateRecipe
usePress
API pública
```

Las dos correcciones de Chromium del intento anterior (List hover y FAB
focus-visible) siguen pendientes de revalidación porque este gate se detuvo en
Vitest antes de volver a ejecutar Chromium.

Estado:

```text
7D  IMPLEMENTADA, PENDIENTE DE RERUN CANÓNICO
```

## Gate requerido para cerrar 7D

Primero librería:

```bash
cd /Users/fabian/desarrollo/repositorios/prod/zerina-ui
pnpm install
pnpm validate
```

Después demo:

```bash
cd /Users/fabian/desarrollo/repositorios/prod/zerina-ui-demo
pnpm install
pnpm validate
pnpm dev
```

Revisión manual mínima:

```text
- Button/IconButton: hover, focus-visible, pressed y disabled coherentes;
- FAB/Card interactiva: elevación cambia sin saltos;
- Menu/List/navigation: estados comparten el mismo lenguaje;
- theme switching conserva personalidad sin branches por componente;
- mobile/tablet/desktop siguen sin overlap/overflow;
- DataTable conserva edición/selección estable;
- consola sin errores.
```

7D sólo se cierra con ambos gates en PASS y revisión runtime satisfactoria.

## Siguiente paso tras PASS

Fase 7E — Typography + Control Density.

Objetivo previsto:

```text
Theme typography/density
        ↓
roles y métricas activas
        ↓
controles existentes
```

7E no debe crear otro sistema de typography ni otro resolver de density.
