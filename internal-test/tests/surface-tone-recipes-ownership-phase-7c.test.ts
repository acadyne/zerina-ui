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


const ROOT =
  resolve(
    process.cwd(),
    "..",
  );

const toneRecipe =
  readFileSync(
    resolve(
      ROOT,
      "src/theme/recipes/tone-recipe.ts",
    ),
    "utf8",
  );

const surfaceRecipe =
  readFileSync(
    resolve(
      ROOT,
      "src/theme/recipes/surface-recipe.ts",
    ),
    "utf8",
  );

const alert =
  readFileSync(
    resolve(
      ROOT,
      "src/components/feedback/Alert.tsx",
    ),
    "utf8",
  );

const statusLabel =
  readFileSync(
    resolve(
      ROOT,
      "src/components/display/status-label-recipe.ts",
    ),
    "utf8",
  );

const card =
  readFileSync(
    resolve(
      ROOT,
      "src/components/display/Card.tsx",
    ),
    "utf8",
  );

const displayCSS =
  readFileSync(
    resolve(
      ROOT,
      "src/components/display/display.css",
    ),
    "utf8",
  );


describe(
  "Phase 7C visual recipe ownership",
  () => {
    it(
      "keeps tone token mapping in one semantic owner",
      () => {
        expect(
          toneRecipe,
        ).toContain(
          "const TONE_TOKENS",
        );

        expect(
          alert,
        ).toContain(
          "toneRecipe",
        );

        expect(
          statusLabel,
        ).toContain(
          "toneRecipe",
        );

        expect(
          alert,
        ).not.toContain(
          "alertVariantMap",
        );

        expect(
          statusLabel,
        ).not.toContain(
          "STATUS_LABEL_SCHEMES",
        );
      },
    );


    it(
      "keeps surface role and elevation mapping in one semantic owner",
      () => {
        expect(
          surfaceRecipe,
        ).toContain(
          "SURFACE_BACKGROUND",
        );

        expect(
          surfaceRecipe,
        ).toContain(
          "SURFACE_ELEVATION",
        );

        expect(
          card,
        ).toContain(
          "surfaceRecipe",
        );

        expect(
          displayCSS,
        ).not.toContain(
          "--ui-card-shadow",
        );

        expect(
          displayCSS,
        ).not.toContain(
          "--ui-card-border-color",
        );
      },
    );


    it(
      "does not branch recipes by registered theme name",
      () => {
        const recipes =
          `${toneRecipe}\n${surfaceRecipe}`;

        for (
          const themeName of [
            "spring",
            "summer",
            "autumn",
            "winter",
            "retro-futurist",
            "sepia-retro",
          ]
        ) {
          expect(
            recipes,
          ).not.toContain(
            themeName,
          );
        }
      },
    );
  },
);
