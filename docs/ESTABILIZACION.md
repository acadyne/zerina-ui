# Estabilización vigente

## Cerrado

- `0.2.1` — SettingsList.
- `0.2.2` — acciones cancelables de slots.
- `0.2.3` — tokens.
- `0.2.4` — contratos ReactNode/ARIA.
- `0.2.5` — deduplicación estructural.
- `0.2.6` — interacción + overlay.
- `0.2.7` — superficie pública + limpieza.

Versión distribuible actual: `0.2.7`.

## Actual

### `0.2.8` — proceso + distribución + documentación — CANDIDATO

Implementado:

- pnpm fijado en `10.34.5`;
- `pnpm validate` como puerta única;
- `validate.sh` eliminado;
- clean cross-platform;
- `pnpm package:verify`;
- pack real;
- instalación del tarball en consumidor temporal fuera del workspace;
- verificación TypeScript, ESM, CJS y CSS;
- comprobación de contenido distribuido;
- README de consumidor reescrito;
- documentación de distribución centralizada.

Pendiente:

- ejecutar `pnpm validate` completo;
- corregir cualquier divergencia que revele el consumidor limpio o la suite integral.

## Siguiente hito

### `0.3.0`

Si `0.2.8` queda verde, se ejecutará una última validación integrada y revisión de cierre del estado/documentación. `0.3.0` será el hito estable pre-1.0.
