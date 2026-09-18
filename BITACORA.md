# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase activa: **B — convergencia de formularios**.
- B1 text controls + field messages: **CERRADA**.
- B2 choice controls: **IMPLEMENTADA — PENDIENTE DE VALIDACIÓN**.
- B3 press bridge: mapeada, no implementada.
- B4 controlled/uncontrolled simple: pendiente de corte final.
- No se asignó todavía una versión siguiente.

## Validación que cerró B1

```text
tests dirigidos B1       78/78 PASS
Vitest completo         413/413 PASS
Chromium                  65/65 PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
Validation complete.
```

## B1 — resultado vigente

Owners:

- `useTextControlRuntime`;
- `FieldMessageFrame`.

Consumers:

- Input / Textarea;
- HelpText / FormErrorMessage.

No cambió API pública.

## B2 — scope

Familia:

- Checkbox;
- Radio;
- Switch.

Invariantes:

- no fusionar wrappers;
- conservar indeterminate;
- conservar RadioGroup;
- conservar switch role/track/thumb;
- no mover slot precedence global a esta fase;
- obedecer la cancelación progresiva cerrada en Fase A.

## B2 — cambios implementados

Nuevo owner:

`src/primitives/forms/use-choice-control-runtime.ts`

Posee:

- llamada a `useChoiceControl`;
- composición de focus/blur;
- composición click/change;
- readOnly guard;
- common root state props;
- common native input + ARIA props.

Orden de eventos:

```text
public prop
→ input slot
→ internal choice behavior
```

`preventDefault()` detiene toda capa posterior.

Wrappers conservan:

### Checkbox

- native checkbox;
- indeterminate property;
- `aria-checked="mixed"`;
- indicator/mark.

### Radio

- RadioGroup;
- managed selection;
- name/value;
- indicator dot.

### Switch

- native checkbox;
- `role="switch"`;
- `aria-checked`;
- track/thumb.

### Label presence

`ChoiceControlRoot` usa `hasRenderableNode`.

Resultado:

- label `{0}` válida;
- null/undefined/booleans ausentes según owner central.

## Tests B2 añadidos

- `forms-phase-b2-ownership.test.ts`;
- `forms-phase-b2-behavior.test.tsx`.

Protegen:

- owner runtime único;
- diferencias legítimas en wrappers;
- numeric labels;
- progressive cancellation public → slot → internal;
- slot cancellation antes del commit interno.

## Criterio de cierre B2

Debe pasar:

```text
internal-test typecheck
tests B2 dirigidos
regresión completa Block 6 / SettingsList
pnpm validate
```

Sólo después se abre B3.
