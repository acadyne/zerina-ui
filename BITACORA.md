# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase activa: **B — convergencia de formularios**.
- Subfase actual: **B1 — text controls + field messages**.
- B1: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- B2 choice controls: mapeada, no implementada.
- B3 press bridge: mapeada, no implementada.
- No se asignó todavía una versión siguiente.

## Baseline al abrir Fase B

```text
tests dirigidos Fase A      23/23 PASS
Vitest completo            405/405 PASS
Chromium                     65/65 PASS
React 18 consumer                PASS
React 19 consumer                PASS
Validation complete.
```

## Scope de Fase B

1. text controls;
2. choice controls;
3. press bridge;
4. field messages;
5. controlled/uncontrolled simple sólo donde haya equivalencia real.

Fuera de scope:

- overlays;
- DataTable;
- navigation stack;
- slot precedence global;
- layout/types globales.

## B1 — cambios implementados

### Text controls

Nuevo owner:

`src/primitives/forms/use-text-control-runtime.ts`

Posee:

- field state;
- focus-visible;
- InputGroup descendant state;
- ARIA;
- native state común;
- data-state común.

`Input` conserva:

- input nativo;
- type;
- appearance;
- leftPadding;
- layout específico.

`Textarea` conserva:

- textarea nativo;
- resize;
- layout específico.

No se cambió API pública.

### Field messages

Nuevo owner:

`src/primitives/forms/FieldMessageFrame.tsx`

`HelpText` y `FormErrorMessage` son wrappers finos.

El frame posee:

- FieldContext;
- node presence;
- field ID;
- invalid gating;
- role;
- tipografía compartida.

No se cambió API pública.

### Tests B1

Nuevos:

- `forms-phase-b1-ownership.test.ts`;
- `forms-phase-b1-behavior.test.tsx`.

Protegen:

- ownership del runtime;
- wrappers nativos separados;
- equivalencia Field/ARIA/data-state;
- numeric ReactNode;
- boolean absence;
- error visibility.

## B2 — mapa vigente

Choice controls ya comparten `useChoiceControl`, pero todavía duplican:

- handlers del input slot;
- focus/blur;
- click/change;
- readOnly guard;
- root state attrs;
- native input props;
- label slot.

Diferencias legítimas:

- Checkbox: indeterminate;
- Radio: group/value/name;
- Switch: role/track/thumb.

Owner candidato:

`useChoiceControlRuntime`

sin fusionar markup.

## B3 — mapa vigente

Button/IconButton/Pressable/Card repiten el bridge:

```text
slot root handlers
→ composeEventHandlers
→ usePress
```

Owner candidato:

`usePressSlotBridge`.

No crear BaseButton público.

## Criterio para cerrar B1

Debe pasar:

```text
internal-test typecheck
tests B1 dirigidos
regresión forms relevante
pnpm validate
```

Sólo después se implementa B2.
