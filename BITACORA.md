# BITACORA CANÓNICA

## Objetivo actual

Evolucionar Zerina UI hacia un sistema visual rico, dinámico y mobile-first sin
crear componentes paralelos ni perder los owners funcionales ya consolidados.

La riqueza visual debe propagarse desde pocos contratos semánticos compartidos.

## Invariantes vigentes

- no legacy ni aliases deprecated;
- un solo owner por mecánica;
- no componentes `Material*` / `Flutter*`;
- no nuevo mega-provider;
- no segunda fuente de motion;
- no segunda fuente de density;
- no mapas globales de tone/elevation/surface por componente;
- la demo no oculta defectos de la librería;
- breaking changes son aceptables en pre-1.0;
- cada subfase se cierra únicamente con validación canónica;
- si la demo revela un bug de librería, se corrige primero en la librería.

## Estado

- Fase 1 — superficie pública + package gate: **CERRADA Y VALIDADA**.
- Fase 2A — fundamentos unificados: **CERRADA Y VALIDADA**.
- Fase 2B — Navigation Destinations: **CERRADA Y VALIDADA**.
- Fase 2C — ownership de Scaffold: **CERRADA Y VALIDADA**.
- Fase 3 — Navigation Presenter: **CERRADA Y VALIDADA**.
- Fase 4 — dialog contextual typing: **CERRADA Y VALIDADA**.
- Fase 5 — RoutedAdaptiveScaffold metadata generic: **CERRADA Y VALIDADA**.
- Fase 6 — integración de demo: **CERRADA Y VALIDADA**.
- Fase 7A — Semantic Visual Foundation: **CERRADA Y VALIDADA**.
- Fase 7B — Dynamic Environment Projection: **IMPLEMENTADA, PENDIENTE DE VALIDACIÓN CANÓNICA**.
- Fase 7C — Surface + Tone Recipes: no iniciada.
- Fase 7D — Interactive Families: no iniciada.
- Fase 7E — Typography + Control Density: no iniciada.
- Fase 7F — Visual Lab Demo: no iniciada.
- Fase 8 — release hardening / `0.5.0`: posterior.

## Topología canónica

```text
prod/
├── zerina-ui/
└── zerina-ui-demo/
```

La demo consume exclusivamente:

```json
"zerina-ui": "file:../zerina-ui"
```

No existe vendor paralelo ni workspace anidado.

## Fase 7A — cierre validado

La base semántica vigente conserva:

```text
UITone
UISurfaceRole
UIElevation
UITypographyRole
UIShape
```

`THEME_TOKEN_MANIFEST` sigue siendo el único registro de tokens de theme.

Vigente:

```text
surface.canvas
surface.surface
surface.containerLow
surface.container
surface.containerHigh

elevation.level0 ... level5

density.compact
density.comfortable
density.spacious
```

Retirado sin aliases:

```text
surface.bg
surface.surface2
surface.surface3
shadow.*
--ui-bg
--ui-surface-2
--ui-surface-3
--ui-shadow-*
```

Validación canónica reportada por el usuario:

```text
zerina-ui
  internal-test typecheck          PASS
  Vitest                           98 / 98 files
  tests                            636 / 636
  internal-test build              PASS
  Chromium                         65 / 65
  package typecheck                PASS
  package build/pack               PASS
  clean consumer React 18          PASS
  clean consumer React 19          PASS
  ESM/CJS/CSS runtime smoke        PASS
  git whitespace check             PASS
  pnpm validate                    PASS

zerina-ui-demo
  Demo contract verification       PASS
  zerina-ui ESM/CJS/DTS            PASS
  demo TypeScript                  PASS
  demo Vite production build       PASS
  pnpm validate                    PASS
```

La primera ejecución manual de la demo encontró un prebundle antiguo de Vite
que rechazaba tokens nuevos. El source y los builds eran correctos. Se confirmó
la causa al ejecutar:

```bash
pnpm sync:ui
pnpm exec vite --force
```

Después de reoptimizar, la demo levantó correctamente y la revisión manual no
reportó defectos de 7A.

## Fase 7B — Motion: owner y proyección

Owner vigente:

```text
UIMotionProvider
```

Fuente numérica canónica:

```text
src/core/motion/motion.tokens.ts
```

Ahora `motion.tokens.ts` contiene una sola definición para:

```text
durations
easings
distances
scales
```

y genera una única proyección de valores canónicos mediante:

```text
getMotionCSSProjection()
```

`UIMotionProvider` escribe en `document.documentElement`:

```text
data-ui-motion
data-ui-motion-effective
data-ui-reduced-motion

--ui-motion-token-duration-*
--ui-motion-token-ease-*
--ui-motion-token-distance-*
--ui-motion-token-scale-*
```

La escritura conserva ownership del estado previo y restaura únicamente
propiedades que todavía contienen el último valor escrito por el provider.

`motion.css` usa `data-ui-motion-effective` como interruptor CSS y traduce esos
valores canónicos a los aliases funcionales existentes:

```text
--ui-duration-*
--ui-ease-*
--ui-motion-distance-*
--ui-motion-scale-*
```

No mantiene una segunda tabla numérica de durations/easings.

Consecuencia:

```text
effectiveLevel subtle/expressive
  -> aliases apuntan a la paleta canónica

effectiveLevel reduced
  -> CSS prácticamente instantáneo + geometría estática

effectiveLevel none
  -> duración CSS 0 + geometría estática
```

La excepción JS existente para motion de intent `layout` en nivel `reduced`
permanece donde sí existe semántica de intent; CSS genérico no inventa un
segundo clasificador.

Framer Motion y CSS derivan del mismo owner numérico, y el atributo efectivo
tiene efecto real sobre CSS.

