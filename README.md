# Zerina UI

![NPM Version](https://img.shields.io/npm/v/zerina-ui) ![License](https://img.shields.io/npm/l/zerina-ui) ![Build](https://img.shields.io/badge/build-passing-brightgreen) ![TypeScript](https://img.shields.io/badge/language-TypeScript-blue) ![React](https://img.shields.io/badge/ui-React-61dafb)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/acadyne/zerina-ui)

**Zerina UI** es una librería UI tipada para React, diseñada para construir interfaces coherentes, accesibles, responsivas, animadas con intención y altamente componibles.

Zerina UI propone una arquitectura de interfaz compuesta por primitivas, componentes, patrones de aplicación y contratos transversales para estilos, viewport, interacción, navegación y movimiento.

Está pensada para dashboards de producto, paneles de administración, herramientas internas, interfaces SaaS, proyectos de Tauri, aplicaciones mobile-first y productos React que necesitan una base UI flexible sin renunciar al control, la composición ni los tipos de TypeScript.

---

## Ejemplo rápido

```tsx
import {
  ZerinaProvider,
  Button,
  Card,
  CardBody,
  Heading,
} from "zerina-ui";
import "zerina-ui/styles.css";

export function App() {
  return (
    <ZerinaProvider>
      <Card interactive>
        <CardBody>
          <Heading>Zerina UI</Heading>
          <Button>Empieza a construir</Button>
        </CardBody>
      </Card>
    </ZerinaProvider>
  );
}
```

---

## Instalación

```bash
pnpm add zerina-ui
```

```bash
npm install zerina-ui
```

```bash
yarn add zerina-ui
```

Zerina UI espera que React y React DOM estén disponibles como peer dependencies:

```bash
pnpm add react react-dom
```

---

## Requisitos

```txt
React >=18 <20
React DOM >=18 <20
TypeScript recomendado
```

Zerina UI utiliza internamente:

```txt
framer-motion
lucide-react
```

---

Radme pendiente de actualizar

---

# Desarrollo

Instalar dependencias:

```bash
pnpm install
```

Ejecutar build:

```bash
pnpm build
```

Ejecutar TypeScript:

```bash
pnpm typecheck
```

Modo desarrollo:

```bash
pnpm dev
```

Construir y validar paquete:

```bash
pnpm pack:check
```

---

# Licencia

Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.
