// src/primitives/overlay/menu/menu.types.ts

import type React from "react";

import type {
  HTMLMotionProps,
} from "framer-motion";

import type {
  SlotPropsMap,
  SlotStyleMap,
} from "../../../helpers/css";


export type MenuSlot =
  | "trigger"
  | "dismissableLayer"
  | "content"
  | "item"
  | "separator"
  | "label";


export type MenuStyles =
  SlotStyleMap<MenuSlot>;


export type MenuSlotProps =
  SlotPropsMap<MenuSlot>;


export interface MenuProps {
  children?: React.ReactNode;

  open: boolean;

  onOpenChange?: (
    open: boolean
  ) => void;

  styles?: MenuStyles;

  slotProps?: MenuSlotProps;
  initialFocusIndex?: number;
}


interface MenuTriggerBaseProps {
  disabled?: boolean;

  className?: string;

  style?: React.CSSProperties;

  styles?: MenuStyles;

  slotProps?: MenuSlotProps;
}


export type MenuTriggerProps =
  | (
      MenuTriggerBaseProps & {
        asChild?: true;

        children:
          React.ReactElement;
      }
    )
  | (
      MenuTriggerBaseProps & {
        asChild: false;

        children:
          React.ReactNode;
      }
    );


export interface MenuContentProps
  extends Omit<
    HTMLMotionProps<"div">,
    | "children"
    | "ref"
    | "style"
    | "className"
    | "initial"
    | "animate"
    | "exit"
    | "variants"
    | "transition"
    | "custom"
  > {
  children?: React.ReactNode;

  className?: string;

  style?: React.CSSProperties;

  portalled?: boolean;

  container?: Element | DocumentFragment | null;

  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";

  offset?: number;

  flip?: boolean;

  shift?: boolean;

  viewportPadding?: number;

  closeOnEscape?: boolean;

  closeOnPointerDownOutside?: boolean;

  matchAnchorWidth?: boolean;

  styles?: MenuStyles;

  slotProps?: MenuSlotProps;
}


export interface MenuItemProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onClick"
  > {
  children?: React.ReactNode;

  disabled?: boolean;

  /**
   * Texto semántico utilizado por la navegación typeahead.
   *
   * Debe declararse cuando children no produce una etiqueta textual estable.
   */
  textValue?: string;

  closeOnSelect?: boolean;

  onSelect?: () => void;

  styles?: MenuStyles;

  slotProps?: MenuSlotProps;
}


export interface MenuSeparatorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "role"
  > {
  styles?: MenuStyles;

  slotProps?: MenuSlotProps;
}


export interface MenuLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  styles?: MenuStyles;

  slotProps?: MenuSlotProps;
}
