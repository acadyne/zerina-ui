// src/primitives/navigation/bottom-navigation/bottomNavigation.types.ts
import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";

import type {
  NavigationDestinationPublicItemProps,
  NavigationDestinationRootProps,
} from "../shared/navigationDestination.types";

export type BottomNavigationIconPosition =
  | "top"
  | "start";

export type BottomNavigationSlot =
  | "root"
  | "list"
  | "item"
  | "activeItem"
  | "content"
  | "activeContent"
  | "iconWrap"
  | "activeIconWrap"
  | "icon"
  | "activeIcon"
  | "label"
  | "activeLabel"
  | "badge"
  | "activeBadge"
  | "dot";

export type BottomNavigationStyles =
  SlotStyleMap<BottomNavigationSlot>;

export type BottomNavigationSlotProps =
  SlotPropsMap<BottomNavigationSlot>;

export interface BottomNavigationProps
  extends NavigationDestinationRootProps<
    BottomNavigationSlot
  > {
  height?:
    number | string;

  iconPosition?:
    BottomNavigationIconPosition;
}

export interface BottomNavigationItemProps
  extends NavigationDestinationPublicItemProps<
    BottomNavigationSlot
  > {
  iconPosition?:
    BottomNavigationIconPosition;
}
