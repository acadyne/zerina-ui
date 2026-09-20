# BITACORA

## Objetivo actual

Refactorizar `zerina-ui` sin obligaciones de compatibilidad histórica, eliminando procesos duplicados y dejando un único owner por mecánica transversal.

La demo permanece como consumidor de integración para fases posteriores.

## Invariante de compatibilidad

El usuario autorizó cambios breaking y no desea legacy.

Por tanto:

- no mantener aliases deprecated para responsabilidades eliminadas;
- no conservar dos procesos para la misma mecánica;
- actualizar todos los consumidores al owner único;
- no dejar implementaciones parciales ni adapters temporales;
- no ocultar errores de tipos con casts;
- cada extracción debe quedar acompañada de regresión.

La evolución apunta semánticamente a `0.5.0`; la metadata se cambiará al cierre.

## Estado actual

- Fase 1 — superficie pública + package gate: **CERRADA Y VALIDADA**.
- Fase 2A — fundamentos unificados: **CERRADA Y VALIDADA**.
- Fase 2B — Navigation Destinations: **IMPLEMENTADA R3, PENDIENTE DE `pnpm validate`**.
- Fase 2C — ownership de Scaffold: no iniciada.
- Fase 3 — Navigation Presenter/política responsive: no iniciada.

## Fase 2B — owners consolidados

### Vocabulario

Un solo vocabulario compartido:

```text
NavigationSurface*
NavigationDestination*
NavigationSelection*
```

BottomNavigation y NavigationRail sólo conservan tipos propios cuando expresan diferencias reales de orientación/layout.

### Contratos

Owner:

```text
src/primitives/navigation/shared/navigationDestination.types.ts
```

Familias:

```text
BottomNavigationProps
BottomNavigationItemProps
NavigationRailProps
NavigationRailItemProps
```

heredan:

```text
NavigationDestinationRootProps
NavigationDestinationPublicItemProps
```

### Context

Owner:

```text
src/primitives/navigation/shared/navigationDestinationContext.tsx
```

### Estado/resolución de item

Owner:

```text
src/primitives/navigation/shared/navigationDestinationState.ts
```

### Factory

Owner:

```text
src/primitives/navigation/shared/createNavigationDestinationItem.tsx
```

Corregido en R2 para usar el tipo real de `forwardRef`:

```ts
React.PropsWithoutRef<TProps>
```

sin casts.

### Styles

Owner:

```text
src/primitives/navigation/shared/navigationDestination.styles.ts
```

Utilities familiares duplicadas eliminadas.

## Gates de Fase 2B

### Intento R1

Falló en typecheck:

```text
TS2322 PropsWithoutRef<TProps> -> TProps
```

Corregido en R2 en el factory compartido.

### Intento R2

Typecheck: PASS.

Vitest:

```text
1 failed | 82 passed
593 passed | 1 failed
```

Fallo:

```text
semantics-phase-e4-type-equivalence-ownership.test.ts
```

La prueba todavía esperaba que BottomNavigation y NavigationRail mencionaran directamente tipos compartidos.

Eso contradice el ownership nuevo.

### Corrección R3

La regresión ahora valida la cadena:

```text
navigation-shared.types
        ↓
navigationDestination.types
        ↓
family props inheritance
```

y exige que los archivos familiares no conozcan directamente `NavigationSurfacePosition` ni `NavigationSelectionContext`.

No se modificó código productivo para satisfacer esta prueba.

## Validado en este runtime después de R3

- semantic owner contiene todos los dominios compartidos: PASS;
- shared props owner consume esos dominios: PASS;
- BottomNavigation hereda contratos compartidos: PASS;
- NavigationRail hereda contratos compartidos: PASS;
- referencias directas a `NavigationSurfacePosition` en archivos familiares: 0;
- referencias directas a `NavigationSelectionContext` en archivos familiares: 0.

## No validado

- Falta ejecutar `pnpm validate` sobre R3.
- Fase 2B no se considera cerrada hasta ese PASS.
- Fase 2C no comienza antes del PASS.

## Siguiente paso

Usar el proyecto completo R3:

```bash
pnpm install
pnpm validate
```

Si pasa integralmente:

1. cerrar Fase 2B;
2. entrar a Fase 2C;
3. fijar ownership de Scaffold/ScreenContent/scroll antes de tocar la API.
