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
  "Phase B4 controllable-value ownership",
  () => {
    it(
      "centralizes simple controlled/uncontrolled source ownership",
      () => {
        const owner =
          readSource(
            "core/react/useControllableValue.ts",
          );


        expect(
          owner,
        ).toContain(
          "value !== undefined",
        );

        expect(
          owner,
        ).toContain(
          "setUncontrolledValue",
        );

        expect(
          owner,
        ).not.toContain(
          "onChange",
        );
      },
    );


    it(
      "does not leave pre-owner controlled branches in SearchInput",
      () => {
        const source =
          readSource(
            "primitives/forms/SearchInput.tsx",
          );


        expect(
          source,
        ).toContain(
          "currentValue",
        );

        expect(
          source,
        ).not.toMatch(
          /\bisControlled\b/,
        );

        expect(
          source,
        ).not.toMatch(
          /\binternalValue\b/,
        );
      },
    );


    it.each([
      "primitives/disclosure/Collapsible.tsx",
      "primitives/disclosure/Accordion.tsx",
      "primitives/navigation/NavigationList.tsx",
      "primitives/forms/SearchInput.tsx",
      "primitives/forms/RadioGroup.tsx",
      "core/motion/UIMotionProvider.tsx",
      "primitives/navigation/shared/navigationSelection.ts",
      "primitives/forms/use-choice-control.ts",
    ])(
      "%s consumes the shared source-of-truth owner",
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
          "useControllableValue",
        );
      },
    );


    it.each([
      "patterns/scaffold/adaptive-scaffold/AdaptiveScaffold.tsx",
      "patterns/navigation-stack/NavigationStack.tsx",
      "patterns/scaffold/tab-scaffold/TabScaffold.tsx",
    ])(
      "%s keeps its specialized multi-state engine",
      (
        relativePath,
      ) => {
        const source =
          readSource(
            relativePath,
          );


        expect(
          source,
        ).not.toContain(
          "useControllableValue",
        );
      },
    );
  },
);
