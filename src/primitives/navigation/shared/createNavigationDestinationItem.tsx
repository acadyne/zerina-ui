import React from "react";

import {
  NAVIGATION_DESTINATION_VISUALLY_HIDDEN_STYLE,
  createNavigationDestinationDataAttributes,
} from "./navigationDestination.styles";

import {
  resolveNavigationDestinationItem,
  type ResolvedNavigationDestinationItem,
} from "./navigationDestinationState";

import {
  NavigationDestinationItem,
  type NavigationDestinationItemProps,
  type NavigationDestinationRecipeStyles,
} from "./NavigationDestinationItem";

import type {
  NavigationDestinationContextValue,
} from "./navigationDestinationContext";

import type {
  NavigationDestinationPublicItemProps,
} from "./navigationDestination.types";

interface NavigationDestinationFamilyItemResolution {
  recipeStyles:
    NavigationDestinationRecipeStyles;

  badgeStyle:
    React.CSSProperties;
}

interface ResolveNavigationDestinationFamilyItemOptions<
  TProps,
  TContext,
> {
  props:
    React.PropsWithoutRef<TProps>;

  context:
    TContext;

  resolved:
    ResolvedNavigationDestinationItem;

  hasBadge:
    boolean;
}

export interface CreateNavigationDestinationItemOptions<
  TProps extends
    NavigationDestinationPublicItemProps<TSlot>,
  TSlot extends string,
  TContext extends
    NavigationDestinationContextValue<TSlot>,
> {
  displayName:
    string;

  dataAttributeFamily:
    string;

  useContext:
    () => TContext;

  familyPropKeys?:
    readonly (keyof TProps)[];

  resolveFamilyItem: (
    options:
      ResolveNavigationDestinationFamilyItemOptions<
        TProps,
        TContext
      >,
  ) =>
    NavigationDestinationFamilyItemResolution;
}

export function createNavigationDestinationItem<
  TProps extends
    NavigationDestinationPublicItemProps<TSlot>,
  TSlot extends string,
  TContext extends
    NavigationDestinationContextValue<TSlot>,
>({
  displayName,
  dataAttributeFamily,
  useContext,
  familyPropKeys = [],
  resolveFamilyItem,
}: CreateNavigationDestinationItemOptions<
  TProps,
  TSlot,
  TContext
>) {
  const dataAttributes =
    createNavigationDestinationDataAttributes(
      dataAttributeFamily,
    );

  const Component =
    React.forwardRef<
      HTMLButtonElement,
      TProps
    >(
      (
        props,
        ref,
      ) => {
        const {
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

          activeLabelWeight,

          styles,
          slotProps,

          className = "",
          style,

          ...rest
        } = props;

        const context =
          useContext();

        const resolved =
          resolveNavigationDestinationItem(
            context,
            {
              value,
              labelBehavior,
              indicator,
              badgeAnchor,
              badgePlacement,
              badgeOffset,
              itemShape,
              itemMinWidth,
              activeLabelWeight,
            },
          );

        const hasBadge =
          badge !== null &&
          badge !== undefined;

        const {
          recipeStyles,
          badgeStyle,
        } =
          resolveFamilyItem({
            props,
            context,
            resolved,
            hasBadge,
          });

        const buttonProps = {
          ...rest,
        } as Record<
          string,
          unknown
        >;

        for (
          const key of
          familyPropKeys
        ) {
          delete buttonProps[
            key as string
          ];
        }

        return (
          <NavigationDestinationItem<TSlot>
            value={value}
            active={
              resolved.active
            }
            itemLabel={
              children ??
              label
            }
            icon={icon}
            badge={badge}
            disabled={disabled}
            onPress={onPress}
            setValue={
              context.setValue
            }
            labelBehavior={
              resolved.labelBehavior
            }
            indicator={
              resolved.indicator
            }
            badgeAnchor={
              resolved.badgeAnchor
            }
            badgePlacement={
              resolved.badgePlacement
            }
            activeLabelWeight={
              resolved.activeLabelWeight
            }
            recipeStyles={
              recipeStyles
            }
            badgeStyle={
              badgeStyle
            }
            visuallyHiddenStyle={
              NAVIGATION_DESTINATION_VISUALLY_HIDDEN_STYLE
            }
            contextStyles={
              context.styles
            }
            contextSlotProps={
              context.slotProps
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
              dataAttributes
            }
            buttonProps={
              buttonProps as
                NavigationDestinationItemProps<TSlot>[
                  "buttonProps"
                ]
            }
            forwardedRef={
              ref
            }
          />
        );
      },
    );

  Component.displayName =
    displayName;

  return Component;
}
