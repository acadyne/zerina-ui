// src/primitives/navigation/NavigationList.tsx
import React from "react";
import { Pressable } from "../forms";
import { Box } from "../layout";
import { Typography } from "../typography";

export interface NavigationItemDef {
  id: string;
  label: React.ReactNode;

  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;

  /**
   * Si el item tiene hijos, por default actúa como toggle.
   * Pon selectable=true si también debe disparar onSelect.
   */
  selectable?: boolean;

  items?: NavigationItemDef[];

  meta?: Record<string, unknown>;
}

export type NavigationListVariant = "sidebar" | "inline";

export type NavigationListActiveBehavior = "exact" | "contains";

export interface NavigationListProps {
  items: NavigationItemDef[];

  activeId?: string | null;

  openIds?: string[];
  defaultOpenIds?: string[];
  onOpenIdsChange?: (ids: string[]) => void;

  onSelect?: (
    item: NavigationItemDef,
    event: React.MouseEvent<HTMLElement>
  ) => void;

  variant?: NavigationListVariant;

  collapsed?: boolean;
  indentSize?: number;

  /**
   * Si está activo, abre visualmente los padres del item activo.
   * No muta openIds; solo afecta el render.
   */
  openActiveParents?: boolean;

  /**
   * exact: solo el item con activeId se marca activo.
   * contains: padres también pueden considerarse activos si contienen activeId.
   */
  activeBehavior?: NavigationListActiveBehavior;

  ariaLabel?: string;

  className?: string;
  style?: React.CSSProperties;
}

export interface NavigationListItemProps {
  item: NavigationItemDef;

  activeId?: string | null;
  activeBehavior?: NavigationListActiveBehavior;

  openIds: Set<string>;
  openActiveParents: boolean;

  depth?: number;
  collapsed?: boolean;
  indentSize?: number;
  variant?: NavigationListVariant;

  onToggle?: (id: string) => void;
  onSelect?: (
    item: NavigationItemDef,
    event: React.MouseEvent<HTMLElement>
  ) => void;
}

type NavigationListComponent = React.FC<NavigationListProps> & {
  Item: React.FC<NavigationListItemProps>;
};

function itemContainsId(
  item: NavigationItemDef,
  id: string | null | undefined
): boolean {
  if (!id) return false;
  if (item.id === id) return true;

  return Boolean(item.items?.some((child) => itemContainsId(child, id)));
}

function isItemActive({
  item,
  activeId,
  activeBehavior,
}: {
  item: NavigationItemDef;
  activeId?: string | null;
  activeBehavior: NavigationListActiveBehavior;
}) {
  if (!activeId) return false;

  if (activeBehavior === "exact") {
    return item.id === activeId;
  }

  return itemContainsId(item, activeId);
}

function isItemDirectlyActive(item: NavigationItemDef, activeId?: string | null) {
  return Boolean(activeId && item.id === activeId);
}

function hasChildren(item: NavigationItemDef) {
  return Boolean(item.items?.length);
}

function isSelectable(item: NavigationItemDef) {
  if (item.selectable !== undefined) return item.selectable;
  return !hasChildren(item);
}

function getItemBackground(options: {
  active: boolean;
  directlyActive: boolean;
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
}) {
  const { active, directlyActive, hovered, pressed, focused } = options;

  if (pressed) return "var(--ui-surface-3)";

  if (directlyActive) {
    return "color-mix(in srgb, var(--ui-primary) 17%, transparent)";
  }

  if (active) {
    return "color-mix(in srgb, var(--ui-primary) 10%, transparent)";
  }

  if (hovered || focused) return "var(--ui-surface-hover)";

  return "transparent";
}

function getItemBorderColor(options: {
  directlyActive: boolean;
  focused: boolean;
}) {
  if (options.directlyActive) {
    return "color-mix(in srgb, var(--ui-primary) 32%, var(--ui-border))";
  }

  if (options.focused) {
    return "var(--ui-focus-ring)";
  }

  return "transparent";
}

