# BITACORA CANÓNICA

## Objetivo actual

Preparar Zerina UI para `0.5.0` como un sistema visual coherente, rico y
mobile-first cuya personalidad se propaga desde pocos owners semánticos.

Proceso activo:

```text
Fase 7E — Typography + Control Density
```

Regla visual vigente:

> No agregar belleza por acumulación; hacer que la belleza se propague desde
> pocos owners semánticos.

## Invariantes vigentes

- un solo owner por mecánica;
- no legacy ni aliases deprecated;
- `usePress` conserva el ownership de la mecánica interactiva;
- `UIThemeProvider` conserva el ownership del theme;
- `UIViewportProvider` conserva la selección de viewport/density;
- `UIMotionProvider` conserva la política temporal;
- recipes semánticas traducen intención visual compartida;
- no componentes `Material*` / `Flutter*`;
- no nuevo mega-provider;
- no segunda fuente de motion;
- no segunda fuente de density;
- no segundo resolver responsive;
- no mapas locales paralelos de tone/surface/elevation/typography/state;
- la demo no es owner del sistema visual;
- si la demo revela un defecto de librería, se corrige primero en la librería;
- breaking changes son aceptables en pre-1.0;
- cada fase se cierra únicamente con validación canónica.

## Estado

- Fases 1–6: **CERRADAS Y VALIDADAS**.
- Fase 7A — Semantic Visual Foundation: **CERRADA Y VALIDADA**.
- Fase 7B — Dynamic Environment Projection: **CERRADA Y VALIDADA**.
- Fase 7C — Surface + Tone Recipes + Visual Cohesion:
  **CERRADA Y VALIDADA**.
- Fase 7D — Interactive Families: **CERRADA Y VALIDADA**.
- Fase 7E — Typography + Control Density:
  **IMPLEMENTADA, PENDIENTE DE VALIDACIÓN CANÓNICA**.
- Fase 7F — Visual Lab Demo: no iniciada.
- Fase 8 — release hardening / `0.5.0`: posterior.

El package continúa en `0.4.0`. El bump a `0.5.0` pertenece a Fase 8, después
de cerrar 7F y el hardening.

## Validación canónica cerrada de 7D

Librería:

```text
internal-test typecheck             PASS
Vitest files                        107 / 107
Vitest tests                        668 / 668
internal-test build                 PASS
Chromium                            72 / 72
package typecheck                   PASS
package pack / clean consumers      PASS
React 18 consumer                   PASS
React 19 consumer                   PASS
ESM / CJS / CSS entry smoke         PASS
git whitespace check                PASS
Validation complete                 PASS
```

Demo:

```text
Demo contract verification          PASS
sibling zerina-ui ESM/CJS/DTS       PASS
demo TypeScript                     PASS
demo production build               PASS
pnpm dev + Vite forced optimize     PASS
```

Por tanto 7D no conserva trabajo abierto.

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

`pnpm dev` de la demo sincroniza la librería y usa Vite con `--force` para no
ejecutar prebundles locales obsoletos.

## Owners visuales vigentes

```text
Theme semantic contract
├── toneRecipe
├── surfaceRecipe
├── interactiveStateRecipe
└── typographyRecipe
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

## Fase 7E — Typography

Nuevo owner:

```text
src/theme/recipes/typography-recipe.ts
```

`typographyRecipe` es el único traductor TypeScript de:

```text
display
headline
title
body
label
caption
```

hacia:

```text
fontFamily
fontSize
fontWeight
lineHeight
letterSpacing
```

Los consumidores TS/TSX no seleccionan directamente variables
`--ui-type-{role}-*`; declaran intención mediante `typographyRecipe`,
`Typography` o `Heading`.

`Typography` y `Heading` exponen:

```text
typographyRole
```

para no ocupar el atributo nativo/ARIA:

```text
role
```

Así una instancia puede tener, por ejemplo:

```text
typographyRole="caption"
role="status"
```

sin mezclar semántica tipográfica con accesibilidad.

Los props históricos `size` permanecen como overrides explícitos de tamaño
pre-1.0. No forman una segunda ontología tipográfica.

El reset global consume el role `body`, por lo que la personalidad tipográfica
del theme alcanza también texto plano.

## Fase 7E — Control Density

El Theme sigue definiendo las métricas disponibles y `UIViewportProvider`
continúa seleccionando la density efectiva.

Aliases activos ya proyectados desde 7B:

```text
--ui-density-control-height
--ui-density-item-min-height
--ui-density-inline-gap
--ui-density-block-gap
--ui-density-content-padding
--ui-density-icon-size
```

7E extiende su consumo a:

```text
Button / IconButton
Input / Select / Textarea
choice controls
List
Menu
NavigationList
BottomNavigation
NavigationRail
CommandPalette
DataTable
```

No existe un nuevo resolver de viewport, pointer o breakpoints en estas
familias.

Reglas:

- `compact / comfortable / spacious` siguen perteneciendo al vocabulario
  `UIDensity`;
- `NavigationDestinationDensity = UIDensity`;
- BottomNavigation y NavigationRail usan la density del
  `UIViewportProvider` cuando no hay override explícito;
- DataTable sin `dense` usa la density activa; `dense={true|false}` permanece
  como override explícito;
- tamaños de componente (`sm/md/lg`) conservan su intención local, pero sus
  métricas mínimas respetan la density del entorno;
- jerarquía/indentación semántica no se convierte en un segundo sistema de
  density.

## Regresiones de 7E

Nuevas:

```text
typography-control-density-phase-7e.test.tsx
typography-control-density-ownership-phase-7e.test.ts
```

Reforzadas:

```text
dynamic-environment-projection.chromium.spec.ts
browser-environment.tsx
semantics-phase-e4-type-equivalence.test.ts
public-surface-contract.test.ts
public-surface-types.test.ts
scripts/verify-package.mjs
```

La regresión Chromium existente de environment projection ahora comprueba
también geometría DOM real:

```text
comfortable
  ↓
