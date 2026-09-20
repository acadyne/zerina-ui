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
- tipos de viewport/density/input y contexto;
- `SetViewportModeAction` como contrato del setter público de modo.

No se consideran API raíz:

- `resolveUIViewportKind`;
- `useOptionalUIViewport`.

La resolución y el acceso opcional son mecanismos de implementación interna.

## Interacción pública

`usePress`, `useFocusVisible`, tipos de press y sus contratos permanecen públicos. Hay consumidores reales en el harness y forman parte de la capa de interacción reusable.

TriggerRuntime no forma parte del entry point raíz.

## Navegación pública

Los tipos que aparecen en contratos de navegación adaptativa son importables desde
`zerina-ui`:

- `NavigationNode`;
- `NavigationNodeId`;
- `NavigationLinkMeta`;
- `NavigationContentMeta`.

Los helpers internos de recorrido/proyección no se exponen automáticamente desde
la raíz sólo por compartir el mismo módulo fuente.

## Theme público

Además de `ThemeDefinition`, `ThemeName` y los tokens públicos, forman parte de
la superficie de consumidor:

- `CreateThemeDefinitionInput`, porque es el contrato de `createThemeDefinition`;
- `UIThemeContextValue`, porque es el valor retornado por `useUITheme`.

## Tipos semánticos de props

Cuando una prop pública usa un dominio semántico con nombre, el consumidor debe
poder importarlo sin recurrir a `ComponentProps["prop"]`.

La superficie incluye, entre otros:

- forms: `InputSize`, `InputVariant`, `SelectSize`, `SelectVariant`,
  `TextareaSize`, `TextareaVariant`;
- overlay: `DialogSize`, `PopoverPlacement`, `FloatingPlacement`;
- layout: `ContainerSize`, `SafeAreaEdges`;
- media: `AvatarSize`, `RatioValue`;
- status labels: `BadgeVariant`, `BadgeColorScheme`, `TagVariant`,
  `TagColorScheme`.

Los aliases específicos de `Badge` y `Tag` preservan `statusLabelRecipe` como
owner interno.

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

## Owners internos confirmados

El sweep F confirma que los siguientes owners no forman parte del entry point raíz:

- `useTextControlRuntime`;
- `useChoiceControlRuntime`;
- `usePressSlotBridge`;
- `useControllableValue`;
- `TriggerRuntime`;
- `FloatingOverlayRuntime`;
- `ModalOverlayRuntime`;
- `TargetDialogFrame`;
- `DataTableShellFrame`;
- `useDataTableShell`;
- `useNavigationEntries`;
- `MotionAppFrame`;
- `statusLabelRecipe`;
- `shared-control-types`;
- `feedback.types`.

Pueden existir exports en barrels internos para composición dentro de la librería. Eso no crea un subpath público mientras `package.json#exports` y `src/index.ts` no los expongan.

El sweep no detectó nuevos exports raíz accidentales.

## Vocabulario público de navegación

La familia de destinos expone un único conjunto de tipos para conceptos compartidos:

- `NavigationSurfacePosition`;
- `NavigationSurfaceVariant`;
- `NavigationDestinationLabelBehavior`;
- `NavigationDestinationIndicator`;
- `NavigationDestinationDensity`;
- `NavigationDestinationBadgeAnchor`;
- `NavigationDestinationBadgePlacement`;
- `NavigationDestinationBadgeOffset`;
- `NavigationDestinationItemShape`;
- `NavigationSelectionContext`;
- `NavigationSelectionReason`.

`BottomNavigation` y `NavigationRail` no exportan aliases paralelos para esos dominios.

Siguen siendo familiares y públicos únicamente los tipos que expresan diferencias reales, por ejemplo:

- `BottomNavigationIconPosition`;
- `NavigationRailPlacement`;
- `NavigationRailAlignment`;
- slots/styles/props propios de cada componente.

## Verificación vigente

La superficie no se valida por conteos aproximados de símbolos.

Se valida por:

- `src/index.ts`;
- `package.json#exports`;
- `public-surface-contract.test.ts`;
- declarations generadas;
- `package:verify` sobre el tarball real;
- un consumer TypeScript `strict` que importa los tipos semánticos públicos desde
  `zerina-ui`.

Fase F no añadió ni retiró entry points públicos.

## Comparación integrada con 0.3.0

La topología pública permanece estable respecto al baseline:

```text
src/index.ts             idéntico
package exports          idénticos
entry points             idénticos
peer range React         idéntico
runtime dependencies     idénticas
```

El ciclo sí contiene cambios deliberados dentro de contratos existentes, por ejemplo `mx/my` en Inline/Wrap y correcciones semánticas de interacción/overlays.

La estabilidad de entry points no implica que el conjunto completo de cambios deba publicarse con el mismo número de versión; esa decisión se toma después de G.
