# Estabilización vigente

## Ciclo visual cerrado

Las fases 7A–7F están cerradas funcionalmente y su último gate fue confirmado
por el usuario antes de abrir hardening.

```text
7A  Semantic Visual Foundation          CERRADA
7B  Dynamic Environment Projection     CERRADA
7C  Surface + Tone Recipes             CERRADA
7D  Interactive Families               CERRADA
7E  Typography + Control Density       CERRADA
7F  Visual Lab                         CERRADA
```

## Fase activa

```text
8 — release hardening / 0.5.0
```

Hardening no abre otro sistema visual. Su función es comprobar que el sistema
cerrado se distribuye y documenta como una unidad coherente.

El candidato actual:

- usa metadata `0.5.0`;
- mantiene los mismos entry points;
- mantiene React 18/19 en el peer range;
- refuerza el smoke ESM/CJS de los owners visuales públicos;
- sincroniza documentación de versión, distribución y superficie pública;
- conserva demo y librería como repos hermanos.

## Estado de deuda

El sweep auxiliar previo al gate no detecta:

```text
legacy --ui-action-* / --ui-shadow-* / surface2/surface3     0
componentes Material* / Flutter*                              0
phase markers productivos                                    0
TODO/FIXME productivos                                       0
data-hovered/data-pressed CSS fuera del owner compartido      0
```

Estos checks son auxiliares y no sustituyen `pnpm validate`.

## Cierre requerido

La fase 8 sólo se cierra si la metadata exacta `0.5.0` pasa:

```bash
cd zerina-ui
pnpm validate

cd ../zerina-ui-demo
pnpm validate
pnpm dev
```

Después de ese cierre no se abre automáticamente otro ciclo arquitectónico.
Cualquier trabajo posterior debe partir de una necesidad nueva y volver a leer
`BITACORA.md`.