Button / Input / List.Item

spacious
  ↓
sus alturas computadas aumentan
```

Eso valida propagación efectiva y no sólo presencia de atributos/variables.

El clean consumer del package importa y usa:

```text
toneRecipe
surfaceRecipe
interactiveStateRecipe
typographyRecipe
```

## Validación auxiliar disponible en este runtime

Estas comprobaciones no sustituyen `pnpm validate`:

```text
TS/TSX parse librería + demo        520 / PASS
syntax errors                         0
verify-package Node syntax          PASS
verify-demo Node syntax             PASS
demo contract verification          PASS
TYPOGRAPHY_ROLE_TOKENS owners          1
TS/TSX direct semantic type picks      0
hardcoded density="comfortable"        0
semantic typography via ARIA role      0
```

También se verificó estáticamente que BottomNavigation y NavigationRail
consumen `useOptionalUIViewport()` / `viewport?.density` y no introducen
`matchMedia`, `innerWidth` ni `clientWidth`.


## Último intento de validación canónica 7E

El gate de la librería ya supera typecheck, toda la suite Vitest y el build
interno.

Estado observado:

```text
internal-test typecheck             PASS
Vitest files                        109 / 109 PASS
Vitest tests                        676 / 676 PASS
internal-test build                 PASS
Chromium                            69 / 72 PASS
package typecheck                   no ejecutado en este intento
package verify                      no ejecutado en este intento
demo gate                           no ejecutado
```

Fallos Chromium observados:

```text
1. Button / IconButton sm-md-lg:
   diferencia de altura > 1 px.

2. Text controls:
   min-height esperado desde --ui-control-h-* resolvía a 0 px.

3. TopAppBar a 320 px:
   body.scrollWidth > body.clientWidth.
```

Causas consolidadas por inspección del source:

```text
- la proyección density-aware de sm/lg dependía de --ui-space-sm;
- los fixtures styles-only de Block 4 / Block 7 publican los tokens de
  control height pero no ese token de spacing;
- al quedar inválido el calc(), se perdía la métrica de control;
- TopAppBar permitía que el contenido intrínseco de leading/actions escapara
  visualmente del área flex ya negociada cuando los controles crecían por
  density.
```

Corrección consolidada en este estado:

```text
- sm/lg conservan su offset respecto a --ui-control-h-md usando únicamente
  --ui-control-h-sm/md/lg + --ui-density-control-height;
- action-control-recipe.ts y controls.css comparten esa misma semántica;
- no se añadió otro token, provider ni resolver responsive;
- leading / actions de TopAppBar contienen horizontalmente a sus hijos dentro
  del área flex negociada; center ya conservaba overflow contenido;
- se reforzaron tests de ownership para impedir que la proyección de altura
  vuelva a depender de spacing y para preservar los límites geométricos del
  TopAppBar.
```

Este ajuste todavía requiere rerun del gate canónico.

## No validado todavía

El runtime actual no sustituye el gate canónico de pnpm.

Pendiente sobre este mismo estado:

```text
library pnpm validate
demo pnpm validate
demo pnpm dev / revisión manual
```

No afirmar 7E cerrada hasta esos PASS.

## Gate requerido para cerrar 7E

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
- cambiar Vista entre Auto / Mobile / Tablet / Desktop;
- comprobar que controles cambian de densidad sin romper layout;
- comprobar Button, inputs, List/Menu y navegación;
- comprobar DataTable editable y responsive;
- cambiar themes y verificar personalidad tipográfica;
- consola sin errores;
- sin overlap ni overflow estructural.
```

## Siguiente paso tras PASS

Fase 7F — Visual Lab Demo.

Objetivo:

```text
demo realista
  ↓
escenarios canónicos de themes / density / motion / estados
  ↓
validación perceptual + geométrica
  ↓
Fase 8 hardening
  ↓
0.5.0
```

7F debe observar y demostrar los owners existentes, no crear un segundo sistema
visual.
