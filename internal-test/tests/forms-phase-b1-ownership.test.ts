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
  "Phase B1 form ownership",
  () => {
    it(
      "keeps text-control semantics in one internal runtime",
      () => {
        const runtime =
          readSource(
            "primitives/forms/use-text-control-runtime.ts",
          );

        const input =
          readSource(
            "primitives/forms/Input.tsx",
          );

        const textarea =
          readSource(
            "primitives/forms/Textarea.tsx",
          );


        for (
          const owner of [
            "useFieldControl",
            "useFocusVisible",
            "useInputGroupDescendantState",
          ]
        ) {
          expect(
            runtime,
          ).toContain(
            owner,
          );

          expect(
            input,
          ).not.toContain(
            owner,
          );

          expect(
            textarea,
          ).not.toContain(
            owner,
          );
        }


        expect(
          input,
        ).toContain(
          "useTextControlRuntime<HTMLInputElement>",
        );

        expect(
          textarea,
        ).toContain(
          "useTextControlRuntime<HTMLTextAreaElement>",
        );
      },
    );


    it(
      "keeps native differences in the public wrappers",
      () => {
        const input =
          readSource(
            "primitives/forms/Input.tsx",
          );

        const textarea =
          readSource(
            "primitives/forms/Textarea.tsx",
          );


        expect(
          input,
        ).toContain(
          'type={type}',
        );

        expect(
          input,
        ).toContain(
          'data-ui="input"',
        );

        expect(
          textarea,
        ).toContain(
          'resize = "vertical"',
        );

        expect(
          textarea,
        ).toContain(
          'data-ui="textarea"',
        );
      },
    );


    it(
      "keeps field-message context/presence ownership in one frame",
      () => {
        const frame =
          readSource(
            "primitives/forms/FieldMessageFrame.tsx",
          );

        const help =
          readSource(
            "primitives/forms/HelpText.tsx",
          );

        const error =
          readSource(
            "primitives/forms/FormErrorMessage.tsx",
          );


        expect(
          frame,
        ).toContain(
          "FieldContext",
        );

        expect(
          frame,
        ).toContain(
          "hasRenderableNode",
        );


        for (
          const wrapper of [
            help,
            error,
          ]
        ) {
          expect(
            wrapper,
          ).toContain(
            "FieldMessageFrame",
          );

          expect(
            wrapper,
          ).not.toContain(
            "FieldContext",
          );

          expect(
            wrapper,
          ).not.toContain(
            "hasRenderableNode",
          );
        }
      },
    );
  },
);