function getChevron(open: boolean) {
  return open ? "⌄" : "›";
}

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  item,
  activeId,
  activeBehavior = "contains",
  openIds,
  openActiveParents,
  depth = 0,
  collapsed = false,
  indentSize = 14,
  variant = "sidebar",
  onToggle,
  onSelect,
}) => {
  const children = item.items ?? [];
  const childrenExist = children.length > 0;

  const active = isItemActive({
    item,
    activeId,
    activeBehavior,
  });

  const directlyActive = isItemDirectlyActive(item, activeId);

  const open =
    childrenExist &&
    !collapsed &&
    (openIds.has(item.id) ||
      (openActiveParents && itemContainsId(item, activeId)));

  const selectable = isSelectable(item);

  const handlePress = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (item.disabled) return;

      if (childrenExist) {
        onToggle?.(item.id);
      }

      if (selectable) {
        onSelect?.(item, event);
      }
    },
    [childrenExist, item, onSelect, onToggle, selectable]
  );

  const paddingLeft =
    collapsed || variant === "inline" ? "0.65rem" : `${0.65 + depth * (indentSize / 16)}rem`;

  return (
    <Box
      style={{
        minWidth: 0,
      }}
    >
      <Pressable
        as="button"
        type="button"
        disabled={item.disabled}
        onPress={handlePress}
        aria-current={directlyActive ? "page" : undefined}
        aria-expanded={childrenExist ? open : undefined}
        aria-disabled={item.disabled || undefined}
        style={{
          width: "100%",
          minWidth: 0,
          display: "flex",
          border: 0,
          padding: 0,
          background: "transparent",
          color: "inherit",
          textAlign: "left",
          cursor: item.disabled ? "not-allowed" : "pointer",
        }}
      >
        {({ hovered, pressed, focused }) => (
          <Box
            style={{
              width: "100%",
              minWidth: 0,
              minHeight: collapsed ? 42 : 38,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : "0.65rem",
              paddingBlock: "0.48rem",
              paddingLeft,
              paddingRight: collapsed ? "0.4rem" : "0.65rem",
              borderRadius: "var(--ui-radius-md)",
              border: `1px solid ${getItemBorderColor({
                directlyActive,
                focused,
              })}`,
              background: getItemBackground({
                active,
                directlyActive,
                hovered,
                pressed,
                focused,
              }),
              color: directlyActive ? "var(--ui-text)" : "var(--ui-text-muted)",
              opacity: item.disabled
                ? "var(--ui-state-disabled-opacity, 0.62)"
                : 1,
              boxSizing: "border-box",
            }}
          >
            {item.icon ? (
              <Box
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "inherit",
                  lineHeight: 1,
                }}
              >
                {item.icon}
              </Box>
            ) : null}

            {!collapsed ? (
              <>
                <Typography
                  as="span"
                  size="sm"
                  weight={directlyActive ? 800 : active ? 700 : 600}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    margin: 0,
                    color: "inherit",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Typography>

                {item.badge ? (
                  <Box
                    style={{
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.badge}
                  </Box>
                ) : null}

                {childrenExist ? (
                  <Box
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      color: "var(--ui-text-muted)",
                      fontSize: "1rem",
                      lineHeight: 1,
                    }}
                  >
                    {getChevron(open)}
                  </Box>
                ) : null}
              </>
            ) : null}
          </Box>
        )}
      </Pressable>

      {childrenExist && open ? (
        <Box
          role="group"
          style={{
            minWidth: 0,
            marginTop: "0.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {children.map((child) => (
            <NavigationListItem
              key={child.id}
              item={child}
              activeId={activeId}
              activeBehavior={activeBehavior}
              openIds={openIds}
              openActiveParents={openActiveParents}
              depth={depth + 1}
              collapsed={collapsed}
              indentSize={indentSize}
              variant={variant}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

NavigationListItem.displayName = "NavigationList.Item";

export const NavigationList = (({
  items,
  activeId,
  openIds,
  defaultOpenIds = [],
  onOpenIdsChange,
  onSelect,
  variant = "sidebar",
  collapsed = false,
  indentSize = 14,
  openActiveParents = true,
  activeBehavior = "contains",
  ariaLabel = "Navegación",
  className = "",
  style,
}: NavigationListProps) => {
  const isControlled = openIds !== undefined;

  const [internalOpenIds, setInternalOpenIds] =
    React.useState<string[]>(defaultOpenIds);

  const currentOpenIds = isControlled ? openIds : internalOpenIds;
  const openIdSet = React.useMemo(() => new Set(currentOpenIds), [currentOpenIds]);

  const setOpenIds = React.useCallback(
    (nextIds: string[]) => {
      if (!isControlled) {
        setInternalOpenIds(nextIds);
      }

      onOpenIdsChange?.(nextIds);
    },
    [isControlled, onOpenIdsChange]
  );

  const handleToggle = React.useCallback(
    (id: string) => {
      const next = new Set(currentOpenIds);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      setOpenIds(Array.from(next));
    },
    [currentOpenIds, setOpenIds]
  );

  return (
    <Box
      as="nav"
      className={className}
      aria-label={ariaLabel}
      style={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <Box
        role="list"
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        {items.map((item) => (
          <NavigationListItem
            key={item.id}
            item={item}
            activeId={activeId}
            activeBehavior={activeBehavior}
            openIds={openIdSet}
            openActiveParents={openActiveParents}
            depth={0}
            collapsed={collapsed}
            indentSize={indentSize}
            variant={variant}
            onToggle={handleToggle}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </Box>
  );
}) as NavigationListComponent;

NavigationList.Item = NavigationListItem;
NavigationList.displayName = "NavigationList";