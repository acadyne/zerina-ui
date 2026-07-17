// src/primitives/navigation/NavigationList.tsx
import React from "react";
import {
  defineSlotRecipe,
  resolveMergedSlot,
  resolveSlot,
  toMotionSlotProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../helpers/css";
import type { UIPressEvent } from "../../core/interaction";
import { Pressable } from "../forms";
import { Box } from "../layout";
import {
  Menu,
  MenuContent,
  MenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type MenuContentProps,
} from "../overlay";
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

export type NavigationListVariant =
  | "sidebar"
  | "inline";

export type NavigationListActiveBehavior =
  | "exact"
  | "contains";

export type NavigationListCollapsedBehavior =
  | "icons-only"
  | "flyout";

export type NavigationListSlot =
  | "root"
  | "list"
  | "item"
  | "itemButton"
  | "itemContent"
  | "activeItem"
  | "directActiveItem"
  | "icon"
  | "label"
  | "badge"
  | "chevron"
  | "group"
  | "flyoutContent"
  | "flyoutList";

export type NavigationListStyles =
  SlotStyleMap<NavigationListSlot>;

export type NavigationListSlotProps =
  SlotPropsMap<NavigationListSlot>;

export interface NavigationListProps {
  items: NavigationItemDef[];

  activeId?: string | null;

  openIds?: string[];
  defaultOpenIds?: string[];

  onOpenIdsChange?: (
    ids: string[]
  ) => void;

  onSelect?: (
    item: NavigationItemDef,
    event: UIPressEvent<HTMLElement>
  ) => void;

  variant?: NavigationListVariant;

  collapsed?: boolean;

  /**
   * icons-only:
   *   En collapsed solo muestra iconos.
   *
   * flyout:
   *   En collapsed, los items con hijos abren un menú lateral.
   */
  collapsedBehavior?: NavigationListCollapsedBehavior;

  flyoutPlacement?: MenuContentProps["placement"];
  flyoutOffset?: number;

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

  styles?: NavigationListStyles;
  slotProps?: NavigationListSlotProps;
}

export interface NavigationListItemProps {
  item: NavigationItemDef;

  activeId?: string | null;
  activeBehavior?: NavigationListActiveBehavior;

  openIds: Set<string>;
  openActiveParents: boolean;

  depth?: number;
  collapsed?: boolean;

  collapsedBehavior?: NavigationListCollapsedBehavior;

  flyoutPlacement?: MenuContentProps["placement"];
  flyoutOffset?: number;

  indentSize?: number;
  variant?: NavigationListVariant;

  styles?: NavigationListStyles;
  slotProps?: NavigationListSlotProps;

  onToggle?: (
    id: string
  ) => void;

  onSelect?: (
    item: NavigationItemDef,
    event: UIPressEvent<HTMLElement>
  ) => void;
}

type NavigationListComponent =
  React.FC<NavigationListProps> & {
    Item:
      React.FC<NavigationListItemProps>;
  };

type NavigationListRecipeVariants = {
  variant: NavigationListVariant;
  collapsed: "true" | "false";
};

type NavigationListRecipeState = {
  paddingLeft: string;

  disabled: boolean;
  active: boolean;
  directlyActive: boolean;

  hovered: boolean;
  pressed: boolean;
  focused: boolean;
};

function getItemBackground({
  active,
  directlyActive,
  hovered,
  pressed,
  focused,
}: {
  active: boolean;
  directlyActive: boolean;
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
}): string {
  if (pressed) {
    return "var(--ui-surface-3)";
  }

  if (directlyActive) {
    return "color-mix(in srgb, var(--ui-primary) 17%, transparent)";
  }

  if (active) {
    return "color-mix(in srgb, var(--ui-primary) 10%, transparent)";
  }

  if (hovered || focused) {
    return "var(--ui-surface-hover)";
  }

  return "transparent";
}

function getItemBorderColor({
  directlyActive,
  focused,
}: {
  directlyActive: boolean;
  focused: boolean;
}): string {
  if (directlyActive) {
    return "color-mix(in srgb, var(--ui-primary) 32%, var(--ui-border))";
  }

  if (focused) {
    return "var(--ui-interaction-focus-ring)";
  }

  return "transparent";
}

/**
 * La recipe concentra la política visual de NavigationList.
 *
 * La selección, expansión, recursividad, flyouts, tooltips y press state
 * permanecen en sus sistemas correspondientes.
 */
const navigationListRecipe =
  defineSlotRecipe<
    NavigationListSlot,
    NavigationListRecipeVariants,
    NavigationListRecipeState
  >({
    base: {
      root: {
        width: "100%",
        minWidth: 0,

        boxSizing: "border-box",
      },

      list: {
        minWidth: 0,

        display: "flex",
        flexDirection: "column",

        gap: "0.25rem",
      },

      item: {
        minWidth: 0,
      },

      itemButton: {
        width: "100%",
        minWidth: 0,

        display: "flex",

        border: 0,
        padding: 0,

        background: "transparent",
        color: "inherit",

        textAlign: "left",
      },

      itemContent: {
        width: "100%",
        minWidth: 0,

        display: "flex",
        alignItems: "center",

        paddingBlock: "0.48rem",

        borderRadius:
          "var(--ui-radius-md)",

        boxSizing: "border-box",
      },

      icon: {
        width: 24,
        height: 24,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        flexShrink: 0,

        color: "inherit",

        lineHeight: 1,
      },

      label: {
        flex: 1,
        minWidth: 0,

        margin: 0,

        color: "inherit",

        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },

      badge: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        flexShrink: 0,
      },

      chevron: {
        flexShrink: 0,

        color:
          "var(--ui-text-muted)",

        fontSize: "1rem",
        lineHeight: 1,
      },

      group: {
        minWidth: 0,

        marginTop: "0.25rem",

        display: "flex",
        flexDirection: "column",

        gap: "0.25rem",
      },

      flyoutContent: {
        minWidth: 230,

        padding: "0.45rem",

        borderRadius:
          "var(--ui-radius-xl)",

        border:
          "1px solid var(--ui-border)",

        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--ui-surface-2) 80%, transparent), var(--ui-surface))",

        boxShadow:
          "var(--ui-shadow-lg)",
      },

      flyoutList: {
        minWidth: 0,

        display: "flex",
        flexDirection: "column",

        gap: "0.25rem",
      },
    },

    variants: {
      variant: {
        sidebar: {},
        inline: {},
      },

      collapsed: {
        false: {
          itemContent: {
            minHeight: 38,

            justifyContent:
              "flex-start",

            gap: "0.65rem",

            paddingRight:
              "0.65rem",
          },
        },

        true: {
          itemContent: {
            minHeight: 42,

            justifyContent:
              "center",

            gap: 0,

            paddingLeft:
              "0.4rem",

            paddingRight:
              "0.4rem",
          },
        },
      },
    },

    resolve: ({
      paddingLeft,
      disabled,
      active,
      directlyActive,
      hovered,
      pressed,
      focused,
      collapsed,
    }) => {
      const isCollapsed =
        collapsed === "true";

      return {
        itemButton: {
          cursor: disabled
            ? "not-allowed"
            : "pointer",
        },

        itemContent: {
          paddingLeft: isCollapsed
            ? "0.4rem"
            : paddingLeft,

          border:
            `1px solid ${getItemBorderColor({
              directlyActive,
              focused,
            })}`,

          background:
            getItemBackground({
              active,
              directlyActive,
              hovered,
              pressed,
              focused,
            }),

          color: directlyActive
            ? "var(--ui-text)"
            : "var(--ui-text-muted)",

          opacity: disabled
            ? "var(--ui-state-disabled-opacity)"
            : 1,
        },
      };
    },
  });

