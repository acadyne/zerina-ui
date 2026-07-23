// src/primitives/navigation/navigation-rail/NavigationRailItem.tsx
import React from "react";
import {
  resolveLayeredSlot,
} from "../../../helpers/css";
import { Pressable } from "../../forms";
import { Box } from "../../layout";
import { Typography } from "../../typography";
import { useNavigationRailContext } from "./NavigationRailContext";
import {
  getBadgePlacementStyles,
  navigationRailItemRecipe,
} from "./navigationRail.styles";
import type {
  NavigationRailBadgeAnchor,
  NavigationRailItemProps,
  NavigationRailSlot,
} from "./navigationRail.types";

function renderAnchoredBadge({
  anchor,
  target,
  badgeNode,
}: {
  anchor: NavigationRailBadgeAnchor;
  target: NavigationRailBadgeAnchor;
  badgeNode: React.ReactNode;
}) {
  if (anchor !== target) {
    return null;
  }

  return badgeNode;
}

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
      ref
    ) => {
      const ctx =
        useNavigationRailContext();

      const active =
        ctx.value === value;

      const itemLabel =
        children ?? label;

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

      const showLabel =
        Boolean(itemLabel) &&
        (
          resolvedLabelBehavior ===
            "always" ||
          (
            resolvedLabelBehavior ===
              "active" &&
            active
          )
        );

      const itemSlots:
        NavigationRailSlot[] =
        active
          ? [
              "item",
              "activeItem",
            ]
          : ["item"];

      const contentSlots:
        NavigationRailSlot[] =
        active
          ? [
              "content",
              "activeContent",
            ]
          : ["content"];

      const iconWrapSlots:
        NavigationRailSlot[] =
        active
          ? [
              "iconWrap",
              "activeIconWrap",
            ]
          : ["iconWrap"];

      const iconSlots:
        NavigationRailSlot[] =
        active
          ? [
              "icon",
              "activeIcon",
            ]
          : ["icon"];

      const labelSlots:
        NavigationRailSlot[] =
        active
          ? [
              "label",
              "activeLabel",
            ]
          : ["label"];

      const badgeSlots:
        NavigationRailSlot[] =
        active
          ? [
              "badge",
              "activeBadge",
            ]
          : ["badge"];

      const recipeStyles =
        navigationRailItemRecipe({
          density:
            ctx.density,

          active,
          disabled,

          indicator:
            resolvedIndicator,

          shape:
            resolvedItemShape,

          itemMinWidth:
            resolvedItemMinWidth,

          itemMinHeight:
            resolvedItemMinHeight,

          hasBadge:
            Boolean(badge),

          badgeAnchor:
            resolvedBadgeAnchor,
        });

      const itemSlot =
        resolveLayeredSlot({
          slots: itemSlots,

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

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

            "data-ui-navigation-rail-item":
              "",

            "data-ui-navigation-rail-item-active":
              active ||
              undefined,

            "data-ui-navigation-rail-item-badge-anchor":
              badge
                ? resolvedBadgeAnchor
                : undefined,

            "data-ui-navigation-rail-item-badge-placement":
              badge
                ? resolvedBadgePlacement
                : undefined,
          },

          baseStyle:
            recipeStyles.item,
        });

      const contentSlot =
        resolveLayeredSlot({
          slots: contentSlots,

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          baseProps: {
            "data-ui-navigation-rail-item-content":
              "",
          },

          baseStyle:
            recipeStyles.content,
        });

      const iconWrapSlot =
        resolveLayeredSlot({
          slots: iconWrapSlots,

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          baseProps: {
            "data-ui-navigation-rail-item-icon-wrap":
              "",
          },

          baseStyle:
            recipeStyles.iconWrap,
        });

      const iconSlot =
        resolveLayeredSlot({
          slots: iconSlots,

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,

            "data-ui-navigation-rail-item-icon":
              "",
          },

          baseStyle:
            recipeStyles.icon,
        });

      const labelSlot =
        resolveLayeredSlot({
          slots: labelSlots,

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          baseProps: {
            "data-ui-navigation-rail-item-label":
              "",
          },

          baseStyle:
            recipeStyles.label,
        });

      const badgeSlot =
        resolveLayeredSlot({
          slots: badgeSlots,

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          baseProps: {
            "data-ui-navigation-rail-item-badge":
              "",
          },

          baseStyle:
            getBadgePlacementStyles({
              placement:
                resolvedBadgePlacement,

              offset:
                resolvedBadgeOffset,
            }),
        });

      const dotSlot =
        resolveLayeredSlot({
          slots: ["dot"],

          contextStyles:
            ctx.styles,

          contextSlotProps:
            ctx.slotProps,

          styles,
          slotProps,

          baseProps: {
            "aria-hidden": true,

            "data-ui-navigation-rail-item-dot":
              "",
          },

          baseStyle:
            recipeStyles.dot,
        });

      const badgeNode =
        badge ? (
          <Box {...badgeSlot}>
            {badge}
          </Box>
        ) : null;

      return (
        <Pressable
          as="button"
          ref={ref}
          type="button"
          disabled={disabled}
          {...itemSlot}
          {...rest}
          onPress={(event) => {
            onPress?.(event);

            if (
              event.defaultPrevented
            ) {
              return;
            }

            ctx.setValue(
              value,
              event
            );
          }}
        >
          <Box {...contentSlot}>
            <Box {...iconWrapSlot}>
              {icon ? (
                <Box {...iconSlot}>
                  {icon}
                </Box>
              ) : null}

              {renderAnchoredBadge({
                anchor:
                  resolvedBadgeAnchor,

                target:
                  "icon",

                badgeNode,
              })}
            </Box>

            {showLabel ? (
              <Typography
                as="span"
                size="xs"
                weight={
                  active
                    ? resolvedActiveLabelWeight
                    : 700
                }
                {...labelSlot}
              >
                {itemLabel}
              </Typography>
            ) : null}

            {renderAnchoredBadge({
              anchor:
                resolvedBadgeAnchor,

              target:
                "content",

              badgeNode,
            })}
          </Box>

          {renderAnchoredBadge({
            anchor:
              resolvedBadgeAnchor,

            target:
              "item",

            badgeNode,
          })}

          {resolvedIndicator ===
            "dot" &&
          active ? (
            <Box {...dotSlot} />
          ) : null}
        </Pressable>
      );
    }
  );

NavigationRailItem.displayName =
  "NavigationRail.Item";