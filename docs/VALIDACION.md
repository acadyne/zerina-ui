# Validación

## Puerta canónica

```bash
pnpm validate
```

## Estado de `0.3.0`

Última ejecución reportada:

```text
Vitest                393/393 PASS
Chromium               65/65 PASS
Package typecheck           PASS
Build ESM/CJS/DTS           PASS
React 18 consumer           PASS
React 19 consumer           PASS
ESM/CJS/CSS                 PASS
Git whitespace              PASS
Validation complete.
```

## Regla

El nuevo ciclo de arquitectura no debe reducir esta puerta.

Toda mejora futura deberá conservar:

- comportamiento;
- tipos;
- browser;
- distribución;
- compatibilidad React 18/19.
