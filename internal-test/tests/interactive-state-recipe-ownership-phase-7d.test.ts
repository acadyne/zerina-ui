import {
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";


function source(
  relative:
    string,
): string {
  return readFileSync(
    resolve(
      process.cwd(),
      "..",
      "src",
      relative,
    ),
    "utf8",
  );
}


function cssSources(
  directory:
    string,
): Array<{
  path: string;
  content: string;
}> {
  const absolute =
    resolve(
      process.cwd(),
      "..",
      "src",
      directory,
    );

  const result:
    Array<{
      path: string;
      content: string;
    }> = [];

  for (
    const entry of
    readdirSync(
      absolute,
    )
  ) {
    const path =
      resolve(
        absolute,
        entry,
      );

    if (
      statSync(
        path,
      ).isDirectory()
    ) {
      result.push(
        ...cssSources(
          `${directory}/${entry}`,
        ),
      );

      continue;
    }

    if (
      entry.endsWith(
        ".css",
      )
    ) {
      result.push({
        path,
        content:
          readFileSync(
            path,
            "utf8",
          ),
      });
    }
  }

  return result;
}


describe(
  "Phase 7D interactive visual ownership",
  () => {
    const recipe =
      source(
        "theme/recipes/interactive-state-recipe.ts",
      );

    const css =
      source(
        "theme/recipes/interactive-state.css",
      );


    it(
      "keeps state-layer strengths in one semantic owner",
      () => {
        expect(
          recipe,
        ).toContain(
          "STATE_LAYER_STRENGTH",
        );

        expect(
          recipe.match(
            /STATE_LAYER_STRENGTH/g,
          )?.length,
        ).toBeGreaterThan(
          1,
        );

        for (
          const component of [
            "primitives/forms/action-control-recipe.ts",
            "primitives/overlay/menu/MenuItem.tsx",
            "primitives/layout/List.tsx",
            "patterns/scaffold/FloatingActionButton.tsx",
            "components/display/Card.tsx",
            "components/display/Tag.tsx",
            "components/feedback/Toast.tsx",
            "patterns/command/CommandPalette.tsx",
            "primitives/navigation/NavigationList.tsx",
            "primitives/navigation/shared/NavigationDestinationItem.tsx",
          ]
        ) {
          const content =
            source(
              component,
            );

          expect(
            content,
          ).toContain(
            "interactiveStateRecipe",
          );

          expect(
            content,
          ).not.toMatch(
            /color-mix\([^)]*(?:8|10|14)%/,
          );
        }
      },
    );


    it(
      "owns generic visual state selectors outside component family stylesheets",
      () => {
        for (
          const state of [
            "data-hovered",
            "data-focus-visible",
            "data-pressed",
            "data-selected",
            "data-disabled",
          ]
        ) {
          expect(
            css,
          ).toContain(
            state,
          );
        }


        const localStyles = [
          source(
            "primitives/overlay/menu/menu.css",
          ),
          source(
            "primitives/layout/list.css",
          ),
          source(
            "components/display/display.css",
          ),
          source(
            "components/feedback/toast.css",
          ),
          source(
            "patterns/command/commandPalette.css",
          ),
        ].join(
          "\n",
        );


        expect(
          localStyles,
        ).not.toContain(
          "data-hovered",
        );

        expect(
          localStyles,
        ).not.toContain(
          "data-pressed",
        );

        expect(
          localStyles,
        ).not.toContain(
          "data-focus-visible",
        );
      },
    );


    it(
      "keeps every direct usePress visual consumer on the shared recipe",
      () => {
        const consumers = [
          "components/display/Card.tsx",
          "components/display/Tag.tsx",
          "components/feedback/Toast.tsx",
          "patterns/command/CommandPalette.tsx",
          "patterns/scaffold/FloatingActionButton.tsx",
          "primitives/forms/ControlAction.tsx",
          "primitives/overlay/menu/MenuItem.tsx",
        ];

        for (const consumer of consumers) {
          expect(
            source(consumer),
          ).toContain(
            "interactiveStateRecipe",
          );
        }

        expect(
          source(
            "primitives/forms/action-control-recipe.ts",
          ),
        ).toContain(
          "interactiveStateRecipe",
        );
      },
    );


    it(
      "keeps hover and pressed state selectors under the shared CSS owner",
      () => {
        const duplicates =
          cssSources(
            ".",
          )
            .filter(
              ({
                path,
              }) =>
                !path.endsWith(
                  "theme/recipes/interactive-state.css",
                ),
            )
            .filter(
              ({
                content,
              }) =>
                content.includes(
                  "data-hovered",
                ) ||
                content.includes(
                  "data-pressed",
                ),
            )
            .map(
              ({
                path,
              }) =>
                path,
            );

        expect(
          duplicates,
        ).toEqual(
          [],
        );
      },
    );


    it(
      "keeps List background ownership static-only so interactive state layers can project",
      () => {
        const listCss =
          source(
            "primitives/layout/list.css",
          );

        expect(
          listCss,
        ).toContain(
          "[data-ui-list-item]:not([data-interactive])",
        );

        expect(
          listCss,
        ).not.toMatch(
          /\[data-ui-list-item\]\s*\{[^}]*\bbackground\s*:/,
        );
      },
    );


    it(
      "does not reopen interaction mechanics or providers",
      () => {
        expect(
          recipe,
        ).not.toMatch(
          /\busePress\b|\buseState\b|\buseEffect\b|\bProvider\b/,
        );

        expect(
          css,
        ).not.toContain(
          "!important",
        );
      },
    );
  },
);
