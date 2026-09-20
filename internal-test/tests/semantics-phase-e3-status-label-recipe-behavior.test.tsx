import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Badge,
  Tag,
} from "zerina-ui";

import {
  statusLabelRecipe,
} from "../../src/components/display/status-label-recipe";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Phase E3 status-label recipe behavior",
  () => {
    it(
      "preserves solid, subtle and outline palette semantics",
      () => {
        expect(
          statusLabelRecipe({
            variant:
              "solid",

            colorScheme:
              "primary",
          }).root,
        ).toMatchObject({
          background:
            "var(--ui-primary)",

          color:
            "var(--ui-primary-contrast)",

          border:
            "1px solid transparent",
        });


        expect(
          statusLabelRecipe({
            variant:
              "subtle",

            colorScheme:
              "success",
          }).root,
        ).toMatchObject({
          background:
            "var(--ui-success-container)",

          color:
            "var(--ui-on-success-container)",

          border:
            "1px solid transparent",
        });


        expect(
          statusLabelRecipe({
            variant:
              "outline",

            colorScheme:
              "danger",
          }).root,
        ).toMatchObject({
          background:
            "transparent",

          color:
            "var(--ui-danger)",

          border:
            "1px solid color-mix(in srgb, var(--ui-danger) 38%, var(--ui-border))",
        });
      },
    );


    it(
      "owns the common inline geometry and truncation frame",
      () => {
        const recipe =
          statusLabelRecipe({
            variant:
              "subtle",

            colorScheme:
              "neutral",
          });


        expect(
          recipe.root,
        ).toMatchObject({
          display:
            "inline-flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap:
            "0.35rem",

          maxWidth:
            "100%",

          lineHeight:
            1,

          whiteSpace:
            "nowrap",
        });


        expect(
          recipe.content,
        ).toMatchObject({
          minWidth:
            0,

          overflow:
            "hidden",

          textOverflow:
            "ellipsis",
        });
      },
    );


    it(
      "keeps Badge and Tag density distinct while sharing defaults",
      () => {
        const container =
          renderDOM(
            <>
              <Badge
                data-testid="badge"
              >
                Badge
              </Badge>

              <Tag
                data-testid="tag"
              >
                Tag
              </Tag>
            </>,
          );


        const badge =
          getByTestId(
            container,
            "badge",
          );

        const tag =
          getByTestId(
            container,
            "tag",
          );


        expect(
          badge.getAttribute(
            "data-ui-badge-variant",
          ),
        ).toBe(
          "subtle",
        );

        expect(
          tag.getAttribute(
            "data-ui-tag-variant",
          ),
        ).toBe(
          "subtle",
        );

        expect(
          badge.getAttribute(
            "data-ui-badge-color-scheme",
          ),
        ).toBe(
          "neutral",
        );

        expect(
          tag.getAttribute(
            "data-ui-tag-color-scheme",
          ),
        ).toBe(
          "neutral",
        );


        expect(
          badge.style.minHeight,
        ).toBe(
          "22px",
        );

        expect(
          tag.style.minHeight,
        ).toBe(
          "28px",
        );

        expect(
          badge.style.fontWeight,
        ).toBe(
          "700",
        );

        expect(
          tag.style.fontWeight,
        ).toBe(
          "600",
        );
      },
    );


    it(
      "keeps local slot styles above the shared recipe",
      () => {
        const container =
          renderDOM(
            <>
              <Badge
                data-testid="badge"

                variant="solid"

                colorScheme="primary"

                styles={{
                  root: {
                    background:
                      "purple",
                  },
                }}
              >
                Badge
              </Badge>

              <Tag
                data-testid="tag"

                variant="solid"

                colorScheme="primary"

                styles={{
                  root: {
                    background:
                      "purple",
                  },
                }}
              >
                Tag
              </Tag>
            </>,
          );


        expect(
          getByTestId(
            container,
            "badge",
          ).style.background,
        ).toBe(
          "purple",
        );

        expect(
          getByTestId(
            container,
            "tag",
          ).style.background,
        ).toBe(
          "purple",
        );
      },
    );


    it(
      "keeps Tag remove behavior independent from the shared recipe",
      () => {
        const onRemove =
          vi.fn();

        const onRootClick =
          vi.fn();


        const container =
          renderDOM(
            <Tag
              data-testid="tag"

              onRemove={
                onRemove
              }

              onClick={
                onRootClick
              }
            >
              Removable
            </Tag>,
          );


        const remove =
          container.querySelector<HTMLButtonElement>(
            "[data-ui-tag-remove]",
          );


        expect(
          remove,
        ).not.toBeNull();


        clickElement(
          remove!,
        );


        expect(
          onRemove,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onRootClick,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
