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
  "Phase E2 layout prop matrix ownership",
  () => {
    it(
      "defines full-frame and flow-frame contracts once",
      () => {
        const source =
          readSource(
            "primitives/layout/layoutFrame.types.ts",
          );


        expect(
          source,
        ).toContain(
          "interface LayoutFrameProps",
        );

        expect(
          source,
        ).toContain(
          "SizeProps",
        );

        expect(
          source,
        ).toContain(
          "SpaceProps",
        );

        expect(
          source,
        ).toContain(
          "SurfaceProps",
        );

        expect(
          source,
        ).toContain(
          "interface FlowLayoutFrameProps",
        );

        expect(
          source,
        ).toContain(
          'SizeProps["w"]',
        );

        expect(
          source,
        ).toContain(
          'SizeProps["minH"]',
        );
      },
    );


    it.each([
      "primitives/layout/Flex.tsx",
      "primitives/layout/Grid.tsx",
      "primitives/layout/Stack.tsx",
    ])(
      "%s uses the full layout frame contract",
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
          "LayoutFrameProps",
        );

        expect(
          source,
        ).not.toContain(
          "type SizeProps",
        );

        expect(
          source,
        ).not.toContain(
          "type SpaceProps",
        );

        expect(
          source,
        ).not.toContain(
          "type SurfaceProps",
        );
      },
    );


    it.each([
      "primitives/layout/Inline.tsx",
      "primitives/layout/Wrap.tsx",
    ])(
      "%s uses the deliberate flow-frame subset",
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
          "FlowLayoutFrameProps",
        );

        expect(
          source,
        ).not.toContain(
          'bg?:',
        );

        expect(
          source,
        ).not.toContain(
          'rounded?:',
        );

        expect(
          source,
        ).not.toContain(
          'h?: React.CSSProperties',
        );
      },
    );


    it(
      "keeps the shared frame helpers internal to layout",
      () => {
        const layoutIndex =
          readSource(
            "primitives/layout/index.ts",
          );

        const rootIndex =
          readSource(
            "index.ts",
          );


        expect(
          layoutIndex,
        ).not.toContain(
          "layoutFrame.types",
        );

        expect(
          rootIndex,
        ).not.toContain(
          "LayoutFrameProps",
        );

        expect(
          rootIndex,
        ).not.toContain(
          "FlowLayoutFrameProps",
        );
      },
    );
  },
);
