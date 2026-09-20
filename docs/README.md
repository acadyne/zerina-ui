# Documentación operativa de zerina-ui

Esta carpeta contiene documentación **vigente**, agrupada por función. No pretende reemplazar el código, las pruebas ni el control de versiones.

## Documentos

- [`ARQUITECTURA.md`](./ARQUITECTURA.md): mapa del sistema y fronteras entre capas.
- [`CONTRATOS.md`](./CONTRATOS.md): contratos transversales que deben permanecer coherentes.
- [`ESTABILIZACION.md`](./ESTABILIZACION.md): problemas y procesos todavía abiertos para llegar al siguiente hito estable.
- [`VALIDACION.md`](./VALIDACION.md): qué significa “validado” y cómo se comprueba.
- [`DISTRIBUCION.md`](./DISTRIBUCION.md): pipeline único, pack y consumo desde tarball limpio.
- [`SUPERFICIE_PUBLICA.md`](./SUPERFICIE_PUBLICA.md): entry points y frontera pública deliberada.
- [`VERSIONADO.md`](./VERSIONADO.md): relación entre procesos cerrados y versiones.

La memoria operacional canónica está en [`../BITACORA.md`](../BITACORA.md).

## Regla de mantenimiento

Cuando una decisión cambia, se sustituye aquí la descripción anterior. Cuando un problema queda cerrado y deja de condicionar trabajo futuro, se elimina de `ESTABILIZACION.md` o se reduce a la invariante que siga vigente.

No crear documentos por cada fase histórica si la información ya no afecta al presente.

## Ciclo 0.3.0 → 0.4.0

- [`MAPEO_ARQUITECTURA.md`](./MAPEO_ARQUITECTURA.md): mapa final de owners, convergencias y diferencias deliberadas.
- [`ROADMAP_POST_0_3.md`](./ROADMAP_POST_0_3.md): fases A–G y su cierre integrado.


## Ciclo 0.4.0 → 0.5.0

La memoria de trabajo de las fases visuales 7A–7F se consolidó en los contratos
vigentes, no en documentación histórica por fase. El estado operativo y el
hardening de release viven en [`../BITACORA.md`](../BITACORA.md).

`VERSIONADO.md`, `VALIDACION.md`, `DISTRIBUCION.md` y
`SUPERFICIE_PUBLICA.md` describen la base `0.5.0` y el candidato patch `0.5.1`.
