# Zerina UI

![NPM Version](https://img.shields.io/npm/v/zerina-ui) ![License](https://img.shields.io/npm/l/zerina-ui) ![Build](https://img.shields.io/badge/build-passing-brightgreen) ![TypeScript](https://img.shields.io/badge/language-TypeScript-blue) ![React](https://img.shields.io/badge/ui-React-61dafb)

**Librería UI tipada para React, diseñada para construir interfaces coherentes, responsivas y altamente componibles.**

---

**Zerina UI** es una librería tipada de componentes UI para React, pensada para construir interfaces de aplicación coherentes: primitivas, componentes, patrones de layout, overlays, movimiento, temas y comportamiento responsive en un solo sistema.

Está diseñada para dashboards de producto, paneles de administración, herramientas internas, interfaces SaaS y aplicaciones React que necesitan una base UI sin renunciar al control sobre la composición, los estilos o los tipos de TypeScript.

---

```tsx
import { ZerinaProvider, Button, Card, CardBody, Heading } from "zerina-ui";
import "zerina-ui/styles.css";

export function App() {
  return (
    <ZerinaProvider>
      <Card p="1rem">
        <CardBody>
          <Heading>Zerina UI</Heading>
          <Button>Empieza a construir</Button>
        </CardBody>
      </Card>
    </ZerinaProvider>
  );
}
```

## Características

* **Componentes React tipados** construidos con TypeScript.
* **Primitivas de diseño** para formularios, layout, tipografía, disclosure y overlays.
* **Patrones de aplicación** como `AppShell`, diálogos, flujos de confirmación y diálogos de formulario basados en objetivo.
* **DataTable responsive** con búsqueda, ordenamiento, paginación, selección, exportación CSV, estados de carga y modo de tarjetas para móvil.
* **EditableDataTable** para edición inline, creación de filas y eliminación de filas.
* **Sistema de temas** con temas integrados y soporte para temas CSS personalizados.
* **Sistema de movimiento** impulsado por Framer Motion con niveles `none`, `reduced`, `subtle` y `expressive`.
* **Sistema de overlays** con portales, capas flotantes, manejo de foco, bloqueo de scroll y capas descartables.
* **Componentes de feedback** como alertas, toasts, skeletons, estados de carga, progreso y estados vacíos.
* **Base de tokens CSS** usando custom properties para colores, radios, sombras, tipografía, controles y movimiento.

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

## Requisitos

* React `>=18 <20`
* React DOM `>=18 <20`
* TypeScript recomendado

Zerina UI también utiliza:

* `framer-motion`
* `lucide-react`

Estas dependencias se instalan como dependencias del paquete.

## Configuración

Importa la hoja de estilos global una sola vez en el punto de entrada de tu aplicación:

```tsx
import "zerina-ui/styles.css";
```

Luego envuelve tu aplicación con `ZerinaProvider`:

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { ZerinaProvider } from "zerina-ui";
import "zerina-ui/styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ZerinaProvider>
      <App />
    </ZerinaProvider>
  </React.StrictMode>
);
```

`ZerinaProvider` compone los providers principales usados por la librería:

* `OverlayProvider`
* `UILayoutProvider`
* `UIMotionProvider`
* `UIThemeProvider`
* `ToastProvider`

## Configuración del Provider

Puedes configurar tema, layout, movimiento, overlays y toasts desde un solo lugar:

```tsx
import { ZerinaProvider } from "zerina-ui";
import "zerina-ui/styles.css";
import "./my-theme.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ZerinaProvider
      theme={{
        defaultTheme: "sinapsis",
        ignoreStoredTheme: true,
        themes: {
          mode: "extend",
          custom: [
            "obsidian-aurora",
            "sinapsis",
            "sol-de-mar",
            "neon-shrine",
            "paper-ink",
          ],
        },
      }}
      layout={{
        defaultMode: "auto",
        mobileBreakpoint: 720,
        deviceKind: "unknown",
      }}
      motion={{
        defaultLevel: "subtle",
        respectReducedMotion: true,
      }}
      toast={{
        placement: "top-right",
        maxToasts: 5,
        defaultDuration: 4500,
      }}
    >
      {children}
    </ZerinaProvider>
  );
}
```

## Estilos y tokens CSS

Zerina UI distribuye sus estilos a través de:

```tsx
import "zerina-ui/styles.css";
```

Este archivo incluye:

* `theme/tokens.css`
* `theme/themes.css`
* `styles/base.css`

El sistema está basado en custom properties de CSS como:

```css
:root {
  --ui-bg: #0b0d10;
  --ui-surface: #111315;
  --ui-text: #f3f4f6;
  --ui-primary: #2f8c79;
  --ui-border: rgba(255, 255, 255, 0.12);
  --ui-radius-md: 0.65rem;
  --ui-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.12);
}
```

Puedes sobrescribir los tokens globalmente o definir temas personalizados usando el atributo `data-ui-theme`.

## Temas

Zerina UI incluye estos temas integrados:

* `light`
* `dark`
* `spring`
* `summer`
* `autumn`
* `winter`
* `retro-futurist`
* `sepia-retro`

Usa el hook de tema dentro del provider:

```tsx
import { Button, useUITheme } from "zerina-ui";

