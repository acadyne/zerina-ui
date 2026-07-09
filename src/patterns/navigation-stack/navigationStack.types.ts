// src/patterns/navigation-stack/navigationStack.types.ts
import React from "react";
import type { UIMotionAppTransition } from "../../core/motion";

export type NavigationStackParams = Record<string, unknown>;

export type NavigationStackAnimation = Extract<
  UIMotionAppTransition,
  "slide" | "fade" | "none" | "shared-axis" | "fade-through"
>;

export type NavigationStackTransitionDirection = "forward" | "back" | "replace";

export interface NavigationStackEntry<
  TParams extends NavigationStackParams = NavigationStackParams,
> {
  key: string;
  name: string;
  params?: TParams;
}

export interface NavigationStackState {
  entries: NavigationStackEntry[];
  current: NavigationStackEntry | null;
  index: number;
  canGoBack: boolean;
}

export interface NavigationStackContextValue extends NavigationStackState {
  push: (name: string, params?: NavigationStackParams) => void;
  replace: (name: string, params?: NavigationStackParams) => void;
  pop: () => void;
  popToRoot: () => void;
  reset: (name: string, params?: NavigationStackParams) => void;
}

export interface NavigationStackScreenRenderProps<
  TParams extends NavigationStackParams = NavigationStackParams,
> {
  navigation: NavigationStackContextValue;
  route: NavigationStackEntry<TParams>;
}

export interface NavigationStackScreenProps<
  TParams extends NavigationStackParams = NavigationStackParams,
> {
  name: string;

  /**
   * Título opcional para introspección o headers custom.
   */
  title?: React.ReactNode;

  /**
   * Componente que recibe navigation + route.
   */
  component?: React.ComponentType<NavigationStackScreenRenderProps<TParams>>;

  /**
   * Render prop que recibe navigation + route.
   */
  render?: (
    props: NavigationStackScreenRenderProps<TParams>
  ) => React.ReactNode;

  /**
   * Elemento directo. Útil para pantallas simples.
   */
  element?: React.ReactNode;
}

export interface NavigationStackProps {
  children?: React.ReactNode;

  /**
   * Pantalla inicial.
   */
  initialName: string;

  /**
   * Params iniciales.
   */
  initialParams?: NavigationStackParams;

  /**
   * Estado controlado opcional.
   */
  entries?: NavigationStackEntry[];

  /**
   * Cambio de stack cuando se usa controlado o no controlado.
   */
  onEntriesChange?: (entries: NavigationStackEntry[]) => void;

  /**
   * Animación entre pantallas.
   */
  animation?: NavigationStackAnimation;

  /**
   * Qué renderizar si no existe la pantalla actual.
   */
  fallback?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  screenStyle?: React.CSSProperties;
}

export type RegisteredNavigationStackScreen = {
  name: string;
  title?: React.ReactNode;
  component?: React.ComponentType<any>;
  render?: (props: NavigationStackScreenRenderProps<any>) => React.ReactNode;
  element?: React.ReactNode;
};

export type NavigationStackComponent = React.FC<NavigationStackProps> & {
  Screen: React.FC<NavigationStackScreenProps>;
};