// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  existsSync,
  readFileSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

import {
  dirname,
  resolve,
} from "node:path";


const currentDirectory =
  dirname(
    fileURLToPath(
      import.meta.url,
    ),
  );


const repositoryRoot =
  resolve(
    currentDirectory,
    "../..",
  );


function repositoryPath(
  ...parts: string[]
): string {
  return resolve(
    repositoryRoot,
    ...parts,
  );
}


function readRepositoryFile(
  ...parts: string[]
): string {
  return readFileSync(
    repositoryPath(
      ...parts,
    ),
    "utf8",
  );
}


function removeCssComments(
  source: string,
): string {
  return source.replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
}


describe(
  "CSS public distribution",
  () => {
    it(
      "keeps application shell selectors out of styles.css",
      () => {
        const css =
          removeCssComments(
            readRepositoryFile(
              "src/styles.css",
            ),
          );


        expect(
          css,
        ).not.toMatch(
          /(^|})\s*(?:html|body|#root)(?:\s*,|\s*\{)/m,
        );
      },
    );


    it(
      "keeps reset.css as an independent source entry",
      () => {
        expect(
          existsSync(
            repositoryPath(
              "src/reset.css",
            ),
          ),
        ).toBe(
          true,
        );


        const functionalCss =
          readRepositoryFile(
            "src/styles.css",
          );


        expect(
          functionalCss,
        ).not.toMatch(
          /@import\s+["']\.\/reset\.css["']/,
        );
      },
    );


    it(
      "does not retain styles/base.css",
      () => {
        expect(
          existsSync(
            repositoryPath(
              "src/styles/base.css",
            ),
          ),
        ).toBe(
          false,
        );
      },
    );


    it(
      "exports styles.css and reset.css without exporting base.css",
      () => {
        const packageJson =
          JSON.parse(
            readRepositoryFile(
              "package.json",
            ),
          ) as {
            exports?: Record<
              string,
              unknown
            >;
          };


        expect(
          packageJson.exports,
        ).toHaveProperty(
          "./styles.css",
        );


        expect(
          packageJson.exports,
        ).toHaveProperty(
          "./reset.css",
        );


        expect(
          packageJson.exports,
        ).not.toHaveProperty(
          "./styles/base.css",
        );
      },
    );


    it(
      "routes safe-area consumers through the centralized owner",
      () => {
        const owner =
          readRepositoryFile(
            "src/helpers/safeArea.ts",
          );


        const consumers = [
          readRepositoryFile(
            "src/primitives/layout/Screen.tsx",
          ),

          readRepositoryFile(
            "src/primitives/layout/SafeArea.tsx",
          ),

          readRepositoryFile(
            "src/patterns/scaffold/TopAppBar.tsx",
          ),
        ];


        expect(
          owner,
        ).not.toMatch(
          /--safe-(?:top|right|bottom|left)\b/,
        );


        expect(
          owner,
        ).toMatch(
          /--ui-safe-(?:top|right|bottom|left)-offset/,
        );


        for (
          const consumer of consumers
        ) {
          expect(
            consumer,
          ).toContain(
            "helpers/safeArea",
          );


          expect(
            consumer,
          ).not.toMatch(
            /--(?:ui-)?safe-(?:top|right|bottom|left)/,
          );
        }
      },
    );


    it(
      "contains no active legacy safe-area variables",
      () => {
        const files = [
          "src/styles.css",
          "src/styles/safe-area.css",
          "src/styles/controls.css",
          "src/reset.css",
          "src/helpers/safeArea.ts",
          "src/primitives/layout/Screen.tsx",
          "src/primitives/layout/SafeArea.tsx",
          "src/patterns/scaffold/TopAppBar.tsx",
        ];


        for (
          const file of files
        ) {
          const source =
            readRepositoryFile(
              file,
            );


          expect(
            source,
            file,
          ).not.toMatch(
            /--safe-(?:top|right|bottom|left)\b/,
          );
        }
      },
    );


    it(
      "defines functional safe-area offset variables",
      () => {
        const stylesCss =
          readRepositoryFile(
            "src/styles.css",
          );


        const safeAreaCss =
          readRepositoryFile(
            "src/styles/safe-area.css",
          );


        expect(
          stylesCss,
        ).toMatch(
          /safe-area\.css/,
        );


        for (
          const property of [
            "--ui-safe-top-offset",
            "--ui-safe-right-offset",
            "--ui-safe-bottom-offset",
            "--ui-safe-left-offset",
          ]
        ) {
          expect(
            safeAreaCss,
          ).toContain(
            property,
          );
        }
      },
    );


    it(
      "retains control interaction states",
      () => {
        const controlsCss =
          readRepositoryFile(
            "src/styles/controls.css",
          );


        expect(
          controlsCss,
        ).toContain(
          "[data-ui-control][data-focus-visible]",
        );


        expect(
          controlsCss,
        ).toContain(
          "[data-ui-control]:focus-visible",
        );


        expect(
          controlsCss,
        ).toContain(
          "[data-ui-control][data-invalid]",
        );


        expect(
          controlsCss,
        ).toContain(
          "[data-ui-control][data-disabled]",
        );


        for (
          const control of [
            "input[data-ui-control]",
            "textarea[data-ui-control]",
            "select[data-ui-control]",
            'data-ui="input-group"',
          ]
        ) {
          expect(
            controlsCss,
          ).toContain(
            control,
          );
        }
      },
    );


    it(
      "retains functional component, motion and interaction styles",
      () => {
        const functionalCss = [
          readRepositoryFile(
            "src/styles.css",
          ),

          readRepositoryFile(
            "src/styles/controls.css",
          ),

          readRepositoryFile(
            "src/styles/safe-area.css",
          ),
        ].join(
          "\n",
        ).toLowerCase();


        for (
          const feature of [
            "skeleton",
            "list",
            "scroll",
            "motion",
            "interaction",
          ]
        ) {
          expect(
            functionalCss,
          ).toContain(
            feature,
          );
        }
      },
    );
  },
);