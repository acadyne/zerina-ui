// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AdaptiveScaffoldProps,
  AvatarSize,
  BadgeColorScheme,
  BadgeVariant,
  ContainerSize,
  CreateThemeDefinitionInput,
  DialogSize,
  FloatingPlacement,
  InputSize,
  InputVariant,
  NavigationContentMeta,
  NavigationLinkMeta,
  NavigationNode,
  NavigationNodeId,
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
  SafeAreaEdges,
  SelectSize,
  SelectVariant,
  SetViewportModeAction,
  TagColorScheme,
  TagVariant,
  TextareaSize,
  TextareaVariant,
  UIThemeContextValue,
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

        const theme:
          CreateThemeDefinitionInput = {
            name:
              "consumer-theme",

            source:
              "custom",
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
          content,
        ).toEqual(
          {},
        );

        expect(
          theme.source,
        ).toBe(
          "custom",
        );

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
