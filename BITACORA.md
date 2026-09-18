# BITACORA

## Objetivo actual

Llevar `zerina-ui` desde `0.2.0` a un hito estable pre-1.0, cerrando contratos, reduciendo duplicación, eliminando residuos sin razón vigente y centralizando validación/documentación sin introducir compatibilidad legacy por defecto.

## Estado actual

- Versión declarada del paquete: `0.2.0`.
- Proceso en curso: preparación de `0.2.1` — contrato nativo de `SettingsList.Switch` y `SettingsList.Checkbox`.
- El cambio de producto de `0.2.1` está implementado y revisado estructuralmente, pero **no está validado por ejecución** y por tanto la versión todavía no se incrementa.
- `SettingsList` ya no mantiene una segunda máquina de estado controlado/no controlado para Switch/Checkbox; delega ese estado a las primitivas `Switch` y `Checkbox`.
- `onCheckedChange` sigue exponiendo `(checked, React.ChangeEvent<HTMLInputElement>)`.
- Las filas que contienen Switch/Checkbox permanecen estáticas; la activación pertenece al input nativo.
- Las pruebas específicas de contrato existen en `internal-test/tests/settings-list-current-contract.test.tsx` y el caso browser en `internal-test/e2e/settings-list-current-contract.chromium.spec.ts`.
- Los cambios preexistentes no relacionados dentro de `internal-test/` siguen sin consolidarse y no se consideran parte automática de `0.2.1`.

## Decisiones e invariantes

- No crear soporte legacy por defecto.
- Código, API, tests o artefactos anteriores sólo se preservan si existe una razón vigente verificable.
- Cada mejora cerrada debe tener scope y validación propia antes de incrementar `0.2.x`.
- Una auditoría o documentación pura no incrementa versión.
- No ampliar silenciosamente un patch: hallazgos fuera de scope se registran para procesos posteriores.
- No eliminar componentes sólo por similitud; primero separar semántica pública de implementación compartible.
- Las primitivas deben ser la fuente de verdad para mecánicas transversales ya resueltas en ellas.
- La bitácora y `docs/` describen el estado vigente, no una cronología exhaustiva.
- `0.3.0` será el hito de estabilización pre-1.0 después de cerrar el roadmap y ejecutar la validación completa.

## Proceso actual — candidato `0.2.1`

### Scope

Cerrar el contrato vigente de `SettingsList.Switch` y `SettingsList.Checkbox`:

- evento nativo `React.ChangeEvent<HTMLInputElement>`;
- fila estática, sin segunda ruta de activación;
- controlado/no controlado;
- `preventDefault()` impide confirmar estado no controlado;
- `disabled` no cambia ni emite;
- metadatos nativos (`name`, `value`, `checked`);
- una sola fuente de estado: la primitiva `Switch`/`Checkbox`.

### Implementado

En `src/patterns/settings/SettingsList.tsx`:

- eliminado el `useState` local duplicado de Switch y Checkbox;
- eliminado `commitCheckedChange`;
- `checked` y `defaultChecked` se delegan directamente a las primitivas;
- `onChange` sólo adapta el evento nativo hacia `onCheckedChange`.

Consecuencia relevante:

La primitiva procesa todos sus handlers externos antes de decidir si confirma el cambio. Así, una cancelación realizada por el callback de SettingsList o por `slotProps.input.onChange` puede impedir el commit no controlado sin competir con una segunda máquina de estado en el patrón.

### Pruebas preparadas

`internal-test/tests/settings-list-current-contract.test.tsx` cubre:

- tipos de evento;
- activación únicamente desde el input nativo;
- metadatos del input;
- `preventDefault`;
- disabled;
- estado no controlado sin callback;
- propiedad del estado controlado por el consumidor;
- cancelación desde `slotProps.input.onChange`.

`internal-test/e2e/settings-list-current-contract.chromium.spec.ts` comprueba en Chromium la restauración visual/DOM tras `preventDefault()`.

## Validado

### Inspección / estructura

- El diff del source se limita a eliminar el estado duplicado y delegarlo a las primitivas.
- No quedan referencias a `SettingsCheckedChangeEvent` ni `event.source`.
- Los archivos TS/TSX específicos de `0.2.1` pasan parsing/transpilación sintáctica con TypeScript.
- `git diff --check` del repositorio `internal-test/` pasa.

### Validación reportada por el usuario

En macOS, sobre el árbol de trabajo actual:

- `pnpm typecheck`: **PASS**.
- `pnpm build`: **PASS**.
  - ESM generado.
  - CJS generado.
  - CSS/reset generados.
  - DTS generado.

### No validado todavía

El harness `internal-test` no llegó a ejecutar sus pruebas porque no tiene sus dependencias instaladas:

- `pnpm --dir internal-test typecheck`: **BLOQUEADO POR ENTORNO**, falta `vitest/globals`.
- Vitest: **NO EJECUTADO**, comando no encontrado.
- Playwright: **NO EJECUTADO**, comando no encontrado.

La salida de pnpm confirma `internal-test/node_modules` ausente. Esto no se registra como fallo del contrato de `SettingsList`.

## Otros hallazgos vigentes

- `hasRenderableNode` está duplicado con semánticas distintas; `List` trata booleanos como contenido.
- `mergeAriaIds` robusto existe en `field-semantics.ts`, mientras `SettingsList` mantiene otra implementación.
- `MenuRoot` conserva deuda explícita P3.1 sobre intención temporal de foco.
- `TriggerRuntime` conserva deuda explícita P4.1 sobre cancelación entre capas externas.
- Duplicación estructural importante en navegación, DataTable, diálogos y overlays.
- Hay backups `.bak.block4` y un resultado generado rastreado en `internal-test/`; siguen como candidatos a limpieza.
- La validación todavía está fragmentada entre scripts.

## Bloqueo actual

Se identificó la causa de que `internal-test` no instalara dependencias:

- `pnpm-workspace.yaml` omitía `packages`;
- con pnpm 10 eso deja únicamente el paquete raíz dentro del workspace;
- por eso `pnpm --dir internal-test install` terminaba sin crear `internal-test/node_modules`;
- el lockfile ya contiene un importer `internal-test`, por lo que la intención previa de incluirlo en el workspace es observable.

Corrección aplicada:

```yaml
packages:
  - "internal-test"

allowBuilds:
  esbuild: true
```

Esta corrección pertenece a infraestructura de validación de `0.2.1`; no modifica la API distribuible.

El paquete raíz ya pasó `typecheck` y `build` en la máquina del usuario.

## Siguiente paso

En la máquina del usuario, con el `pnpm-workspace.yaml` corregido:

1. ejecutar `pnpm install --frozen-lockfile` desde la raíz;
2. comprobar que `internal-test/node_modules` existe;
3. instalar Chromium con el Playwright ya enlazado;
4. ejecutar typecheck + Vitest + Playwright dirigidos a `SettingsList`.

Si pasan:

1. incrementar versión a `0.2.1`;
2. consolidar documentación;
3. comenzar `0.2.2` — contrato cancelable de acciones de slots.

Roadmap vigente: `docs/ESTABILIZACION.md`.
Contratos transversales: `docs/CONTRATOS.md`.
Validación: `docs/VALIDACION.md`.
Versionado: `docs/VERSIONADO.md`.
