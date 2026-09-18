# Versionado durante estabilización

## Estado

Versión cerrada: `0.2.8`.

Candidato: `0.3.0`.

## `0.3.0`

Es el hito estable pre-1.0 después de cerrar todas las fases `0.2.x`.

No pretende congelar la API como `1.0.0`, pero sí establece:

- API raíz deliberada;
- contratos transversales probados;
- browser real;
- distribución reproducible;
- pack limpio;
- consumidores React 18/19;
- publicación protegida por validación completa.

La versión sólo se incrementará a `0.3.0` después de `pnpm validate` verde con estas garantías.
