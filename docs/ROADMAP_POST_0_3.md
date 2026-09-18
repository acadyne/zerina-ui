# Roadmap posterior a `0.3.0`

## Propósito

Este roadmap convierte el mapeo arquitectónico en fases de trabajo coherentes.

No es un listado de micro-refactors.

Cada fase debe:

1. cerrar un conjunto completo de contratos relacionados;
2. reducir owners duplicados;
3. conservar diferencias semánticas reales;
4. terminar con tests dirigidos + `pnpm validate`;
5. consolidar documentación antes de abrir la siguiente fase.

Baseline:

```text
zerina-ui 0.3.0
Vitest     393/393 PASS
Chromium    65/65 PASS
React 18 consumer PASS
React 19 consumer PASS
```

## Estado operativo

```text
Fase A  CERRADA
Fase B  CERRADA
Fase C  ACTIVA — C1 implementada, pendiente de validación
Fase D  PENDIENTE DE B/C
Fase E  pendiente de evidencia de B/C/D
Fase F  pendiente
Hito G  pendiente
```

No se abre Fase B hasta que la puerta integral confirme Fase A.


## Documentos y ownership

### `BITACORA.md`

Estado operativo **actual**.

Debe contener:

- fase activa;
- scope;
- invariantes;
- cambios ya realizados en esa fase;
- validación disponible;
- blockers actuales;
- siguiente acción.

No debe crecer como diario histórico infinito.

### `docs/MAPEO_ARQUITECTURA.md`

Catálogo de evidencia.

Debe responder:

- dónde hay bifurcación;
- qué componentes están repetidos;
- qué diferencias son reales;
- qué owner podría centralizar el contrato.

No es un changelog.

### `docs/ROADMAP_POST_0_3.md`

Este documento.

Define:

- orden de fases;
- dependencias;
- scope;
- out-of-scope;
- criterios de cierre.

### `docs/CONTRATOS.md`

Describe únicamente contratos vigentes después de cada cambio.

### `docs/VALIDACION.md`

Describe la puerta de validación y garantías verificadas.

---

# Fase A — corrección de contratos y owners

## Objetivo

Eliminar primero bifurcaciones que pueden producir comportamiento incorrecto.

## Scope

### A1. TargetFormDialog / FormDialog

Cerrar un único contrato para:

- presencia de target;
- renderables derivados del target;
- submit;
- cancel;
- close;
- `onOpenChange`;
- disabled state.

Corregir:

- truthiness de `target`;
- targets válidos `0`, `""`, `false`;
- posible doble invocación de cancel/close;
- falta de tests dedicados.

Decidir si debe compartir un frame/engine con la familia de dialogs target.

### A2. ReactNode presence en dialogs

Eliminar truthiness accidental para props semánticas:

- description;
- targetLabel;
- footer;
- error;
- mensajes relacionados.

Usar los owners centrales:

- `hasRenderableNode`;
- `hasNonEmptyRenderableNode`;

según el contrato de cada prop.

### A3. Event cancellation transversal

Construir y cerrar una matriz única para:

```text
prop pública
slot local
slot contexto/heredado
child
conducta interna
```

Resolver la divergencia:

- TriggerRuntime: cancelación progresiva;
- Menu: todas las capas externas ejecutan aunque una anterior cancele.

El resultado debe quedar documentado como contrato global.

## Out of scope

- deduplicar Input/Textarea;
- migrar Popover/Tooltip;
- crear FloatingOverlayRuntime;
- cambiar layout API.

## Criterios de cierre

- tests nuevos de `TargetFormDialog`/`FormDialog`;
- tests de targets falsy válidos;
- tests de cancel/close exactamente una vez;
- matriz de event ordering cubierta;
- dialogs usan node presence central;
- tests dirigidos verdes;
- `pnpm validate` verde.

## Resultado esperado

Después de esta fase no debe existir más de una interpretación para:

```text
target presente
ReactNode presente
preventDefault en una cadena compuesta
```

---

# Fase B — convergencia de formularios

## Objetivo

Reducir la duplicación más densa del repositorio sin fusionar APIs públicas distintas.

## Scope

### B1. Text controls

Familia:

- Input;
- Textarea.

Extraer un engine interno que posea:

- field state;
- focus-visible;
- InputGroup descendant state;
- ARIA;
- handlers;
- slot wiring;
- data attributes.

Mantener en wrappers:

- elemento nativo;
- `type`;
- resize;
- padding/layout.

### B2. Choice controls

Familia:

- Checkbox;
- Radio;
- Switch.

Partir de:

- `useChoiceControl`;
- `ChoiceControlRoot`.

Extraer la duplicación restante:

- root/input slots;
- IDs;
- labels;
- ARIA;
- data attributes;
- event wiring.

Conservar diferencias:

- indeterminate;
- RadioGroup;
- switch track/thumb y role.

### B3. Press bridge

Familia:

- Button;
- IconButton;
- Pressable;
- Card cuando aplique.

Centralizar:

```text
slot handlers
→ event composition
→ usePress
→ cleanup/cancellation
```

