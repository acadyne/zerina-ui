// internal-test/src/catalog/catalog.registry.ts

import type {
  CatalogEntry,
} from "./catalog.types";

import {
  TreeDebug,
} from "../TreeDebug";

import {
  NavigationMenuDebug,
} from "../NavigationMenuDebug";

import {
  AdaptiveScaffoldDebug,
} from "../AdaptiveScaffoldDebug";

import {
  ThemeDebug,
} from "../ThemeDebug";

import {
  ViewportDebug,
} from "../ViewportDebug";
import { ScreenDebug } from "../ScreenDebug";
import { ScreenStateDebug } from "../ScreenStateDebug";
import {
  ScrollAreaDebug,
} from "../ScrollAreaDebug";

import {
  PressableDebug,
} from "../PressableDebug";

import {
  ListDebug,
} from "../ListDebug";

import {
  NavigationListDebug,
} from "../NavigationListDebug";

import {
  BottomNavigationDebug,
} from "../BottomNavigationDebug";

import {
  NavigationRailDebug,
} from "../NavigationRailDebug";

import {
  ScaffoldDebug,
} from "../ScaffoldDebug";

import {
  TopAppBarDebug,
} from "../TopAppBarDebug";

import {
  NavigationStackDebug,
} from "../NavigationStackDebug";

import {
  DrawerNavigationDebug,
} from "../DrawerNavigationDebug";
import { TabScaffoldDebug } from "../TabScaffoldDebug";

import {
  ActionSheetDebug,
} from "../ActionSheetDebug";

import {
  SettingsListDebug,
} from "../SettingsListDebug";

import {
  TransformableSurfaceDebug
} from "../TransformableSurfaceDebug";

import {
  ImageViewerDebug,
} from "../ImageViewerDebug";

export const COMPONENT_CATALOG: CatalogEntry[] = [
  {
    id: "tree",

    title: "Tree",

    category: "components",

    description:
      "Componente jerárquico con selección y expansión.",

    component:
      TreeDebug,
  },

  {
    id: "navigation-menu",

    title: "Navigation Menu",

    category: "components",

    description:
      "Sistema de navegación jerárquico.",

    component:
      NavigationMenuDebug,
  },

  {
    id: "adaptive-scaffold",

    title: "Adaptive Scaffold",

    category: "patterns",

    description:
      "Patrón adaptativo para mobile, tablet y desktop.",

    component:
      AdaptiveScaffoldDebug,
  },
  {
    id: "theme",

    title: "Theme",

    category: "core",

    description:
      "Sistema de temas, metadata e icon registry.",

    component:
      ThemeDebug,
  },

  {
    id: "viewport",

    title: "Viewport",

    category: "core",

    description:
      "Sistema de inteligencia responsive, input y density.",

    component:
      ViewportDebug,
  },


  {
    id: "screen",

    title: "Screen",

    category: "primitives",

    description:
      "Primitive de composición estructural de pantallas.",

    component:
      ScreenDebug,
  },


  {
    id: "screen-state",

    title: "Screen State",

    category: "patterns",

    description:
      "Sistema de estados loading, empty, error y success.",

    component:
      ScreenStateDebug,
  },
  {
    id: "scroll-area",

    title: "Scroll Area",

    category: "primitives",

    description:
      "Primitive para áreas con scroll controlado en uno o ambos ejes.",

    component:
      ScrollAreaDebug,
  },
  {
    id: "pressable",

    title: "Pressable",

    category: "primitives",

    description:
      "Primitive interactivo con soporte para pointer, teclado, long press y render state.",

    component:
      PressableDebug,
  },
  {
    id: "list",

    title: "List",

    category: "primitives",

    description:
      "Primitive de listas estáticas e interactivas con secciones, densidad, selección y separadores.",

    component:
      ListDebug,
  },
  {
    id: "navigation-list",

    title: "Navigation List",

    category: "primitives",

    description:
      "Navegación jerárquica con selección, expansión independiente, modo colapsado y flyouts accesibles.",

    component:
      NavigationListDebug,
  },
  {
    id: "bottom-navigation",

    title: "Bottom Navigation",

    category: "primitives",

    description:
      "Navegación inferior con selección, reselección, labels accesibles, indicadores, densidades y posiciones.",

    component:
      BottomNavigationDebug,
  },
  {
    id: "navigation-rail",

    title: "Navigation Rail",

    category: "primitives",

    description:
      "Navegación lateral compacta con selección, reselección, labels accesibles, indicadores, posiciones y placement.",

    component:
      NavigationRailDebug,
  },
  {
    id: "scaffold",

    title: "Scaffold",

    category: "patterns",

    description:
      "Estructura de pantalla con app bar, body, scroll administrado, footer, floating y viewport contenido o de ventana.",

    component:
      ScaffoldDebug,
  },

  {
    id: "top-app-bar",

    title: "Top App Bar",

    category: "patterns",

    description:
      "Barra superior con tamaños, variantes, centrado visual, contenido personalizado, sticky, safe area y slots.",

    component:
      TopAppBarDebug,
  },
  {
    id: "navigation-stack",

    title: "Navigation Stack",

    category: "patterns",

    description:
      "Historial de pantallas con push, pop, replace, reset, modo controlado y no controlado, params, fallbacks, fragments y animaciones.",

    component:
      NavigationStackDebug,
  },
  {
    id: "drawer-navigation",

    title: "Drawer Navigation",

    category: "patterns",

    description:
      "Navegación lateral con jerarquía, selección controlada, cierre cancelable, placements, tamaños, slots, foco, dismiss y contenido falsy.",

    component:
      DrawerNavigationDebug,
  },
  {
    id: "tab-scaffold",

    title: "Tab Scaffold",

    category: "patterns",

    description:
      "Integración de Scaffold, TopAppBar, NavigationStack y BottomNavigation con modos controlado y no controlado, slots, fallback, navegación, contenido falsy y ref al root.",

    component:
      TabScaffoldDebug,
  },
  {
    id: "action-sheet",

    title: "Action Sheet",

    category: "patterns",

    description:
      "Acciones contextuales sobre BottomSheet y List con cierre automático cancelable, tonos, secciones, contenido falsy, foco, dismiss, scroll y slots.",

    component:
      ActionSheetDebug,
  },
  {
    id: "settings-list",

    title: "Settings List",

    category: "patterns",

    description:
      "Lista de ajustes con items estáticos e interactivos, Switch, Checkbox y Select; cubre refs, props DOM, estado controlado y no controlado, preventDefault, valores nativos y contenido falsy.",

    component:
      SettingsListDebug,
  },
  {
    id: "transformable-surface",

    title: "Transformable Surface",

    category: "components",

    description:
      "Superficie transformable con pan, pinch, rueda, doble interacción, teclado, límites, contenido centrado, API imperativa, refs y slots.",

    component:
      TransformableSurfaceDebug,
  },
  {
    id: "image-viewer",

    title: "Image Viewer",

    category: "components",

    description:
      "Visor de imágenes con carga, error, retry, estado vacío, transformaciones controladas y no controladas, fit, bounds, slots, refs y API imperativa.",

    component:
      ImageViewerDebug,
  },
];