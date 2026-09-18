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
  "Phase E3 status-label recipe ownership",
  () => {
    it(
      "centralizes Badge/Tag scheme and variant semantics in one recipe",
      () => {
        const recipe =
          readSource(
            "components/display/status-label-recipe.ts",
          );


        for (
          const semantic of [
            "StatusLabelVariant",
            "StatusLabelColorScheme",
            "STATUS_LABEL_SCHEMES",
            "getStatusLabelVariantStyle",
            "statusLabelRecipe",
            "solidBg",
            "subtleBg",
            "outlineBorder",
          ]
        ) {
          expect(
            recipe,
          ).toContain(
            semantic,
          );
        }
      },
    );


    it.each([
      "components/display/Badge.tsx",
      "components/display/Tag.tsx",
    ])(
      "%s consumes the shared recipe and no longer owns a scheme map",
      (
        relativePath,
      ) => {
        const source =
          readSource(
            relativePath,
          );


        expect(
          source,
        ).toContain(
          "statusLabelRecipe",
        );

        expect(
          source,
        ).not.toContain(
          "schemeMap",
        );

        expect(
          source,
        ).not.toContain(
          "solidBg",
        );

        expect(
          source,
        ).not.toContain(
          "subtleBg",
        );

        expect(
          source,
        ).not.toContain(
          "outlineBorder",
        );
      },
    );


    it(
      "keeps Badge density local",
      () => {
        const source =
          readSource(
            "components/display/Badge.tsx",
          );


        for (
          const semantic of [
            "minHeight:\n              22",
            'padding:\n              "0.2rem 0.55rem"',
            'fontSize:\n              "0.75rem"',
            "fontWeight:\n              700",
            'letterSpacing:\n              "0.02em"',
          ]
        ) {
          expect(
            source,
          ).toContain(
            semantic,
          );
        }
      },
    );


    it(
      "keeps Tag density and remove interaction local",
      () => {
        const source =
          readSource(
            "components/display/Tag.tsx",
          );


        for (
          const semantic of [
            "usePress",
            "removeButton",
            "showRemove",
            "minHeight:\n              28",
            'padding:\n              "0.28rem 0.7rem"',
            'fontSize:\n              "0.78rem"',
            "fontWeight:\n              600",
            'letterSpacing:\n              "0.01em"',
          ]
        ) {
          expect(
            source,
          ).toContain(
            semantic,
          );
        }
      },
    );


    it(
      "keeps the shared recipe internal",
      () => {
        const rootIndex =
          readSource(
            "index.ts",
          );


        expect(
          rootIndex,
        ).not.toContain(
          "status-label-recipe",
        );

        expect(
          rootIndex,
        ).not.toContain(
          "statusLabelRecipe",
        );

        expect(
          rootIndex,
        ).not.toContain(
          "StatusLabelVariant",
        );

        expect(
          rootIndex,
        ).not.toContain(
          "StatusLabelColorScheme",
        );
      },
    );
  },
);
