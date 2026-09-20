# Zerina UI

Zerina UI es una librería UI tipada para React. Reúne primitivas, componentes, patrones y contratos transversales para construir interfaces accesibles, responsivas y componibles sin esconder el control del consumidor.

> Estado: pre-1.0. La serie `0.x` todavía puede ajustar superficie pública mientras se estabiliza el contrato de la librería.

## Candidato 0.5.1

La serie `0.5` consolida el sistema visual semántico de Zerina UI: tones,
surfaces, elevation, shape, typography, density y estados interactivos se
propagan desde owners compartidos en vez de mapas locales por componente.

El paquete mantiene los mismos entry points y el peer range React 18/19. `0.5.1`
es un patch sobre `0.5.0` que corrige la continuidad vertical de
`AdaptiveScaffold`/`RoutedAdaptiveScaffold` en shells con navegación lateral,
sin ampliar API pública. La metadata `0.5.1` sólo se considera lista para
publicación cuando el candidato exacto termina `pnpm validate` en
`Validation complete.`.

## Instalación

```bash
pnpm add zerina-ui react react-dom
```

También puedes usar npm o yarn.

Peers requeridos:

```text
react      >=18 <20
react-dom  >=18 <20
```

`framer-motion` y `lucide-react` son dependencias de `zerina-ui` y se instalan con el paquete.

## Estilos

Importa los estilos funcionales una vez en la aplicación:

```tsx
import "zerina-ui/styles.css";
```

El reset es opcional:

```tsx
import "zerina-ui/reset.css";
```

Los únicos entry points públicos del paquete son:

```text
zerina-ui
zerina-ui/styles.css
zerina-ui/reset.css
```

No se consideran API pública los paths internos de `src`, `core`, `helpers` o archivos individuales.

## Inicio rápido

```tsx
import {
  Button,
  Card,
  CardBody,
  Heading,
  ZerinaProvider,
} from "zerina-ui";

import "zerina-ui/styles.css";


export function App() {
  return (
    <ZerinaProvider>
      <Card>
        <CardBody>
          <Heading>
            Zerina UI
          </Heading>

          <Button
            onPress={() => {
              console.log(
                "pressed",
              );
            }}
          >
            Continuar
          </Button>
        </CardBody>
      </Card>
    </ZerinaProvider>
  );
}
```

`ZerinaProvider` compone los providers transversales de overlay, viewport, motion, theme y toast.

## Capas de la librería

### Primitivas

Bloques reutilizables de bajo nivel:

- formularios y controles;
- layout;
- tipografía;
- navegación;
- disclosure;
- overlays.

### Componentes

Composiciones de UI más concretas, por ejemplo:

- DataTable / EditableDataTable;
- feedback;
- tree;
- media;
- image viewer;
- navigation menu;
- theme switcher.

### Patterns

Patrones de aplicación que combinan primitivas sin duplicar mecánica transversal.

### Core público deliberado

La raíz también expone contratos reutilizables seleccionados:

- `usePress` y focus-visible;
- `UIMotionProvider`, `useUIMotion`, `MotionPresence`, `MotionPresenceGroup`, `MotionSwitch`;
- `UIViewportProvider`, `useUIViewport`, `DEFAULT_UI_VIEWPORT_BREAKPOINTS`;
- `OverlayProvider` y `Portal`.

Los runtimes internos de overlay/motion/trigger no son entry points públicos.

## Eventos y cancelación

Las acciones compuestas respetan `event.preventDefault()`.

Cuando una capa externa cancela un evento, la conducta interna posterior no debe ejecutarse. Esto aplica, entre otros, a acciones de slots y triggers compuestos.

Ejemplo:

```tsx
<SearchInput
  defaultValue="query"
  slotProps={{
    clearButton: {
      onPress(event) {
        if (!window.confirm("¿Limpiar?")) {
          event.preventDefault();
        }
      },
    },
  }}
/>
```

## Controlled y uncontrolled

Los componentes que admiten ambos modos siguen la convención React:

```tsx
<Switch
  defaultChecked
/>

<Switch
  checked={enabled}
  onChange={(event) => {
    setEnabled(
      event.currentTarget.checked,
    );
  }}
/>
```

En modo controlado, el consumidor es dueño del estado. En modo no controlado, la primitiva mantiene el estado.

## Tema

`ZerinaProvider` incluye el sistema de tema. Para control directo también están disponibles `UIThemeProvider` y `useUITheme`.

El contrato de tokens se resuelve desde un manifiesto canónico compartido por runtime y SSR.

## Motion

Para consumidores están disponibles:

```tsx
import {
  MotionPresence,
  MotionSwitch,
  UIMotionProvider,
  useUIMotion,
} from "zerina-ui";
```

Los componentes de overlay usan internamente el mismo runtime de motion/foco/dismiss, pero esas piezas de implementación no forman parte de la API raíz.

`UIMotionProvider` publica la política numérica canónica de `motion.tokens.ts`
como variables internas y expone `data-ui-motion-effective` en el documento.
`motion.css` usa ese atributo para seleccionar las variables funcionales de
duración/easing/geometría; no mantiene una segunda tabla de timings.

## Viewport

```tsx
import {
  UIViewportProvider,
  useUIViewport,
} from "zerina-ui";
```

El provider centraliza viewport, orientación, densidad e input para evitar que cada componente mantenga su propia interpretación del entorno.