export function ThemeButton() {
  const { theme, cycleTheme } = useUITheme();

  return (
    <Button onClick={cycleTheme} variant="outline">
      Tema actual: {theme}
    </Button>
  );
}
```

### Temas personalizados

Crea tu propio tema apuntando a `data-ui-theme`:

```css
[data-ui-theme="sinapsis"] {
  --ui-bg: #080a12;
  --ui-surface: #111827;
  --ui-surface-2: #172033;
  --ui-text: #f8fafc;
  --ui-text-muted: #cbd5e1;
  --ui-border: rgba(148, 163, 184, 0.18);
  --ui-primary: #8b5cf6;
  --ui-primary-hover: #7c3aed;
  --ui-primary-contrast: #ffffff;
}
```

Luego regístralo:

```tsx
<ZerinaProvider
  theme={{
    defaultTheme: "sinapsis",
    themes: {
      mode: "extend",
      custom: ["sinapsis"],
    },
  }}
>
  <App />
</ZerinaProvider>
```

## Movimiento

El sistema de movimiento expone un provider y hooks para mantener un comportamiento de animación consistente.

Niveles de movimiento soportados:

* `none`
* `reduced`
* `subtle`
* `expressive`

```tsx
<ZerinaProvider
  motion={{
    defaultLevel: "subtle",
    respectReducedMotion: true,
  }}
>
  <App />
</ZerinaProvider>
```

Usa `useUIMotion` cuando un componente deba estar dentro del provider, o `useOptionalUIMotion` cuando sea aceptable usar un fallback seguro.

```tsx
import { useUIMotion } from "zerina-ui";

export function MotionDebug() {
  const motion = useUIMotion();

  return <pre>{motion.effectiveLevel}</pre>;
}
```

## Layout

Zerina UI incluye primitivas responsive de layout y un layout provider usado por componentes como `DataTable` y `AppShell`.

```tsx
<ZerinaProvider
  layout={{
    defaultMode: "auto",
    mobileBreakpoint: 720,
  }}
>
  <App />
</ZerinaProvider>
```

Primitivas comunes de layout:

* `Box`
* `Flex`
* `Stack`
* utilidades de layout y props de espaciado

## Formularios

Zerina UI proporciona primitivas tipadas para formularios con tamaños consistentes, estados de foco, estilos de validación y helpers de composición.

```tsx
import {
  Button,
  Field,
  Input,
  PasswordInput,
  Select,
  Textarea,
} from "zerina-ui";

export function LoginForm() {
  return (
    <form>
      <Field label="Email" isRequired>
        <Input type="email" placeholder="you@example.com" />
      </Field>

      <Field label="Contraseña">
        <PasswordInput placeholder="••••••••" />
      </Field>

      <Field label="Rol">
        <Select
          value="admin"
          onChange={() => {}}
          options={[
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
          ]}
        />
      </Field>

      <Field label="Notas">
        <Textarea placeholder="Notas opcionales" />
      </Field>

      <Button type="submit">Enviar</Button>
    </form>
  );
}
```

Primitivas de formulario disponibles:

* `Button`
* `IconButton`
* `Input`
* `InputGroup`
* `InputRightElement`
* `PasswordInput`
* `SearchInput`
* `Textarea`
* `Select`
* `Checkbox`
* `Radio`
* `RadioGroup`
* `Switch`
* `Field`
* `FormControl`
* `FormLabel`
* `HelpText`
* `FormErrorMessage`

## DataTable

`DataTable` proporciona una experiencia de tabla responsive con ordenamiento, búsqueda, paginación, selección, estados de carga, estados vacíos y exportación CSV.

```tsx
import { DataTable, type DataTableColumn } from "zerina-ui";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const columns: DataTableColumn<User>[] = [
  { header: "Nombre", accessor: "name", sortable: true, searchable: true },
  { header: "Email", accessor: "email", searchable: true },
  { header: "Rol", accessor: "role" },
];

