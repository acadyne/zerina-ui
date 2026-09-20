# BITÁCORA CANÓNICA

## Objetivo actual

Cerrar Zerina UI `0.5.0` como release candidate coherente, distribuible y
validado sobre el tarball real, sin reabrir owners ya consolidados.

Proceso activo:

```text
Fase 8 — release hardening / 0.5.0
```

Regla vigente:

> No agregar belleza por acumulación; hacer que la belleza se propague desde
> pocos owners semánticos.

## Prioridad operativa

```text
realidad observable
→ instrucción actual
→ decisiones explícitas vigentes
→ esta bitácora
→ supuestos
```

## Invariantes

- un solo owner por mecánica;
- no legacy ni aliases deprecated;
- `usePress` posee interacción;
- `UIThemeProvider` posee theme;
- `UIViewportProvider` posee viewport y density;
- `UIMotionProvider` posee política temporal;
- `toneRecipe`, `surfaceRecipe`, `interactiveStateRecipe` y
  `typographyRecipe` traducen semántica visual compartida;
- no componentes `Material*` / `Flutter*`;
- no mega-provider;
- no segunda fuente de motion, density o responsive;
- no mapas locales paralelos de tone/surface/elevation/typography/state;
- demo observa/compone; no es owner visual;
- un defecto de librería revelado por demo se corrige primero en librería;
- breaking changes pre-1.0 son aceptables;
- una fase sólo se cierra con su gate canónico.

## Estado

```text
Fases 1–6                                  CERRADAS / VALIDADAS
7A Semantic Visual Foundation             CERRADA / VALIDADA
7B Dynamic Environment Projection         CERRADA / VALIDADA
7C Surface + Tone Recipes                 CERRADA / VALIDADA
7D Interactive Families                   CERRADA / VALIDADA
7E Typography + Control Density           CERRADA / VALIDADA
7F Visual Lab                             CERRADA / VALIDADA
8  Release hardening / 0.5.0              IMPLEMENTADA / PENDIENTE DE GATE
```

El usuario confirmó que el candidato 7F **pasa** antes de abrir Fase 8.

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

## Candidato 0.5.0

`zerina-ui/package.json` usa ahora:

```text
0.5.0
```

La metadata no implica validación por sí sola. Debe pasar el gate completo con
esa versión exacta.

Entry points preservados:

```text
zerina-ui
zerina-ui/styles.css
zerina-ui/reset.css
```

Peer range preservado:

```text
react      >=18 <20
react-dom  >=18 <20
```

## Hardening aplicado

### Distribución

`verify-package.mjs` conserva consumidores limpios React 18/19 y ahora amplía
el smoke runtime ESM/CJS para verificar explícitamente:

```text
toneRecipe
surfaceRecipe
interactiveStateRecipe
typographyRecipe
UIThemeProvider / useUITheme
UIViewportProvider / useUIViewport
UIMotionProvider / useUIMotion
```

El test `release-process-contract.test.ts` protege la metadata exacta `0.5.0`
además de prepack/prepublish, pnpm y peer range.

### Documentación

Sincronizados al candidato `0.5.0`:

```text
README.md
docs/VERSIONADO.md
docs/ESTABILIZACION.md
docs/VALIDACION.md
docs/DISTRIBUCION.md
docs/SUPERFICIE_PUBLICA.md
docs/README.md
zerina-ui-demo/README.md
zerina-ui-demo/SOURCE_SNAPSHOT.md
```

La documentación no declara el candidato como validado antes del gate.

### Sweep auxiliar observable

Sobre `src` del candidato:

```text
legacy --ui-action-* / --ui-shadow-* / surface2/surface3     0
componentes Material* / Flutter*                              0
phase markers productivos                                    0
TODO/FIXME productivos                                       0
data-hovered/data-pressed CSS fuera de interactive-state.css 0
```

Los usos de `matchMedia`/viewport que permanecen están dentro de los owners core
del entorno (`useMediaQuery`, `UIViewportProvider`, `useViewportSize`) o de
mecánica DOM como scroll lock; no se abrió un resolver por componente.

## Validación disponible en este runtime

Sólo se ejecutaron comprobaciones estáticas/auxiliares de source. No se ha
ejecutado aquí el `pnpm validate` canónico de Fase 8 ni el navegador real.

Por tanto:

```text
0.5.0 release candidate       PREPARADO
Fase 8                        PENDIENTE DE VALIDACIÓN CANÓNICA
```

## Gate para cerrar Fase 8

Librería:

```bash
cd /Users/fabian/desarrollo/repositorios/prod/zerina-ui
pnpm install
pnpm validate
```

El cierre esperado debe incluir:

```text
internal-test typecheck
Vitest completo
internal-test build
Chromium completo
package typecheck
pack del 0.5.0 real
clean consumer React 18
clean consumer React 19
ESM / CJS / CSS
whitespace
Validation complete.
```

Después, demo:

```bash
cd /Users/fabian/desarrollo/repositorios/prod/zerina-ui-demo
pnpm install
pnpm validate
pnpm dev
```

Revisión manual final mínima:

```text
Workspace + Visual Lab sin errores de consola
Apariencia: theme / viewport / motion
mobile 320/360/390/480 sin overflow estructural
tablet/desktop sin solapamientos
DataTable selección/edición/CSV estable
tones/surfaces/typography/density coherentes
hover/focus/pressed/selected/disabled visibles y consistentes
```

No marcar `0.5.0` lista para publicación hasta ambos gates.
