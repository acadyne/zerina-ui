# BITACORA

## Objetivo actual

Llevar `zerina-ui` a un hito estable pre-1.0 cerrando contratos, eliminando duplicación y residuos sin razón vigente, y centralizando validación/documentación sin introducir compatibilidad legacy por defecto.

## Estado actual

- Versión cerrada: `0.2.2`.
- Proceso en curso: candidato `0.2.3` — sincronización del contrato de tokens de interacción.
- `0.2.1` (`SettingsList`) está cerrado y validado.
- `0.2.2` (composición cancelable de acciones de slots) está cerrado y validado.
- `0.2.3` está implementado estructuralmente y pendiente de ejecución.

## Decisiones e invariantes

- No crear soporte legacy por defecto.
- Cada mejora distribuible o cierre contractual significativo, cerrado y validado, incrementa `0.2.x`.
- No incrementar una versión candidata antes de su validación.
- No ampliar silenciosamente un patch.
- Las primitivas/core compartidos concentran mecánicas transversales.
- El manifiesto de tokens es la fuente de verdad estructural para runtime, SSR y validación derivada.
- Sólo una prueba debe fijar explícitamente la cardinalidad total del esquema cuando esa cardinalidad sea parte del contrato.
- Los demás consumidores deben derivar el número de tokens del manifiesto.
- Cuando se solicite validación al usuario, enviar todos los comandos juntos en un único bloque y en orden de ejecución.
- `0.3.0` será el hito estable pre-1.0 tras cerrar el roadmap y ejecutar la validación integral.

## `0.2.1` — SettingsList — CERRADO

Validación:

- raíz `pnpm typecheck`: PASS.
- raíz `pnpm build`: PASS.
- `internal-test` typecheck: PASS.
- SettingsList Vitest: 14/14 PASS.
- SettingsList Chromium: 1/1 PASS.

## `0.2.2` — composición cancelable de acciones de slots — CERRADO

Contrato:

- el handler externo del slot se ejecuta primero;
- `preventDefault()` cancela la acción interna;
- sin cancelación, la acción interna se ejecuta exactamente una vez;
- `SearchInput` y `PasswordInput` reutilizan `composeEventHandlers`.

Validación reportada por el usuario:

- raíz `pnpm typecheck`: PASS.
- raíz `pnpm build`: PASS.
- `internal-test` typecheck: PASS.
- `tests/forms-block5-behavior.test.tsx`: 10/10 PASS.

La versión del paquete fue incrementada a `0.2.2`.

## `0.2.3` — contrato de tokens de interacción — CANDIDATO

### Realidad encontrada

El source ya contiene cinco tokens de interacción añadidos al contrato anterior:

- `interaction.focusRingColor`;
- `interaction.focusRingDangerColor`;
- `interaction.focusRingWidth`;
- `interaction.focusRingOffset`;
- `interaction.disabledOpacity`.

Junto con `interaction.overlay`, la rama `interaction` contiene seis hojas.

El manifiesto completo contiene 69 hojas. Las pruebas unitarias estaban parcialmente migradas desde 64 hacia 69/`manifestLeaves.length`, pero el E2E `theme-interaction-tokens.chromium.spec.ts` todavía exigía 64 variables canónicas en dos puntos.

Eso dejaba runtime/manifiesto y validación browser describiendo contratos distintos.

### Scope

- mantener una sola fuente de verdad estructural: `THEME_TOKEN_MANIFEST`;
- conservar una única aserción explícita de cardinalidad total (`69`) en `theme-token-manifest-validation.test.ts`;
- hacer que pruebas de runtime, SSR, built-ins y browser deriven conteos desde el manifiesto;
- comprobar que no se emiten variables legacy eliminadas;
- validar que light/dark/built-ins resuelven las hojas actuales.

### Implementado

- `theme-interaction-tokens.chromium.spec.ts` calcula `CANONICAL_VARIABLE_COUNT` desde `THEME_TOKEN_MANIFEST`;
- eliminados los dos contratos browser desfasados que fijaban `64`;
- eliminado el segundo hardcode redundante de `69` en `theme-interaction-token-contract.test.ts`;
- la aserción explícita `69` queda centralizada en `theme-token-manifest-validation.test.ts`;
- runtime y SSR ya recorrían el manifiesto, por lo que no requirieron cambio de producto.

### Pendiente de validación

- typecheck de `internal-test`;
- pruebas de manifiesto, interacción, resolución y SSR;
- E2E Chromium de tokens;
- typecheck raíz;
- build raíz.

## Infraestructura vigente

`internal-test` forma parte del workspace mediante:

```yaml
packages:
  - "internal-test"
```

Si se parte de una copia/snapshot nuevo, ejecutar `pnpm install --frozen-lockfile` antes del harness.

La advertencia de pnpm 10 sobre `Ignored build scripts: esbuild` sigue registrada para la fase de reproducibilidad; no bloqueó las fases anteriores.

## Otros hallazgos vigentes

- `hasRenderableNode` duplicado con semánticas distintas.
- `mergeAriaIds` duplicado; existe una versión robusta reutilizable.
- `MenuRoot` mantiene deuda explícita P3.1.
- `TriggerRuntime` mantiene deuda explícita P4.1.
- Duplicación estructural importante en navegación, DataTable, diálogos y overlays.
- Backups `.bak.block4` y resultados generados rastreados siguen como candidatos a limpieza.
- Validación global todavía fragmentada.

## Siguiente paso

Validar el candidato `0.2.3`.

Si pasa:

1. incrementar a `0.2.3`;
2. consolidar documentación;
3. comenzar `0.2.4` — semántica central de presencia/renderabilidad de `ReactNode`.
