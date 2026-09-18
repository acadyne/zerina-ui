# Validación

## Puerta única

```bash
pnpm validate
```

Es autosuficiente. No necesita un `pnpm install` externo.

## Cobertura de la puerta

- versión exacta de pnpm;
- lockfile/workspace;
- harness TypeScript;
- Vitest completo;
- build del harness;
- Chromium completo;
- paquete TypeScript;
- build ESM/CJS/CSS/DTS;
- pack real;
- consumidores limpios React 18 y React 19;
- TypeScript del consumidor;
- ESM/CJS/CSS;
- contenido y exports del tarball;
- whitespace Git.

## Estado cerrado de `0.2.8`

Validación reportada:

- pnpm 10.34.5: PASS;
- workspace install: PASS;
- internal-test typecheck: PASS;
- Vitest: 389/389 PASS;
- internal-test build: PASS;
- Chromium: 65/65 PASS;
- package typecheck: PASS;
- build ESM/CJS/DTS: PASS;
- pack: PASS;
- consumidor limpio React 18: PASS;
- ESM/CJS/CSS: PASS;
- git whitespace: PASS.

## Candidato `0.3.0`

Añade:

- build automático en `prepack`;
- `pnpm validate` en `prepublishOnly`;
- segundo consumidor limpio con React 19;
- tests de contrato del proceso de release.

Para cerrar:

```bash
pnpm validate
```

## Primer resultado de `0.3.0`

El primer run confirmó toda la puerta hasta React 19. React 18 quedó completamente verde.

React 19 falló dentro de `lucide-react@0.468.0` por el tipo removido `ReactSVG`.

Se actualizó Lucide a `^0.475.0` en root/harness/lockfile. Debe repetirse la puerta completa:

```bash
pnpm validate
```

No se acepta `skipLibCheck` como solución al peer range.

## Segundo resultado de `0.3.0`

Después de corregir los tipos React 19 con Lucide 0.475.0, el consumidor React 18 reveló una regresión CJS de esa versión:

```text
ReferenceError: require is not defined in ES module scope
```

Se reemplazó el baseline por `lucide-react@^0.507.0`, que declara React 19 estable y publica el entry CJS sin marcar el paquete como ESM.

Debe repetirse la puerta completa:

```bash
pnpm validate
```

No se debilita el smoke CJS: forma parte del contrato público de `zerina-ui`.