## Fase 7B — Density: selección y proyección

Ownership vigente:

```text
Theme
  = define compact / comfortable / spacious metrics

UIViewportProvider
  = selecciona density efectiva
  = publica data-ui-density

viewport.css
  = proyecta la selección a aliases CSS activos
  = NO decide viewport/input/density
```

Aliases activos:

```text
--ui-density-control-height
--ui-density-item-min-height
--ui-density-inline-gap
--ui-density-block-gap
--ui-density-content-padding
--ui-density-icon-size
```

Cada alias apunta al grupo de tokens del theme seleccionado por
`data-ui-density`.

No existe un segundo resolver responsive en CSS.

## Política automática de density revisada

La política anterior podía compactar touch por ser touch o por viewport
estrecho. Eso hacía que la selección automática redujera targets precisamente
en el entorno que necesita semántica cómoda.

Política vigente:

```text
densityMode explícito
  -> prevalece siempre

sin dimensiones útiles
  -> comfortable

touch / hybrid / unknown
  -> comfortable

fine pointer + short/narrow
  -> compact

fine pointer + wide+tall
  -> spacious

resto
  -> comfortable
```

`spacious` usa ahora la señal `isTall` calculada con el `tallBreakpoint`
configurado; ya no reintroduce internamente un umbral fijo de 800px.

## Demo — invalidación de dependencia local

El bug manual de Vite quedó convertido en contrato del workflow.

`zerina-ui-demo/package.json`:

```text
pnpm dev
  -> pnpm sync:ui
  -> vite --force
```

`scripts/verify-demo.mjs` verifica esta regla para evitar que un prebundle
obsoleto de `file:../zerina-ui` sobreviva a una reconstrucción de la librería.

## Regresiones añadidas para 7B

```text
dynamic-environment-projection-phase-7b.test.tsx
dynamic-environment-projection-ownership-phase-7b.test.ts
dynamic-environment-projection-public-contract-phase-7b.test.ts
dynamic-environment-projection.chromium.spec.ts
browser-environment.tsx
```

Cubren:

- publicación de la política motion canónica desde `UIMotionProvider`;
- `data-ui-motion-effective` como selector real de aliases CSS;
- cambio `subtle -> none` sin reescribir números;
- política auto touch/hybrid;
- política compact para geometría restringida con input fino;
- uso real de `isTall`;
- precedencia de density explícita;
- ausencia de tabla numérica duplicada en `motion.css`;
- `UIMotionProvider` como único owner de proyección temporal;
- `UIViewportProvider` como único selector de density;
- ausencia de resolver responsive paralelo en `viewport.css`;
- preservación de los owners públicos existentes sin publicar helpers internos;
- CSS computado real en Chromium para `subtle -> none` y
  `comfortable -> spacious`.

## Validación disponible en este runtime

Realizado aquí antes del empaquetado final:

```text
library TS/TSX parse/transpile       475 / PASS
demo TS/TSX parse/transpile          27 / PASS
motion source projection             PASS
  none token                        0ms
  instant token                     1ms
  fast/normal/slow/slower           120/180/260/360ms
motion.css numeric duplication      0
density resolver cases              PASS
demo verifier                       PASS
relative source imports broken      0
```

No se ejecutó el gate canónico de pnpm en este runtime. Estas comprobaciones no
sustituyen `pnpm validate`.

## Último gate reportado por el usuario

La primera ejecución canónica de 7B avanzó correctamente hasta Chromium:

```text
internal-test typecheck               PASS
Vitest files                          101 / 101 PASS
Vitest tests                          646 / 646 PASS
internal-test build                   PASS
Chromium                              65 / 66 PASS
```

Único fallo:

```text
Block 5: InputGroup distinguishes pointer and keyboard focus
```

El fallo ocurrió al leer `data-focused` de `InputGroup` inmediatamente después
de `input.click()`.

Realidad del contrato existente:

```text
Input
  -> actualiza focus local
  -> useInputGroupDescendantState
  -> propaga al InputGroup mediante useEffect
```

Por tanto existe una ventana asíncrona legítima antes de que el estado agregado
del grupo llegue al DOM. La rama keyboard del mismo E2E ya esperaba esa
propagación con el assertion retryable de Playwright.

Corrección aplicada:

```text
forms-block5.chromium.spec.ts
  lectura instantánea de data-focused
    ->
  expect(group).toHaveAttribute("data-focused", "true")
```

No se modificó `InputGroup`, `useFocusVisible`, motion, density ni código de
producto.

El package gate posterior y el gate de la demo no se ejecutaron porque Chromium
detuvo `pnpm validate`.

7B continúa:

```text
IMPLEMENTADA, PENDIENTE DE VALIDACIÓN CANÓNICA
```

## Gate requerido para cerrar 7B

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
```

Después levantar la demo con el flujo normal, que ahora fuerza Vite:

```bash
pnpm dev
```

Revisión manual mínima:

```text
- consola sin errores;
- theme switching estable;
- prefers-reduced-motion / level none reduce CSS motion;
- density efectiva cambia sin segundo resolver responsive;
- touch/hybrid no se compacta automáticamente.
```

Fase 7B sólo se cierra cuando ambos gates pasan y la integración manual no
revela un defecto perteneciente a esta fase.

## Siguiente subfase tras PASS

Fase 7C — Surface + Tone Recipes.

Owners previstos:

```text
toneRecipe
surfaceRecipe
```

Objetivo:

- traducir `UITone` y `UISurfaceRole` a composición visual compartida;
- retirar mapas locales repetidos de color/surface;
- no crear componentes visuales paralelos;
- no iniciar 7C antes de cerrar 7B.
