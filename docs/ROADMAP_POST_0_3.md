# Roadmap posterior a 0.3.0

## Estado actual

```text
A — correctness/contratos             CERRADA
B — forms convergence                 CERRADA
C — triggers/overlays                 CERRADA
D — state/shells                      CERRADA
E — slots/layout/recipes/types        CERRADA
F — test architecture + sweep         CERRADA
G — validación integrada              CERRADA
```

## Fases cerradas

### A

- target dialogs;
- ReactNode presence;
- event-layer cancellation.

### B

- text controls;
- choice controls;
- press bridge;
- controlled/uncontrolled simple.

### C

- TriggerRuntime;
- FloatingOverlayRuntime;
- ModalOverlayRuntime.

### D

- DataTable shell;
- navigation entries;
- MotionAppFrame.

### E

- slot precedence;
- layout prop matrix;
- Badge/Tag recipe;
- structural type equivalence.

### F

- clasificación A/B/C de tests;
- eliminación de implementation snapshots;
- segundo análisis estructural;
- reachability;
- wrappers/residuos;
- documentación consolidada.

## Hito G — cierre integrado

### Scope

No se modifica producto.

Sólo:

- revisar contratos;
- revisar documentación;
- revisar API;
- revisar distribución;
- comparar baseline y estado final;
- ejecutar la puerta integral.

### Invariantes

```text
src/index.ts no cambia
package exports no cambian
React peer range permanece >=18 <20
React 18/19 consumers permanecen verdes
ESM/CJS/CSS permanecen resolubles
browser permanece verde
```

### Puerta

```bash
pnpm validate
```

### Resultado

G cerró con `Validation complete.`. El ciclo A–G queda **CERRADO** y el conjunto se asigna a `0.4.0`.

## Política de versionado

G está cerrado. El conjunto completo de cambios desde `0.3.0` se asigna a `0.4.0`.
