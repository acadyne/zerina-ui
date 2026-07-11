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

## Configuración básica

Importa los estilos globales una sola vez en el punto de entrada de tu aplicación:

```tsx
import "zerina-ui/styles.css";
```

Envuelve tu aplicación con `ZerinaProvider`:

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

`ZerinaProvider` compone los providers principales de la librería, incluyendo infraestructura para overlays, viewport, motion, tema y toasts.

---

# Sistemas principales

## 1. Styling System

La personalización visual pública se hace mediante:

```txt
styles
slotProps
```

Ejemplo:

```tsx
import { Card } from "zerina-ui";

export function Example() {
  return (
    <Card
      styles={{
        root: {
          padding: "1rem",
          borderRadius: "var(--ui-radius-lg)",
        },
      }}
      slotProps={{
        root: {
          "data-example-card": "",
        },
      }}
    >
      Contenido
    </Card>
  );
}
```

---

## 2. Viewport System

La lógica responsive está centralizada en `core/viewport` y `core/dom`.

El sistema modela:

```txt
mobile
tablet
desktop
window viewport
contained viewport
breakpoints centralizados
medición de elementos
```

Esto evita que cada componente invente su propio `matchMedia`, `innerWidth` o `ResizeObserver`.

Ejemplo conceptual:

```tsx
import { useOptionalUIViewport } from "zerina-ui";

export function ViewportDebug() {
  const viewport = useOptionalUIViewport();

  return <pre>{viewport?.kind}</pre>;
}
```

---

## 3. Interaction System

Zerina UI trata interacción y accesibilidad como parte del diseño base.

El sistema cubre:

```txt
foco
teclado
press
long press
pointer
dismiss
clickable non-native
composite widgets
formularios
tablas
overlays
árboles
menús
command palette
superficies transformables
```

Las activaciones se normalizan mediante `Pressable`, `usePress` y `UIPressEvent`.

```tsx
import type { UIPressEvent } from "zerina-ui";

function handlePress(event: UIPressEvent<HTMLElement>) {
  console.log(event.pointerType);
}
```

`UIPressEvent` unifica activación mediante:

```txt
mouse
touch
pen
keyboard
```

Los componentes interactivos que usan el contrato central exponen `onPress` y, cuando aplica, `onLongPress`, en lugar de usar `MouseEvent` o `PointerEvent` como contrato público común.

---

## 4. Navigation System

La navegación UI es neutral al router.

Zerina UI no acopla sus componentes base a:

```txt
react-router
next/router
next/navigation
tanstack router
wouter
```

Los patrones de navegación trabajan con contratos propios y permiten integración externa mediante adapters o callbacks.

`BottomNavigation` y `NavigationRail` representan navegación, no widgets de tabs.

Sus contenedores usan:

```txt
value
defaultValue
onValueChange
```

Sus items usan:

```txt
value
onPress
aria-current="page"
```

No usan:

```txt
role="tablist"
role="tab"
aria-selected
selectable
onSelect
```

Ejemplo:

```tsx
import { BottomNavigation } from "zerina-ui";

export function MainNavigation() {
  return (
    <BottomNavigation
      value="home"
      onValueChange={(nextValue) => {
        console.log(nextValue);
      }}
    >
      <BottomNavigation.Item
        value="home"
        onPress={(event) => {
          console.log(event.pointerType);
        }}
      >
        Inicio
      </BottomNavigation.Item>
    </BottomNavigation>
  );
}
```

La integración con un router sigue viviendo en la aplicación consumidora.

```tsx
import { RoutedAppShell } from "zerina-ui";

export function AppLayout() {
  return (
    <RoutedAppShell
      routes={routes}
      navigate={(path) => {
        // integrar aquí el router de tu app
      }}
    />
  );
}
```

---

## 5. Motion System

El movimiento está centralizado en `core/motion`.

Niveles soportados:

```txt
none
reduced
subtle
expressive
```

Intenciones soportadas:

```txt
fade
scale
slide
collapse
expand
press
feedback
layout
progress
```

Ejemplo:

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

Hooks:

```tsx
import { useUIMotion } from "zerina-ui";

export function MotionDebug() {
  const motion = useUIMotion();

  return <pre>{motion.effectiveLevel}</pre>;
}
```

El sistema respeta `prefers-reduced-motion` y sincroniza atributos globales:

```txt
data-ui-motion
data-ui-motion-effective
data-ui-reduced-motion
```

---

# Provider

`ZerinaProvider` centraliza la configuración global.

