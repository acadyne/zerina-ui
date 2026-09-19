# Versionado

## Estado actual

Versión estable candidata:

```text
0.4.0
```

Baseline anterior:

```text
0.3.0
```

## Por qué 0.4.0

El ciclo A–G es un conjunto coherente de estabilización y convergencia arquitectónica con una ampliación pública compatible:

```text
Inline / Wrap
→ mx / my
```

No cambian:

- entry points;
- `package.json#exports`;
- peer range React;
- nombres públicos deliberados de las familias refactorizadas.

Por eso el siguiente corte es un **minor pre-1.0** y no un patch.

## Regla

No usar una versión por fase o subtask.

Una versión representa un conjunto coherente de cambios que haya pasado la puerta integral sobre el tarball real.

## Publicación

`0.4.0` sólo se considera lista para publicación cuando la metadata ya actualizada pasa:

```bash
pnpm validate
```

y termina en:

```text
Validation complete.
```
