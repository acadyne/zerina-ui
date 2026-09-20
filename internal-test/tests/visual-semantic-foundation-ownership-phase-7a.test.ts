// @vitest-environment node

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


const ROOT =
  resolve(
    process.cwd(),
    "..",
  );

const SRC =
  resolve(
    ROOT,
    "src",
  );

function collectSourceFiles(
  directory:
    string,
): string[] {
  const files:
    string[] = [];

  for (
    const entry of
    readdirSync(
      directory,
    )
  ) {
    const path =
      resolve(
        directory,
        entry,
      );

    if (
      statSync(
        path,
      ).isDirectory()
    ) {
      files.push(
        ...collectSourceFiles(
          path,
        ),
      );

      continue;
    }

    if (
      /\.(?:ts|tsx|css)$/.test(
        entry,
      )
    ) {
      files.push(
        path,
      );
    }
  }

  return files;
}

const sourceFiles =
  collectSourceFiles(
    SRC,
  );

const allSource =
  sourceFiles
    .map(
      (
        path,
      ) =>
        readFileSync(
          path,
          "utf8",
        ),
    )
    .join(
      "\n",
    );


describe(
  "Phase 7A visual ownership",
  () => {
    it(
      "keeps a single semantic vocabulary owner",
      () => {
        const declarations =
          sourceFiles
            .map(
              (
                path,
              ) =>
                readFileSync(
                  path,
                  "utf8",
                ),
            )
            .join(
              "\n",
            )
            .match(
              /export type UITone\s*=/g,
            )?.length ??
          0;

        expect(
          declarations,
        ).toBe(
          1,
        );

        expect(
          readFileSync(
            resolve(
              SRC,
              "theme/contracts/visual-semantics.ts",
            ),
            "utf8",
          ),
        ).toContain(
          "UI_TONES",
        );
      },
    );

    it(
      "removes the old surface token vocabulary",
      () => {
        for (
          const removed of [
            "--ui-bg",
            "--ui-surface-2",
            "--ui-surface-3",
          ]
        ) {
          expect(
            allSource,
          ).not.toContain(
            removed,
          );
        }

        const contract =
          readFileSync(
            resolve(
              SRC,
              "theme/contracts/theme-token-contract.ts",
            ),
            "utf8",
          );

        expect(
          contract,
        ).not.toMatch(
          /\bbg\s*:/,
        );

        expect(
          contract,
        ).not.toMatch(
          /\bsurface2\s*:/,
        );

        expect(
          contract,
        ).not.toMatch(
          /\bsurface3\s*:/,
        );
      },
    );

    it(
      "removes component-specific shadow variables in favor of elevation",
      () => {
        expect(
          allSource,
        ).not.toContain(
          "--ui-shadow-",
        );

        const contract =
          readFileSync(
            resolve(
              SRC,
              "theme/contracts/theme-token-contract.ts",
            ),
            "utf8",
          );

        expect(
          contract,
        ).not.toMatch(
          /\bshadow\s*:/,
        );

        expect(
          contract,
        ).toContain(
          "elevation:",
        );
      },
    );

    it(
      "keeps density definitions in theme while viewport remains the selector owner",
      () => {
        const contract =
          readFileSync(
            resolve(
              SRC,
              "theme/contracts/theme-token-contract.ts",
            ),
            "utf8",
          );

        const viewport =
          readFileSync(
            resolve(
              SRC,
              "core/viewport/UIViewportProvider.tsx",
            ),
            "utf8",
          );

        expect(
          contract,
        ).toContain(
          "density:",
        );

        expect(
          viewport,
        ).toContain(
          "data-ui-density",
        );

        expect(
          viewport,
        ).toContain(
          "data-ui-density-mode",
        );
      },
    );
  },
);
