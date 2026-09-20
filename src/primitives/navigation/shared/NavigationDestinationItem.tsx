import React from "react";

import type {
  UIPressEvent,
} from "../../../core/interaction";

import {
  hasRenderableNode,
} from "../../../core/react/nodePresence";

import {
  resolveLayeredSlot,
  type SlotElementProps,
  type SlotPropsMap,
  type SlotStyleMap,
} from "../../../helpers/css";

import {
  Pressable,
} from "../../forms";

import {
  interactiveStateRecipe,
} from "../../../theme/recipes";

import {
  Box,
} from "../../layout";

import {
  Typography,
} from "../../typography";


import type {
  NavigationDestinationBadgeAnchor,
  NavigationDestinationIndicator,
  NavigationDestinationLabelBehavior,
} from "./navigation-shared.types";

export type NavigationDestinationSlot =
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

export interface NavigationDestinationRecipeStyles {
  item?: React.CSSProperties;
  content?: React.CSSProperties;
  iconWrap?: React.CSSProperties;
  icon?: React.CSSProperties;
  label?: React.CSSProperties;
  dot?: React.CSSProperties;
}

export interface NavigationDestinationDataAttributes {
  item: `data-${string}`;
  indicator: `data-${string}`;
  badgeAnchor: `data-${string}`;
  badgePlacement: `data-${string}`;
  content: `data-${string}`;
  iconWrap: `data-${string}`;
  icon: `data-${string}`;
  label: `data-${string}`;
  badge: `data-${string}`;
  dot: `data-${string}`;
}

export interface NavigationDestinationItemProps<
  TSlot extends string,
> {
  value: string;
  active: boolean;

  itemLabel?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;

  disabled?: boolean;

  onPress?: (
    event: UIPressEvent<HTMLButtonElement>,
  ) => void;

  setValue: (
    value: string,
    event: UIPressEvent<HTMLButtonElement>,
  ) => void;

  labelBehavior:
    NavigationDestinationLabelBehavior;

  indicator:
    NavigationDestinationIndicator;

  badgeAnchor:
    NavigationDestinationBadgeAnchor;

  badgePlacement: string;

  activeLabelWeight: number;

  recipeStyles:
    NavigationDestinationRecipeStyles;

  badgeStyle:
    React.CSSProperties;

  visuallyHiddenStyle:
    React.CSSProperties;

  contextStyles?:
    SlotStyleMap<TSlot>;

  contextSlotProps?:
    SlotPropsMap<TSlot>;

  styles?:
    SlotStyleMap<TSlot>;

  slotProps?:
    SlotPropsMap<TSlot>;

  className?: string;
  style?: React.CSSProperties;

  dataAttributes:
    NavigationDestinationDataAttributes;

  buttonProps:
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      | "children"
      | "onClick"
      | "onSelect"
      | "value"
      | "type"
      | "aria-current"
    >;

  forwardedRef:
    React.ForwardedRef<HTMLButtonElement>;
}

function activeSlots<
  TSlot extends string,
>(
  base: NavigationDestinationSlot,
  active: NavigationDestinationSlot,
  isActive: boolean,
): TSlot[] {
  return (
    isActive
      ? [base, active]
      : [base]
  ) as TSlot[];
}

function renderAnchoredBadge({
  anchor,
  target,
  badgeNode,
}: {
  anchor:
    NavigationDestinationBadgeAnchor;
  target:
    NavigationDestinationBadgeAnchor;
  badgeNode:
    React.ReactNode;
}) {
  return anchor === target
    ? badgeNode
    : null;
}

/**
 * Renderer interno compartido por BottomNavigation.Item y NavigationRail.Item.
 *
 * Las familias conservan sus recipes, contexto, data-attributes y opciones
 * públicas. Aquí vive únicamente la mecánica idéntica de:
 * - slots activos;
 * - badge anchoring;
 * - label visibility;
 * - composición/cancelación del press;
 * - selección.
 */
export function NavigationDestinationItem<
  TSlot extends string,