Ejemplo:

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
          custom: ["sinapsis"],
        },
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

---

# Estilos y tokens CSS

Zerina UI distribuye sus estilos con:

```tsx
import "zerina-ui/styles.css";
```

El sistema está basado en custom properties:

```css
:root {
  --ui-bg: #0b0d10;
  --ui-surface: #111315;
  --ui-surface-2: #171a1f;
  --ui-text: #f3f4f6;
  --ui-text-muted: #9ca3af;
  --ui-primary: #2f8c79;
  --ui-danger: #ef4444;
  --ui-border: rgba(255, 255, 255, 0.12);
  --ui-radius-md: 0.65rem;
  --ui-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.12);
}
```

Puedes sobrescribir tokens globalmente o definir temas personalizados con `data-ui-theme`.

---

## Temas

Zerina UI incluye soporte para temas CSS.

Ejemplo de tema personalizado:

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

Registro:

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

Hook de tema:

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

---

# Primitivas

Zerina UI incluye primitivas base para construir interfaces.

## Layout

```txt
Box
Flex
Stack
Screen
ScrollArea
AspectRatio
```

Ejemplo:

```tsx
import { Box, Flex, Stack } from "zerina-ui";

export function LayoutExample() {
  return (
    <Stack gap="1rem">
      <Box>Header</Box>
      <Flex align="center" justify="space-between">
        <span>Contenido</span>
        <span>Acción</span>
      </Flex>
    </Stack>
  );
}
```

---

## Tipografía

```txt
Typography
Heading
Text
```

---

## Formularios

Zerina UI proporciona primitivas tipadas para formularios, estados de validación y composición accesible.

```tsx
import {
  Button,
  FormControl,
  FormLabel,
  HelpText,
  FormErrorMessage,
  Input,
  PasswordInput,
  Checkbox,
  Switch,
} from "zerina-ui";

export function LoginForm() {
  return (
    <form>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="you@example.com" />
        <HelpText>Usa tu correo principal.</HelpText>
      </FormControl>

      <FormControl id="password">
        <FormLabel>Contraseña</FormLabel>
        <PasswordInput placeholder="••••••••" />
      </FormControl>

      <Checkbox>Acepto los términos</Checkbox>

      <Switch>Recordarme</Switch>

      <Button type="submit">Entrar</Button>
    </form>
  );
}
```

Primitivas disponibles:

```txt
Button
IconButton
Input
InputGroup
InputRightElement
PasswordInput
SearchInput
Textarea
Select
Checkbox
Radio
RadioGroup
Switch
Field
FormControl
FormLabel
HelpText
FormErrorMessage
```

---

## Disclosure

```txt
Collapsible
```

`Collapsible` usa el Motion System para animar expansión, colapso e iconos sin duplicar duración o easing.

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "zerina-ui";

export function ExampleCollapsible() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Detalles</CollapsibleTrigger>
      <CollapsibleContent>
        Contenido expandible.
      </CollapsibleContent>
    </Collapsible>
  );
}
```

---

# Componentes

## Display y media

```txt
Avatar
Badge
Card
CardHeader
CardBody
CardFooter
Divider
Tag
Image
ImageViewer
TransformableSurface
```

Ejemplo:

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

`Card interactive` incluye semántica de teclado y press motion centralizado.

---

## Feedback

```txt
Alert
EmptyState
LoadingState
Progress
Skeleton
SkeletonBlock
SkeletonCard
SkeletonCircle
SkeletonTable
SkeletonText
Spinner
Toast
ToastProvider
useToast
```

Ejemplo:

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

### Toasts

`ToastProvider` está incluido en `ZerinaProvider`.

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

---

## Overlays

Zerina UI incluye overlays accesibles con portales, bloqueo de scroll, manejo de foco, dismiss y motion centralizado.

```txt
Dialog
Drawer
BottomSheet
Popover
Menu
Tooltip
```

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

        <DialogBody>
          Esta acción necesita tu confirmación.
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)}>
            Continuar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
```

---

## DataTable

`DataTable` proporciona tabla responsive con búsqueda, ordenamiento, paginación, selección, estados de carga, estado vacío, exportación CSV y modo de tarjetas para móvil.

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

Accesibilidad incluida:

```txt
headers con scope
aria-sort
selección con aria-label
modo móvil con list/listitem
```

---

## EditableDataTable

