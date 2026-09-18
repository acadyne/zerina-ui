# Estabilización vigente

## Cerrado

- `0.2.1` — SettingsList.
- `0.2.2` — acciones cancelables de slots.
- `0.2.3` — tokens.
- `0.2.4` — contratos ReactNode/ARIA.
- `0.2.5` — deduplicación estructural.
- `0.2.6` — interacción + overlay.

Versión distribuible actual: `0.2.6`.

## Actual

### `0.2.7` — superficie pública + eliminación

Incluye:

- reachability completo del source;
- frontera explícita de motion/viewport;
- eliminación de exports internos accidentales de la raíz;
- eliminación de backups y resultados generados;
- eliminación del `.git` anidado en `internal-test`;
- política `.gitignore` coherente;
- contrato automatizado de superficie pública;
- documentación de API pública.

No se detectaron módulos TS/TSX huérfanos; no se elimina código de producto sin evidencia.

## Siguiente

### `0.2.8` — proceso + distribución + documentación de consumidor

- una orden `pnpm validate`;
- resolver/reproducir política pnpm de build scripts;
- README real;
- pack;
- consumidor limpio desde tarball;
- verificar JS/CSS/tipos/exports.

### `0.3.0`

Validación integral y hito estable pre-1.0.