La density efectiva se refleja en `data-ui-density` y se proyecta a métricas
CSS activas. En modo `auto`, touch/hybrid conserva `comfortable`; la
compactación automática se reserva para geometría restringida con input fino,
y `spacious` requiere un viewport efectivamente wide+tall. Los modos explícitos
siempre prevalecen.

`AdaptiveScaffold` expone el modo resuelto a `title`, `subtitle`, `leading`,
`actions` y `children`. Las aplicaciones deben adaptar la composición desde ese
contexto en vez de crear otro resolver responsive.

`TopAppBar` mantiene su zona central dentro del flujo del layout. `centerTitle`
centra dentro del espacio disponible entre `leading` y `actions`; no utiliza una
capa absoluta que pueda invadir acciones cuando el viewport se estrecha.

## Accesibilidad

Los contratos compartidos cubren, entre otros:

- asociaciones ARIA compuestas sin IDs duplicados;
- foco inicial y restore-focus de overlays;
- containment de foco;
- dismiss por Escape/pointer fuera según contrato;
- controles nativos para estados de formularios;
- presencia semántica coherente de `ReactNode`.

La accesibilidad final también depende del contenido, labels y decisiones de la aplicación consumidora.

## Desarrollo del repositorio

Requiere pnpm. El repositorio fija la versión esperada mediante `packageManager`.

Instalación:

```bash
pnpm install --frozen-lockfile
```

Desarrollo de la librería:

```bash
pnpm dev
```

TypeScript:

```bash
pnpm typecheck
```

Build:

```bash
pnpm build
```

### Validación completa

La puerta de validación canónica es:

```bash
pnpm validate
```

Esa orden:

1. restaura el workspace con lockfile congelado;
2. asegura Chromium para Playwright;
3. ejecuta typecheck, Vitest y build del harness;
4. ejecuta la suite Chromium;
5. ejecuta typecheck del paquete;
6. construye y empaca la librería;
7. instala el tarball en un consumidor temporal fuera del workspace;
8. valida tipos y resolución ESM/CJS/CSS del paquete empacado;
9. ejecuta `git diff --check` cuando existe un repositorio Git.

Para verificar sólo distribución/consumo:

```bash
pnpm package:verify
```

## Distribución

El tarball publicado contiene únicamente:

- `dist/`;
- `README.md`;
- `LICENSE`;
- `package.json`.

El build genera:

```text
dist/index.js
dist/index.cjs
dist/index.d.ts
dist/index.d.cts
dist/styles.css
dist/reset.css
```

Los sourcemaps pueden acompañar estos artefactos dentro de `dist`.

## Licencia

MIT. Consulta [`LICENSE`](./LICENSE).

## Sistema visual semántico

Zerina UI usa un vocabulario de tema compartido para que color, superficies,
elevación, shape, tipografía y density puedan cambiar sin añadir lógica
específica por componente.

Roles principales:

```text
tones       neutral / primary / secondary / info / success / warning / danger
surfaces    canvas / surface / containerLow / container / containerHigh
elevation   0 .. 5
typography  display / headline / title / body / label / caption
density     compact / comfortable / spacious
```

La serie pre-1.0 no conserva aliases de tokens retirados. Los themes nuevos
deben usar el contrato semántico vigente.

## Recipes visuales compartidas

La riqueza visual no se define por componente. Cuatro recipes semánticas traducen
el vocabulario del theme a estilos consumibles:

```ts
import {
  interactiveStateRecipe,
  surfaceRecipe,
  toneRecipe,
  typographyRecipe,
} from "zerina-ui";

const panel = surfaceRecipe({
  role: "containerLow",
  elevation: 1,
  shape: "xl",
  border: "subtle",
});

const status = toneRecipe({
  tone: "success",
  emphasis: "container",
});

const primaryAction = interactiveStateRecipe({
  tone: "primary",
  emphasis: "solid",
  elevation: 2,
  hoverElevation: 3,
  pressedElevation: 1,
});

const headline = typographyRecipe({
  role: "headline",
});
```

`surfaceRecipe` es el owner compartido de `surface role + elevation + shape +
border`. `toneRecipe` es el owner compartido de la relación
`tone + emphasis -> foreground/background/border`.

`interactiveStateRecipe` es el owner visual de `rest / hover / focus-visible /
pressed / selected / disabled`. No captura eventos ni mantiene estado:
`usePress` continúa siendo el único owner de la mecánica interactiva. Los
controles publican el vocabulario de estado existente y el CSS compartido lo
proyecta desde las variables semánticas del recipe.

`typographyRecipe` es el único traductor de `display / headline / title / body /
label / caption` hacia family, size, weight, line-height y letter-spacing.
`Typography` usa `typographyRole` para elegir ese contrato sin ocupar el
atributo ARIA `role`; `Heading` limita la misma propiedad a roles de heading.
Los props históricos `size` permanecen como overrides explícitos pre-1.0.

Los componentes pueden exponer overrides cuando su contrato lo requiera, pero
no deben mantener mapas paralelos de colores, superficies, elevación,
tipografía o state layers.

La density efectiva sigue perteneciendo a `UIViewportProvider`. Sus aliases CSS
activos se propagan a alturas, gaps, padding e iconografía de Button,
Input/Select/Textarea, choice controls, List, Menu, navegación y DataTable.
Un prop local de density sólo es un override explícito sobre las métricas del
Theme; no resuelve viewport por segunda vez.

`Typography`, `Heading` y el reset global consumen las familias tipográficas del
theme. Cambiar la personalidad tipográfica de un theme debe propagarse sin
ramas por nombre de theme dentro de los componentes.
