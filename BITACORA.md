# BITACORA

## Estado actual

- Versión cerrada: `0.3.0`.
- Fase A: **CERRADA**.
- Fase activa: **B — convergencia de formularios**.
- B1 text controls + field messages: **CERRADA**.
- B2 choice controls: **CERRADA**.
- B3 press bridge: **CERRADA**.
- B4 controlled/uncontrolled simple: **IMPLEMENTADA — CANDIDATO CORREGIDO, PENDIENTE DE VALIDACIÓN**.
- No se asignó todavía una versión siguiente.

## Validación que cerró B3

```text
tests dirigidos B3       44/44 PASS
Vitest completo         431/431 PASS
Chromium                  65/65 PASS
internal-test typecheck       PASS
package typecheck             PASS
build ESM/CJS/DTS             PASS
React 18 consumer             PASS
React 19 consumer             PASS
ESM/CJS/CSS                   PASS
Validation complete.
```

## B4 — decisión

Sí existe una abstracción común, pero sólo para la fuente de verdad.

Nuevo owner:

`src/core/react/useControllableValue.ts`

Contrato:

```text
value !== undefined
→ controlled

value === undefined
→ internal state
```

El helper:

- inicializa internal state desde `defaultValue`;
- ignora internal writes mientras está controlled;
- no sincroniza el valor controlled hacia internal state;
- no ejecuta callbacks;
- no normaliza;
- no conoce disabled/readOnly;
- no conoce semántica de dominio.

Esto preserva el timing existente de cada consumidor.

## Consumidores migrados

Simples:

- Collapsible;
- Accordion;
- NavigationList;
- SearchInput;
- RadioGroup;
- UIMotionProvider.

Engines especializados que sólo delegan source-of-truth:

- useNavigationSelection;
- useChoiceControl.

## Consumidores no migrados

Deliberadamente permanecen especializados:

- AdaptiveScaffold;
- NavigationStack;
- TabScaffold.

Motivo:

coordinan normalización y/o múltiples estados relacionados. Pertenecen a Fase D, no a un hook escalar.

## Tests B4

Nuevos:

- `forms-phase-b4-ownership.test.ts`;
- `forms-phase-b4-behavior.test.tsx`.

Protegen:

- owner único;
- scope deliberado;
- controlled write rejection;
- persistencia del último estado uncontrolled;
- Collapsible uncontrolled commit;
- controlled rejected update.

## Criterio de cierre B4 / Fase B

Debe pasar:

```text
internal-test typecheck
tests B4 dirigidos
regresión forms relevante
pnpm validate
```

Si queda verde:

1. B4 se marca CERRADA;
2. Fase B completa se marca CERRADA;
3. se consolidan mapa/contratos/bitácora;
4. se abre Fase C — triggers y overlays.

## Corrección del candidato B4

La primera validación detectó un residuo de la implementación anterior en `SearchInput`.

El estado ya había migrado a:

```text
currentValue
setInternalValue
```

pero el JSX todavía renderizaba:

```text
isControlled ? value : internalValue
```

Esos símbolos ya no existían.

Corrección aplicada:

```text
value={currentValue}
```

Además, el test de ownership B4 ahora exige que `SearchInput` no contenga referencias a:

- `isControlled`;
- `internalValue`.

No cambió el diseño de `useControllableValue`; fue una migración incompleta localizada en el wrapper.
