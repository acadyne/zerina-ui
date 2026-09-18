import React from "react";

import {
  NavigationDestinationItem,
} from "../shared/NavigationDestinationItem";

import {
  useBottomNavigationContext,
} from "./BottomNavigationContext";

import {
  BOTTOM_NAVIGATION_VISUALLY_HIDDEN_STYLE,
  bottomNavigationItemRecipe,
  getBadgePlacementStyles,
} from "./bottomNavigation.styles";

import type {
  BottomNavigationItemProps,
  BottomNavigationSlot,
} from "./bottomNavigation.types";


const BOTTOM_NAVIGATION_ITEM_DATA_ATTRIBUTES = {
  item:
    "data-ui-bottom-navigation-item",
  indicator:
    "data-ui-bottom-navigation-item-indicator",
  badgeAnchor:
    "data-ui-bottom-navigation-item-badge-anchor",
  badgePlacement:
    "data-ui-bottom-navigation-item-badge-placement",
  content:
    "data-ui-bottom-navigation-item-content",
  iconWrap:
    "data-ui-bottom-navigation-item-icon-wrap",
  icon:
    "data-ui-bottom-navigation-item-icon",
  label:
    "data-ui-bottom-navigation-item-label",
  badge:
    "data-ui-bottom-navigation-item-badge",
  dot:
    "data-ui-bottom-navigation-item-dot",
} as const;


export const BottomNavigationItem =
  React.forwardRef<
    HTMLButtonElement,
    BottomNavigationItemProps
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

        iconPosition,
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
        useBottomNavigationContext();

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

      const resolvedIconPosition =
        iconPosition ??
        ctx.iconPosition;

      const resolvedActiveLabelWeight =
        activeLabelWeight ??
        ctx.activeLabelWeight;

      const recipeStyles =
        bottomNavigationItemRecipe({
          density:
            ctx.density,

          indicator:
            resolvedIndicator,

          shape:
            resolvedItemShape,

          iconPosition:
            resolvedIconPosition,

          itemMinWidth:
            resolvedItemMinWidth,

          hasBadge:
            badge !== null &&
            badge !== undefined,

          badgeAnchor:
            resolvedBadgeAnchor,
        });

      return (
        <NavigationDestinationItem<BottomNavigationSlot>
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
            BOTTOM_NAVIGATION_VISUALLY_HIDDEN_STYLE
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
            BOTTOM_NAVIGATION_ITEM_DATA_ATTRIBUTES
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

BottomNavigationItem.displayName =
  "BottomNavigation.Item";
