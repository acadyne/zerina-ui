// @vitest-environment node

import {
  readFileSync,
  readdirSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

import {
  describe,
  expect,
  it,
} from "vitest";


const SRC_ROOT =
  fileURLToPath(
    new URL(
      "../../src/",
      import.meta.url,
    ),
  );


function source(
  relativePath:
    string,
): string {
  return readFileSync(
    new URL(
      `../../src/${relativePath}`,
      import.meta.url,
    ),
    "utf8",
  );
}


function sourceFiles(
  directory:
    string,
): Array<{
  path: string;
  content: string;
}> {
  const absolute =
    `${SRC_ROOT}${directory}`;

  const result:
    Array<{
      path: string;
      content: string;
    }> = [];


  for (
    const entry of
    readdirSync(
      absolute,
      {
        withFileTypes:
          true,
      },
    )
  ) {
    const relative =
      directory === "."
        ? entry.name
        : `${directory}/${entry.name}`;

    if (
      entry.isDirectory()
    ) {
      result.push(
        ...sourceFiles(
          relative,
        ),
      );

      continue;
    }

    if (
      entry.name.endsWith(
        ".ts",
      ) ||
      entry.name.endsWith(
        ".tsx",
      ) ||
      entry.name.endsWith(
        ".css",
      )
    ) {
      result.push({
        path:
          relative,

        content:
          source(
            relative,
          ),
      });
    }
  }


  return result;
}


describe(
  "Phase 7E typography and density ownership",
  () => {
    const typography =
      source(
        "theme/recipes/typography-recipe.ts",
      );


    it(
      "keeps one role-to-token translator for semantic typography",
      () => {
        const declarations =
          sourceFiles(
            ".",
          )
            .map(
              ({
                content,
              }) =>
                content.match(
                  /const\s+TYPOGRAPHY_ROLE_TOKENS\b/g,
                )?.length ??
                0,
            )
            .reduce(
              (
                total,
                count,
              ) =>
                total +
                count,
              0,
            );


        expect(
          declarations,
        ).toBe(
          1,
        );

        for (
          const role of [
            "display",
            "headline",
            "title",
            "body",
            "label",
            "caption",
          ]
        ) {
          expect(
            typography,
          ).toContain(
            `${role}:`,
          );
        }


        expect(
          typography,
        ).not.toMatch(
          /\bProvider\b|\buseState\b|\buseEffect\b|matchMedia/,
        );
      },
    );


    it(
      "routes TypeScript semantic typography through typographyRecipe instead of local token picks",
      () => {
        const allowedOwners =
          new Set([
            "theme/contracts/theme-token-contract.ts",
            "theme/recipes/typography-recipe.ts",
          ]);

        const directConsumers =
          sourceFiles(
            ".",
          )
            .filter(
              ({
                path,
              }) =>
                (
                  path.endsWith(
                    ".ts",
                  ) ||
                  path.endsWith(
                    ".tsx",
                  )
                ) &&
                !allowedOwners.has(
                  path,
                ),
            )
            .filter(
              ({
                content,
              }) =>
                /--ui-type-(?:display|headline|title|body|label|caption)-/.test(
                  content,
                ),
            )
            .map(
              ({
                path,
              }) =>
                path,
            );


        expect(
          directConsumers,
        ).toEqual(
          [],
        );
      },
    );


    it(
      "projects the active viewport density into control, list, menu and table metrics",
      () => {
        const controls =
          source(
            "styles/controls.css",
          );

        const actionRecipe =
          source(
            "primitives/forms/action-control-recipe.ts",
          );

        const choiceRecipe =
          source(
            "primitives/forms/choice-control-recipe.ts",
          );

        const list =
          source(
            "primitives/layout/List.tsx",
          );

        const menu =
          source(
            "primitives/overlay/menu/menu.recipe.ts",
          );

        const dataTable =
          source(
            "components/data-table/DataTableDesktop.tsx",
          ) +
          source(
            "components/data-table/DataTableEditableDesktop.tsx",
          );


        expect(
          controls,
        ).toContain(
          "--ui-density-control-height",
        );

        expect(
          actionRecipe,
        ).toContain(
          "--ui-density-control-height",
        );

        expect(
          choiceRecipe,
        ).toContain(
          "--ui-density-control-height",
        );

        expect(
          list,
        ).toContain(
          "--ui-density-${metric}",
        );

        expect(
          menu,
        ).toContain(
          "--ui-density-item-min-height",
        );

        expect(
          dataTable,
        ).toContain(
          "--ui-density-content-padding",
        );


        const textControlMetrics =
          controls.slice(
            0,
            controls.indexOf(
              "/* Text control frame */",
            ),
          );

        const actionHeightProjection =
          actionRecipe.slice(
            actionRecipe.indexOf(
              "function densityAwareControlHeight",
            ),
            actionRecipe.indexOf(
              "const ACTION_CONTROL_SIZE_METRICS",
            ),
          );


        expect(
          textControlMetrics,
        ).not.toContain(
          "--ui-space-",
        );

        expect(
          actionHeightProjection,
        ).not.toContain(
          "--ui-space-",
        );
      },
    );


    it(
      "keeps navigation density on the existing UIViewportProvider vocabulary",
      () => {
        const sharedTypes =
          source(
            "primitives/navigation/shared/navigation-shared.types.ts",
          );

        const bottom =
          source(
            "primitives/navigation/bottom-navigation/BottomNavigation.tsx",
          );

        const rail =
          source(
            "primitives/navigation/navigation-rail/NavigationRail.tsx",
          );


        expect(
          sharedTypes,
        ).toMatch(
          /NavigationDestinationDensity\s*=\s*UIDensity/,
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
            "useOptionalUIViewport",
          );

          expect(
            consumer,
          ).toContain(
            "viewport?.density",
          );

          expect(
            consumer,
          ).not.toMatch(
            /matchMedia|innerWidth|clientWidth/,
          );
        }
      },
    );


    it(
      "does not hardcode comfortable density into product composition",
      () => {
        const offenders =
          sourceFiles(
            ".",
          )
            .filter(
              ({
                path,
              }) =>
                path.endsWith(
                  ".tsx",
                ),
            )
            .filter(
              ({
                content,
              }) =>
                /density\s*=\s*["']comfortable["']/.test(
                  content,
                ),
            )
            .map(
              ({
                path,
              }) =>
                path,
            );


        expect(
          offenders,
        ).toEqual(
          [],
        );
      },
    );
  },
);
