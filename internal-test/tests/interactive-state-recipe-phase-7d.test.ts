import {
  describe,
  expect,
  it,
} from "vitest";

import {
  interactiveStateRecipe,
} from "zerina-ui";


describe(
  "Phase 7D interactive state recipe",
  () => {
    it(
      "projects one semantic state vocabulary for solid controls",
      () => {
        const recipe =
          interactiveStateRecipe({
            tone:
              "primary",

            emphasis:
              "solid",

            elevation:
              2,

            hoverElevation:
              3,

            pressedElevation:
              1,
          });


        expect(
          recipe[
            "--ui-interactive-background"
          ],
        ).toBe(
          "var(--ui-primary)",
        );

        expect(
          recipe[
            "--ui-interactive-color"
          ],
        ).toBe(
          "var(--ui-primary-contrast)",
        );

        expect(
          recipe[
            "--ui-interactive-hover-background"
          ],
        ).toContain(
          "color-mix",
        );

        expect(
          recipe[
            "--ui-interactive-pressed-background"
          ],
        ).toContain(
          "14%",
        );

        expect(
          recipe[
            "--ui-interactive-selected-background"
          ],
        ).toBe(
          "var(--ui-primary-container)",
        );

        expect(
          recipe[
            "--ui-interactive-selected-color"
          ],
        ).toBe(
          "var(--ui-on-primary-container)",
        );

        expect(
          recipe[
            "--ui-interactive-shadow"
          ],
        ).toBe(
          "var(--ui-elevation-2)",
        );

        expect(
          recipe[
            "--ui-interactive-hover-shadow"
          ],
        ).toBe(
          "var(--ui-elevation-3)",
        );

        expect(
          recipe[
            "--ui-interactive-focus-shadow"
          ],
        ).toBe(
          "var(--ui-elevation-2)",
        );

        expect(
          recipe[
            "--ui-interactive-pressed-shadow"
          ],
        ).toBe(
          "var(--ui-elevation-1)",
        );
      },
    );


    it(
      "keeps surface and plain families on the same contract",
      () => {
        const surface =
          interactiveStateRecipe({
            emphasis:
              "surface",
          });

        expect(
          surface[
            "--ui-interactive-background"
          ],
        ).toBe(
          "var(--ui-surface)",
        );

        expect(
          surface[
            "--ui-interactive-border-color"
          ],
        ).toBe(
          "var(--ui-border)",
        );


        const plain =
          interactiveStateRecipe({
            emphasis:
              "plain",
          });

        expect(
          plain[
            "--ui-interactive-background"
          ],
        ).toBe(
          "transparent",
        );

        expect(
          plain[
            "--ui-interactive-hover-background"
          ],
        ).toBe(
          "transparent",
        );

        expect(
          plain[
            "--ui-interactive-pressed-background"
          ],
        ).toBe(
          "transparent",
        );
      },
    );


    it(
      "uses shared focus and disabled policy instead of component constants",
      () => {
        const recipe =
          interactiveStateRecipe({
            tone:
              "danger",

            emphasis:
              "outline",
          });


        expect(
          recipe[
            "--ui-interactive-focus-ring-color"
          ],
        ).toBe(
          "var(--ui-interaction-focus-ring-color)",
        );

        expect(
          recipe[
            "--ui-interactive-disabled-opacity"
          ],
        ).toBe(
          "var(--ui-interaction-disabled-opacity)",
        );
      },
    );
  },
);