function itemContainsId(
  item: NavigationItemDef,
  id: string | null | undefined
): boolean {
  if (!id) {
    return false;
  }

  if (item.id === id) {
    return true;
  }

  return Boolean(
    item.items?.some(
      (child) =>
        itemContainsId(
          child,
          id
        )
    )
  );
}

function isItemActive({
  item,
  activeId,
  activeBehavior,
}: {
  item: NavigationItemDef;
  activeId?: string | null;
  activeBehavior: NavigationListActiveBehavior;
}): boolean {
  if (!activeId) {
    return false;
  }

  if (
    activeBehavior === "exact"
  ) {
    return item.id === activeId;
  }

  return itemContainsId(
    item,
    activeId
  );
}

function isItemDirectlyActive(
  item: NavigationItemDef,
  activeId?: string | null
): boolean {
  return Boolean(
    activeId &&
      item.id === activeId
  );
}

function hasChildren(
  item: NavigationItemDef
): boolean {
  return Boolean(
    item.items?.length
  );
}

function isSelectable(
  item: NavigationItemDef
): boolean {
  if (
    item.selectable !== undefined
  ) {
    return item.selectable;
  }

  return !hasChildren(item);
}

function getChevron(
  open: boolean
): string {
  return open ? "⌄" : "›";
}

