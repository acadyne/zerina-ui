// src/patterns/drawer-navigation/DrawerNavigation.tsx
import React from "react";
import {
  resolveSlot,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  type DrawerProps,
} from "../../primitives/overlay";
import {
  NavigationList,
  type NavigationItemDef,
  type NavigationListActiveBehavior,
} from "../../primitives/navigation";
import { Box } from "../../primitives/layout";

export type DrawerNavigationSlot =
  | "root"
  | "body"
  | "navigation"
  | "footer"
  | "footerContent";

export type DrawerNavigationStyles = SlotStyleMap<DrawerNavigationSlot>;

export type DrawerNavigationSlotProps = SlotPropsMap<DrawerNavigationSlot>;

export interface DrawerNavigationProps
  extends Omit<DrawerProps, "children" | "className" | "style"> {
  items: NavigationItemDef[];

  activeId?: string | null;

  openIds?: string[];
  defaultOpenIds?: string[];
  onOpenIdsChange?: (ids: string[]) => void;

  onSelect?: (
    item: NavigationItemDef,
    event: React.MouseEvent<HTMLElement>
  ) => void;

  /**
   * Cierra el drawer automáticamente después de seleccionar un item.
   */
  closeOnSelect?: boolean;

  /**
   * Si está activo, abre visualmente los padres del item activo.
   */
  openActiveParents?: boolean;

  /**
   * exact:
   *   Solo marca activo el item exacto.
   *
   * contains:
   *   Marca también los padres que contienen el activeId.
   */
  activeBehavior?: NavigationListActiveBehavior;

  indentSize?: number;

  navigationLabel?: string;

  footer?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  styles?: DrawerNavigationStyles;
  slotProps?: DrawerNavigationSlotProps;
}

export const DrawerNavigation: React.FC<DrawerNavigationProps> = ({
  items,
  activeId,

  openIds,
  defaultOpenIds,
  onOpenIdsChange,

  onSelect,
  closeOnSelect = true,

  openActiveParents = true,
  activeBehavior = "contains",
  indentSize = 14,

  navigationLabel = "Navegación principal",

  footer,

  className = "",
  style,

  styles,
  slotProps,

  open,
  onOpenChange,

  placement = "left",
  size = "min(340px, 92vw)",
  title = "Menú",
  description,

  ...drawerProps
}) => {
  const handleSelect = React.useCallback(
    (item: NavigationItemDef, event: React.MouseEvent<HTMLElement>) => {
      onSelect?.(item, event);

      if (!event.defaultPrevented && closeOnSelect) {
        onOpenChange?.(false);
      }
    },
    [closeOnSelect, onOpenChange, onSelect]
  );

  const rootSlot = resolveSlot<DrawerNavigationSlot>({
    slot: "root",
    styles,
    slotProps,
    className,
    style,
    baseProps: {
      "data-ui-drawer-navigation": "",
    },
  });

  const bodySlot = resolveSlot<DrawerNavigationSlot>({
    slot: "body",
    styles,
    slotProps,
    baseProps: {
      "data-ui-drawer-navigation-body": "",
    },
    baseStyle: {
      padding: "0.75rem",
    },
  });

  const navigationSlot = resolveSlot<DrawerNavigationSlot>({
    slot: "navigation",
    styles,
    slotProps,
    baseProps: {
      "data-ui-drawer-navigation-list": "",
    },
  });

  const footerSlot = resolveSlot<DrawerNavigationSlot>({
    slot: "footer",
    styles,
    slotProps,
    baseProps: {
      "data-ui-drawer-navigation-footer": "",
    },
    baseStyle: {
      justifyContent: "stretch",
    },
  });

  const footerContentSlot = resolveSlot<DrawerNavigationSlot>({
    slot: "footerContent",
    styles,
    slotProps,
    baseProps: {
      "data-ui-drawer-navigation-footer-content": "",
    },
    baseStyle: {
      width: "100%",
      minWidth: 0,
    },
  });

  return (
    <Drawer
      {...drawerProps}
      open={open}
      onOpenChange={onOpenChange}
      placement={placement}
      size={size}
      title={title}
      description={description}
      className={rootSlot.className}
      style={rootSlot.style}
    >
      <DrawerBody {...bodySlot}>
        <Box {...navigationSlot}>
          <NavigationList
            items={items}
            activeId={activeId}
            openIds={openIds}
            defaultOpenIds={defaultOpenIds}
            onOpenIdsChange={onOpenIdsChange}
            onSelect={handleSelect}
            openActiveParents={openActiveParents}
            activeBehavior={activeBehavior}
            indentSize={indentSize}
            ariaLabel={navigationLabel}
          />
        </Box>
      </DrawerBody>

      {footer ? (
        <DrawerFooter {...footerSlot}>
          <Box {...footerContentSlot}>{footer}</Box>
        </DrawerFooter>
      ) : null}
    </Drawer>
  );
};

DrawerNavigation.displayName = "DrawerNavigation";