Preferencia: helper/hook interno, no `ButtonBase` público.

### B4. Field messages

Familia:

- HelpText;
- FormErrorMessage.

Compartir frame de mensaje y node presence.

### B5. Controlled/uncontrolled simple

Auditar y, sólo donde sea realmente equivalente, centralizar estado controlado simple en:

- Collapsible;
- SearchInput;
- RadioGroup;
- UIMotionProvider;
- otros escalares equivalentes encontrados durante la fase.

No aplicar a engines complejos por fuerza.

## Out of scope

- AdaptiveScaffold;
- Tree;
- NavigationStack;
- TabScaffold;
- overlay triggers.

## Criterios de cierre

- Input/Textarea conservan API pública;
- Checkbox/Radio/Switch conservan API pública;
- no cambia semántica de press/focus;
- tests de comportamiento amplían equivalencia entre familias;
- reducción demostrable de owners de lógica;
- `pnpm validate` verde.

## Resultado esperado

Las decisiones de forms dejan de necesitar modificaciones paralelas en múltiples componentes.

---

# Fase C — triggers y overlays

## Objetivo

Cerrar la segunda gran concentración de runtimes paralelos.

## Dependencia

Requiere Fase A cerrada porque usa el contrato global de eventos/cancelación.

## Scope

### C1. Trigger runtime único

Migrar o absorber:

- PopoverTrigger;
- TooltipTrigger;

hacia el mismo kernel que:

- MenuTrigger;
- CollapsibleTrigger.

El runtime debe poder expresar explícitamente:

- child;
- slot local;
- slot heredado/contexto;
- internal handlers;
- refs;
- `asChild`;
- class/style;
- ARIA;
- pointer/focus hooks extra para Tooltip.

Objetivo de limpieza:

- retirar `triggerProps.ts` si queda sin consumidores.

### C2. Floating overlays

Evaluar/crear `FloatingOverlayRuntime` para compartir mecánica entre:

- MenuContent;
- Popover;
- Tooltip;
- NavigationMenuPanel.

Owner candidato:

```text
FloatingLayer
→ dismiss policy
→ focus policy
→ motion
→ portal
```

Las diferencias deben ser opciones semánticas, no callbacks arbitrarios que oculten lógica.

### C3. Dialog hacia runtime modal

Generalizar `ModalOverlayRuntime` para representar:

- modal / non-modal;
- backdrop;
- focus containment;
- restore focus;
- scroll lock;
- aria-modal.

Migrar Dialog si el contrato queda más claro que el owner actual.

Drawer y BottomSheet no deben perder su semántica existente.

## Out of scope

- DataTable;
- navigation stack;
- layout APIs;
- visual redesign.

## Criterios de cierre

- un único contrato de trigger;
- Popover/Tooltip sin runtime paralelo innecesario;
- floating overlays con menos owners;
- Dialog comparte kernel modal cuando sea semánticamente correcto;
- E2E de focus/dismiss/outside/touch/keyboard;
- `pnpm validate` verde.

## Resultado esperado

Cambios futuros de focus/dismiss/trigger no requieren sincronizar múltiples kernels independientes.

---

# Fase D — state engines y shells de producto

## Objetivo

Centralizar duplicación de estado/composición que no pertenece a forms ni overlays.

## Scope

### D1. DataTable shell

Familia:

- DataTable;
- EditableDataTable.

Ya existe `DataTableDesktopBase`.

Extraer ahora el shell compartido:

- responsive mode;
- row identity;
- selection;
- toolbar;
- loading/skeleton;
- export;
- pagination;
- mobile/desktop switching.

Mantener en Editable:

- add/edit/delete;
- editors;
- search/edit policies;
- mobile editable behavior.

### D2. Navigation entries

Familia:

- NavigationStack;
- TabScaffold.

Extraer ownership común:

- entries;
- controlled/internal;
- normalization;
- IDs;
- transition direction;
- updates.

Candidato:

```text
useNavigationEntries
```

Las políticas de empty state/initial entry permanecen explícitas.

### D3. Motion presence duplication

Familia:

- MotionPresence;
- MotionSwitch.

Extraer el frame/helper común sin cambiar API pública.

## Out of scope

- slot precedence global;
- layout public API;
- recipe unification general.

## Criterios de cierre

- DataTable/EditableDataTable con shell único;
- navigation entries con owner único donde corresponda;
- MotionPresence/Switch sin duplicación mecánica;
- contratos públicos preservados;
- `pnpm validate` verde.

---

# Fase E — semántica de slots, layout y tipos

## Objetivo

Resolver inconsistencias que requieren primero una decisión de diseño, no sólo deduplicación.

## Scope

### E1. Slot precedence

Definir una regla transversal para:

```text
base
context
local
public props
internal invariants
```

Responder explícitamente:

- cuándo contexto y local se componen;
- cuándo local reemplaza;
- cómo se combinan className/style;
- cómo se combinan handlers;
- qué puede cancelar qué;
- qué invariantes no pueden ser sobrescritos.

Después decidir si:

