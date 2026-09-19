import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  UIViewportProvider,
  useUIViewport,
} from "zerina-ui";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function ViewportProbe() {
  const viewport =
    useUIViewport();


  return (
    <button
      type="button"
      data-testid="viewport-mode"
      onClick={() => {
        viewport.setMobileMode();
      }}
    >
      {viewport.mode}
    </button>
  );
}


describe(
  "UIViewportProvider controllable mode behavior",
  () => {
    it(
      "updates its shared source of truth when mode is uncontrolled",
      () => {
        const onModeChange =
          vi.fn();

        const container =
          renderDOM(
            <UIViewportProvider
              defaultMode="desktop"
              onModeChange={
                onModeChange
              }
            >
              <ViewportProbe />
            </UIViewportProvider>,
          );

        const modeButton =
          getByTestId<HTMLButtonElement>(
            container,
            "viewport-mode",
          );


        expect(
          modeButton.textContent,
        ).toBe(
          "desktop",
        );


        clickElement(
          modeButton,
        );


        expect(
          modeButton.textContent,
        ).toBe(
          "mobile",
        );

        expect(
          onModeChange,
        ).toHaveBeenLastCalledWith(
          "mobile",
        );
      },
    );


    it(
      "keeps controlled mode owned by the public value while still reporting intent",
      () => {
        const onModeChange =
          vi.fn();

        const container =
          renderDOM(
            <UIViewportProvider
              mode="desktop"
              onModeChange={
                onModeChange
              }
            >
              <ViewportProbe />
            </UIViewportProvider>,
          );

        const modeButton =
          getByTestId<HTMLButtonElement>(
            container,
            "viewport-mode",
          );


        clickElement(
          modeButton,
        );


        expect(
          onModeChange,
        ).toHaveBeenLastCalledWith(
          "mobile",
        );

        expect(
          modeButton.textContent,
        ).toBe(
          "desktop",
        );
      },
    );
  },
);
