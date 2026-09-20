// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AdaptiveScaffoldNavigation,
  AdaptiveScaffoldProps,
  AdaptiveScaffoldTabletNavigationPlacement,
  AvatarSize,
  BadgeColorScheme,
  BadgeVariant,
  ContainerSize,
  CreateThemeDefinitionInput,
  DialogSize,
  FloatingPlacement,
  HeadingTypographyRole,
  InputSize,
  InputVariant,
  NavigationActiveBehavior,
  NavigationCompactPolicy,
  NavigationContentMeta,
  NavigationLinkMeta,
  NavigationNode,
  NavigationNodeId,
  NavigationPresentation,
  NavigationSide,
  NavigationDestinationBadgeAnchor,
  NavigationDestinationBadgeOffset,
  NavigationDestinationBadgePlacement,
  NavigationDestinationDensity,
  NavigationDestinationIndicator,
  NavigationDestinationItemShape,
  NavigationDestinationLabelBehavior,
  NavigationSelectionContext,
  NavigationSelectionReason,
  NavigationSurfacePosition,
  NavigationSurfaceVariant,
  PopoverPlacement,
  RatioValue,
  RoutedAdaptiveScaffoldProps,
  SafeAreaEdges,
  ScaffoldProps,
  SelectSize,
  SelectVariant,
  SetViewportModeAction,
  TabScaffoldProps,
  TagColorScheme,
  TagVariant,
  TargetDialogRender,
  TargetDialogRenderProps,
  TextareaSize,
  TextareaVariant,
  UIThemeContextValue,
  UIElevation,
  UIShape,
  UISurfaceRole,
  UITone,
  UITypographyRole,
  ThemeDensityTokens,
  ThemeElevationTokens,
  ThemeSpacingTokens,
} from "zerina-ui";


type DemoNavigationMeta =
  NavigationLinkMeta & {
    analyticsId: string;
  };


