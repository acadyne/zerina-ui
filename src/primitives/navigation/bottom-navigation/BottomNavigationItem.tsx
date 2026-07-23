// src/primitives/navigation/bottom-navigation/BottomNavigationItem.tsx
import React from "react";
import {
  resolveLayeredSlot,
} from "../../../helpers/css";
import { Pressable } from "../../forms";
import { Box } from "../../layout";
import { Typography } from "../../typography";
import { useBottomNavigationContext } from "./BottomNavigationContext";
import {
  bottomNavigationItemRecipe,
  getBadgePlacementStyles,
} from "./bottomNavigation.styles";
import type {
  BottomNavigationBadgeAnchor,
  BottomNavigationItemProps,
  BottomNavigationSlot,
} from "./bottomNavigation.types";

function renderAnchoredBadge({
  anchor,
  target,
  badgeNode,
}: {
  anchor: BottomNavigationBadgeAnchor;
  target: BottomNavigationBadgeAnchor;
  badgeNode: React.ReactNode;
}) {
  if (anchor !== target) {
    return null;
  }

  return badgeNode;
}

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
      ref
    ) => {
      const ctx =
        useBottomNavigationContext();

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

      const resolvedIconPosition =
        iconPosition ??
        ctx.iconPosition;

      const resolvedActiveLabelWeight =
        activeLabelWeight ??
        ctx.activeLabelWeight;

      const showLabel =
        Boolean(itemLabel) &&
        (
          resolvedLabelBehavior === "always" ||
          (
            resolvedLabelBehavior === "active" &&
            active
          )
        );

      const itemSlots:
        BottomNavigationSlot[] =
        active
          ? ["item", "activeItem"]
          : ["item"];

      const contentSlots:
        BottomNavigationSlot[] =
        active
          ? ["content", "activeContent"]
          : ["content"];

      const iconWrapSlots:
        BottomNavigationSlot[] =
        active
          ? ["iconWrap", "activeIconWrap"]
          : ["iconWrap"];

      const iconSlots:
        BottomNavigationSlot[] =
        active
          ? ["icon", "activeIcon"]
          : ["icon"];

      const labelSlots:
        BottomNavigationSlot[] =
        active
          ? ["label", "activeLabel"]
          : ["label"];

      const badgeSlots:
        BottomNavigationSlot[] =
        active
          ? ["badge", "activeBadge"]
          : ["badge"];

      const recipeStyles =
        bottomNavigationItemRecipe({
          density: ctx.density,
          active,
          disabled,

          indicator:
            resolvedIndicator,

          shape:
            resolvedItemShape,

          iconPosition:
            resolvedIconPosition,

          itemMinWidth:
            resolvedItemMinWidth,

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

            "data-ui-bottom-navigation-item":
              "",

            "data-ui-bottom-navigation-item-active":
              active ||
              undefined,

            "data-ui-bottom-navigation-item-badge-anchor":
              badge
                ? resolvedBadgeAnchor
                : undefined,

            "data-ui-bottom-navigation-item-badge-placement":
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
            "data-ui-bottom-navigation-item-content":
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
            "data-ui-bottom-navigation-item-icon-wrap":
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

            "data-ui-bottom-navigation-item-icon":
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
            "data-ui-bottom-navigation-item-label":
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
            "data-ui-bottom-navigation-item-badge":
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

            "data-ui-bottom-navigation-item-dot":
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

                target: "icon",

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

              target: "content",

              badgeNode,
            })}
          </Box>

          {renderAnchoredBadge({
            anchor:
              resolvedBadgeAnchor,

            target: "item",

            badgeNode,
          })}

          {resolvedIndicator === "dot" &&
          active ? (
            <Box {...dotSlot} />
          ) : null}
        </Pressable>
      );
    }
  );

BottomNavigationItem.displayName =
  "BottomNavigation.Item";