# Versionado

## Estado actual

Candidato de release activo:

```text
0.5.1
```

Release anterior publicado/usado en registry:

```text
0.5.0
```

La metadata de `package.json` ya apunta a `0.5.1`. Eso no equivale por sí solo
a un release validado: la readiness exacta se establece únicamente cuando
`pnpm validate` termina en `Validation complete.` sobre esta misma metadata.

## Por qué 0.5.1

`0.5.0` ya fue utilizada por el registry y no puede volver a publicarse. El
candidato `0.5.1` conserva la superficie pública de `0.5.0` y contiene únicamente
el hardening posterior que corrige la continuidad vertical del shell
`AdaptiveScaffold`/`RoutedAdaptiveScaffold`, junto con sus regresiones de layout.

No añade entry points, providers ni un nuevo owner de scroll. El cambio pertenece
a la serie patch.

## Base 0.5.0

El ciclo 7A–7F convierte la capa visual en un sistema semántico compartido y
observable:

```text
7A  semantic visual foundation
7B  dynamic environment projection
7C  surface + tone recipes
7D  interactive families
7E  typography + control density
7F  visual lab
```

El conjunto añade contratos públicos deliberados como los tipos semánticos
visuales y `toneRecipe`, `surfaceRecipe`, `interactiveStateRecipe` y
`typographyRecipe`, además de cambios pre-1.0 que eliminan aliases visuales
históricos.

Se conservan:

- los tres entry points del paquete;
- el peer range `react/react-dom >=18 <20`;
- el modelo de package ESM/CJS/DTS/CSS;
- los owners funcionales `UIThemeProvider`, `UIViewportProvider`,
  `UIMotionProvider` y `usePress`.

Por alcance, el siguiente corte es un **minor pre-1.0**.

## Regla

No usar una versión por fase o subtask.

Una versión representa un conjunto coherente de cambios que haya pasado la
puerta integral sobre el tarball real.

## Puerta de publicación

Para `0.5.1` la secuencia canónica es:

```bash
pnpm validate
```

en la librería, seguida por la validación de la demo compañera:

```bash
pnpm validate
```

La demo no sustituye la verificación del tarball; comprueba integración real
contra `file:../zerina-ui`.

`prepublishOnly` continúa detrás de `pnpm validate`, por lo que una publicación
normal no puede saltarse la puerta canónica.
