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


const source =
  readFileSync(
    resolve(
      process.cwd(),
      "..",
      "src/patterns/scaffold/TopAppBar.tsx",
    ),
    "utf8",
  );


describe(
  "TopAppBar layout invariants",
  () => {
    it(
      "keeps centered content in normal flow instead of overlaying action zones",
      () => {
        expect(
          source,
        ).toContain(
          '? "1 1 auto"',
        );

        expect(
          source,
        ).not.toContain(
          'transform:\n                      "translate(-50%, -50%)"',
        );

        expect(
          source,
        ).not.toContain(
          'width:\n                      "min(52%, 420px)"',
        );
      },
    );


    it(
      "allows centered side zones to shrink before they can cover the center",
      () => {
        const leadingStart =
          source.indexOf(
            "const leadingSlot",
          );

        const centerStart =
          source.indexOf(
            "const centerSlot",
          );

        const actionsStart =
          source.indexOf(
            "const actionsSlot",
          );

        const centerContentStart =
          source.indexOf(
            "const centerContent",
          );

        const leading =
          source.slice(
            leadingStart,
            centerStart,
          );

        const actions =
          source.slice(
            actionsStart,
            centerContentStart,
          );

        expect(
          leading,
        ).toContain(
          '? "0 1 auto"',
        );

        expect(
          actions,
        ).toContain(
          '? "0 1 auto"',
        );
      },
    );
  },
);
