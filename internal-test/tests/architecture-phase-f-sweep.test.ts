// @vitest-environment node

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";

import {
  extname,
  join,
  relative,
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

const TESTS =
  resolve(
    process.cwd(),
    "tests",
  );


function collectFiles(
  directory:
    string,
  extensions?:
    ReadonlySet<string>,
): string[] {
  const files:
    string[] = [];


  for (
    const entry of
    readdirSync(
      directory,
      {
        withFileTypes:
          true,
      },
    )
  ) {
    const path =
      join(
        directory,
        entry.name,
      );


    if (
      entry.isDirectory()
    ) {
      files.push(
        ...collectFiles(
          path,
          extensions,
        ),
      );

      continue;
    }


    if (
      !extensions ||
      extensions.has(
        extname(
          entry.name,
        ),
      )
    ) {
      files.push(
        path,
      );
    }
  }


  return files;
}


const TS_EXTENSIONS =
  new Set([
    ".ts",
    ".tsx",
  ]);


function resolveModule(
  fromFile:
    string,
  specifier:
    string,
): string | null {
  const base =
    resolve(
      fromFile,
      "..",
      specifier,
    );

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    join(
      base,
      "index.ts",
    ),
    join(
      base,
      "index.tsx",
    ),
  ];


  for (
    const candidate of
    candidates
  ) {
    if (
      existsSync(
        candidate,
      ) &&
      statSync(
        candidate,
      ).isFile() &&
      TS_EXTENSIONS.has(
        extname(
          candidate,
        ),
      )
    ) {
      return candidate;
    }
  }


  return null;
}


function readRelativeSpecifiers(
  file:
    string,
): string[] {
  const source =
    readFileSync(
      file,
      "utf8",
    );

  const specifiers =
    new Set<string>();


  const staticPattern =
    /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

  const dynamicPattern =
    /import\(\s*["']([^"']+)["']\s*\)/g;


  for (
    const pattern of [
      staticPattern,
      dynamicPattern,
    ]
  ) {
    let match:
      RegExpExecArray | null;


    while (
      (
        match =
          pattern.exec(
            source,
          )
      ) !==
      null
    ) {
      const specifier =
        match[1];


      if (
        specifier?.startsWith(
          ".",
        )
      ) {
        specifiers.add(
          specifier,
        );
      }
    }
  }


  return [
    ...specifiers,
  ];
}


function sourceModuleGraph() {
  const modules =
    collectFiles(
      SRC,
      TS_EXTENSIONS,
    );

  const moduleSet =
    new Set(
      modules.map(
        (
          file,
        ) =>
          resolve(
            file,
          ),
      ),
    );

  const graph =
    new Map<
      string,
      Set<string>
    >();

  const unresolved:
    Array<{
      file: string;
      specifier: string;
    }> = [];


  for (
    const file of
    modules
  ) {
    const absolute =
      resolve(
        file,
      );

    const targets =
      new Set<string>();


    for (
      const specifier of
      readRelativeSpecifiers(
        absolute,
      )
    ) {
      const target =
        resolveModule(
          absolute,
          specifier,
        );


      if (
        target &&
        moduleSet.has(
          resolve(
            target,
          ),
        )
      ) {
        targets.add(
          resolve(
            target,
          ),
        );

        continue;
      }


      if (
        ![
          ".css",
          ".json",
          ".svg",
          ".png",
        ].some(
          (
            suffix,
          ) =>
            specifier.endsWith(
              suffix,
            ),
        )
      ) {
        unresolved.push({
          file:
            relative(
              ROOT,
              absolute,
            ),

          specifier,
        });
      }
    }


    graph.set(
      absolute,
      targets,
    );
  }


  return {
    modules:
      moduleSet,

    graph,

    unresolved,
  };
}


