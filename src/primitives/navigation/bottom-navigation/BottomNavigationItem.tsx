import React from "react";
import { Pressable } from "../../forms";
import { Box } from "../../layout";
import { Typography } from "../../typography";
import { useBottomNavigationContext } from "./BottomNavigationContext";
import {
  BOTTOM_NAVIGATION_DENSITY_MAP,
  cssSize,
  getBadgePlacementStyles,
  getItemBackground,
  getItemBorderColor,
  getItemBorderRadius,
} from "./bottomNavigation.styles";
import type {
  BottomNavigationBadgeAnchor,
  BottomNavigationItemProps,
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
  if (anchor !== target) return null;

  return badgeNode;
}

export const BottomNavigationItem = React.forwardRef<
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

      iconPosition,
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
    const ctx = useBottomNavigationContext();

    const active = ctx.value === value;
    const itemLabel = children ?? label;
    const densityStyles = BOTTOM_NAVIGATION_DENSITY_MAP[ctx.density];

    const resolvedLabelBehavior = labelBehavior ?? ctx.labelBehavior;
    const resolvedIndicator = indicator ?? ctx.indicator;

    const resolvedBadgeAnchor = badgeAnchor ?? ctx.badgeAnchor;
    const resolvedBadgePlacement = badgePlacement ?? ctx.badgePlacement;
    const resolvedBadgeOffset = badgeOffset ?? ctx.badgeOffset;

    const resolvedItemShape = itemShape ?? ctx.itemShape;
    const resolvedItemMinWidth = itemMinWidth ?? ctx.itemMinWidth;

    const resolvedIconPosition = iconPosition ?? ctx.iconPosition;
    const resolvedActiveIconScale = activeIconScale ?? ctx.activeIconScale;
    const resolvedActiveLabelWeight = activeLabelWeight ?? ctx.activeLabelWeight;

    const showLabel =
      Boolean(itemLabel) &&
      (resolvedLabelBehavior === "always" ||
        (resolvedLabelBehavior === "active" && active));

    const isHorizontal = resolvedIconPosition === "start";

    const badgeNode = badge ? (
      <Box
        data-ui-bottom-navigation-item-badge=""
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
        data-ui-bottom-navigation-item=""
        data-ui-bottom-navigation-item-active={active || undefined}
        data-ui-bottom-navigation-item-badge-anchor={
          badge ? resolvedBadgeAnchor : undefined
        }
        data-ui-bottom-navigation-item-badge-placement={
          badge ? resolvedBadgePlacement : undefined
        }
        onPress={(event) => {
          if (selectable) {
            ctx.setValue(value, event);
          }

          onSelect?.(value, event);
        }}
        style={{
          flex: "1 1 0",
          minWidth:
            resolvedItemMinWidth !== undefined
              ? cssSize(resolvedItemMinWidth)
              : 0,
          height: "100%",
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
          data-ui-bottom-navigation-item-content=""
          style={{
            width: "100%",
            height: "100%",
            minWidth: 0,
            minHeight: 0,
            position: "relative",
            display: "flex",
            flexDirection: isHorizontal ? "row" : "column",
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
            data-ui-bottom-navigation-item-icon-wrap=""
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              lineHeight: 1,
              flexShrink: 0,
              transform: active
                ? `translateY(-1px) scale(${resolvedActiveIconScale})`
                : undefined,
              transition:
                "transform var(--ui-duration-normal) var(--ui-ease-standard)",
            }}
          >
            {icon ? (
              <Box
                aria-hidden="true"
                data-ui-bottom-navigation-item-icon=""
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
              data-ui-bottom-navigation-item-label=""
              style={{
                maxWidth: "100%",
                minWidth: 0,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "inherit",
                lineHeight: 1.2,
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
            data-ui-bottom-navigation-item-dot=""
            style={{
              position: "absolute",
              left: "50%",
              bottom: "0.22rem",
              width: 4,
              height: 4,
              borderRadius: "9999px",
              transform: "translateX(-50%)",
              background: "var(--ui-primary)",
              pointerEvents: "none",
            }}
          />
        ) : null}
      </Pressable>
    );
  }
);

BottomNavigationItem.displayName = "BottomNavigation.Item";