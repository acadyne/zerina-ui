// src/primitives/navigation/bottom-navigation/BottomNavigationItem.tsx
import React from "react";
import {
  cx,
  mergeStyles,
  resolveMergedSlot,
  type SlotElementProps,
} from "../../../helpers/css";
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
  BottomNavigationSlot,
  BottomNavigationSlotProps,
  BottomNavigationStyles,
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

function resolveNavigationItemSlot({
  slots,
  ctxStyles,
  ctxSlotProps,
  styles,
  slotProps,
  className,
  style,
  baseStyle,
  baseProps,
}: {
  slots: BottomNavigationSlot[];
  ctxStyles?: BottomNavigationStyles;
  ctxSlotProps?: BottomNavigationSlotProps;
  styles?: BottomNavigationStyles;
  slotProps?: BottomNavigationSlotProps;
  className?: string;
  style?: React.CSSProperties;
  baseStyle?: React.CSSProperties;
  baseProps?: SlotElementProps;
}): SlotElementProps {
  const contextSlot = resolveMergedSlot({
    slots,
    styles: ctxStyles,
    slotProps: ctxSlotProps,
    baseStyle,
    baseProps,
  });

  const localSlot = resolveMergedSlot({
    slots,
    styles,
    slotProps,
  });

  return {
    ...contextSlot,
    ...localSlot,
    className: cx(contextSlot.className, className, localSlot.className),
    style: mergeStyles(contextSlot.style, localSlot.style, style),
  };
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

      styles,
      slotProps,

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

    const itemSlots: BottomNavigationSlot[] = active
      ? ["item", "activeItem"]
      : ["item"];

    const contentSlots: BottomNavigationSlot[] = active
      ? ["content", "activeContent"]
      : ["content"];

    const iconWrapSlots: BottomNavigationSlot[] = active
      ? ["iconWrap", "activeIconWrap"]
      : ["iconWrap"];

    const iconSlots: BottomNavigationSlot[] = active
      ? ["icon", "activeIcon"]
      : ["icon"];

    const labelSlots: BottomNavigationSlot[] = active
      ? ["label", "activeLabel"]
      : ["label"];

    const badgeSlots: BottomNavigationSlot[] = active
      ? ["badge", "activeBadge"]
      : ["badge"];

    const itemSlot = resolveNavigationItemSlot({
      slots: itemSlots,
      ctxStyles: ctx.styles,
      ctxSlotProps: ctx.slotProps,
      styles,
      slotProps,
      className,
      style,
      baseProps: {
        role: "tab",
        "aria-selected": active,
        "aria-label": ariaLabel,
        "data-active": active || undefined,
        "data-ui-bottom-navigation-item": "",
        "data-ui-bottom-navigation-item-active": active || undefined,
        "data-ui-bottom-navigation-item-badge-anchor": badge
          ? resolvedBadgeAnchor
          : undefined,
        "data-ui-bottom-navigation-item-badge-placement": badge
          ? resolvedBadgePlacement
          : undefined,
      },
      baseStyle: {
        flex: "1 1 0",
        minWidth:
          resolvedItemMinWidth !== undefined
            ? cssSize(resolvedItemMinWidth)
            : 0,
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
      },
    });

    const contentSlot = resolveNavigationItemSlot({
      slots: contentSlots,
      ctxStyles: ctx.styles,
      ctxSlotProps: ctx.slotProps,
      styles,
      slotProps,
      baseProps: {
        "data-ui-bottom-navigation-item-content": "",
      },
      baseStyle: {
        minWidth: 0,
        minHeight: 0,
        position: "relative",
        display: "flex",
        flexDirection: resolvedIconPosition === "start" ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: densityStyles.gap,
        overflow: "visible",
        borderRadius: "inherit",
        boxSizing: "border-box",
      },
    });

    const iconWrapSlot = resolveNavigationItemSlot({
      slots: iconWrapSlots,
      ctxStyles: ctx.styles,
      ctxSlotProps: ctx.slotProps,
      styles,
      slotProps,
      baseProps: {
        "data-ui-bottom-navigation-item-icon-wrap": "",
      },
      baseStyle: {
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
      },
    });

    const iconSlot = resolveNavigationItemSlot({
      slots: iconSlots,
      ctxStyles: ctx.styles,
      ctxSlotProps: ctx.slotProps,
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
        "data-ui-bottom-navigation-item-icon": "",
      },
      baseStyle: {
        fontSize: densityStyles.iconSize,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      },
    });

    const labelSlot = resolveNavigationItemSlot({
      slots: labelSlots,
      ctxStyles: ctx.styles,
      ctxSlotProps: ctx.slotProps,
      styles,
      slotProps,
      baseProps: {
        "data-ui-bottom-navigation-item-label": "",
      },
      baseStyle: {
        maxWidth: "100%",
        minWidth: 0,
        margin: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: "inherit",
        lineHeight: 1.1,
      },
    });

    const badgeSlot = resolveNavigationItemSlot({
      slots: badgeSlots,
      ctxStyles: ctx.styles,
      ctxSlotProps: ctx.slotProps,
      styles,
      slotProps,
      baseProps: {
        "data-ui-bottom-navigation-item-badge": "",
      },
      baseStyle: getBadgePlacementStyles({
        placement: resolvedBadgePlacement,
        offset: resolvedBadgeOffset,
      }),
    });

    const dotSlot = resolveNavigationItemSlot({
      slots: ["dot"],
      ctxStyles: ctx.styles,
      ctxSlotProps: ctx.slotProps,
      styles,
      slotProps,
      baseProps: {
        "aria-hidden": true,
        "data-ui-bottom-navigation-item-dot": "",
      },
      baseStyle: {
        position: "absolute",
        left: "50%",
        bottom: "0.18rem",
        width: 18,
        height: 4,
        borderRadius: "9999px",
        transform: "translateX(-50%)",
        background: "var(--ui-primary)",
        pointerEvents: "none",
      },
    });

    const badgeNode = badge ? <Box {...badgeSlot}>{badge}</Box> : null;

    return (
      <Pressable
        as="button"
        ref={ref as React.Ref<HTMLElement>}
        type="button"
        disabled={disabled}
        {...itemSlot}
        {...rest}
        onPress={(event) => {
          if (selectable) {
            ctx.setValue(value, event);
          }

          onSelect?.(value, event);
        }}
      >
        <Box {...contentSlot}>
          <Box {...iconWrapSlot}>
            {icon ? <Box {...iconSlot}>{icon}</Box> : null}

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
              {...labelSlot}
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

        {resolvedIndicator === "dot" && active ? <Box {...dotSlot} /> : null}
      </Pressable>
    );
  }
);

BottomNavigationItem.displayName = "BottomNavigation.Item";