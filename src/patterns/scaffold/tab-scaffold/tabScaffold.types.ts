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
  MobileScaffoldProps,
  ScaffoldViewport,
} from "../MobileScaffold";
import type { TopAppBarProps } from "../TopAppBar";

export type TabScaffoldHeaderValue =
  | React.ReactNode
  | ((
      context: TabScaffoldRenderContext
    ) => React.ReactNode);

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

export interface TabScaffoldScreen {
  name: string;

  title?: TabScaffoldHeaderValue;
  subtitle?: TabScaffoldHeaderValue;

  component?: React.ComponentType<
    NavigationStackScreenRenderProps<any>
  >;

  render?: (
    props: NavigationStackScreenRenderProps<any>
  ) => React.ReactNode;

  element?: React.ReactNode;
}

export interface TabScaffoldTab
  extends Omit<TabScaffoldScreen, "name"> {
  value: string;

  label?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;
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
    MobileScaffoldProps,
    | "children"
    | "viewport"
    | "appBar"
    | "bottomBar"
    | "bottomNavigation"
    | "floating"
    | "title"
  > {
  tabs: TabScaffoldTab[];
  screens?: TabScaffoldScreen[];

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
    | ((
        context: TabScaffoldRenderContext
      ) => React.ReactNode);

  actions?:
    | React.ReactNode
    | ((
        context: TabScaffoldRenderContext
      ) => React.ReactNode);

  floating?:
    | React.ReactNode
    | ((
        context: TabScaffoldRenderContext
      ) => React.ReactNode);

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