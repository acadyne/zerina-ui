// Fase F: clases A/B — architecture boundary + public API contract.
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
  "Block 7 action-control architecture contract",
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

    const sharedTypes =
      readSource(
        "primitives/forms/shared-control-types.ts",
      );

    const formsIndex =
      readSource(
        "primitives/forms/index.ts",
      );

    const controlsCss =
      readSource(
        "styles/controls.css",
      );

    const interactiveRecipe =
      readSource(
        "theme/recipes/interactive-state-recipe.ts",
      );

    const interactiveCss =
      readSource(
        "theme/recipes/interactive-state.css",
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
          /export type ActionControlSize\s*=\s*ControlSize/s,
        );

        expect(
          sharedTypes,
        ).toMatch(
          /export type ControlSize\s*=\s*\|\s*"sm"\s*\|\s*"md"\s*\|\s*"lg"/s,
        );

        expect(
          types,
        ).toMatch(
          /export type ActionControlVariant\s*=\s*\|\s*"solid"\s*\|\s*"outline"\s*\|\s*"ghost"/s,
        );

        expect(
          types,
        ).toMatch(
          /export type ActionControlColorScheme\s*=\s*ControlColorScheme/s,
        );

        expect(
          sharedTypes,
        ).toMatch(
          /import type\s*\{\s*UITone,\s*\}\s*from\s*"\.\.\/\.\.\/theme\/contracts\/visual-semantics";/s,
        );

        expect(
          sharedTypes,
        ).toMatch(
          /export type ControlColorScheme\s*=\s*Extract<\s*UITone,\s*\|\s*"primary"\s*\|\s*"secondary"\s*\|\s*"danger"\s*>;/s,
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

      },
    );


    it(
      "derives action visuals from the shared interactive state vocabulary",
      () => {
        expect(
          recipe,
        ).toContain(
          "interactiveStateRecipe",
        );

        expect(
          recipe,
        ).not.toContain(
          "SCHEME_MAP",
        );

        for (
          const variable of [
            "--ui-interactive-background",
            "--ui-interactive-hover-background",
            "--ui-interactive-focus-background",
            "--ui-interactive-pressed-background",
            "--ui-interactive-selected-background",
            "--ui-interactive-focus-ring-color",
            "--ui-interactive-disabled-opacity",
          ]
        ) {
          expect(
            interactiveRecipe,
          ).toContain(
            variable,
          );

          expect(
            interactiveCss,
          ).toContain(
            variable,
          );
        }

        expect(
          recipe,
        ).not.toContain(
          "--ui-action-",
        );

        expect(
          controlsCss,
        ).not.toContain(
          "--ui-action-",
        );
      },
    );


    it(
      "routes shared hover, pressed, selected, disabled and focus-visible visuals through one CSS owner",
      () => {
        for (
          const attribute of [
            "data-hovered",
            "data-pressed",
            "data-selected",
            "data-focus-visible",
            "data-disabled",
          ]
        ) {
          expect(
            interactiveCss,
          ).toContain(
            attribute,
          );
        }

        expect(
          button,
        ).toContain(
          '"data-ui-interactive"',
        );

        expect(
          iconButton,
        ).toContain(
          '"data-ui-interactive"',
        );

        expect(
          controlAction,
        ).toContain(
          'data-ui-interactive=""',
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
      "makes List consume the shared interactive projection without local hover or press maps",
      () => {
        expect(
          listSource,
        ).toContain(
          "<Pressable",
        );

        expect(
          listSource,
        ).toContain(
          "interactiveStateRecipe",
        );

        expect(
          listSource,
        ).toContain(
          'data-ui-interactive=""',
        );

        expect(
          listCss,
        ).not.toContain(
          "data-hovered",
        );

        expect(
          listCss,
        ).not.toContain(
          "data-pressed",
        );

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
        ).toContain(
          "interactiveStateRecipe",
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
