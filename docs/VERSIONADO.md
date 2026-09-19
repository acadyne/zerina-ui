# Versionado

## Estado actual

Versión validada para release:

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

La metadata exacta `0.4.0` ya pasó:

```bash
pnpm validate
```

con cierre:

```text
Validation complete.
```

Por tanto `0.4.0` está lista para publicación desde el punto de vista de validación del repositorio.
