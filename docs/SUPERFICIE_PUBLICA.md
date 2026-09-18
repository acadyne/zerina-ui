# Superficie pública

## Regla

La API distribuida de `zerina-ui` entra únicamente por los entry points declarados en `package.json`:

- `zerina-ui`
- `zerina-ui/styles.css`
- `zerina-ui/reset.css`

No existen subpaths públicos hacia `src`, `core`, `helpers` o implementaciones internas.

## API raíz

La raíz publica:

- componentes;
- primitivas;
- patterns;
- theme;
- provider;
- interacción pública (`usePress`, focus-visible y tipos de press);
- motion de consumidor;
- viewport de consumidor;
- `Portal`;
- `OverlayProvider`.

## Motion público

Se consideran API de consumidor:

- `UIMotionProvider`;
- `useUIMotion`;
- `MotionPresence`;
- `MotionPresenceGroup`;
- `MotionSwitch`;
- sus tipos públicos de configuración/estado.

No se consideran API raíz:

- `MotionOverlayPresence`;
- `MotionOverlayRoot`;
- `MotionOverlayBackdrop`;
- `MotionOverlayPanel`;
- helpers de presets (`getSpinnerVariants`, etc.);
- `useOptionalUIMotion`.

Esas piezas existen para implementar componentes de la propia librería y pueden evolucionar con su owner interno.

## Viewport público

Se consideran API de consumidor:

- `UIViewportProvider`;
- `useUIViewport`;
- `DEFAULT_UI_VIEWPORT_BREAKPOINTS`;
- tipos de viewport/density/input y contexto.

No se consideran API raíz:

- `resolveUIViewportKind`;
- `useOptionalUIViewport`.

La resolución y el acceso opcional son mecanismos de implementación interna.

## Interacción pública

`usePress`, `useFocusVisible`, tipos de press y sus contratos permanecen públicos. Hay consumidores reales en el harness y forman parte de la capa de interacción reusable.

TriggerRuntime no forma parte del entry point raíz.

## Higiene de repositorio

No deben persistir:

- repositorios Git anidados en `internal-test`;
- archivos `.bak.*`;
- `internal-test/test-results`;
- `playwright-report`;
- `coverage`;
- `dist`/`node_modules` como fuente versionada.

Los `.gitignore` raíz e interno describen esta política.

## Criterio para eliminar un export

Un export puede retirarse durante `0.2.x` cuando:

1. no representa un contrato de consumidor deliberado;
2. sólo existe para implementar otra API pública;
3. no hay consumidor vigente identificado;
4. su exposición obliga a estabilizar una abstracción que debería seguir siendo interna.

No se crean aliases legacy para exports accidentales retirados.
