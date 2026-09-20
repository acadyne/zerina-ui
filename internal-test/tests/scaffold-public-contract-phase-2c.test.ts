// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AdaptiveScaffoldProps,
  ScaffoldProps,
  TabScaffoldProps,
} from "zerina-ui";

describe(
  "Phase 2C public scaffold contracts",
  () => {
    it(
      "exposes one direct root contract and rejects retired ownership channels",
      () => {
        const scaffold:
          ScaffoldProps = {
            viewport:
              "contained",

            safeArea: {
              top:
                true,
            },

            topInset:
              8,

            id:
              "shell",
          };

        const adaptive:
          AdaptiveScaffoldProps = {
            items:
              [],

            viewport:
              "contained",

            safeArea:
              true,

            sidebarWidth:
              320,
          };

        const tabs:
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

        const retiredScaffoldScroll:
          ScaffoldProps = {
            // @ts-expect-error Scaffold no longer owns content scroll.
            scrollable:
              true,
          };

        const retiredScreenProps:
          ScaffoldProps = {
            // @ts-expect-error Screen root props are direct; screenProps was removed.
            screenProps: {
              safeArea:
                true,
            },
          };

        const retiredAdaptiveScaffoldProps:
          AdaptiveScaffoldProps = {
            items:
              [],

            // @ts-expect-error AdaptiveScaffold no longer has a parallel scaffoldProps channel.
            scaffoldProps: {
              safeArea:
                true,
            },
          };

        const retiredNavigationWidth:
          AdaptiveScaffoldProps = {
            items:
              [],

            // @ts-expect-error navigationWidth was split; sidebar width has one explicit owner.
            navigationWidth:
              320,
          };

        expect(
          scaffold.id
        ).toBe(
          "shell"
        );

        expect(
          adaptive.sidebarWidth
        ).toBe(
          320
        );

        expect(
          tabs.safeArea
        ).toBe(
          true
        );

        void retiredScaffoldScroll;
        void retiredScreenProps;
        void retiredAdaptiveScaffoldProps;
        void retiredNavigationWidth;
      }
    );
  }
);
