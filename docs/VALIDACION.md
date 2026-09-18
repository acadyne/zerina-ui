# Validación

## Puerta canónica

La validación completa del repositorio es:

```bash
pnpm validate
```

`pnpm validate` es autosuficiente: comprueba la versión fijada de pnpm y ejecuta `pnpm install --frozen-lockfile` internamente.

No ejecutar un `pnpm install` adicional antes de esta puerta y no mantener listas manuales alternativas como proceso de release.

Owner: `scripts/validate.mjs`.

## Qué valida

- workspace/lockfile;
- Chromium de Playwright;
- typecheck del harness;
- Vitest completo;
- build del harness;
- Playwright Chromium completo;
- typecheck raíz;
- build ESM/CJS/CSS/DTS;
- pack;
- instalación desde tarball en consumidor limpio;
- TypeScript del consumidor;
- resolución runtime ESM/CJS;
- entry points CSS;
- contenido del paquete;
- whitespace Git cuando existe `.git`.

## Verificación de distribución aislada

```bash
pnpm package:verify
```

Este comando construye el paquete antes de empacarlo.

## Estado

`0.2.1`–`0.2.7` están cerrados para sus scopes.

`0.2.7` cerró con:

- harness typecheck PASS;
- 44/44 tests dirigidos PASS;
- root typecheck PASS;
- build + DTS PASS.

`0.2.8` no se cierra hasta ejecutar `pnpm validate` completo.

## Primer resultado integral de `0.2.8`

La primera ejecución de `pnpm validate` se detuvo en Vitest:

```text
Test Files   2 failed | 38 passed (40)
Tests        2 failed | 386 passed (388)
```

Ambos fallos eran contratos source históricos:

- Block 5 esperaba composición manual en vez de `composeEventHandlers`;
- MenuItem esperaba una fuente `isFocused` ya eliminada.

Los tests fueron actualizados al contrato vigente. No cambió producto.

Debe repetirse `pnpm validate` completo porque las fases posteriores al Vitest no llegaron a ejecutarse.

## Segundo resultado integral de `0.2.8`

La segunda ejecución alcanzó Chromium:

```text
Vitest      388/388 PASS
Chromium     63/65 PASS
```

Los dos fallos eran el mismo bug central de modalidad: `useFocusVisible`
empezaba a observar el Document durante `focus`, después del `pointerdown` que
había causado ese foco.

Se corrigió el owner central para retener el tracker desde layout.

Debe repetirse `pnpm validate` completo. Aún falta observar en verde las etapas
posteriores a Chromium, especialmente `package:verify` y el consumidor desde
tarball.