describe(
  "Phase F architecture sweep",
  () => {
    it(
      "keeps every productive TS/TSX module reachable from src/index.ts",
      () => {
        const {
          modules,
          graph,
          unresolved,
        } =
          sourceModuleGraph();


        expect(
          unresolved,
        ).toEqual(
          [],
        );


        const entry =
          resolve(
            SRC,
            "index.ts",
          );

        const reachable =
          new Set<string>();

        const pending = [
          entry,
        ];


        while (
          pending.length >
          0
        ) {
          const current =
            pending.pop();


          if (
            !current ||
            reachable.has(
              current,
            )
          ) {
            continue;
          }


          reachable.add(
            current,
          );


          for (
            const target of
            graph.get(
              current,
            ) ??
            []
          ) {
            pending.push(
              target,
            );
          }
        }


        const orphaned = [
          ...modules,
        ]
          .filter(
            (
              file,
            ) =>
              !reachable.has(
                file,
              ),
          )
          .map(
            (
              file,
            ) =>
              relative(
                ROOT,
                file,
              ),
          )
          .sort();


        expect(
          orphaned,
        ).toEqual(
          [],
        );
      },
    );


    it(
      "keeps simple controlled state on the shared owner and specialized engines explicit",
      () => {
        const simpleConsumers = [
          "src/patterns/command/CommandPalette.tsx",
          "src/core/viewport/UIViewportProvider.tsx",
          "src/primitives/forms/SearchInput.tsx",
          "src/primitives/forms/RadioGroup.tsx",
          "src/primitives/navigation/NavigationList.tsx",
        ];


        for (
          const relativePath
          of simpleConsumers
        ) {
          const source =
            readFileSync(
              resolve(
                ROOT,
                relativePath,
              ),
              "utf8",
            );


          expect(
            source,
          ).toContain(
            "useControllableValue",
          );
        }


        const specializedOwners = [
          "src/patterns/navigation-stack/useNavigationEntries.ts",
          "src/patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx",
        ];


        for (
          const relativePath
          of specializedOwners
        ) {
          const source =
            readFileSync(
              resolve(
                ROOT,
                relativePath,
              ),
              "utf8",
            );


          expect(
            source,
          ).not.toContain(
            "useControllableValue",
          );
        }
      },
    );


    it(
      "keeps FloatingLayer JSX behind FloatingOverlayRuntime",
      () => {
        const consumers =
          collectFiles(
            SRC,
            TS_EXTENSIONS,
          )
            .filter(
              (
                file,
              ) =>
                /<FloatingLayer\b/.test(
                  readFileSync(
                    file,
                    "utf8",
                  ),
                ),
            )
            .map(
              (
                file,
              ) =>
                relative(
                  ROOT,
                  file,
                ),
            )
            .sort();


        expect(
          consumers,
        ).toEqual([
          "src/core/overlay/FloatingOverlayRuntime.tsx",
        ]);
      },
    );


    it(
      "contains no historical phase markers in productive source",
      () => {
        const hits:
          string[] = [];


        for (
          const file of
          collectFiles(
            SRC,
            new Set([
              ".ts",
              ".tsx",
              ".css",
            ]),
          )
        ) {
          if (
            /\bP\d+\.\d+\b/.test(
              readFileSync(
                file,
                "utf8",
              ),
            )
          ) {
            hits.push(
              relative(
                ROOT,
                file,
              ),
            );
          }
        }


        expect(
          hits,
        ).toEqual(
          [],
        );
      },
    );


    it(
      "contains no generated, backup or test residue under src",
      () => {
        const residue =
          collectFiles(
            SRC,
          )
            .map(
              (
                file,
              ) =>
                relative(
                  ROOT,
                  file,
                ),
            )
            .filter(
              (
                file,
              ) =>
                /(?:\.bak|\.orig|\.rej|\.old|\.tmp|~)$/i.test(
                  file,
                ) ||
                /\.(?:test|spec)\.[^.]+$/i.test(
                  file,
                ) ||
                file.includes(
                  "__snapshots__",
                ),
            );


        expect(
          residue,
        ).toEqual(
          [],
        );
      },
    );


    it(
      "has no ambiguous source-snapshot test filenames after classification",
      () => {
        const ambiguous =
          collectFiles(
            TESTS,
            TS_EXTENSIONS,
          )
            .map(
              (
                file,
              ) =>
                relative(
                  TESTS,
                  file,
                ),
            )
            .filter(
              (
                file,
              ) =>
                /source\.test\./.test(
                  file,
                ),
            );


        expect(
          ambiguous,
        ).toEqual(
          [],
        );
      },
    );


    it(
      "removes the identity-only NavigationStack motion adapter",
      () => {
        expect(
          existsSync(
            resolve(
              SRC,
              "patterns/navigation-stack/navigationStack.motion.ts",
            ),
          ),
        ).toBe(
          false,
        );


        const navigationStack =
          readFileSync(
            resolve(
              SRC,
              "patterns/navigation-stack/NavigationStack.tsx",
            ),
            "utf8",
          );


        expect(
          navigationStack,
        ).toContain(
          "preset={animation}",
        );

        expect(
          navigationStack,
        ).not.toContain(
          "getNavigationStackMotionPreset",
        );
      },
    );
  },
);