>({
  value,
  active,

  itemLabel,
  icon,
  badge,

  disabled = false,
  onPress,
  setValue,

  labelBehavior,
  indicator,

  badgeAnchor,
  badgePlacement,

  activeLabelWeight,

  recipeStyles,
  badgeStyle,
  visuallyHiddenStyle,

  contextStyles,
  contextSlotProps,

  styles,
  slotProps,

  className = "",
  style,

  dataAttributes,
  buttonProps,
  forwardedRef,
}: NavigationDestinationItemProps<TSlot>) {
  const hasLabel =
    hasRenderableNode(
      itemLabel,
    );

  const hasIcon =
    hasRenderableNode(
      icon,
    );

  const hasBadge =
    hasRenderableNode(
      badge,
    );

  const labelVisible =
    labelBehavior === "always" ||
    (
      labelBehavior === "active" &&
      active
    );

  const itemSlot =
    resolveLayeredSlot<TSlot>({
      slots:
        activeSlots<TSlot>(
          "item",
          "activeItem",
          active,
        ),

      contextStyles,
      contextSlotProps,

      styles,
      slotProps,

      className,
      style,

      baseProps: {
        "aria-current":
          active
            ? "page"
            : undefined,

        "data-active":
          active ||
          undefined,

        [dataAttributes.indicator]:
          indicator,

        [dataAttributes.item]:
          "",

        "data-ui-interactive":
          "",

        "data-ui-interactive-target":
          "",

        [dataAttributes.badgeAnchor]:
          hasBadge
            ? badgeAnchor
            : undefined,

        [dataAttributes.badgePlacement]:
          hasBadge
            ? badgePlacement
            : undefined,
      } as SlotElementProps,

      baseStyle: {
        ...interactiveStateRecipe({
          tone:
            "neutral",

          emphasis:
            "text",
        }),

        ...recipeStyles.item,

        "--ui-navigation-active-label-weight":
          String(
            activeLabelWeight,
          ),
      } as React.CSSProperties,
    });

  const {
    onPress: itemSlotOnPress,
    ...itemSlotRest
  } = itemSlot as typeof itemSlot & {
    onPress?:
      typeof onPress;
  };

  const contentSlot =
    resolveLayeredSlot<TSlot>({
      slots:
        activeSlots<TSlot>(
          "content",
          "activeContent",
          active,
        ),

      contextStyles,
      contextSlotProps,

      styles,
      slotProps,

      baseProps: {
        [dataAttributes.content]:
          "",
      } as SlotElementProps,

      baseStyle:
        recipeStyles.content,
    });

  const iconWrapSlot =
    resolveLayeredSlot<TSlot>({
      slots:
        activeSlots<TSlot>(
          "iconWrap",
          "activeIconWrap",
          active,
        ),

      contextStyles,
      contextSlotProps,

      styles,
      slotProps,

      baseProps: {
        [dataAttributes.iconWrap]:
          "",
      } as SlotElementProps,

      baseStyle:
        recipeStyles.iconWrap,
    });

  const iconSlot =
    resolveLayeredSlot<TSlot>({
      slots:
        activeSlots<TSlot>(
          "icon",
          "activeIcon",
          active,
        ),

      contextStyles,
      contextSlotProps,

      styles,
      slotProps,

      baseProps: {
        "aria-hidden": true,

        [dataAttributes.icon]:
          "",
      } as SlotElementProps,

      baseStyle:
        recipeStyles.icon,
    });

  const labelSlot =
    resolveLayeredSlot<TSlot>({
      slots:
        activeSlots<TSlot>(
          "label",
          "activeLabel",
          active,
        ),

      contextStyles,
      contextSlotProps,

      styles,
      slotProps,

      baseProps: {
        [dataAttributes.label]:
          "",
      } as SlotElementProps,

      baseStyle: {
        ...recipeStyles.label,
      },
    });

  const badgeSlot =
    resolveLayeredSlot<TSlot>({
      slots:
        activeSlots<TSlot>(
          "badge",
          "activeBadge",
          active,
        ),

      contextStyles,
      contextSlotProps,

      styles,
      slotProps,

      baseProps: {
        [dataAttributes.badge]:
          "",
      } as SlotElementProps,

      baseStyle:
        badgeStyle,
    });

  const dotSlot =
    resolveLayeredSlot<TSlot>({
      slots:
        ["dot"] as TSlot[],

      contextStyles,
      contextSlotProps,

      styles,
      slotProps,

      baseProps: {
        "aria-hidden": true,

        [dataAttributes.dot]:
          "",
      } as SlotElementProps,

      baseStyle:
        recipeStyles.dot,
    });

  const badgeNode =
    hasBadge ? (
      <Box {...badgeSlot}>
        {badge}
      </Box>
    ) : null;

  return (
    <Pressable
      {...itemSlotRest}
      {...buttonProps}
      as="button"
      ref={forwardedRef}
      type="button"
      disabled={disabled}
      aria-current={
        active
          ? "page"
          : undefined
      }
      onPress={(event) => {
        itemSlotOnPress?.(
          event,
        );

        onPress?.(
          event,
        );

        if (
          event.defaultPrevented
        ) {
          return;
        }

        setValue(
          value,
          event,
        );
      }}
    >
      <Box {...contentSlot}>
        <Box {...iconWrapSlot}>
          {hasIcon ? (
            <Box {...iconSlot}>
              {icon}
            </Box>
          ) : null}

          {renderAnchoredBadge({
            anchor:
              badgeAnchor,

            target:
              "icon",

            badgeNode,
          })}
        </Box>

        {hasLabel ? (
          <Typography
            as="span"
            {...labelSlot}
            style={
              labelVisible
                ? labelSlot.style
                : {
                    ...labelSlot.style,
                    ...visuallyHiddenStyle,
                  }
            }
          >
            {itemLabel}
          </Typography>
        ) : null}

        {renderAnchoredBadge({
          anchor:
            badgeAnchor,

          target:
            "content",

          badgeNode,
        })}
      </Box>

      {renderAnchoredBadge({
        anchor:
          badgeAnchor,

        target:
          "item",

        badgeNode,
      })}

      {indicator === "dot" &&
      active ? (
        <Box {...dotSlot} />
      ) : null}
    </Pressable>
  );
}
