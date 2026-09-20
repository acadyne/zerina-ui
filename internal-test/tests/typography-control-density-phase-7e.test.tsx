import {
  describe,
  expect,
  it,
} from "vitest";

import {
  Heading,
  Typography,
  typographyRecipe,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Phase 7E semantic typography and control density",
  () => {
    it(
      "projects every typography role through one semantic recipe",
      () => {
        expect(
          typographyRecipe({
            role:
              "headline",
          }),
        ).toEqual({
          fontFamily:
            "var(--ui-type-headline-font-family)",

          fontSize:
            "var(--ui-type-headline-font-size)",

          fontWeight:
            "var(--ui-type-headline-font-weight)",

          lineHeight:
            "var(--ui-type-headline-line-height)",

          letterSpacing:
            "var(--ui-type-headline-letter-spacing)",
        });

        expect(
          typographyRecipe({
            role:
              "caption",
          }),
        ).toEqual({
          fontFamily:
            "var(--ui-type-caption-font-family)",

          fontSize:
            "var(--ui-type-caption-font-size)",

          fontWeight:
            "var(--ui-type-caption-font-weight)",

          lineHeight:
            "var(--ui-type-caption-line-height)",

          letterSpacing:
            "var(--ui-type-caption-letter-spacing)",
        });
      },
    );


    it(
      "keeps typography semantics separate from the native ARIA role attribute",
      () => {
        const container =
          renderDOM(
            <>
              <Typography
                data-testid="caption"
                typographyRole="caption"
                role="status"
              >
                Estado
              </Typography>

              <Heading
                data-testid="display"
                typographyRole="display"
              >
                Zerina
              </Heading>
            </>,
          );

        const caption =
          getByTestId<HTMLElement>(
            container,
            "caption",
          );

        const display =
          getByTestId<HTMLElement>(
            container,
            "display",
          );


        expect(
          caption.getAttribute(
            "role",
          ),
        ).toBe(
          "status",
        );

        expect(
          caption.getAttribute(
            "data-ui-typography-role",
          ),
        ).toBe(
          "caption",
        );

        expect(
          caption.style.fontFamily,
        ).toBe(
          "var(--ui-type-caption-font-family)",
        );

        expect(
          caption.style.letterSpacing,
        ).toBe(
          "var(--ui-type-caption-letter-spacing)",
        );

        expect(
          display.getAttribute(
            "data-ui-typography-role",
          ),
        ).toBe(
          "display",
        );

        expect(
          display.style.fontSize,
        ).toBe(
          "var(--ui-type-display-font-size)",
        );
      },
    );


    it(
      "keeps legacy size props as explicit overrides without replacing the semantic family",
      () => {
        const container =
          renderDOM(
            <Typography
              data-testid="legacy-size"
              typographyRole="caption"
              size="xl"
            >
              Override
            </Typography>,
          );

        const element =
          getByTestId<HTMLElement>(
            container,
            "legacy-size",
          );


        expect(
          element.style.fontSize,
        ).toBe(
          "var(--ui-font-size-xl)",
        );

        expect(
          element.style.fontFamily,
        ).toBe(
          "var(--ui-type-caption-font-family)",
        );

        expect(
          element.style.lineHeight,
        ).toBe(
          "var(--ui-type-caption-line-height)",
        );
      },
    );
  },
);
