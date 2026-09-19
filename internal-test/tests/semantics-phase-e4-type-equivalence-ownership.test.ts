// @vitest-environment node

import {
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";


const SRC =
  resolve(
    process.cwd(),
    "..",
    "src",
  );


function readSource(
  relativePath:
    string,
): string {
  return readFileSync(
    resolve(
      SRC,
      relativePath,
    ),
    "utf8",
  );
}


describe(
  "Phase E4 type-equivalence ownership",
  () => {
    it(
      "centralizes form control size and color-scheme domains",
      () => {
        const owner =
          readSource(
            "primitives/forms/shared-control-types.ts",
          );

        const action =
          readSource(
            "primitives/forms/action-control-types.ts",
          );

        const choice =
          readSource(
            "primitives/forms/choice-control-types.ts",
          );

        const text =
          readSource(
            "primitives/forms/control-types.ts",
          );


        expect(
          owner,
        ).toContain(
          "export type ControlSize",
        );

        expect(
          owner,
        ).toContain(
          "export type ControlColorScheme",
        );


        expect(
          action,
        ).toContain(
          "ActionControlSize =\n  ControlSize",
        );

        expect(
          choice,
        ).toContain(
          "ChoiceControlSize =\n  ControlSize",
        );

        expect(
          text,
        ).toContain(
          "TextControlSize =\n  ControlSize",
        );


        expect(
          action,
        ).toContain(
          "ActionControlColorScheme =\n  ControlColorScheme",
        );

        expect(
          choice,
        ).toContain(
          "ChoiceControlColorScheme =\n  ControlColorScheme",
        );
      },
    );


    it(
      "centralizes shared BottomNavigation and NavigationRail destination domains",
      () => {
        const owner =
          readSource(
            "primitives/navigation/shared/navigation-shared.types.ts",
          );

        const bottom =
          readSource(
            "primitives/navigation/bottom-navigation/bottomNavigation.types.ts",
          );

        const rail =
          readSource(
            "primitives/navigation/navigation-rail/navigationRail.types.ts",
          );

        const destination =
          readSource(
            "primitives/navigation/shared/NavigationDestinationItem.tsx",
          );


        for (
          const semantic of [
            "NavigationSurfacePosition",
            "NavigationSurfaceVariant",
            "NavigationDestinationLabelBehavior",
            "NavigationDestinationIndicator",
            "NavigationDestinationDensity",
            "NavigationDestinationBadgeAnchor",
            "NavigationDestinationBadgePlacement",
            "NavigationDestinationItemShape",
            "NavigationDestinationBadgeOffset",
          ]
        ) {
          expect(
            owner,
          ).toContain(
            semantic,
          );
        }


        expect(
          bottom,
        ).toContain(
          "NavigationSurfacePosition",
        );

        expect(
          rail,
        ).toContain(
          "NavigationSurfacePosition",
        );

        expect(
          bottom,
        ).toContain(
          "NavigationSelectionReason",
        );

        expect(
          rail,
        ).toContain(
          "NavigationSelectionReason",
        );


        expect(
          destination,
        ).toContain(
          'from "./navigation-shared.types"',
        );

        expect(
          destination,
        ).not.toMatch(
          /export type NavigationDestination(?:BadgeAnchor|LabelBehavior|Indicator)\s*=/,
        );
      },
    );


    it(
      "aliases component domains to their semantic owners without renaming public types",
      () => {
        const popover =
          readSource(
            "primitives/overlay/Popover.tsx",
          );

        const drawer =
          readSource(
            "primitives/overlay/Drawer.tsx",
          );

        const stack =
          readSource(
            "patterns/navigation-stack/navigationStack.types.ts",
          );

        const list =
          readSource(
            "primitives/layout/List.tsx",
          );

        const alert =
          readSource(
            "components/feedback/Alert.tsx",
          );

        const toast =
          readSource(
            "components/feedback/Toast.tsx",
          );

        const badge =
          readSource(
            "components/display/Badge.tsx",
          );


        expect(
          popover,
        ).toContain(
          "PopoverPlacement =\n  FloatingPlacement",
        );

        expect(
          drawer,
        ).toContain(
          "DrawerPlacement =\n  UIOverlayPlacement",
        );

        expect(
          stack,
        ).toContain(
          "NavigationStackTransitionDirection =\n  UIMotionTransitionDirection",
        );

        expect(
          list,
        ).toContain(
          "ListDensity =\n  UIDensity",
        );

        expect(
          alert,
        ).toContain(
          "AlertVariant =\n  FeedbackVariant",
        );

        expect(
          toast,
        ).toContain(
          "ToastVariant =\n  FeedbackVariant",
        );

        expect(
          badge,
        ).toContain(
          "BadgeSlot =\n  StatusLabelRecipeSlot",
        );
      },
    );


    it(
      "keeps semantic owners internal",
      () => {
        const rootIndex =
          readSource(
            "index.ts",
          );

        const formsIndex =
          readSource(
            "primitives/forms/index.ts",
          );

        const feedbackIndex =
          readSource(
            "components/feedback/index.ts",
          );

        const navigationIndex =
          readSource(
            "primitives/navigation/index.ts",
          );


        for (
          const internalName of [
            "ControlSize",
            "ControlColorScheme",
            "FeedbackVariant",
            "NavigationSurfacePosition",
            "NavigationSurfaceVariant",
          ]
        ) {
          expect(
            rootIndex,
          ).not.toContain(
            internalName,
          );
        }


        expect(
          formsIndex,
        ).not.toContain(
          "shared-control-types",
        );

        expect(
          feedbackIndex,
        ).not.toContain(
          "feedback.types",
        );

        expect(
          navigationIndex,
        ).not.toContain(
          "navigation-shared.types",
        );
      },
    );


    it(
      "does not create generic owners for merely coincident domains",
      () => {
        const command =
          readSource(
            "patterns/command/CommandPalette.tsx",
          );

        const progress =
          readSource(
            "components/feedback/Progress.tsx",
          );

        const rail =
          readSource(
            "primitives/navigation/navigation-rail/navigationRail.types.ts",
          );

        const pressable =
          readSource(
            "primitives/forms/Pressable.tsx",
          );


        expect(
          command,
        ).toContain(
          'CommandTriggerSize',
        );

        expect(
          progress,
        ).toContain(
          'ProgressSize',
        );

        expect(
          rail,
        ).toContain(
          'NavigationRailPlacement',
        );

        expect(
          pressable,
        ).toContain(
          'PressableElement',
        );
      },
    );
  },
);
