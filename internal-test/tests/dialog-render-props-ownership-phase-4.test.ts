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


function read(
  relative:
    string,
): string {
  return readFileSync(
    resolve(
      SRC,
      relative.replace(
        /^src\//,
        "",
      ),
    ),
    "utf8",
  );
}


describe(
  "Phase 4 target-dialog render ownership",
  () => {
    it(
      "keeps one callback type and one content resolver",
      () => {
        const contract =
          read(
            "src/patterns/shared/targetDialogContract.ts",
          );

        expect(
          contract.match(
            /export type TargetDialogRender</g,
          ),
        ).toHaveLength(
          1,
        );

        expect(
          contract.match(
            /export function resolveTargetDialogContent/g,
          ),
        ).toHaveLength(
          1,
        );

        expect(
          contract,
        ).not.toContain(
          "RenderableWithTarget",
        );

        expect(
          contract,
        ).not.toContain(
          "resolveRenderableWithTarget",
        );

        expect(
          contract,
        ).not.toContain(
          "as (",
        );
      },
    );


    it(
      "routes every target-aware dialog family through the shared render contract",
      () => {
        const files = [
          "src/patterns/ConfirmDialog.tsx",
          "src/patterns/ActionDialog.tsx",
          "src/patterns/TargetFormDialog.tsx",
          "src/patterns/shared/TargetDialogFrame.tsx",
        ];

        for (
          const relative
          of files
        ) {
          const source =
            read(
              relative,
            );

          expect(
            source,
          ).toContain(
            "TargetDialogRenderProps",
          );

          expect(
            source,
          ).not.toContain(
            "RenderableWithTarget",
          );
        }
      },
    );


    it(
      "does not retain legacy target-aware region props in public dialog sources",
      () => {
        const sources =
          [
            "src/patterns/ConfirmDialog.tsx",
            "src/patterns/ActionDialog.tsx",
            "src/patterns/TargetFormDialog.tsx",
          ]
            .map(
              read,
            )
            .join(
              "\n",
            );

        for (
          const retired
          of [
            "description?:",
            "targetLabel?:",
            "children?:",
            "footer?:",
          ]
        ) {
          expect(
            sources,
          ).not.toContain(
            retired,
          );
        }

        for (
          const current
          of [
            "renderDescription",
            "renderTargetLabel",
            "renderBody",
            "renderFooter",
          ]
        ) {
          expect(
            sources,
          ).toContain(
            current,
          );
        }
      },
    );
  },
);
