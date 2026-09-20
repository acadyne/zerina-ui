// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AdaptiveScaffoldNavigation,
  AdaptiveScaffoldProps,
  NavigationCompactPolicy,
  NavigationPresenterProps,
} from "zerina-ui";


describe(
  "Phase 3 public navigation contracts",
  () => {
    it(
      "exposes one responsive navigation contract and rejects retired parallel channels",
      () => {
        const compact:
          NavigationCompactPolicy = {
            maxVisible: {
              bottom:
                5,

              rail:
                7,
            },

            overflowAriaLabel:
              "More destinations",
          };

        const navigation:
          AdaptiveScaffoldNavigation = {
            mobile: {
              presentation:
                "bottom",
            },

            tablet: {
              presentation:
                "rail",

              placement:
                "end",
            },

            desktop: {
              presentation:
                "sidebar",
            },

            compact,
          };

        const presenter:
          NavigationPresenterProps = {
            items:
              [],

            presentation:
              "bottom",

            compactPolicy:
              compact,
          };

        const adaptive:
          AdaptiveScaffoldProps = {
            items:
              [],

            navigation,
          };

        const retiredMobile:
          AdaptiveScaffoldProps = {
            items:
              [],

            // @ts-expect-error mobileNavigation was replaced by the single navigation contract.
            mobileNavigation:
              "bottom",
          };

        const retiredSlots:
          AdaptiveScaffoldProps = {
            items:
              [],

            // @ts-expect-error navigationSlots was merged into navigation.
            navigationSlots: {
              mobile: {
                content:
                  null,
              },
            },
          };

        const retiredRailProps:
          AdaptiveScaffoldProps = {
            items:
              [],

            // @ts-expect-error navigationRailProps moved under navigation.rail.
            navigationRailProps: {
              width:
                88,
            },
          };

        expect(
          adaptive.navigation
            ?.tablet
            ?.placement,
        ).toBe(
          "end",
        );

        expect(
          presenter.presentation,
        ).toBe(
          "bottom",
        );

        void retiredMobile;
        void retiredSlots;
        void retiredRailProps;
      },
    );
  },
);