const users: User[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Admin" },
  { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "Editor" },
];

export function UsersTable() {
  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(user) => user.id}
      enableSearch
      enableExportCSV
      exportFilename="users"
      initialRowsPerPage={10}
      mobileMode="auto"
    />
  );
}
```

Props útiles de DataTable:

* `data`
* `columns`
* `getRowId`
* `selectedIds`
* `onSelectionChange`
* `enableSearch`
* `searchKeys`
* `enableExportCSV`
* `exportFilename`
* `initialRowsPerPage`
* `loading`
* `loadingRows`
* `loadingColumns`
* `emptyState`
* `mobileMode`
* `mobileBreakpoint`
* `enableSelection`

## EditableDataTable

`EditableDataTable` extiende la experiencia de tabla con celdas editables, creación de filas y eliminación de filas.

```tsx
import React from "react";
import {
  EditableDataTable,
  type EditableDataTableColumn,
} from "zerina-ui";

type Product = {
  id: string;
  name: string;
  price: number;
  active: boolean;
};

const columns: EditableDataTableColumn<Product>[] = [
  { header: "Nombre", accessor: "name", type: "string", required: true },
  { header: "Precio", accessor: "price", type: "number" },
  { header: "Activo", accessor: "active", type: "boolean" },
];

export function ProductsEditor() {
  const [rows, setRows] = React.useState<Product[]>([
    { id: "p-1", name: "Notebook", price: 20, active: true },
  ]);

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  return (
    <EditableDataTable
      data={rows}
      columns={columns}
      onDataChange={setRows}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      getRowId={(row) => row.id}
      enableSearch
      enableExportCSV
    />
  );
}
```

Tipos de columnas editables:

* `string`
* `text`
* `number`
* `boolean`
* `date`
* `datetime`
* `uuid`
* `json`
* `enum`

## Overlays

Zerina UI incluye primitivas accesibles de overlay construidas sobre el sistema interno de overlays.

Componentes de overlay disponibles:

* `Dialog`
* `Popover`
* `Menu`
* `Tooltip`
* `Drawer`
* `BottomSheet`

Ejemplo de diálogo:

```tsx
import React from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "zerina-ui";

export function ExampleDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir diálogo</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Confirmar acción</DialogTitle>
        </DialogHeader>

        <DialogBody>Esta acción necesita tu confirmación.</DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)}>Continuar</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
```

## Feedback

Los componentes de feedback ayudan a representar estados de carga, vacío, éxito, advertencia y error.

```tsx
import { Alert, EmptyState, LoadingState, Progress } from "zerina-ui";

export function FeedbackExample() {
  return (
    <>
      <Alert
        variant="success"
        title="Guardado"
        description="Tus cambios se almacenaron correctamente."
      />

      <LoadingState loading variant="card" />

      <Progress value={72} showValue label="Subida" />

      <EmptyState
        title="Sin registros"
        description="Crea tu primer elemento para comenzar."
      />
    </>
  );
}
```

Componentes de feedback disponibles:

* `Alert`
* `EmptyState`
* `LoadingState`
* `Progress`
* `Skeleton`
* `SkeletonBlock`
* `SkeletonCard`
* `SkeletonCircle`
* `SkeletonTable`
* `SkeletonText`
* `Spinner`
* `Toast`
* `ToastProvider`
* `useToast`

### Toasts

`ToastProvider` está incluido en `ZerinaProvider`, así que puedes usar `useToast` directamente dentro de tu aplicación.

```tsx
import { Button, useToast } from "zerina-ui";

