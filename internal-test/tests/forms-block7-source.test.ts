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


function readSource(
  relativePath: string,
): string {
  return readFileSync(
    resolve(
      process.cwd(),
      "..",
      "src",
      relativePath,
    ),
    "utf-8",
  );
}


describe(
  "Block 7 action-control source contract",
  () => {
    const button =
      readSource(
        "primitives/forms/Button.tsx",
      );

    const iconButton =
      readSource(
        "primitives/forms/IconButton.tsx",
      );

    const pressable =
      readSource(
        "primitives/forms/Pressable.tsx",
      );

    const controlAction =
      readSource(
        "primitives/forms/ControlAction.tsx",
      );

    const recipe =
      readSource(
        "primitives/forms/action-control-recipe.ts",
      );

    const state =
      readSource(
        "primitives/forms/action-control-state.ts",
      );

    const types =
      readSource(
        "primitives/forms/action-control-types.ts",
      );

    const formsIndex =
      readSource(
        "primitives/forms/index.ts",
      );

    const controlsCss =
      readSource(
        "styles/controls.css",
      );

    const listSource =
      readSource(
        "primitives/layout/List.tsx",
      );

    const listCss =
      readSource(
        "primitives/layout/list.css",
      );

    const floatingActionButton =
      readSource(
        "patterns/scaffold/FloatingActionButton.tsx",
      );


    it(
      "uses generic identities and contains no legacy action attributes or selectors",
      () => {
        expect(
          button,
        ).toContain(
          '"data-ui":\n              "button"',
        );

        expect(
          iconButton,
        ).toContain(
          '"data-ui":\n              "icon-button"',
        );

        expect(
          pressable,
        ).toContain(
          '"data-ui":\n          "pressable"',
        );

        expect(
          controlAction,
        ).toContain(
          'data-ui="control-action"',
        );

        const combined =
          [
            button,
            iconButton,
            pressable,
            controlAction,
            recipe,
            state,
            controlsCss,
            listCss,
          ].join(
            "\n",
          );

        for (
          const legacy of [
            "data-ui-button",
            "data-ui-icon-button",
            "data-ui-pressable",
          ]
        ) {
          expect(
            combined,
          ).not.toContain(
            legacy,
          );
        }
      },
    );


    it(
      "removes rounded and numeric IconButton sizes while publishing nominal shared types",
      () => {
        expect(
          button,
        ).not.toMatch(
          /\brounded\??\s*:/,
        );

        expect(
          iconButton,
        ).not.toMatch(
          /\brounded\??\s*:/,
        );

        expect(
          iconButton,
        ).not.toMatch(
          /\bsize\??\s*:\s*(?:number|number\s*\|)/,
        );

        expect(
          types,
        ).toMatch(
          /export type ActionControlSize\s*=\s*\|\s*"sm"\s*\|\s*"md"\s*\|\s*"lg"/s,
        );

        expect(
          types,
        ).toMatch(
          /export type ActionControlVariant\s*=\s*\|\s*"solid"\s*\|\s*"outline"\s*\|\s*"ghost"/s,
        );

        expect(
          types,
        ).toMatch(
          /export type ActionControlColorScheme\s*=\s*\|\s*"primary"\s*\|\s*"secondary"\s*\|\s*"danger"/s,
        );
      },
    );


    it(
      "keeps functional state out of action-control recipes",
      () => {
        for (
          const forbidden of [
            /\busePress\b/,
            /\buseState\b/,
            /\buseReducer\b/,
            /\buseEffect\b/,
            /\bdata-[a-z-]+/,
            /\bonPointer[A-Z]/,
            /\bonKey[A-Z]/,
            /\bfocusVisible\b/,
            /\bdisabled\b/,
            /\bloading\b/,
          ]
        ) {
          expect(
            recipe,
          ).not.toMatch(
            forbidden,
          );
        }

        expect(
          state,
        ).toContain(
          "getActionControlStateAttributes",
        );

        for (
          const attribute of [
            "data-hovered",
            "data-pressed",
            "data-focused",
            "data-focus-visible",
            "data-disabled",
            "data-loading",
            "data-pointer-type",
          ]
        ) {
          expect(
            state,
          ).toContain(
            attribute,
          );
        }
      },
    );


    it(
      "keeps interactive visual styling out of Button, IconButton and Pressable inline styles",
      () => {
        const interactiveStyle =
          /\b(?:background|backgroundColor|borderColor|boxShadow|cursor|opacity)\s*:/;

        expect(
          button,
        ).not.toMatch(
          interactiveStyle,
        );

        expect(
          iconButton,
        ).not.toMatch(
          interactiveStyle,
        );

        expect(
          pressable,
        ).not.toMatch(
          interactiveStyle,
        );

        expect(
          pressable,
        ).toMatch(
          /\bscale\s*:/,
        );

        expect(
          pressable,
        ).toMatch(
          /\btranslate\s*:/,
        );
      },
    );


    it(
      "does not write boxShadow after Pressable resolves its root slot",
      () => {
        const afterResolve =
          pressable.slice(
            pressable.indexOf(
              "const rootSlot",
            ),
          );

        expect(
          afterResolve,
        ).not.toMatch(
          /\bboxShadow\s*[:=]/,
        );
      },
    );


    it(
      "defines the complete static action variable vocabulary",
      () => {
        for (
          const variable of [
            "--ui-action-background",
            "--ui-action-hover-background",
            "--ui-action-pressed-background",
            "--ui-action-color",
            "--ui-action-border",
            "--ui-action-shadow",
            "--ui-action-hover-shadow",
            "--ui-action-pressed-shadow",
          ]
        ) {
          expect(
            recipe,
          ).toContain(
            variable,
          );

          expect(
            controlsCss,
          ).toContain(
            variable,
          );
        }
      },
    );


    it(
      "routes hover, pressed, disabled, focus-visible and loading visuals through CSS",
      () => {
        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="button"\]\[data-hovered\][\s\S]*--ui-action-hover-background/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="button"\]\[data-pressed\][\s\S]*--ui-action-pressed-background/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="pressable"\]\[data-focus-visible\]/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="control-action"\]\[data-disabled\]/,
        );

        expect(
          controlsCss,
        ).toMatch(
          /\[data-ui="button"\]\[data-loading\][\s\S]*\[data-ui="button-content"\]/,
        );
      },
    );


    it(
      "contains no important declarations",
      () => {
        expect(
          controlsCss,
        ).not.toContain(
          "!important",
        );

        expect(
          listCss,
        ).not.toContain(
          "!important",
        );
      },
    );


    it(
      "keeps ControlAction internal and on the generic state vocabulary",
      () => {
        expect(
          controlAction,
        ).toMatch(
          /\busePress\s*</,
        );

        expect(
          controlAction,
        ).toContain(
          "getActionControlStateAttributes",
        );

        expect(
          controlAction,
        ).toContain(
          'data-ui="control-action"',
        );

        expect(
          formsIndex,
        ).not.toMatch(
          /export[\s\S]*from\s+["']\.\/ControlAction["']/,
        );
      },
    );


    it(
      "makes List consume generic states without Pressable-specific selectors",
      () => {
        expect(
          listSource,
        ).toContain(
          "<Pressable",
        );

        for (
          const attribute of [
            "data-hovered",
            "data-focus-visible",
            "data-pressed",
          ]
        ) {
          expect(
            listCss,
          ).toContain(
            attribute,
          );
        }

        expect(
          listCss,
        ).not.toMatch(
          /data-ui(?:=|-)["']?pressable/,
        );
      },
    );


    it(
      "keeps FloatingActionButton free of duplicated interaction ownership",
      () => {
        expect(
          floatingActionButton,
        ).toContain(
          "<Pressable",
        );

        expect(
          floatingActionButton,
        ).not.toMatch(
          /\bcursor\s*:/,
        );

        expect(
          floatingActionButton,
        ).not.toMatch(
          /\bopacity\s*:/,
        );

        expect(
          floatingActionButton,
        ).not.toMatch(
          /\btransition\s*:/,
        );
      },
    );
  },
);
