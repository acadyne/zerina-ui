// src/primitives/navigation/navigation-rail/NavigationRailItem.tsx
import React from "react";
import { Pressable } from "../../forms";
import { Box } from "../../layout";
import { Typography } from "../../typography";
import { useNavigationRailContext } from "./NavigationRailContext";
import {
  NAVIGATION_RAIL_DENSITY_MAP,
  cssSize,
  getBadgePlacementStyles,
  getItemBackground,
  getItemBorderColor,
  getItemBorderRadius,
} from "./navigationRail.styles";
import type {
  NavigationRailBadgeAnchor,
  NavigationRailItemProps,
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
  if (anchor !== target) return null;

  return badgeNode;
}

export const NavigationRailItem = React.forwardRef<
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
      selectable = true,
      ariaLabel,
      onSelect,

      labelBehavior,
      indicator,

      badgeAnchor,
      badgePlacement,
      badgeOffset,

      itemShape,
      itemMinWidth,
      itemMinHeight,

      activeIconScale,
      activeLabelWeight,

      itemStyle,
      activeItemStyle,

      contentStyle,
      activeContentStyle,

      iconStyle,
      activeIconStyle,

      labelStyle,
      activeLabelStyle,

      badgeStyle,
      activeBadgeStyle,

      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const ctx = useNavigationRailContext();

    const active = ctx.value === value;
    const itemLabel = children ?? label;
    const densityStyles = NAVIGATION_RAIL_DENSITY_MAP[ctx.density];

    const resolvedLabelBehavior = labelBehavior ?? ctx.labelBehavior;
    const resolvedIndicator = indicator ?? ctx.indicator;

    const resolvedBadgeAnchor = badgeAnchor ?? ctx.badgeAnchor;
    const resolvedBadgePlacement = badgePlacement ?? ctx.badgePlacement;
    const resolvedBadgeOffset = badgeOffset ?? ctx.badgeOffset;

    const resolvedItemShape = itemShape ?? ctx.itemShape;
    const resolvedItemMinWidth = itemMinWidth ?? ctx.itemMinWidth;
    const resolvedItemMinHeight = itemMinHeight ?? ctx.itemMinHeight;

    const resolvedActiveIconScale = activeIconScale ?? ctx.activeIconScale;
    const resolvedActiveLabelWeight = activeLabelWeight ?? ctx.activeLabelWeight;

    const showLabel =
      Boolean(itemLabel) &&
      (resolvedLabelBehavior === "always" ||
        (resolvedLabelBehavior === "active" && active));

    const badgeNode = badge ? (
      <Box
        data-ui-navigation-rail-item-badge=""
        style={{
          ...getBadgePlacementStyles({
            placement: resolvedBadgePlacement,
            offset: resolvedBadgeOffset,
          }),
          ...(ctx.badgeStyle ?? {}),
          ...(badgeStyle ?? {}),
          ...(active ? ctx.activeBadgeStyle ?? {} : {}),
          ...(active ? activeBadgeStyle ?? {} : {}),
        }}
      >
        {badge}
      </Box>
    ) : null;

    return (
      <Pressable
        as="button"
        ref={ref as React.Ref<HTMLElement>}
        type="button"
        disabled={disabled}
        className={className}
        role="tab"
        aria-selected={active}
        aria-label={ariaLabel}
        data-active={active || undefined}
        data-ui-navigation-rail-item=""
        data-ui-navigation-rail-item-active={active || undefined}
        data-ui-navigation-rail-item-badge-anchor={
          badge ? resolvedBadgeAnchor : undefined
        }
        data-ui-navigation-rail-item-badge-placement={
          badge ? resolvedBadgePlacement : undefined
        }
        onPress={(event) => {
          if (selectable) {
            ctx.setValue(value, event);
          }

          onSelect?.(value, event);
        }}
        style={{
          width: "100%",
          minWidth:
            resolvedItemMinWidth !== undefined
              ? cssSize(resolvedItemMinWidth)
              : densityStyles.itemMinWidth,
          minHeight:
            resolvedItemMinHeight !== undefined
              ? cssSize(resolvedItemMinHeight)
              : densityStyles.itemMinHeight,
          position: "relative",
          border: "1px solid",
          borderColor: getItemBorderColor({
            active,
            indicator: resolvedIndicator,
          }),
          borderRadius: getItemBorderRadius({
            indicator: resolvedIndicator,
            shape: resolvedItemShape,
          }),
          background: getItemBackground({
            active,
            indicator: resolvedIndicator,
          }),
          color: active ? "var(--ui-text)" : "var(--ui-text-muted)",
          opacity: disabled ? "var(--ui-state-disabled-opacity, 0.62)" : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: densityStyles.itemPaddingTop,
          paddingRight: densityStyles.itemPaddingRight,
          paddingBottom: densityStyles.itemPaddingBottom,
          paddingLeft: densityStyles.itemPaddingLeft,
          textAlign: "center",
          overflow: "visible",
          transition:
            "background var(--ui-duration-normal) var(--ui-ease-standard), border-color var(--ui-duration-normal) var(--ui-ease-standard), color var(--ui-duration-normal) var(--ui-ease-standard), opacity var(--ui-duration-normal) var(--ui-ease-standard), box-shadow var(--ui-duration-normal) var(--ui-ease-standard)",
          ...(ctx.itemStyle ?? {}),
          ...(itemStyle ?? {}),
          ...(active ? ctx.activeItemStyle ?? {} : {}),
          ...(active ? activeItemStyle ?? {} : {}),
          ...style,
        }}
        {...rest}
      >
        <Box
          data-ui-navigation-rail-item-content=""
          style={{
            width: "100%",
            minWidth: 0,
            minHeight: 0,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: densityStyles.gap,
            overflow: "visible",
            borderRadius: "inherit",
            boxSizing: "border-box",
            ...(ctx.contentStyle ?? {}),
            ...(contentStyle ?? {}),
            ...(active ? ctx.activeContentStyle ?? {} : {}),
            ...(active ? activeContentStyle ?? {} : {}),
          }}
        >
          <Box
            data-ui-navigation-rail-item-icon-wrap=""
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width:
                badge && resolvedBadgeAnchor === "icon" ? "1.65rem" : undefined,
              height:
                badge && resolvedBadgeAnchor === "icon" ? "1.35rem" : undefined,
              minWidth: 0,
              lineHeight: 1,
              flexShrink: 0,
              overflow: "visible",
              transform: active
                ? `translateY(-1px) scale(${resolvedActiveIconScale})`
                : undefined,
              transformOrigin: "center center",
              transition:
                "transform var(--ui-duration-normal) var(--ui-ease-standard)",
            }}
          >
            {icon ? (
              <Box
                aria-hidden="true"
                data-ui-navigation-rail-item-icon=""
                style={{
                  fontSize: densityStyles.iconSize,
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(ctx.iconStyle ?? {}),
                  ...(iconStyle ?? {}),
                  ...(active ? ctx.activeIconStyle ?? {} : {}),
                  ...(active ? activeIconStyle ?? {} : {}),
                }}
              >
                {icon}
              </Box>
            ) : null}

            {renderAnchoredBadge({
              anchor: resolvedBadgeAnchor,
              target: "icon",
              badgeNode,
            })}
          </Box>

          {showLabel ? (
            <Typography
              as="span"
              size="xs"
              weight={active ? resolvedActiveLabelWeight : 700}
              data-ui-navigation-rail-item-label=""
              style={{
                maxWidth: "100%",
                minWidth: 0,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "inherit",
                lineHeight: 1.15,
                ...(ctx.labelStyle ?? {}),
                ...(labelStyle ?? {}),
                ...(active ? ctx.activeLabelStyle ?? {} : {}),
                ...(active ? activeLabelStyle ?? {} : {}),
              }}
            >
              {itemLabel}
            </Typography>
          ) : null}

          {renderAnchoredBadge({
            anchor: resolvedBadgeAnchor,
            target: "content",
            badgeNode,
          })}
        </Box>

        {renderAnchoredBadge({
          anchor: resolvedBadgeAnchor,
          target: "item",
          badgeNode,
        })}

        {resolvedIndicator === "dot" && active ? (
          <Box
            aria-hidden="true"
            data-ui-navigation-rail-item-dot=""
            style={{
              position: "absolute",
              right: "0.22rem",
              top: "50%",
              width: 4,
              height: 18,
              borderRadius: "9999px",
              transform: "translateY(-50%)",
              background: "var(--ui-primary)",
              pointerEvents: "none",
            }}
          />
        ) : null}
      </Pressable>
    );
  }
);

NavigationRailItem.displayName = "NavigationRail.Item";