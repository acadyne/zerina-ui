// @vitest-environment node

import {
  existsSync,
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
  relativePath: string,
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
  "Phase 2B navigation destination ownership",
  () => {
    it(
      "uses one context factory and one shared destination context contract",
      () => {
        const shared =
          readSource(
            "primitives/navigation/shared/navigationDestinationContext.tsx",
          );

        const bottom =
          readSource(
            "primitives/navigation/bottom-navigation/BottomNavigationContext.tsx",
          );

        const rail =
          readSource(
            "primitives/navigation/navigation-rail/NavigationRailContext.tsx",
          );

        expect(
          shared,
        ).toContain(
          "createNavigationDestinationContext",
        );

        expect(
          shared,
        ).toContain(
          "NavigationDestinationContextValue",
        );

        for (
          const consumer of [
            bottom,
            rail,
          ]
        ) {
          expect(
            consumer,
          ).toContain(
            "createNavigationDestinationContext",
          );

          expect(
            consumer,
          ).toContain(
            "NavigationDestinationContextValue",
          );

          expect(
            consumer,
          ).not.toContain(
            "React.createContext",
          );

          expect(
            consumer,
          ).not.toContain(
            "React.useContext",
          );
        }
      },
    );

    it(
      "resolves shared item state and styling in one place",
      () => {
        const stateOwner =
          readSource(
            "primitives/navigation/shared/navigationDestinationState.ts",
          );

        const styleOwner =
          readSource(
            "primitives/navigation/shared/navigationDestination.styles.ts",
          );

        const factory =
          readSource(
            "primitives/navigation/shared/createNavigationDestinationItem.tsx",
          );

        const bottom =
          readSource(
            "primitives/navigation/bottom-navigation/BottomNavigationItem.tsx",
          );

        const rail =
          readSource(
            "primitives/navigation/navigation-rail/NavigationRailItem.tsx",
          );

        expect(
          stateOwner,
        ).toContain(
          "resolveNavigationDestinationItem",
        );

        expect(
          factory,
        ).toContain(
          "resolveNavigationDestinationItem",
        );

        expect(
          factory,
        ).toContain(
          "createNavigationDestinationDataAttributes",
        );

        expect(
          factory,
        ).toContain(
          "NAVIGATION_DESTINATION_VISUALLY_HIDDEN_STYLE",
        );

        expect(
          factory,
        ).toContain(
          "React.PropsWithoutRef<TProps>",
        );

        expect(
          factory,
        ).not.toContain(
          "props as TProps",
        );

        for (
          const consumer of [
            bottom,
            rail,
          ]
        ) {
          expect(
            consumer,
          ).toContain(
            "createNavigationDestinationItem",
          );

          expect(
            consumer,
          ).not.toContain(
            "resolveNavigationDestinationItem",
          );

          expect(
            consumer,
          ).not.toContain(
            "<NavigationDestinationItem",
          );
        }

        for (
          const semantic of [
            "NAVIGATION_DESTINATION_ITEM_BASE_STYLES",
            "createNavigationDestinationDensityVariants",
            "resolveNavigationDestinationItemStyles",
            "getNavigationDestinationBadgePlacementStyles",
            "getNavigationDestinationItemBorderRadius",
          ]
        ) {
          expect(
            styleOwner,
          ).toContain(
            semantic,
          );
        }
      },
    );

    it(
      "removes family-local duplicate utilities",
      () => {
        expect(
          existsSync(
            resolve(
              SRC,
              "primitives/navigation/bottom-navigation/bottomNavigation.utils.ts",
            ),
          ),
        ).toBe(
          false,
        );

        expect(
          existsSync(
            resolve(
              SRC,
              "primitives/navigation/navigation-rail/navigationRail.utils.ts",
            ),
          ),
        ).toBe(
          false,
        );

        const bottomStyles =
          readSource(
            "primitives/navigation/bottom-navigation/bottomNavigation.styles.ts",
          );

        const railStyles =
          readSource(
            "primitives/navigation/navigation-rail/navigationRail.styles.ts",
          );

        for (
          const familyStyles of [
            bottomStyles,
            railStyles,
          ]
        ) {
          expect(
            familyStyles,
          ).toContain(
            "NAVIGATION_DESTINATION_ITEM_BASE_STYLES",
          );

          expect(
            familyStyles,
          ).toContain(
            "createNavigationDestinationDensityVariants",
          );

          expect(
            familyStyles,
          ).not.toContain(
            "function getItemBorderRadius",
          );

          expect(
            familyStyles,
          ).not.toContain(
            "function getOffsetTransform",
          );

          expect(
            familyStyles,
          ).not.toContain(
            "function getRootSurfaceStyles",
          );

          expect(
            familyStyles,
          ).not.toContain(
            "function getListSurfaceStyles",
          );

          expect(
            familyStyles,
          ).toContain(
            "getNavigationSurfaceStyles",
          );

          expect(
            familyStyles,
          ).toContain(
            "getNavigationFloatingSurfaceStyles",
          );
        }
      },
    );

    it(
      "keeps one public type vocabulary for shared destination concepts",
      () => {
        const bottom =
          readSource(
            "primitives/navigation/bottom-navigation/bottomNavigation.types.ts",
          );

        const rail =
          readSource(
            "primitives/navigation/navigation-rail/navigationRail.types.ts",
          );

        const navigationIndex =
          readSource(
            "primitives/navigation/index.ts",
          );

        expect(
          bottom,
        ).toContain(
          "NavigationDestinationRootProps",
        );

        expect(
          bottom,
        ).toContain(
          "NavigationDestinationPublicItemProps",
        );

        expect(
          rail,
        ).toContain(
          "NavigationDestinationRootProps",
        );

        expect(
          rail,
        ).toContain(
          "NavigationDestinationPublicItemProps",
        );


        for (
          const sharedType of [
            "NavigationSurfacePosition",
            "NavigationSurfaceVariant",
            "NavigationDestinationLabelBehavior",
            "NavigationDestinationIndicator",
            "NavigationDestinationDensity",
            "NavigationDestinationBadgeAnchor",
            "NavigationDestinationBadgePlacement",
            "NavigationDestinationBadgeOffset",
            "NavigationDestinationItemShape",
            "NavigationSelectionContext",
            "NavigationSelectionReason",
          ]
        ) {
          expect(
            navigationIndex,
          ).toContain(
            sharedType,
          );
        }

        for (
          const duplicateAlias of [
            "BottomNavigationPosition",
            "BottomNavigationVariant",
            "BottomNavigationLabelBehavior",
            "BottomNavigationIndicator",
            "BottomNavigationDensity",
            "BottomNavigationBadgeAnchor",
            "BottomNavigationBadgePlacement",
            "BottomNavigationBadgeOffset",
            "BottomNavigationItemShape",
            "BottomNavigationSelectionContext",
            "BottomNavigationSelectionReason",
            "NavigationRailPosition",
            "NavigationRailVariant",
            "NavigationRailLabelBehavior",
            "NavigationRailIndicator",
            "NavigationRailDensity",
            "NavigationRailBadgeAnchor",
            "NavigationRailBadgePlacement",
            "NavigationRailBadgeOffset",
            "NavigationRailItemShape",
            "NavigationRailSelectionContext",
            "NavigationRailSelectionReason",
          ]
        ) {
          expect(
            bottom + rail,
          ).not.toContain(
            `export type ${duplicateAlias}`,
          );

          expect(
            bottom + rail,
          ).not.toContain(
            `export interface ${duplicateAlias}`,
          );
        }
      },
    );
  },
);
