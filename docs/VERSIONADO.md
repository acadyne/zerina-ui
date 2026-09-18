# Versionado durante estabilización

## Estado

Versión cerrada actual: `0.2.5`.

Candidato en desarrollo: `0.2.6`.

## Regla vigente

Un `0.2.x` representa una fase funcional de estabilización con scope coherente y validación propia.

No se crea una versión por cada helper o ajuste microscópico.

Una fase puede incluir varias modificaciones relacionadas cuando comparten:

- objetivo técnico;
- contratos afectados;
- criterio de cierre;
- batería de validación.

La versión se incrementa únicamente después de validar la fase.

## Historial operativo mínimo

- `0.2.0` — estado inicial auditado.
- `0.2.1` — SettingsList.
- `0.2.2` — acciones cancelables de slots.
- `0.2.3` — tokens.
- `0.2.4` — contratos internos compartidos.
- `0.2.5` — deduplicación estructural.
- `0.2.6` — interacción/overlay (candidato actual).
- `0.2.7` — superficie pública/eliminación.
- `0.2.8` — proceso/distribución/documentación.
- `0.3.0` — hito estable pre-1.0.

## Compatibilidad en `0.2.x`

No se asume compatibilidad legacy.

Una API accidental, duplicada o sin consumidor vigente puede rediseñarse/eliminarse durante la estabilización. No crear aliases, wrappers ni migraciones sin necesidad observable.

## Hito `0.3.0`

Requiere:

- contratos críticos cerrados;
- superficie pública revisada deliberadamente;
- duplicación crítica resuelta;
- validación única reproducible;
- build/pack/tipos/estilos correctos;
- instalación y consumo desde tarball limpio;
- documentación alineada con el contrato real.
