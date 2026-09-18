import React from "react";

import {
  NavigationDestinationItem,
} from "../shared/NavigationDestinationItem";

import {
  useNavigationRailContext,
} from "./NavigationRailContext";

import {
  NAVIGATION_RAIL_VISUALLY_HIDDEN_STYLE,
  getBadgePlacementStyles,
  navigationRailItemRecipe,
} from "./navigationRail.styles";

import type {
  NavigationRailItemProps,
  NavigationRailSlot,
} from "./navigationRail.types";


const NAVIGATION_RAIL_ITEM_DATA_ATTRIBUTES = {
  item:
    "data-ui-navigation-rail-item",
  indicator:
    "data-ui-navigation-rail-item-indicator",
  badgeAnchor:
    "data-ui-navigation-rail-item-badge-anchor",
  badgePlacement:
    "data-ui-navigation-rail-item-badge-placement",
  content:
    "data-ui-navigation-rail-item-content",
  iconWrap:
    "data-ui-navigation-rail-item-icon-wrap",
  icon:
    "data-ui-navigation-rail-item-icon",
  label:
    "data-ui-navigation-rail-item-label",
  badge:
    "data-ui-navigation-rail-item-badge",
  dot:
    "data-ui-navigation-rail-item-dot",
} as const;


export const NavigationRailItem =
  React.forwardRef<
    HTMLButtonElement,
    NavigationRailItemProps
  >(
    (
      {
        value,
        children,
        label,
        icon,
        badge,
        disabled = false,
        onPress,

        labelBehavior,
        indicator,

        badgeAnchor,
        badgePlacement,
        badgeOffset,

        itemShape,
        itemMinWidth,
        itemMinHeight,

        activeLabelWeight,

        styles,
        slotProps,

        className = "",
        style,

        ...rest
      },
      ref,
    ) => {
      const ctx =
        useNavigationRailContext();

      const active =
        ctx.value === value;

      const resolvedLabelBehavior =
        labelBehavior ??
        ctx.labelBehavior;

      const resolvedIndicator =
        indicator ??
        ctx.indicator;

      const resolvedBadgeAnchor =
        badgeAnchor ??
        ctx.badgeAnchor;

      const resolvedBadgePlacement =
        badgePlacement ??
        ctx.badgePlacement;

      const resolvedBadgeOffset =
        badgeOffset ??
        ctx.badgeOffset;

      const resolvedItemShape =
        itemShape ??
        ctx.itemShape;

      const resolvedItemMinWidth =
        itemMinWidth ??
        ctx.itemMinWidth;

      const resolvedItemMinHeight =
        itemMinHeight ??
        ctx.itemMinHeight;

      const resolvedActiveLabelWeight =
        activeLabelWeight ??
        ctx.activeLabelWeight;

      const recipeStyles =
        navigationRailItemRecipe({
          density:
            ctx.density,

          indicator:
            resolvedIndicator,

          shape:
            resolvedItemShape,

          itemMinWidth:
            resolvedItemMinWidth,

          itemMinHeight:
            resolvedItemMinHeight,

          hasBadge:
            badge !== null &&
            badge !== undefined,

          badgeAnchor:
            resolvedBadgeAnchor,
        });

      return (
        <NavigationDestinationItem<NavigationRailSlot>
          value={value}
          active={active}
          itemLabel={
            children ??
            label
          }
          icon={icon}
          badge={badge}
          disabled={disabled}
          onPress={onPress}
          setValue={
            ctx.setValue
          }
          labelBehavior={
            resolvedLabelBehavior
          }
          indicator={
            resolvedIndicator
          }
          badgeAnchor={
            resolvedBadgeAnchor
          }
          badgePlacement={
            resolvedBadgePlacement
          }
          activeLabelWeight={
            resolvedActiveLabelWeight
          }
          recipeStyles={
            recipeStyles
          }
          badgeStyle={
            getBadgePlacementStyles({
              placement:
                resolvedBadgePlacement,

              offset:
                resolvedBadgeOffset,
            })
          }
          visuallyHiddenStyle={
            NAVIGATION_RAIL_VISUALLY_HIDDEN_STYLE
          }
          contextStyles={
            ctx.styles
          }
          contextSlotProps={
            ctx.slotProps
          }
          styles={styles}
          slotProps={
            slotProps
          }
          className={
            className
          }
          style={style}
          dataAttributes={
            NAVIGATION_RAIL_ITEM_DATA_ATTRIBUTES
          }
          buttonProps={
            rest
          }
          forwardedRef={
            ref
          }
        />
      );
    },
  );

NavigationRailItem.displayName =
  "NavigationRail.Item";
