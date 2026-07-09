// src/primitives/navigation/navigation-rail/NavigationRailItem.tsx
import React from "react";
import { cx, getSlotProps, getSlotStyle } from "../../../helpers/css";
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

      styles,
      slotProps,

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

    const itemSlotProps = getSlotProps(ctx.slotProps, "item");
    const itemLocalSlotProps = getSlotProps(slotProps, "item");

    const contentSlotProps = getSlotProps(ctx.slotProps, "content");
    const contentLocalSlotProps = getSlotProps(slotProps, "content");

    const iconWrapSlotProps = getSlotProps(ctx.slotProps, "iconWrap");
    const iconWrapLocalSlotProps = getSlotProps(slotProps, "iconWrap");

    const iconSlotProps = getSlotProps(ctx.slotProps, "icon");
    const iconLocalSlotProps = getSlotProps(slotProps, "icon");

    const labelSlotProps = getSlotProps(ctx.slotProps, "label");
    const labelLocalSlotProps = getSlotProps(slotProps, "label");

    const badgeSlotProps = getSlotProps(ctx.slotProps, "badge");
    const badgeLocalSlotProps = getSlotProps(slotProps, "badge");

    const dotSlotProps = getSlotProps(ctx.slotProps, "dot");
    const dotLocalSlotProps = getSlotProps(slotProps, "dot");

    const {
      className: itemSlotClassName,
      style: itemSlotStyle,
      ...itemSlotRest
    } = itemSlotProps;

    const {
      className: itemLocalSlotClassName,
      style: itemLocalSlotStyle,
      ...itemLocalSlotRest
    } = itemLocalSlotProps;

    const {
      className: contentSlotClassName,
      style: contentSlotStyle,
      ...contentSlotRest
    } = contentSlotProps;

    const {
      className: contentLocalSlotClassName,
      style: contentLocalSlotStyle,
      ...contentLocalSlotRest
    } = contentLocalSlotProps;

    const {
      className: iconWrapSlotClassName,
      style: iconWrapSlotStyle,
      ...iconWrapSlotRest
    } = iconWrapSlotProps;

    const {
      className: iconWrapLocalSlotClassName,
      style: iconWrapLocalSlotStyle,
      ...iconWrapLocalSlotRest
    } = iconWrapLocalSlotProps;

    const {
      className: iconSlotClassName,
      style: iconSlotStyle,
      ...iconSlotRest
    } = iconSlotProps;

    const {
      className: iconLocalSlotClassName,
      style: iconLocalSlotStyle,
      ...iconLocalSlotRest
    } = iconLocalSlotProps;

    const {
      className: labelSlotClassName,
      style: labelSlotStyle,
      ...labelSlotRest
    } = labelSlotProps;

    const {
      className: labelLocalSlotClassName,
      style: labelLocalSlotStyle,
      ...labelLocalSlotRest
    } = labelLocalSlotProps;

    const {
      className: badgeSlotClassName,
      style: badgeSlotStyle,
      ...badgeSlotRest
    } = badgeSlotProps;

    const {
      className: badgeLocalSlotClassName,
      style: badgeLocalSlotStyle,
      ...badgeLocalSlotRest
    } = badgeLocalSlotProps;

    const {
      className: dotSlotClassName,
      style: dotSlotStyle,
      ...dotSlotRest
    } = dotSlotProps;

    const {
      className: dotLocalSlotClassName,
      style: dotLocalSlotStyle,
      ...dotLocalSlotRest
    } = dotLocalSlotProps;

    const badgeNode = badge ? (
      <Box
        data-ui-navigation-rail-item-badge=""
        className={cx(badgeSlotClassName, badgeLocalSlotClassName)}
        {...badgeSlotRest}
        {...badgeLocalSlotRest}
        style={{
          ...getBadgePlacementStyles({
            placement: resolvedBadgePlacement,
            offset: resolvedBadgeOffset,
          }),
          ...getSlotStyle(ctx.styles, "badge"),
          ...getSlotStyle(styles, "badge"),
          ...badgeSlotStyle,
          ...badgeLocalSlotStyle,
          ...(ctx.badgeStyle ?? {}),
          ...(badgeStyle ?? {}),
          ...(active ? ctx.activeBadgeStyle ?? {} : {}),
          ...(active ? activeBadgeStyle ?? {} : {}),
          ...(active ? getSlotStyle(ctx.styles, "activeBadge") ?? {} : {}),
          ...(active ? getSlotStyle(styles, "activeBadge") ?? {} : {}),
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
        className={cx(className, itemSlotClassName, itemLocalSlotClassName)}
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
          ...getSlotStyle(ctx.styles, "item"),
          ...getSlotStyle(styles, "item"),
          ...itemSlotStyle,
          ...itemLocalSlotStyle,
          ...(active ? getSlotStyle(ctx.styles, "activeItem") ?? {} : {}),
          ...(active ? getSlotStyle(styles, "activeItem") ?? {} : {}),
          ...(ctx.itemStyle ?? {}),
          ...(itemStyle ?? {}),
          ...(active ? ctx.activeItemStyle ?? {} : {}),
          ...(active ? activeItemStyle ?? {} : {}),
          ...style,
        }}
        {...itemSlotRest}
        {...itemLocalSlotRest}
        {...rest}
      >
        <Box
          data-ui-navigation-rail-item-content=""
          className={cx(contentSlotClassName, contentLocalSlotClassName)}
          {...contentSlotRest}
          {...contentLocalSlotRest}
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
            ...getSlotStyle(ctx.styles, "content"),
            ...getSlotStyle(styles, "content"),
            ...contentSlotStyle,
            ...contentLocalSlotStyle,
            ...(active ? getSlotStyle(ctx.styles, "activeContent") ?? {} : {}),
            ...(active ? getSlotStyle(styles, "activeContent") ?? {} : {}),
            ...(ctx.contentStyle ?? {}),
            ...(contentStyle ?? {}),
            ...(active ? ctx.activeContentStyle ?? {} : {}),
            ...(active ? activeContentStyle ?? {} : {}),
          }}
        >
          <Box
            data-ui-navigation-rail-item-icon-wrap=""
            className={cx(iconWrapSlotClassName, iconWrapLocalSlotClassName)}
            {...iconWrapSlotRest}
            {...iconWrapLocalSlotRest}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width:
                badge && resolvedBadgeAnchor === "icon"
                  ? "1.65rem"
                  : undefined,
              height:
                badge && resolvedBadgeAnchor === "icon"
                  ? "1.35rem"
                  : undefined,
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
              ...getSlotStyle(ctx.styles, "iconWrap"),
              ...getSlotStyle(styles, "iconWrap"),
              ...iconWrapSlotStyle,
              ...iconWrapLocalSlotStyle,
              ...(active ? getSlotStyle(ctx.styles, "activeIconWrap") ?? {} : {}),
              ...(active ? getSlotStyle(styles, "activeIconWrap") ?? {} : {}),
            }}
          >
            {icon ? (
              <Box
                aria-hidden="true"
                data-ui-navigation-rail-item-icon=""
                className={cx(iconSlotClassName, iconLocalSlotClassName)}
                {...iconSlotRest}
                {...iconLocalSlotRest}
                style={{
                  fontSize: densityStyles.iconSize,
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...getSlotStyle(ctx.styles, "icon"),
                  ...getSlotStyle(styles, "icon"),
                  ...iconSlotStyle,
                  ...iconLocalSlotStyle,
                  ...(active ? getSlotStyle(ctx.styles, "activeIcon") ?? {} : {}),
                  ...(active ? getSlotStyle(styles, "activeIcon") ?? {} : {}),
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
              className={cx(labelSlotClassName, labelLocalSlotClassName)}
              {...labelSlotRest}
              {...labelLocalSlotRest}
              style={{
                maxWidth: "100%",
                minWidth: 0,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "inherit",
                lineHeight: 1.15,
                ...getSlotStyle(ctx.styles, "label"),
                ...getSlotStyle(styles, "label"),
                ...labelSlotStyle,
                ...labelLocalSlotStyle,
                ...(active ? getSlotStyle(ctx.styles, "activeLabel") ?? {} : {}),
                ...(active ? getSlotStyle(styles, "activeLabel") ?? {} : {}),
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
            className={cx(dotSlotClassName, dotLocalSlotClassName)}
            {...dotSlotRest}
            {...dotLocalSlotRest}
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
              ...getSlotStyle(ctx.styles, "dot"),
              ...getSlotStyle(styles, "dot"),
              ...dotSlotStyle,
              ...dotLocalSlotStyle,
            }}
          />
        ) : null}
      </Pressable>
    );
  }
);

NavigationRailItem.displayName = "NavigationRail.Item";