describe(
  "public TypeScript surface",
  () => {
    it(
      "exposes the semantic types used by public contracts",
      () => {
        const navigationId:
          NavigationNodeId =
          "dashboard";

        const items:
          NavigationNode<DemoNavigationMeta>[] = [
            {
              id:
                navigationId,

              label:
                "Dashboard",

              meta: {
                href:
                  "/dashboard",

                analyticsId:
                  "dashboard",
              },
            },
          ];

        const adaptiveItems:
          AdaptiveScaffoldProps<DemoNavigationMeta>["items"] =
          items;

        const compactPolicy:
          NavigationCompactPolicy = {
            maxVisible: {
              bottom:
                5,

              rail:
                7,
            },
          };

        const adaptiveNavigation:
          AdaptiveScaffoldNavigation<DemoNavigationMeta> = {
            mobile: {
              presentation:
                "bottom",
            },

            tablet: {
              presentation:
                "rail",
            },

            desktop: {
              presentation:
                "sidebar",
            },

            compact:
              compactPolicy,
          };

        const tabletNavigationPlacement:
          AdaptiveScaffoldTabletNavigationPlacement =
          "bottom";


        const routedAdaptiveProps:
          RoutedAdaptiveScaffoldProps<DemoNavigationMeta> = {
            items,

            navigate:
              (
                _href,
                item,
              ) => {
                void item.meta?.analyticsId;
              },

            onItemChange:
              (item) => {
                void item.meta?.analyticsId;
              },
          };

        const destinationContract: {
          position: NavigationSurfacePosition;
          variant: NavigationSurfaceVariant;
          labelBehavior: NavigationDestinationLabelBehavior;
          indicator: NavigationDestinationIndicator;
          density: NavigationDestinationDensity;
          badgeAnchor: NavigationDestinationBadgeAnchor;
          badgePlacement: NavigationDestinationBadgePlacement;
          itemShape: NavigationDestinationItemShape;
          badgeOffset: NavigationDestinationBadgeOffset;
          selectionReason: NavigationSelectionReason;
          selectionContext: NavigationSelectionContext;
        } = {
          position: "static",
          variant: "surface",
          labelBehavior: "always",
          indicator: "background",
          density: "comfortable",
          badgeAnchor: "icon",
          badgePlacement: "top-end",
          itemShape: "rounded",
          badgeOffset: {},
          selectionReason: "change",
          selectionContext: {
            value: "dashboard",
            previousValue: null,
            reason: "change",
          },
        };

        expect(
          destinationContract.selectionContext.value,
        ).toBe(
          "dashboard",
        );

        const content:
          NavigationContentMeta = {};

        const navigationActiveBehavior:
          NavigationActiveBehavior =
          "contains";

        const navigationPresentation:
          NavigationPresentation =
          "bottom";

        const navigationSide:
          NavigationSide =
          "end";

        const targetDialogRender:
          TargetDialogRender<{
            id: string;
          }> =
          (target) =>
            target.id;

        const targetDialogRenderProps:
          TargetDialogRenderProps<{
            id: string;
          }> = {
            renderDescription:
              targetDialogRender,

            renderBody:
              targetDialogRender,
          };

        const theme:
          CreateThemeDefinitionInput = {
            name:
              "consumer-theme",

            source:
              "custom",
          };

        const tone:
          UITone =
          "info";

        const surfaceRole:
          UISurfaceRole =
          "container";

        const elevation:
          UIElevation =
          3;

        const shape:
          UIShape =
          "lg";

        const typographyRole:
          UITypographyRole =
          "headline";

        const headingTypographyRole:
          HeadingTypographyRole =
          "display";

        const elevationTokens:
          ThemeElevationTokens = {
            level3:
              "0 12px 32px rgba(0,0,0,0.2)",
          };

        const spacingTokens:
          ThemeSpacingTokens = {
            md:
              "0.75rem",
          };

        const densityTokens:
          ThemeDensityTokens = {
            comfortable: {
              itemMinHeight:
                "3rem",
            },
          };

        const setViewportMode:
          SetViewportModeAction =
          (previousMode) =>
            previousMode;

        const setTheme:
          UIThemeContextValue["setTheme"] =
          () => undefined;

        const inputSize:
          InputSize =
          "md";

        const inputVariant:
          InputVariant =
          "outline";

        const selectSize:
          SelectSize =
          "md";

        const selectVariant:
          SelectVariant =
          "outline";

        const textareaSize:
          TextareaSize =
          "md";

        const textareaVariant:
          TextareaVariant =
          "outline";

        const dialogSize:
          DialogSize =
          "md";

        const popoverPlacement:
          PopoverPlacement =
          "bottom-start";

        const floatingPlacement:
          FloatingPlacement =
          "bottom-start";

        const screenSafeArea:
          SafeAreaEdges = {
            top:
              true,
          };

        const scaffoldProps:
          ScaffoldProps = {
            viewport:
              "contained",

            safeArea:
              screenSafeArea,
          };

        const tabScaffoldProps:
          TabScaffoldProps = {
            tabs:
              [],

            screens:
              [],

            viewport:
              "contained",

            safeArea:
              true,
          };

        const containerSize:
          ContainerSize =
          "lg";

        const avatarSize:
          AvatarSize =
          "md";

        const ratio:
          RatioValue =
          "16/9";

        const badgeVariant:
          BadgeVariant =
          "subtle";

        const badgeColorScheme:
          BadgeColorScheme =
          "primary";

        const tagVariant:
          TagVariant =
          "outline";

        const tagColorScheme:
          TagColorScheme =
          "neutral";

        expect(
          adaptiveItems[0]?.id,
        ).toBe(
          "dashboard",
        );

        expect(
          adaptiveNavigation
            .mobile
            ?.presentation,
        ).toBe(
          "bottom",
        );

        expect(
          compactPolicy
            .maxVisible
            ?.rail,
        ).toBe(
          7,
        );

        expect(
          tabletNavigationPlacement,
        ).toBe(
          "bottom",
        );


        expect(
          routedAdaptiveProps
            .items[0]
            ?.meta
            ?.analyticsId,
        ).toBe(
          "dashboard",
        );

        expect([
          navigationActiveBehavior,
          navigationPresentation,
          navigationSide,
        ]).toEqual([
          "contains",
          "bottom",
          "end",
        ]);

        expect(
          content,
        ).toEqual(
          {},
        );

        expect(
          targetDialogRenderProps
            .renderBody?.({
              id:
                "dialog-target",
            }),
        ).toBe(
          "dialog-target",
        );

        expect(
          theme.source,
        ).toBe(
          "custom",
        );

        expect([
          tone,
          surfaceRole,
          elevation,
          shape,
          typographyRole,
          headingTypographyRole,
          elevationTokens.level3,
          spacingTokens.md,
          densityTokens
            .comfortable
            ?.itemMinHeight,
        ]).toEqual([
          "info",
          "container",
          3,
          "lg",
          "headline",
          "display",
          "0 12px 32px rgba(0,0,0,0.2)",
          "0.75rem",
          "3rem",
        ]);

        expect(
          setViewportMode(
            "desktop",
          ),
        ).toBe(
          "desktop",
        );

        setTheme(
          "light",
        );

        expect([
          inputSize,
          inputVariant,
          selectSize,
          selectVariant,
          textareaSize,
          textareaVariant,
          dialogSize,
          popoverPlacement,
          floatingPlacement,
          screenSafeArea.top,
          scaffoldProps.viewport,
          tabScaffoldProps.viewport,
          containerSize,
          avatarSize,
          ratio,
          badgeVariant,
          badgeColorScheme,
          tagVariant,
          tagColorScheme,
        ]).toEqual([
          "md",
          "outline",
          "md",
          "outline",
          "md",
          "outline",
          "md",
          "bottom-start",
          "bottom-start",
          true,
          "contained",
          "contained",
          "lg",
          "md",
          "16/9",
          "subtle",
          "primary",
          "outline",
          "neutral",
        ]);
      },
    );
  },
);