const NavigationListItem:
  React.FC<NavigationListItemProps> = ({
    item,

    activeId,
    activeBehavior = "contains",

    openIds,
    openActiveParents,

    depth = 0,
    collapsed = false,

    collapsedBehavior =
      "icons-only",

    flyoutPlacement =
      "right-start",

    flyoutOffset = 10,

    indentSize = 14,
    variant = "sidebar",

    styles,
    slotProps,

    onToggle,
    onSelect,
  }) => {
    const [
      flyoutOpen,
      setFlyoutOpen,
    ] = React.useState(false);

    const children =
      item.items ?? [];

    const childrenExist =
      children.length > 0;

    const active =
      isItemActive({
        item,
        activeId,
        activeBehavior,
      });

    const directlyActive =
      isItemDirectlyActive(
        item,
        activeId
      );

    const usesCollapsedFlyout =
      collapsed &&
      childrenExist &&
      collapsedBehavior ===
        "flyout";

    const open =
      childrenExist &&
      !collapsed &&
      (
        openIds.has(item.id) ||
        (
          openActiveParents &&
          itemContainsId(
            item,
            activeId
          )
        )
      );

    const selectable =
      isSelectable(item);

    const handlePress =
      React.useCallback(
        (
          event:
            UIPressEvent<HTMLElement>
        ) => {
          if (item.disabled) {
            return;
          }

          if (
            childrenExist &&
            !collapsed
          ) {
            onToggle?.(
              item.id
            );
          }

          if (
            childrenExist &&
            collapsed &&
            collapsedBehavior ===
              "icons-only"
          ) {
            return;
          }

          if (selectable) {
            onSelect?.(
              item,
              event
            );
          }
        },
        [
          childrenExist,
          collapsed,
          collapsedBehavior,
          item,
          onSelect,
          onToggle,
          selectable,
        ]
      );

    const paddingLeft =
      collapsed ||
      variant === "inline"
        ? "0.65rem"
        : `${0.65 + depth * (indentSize / 16)}rem`;

    const baseRecipeStyles =
      navigationListRecipe({
        variant,

        collapsed:
          collapsed
            ? "true"
            : "false",

        paddingLeft,

        disabled:
          Boolean(item.disabled),

        active,
        directlyActive,

        hovered: false,
        pressed: false,
        focused: false,
      });

    const itemSlot =
      resolveSlot<NavigationListSlot>({
        slot: "item",

        styles,
        slotProps,

        baseProps: {
          "data-ui-navigation-list-item":
            "",

          "data-ui-navigation-list-item-id":
            item.id,

          "data-ui-navigation-list-item-active":
            active ||
            undefined,

          "data-ui-navigation-list-item-direct-active":
            directlyActive ||
            undefined,

          "data-ui-navigation-list-item-disabled":
            item.disabled ||
            undefined,

          "data-ui-navigation-list-item-depth":
            depth,

          "data-ui-navigation-list-item-collapsed":
            collapsed ||
            undefined,
        },

        baseStyle:
          baseRecipeStyles.item,
      });

    const itemButtonSlot =
      resolveSlot<NavigationListSlot>({
        slot: "itemButton",

        styles,
        slotProps,

        baseStyle:
          baseRecipeStyles
            .itemButton,
      });

    const iconSlot =
      resolveSlot<NavigationListSlot>({
        slot: "icon",

        styles,
        slotProps,

        baseProps: {
          "aria-hidden": true,
        },

        baseStyle:
          baseRecipeStyles.icon,
      });

    const labelSlot =
      resolveSlot<NavigationListSlot>({
        slot: "label",

        styles,
        slotProps,

        baseStyle:
          baseRecipeStyles.label,
      });

    const badgeSlot =
      resolveSlot<NavigationListSlot>({
        slot: "badge",

        styles,
        slotProps,

        baseStyle:
          baseRecipeStyles.badge,
      });

    const chevronSlot =
      resolveSlot<NavigationListSlot>({
        slot: "chevron",

        styles,
        slotProps,

        baseProps: {
          "aria-hidden": true,
        },

        baseStyle:
          baseRecipeStyles.chevron,
      });

    const groupSlot =
      resolveSlot<NavigationListSlot>({
        slot: "group",

        styles,
        slotProps,

        baseStyle:
          baseRecipeStyles.group,
      });

    const flyoutContentSlot =
      resolveSlot<NavigationListSlot>({
        slot: "flyoutContent",

        styles,
        slotProps,

        baseStyle:
          baseRecipeStyles
            .flyoutContent,
      });

    const flyoutListSlot =
      resolveSlot<NavigationListSlot>({
        slot: "flyoutList",

        styles,
        slotProps,

        baseStyle:
          baseRecipeStyles
            .flyoutList,
      });

    const button = (
      <Pressable
        {...itemButtonSlot}
        as="button"
        type="button"
        disabled={
          item.disabled
        }
        onPress={
          handlePress
        }
        aria-current={
          directlyActive
            ? "page"
            : undefined
        }
        aria-expanded={
          childrenExist
            ? (
                usesCollapsedFlyout
                  ? flyoutOpen
                  : open
              )
            : undefined
        }
        aria-disabled={
          item.disabled ||
          undefined
        }
      >
        {({
          hovered,
          pressed,
          focused,
        }) => {
          const stateRecipeStyles =
            navigationListRecipe({
              variant,

              collapsed:
                collapsed
                  ? "true"
                  : "false",

              paddingLeft,

              disabled:
                Boolean(
                  item.disabled
                ),

              active,
              directlyActive,

              hovered,
              pressed,
              focused,
            });

          const itemContentSlot =
            resolveMergedSlot<NavigationListSlot>(
              {
                slots: [
                  "itemContent",

                  ...(
                    active
                      ? [
                          "activeItem",
                        ] as const
                      : []
                  ),

                  ...(
                    directlyActive
                      ? [
                          "directActiveItem",
                        ] as const
                      : []
                  ),
                ],

                styles,
                slotProps,

                baseProps: {
                  "data-ui-navigation-list-item-content":
                    "",
                },

                baseStyle:
                  stateRecipeStyles
                    .itemContent,
              }
            );

          return (
            <Box
              {...itemContentSlot}
            >
              {item.icon ? (
                <Box
                  {...iconSlot}
                >
                  {item.icon}
                </Box>
              ) : null}

              {!collapsed ? (
                <>
                  <Typography
                    {...labelSlot}
                    as="span"
                    size="sm"
                    weight={
                      directlyActive
                        ? 800
                        : active
                          ? 700
                          : 600
                    }
                  >
                    {item.label}
                  </Typography>

                  {item.badge ? (
                    <Box
                      {...badgeSlot}
                    >
                      {item.badge}
                    </Box>
                  ) : null}

                  {childrenExist ? (
                    <Box
                      {...chevronSlot}
                    >
                      {getChevron(
                        open
                      )}
                    </Box>
                  ) : null}
                </>
              ) : null}
            </Box>
          );
        }}
      </Pressable>
    );

    const flyoutContent =
      childrenExist ? (
        <Box
          {...flyoutListSlot}
        >
          {children.map(
            (child) => (
              <NavigationListItem
                key={child.id}
                item={child}
                activeId={
                  activeId
                }
                activeBehavior={
                  activeBehavior
                }
                openIds={
                  openIds
                }
                openActiveParents={
                  openActiveParents
                }
                depth={0}
                collapsed={
                  false
                }
                collapsedBehavior="icons-only"
                flyoutPlacement={
                  flyoutPlacement
                }
                flyoutOffset={
                  flyoutOffset
                }
                indentSize={
                  indentSize
                }
                variant="inline"
                styles={
                  styles
                }
                slotProps={
                  slotProps
                }
                onToggle={
                  onToggle
                }
                onSelect={(
                  selectedItem,
                  event
                ) => {
                  setFlyoutOpen(
                    false
                  );

                  onSelect?.(
                    selectedItem,
                    event
                  );
                }}
              />
            )
          )}
        </Box>
      ) : null;

    const collapsedWrappedButton =
      collapsed ? (
        usesCollapsedFlyout ? (
          <Menu
            open={
              flyoutOpen
            }
            onOpenChange={
              setFlyoutOpen
            }
          >
            <MenuTrigger
              asChild
            >
              {button}
            </MenuTrigger>

            <MenuContent
              {...toMotionSlotProps(
                flyoutContentSlot
              )}
              placement={
                flyoutPlacement
              }
              offset={
                flyoutOffset
              }
            >
              {flyoutContent}
            </MenuContent>
          </Menu>
        ) : (
          <Tooltip>
            <TooltipTrigger
              asChild
            >
              {button}
            </TooltipTrigger>

            <TooltipContent
              placement="right"
            >
              {item.label}
            </TooltipContent>
          </Tooltip>
        )
      ) : (
        button
      );

    return (
      <Box
        {...itemSlot}
      >
        {collapsedWrappedButton}

        {childrenExist &&
        open ? (
          <Box
            {...groupSlot}
            role="group"
          >
            {children.map(
              (child) => (
                <NavigationListItem
                  key={child.id}
                  item={child}
                  activeId={
                    activeId
                  }
                  activeBehavior={
                    activeBehavior
                  }
                  openIds={
                    openIds
                  }
                  openActiveParents={
                    openActiveParents
                  }
                  depth={
                    depth + 1
                  }
                  collapsed={
                    collapsed
                  }
                  collapsedBehavior={
                    collapsedBehavior
                  }
                  flyoutPlacement={
                    flyoutPlacement
                  }
                  flyoutOffset={
                    flyoutOffset
                  }
                  indentSize={
                    indentSize
                  }
                  variant={
                    variant
                  }
                  styles={
                    styles
                  }
                  slotProps={
                    slotProps
                  }
                  onToggle={
                    onToggle
                  }
                  onSelect={
                    onSelect
                  }
                />
              )
            )}
          </Box>
        ) : null}
      </Box>
    );
  };

