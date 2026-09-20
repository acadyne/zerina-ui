import {
  describe,
  expect,
  it,
} from "vitest";

import {
  surfaceRecipe,
  toneRecipe,
} from "zerina-ui";


describe(
  "Phase 7C surface and tone recipes",
  () => {
    it(
      "resolves every semantic tone through one shared recipe",
      () => {
        expect(
          toneRecipe({
            tone:
              "primary",
            emphasis:
              "container",
          }),
        ).toEqual({
          background:
            "var(--ui-primary-container)",

          color:
            "var(--ui-on-primary-container)",

          borderColor:
            "color-mix(in srgb, var(--ui-primary) 24%, var(--ui-border))",
        });

        expect(
          toneRecipe({
            tone:
              "info",
            emphasis:
              "solid",
          }),
        ).toEqual({
          background:
            "var(--ui-info)",

          color:
            "var(--ui-info-contrast)",

          borderColor:
            "transparent",
        });

        expect(
          toneRecipe({
            tone:
              "neutral",
            emphasis:
              "container",
          }).background,
        ).toBe(
          "var(--ui-neutral-container)",
        );
      },
    );


    it(
      "resolves surface role, shape, elevation and border without component-local maps",
      () => {
        expect(
          surfaceRecipe({
            role:
              "containerLow",
            elevation:
              2,
            shape:
              "xl",
            border:
              "strong",
          }),
        ).toEqual({
          background:
            "var(--ui-surface-container-low)",

          color:
            "var(--ui-text)",

          border:
            "1px solid var(--ui-border-strong)",

          borderRadius:
            "var(--ui-radius-xl)",

          boxShadow:
            "var(--ui-elevation-2)",
        });
      },
    );


    it(
      "keeps semantic recipes theme-agnostic",
      () => {
        const source =
          JSON.stringify({
            tone:
              toneRecipe({
                tone:
                  "danger",
              }),

            surface:
              surfaceRecipe({
                role:
                  "surface",
              }),
          });

        for (
          const themeName of [
            "light",
            "dark",
            "spring",
            "summer",
            "autumn",
            "winter",
            "retro-futurist",
            "sepia-retro",
          ]
        ) {
          expect(
            source,
          ).not.toContain(
            themeName,
          );
        }
      },
    );
  },
);
