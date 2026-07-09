// src/patterns/drawer-navigation/DrawerNavigation.tsx
import React from "react";
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

export interface DrawerNavigationProps
  extends Omit<DrawerProps, "children"> {
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

  bodyStyle?: React.CSSProperties;
  footerStyle?: React.CSSProperties;
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

  bodyStyle,
  footerStyle,

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

  return (
    <Drawer
      {...drawerProps}
      open={open}
      onOpenChange={onOpenChange}
      placement={placement}
      size={size}
      title={title}
      description={description}
    >
      <DrawerBody
        style={{
          padding: "0.75rem",
          ...bodyStyle,
        }}
      >
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
      </DrawerBody>

      {footer ? (
        <DrawerFooter
          style={{
            justifyContent: "stretch",
            ...footerStyle,
          }}
        >
          <Box
            style={{
              width: "100%",
              minWidth: 0,
            }}
          >
            {footer}
          </Box>
        </DrawerFooter>
      ) : null}
    </Drawer>
  );
};

DrawerNavigation.displayName = "DrawerNavigation";