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
- Fase 2C — ownership de Scaffold: **IMPLEMENTADA R2; PENDIENTE ÚNICAMENTE DE REPETIR `pnpm validate` TRAS FIX DE WHITESPACE**.
- Fase 3 — Navigation Presenter / política responsive: no iniciada.

## Fase 2C — ownership resultante

### Scroll

```text
ScrollArea = único motor de scroll
ScreenContent = composición semántica que puede usar ScrollArea
```

Retirados:

```text
Screen.Scroll
ScreenScroll
ScreenScrollProps
Scaffold.scrollable
Scaffold.scrollProps
```

### Screen

Owner de:

- raíz física;
- viewport;
- safe-area exterior;
- Header / Body / Footer.

### Scaffold

Owner exclusivo de regiones:

```text
appBar
body/content
floating
footer
```

Retirado:

```text
screenProps
```

Las props raíz de `Screen` pasan directamente por `Scaffold`.

### AdaptiveScaffold

Retirados:

```text
scaffoldProps
navigationWidth
```

Anchos explícitos:

```text
sidebarWidth
navigationRailProps.width
```

### TabScaffold

Mantiene:

- tabs raíz;
- historial;
- back;
- reselect/popToRoot.

No posee scroll.

## Bugs cerrados

### Custom tablet bottom

Una navegación custom reemplaza a la built-in.

Tablet admite:

```text
start
end
bottom
```

No existe navegación custom lateral simultánea con bottom built-in.

### Rail end

`end` deriva:

```text
NavigationRail placement="right"
```

### navigationWidth

Eliminado.

Separado en:

```text
sidebarWidth
navigationRailProps.width
```

## Validación canónica — primer intento de Fase 2C

El usuario ejecutó:

```bash
pnpm install
pnpm validate
```

Resultados funcionales:

- internal-test typecheck: PASS;
- Vitest:
  - 86 archivos PASS;
  - 603 tests PASS;
- internal-test build: PASS;
- Chromium:
  - 65 tests PASS;
- package typecheck: PASS;
- package build: PASS;
- package pack: PASS;
- clean consumer React 18:
  - install PASS;
  - typecheck PASS;
  - ESM/CJS/CSS smoke PASS;
- clean consumer React 19:
  - install PASS;
  - typecheck PASS;
  - ESM/CJS/CSS smoke PASS.

Único fallo:

```text
git whitespace check
```

por una línea en blanco nueva al EOF de:

```text
docs/ARQUITECTURA.md
docs/CONTRATOS.md
docs/SUPERFICIE_PUBLICA.md
```

## Corrección R2

Se eliminaron exclusivamente esas líneas en blanco extra.

No se modificó código productivo.

Se realizó un barrido comparando todos los archivos modificados de Fase 2C contra el checkpoint 2B:

```text
21 archivos modificados
0 nuevas líneas con trailing whitespace
0 nuevos blank lines at EOF
```

Los whitespace preexistentes en archivos no modificados no forman parte del diff y no son reportados por `git diff --check`.

## Estado de validación

Toda la parte funcional del gate ya pasó.

Falta repetir:

```bash
pnpm validate
```

sobre R2 para confirmar que `git whitespace check` también finaliza en PASS.

Fase 2C se cerrará sólo después de ese `Validation complete.` final.

## Siguiente fase tras el PASS

Fase 3 — Navigation Presenter:

- un único owner de proyección de `NavigationNode[]`;
- bottom / rail / sidebar / drawer como presentaciones;
- jerarquía y grupos;
- active parent;
- muchos destinos / overflow;
- política responsive sin duplicación por breakpoint.
