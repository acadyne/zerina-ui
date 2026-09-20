# BITÁCORA CANÓNICA

## Objetivo actual

Publicar el fix de continuidad vertical del shell como `zerina-ui@0.5.1`,
preservando exactamente los owners y la API ya validados en `0.5.0`.

Proceso activo:

```text
Patch release 0.5.1 — hardening final
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
- `Scaffold` posee la continuidad estructural general del shell;
- `AdaptiveScaffold` posee composición responsive y geometría
  sidebar/rail/content;
- `ScreenContent` posee el scroll semántico del contenido;
- no reparar layout con `position: fixed`, `100vh`, `100dvh` ni CSS de app;
- no crear un segundo scroll owner;
- no ampliar API pública para este patch;
- no publicar hasta que la metadata exacta `0.5.1` pase librería, demo y
  `npm publish --dry-run`.

## Estado

```text
Fases 1–7F                         CERRADAS / VALIDADAS
0.5.0                              YA UTILIZADA EN REGISTRY
fix AdaptiveScaffold               VALIDADO SOBRE SOURCE
0.5.1 patch                        PREPARADO / PENDIENTE GATE EXACTO
```

Versión actual del candidato:

```text
zerina-ui@0.5.1
```

## Realidad observable más reciente

El source del fix, todavía con metadata `0.5.0`, pasó el gate integral durante
`npm publish --dry-run`:

```text
internal-test typecheck                         PASS
Vitest                              109/109 files, 679/679 tests
internal-test build                             PASS
Chromium                                      78/78 PASS
package typecheck                                PASS
package verify React 18 / React 19               PASS
ESM / CJS / CSS                                  PASS
git whitespace                                   PASS
Validation complete.                             PASS
```

Después del gate, npm rechazó el dry-run únicamente por versión:

```text
You cannot publish over the previously published versions: 0.5.0.
```

Por tanto `0.5.0` no puede reutilizarse. La corrección debe salir como patch
`0.5.1`.

El arranque de la demo con Vite fue observado en `localhost:5174` y luego se
detuvo manualmente con Ctrl-C. El gate de demo debe repetirse sobre la metadata
exacta `0.5.1`.

## Fix incluido

Síntoma original:

```text
desktop + sidebar + contenido corto
→ sidebar no llenaba la altura disponible bajo el app bar
```

La continuidad estructural final queda:

```text
Screen.Body
  ↓
Scaffold content wrapper
  height: 100%
  display: flex
  flex-direction: column
  ↓
AdaptiveScaffold body
  flex: 1
  display: flex
  min-height: 0
  ↓
AdaptiveScaffold content
  flex: 1
  display: flex
  flex-direction: column
  min-height: 0
  ↓
content frame interno
  flex: 1 1 0px
  min-height: 0
  overflow: hidden
  ↓
ScreenContent(fill, scrollable)
  → único owner del scroll
```

No existen porcentajes internos añadidos a `AdaptiveScaffold.body/contentNode`,
ni `position: fixed`, ni `100vh/100dvh`, ni un segundo scroll owner.

## Regresión activa

La suite Chromium cubre:

```text
desktop + sidebar + app bar + contenido corto
desktop + sidebar sin app bar + contenido corto
desktop + contenido alto + scroll interno
tablet + rail
mobile + bottom navigation
desktop contained + sidebar
```

Último resultado:

```text
78/78 Chromium PASS
```

## Gate inmediato

Ejecutar sobre la metadata exacta `0.5.1`:

```bash
cd /Users/fabian/desarrollo/repositorios/prod/zerina-ui
pnpm validate
```

Después:

```bash
cd /Users/fabian/desarrollo/repositorios/prod/zerina-ui-demo
pnpm validate
pnpm dev
```

Y finalmente:

```bash
cd /Users/fabian/desarrollo/repositorios/prod/zerina-ui
npm publish --dry-run
```

Sólo si ese dry-run termina mostrando `+ zerina-ui@0.5.1` sin error procede:

```bash
npm publish
```
