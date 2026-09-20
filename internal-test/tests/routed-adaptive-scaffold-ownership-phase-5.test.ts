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


function readSource(
  relative:
    string,
): string {
  return readFileSync(
    resolve(
      process.cwd(),
      "..",
      relative,
    ),
    "utf8",
  );
}


describe(
  "Phase 5 RoutedAdaptiveScaffold ownership",
  () => {
    it(
      "keeps one generic metadata parameter from routed props into AdaptiveScaffold",
      () => {
        const types =
          readSource(
            "src/patterns/scaffold/adaptive-scaffold/routedAdaptiveScaffold.types.ts",
          );

        const component =
          readSource(
            "src/patterns/scaffold/adaptive-scaffold/RoutedAdaptiveScaffold.tsx",
          );

        expect(
          types,
        ).toContain(
          "TMeta extends NavigationLinkMeta",
        );

        expect(
          types,
        ).toContain(
          "AdaptiveScaffoldProps<TMeta>",
        );

        expect(
          types,
        ).toContain(
          "NavigationNode<TMeta>[]",
        );

        expect(
          component,
        ).toContain(
          "<AdaptiveScaffold<TMeta>",
        );

        expect(
          component,
        ).toContain(
          "RoutedAdaptiveScaffoldProps<TMeta>",
        );
      },
    );

    it(
      "does not re-find or rebuild an item that AdaptiveScaffold already selected",
      () => {
        const component =
          readSource(
            "src/patterns/scaffold/adaptive-scaffold/RoutedAdaptiveScaffold.tsx",
          );

        expect(
          component,
        ).not.toContain(
          "findNavigationNode",
        );

        expect(
          component,
        ).not.toContain(
          "getNavigationNodeEntries",
        );

        expect(
          component,
        ).toContain(
          "item.meta?.href",
        );

        expect(
          component,
        ).toContain(
          "onItemChange?.",
        );

        expect(
          component,
        ).toContain(
          "navigate?.",
        );
      },
    );

    it(
      "keeps the generic forwardRef surface instead of collapsing to NavigationLinkMeta",
      () => {
        const component =
          readSource(
            "src/patterns/scaffold/adaptive-scaffold/RoutedAdaptiveScaffold.tsx",
          );

        expect(
          component,
        ).toContain(
          "type RoutedAdaptiveScaffoldComponent",
        );

        expect(
          component,
        ).toContain(
          "React.RefAttributes<HTMLDivElement>",
        );

        expect(
          component,
        ).toContain(
          "React.forwardRef(",
        );
      },
    );
  },
);
