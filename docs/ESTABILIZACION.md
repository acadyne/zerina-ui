# Estabilización vigente

## Fases cerradas

- `0.2.1` — SettingsList.
- `0.2.2` — acciones cancelables.
- `0.2.3` — tokens.
- `0.2.4` — contratos internos.
- `0.2.5` — deduplicación estructural.
- `0.2.6` — interacción + overlay.
- `0.2.7` — superficie pública + limpieza.
- `0.2.8` — proceso + distribución + documentación.

Versión cerrada actual: `0.2.8`.

## Hito actual

### `0.3.0` — release hardening

No abre nuevos refactors de componentes.

Endurece únicamente garantías de release:

- `prepack` construye siempre;
- `prepublishOnly` exige `pnpm validate`;
- `package:verify` prueba el peer range real en React 18 y React 19;
- contrato automático impide relajar accidentalmente estas garantías.

## Criterio de cierre

`pnpm validate` completo debe quedar verde con la matriz React 18/19.

Si pasa, `0.3.0` puede declararse como hito estable pre-1.0.
