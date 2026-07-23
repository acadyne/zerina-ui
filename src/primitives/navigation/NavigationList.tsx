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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type PopoverContentProps,
} from "../overlay";
import { Typography } from "../typography";
import {
  isNavigationNodeSelectable,
  type NavigationNode,
} from "../../patterns/navigation";

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
  | "itemRow"
  | "itemButton"
  | "itemContent"
  | "activeItem"
  | "directActiveItem"
  | "icon"
  | "label"
  | "badge"
  | "chevron"
  | "toggleButton"
  | "group"
  | "flyoutContent"
  | "flyoutList";

export type NavigationListStyles =
  SlotStyleMap<NavigationListSlot>;

export type NavigationListSlotProps =
  SlotPropsMap<NavigationListSlot>;

export interface NavigationListProps<
  TMeta = unknown
> {
  items: NavigationNode<TMeta>[];

  activeId?: string | null;

  openIds?: string[];
  defaultOpenIds?: string[];

  onOpenIdsChange?: (
    ids: string[]
  ) => void;

  onSelect?: (
    item: NavigationNode<TMeta>,
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

  flyoutPlacement?: PopoverContentProps["placement"];
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

export interface NavigationListItemProps<
  TMeta = unknown
> {
  item: NavigationNode<TMeta>;

  activeId?: string | null;
  activeBehavior?: NavigationListActiveBehavior;

  openIds: Set<string>;
  openActiveParents: boolean;

  depth?: number;
  collapsed?: boolean;

  collapsedBehavior?: NavigationListCollapsedBehavior;

  flyoutPlacement?: PopoverContentProps["placement"];
  flyoutOffset?: number;

  indentSize?: number;
  variant?: NavigationListVariant;

  styles?: NavigationListStyles;
  slotProps?: NavigationListSlotProps;

  onToggle?: (
    id: string
  ) => void;

  onSelect?: (
    item: NavigationNode<TMeta>,
    event: UIPressEvent<HTMLElement>
  ) => void;
}

type NavigationListComponent = {
  <TMeta = unknown>(
    props: NavigationListProps<TMeta>
  ): React.ReactNode;

  Item: <TMeta = unknown>(
    props: NavigationListItemProps<TMeta>
  ) => React.ReactNode;

  displayName?: string;
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

      itemRow: {
        width: "100%",
        minWidth: 0,

        display: "flex",
        alignItems: "stretch",

        gap: "0.25rem",
      },

      itemButton: {
        width: "100%",
        minWidth: 0,

        display: "flex",
        flex: 1,

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

      toggleButton: {
        width: 38,
        minWidth: 38,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        flexShrink: 0,

        border: 0,

        padding: 0,

        borderRadius:
          "var(--ui-radius-md)",

        background:
          "transparent",

        color:
          "var(--ui-text-muted)",
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

        toggleButton: {
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


function itemContainsId<TMeta>(
  item: NavigationNode<TMeta>,
  id: string | null | undefined
): boolean {
  if (!id) {
    return false;
  }

  if (item.id === id) {
    return true;
  }

  return Boolean(
    item.children?.some(
      (child) =>
        itemContainsId(
          child,
          id
        )
    )
  );
}

function isItemActive<TMeta>({
  item,
  activeId,
  activeBehavior,
}: {
  item: NavigationNode<TMeta>;
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


function isItemDirectlyActive<TMeta>(
  item: NavigationNode<TMeta>,
  activeId?: string | null
): boolean {
  return Boolean(
    activeId &&
    item.id === activeId
  );
}

function getNavigationNodeAriaLabel<
  TMeta
>(
  item: NavigationNode<TMeta>
): string | undefined {
  if (item.ariaLabel) {
    return item.ariaLabel;
  }

  if (
    typeof item.label === "string" ||
    typeof item.label === "number"
  ) {
    return String(item.label);
  }

  return undefined;
}

const visuallyHiddenStyle:
  React.CSSProperties = {
  position: "absolute",

  width: 1,
  height: 1,

  padding: 0,
  margin: -1,

  overflow: "hidden",

  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",

  border: 0,
};

function getChevron(
  open: boolean
): string {
  return open ? "⌄" : "›";
}


const NavigationListItem =
  <TMeta = Record<string, unknown>>(
    {
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
    }: NavigationListItemProps<TMeta>
  ) => {

    const [
      flyoutOpen,
      setFlyoutOpen,
    ] = React.useState(false);

    const children =
      item.children ?? [];

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
      isNavigationNodeSelectable(
        item
      );

    const resolvedAriaLabel =
      getNavigationNodeAriaLabel(
        item
      );

    const flyoutAriaLabel =
      resolvedAriaLabel
        ? `Navegación de ${resolvedAriaLabel}`
        : "Navegación";

    const canExpandInline =
      childrenExist &&
      !collapsed;

    const canOpenFlyout =
      childrenExist &&
      collapsed &&
      collapsedBehavior ===
      "flyout";

    const usesCollapsedFlyout =
      canOpenFlyout;

    const isStaticCollapsedParent =
      childrenExist &&
      collapsed &&
      collapsedBehavior ===
      "icons-only" &&
      !selectable;

    const handleSelectPress =
      React.useCallback(
        (
          event:
            UIPressEvent<HTMLElement>
        ): void => {
          if (
            item.disabled ||
            !selectable
          ) {
            return;
          }

          onSelect?.(
            item,
            event
          );
        },
        [
          item,
          onSelect,
          selectable,
        ]
      );

    const handleTogglePress =
      React.useCallback(
        (): void => {
          if (
            item.disabled ||
            !canExpandInline
          ) {
            return;
          }

          onToggle?.(
            item.id
          );
        },
        [
          canExpandInline,
          item.disabled,
          item.id,
          onToggle,
        ]
      );

    const handlePrimaryPress =
      React.useCallback(
        (
          event:
            UIPressEvent<HTMLElement>
        ): void => {
          if (item.disabled) {
            return;
          }

          if (
            canExpandInline &&
            !selectable
          ) {
            handleTogglePress();

            return;
          }

          handleSelectPress(
            event
          );
        },
        [
          canExpandInline,
          handleSelectPress,
          handleTogglePress,
          item.disabled,
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
          role: "listitem",

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

    const itemRowSlot =
      resolveSlot<NavigationListSlot>({
        slot: "itemRow",

        styles,
        slotProps,

        baseProps: {
          "data-ui-navigation-list-item-row":
            "",
        },

        baseStyle:
          baseRecipeStyles
            .itemRow,
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

    const toggleButtonSlot =
      resolveSlot<NavigationListSlot>({
        slot: "toggleButton",

        styles,
        slotProps,

        baseStyle:
          baseRecipeStyles
            .toggleButton,
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

    const renderItemContent = ({
      hovered,
      pressed,
      focused,
    }: {
      hovered: boolean;
      pressed: boolean;
      focused: boolean;
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
          {item.icon !== undefined &&
            item.icon !== null ? (
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

              {item.badge !== undefined &&
                item.badge !== null ? (
                <Box
                  {...badgeSlot}
                >
                  {item.badge}
                </Box>
              ) : null}

              {childrenExist &&
                !selectable ? (
                <Box
                  {...chevronSlot}
                >
                  {getChevron(
                    open
                  )}
                </Box>
              ) : null}
            </>
          ) : resolvedAriaLabel ? (
            <span
              style={
                visuallyHiddenStyle
              }
            >
              {resolvedAriaLabel}
            </span>
          ) : null}
        </Box>
      );
    };

    const primaryButton = (
      <Pressable
        {...itemButtonSlot}
        as="button"
        type="button"
        disabled={
          item.disabled
        }
        onPress={
          handlePrimaryPress
        }
        aria-current={
          directlyActive
            ? "page"
            : undefined
        }
        aria-expanded={
          canExpandInline &&
            !selectable
            ? open
            : undefined
        }
        aria-disabled={
          item.disabled ||
          undefined
        }
      >
        {renderItemContent}
      </Pressable>
    );

    const flyoutTriggerButton = (
      <Pressable
        {...itemButtonSlot}
        as="button"
        type="button"
        disabled={
          item.disabled
        }
        aria-current={
          directlyActive
            ? "page"
            : undefined
        }
        aria-disabled={
          item.disabled ||
          undefined
        }
      >
        {renderItemContent}
      </Pressable>
    );

    const staticCollapsedSurface = (
      <Box
        {...itemButtonSlot}
        aria-disabled={
          item.disabled ||
          undefined
        }
        style={{
          ...itemButtonSlot.style,

          cursor: "default",
        }}
      >
        {renderItemContent({
          hovered: false,
          pressed: false,
          focused: false,
        })}
      </Box>
    );

    const toggleButton =
      canExpandInline &&
        selectable ? (
        <Pressable
          {...toggleButtonSlot}
          as="button"
          type="button"
          disabled={
            item.disabled
          }
          aria-label={
            resolvedAriaLabel
              ? open
                ? `Colapsar ${resolvedAriaLabel}`
                : `Expandir ${resolvedAriaLabel}`
              : open
                ? "Colapsar sección"
                : "Expandir sección"
          }
          aria-expanded={
            open
          }
          aria-disabled={
            item.disabled ||
            undefined
          }
          onPress={
            handleTogglePress
          }
        >
          <Box
            {...chevronSlot}
          >
            {getChevron(
              open
            )}
          </Box>
        </Pressable>
      ) : null;

    const button =
      isStaticCollapsedParent
        ? staticCollapsedSurface
        : usesCollapsedFlyout
          ? flyoutTriggerButton
          : primaryButton;

    const inlineRow = (
      <Box
        {...itemRowSlot}
      >
        {button}
        {toggleButton}
      </Box>
    );

    const flyoutContent =
      childrenExist ? (
        <Box
          {...flyoutListSlot}
          role="list"
          aria-label={
            flyoutAriaLabel
          }
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

    const collapsedWrappedRow =
      collapsed ? (
        usesCollapsedFlyout ? (
          <Popover
            open={
              flyoutOpen
            }
            onOpenChange={
              setFlyoutOpen
            }
          >
            <PopoverTrigger
              asChild
            >
              {flyoutTriggerButton}
            </PopoverTrigger>

            <PopoverContent
              {...toMotionSlotProps(
                flyoutContentSlot
              )}
              placement={
                flyoutPlacement
              }
              offset={
                flyoutOffset
              }
              aria-label={
                flyoutAriaLabel
              }
              autoFocus
              trapFocus={false}
              restoreFocus
            >
              {flyoutContent}
            </PopoverContent>
          </Popover>
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
        inlineRow
      );

    return (
      <Box
        {...itemSlot}
      >
        {collapsedWrappedRow}

        {childrenExist &&
          open ? (
          <Box
            {...groupSlot}
            role="list"
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
  (<TMeta = Record<string, unknown>>({
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
  }: NavigationListProps<TMeta>) => {
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