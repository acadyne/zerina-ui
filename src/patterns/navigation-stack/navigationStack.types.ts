// src/patterns/navigation-stack/navigationStack.types.ts
import React from "react";
import type { UIMotionAppTransition } from "../../core/motion";
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../helpers/css";

export type NavigationStackParams = Record<string, unknown>;

export type NavigationStackAnimation = Extract<
  UIMotionAppTransition,
  "slide" | "fade" | "none" | "shared-axis" | "fade-through"
>;

export type NavigationStackTransitionDirection =
  | "forward"
  | "back"
  | "replace";

export type NavigationStackSlot = "root" | "screen";

export type NavigationStackStyles =
  SlotStyleMap<NavigationStackSlot>;

export type NavigationStackSlotProps =
  SlotPropsMap<NavigationStackSlot>;

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

export interface NavigationStackContextValue
  extends NavigationStackState {
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
  title?: React.ReactNode;

  component?: React.ComponentType<
    NavigationStackScreenRenderProps<TParams>
  >;

  render?: (
    props: NavigationStackScreenRenderProps<TParams>
  ) => React.ReactNode;

  element?: React.ReactNode;
}

type NavigationStackEntriesChangeHandler = (
  entries: NavigationStackEntry[],
  transitionDirection: NavigationStackTransitionDirection
) => void;

interface NavigationStackBaseProps {
  children?: React.ReactNode;

  initialName: string;
  initialParams?: NavigationStackParams;

  animation?: NavigationStackAnimation;
  fallback?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  styles?: NavigationStackStyles;
  slotProps?: NavigationStackSlotProps;
}

interface NavigationStackUncontrolledProps {
  entries?: never;
  transitionDirection?: never;

  onEntriesChange?: NavigationStackEntriesChangeHandler;
}

interface NavigationStackControlledProps {
  entries: NavigationStackEntry[];

  /**
   * Dirección semántica que produjo la versión controlada de entries.
   */
  transitionDirection: NavigationStackTransitionDirection;

  onEntriesChange?: NavigationStackEntriesChangeHandler;
}

export type NavigationStackProps =
  NavigationStackBaseProps &
    (
      | NavigationStackUncontrolledProps
      | NavigationStackControlledProps
    );

export type RegisteredNavigationStackScreen = {
  name: string;
  title?: React.ReactNode;

  component?: React.ComponentType<
    NavigationStackScreenRenderProps<NavigationStackParams>
  >;

  render?: (
    props: NavigationStackScreenRenderProps<NavigationStackParams>
  ) => React.ReactNode;

  element?: React.ReactNode;
};

export type NavigationStackComponent =
  React.FC<NavigationStackProps> & {
    Screen: React.FC<NavigationStackScreenProps>;
  };