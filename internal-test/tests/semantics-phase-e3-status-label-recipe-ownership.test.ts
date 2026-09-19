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


function normalizeSource(
  source:
    string,
): string {
  return source.replace(
    /\s+/g,
    " ",
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


        const normalized =
          normalizeSource(
            source,
          );


        for (
          const semantic of [
            "minHeight: 22",
            'padding: "0.2rem 0.55rem"',
            'fontSize: "0.75rem"',
            "fontWeight: 700",
            'letterSpacing: "0.02em"',
          ]
        ) {
          expect(
            normalized,
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


        const normalized =
          normalizeSource(
            source,
          );


        for (
          const semantic of [
            "usePress",
            "removeButton",
            "showRemove",
            "minHeight: 28",
            'padding: "0.28rem 0.7rem"',
            'fontSize: "0.78rem"',
            "fontWeight: 600",
            'letterSpacing: "0.01em"',
          ]
        ) {
          expect(
            normalized,
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