export function SaveButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: "Guardado",
          description: "El registro fue actualizado.",
          variant: "success",
        })
      }
    >
      Guardar
    </Button>
  );
}
```

## Display y media

Componentes de display:

* `Badge`
* `Card`
* `CardHeader`
* `CardBody`
* `CardFooter`
* `Divider`
* `Tag`

Componentes de media:

* `Avatar`
* `Image`
* `AspectRatio`

```tsx
import { Avatar, Badge, Card, CardBody, Tag } from "zerina-ui";

export function ProfileCard() {
  return (
    <Card interactive>
      <CardBody>
        <Avatar name="Ada Lovelace" />
        <Badge colorScheme="primary">Admin</Badge>
        <Tag removable>TypeScript</Tag>
      </CardBody>
    </Card>
  );
}
```

## AppShell

`AppShell` proporciona un layout responsive para aplicaciones con header, sidebar, barra móvil, controles de tema, menú de usuario y soporte para rutas anidadas.

```tsx
import { UncontrolledAppShell, Typography } from "zerina-ui";

const routes = [
  {
    path: "/",
    name: "Inicio",
    emoji: "🏠",
    element: <Typography>Contenido de inicio</Typography>,
  },
  {
    path: "/settings",
    name: "Configuración",
    emoji: "⚙️",
    element: <Typography>Contenido de configuración</Typography>,
  },
];

export function ShellExample() {
  return (
    <UncontrolledAppShell
      routes={routes}
      brand={{ title: "Zerina App", subtitle: "Dashboard" }}
      user={{ name: "Ada Lovelace", role: "Admin" }}
    />
  );
}
```

Exports disponibles de AppShell:

* `AppShell`
* `UncontrolledAppShell`
* `RoutedAppShell`
* `AppShellHeader`
* `AppShellSidebar`
* `AppShellMobileBar`
* `AppShellContent`
* utilidades y tipos de rutas

## Patrones de diálogo

Zerina UI incluye patrones de diálogo de mayor nivel para flujos comunes de aplicación:

* `ConfirmDialog`
* `ActionDialog`
* `FormDialog`
* `TargetFormDialog`
* `useModalState`
* `useConfirmModal`
* `useFormDialogState`

```tsx
import React from "react";
import { Button, ConfirmDialog, useConfirmModal } from "zerina-ui";

type User = { id: string; name: string };

export function DeleteUserButton({ user }: { user: User }) {
  const confirm = useConfirmModal<User>();

  return (
    <>
      <Button colorScheme="danger" onClick={() => confirm.open(user)}>
        Eliminar
      </Button>

      <ConfirmDialog
        state={confirm.state}
        onOpenChange={(open) => {
          if (!open) confirm.close();
        }}
        title="Eliminar usuario"
        description={(target) => `¿Seguro que quieres eliminar a ${target.name}?`}
        confirmLabel="Eliminar"
        variant="destructive"
        onConfirm={(target) => {
          console.log("delete", target.id);
          confirm.close();
        }}
      />
    </>
  );
}
```

## TypeScript

Zerina UI está escrita en TypeScript y publica archivos de declaración.

```ts
import type {
  DataTableColumn,
  EditableDataTableColumn,
  AppShellRoute,
  UIThemeMode,
} from "zerina-ui";
```

El paquete expone sus tipos desde el punto de entrada principal.

## Exports del paquete

Entrada principal:

```ts
import { Button, ZerinaProvider } from "zerina-ui";
```

Entrada de estilos:

```ts
import "zerina-ui/styles.css";
```

Mapa de exports del paquete:

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  },
  "./styles.css": "./dist/styles.css"
}
```

## Desarrollo

Instalar dependencias:

```bash
pnpm install
```

Ejecutar build:

```bash
pnpm build
```

Ejecutar comprobaciones de TypeScript:

```bash
pnpm typecheck
```

Construir y validar el tarball del paquete:

```bash
pnpm pack:check
```

Modo de desarrollo con watch:

```bash
pnpm dev
```

## Salida del build

Zerina UI se construye con `tsup` y publica:

* Build ESM
* Build CommonJS
* Declaraciones de tipos
* Bundle CSS
* Archivos CSS de tema y base

El paquete marca el CSS como side effects para que los bundlers no eliminen la importación de la hoja de estilos.

## Licencia

Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

