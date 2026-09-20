import React from "react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  act,
} from "react";

import {
  createRoot,
  type Root,
} from "react-dom/client";

import {
  UIThemeProvider,
  createThemeDefinition,
  useUITheme,
} from "../../src/theme";

import type {
  ResolvedTheme,
  ThemeDefinition,
  ThemeName,
} from "../../src/theme";


const parentTheme =
  createThemeDefinition({
    name:
      "resolved-parent",

    source:
      "custom",

    metadata: {
      label:
        "Resolved Parent",

      colorScheme:
        "dark",
    },

    tokens: {
      color: {
        primary:
          "#123456",
      },

      extensions: {
        inherited:
          "parent-value",

        overridden:
          "parent-value",
      },
    },
  });


const childTheme =
  createThemeDefinition({
    name:
      "resolved-child",

    source:
      "custom",

    extends:
      "resolved-parent",

    metadata: {
      label:
        "Resolved Child",
    },

    tokens: {
      color: {
        primaryHover:
          "#654321",
      },

      extensions: {
        overridden:
          "child-value",

        childOnly:
          true,
      },
    },
  });


const contextThemes = [
  parentTheme,
  childTheme,
] as const;


type ThemeContextSnapshot = {
  theme:
    ThemeDefinition | null;

  resolvedTheme:
    ResolvedTheme | null;

  setTheme:
    (
      (
        name:
          ThemeName,
      ) => void
    ) | null;
};


const mountedRoots:
  Array<{
    root:
      Root;

    container:
      HTMLDivElement;
  }> = [];


function ContextProbe({
  snapshot,
}: {
  snapshot:
    ThemeContextSnapshot;
}) {
  const {
    theme,
    resolvedTheme,
    setTheme,
  } = useUITheme();


  React.useLayoutEffect(() => {
    snapshot.theme =
      theme;

    snapshot.resolvedTheme =
      resolvedTheme;

    snapshot.setTheme =
      setTheme;
  }, [
    snapshot,
    theme,
    resolvedTheme,
    setTheme,
  ]);


  return (
    <div>
      {theme.name}

      {"|"}

      {resolvedTheme.name}
    </div>
  );
}


async function mountContext():
  Promise<{
    snapshot:
      ThemeContextSnapshot;

    root:
      Root;

    container:
      HTMLDivElement;
  }> {
  const container =
    document.createElement(
      "div",
    );


  document.body.appendChild(
    container,
  );


  const root =
    createRoot(
      container,
    );


  const snapshot:
    ThemeContextSnapshot = {
      theme:
        null,

      resolvedTheme:
        null,

      setTheme:
        null,
    };


  await act(async () => {
    root.render(
      <UIThemeProvider
        initialTheme="resolved-child"
        persist={
          false
        }
        themes={
          contextThemes
        }
      >
        <ContextProbe
          snapshot={
            snapshot
          }
        />
      </UIThemeProvider>,
    );
  });


  mountedRoots.push({
    root,
    container,
  });


  return {
    snapshot,
    root,
    container,
  };
}


afterEach(async () => {
  for (
    const mounted of
    mountedRoots.splice(
      0,
    )
  ) {
    await act(async () => {
      mounted.root.unmount();
    });


    mounted.container.remove();
  }


  delete document.documentElement
    .dataset
    .uiTheme;
});


describe(
  "useUITheme resolved theme",
  () => {
    it(
      "keeps theme as the original registered definition",
      async () => {
        const {
          snapshot,
        } =
          await mountContext();


        expect(
          snapshot.theme?.name,
        ).toBe(
          "resolved-child",
        );


        expect(
          snapshot.theme?.extends,
        ).toBe(
          "resolved-parent",
        );


        expect(
          snapshot.theme
            ?.metadata
            ?.colorScheme,
        ).toBeUndefined();


        expect(
          snapshot.theme
            ?.tokens
            ?.surface
            ?.canvas,
        ).toBeUndefined();
      },
    );


    it(
      "exposes defaults, inheritance and effective colorScheme through resolvedTheme",
      async () => {
        const {
          snapshot,
        } =
          await mountContext();


        expect(
          snapshot.resolvedTheme
            ?.name,
        ).toBe(
          "resolved-child",
        );


        expect(
          snapshot.resolvedTheme
            ?.metadata
            .colorScheme,
        ).toBe(
          "dark",
        );


        expect(
          snapshot.resolvedTheme
            ?.tokens
            .color
            ?.primary,
        ).toBe(
          "#123456",
        );


        expect(
          snapshot.resolvedTheme
            ?.tokens
            .color
            ?.primaryHover,
        ).toBe(
          "#654321",
        );


        expect(
          snapshot.resolvedTheme
            ?.tokens
            .surface
            ?.canvas,
        ).toBe(
          "#0b0d10",
        );
      },
    );


    it(
      "includes inherited and overridden extension tokens",
      async () => {
        const {
          snapshot,
        } =
          await mountContext();


        expect(
          snapshot.resolvedTheme
            ?.tokens
            .extensions,
        ).toMatchObject({
          inherited:
            "parent-value",

          overridden:
            "child-value",

          childOnly:
            true,
        });
      },
    );


    it(
      "updates theme and resolvedTheme coherently when the active theme changes",
      async () => {
        const {
          snapshot,
          container,
        } =
          await mountContext();


        expect(
          snapshot.setTheme,
        ).not.toBeNull();


        await act(async () => {
          snapshot.setTheme?.(
            "resolved-parent",
          );
        });


        expect(
          snapshot.theme?.name,
        ).toBe(
          "resolved-parent",
        );


        expect(
          snapshot.resolvedTheme
            ?.name,
        ).toBe(
          "resolved-parent",
        );


        expect(
          snapshot.theme
            ?.metadata
            ?.colorScheme,
        ).toBe(
          "dark",
        );


        expect(
          snapshot.resolvedTheme
            ?.metadata
            .colorScheme,
        ).toBe(
          "dark",
        );


        expect(
          container.textContent,
        ).toBe(
          "resolved-parent|resolved-parent",
        );
      },
    );
  },
);