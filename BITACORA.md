# BITACORA

## Objetivo actual

Llevar `zerina-ui` a un hito estable pre-1.0 cerrando contratos, eliminando duplicación y residuos sin razón vigente, y centralizando validación/documentación sin introducir compatibilidad legacy por defecto.

## Estado actual

- Versión cerrada: `0.2.1`.
- Proceso en curso: candidato `0.2.2` — composición cancelable de acciones de slots.
- `0.2.1` (`SettingsList`) está implementado y validado.
- `0.2.2` está implementado estructuralmente pero todavía no validado por ejecución en la máquina del usuario.

## Decisiones e invariantes

- No crear soporte legacy por defecto.
- Cada mejora distribuible cerrada y validada incrementa `0.2.x`.
- No incrementar una versión candidata antes de su validación.
- No ampliar silenciosamente un patch.
- Las primitivas/core compartidos deben concentrar mecánicas transversales.
- No eliminar componentes sólo por similitud: primero separar semántica pública de implementación común.
- `0.3.0` será el hito estable pre-1.0 después de cerrar el roadmap y ejecutar la validación integral.

## `0.2.1` — SettingsList — CERRADO

Contrato:

- `SettingsList.Switch` y `SettingsList.Checkbox` usan eventos nativos `React.ChangeEvent<HTMLInputElement>`.
- La fila es estática; la activación pertenece al input.
- El estado controlado pertenece al consumidor.
- El estado no controlado pertenece a la primitiva `Switch`/`Checkbox`.
- `SettingsList` no mantiene una segunda máquina de estado.
- `preventDefault()` puede impedir el commit no controlado.
- `disabled` no cambia ni emite.

Validación reportada por el usuario:

- raíz `pnpm typecheck`: PASS.
- raíz `pnpm build`: PASS.
- `internal-test` typecheck: PASS.
- `tests/settings-list-current-contract.test.tsx`: 14/14 PASS.
- Playwright Chromium dirigido: 1/1 PASS.

La versión del paquete fue incrementada a `0.2.1`.

## Infraestructura descubierta durante `0.2.1`

`pnpm-workspace.yaml` omitía `packages`, por lo que pnpm 10 no instalaba `internal-test`. Se corrigió:

```yaml
packages:
  - "internal-test"

allowBuilds:
  esbuild: true
```

Tras la corrección, `pnpm install --frozen-lockfile` instaló los dos proyectos del workspace.

Queda una advertencia de pnpm 10 sobre `Ignored build scripts: esbuild`. No bloqueó la validación de `0.2.1`; se mantiene como asunto de reproducibilidad para la fase de infraestructura, no como bug de producto.

## `0.2.2` — composición cancelable de acciones de slots — CANDIDATO

### Scope

Cerrar una semántica única para estas acciones:

- `SearchInput.slotProps.clearButton.onPress`;
- `PasswordInput.slotProps.toggleButton.onPress`.

Contrato:

1. el handler del slot se ejecuta primero;
2. si deja `event.defaultPrevented === true`, la acción interna no se ejecuta;
3. si no cancela, la acción interna se ejecuta una vez;
4. la composición usa la utilidad transversal ya existente `composeEventHandlers`, en vez de duplicar manualmente el patrón.

### Implementado

- `SearchInput` reemplazó su composición manual por `composeEventHandlers`.
- `PasswordInput` reemplazó su composición manual por `composeEventHandlers`.
- Se mantienen las pruebas de cancelación existentes.
- Se añadieron pruebas de orden positivo slot → acción interna.

### Validación parcial reportada por el usuario

Sobre el candidato `0.2.2`:

- raíz `pnpm typecheck`: **PASS**.
- raíz `pnpm build`: **PASS**.
  - ESM generado.
  - CJS generado.
  - CSS/reset generados.
  - DTS generado.

`internal-test` no llegó a ejecutar typecheck/Vitest porque `internal-test/node_modules` volvió a estar ausente en la copia local usada para validar.

Esto se clasifica como bloqueo de entorno, no como fallo de `0.2.2`.

### No validado todavía

Falta, después de reinstalar dependencias del workspace:

- typecheck de `internal-test`;
- `tests/forms-block5-behavior.test.tsx`.

No se requiere Playwright específico para este patch salvo que la prueba dirigida revele una diferencia dependiente del navegador.

## Otros hallazgos vigentes

- `hasRenderableNode` duplicado con semánticas distintas.
- `mergeAriaIds` duplicado; existe una versión robusta reutilizable.
- `MenuRoot` mantiene deuda explícita P3.1.
- `TriggerRuntime` mantiene deuda explícita P4.1.
- Duplicación estructural importante en navegación, DataTable, diálogos y overlays.
- Backups `.bak.block4` y resultado generado rastreado en `internal-test` siguen como candidatos a limpieza.
- Validación todavía fragmentada.

## Siguiente paso

En la copia local usada para validar el candidato:

1. ejecutar `pnpm install --frozen-lockfile` desde la raíz;
2. confirmar que `internal-test/node_modules` existe;
3. ejecutar únicamente `internal-test` typecheck y Vitest dirigido.

La raíz ya pasó `typecheck` y `build` para este candidato y no necesita repetirse salvo que cambie código.

Si las dos validaciones pendientes pasan:

1. incrementar a `0.2.2`;
2. consolidar documentación;
3. comenzar `0.2.3` — contrato de tokens de interacción.
