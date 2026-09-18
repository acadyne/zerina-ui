// @vitest-environment node

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  renderToString,
} from "react-dom/server";

import {
  BUILT_IN_THEMES,
  UIThemeProvider,
  useUITheme,
} from "../../src/theme";


function ThemeProbe() {
  const {
    theme,
  } = useUITheme();


  return (
    <div>
      {theme.name}
    </div>
  );
}


describe(
  "UIThemeProvider server rendering",
  () => {
    it(
      "renders to string without accessing the DOM or emitting errors",
      () => {
        const consoleError =
          vi.spyOn(
            console,
            "error",
          )
            .mockImplementation(
              () => {},
            );


        const html =
          renderToString(
            <UIThemeProvider
              initialTheme="light"
              persist
              themes={
                BUILT_IN_THEMES
              }
            >
              <ThemeProbe />
            </UIThemeProvider>,
          );


        expect(
          html,
        ).toContain(
          "light",
        );


        expect(
          consoleError,
        ).not.toHaveBeenCalled();


        consoleError.mockRestore();
      },
    );
  },
);