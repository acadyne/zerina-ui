// src/patterns/scaffold/tab-scaffold/tabScaffold.types.ts
import React from "react";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";
import type { BottomNavigationProps } from "../../../primitives/navigation/bottom-navigation";
import type {
  NavigationStackAnimation,
  NavigationStackEntry,
  NavigationStackParams,
  NavigationStackScreenRenderProps,
  NavigationStackTransitionDirection,
} from "../../navigation-stack";
import type { BackButtonProps } from "../BackButton";
import type {
  ScaffoldProps,
  ScaffoldViewport,
} from "../Scaffold";
import type { TopAppBarProps } from "../TopAppBar";

export type TabScaffoldHeaderValue =
  | React.ReactNode
  | ((context: TabScaffoldRenderContext) => React.ReactNode);

export type TabScaffoldSlot =
  | "root"
  | "appBar"
  | "stack"
  | "screen"
  | "bottomNavigation"
  | "floating";

export type TabScaffoldStyles =
  SlotStyleMap<TabScaffoldSlot>;

export type TabScaffoldSlotProps =
  SlotPropsMap<TabScaffoldSlot>;

/**
 * Descriptor de una sección raíz visible en la navegación
 * inferior de TabScaffold.
 *
 * No representa una pantalla renderizable.
 *
 * El contenido asociado debe declararse por separado mediante
 * TabScaffoldScreen, usando el mismo identificador:
 *
 * tab.value === screen.name
 */
export interface TabScaffoldTab {
  value: string;

  label?: React.ReactNode;
  ariaLabel?: string;

  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;
}

/**
 * Pantalla renderizable dentro del NavigationStack de TabScaffold.
 *
 * No es un NavigationNode ni un descriptor visual de tab.
 *
 * Puede representar:
 *
 * - la pantalla raíz de un tab
 * - una pantalla secundaria
 * - una pantalla profunda del stack
 */
export interface TabScaffoldScreen {
  name: string;

  title?: TabScaffoldHeaderValue;
  subtitle?: TabScaffoldHeaderValue;

  component?: React.ComponentType<
    NavigationStackScreenRenderProps<NavigationStackParams>
  >;

  render?: (
    props: NavigationStackScreenRenderProps<NavigationStackParams>
  ) => React.ReactNode;

  element?: React.ReactNode;
}

export interface TabScaffoldContextValue {
  entries: NavigationStackEntry[];
  current: NavigationStackEntry | null;
  activeTab: string;
  canGoBack: boolean;

  setEntries: (
    entries: NavigationStackEntry[],
    transitionDirection: NavigationStackTransitionDirection
  ) => void;

  push: (
    name: string,
    params?: NavigationStackParams
  ) => void;

  replace: (
    name: string,
    params?: NavigationStackParams
  ) => void;

  pop: () => void;
  popToRoot: () => void;

  reset: (
    name: string,
    params?: NavigationStackParams
  ) => void;

  resetToTab: (tab: string) => void;
}

export interface TabScaffoldRenderContext
  extends TabScaffoldContextValue {
  tabs: TabScaffoldTab[];
}

type TabScaffoldEntriesChangeHandler = (
  entries: NavigationStackEntry[],
  transitionDirection: NavigationStackTransitionDirection
) => void;

interface TabScaffoldBaseProps
  extends Omit<
    ScaffoldProps,
    | "children"
    | "viewport"
    | "appBar"
    | "footer"
    | "floating"
  > {
  /**
   * Secciones raíz visibles en BottomNavigation.
   *
   * Cada tab habilitado debe tener una pantalla registrada
   * en screens con el mismo identificador.
   */
  tabs: TabScaffoldTab[];

  /**
   * Registro completo de pantallas.
   *
   * Incluye tanto las pantallas raíz de los tabs como las
   * pantallas secundarias que pueden abrirse mediante el stack.
   */
  screens: TabScaffoldScreen[];

  viewport?: ScaffoldViewport;

  initialTab?: string;
  initialParams?: NavigationStackParams;

  animation?: NavigationStackAnimation;

  showAppBar?: boolean;
  showBottomNavigation?: boolean;

  title?: TabScaffoldHeaderValue;
  subtitle?: TabScaffoldHeaderValue;

  rootLeading?:
    | React.ReactNode
    | ((context: TabScaffoldRenderContext) => React.ReactNode);

  actions?:
    | React.ReactNode
    | ((context: TabScaffoldRenderContext) => React.ReactNode);

  floating?:
    | React.ReactNode
    | ((context: TabScaffoldRenderContext) => React.ReactNode);

  backIcon?: React.ReactNode;
  backAriaLabel?: string;

  backButtonProps?: Omit<
    BackButtonProps,
    "onBack"
  >;

  renderAppBar?: (
    context: TabScaffoldRenderContext
  ) => React.ReactNode;

  renderBottomNavigation?: (
    context: TabScaffoldRenderContext
  ) => React.ReactNode;

  topAppBarProps?: Omit<
    TopAppBarProps,
    "title" | "subtitle" | "leading" | "actions"
  >;

  bottomNavigationProps?: Omit<
    BottomNavigationProps,
    "children" | "value" | "defaultValue" | "onValueChange"
  >;

  onTabChange?: (tab: string) => void;

  fallback?: React.ReactNode;

  styles?: TabScaffoldStyles;
  slotProps?: TabScaffoldSlotProps;
}

interface TabScaffoldUncontrolledProps {
  entries?: never;
  transitionDirection?: never;

  onEntriesChange?: TabScaffoldEntriesChangeHandler;
}

interface TabScaffoldControlledProps {
  entries: NavigationStackEntry[];

  transitionDirection: NavigationStackTransitionDirection;

  onEntriesChange?: TabScaffoldEntriesChangeHandler;
}

export type TabScaffoldProps =
  TabScaffoldBaseProps &
  (
    | TabScaffoldUncontrolledProps
    | TabScaffoldControlledProps
  );