NavigationListItem.displayName =
  "NavigationList.Item";

export const NavigationList =
  (({
    items,

    activeId,

    openIds,
    defaultOpenIds = [],

    onOpenIdsChange,
    onSelect,

    variant = "sidebar",

    collapsed = false,

    collapsedBehavior =
      "icons-only",

    flyoutPlacement =
      "right-start",

    flyoutOffset = 10,

    indentSize = 14,

    openActiveParents = true,

    activeBehavior =
      "contains",

    ariaLabel =
      "Navegación",

    className = "",
    style,

    styles,
    slotProps,
  }: NavigationListProps) => {
    const isControlled =
      openIds !== undefined;

    const [
      internalOpenIds,
      setInternalOpenIds,
    ] =
      React.useState<string[]>(
        defaultOpenIds
      );

    const currentOpenIds =
      isControlled
        ? openIds
        : internalOpenIds;

    const openIdSet =
      React.useMemo(
        () =>
          new Set(
            currentOpenIds
          ),
        [currentOpenIds]
      );

    const setOpenIds =
      React.useCallback(
        (
          nextIds:
            string[]
        ) => {
          if (
            !isControlled
          ) {
            setInternalOpenIds(
              nextIds
            );
          }

          onOpenIdsChange?.(
            nextIds
          );
        },
        [
          isControlled,
          onOpenIdsChange,
        ]
      );

    const handleToggle =
      React.useCallback(
        (id: string) => {
          const next =
            new Set(
              currentOpenIds
            );

          if (
            next.has(id)
          ) {
            next.delete(id);
          } else {
            next.add(id);
          }

          setOpenIds(
            Array.from(next)
          );
        },
        [
          currentOpenIds,
          setOpenIds,
        ]
      );

    const recipeStyles =
      navigationListRecipe({
        variant,

        collapsed:
          collapsed
            ? "true"
            : "false",

        paddingLeft:
          "0.65rem",

        disabled: false,
        active: false,
        directlyActive:
          false,

        hovered: false,
        pressed: false,
        focused: false,
      });

    const rootSlot =
      resolveSlot<NavigationListSlot>({
        slot: "root",

        styles,
        slotProps,

        className,
        style,

        baseProps: {
          "aria-label":
            ariaLabel,

          "data-ui-navigation-list":
            "",

          "data-ui-navigation-list-variant":
            variant,

          "data-ui-navigation-list-collapsed":
            collapsed ||
            undefined,
        },

        baseStyle:
          recipeStyles.root,
      });

    const listSlot =
      resolveSlot<NavigationListSlot>({
        slot: "list",

        styles,
        slotProps,

        baseStyle:
          recipeStyles.list,
      });

    return (
      <Box
        as="nav"
        {...rootSlot}
      >
        <Box
          role="list"
          {...listSlot}
        >
          {items.map(
            (item) => (
              <NavigationListItem
                key={item.id}
                item={item}
                activeId={
                  activeId
                }
                activeBehavior={
                  activeBehavior
                }
                openIds={
                  openIdSet
                }
                openActiveParents={
                  openActiveParents
                }
                depth={0}
                collapsed={
                  collapsed
                }
                collapsedBehavior={
                  collapsedBehavior
                }
                flyoutPlacement={
                  flyoutPlacement
                }
                flyoutOffset={
                  flyoutOffset
                }
                indentSize={
                  indentSize
                }
                variant={
                  variant
                }
                styles={
                  styles
                }
                slotProps={
                  slotProps
                }
                onToggle={
                  handleToggle
                }
                onSelect={
                  onSelect
                }
              />
            )
          )}
        </Box>
      </Box>
    );
  }) as NavigationListComponent;

NavigationList.Item =
  NavigationListItem;

NavigationList.displayName =
  "NavigationList";