- expandir `resolveLayeredSlot`;
- modificar `resolveSlot`;
- crear un owner superior;
- mantener dos herramientas con contratos distintos.

### E2. Layout prop matrix

Comparar:

- Flex;
- Grid;
- Stack;
- Inline;
- Wrap.

Definir qué subsets son deliberados.

Sólo después:

- compartir tipos;
- completar props;
- o documentar diferencias.

### E3. Recipe convergence

Candidatos:

- Badge / Tag;
- otras recipes estructuralmente equivalentes detectadas.

Compartir tokens/variants, no necesariamente componentes.

### E4. Tipos estructuralmente equivalentes

Inventariar:

- unions duplicadas;
- slot types equivalentes;
- state props repetidos;
- size/variant contracts.

Centralizar sólo cuando expresen el mismo concepto.

## Out of scope

- nuevas features;
- cambios visuales por preferencia;
- breaking API sólo por “consistencia estética”.

## Criterios de cierre

- precedencia de slots documentada;
- layout matrix intencional;
- tipos duplicados reducidos donde corresponde;
- recipes compartidas sin borrar semántica;
- `pnpm validate` verde.

---

# Fase F — test architecture y sweep final

## Objetivo

Reducir bifurcaciones de mantenimiento en el harness y demostrar que el mapa quedó cubierto.

## Scope

### F1. Clasificar source tests

Tres clases:

```text
A ownership boundary
B public surface
C implementation snapshot
```

Mantener A/B.

Migrar C hacia:

- behavior;
- semantic source boundary;
- API contract.

### F2. Repetir análisis estructural

Volver a medir:

- reachability;
- módulos huérfanos;
- runtimes duplicados;
- `isControlled`;
- `resolveSlot`;
- `resolveLayeredSlot`;
- `composeEventHandlers`;
- `usePress`;
- Floating/Dismissable/Focus owners.

Comparar contra baseline `0.3.0`.

### F3. Wrappers y residuos

Revisar:

- wrappers casi vacíos;
- aliases sin consumidor;
- helpers internos todavía exportados;
- branches históricas;
- generated/test residue.

### F4. Documentación final

Consolidar:

- BITACORA;
- MAPEO;
- CONTRATOS;
- ARQUITECTURA;
- VALIDACION;
- SUPERFICIE_PUBLICA;
- DISTRIBUCION.

## Criterios de cierre

- no quedan P0/P1 del mapa sin decisión;
- cada diferencia mantenida tiene justificación;
- source tests no bloquean refactors legítimos;
- nuevo reachability limpio;
- `pnpm validate` verde.

---

# Hito G — validación integrada del ciclo

## Objetivo

Cerrar el ciclo completo como un nuevo hito, sin abrir nuevas refactorizaciones.

## Scope

Sólo:

- revisión de contratos;
- docs;
- API;
- distribución;
- validación completa;
- comparación del mapa inicial vs final.

## Puerta

```bash
pnpm validate
```

Además comprobar:

```text
React 18 consumer
React 19 consumer
ESM
CJS
CSS
public exports
pack content
browser
```

## Resultado

Sólo después de este hito se decide la siguiente versión estable.

---

# Dependencias

```text
A — contratos/correctness
│
├── B — forms convergence
│
└── C — triggers/overlays
     │
     └── E — slot precedence (usa evidencia real de B/C)

D — state/shells puede iniciar después de A
│
└── E — tipos/layout puede usar hallazgos de D

A + B + C + D + E
        ↓
F — test architecture + sweep
        ↓
G — cierre integrado
```

## Orden recomendado de ejecución

```text
A
B
C
D
E
F
G
```

Aunque D podría ejecutarse en paralelo conceptual con C, se mantiene secuencial para simplificar validación y bitácora.

---

# Política de versionado

No usar una versión por subtask.

Cada versión futura debe corresponder como mínimo a una fase completa o a un conjunto coherente de fases.

Propuesta provisional:

```text
Fase A        → primer release de corrección posterior a 0.3.0
Fases B–C     → posible milestone de convergencia de interacción
Fases D–E     → posible milestone de convergencia estructural/API
Fases F–G     → siguiente hito estable
```

Los números concretos se asignan al cerrar scope, no antes.

---

# Protocolo de cada fase

Antes de modificar producto:

1. leer `BITACORA.md`;
2. leer el bloque relevante de `MAPEO_ARQUITECTURA.md`;
3. declarar:
   - scope;
   - invariantes;
   - out-of-scope;
   - criterios de cierre;
4. agregar tests que expongan el contrato cuando falten.

Durante:

5. mantener un solo owner por decisión;
6. no introducir compatibilidad legacy sin consumidor;
7. no cambiar API pública accidentalmente;
8. actualizar contratos sólo cuando el comportamiento ya está decidido.

Antes de cerrar:

9. tests dirigidos;
10. typecheck/build según scope;
11. `pnpm validate`;
12. consolidar bitácora;
13. actualizar mapa:
    - RESUELTO;
    - MANTENER SEPARADO;
    - DIFERIDO con causa;
14. sólo entonces abrir la siguiente fase.
