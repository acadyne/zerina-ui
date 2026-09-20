// @vitest-environment node

import {
  describe,
  expectTypeOf,
  it,
} from "vitest";

import type {
  ActionControlColorScheme,
  ActionControlSize,
  AlertVariant,
  BadgeSlot,
  ChoiceControlColorScheme,
  ChoiceControlSize,
  DrawerPlacement,
  ListDensity,
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
  NavigationStackTransitionDirection,
  PopoverContentProps,
  ToastVariant,
  UIDensity,
  UIMotionTransitionDirection,
} from "zerina-ui";

import type {
  FloatingPlacement,
} from "../../src/core/overlay/FloatingLayer";

import type {
  UIOverlayPlacement,
} from "../../src/core/motion/motion.overlay";

import type {
  StatusLabelRecipeSlot,
} from "../../src/components/display/status-label-recipe";

import type {
  TextControlSize,
} from "../../src/primitives/forms/control-types";


describe(
  "Phase E4 structural type equivalence",
  () => {
    it(
      "keeps form control domains equal where they represent the same concept",
      () => {
        expectTypeOf<
          ActionControlSize
        >().toEqualTypeOf<
          ChoiceControlSize
        >();

        expectTypeOf<
          ActionControlSize
        >().toEqualTypeOf<
          TextControlSize
        >();

        expectTypeOf<
          ActionControlColorScheme
        >().toEqualTypeOf<
          ChoiceControlColorScheme
        >();
      },
    );


    it(
      "uses one public vocabulary for shared navigation destination domains",
      () => {
        type DestinationContract = {
          position:
            NavigationSurfacePosition;

          variant:
            NavigationSurfaceVariant;

          labelBehavior:
            NavigationDestinationLabelBehavior;

          indicator:
            NavigationDestinationIndicator;

          density:
            NavigationDestinationDensity;

          badgeAnchor:
            NavigationDestinationBadgeAnchor;

          badgePlacement:
            NavigationDestinationBadgePlacement;

          itemShape:
            NavigationDestinationItemShape;

          badgeOffset:
            NavigationDestinationBadgeOffset;

          selectionReason:
            NavigationSelectionReason;

          selectionContext:
            NavigationSelectionContext;
        };

        expectTypeOf<
          DestinationContract
        >().toMatchTypeOf<
          DestinationContract
        >();
      },
    );


    it(
      "ties overlay placement aliases to the runtime concepts they actually consume",
      () => {
        expectTypeOf<
          NonNullable<
            PopoverContentProps[
              "placement"
            ]
          >
        >().toEqualTypeOf<
          FloatingPlacement
        >();

        expectTypeOf<
          DrawerPlacement
        >().toEqualTypeOf<
          UIOverlayPlacement
        >();
      },
    );


    it(
      "ties navigation motion, UI density and feedback domains to their semantic owners",
      () => {
        expectTypeOf<
          NavigationStackTransitionDirection
        >().toEqualTypeOf<
          UIMotionTransitionDirection
        >();

        expectTypeOf<
          ListDensity
        >().toEqualTypeOf<
          UIDensity
        >();

        expectTypeOf<
          NavigationDestinationDensity
        >().toEqualTypeOf<
          UIDensity
        >();

        expectTypeOf<
          AlertVariant
        >().toEqualTypeOf<
          ToastVariant
        >();

        expectTypeOf<
          BadgeSlot
        >().toEqualTypeOf<
          StatusLabelRecipeSlot
        >();
      },
    );
  },
);