`EditableDataTable` extiende la tabla con edición inline, creación y eliminación de filas.

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

  return (
    <EditableDataTable
      data={rows}
      columns={columns}
      onDataChange={setRows}
      getRowId={(row) => row.id}
      enableSearch
      enableExportCSV
    />
  );
}
```

Tipos de columnas editables:

```txt
string
text
number
boolean
date
datetime
uuid
json
enum
```

---

## Tree

`Tree` proporciona estructura jerárquica con semántica accesible.

Incluye metadata ARIA posicional:

```txt
aria-posinset
aria-setsize
```

---

## CommandPalette

`CommandPalette` proporciona búsqueda y ejecución de comandos con semántica listbox/searchbox conectada.

Incluye:

```txt
input con aria-controls
aria-activedescendant
listbox
opciones identificables
soporte de teclado
```

---

## NavigationMenu

`NavigationMenu` soporta dos modos semánticos:

```txt
navigation
menubar
```

Por defecto usa semántica de navegación. El modo `menubar` es opt-in cuando realmente se necesita comportamiento de menú.

---

# Patrones de aplicación

## AppShell

`AppShell` proporciona layout de aplicación con rutas, navegación lateral, header, contenido y comportamiento responsive.

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

Exports comunes:

```txt
AppShell
UncontrolledAppShell
RoutedAppShell
AppShellHeader
AppShellSidebar
AppShellMobileBar
AppShellContent
```

`RoutedAppShell` es neutral al router. Recibe una función `navigate` para integrarse con la librería de rutas que uses.

---

## NavigationStack

`NavigationStack` permite navegación tipo stack con `push`, `replace`, `pop`, `popToRoot` y `reset`.

```tsx
import { NavigationStack, useNavigationStack, Button } from "zerina-ui";

function HomeScreen() {
  const navigation = useNavigationStack();

  return (
    <Button onClick={() => navigation.push("details", { id: "42" })}>
      Ver detalle
    </Button>
  );
}

function DetailsScreen() {
  const navigation = useNavigationStack();

  return (
    <Button onClick={() => navigation.pop()}>
      Volver
    </Button>
  );
}

export function StackExample() {
  return (
    <NavigationStack initialName="home" animation="slide">
      <NavigationStack.Screen name="home" component={HomeScreen} />
      <NavigationStack.Screen name="details" component={DetailsScreen} />
    </NavigationStack>
  );
}
```

La navegación usa `MotionSwitch` y direcciones `forward`, `back` y `replace` para transiciones fluidas.

---

## AdaptiveScaffold

`AdaptiveScaffold` adapta la navegación y el contenido según viewport:

```txt
mobile
tablet
desktop
```

Puede usar:

```txt
bottom navigation
navigation rail
sidebar
```

Ejemplo conceptual:

```tsx
import { AdaptiveScaffold } from "zerina-ui";

export function Dashboard() {
  return (
    <AdaptiveScaffold
      items={[
        { id: "home", label: "Inicio", content: <div>Inicio</div> },
        { id: "settings", label: "Ajustes", content: <div>Ajustes</div> },
      ]}
      defaultActiveId="home"
    />
  );
}
```

---

## TabScaffold

`TabScaffold` permite flujos por pestañas con stacks internos de navegación.

Útil para experiencias mobile-first donde cada tab conserva su propio historial.

---

## Patrones de diálogo

Zerina UI incluye patrones de diálogo de alto nivel:

```txt
ConfirmDialog
ActionDialog
FormDialog
TargetFormDialog
useModalState
useConfirmModal
useFormDialogState
```

Ejemplo:

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
        description={(target) =>
          `¿Seguro que quieres eliminar a ${target.name}?`
        }
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

---

## Settings

Zerina UI incluye patrones para listas de configuración:

```txt
SettingsList
SettingsList.Section
SettingsList.Item
SettingsList.Switch
SettingsList.Checkbox
SettingsList.Select
```

Las filas activables usan `onPress` y `onLongPress`.

`SettingsList.Switch` y `SettingsList.Checkbox` comunican cambios mediante `SettingsCheckedChangeEvent`.

```ts
event.source === "row";
event.source === "control";
```

Esto permite distinguir si el cambio se originó al presionar la fila o al operar directamente el control.

---

# TypeScript

Zerina UI está escrita en TypeScript y publica declaraciones de tipos.

```ts
import type {
  AppShellRoute,
  DataTableColumn,
  EditableDataTableColumn,
  SettingsCheckedChangeEvent,
  UIPressEvent,
  UIMotionLevel,
} from "zerina-ui";
```

Los tipos públicos forman parte de la API.

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
