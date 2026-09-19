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
  BottomNavigationBadgeAnchor,
  BottomNavigationBadgeOffset,
  BottomNavigationBadgePlacement,
  BottomNavigationDensity,
  BottomNavigationIndicator,
  BottomNavigationItemShape,
  BottomNavigationLabelBehavior,
  BottomNavigationPosition,
  BottomNavigationSelectionContext,
  BottomNavigationSelectionReason,
  BottomNavigationVariant,
  ChoiceControlColorScheme,
  ChoiceControlSize,
  DrawerPlacement,
  ListDensity,
  NavigationRailBadgeAnchor,
  NavigationRailBadgeOffset,
  NavigationRailBadgePlacement,
  NavigationRailDensity,
  NavigationRailIndicator,
  NavigationRailItemShape,
  NavigationRailLabelBehavior,
  NavigationRailPosition,
  NavigationRailSelectionContext,
  NavigationRailSelectionReason,
  NavigationRailVariant,
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
      "keeps BottomNavigation and NavigationRail shared destination domains equal",
      () => {
        expectTypeOf<
          BottomNavigationPosition
        >().toEqualTypeOf<
          NavigationRailPosition
        >();

        expectTypeOf<
          BottomNavigationVariant
        >().toEqualTypeOf<
          NavigationRailVariant
        >();

        expectTypeOf<
          BottomNavigationLabelBehavior
        >().toEqualTypeOf<
          NavigationRailLabelBehavior
        >();

        expectTypeOf<
          BottomNavigationIndicator
        >().toEqualTypeOf<
          NavigationRailIndicator
        >();

        expectTypeOf<
          BottomNavigationDensity
        >().toEqualTypeOf<
          NavigationRailDensity
        >();

        expectTypeOf<
          BottomNavigationBadgeAnchor
        >().toEqualTypeOf<
          NavigationRailBadgeAnchor
        >();

        expectTypeOf<
          BottomNavigationBadgePlacement
        >().toEqualTypeOf<
          NavigationRailBadgePlacement
        >();

        expectTypeOf<
          BottomNavigationItemShape
        >().toEqualTypeOf<
          NavigationRailItemShape
        >();

        expectTypeOf<
          BottomNavigationBadgeOffset
        >().toEqualTypeOf<
          NavigationRailBadgeOffset
        >();

        expectTypeOf<
          BottomNavigationSelectionReason
        >().toEqualTypeOf<
          NavigationRailSelectionReason
        >();

        expectTypeOf<
          BottomNavigationSelectionContext
        >().toEqualTypeOf<
          NavigationRailSelectionContext
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
