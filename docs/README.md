# Documentación operativa de zerina-ui

Esta carpeta contiene documentación **vigente**, agrupada por función. No pretende reemplazar el código, las pruebas ni el control de versiones.

## Documentos

- [`ARQUITECTURA.md`](./ARQUITECTURA.md): mapa del sistema y fronteras entre capas.
- [`CONTRATOS.md`](./CONTRATOS.md): contratos transversales que deben permanecer coherentes.
- [`ESTABILIZACION.md`](./ESTABILIZACION.md): problemas y procesos todavía abiertos para llegar al siguiente hito estable.
- [`VALIDACION.md`](./VALIDACION.md): qué significa “validado” y cómo se comprueba.
- [`VERSIONADO.md`](./VERSIONADO.md): relación entre procesos cerrados y versiones.

La memoria operacional canónica está en [`../BITACORA.md`](../BITACORA.md).

## Regla de mantenimiento

Cuando una decisión cambia, se sustituye aquí la descripción anterior. Cuando un problema queda cerrado y deja de condicionar trabajo futuro, se elimina de `ESTABILIZACION.md` o se reduce a la invariante que siga vigente.

No crear documentos por cada fase histórica si la información ya no afecta al presente.
