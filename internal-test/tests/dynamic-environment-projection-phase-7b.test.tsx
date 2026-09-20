import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  UIMotionProvider,
  useUIMotion,
} from "zerina-ui";

import {
  UI_MOTION_POLICY_CSS_VARIABLES,
} from "../../src/core/motion/motion.tokens";

import {
  resolveUIDensity,
} from "../../src/core/viewport/viewport.utils";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";



function MotionProbe() {
  const motion =
    useUIMotion();

  return (
    <button
      type="button"
      data-testid="motion-level"
      onClick={() => {
        motion.setLevel(
          "none",
        );
      }}
    >
      {motion.effectiveLevel}
    </button>
  );
}


function clearMotionDocumentState(): void {
  const root =
    document.documentElement;

  root.removeAttribute(
    "data-ui-motion",
  );

  root.removeAttribute(
    "data-ui-motion-effective",
  );

  root.removeAttribute(
    "data-ui-reduced-motion",
  );

  for (
    const property of
    UI_MOTION_POLICY_CSS_VARIABLES
  ) {
    root.style.removeProperty(
      property,
    );
  }
}


describe(
  "Phase 7B dynamic environment projection",
  () => {
    beforeEach(() => {
      clearMotionDocumentState();
    });


    it(
      "publishes one canonical CSS motion policy while the effective level remains the document switch",
      () => {
        const container =
          renderDOM(
            <UIMotionProvider
              defaultLevel="subtle"
              respectReducedMotion={
                false
              }
            >
              <MotionProbe />
            </UIMotionProvider>,
          );

        const root =
          document.documentElement;

        const button =
          getByTestId<HTMLButtonElement>(
            container,
            "motion-level",
          );


        expect(
          root.getAttribute(
            "data-ui-motion-effective",
          ),
        ).toBe(
          "subtle",
        );

        expect(
          root.style.getPropertyValue(
            "--ui-motion-token-duration-fast",
          ),
        ).toBe(
          "120ms",
        );

        expect(
          root.style.getPropertyValue(
            "--ui-motion-token-ease-standard",
          ),
        ).toBe(
          "cubic-bezier(0.2, 0, 0, 1)",
        );

        expect(
          root.style.getPropertyValue(
            "--ui-duration-fast",
          ),
        ).toBe(
          "",
        );


        clickElement(
          button,
        );


        expect(
          button.textContent,
        ).toBe(
          "none",
        );

        expect(
          root.getAttribute(
            "data-ui-motion-effective",
          ),
        ).toBe(
          "none",
        );

        expect(
          root.style.getPropertyValue(
            "--ui-motion-token-duration-fast",
          ),
        ).toBe(
          "120ms",
        );

        expect(
          root.style.getPropertyValue(
            "--ui-motion-token-distance-lg",
          ),
        ).toBe(
          "14px",
        );

        expect(
          root.style.getPropertyValue(
            "--ui-motion-token-scale-expressive",
          ),
        ).toBe(
          "0.96",
        );
      },
    );


    it(
      "keeps touch and hybrid auto density comfortable before constrained geometry",
      () => {
        const base = {
          densityMode:
            "auto" as const,

          width:
            390,

          height:
            740,

          isShort:
            false,

          isNarrow:
            true,

          isWide:
            false,

          isTall:
            false,
        };


        expect(
          resolveUIDensity({
            ...base,
            inputKind:
              "touch",
          }),
        ).toBe(
          "comfortable",
        );

        expect(
          resolveUIDensity({
            ...base,
            inputKind:
              "hybrid",
          }),
        ).toBe(
          "comfortable",
        );

        expect(
          resolveUIDensity({
            ...base,
            inputKind:
              "unknown",
          }),
        ).toBe(
          "comfortable",
        );

        expect(
          resolveUIDensity({
            ...base,
            inputKind:
              "mouse",
          }),
        ).toBe(
          "compact",
        );
      },
    );


    it(
      "uses the resolved tall signal instead of a hidden fixed height for spacious density",
      () => {
        const base = {
          densityMode:
            "auto" as const,

          inputKind:
            "mouse" as const,

          width:
            1280,

          height:
            720,

          isShort:
            false,

          isNarrow:
            false,

          isWide:
            true,
        };


        expect(
          resolveUIDensity({
            ...base,
            isTall:
              true,
          }),
        ).toBe(
          "spacious",
        );

        expect(
          resolveUIDensity({
            ...base,
            isTall:
              false,
          }),
        ).toBe(
          "comfortable",
        );
      },
    );


    it(
      "preserves explicit density as the controlling public choice",
      () => {
        expect(
          resolveUIDensity({
            densityMode:
              "spacious",

            inputKind:
              "touch",

            width:
              320,

            height:
              420,

            isShort:
              true,

            isNarrow:
              true,

            isWide:
              false,

            isTall:
              false,
          }),
        ).toBe(
          "spacious",
        );
      },
    );
  },
);
