# BITACORA

## Estado

- Versión cerrada y declarada: `0.3.0`.
- Hito pre-1.0 estable: **CERRADO**.
- Fases `0.2.1`–`0.2.8`: cerradas.
- Validación integral: verde.
- Siguiente trabajo: nuevo mapeo de arquitectura y contratos para detectar bifurcaciones, inconsistencias y oportunidades de simplificación.

## Validación que cerró `0.3.0`

Reportado por el usuario:

- pnpm exacto `10.34.5`: PASS;
- install congelado: PASS;
- internal-test typecheck: PASS;
- Vitest: **393/393 PASS**;
- internal-test build: PASS;
- Chromium: **65/65 PASS**;
- package typecheck: PASS;
- prepack/build ESM/CJS/DTS: PASS;
- tarball: PASS;
- consumidor limpio React 18:
  - install PASS;
  - TypeScript PASS;
  - ESM PASS;
  - CJS PASS;
  - CSS PASS;
- consumidor limpio React 19:
  - install PASS;
  - TypeScript PASS;
  - ESM PASS;
  - CJS PASS;
  - CSS PASS;
- git whitespace: PASS.

Resultado final:

```text
Validation complete.
```

## Garantías vigentes

### Superficie pública

Entry points públicos:

- `zerina-ui`
- `zerina-ui/styles.css`
- `zerina-ui/reset.css`

No son API pública:

- `src/*`
- `core/*` internos
- `helpers/*`
- runtimes internos
- harness/tests/docs operativas

### React

Peer range:

```text
react      >=18 <20
react-dom  >=18 <20
```

Verificado contra:

- React 18.3.1
- React 19.0.0

### Dependencias runtime relevantes

- `framer-motion ^12.38.0`
- `lucide-react ^0.507.0`

Lucide 0.507.0 es el baseline elegido porque cumple simultáneamente:

- React 19 estable;
- tipos compatibles;
- ESM;
- CJS real.

### Release

- `prepack` ejecuta build;
- `prepublishOnly` ejecuta `pnpm validate`;
- `package:verify` instala el tarball fuera del workspace;
- `pnpm validate` es la puerta canónica.

### Interacción y foco

- `preventDefault()` cancela conducta compuesta posterior;
- TriggerRuntime tiene orden progresivo estable;
- focus-visible usa tracker central por `Document`;
- pointer/keyboard se distinguen antes del primer focus;
- Menu liga intención de foco a época de apertura;
- Drawer/BottomSheet comparten runtime modal;
- FocusScope no reatrapa restore-focus al perder ownership.

### Contratos internos compartidos

Owners únicos vigentes:

- presencia de ReactNode;
- merge de IDs ARIA;
- selection engine de navigation;
- renderer compartido de destinos;
- DataTable desktop base;
- frame de dialogs orientados a target;
- modal overlay runtime;
- focus-visible tracker;
- composition helpers de eventos.

## Residuos ya eliminados

- backups `.bak.*`;
- `internal-test/test-results`;
- `.git` anidado de `internal-test`;
- exports accidentales de motion/viewport;
- pipeline duplicado `validate.sh`;
- source contracts históricos que fijaban implementaciones obsoletas.

## Estado estructural conocido

Último análisis previo:

- 291 módulos TS/TSX;
- 291 alcanzables desde `src/index.ts`;
- 0 módulos source huérfanos detectados.

Esto NO implica que no existan duplicaciones o bifurcaciones internas. Sólo significa que no hay módulos totalmente desconectados de la entrada pública.

## Nuevo objetivo de auditoría

El siguiente mapeo debe buscar **bifurcaciones de responsabilidad**, no sólo archivos duplicados.

Ejes:

1. múltiples owners para la misma semántica;
2. familias con APIs parecidas pero reglas distintas sin razón actual;
3. estados derivados calculados de formas diferentes;
4. controlled/uncontrolled implementado más de una vez;
5. cancelación/event ordering divergente;
6. focus/hover/press/keyboard modelados con rutas distintas;
7. ARIA generada por capas diferentes;
8. slots resueltos con mecánicas paralelas;
9. overlays con kernels parcialmente duplicados;
10. recipes/variants que codifican lógica de producto;
11. helpers públicos usados sólo internamente;
12. tipos estructuralmente equivalentes con nombres diferentes;
13. componentes que son wrappers casi vacíos sin contrato propio;
14. tests que fijan source shape en vez de comportamiento;
15. paths de build/harness que no representan consumo real;
16. ramas condicionales que existen sólo por historia, no por contrato vigente.

## Regla para el nuevo mapeo

No asumir que similitud = duplicación.

Para cada candidato registrar:

- owner actual;
- consumidores;
- contrato observable;
- diferencias reales;
- diferencias accidentales;
- riesgo de unificar;
- posible owner común;
- evidencia;
- recomendación:
  - mantener separado;
  - compartir helper;
  - compartir engine;
  - fusionar;
  - eliminar;
  - investigar.

## Próximo paso

Construir un mapa por familias y contratos, priorizado por:

```text
impacto × duplicación × riesgo de divergencia × frecuencia de cambio
```

El objetivo ya no es “hacer pasar la suite”; es reducir el número de lugares donde una misma decisión puede divergir en el futuro.
