import {
  describe,
  expect,
  it,
} from "vitest";

import {
  List,
} from "zerina-ui";

import {
  mergeAriaIds,
} from "../../src/core/dom/aria";

import {
  hasNonEmptyRenderableNode,
  hasRenderableNode,
} from "../../src/core/react/nodePresence";

import {
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "shared ReactNode presence contract",
  () => {
    it(
      "treats React-ignored nodes as absent while preserving zero",
      () => {
        expect(
          hasRenderableNode(null),
        ).toBe(false);

        expect(
          hasRenderableNode(undefined),
        ).toBe(false);

        expect(
          hasRenderableNode(false),
        ).toBe(false);

        expect(
          hasRenderableNode(true),
        ).toBe(false);

        expect(
          hasRenderableNode(0),
        ).toBe(true);

        expect(
          hasRenderableNode(""),
        ).toBe(true);

        expect(
          hasNonEmptyRenderableNode(""),
        ).toBe(false);

        expect(
          hasNonEmptyRenderableNode(0),
        ).toBe(true);
      },
    );


    it(
      "does not make List.Section create empty semantic header references for booleans",
      () => {
        const container =
          renderDOM(
            <List>
              <List.Section
                label={false}
                description={true}
              >
                <List.Item
                  title="Item"
                />
              </List.Section>
            </List>,
          );

        const section =
          container.querySelector<HTMLElement>(
            "[data-ui-list-section]",
          );

        expect(section).not.toBeNull();

        expect(
          section?.querySelector(
            "header",
          ),
        ).toBeNull();

        expect(
          section?.getAttribute(
            "aria-labelledby",
          ),
        ).toBeNull();

        expect(
          section?.getAttribute(
            "aria-describedby",
          ),
        ).toBeNull();
      },
    );


    it(
      "keeps numeric zero as valid section content",
      () => {
        const container =
          renderDOM(
            <List>
              <List.Section
                label={0}
              >
                <List.Item
                  title="Item"
                />
              </List.Section>
            </List>,
          );

        const section =
          container.querySelector<HTMLElement>(
            "[data-ui-list-section]",
          );

        const labelId =
          section?.getAttribute(
            "aria-labelledby",
          );

        expect(labelId).toBeTruthy();

        expect(
          labelId
            ? container.ownerDocument
                .getElementById(
                  labelId,
                )
                ?.textContent
            : null,
        ).toBe("0");
      },
    );
  },
);


describe(
  "shared ARIA id composition",
  () => {
    it(
      "normalizes whitespace, removes duplicates and preserves order",
      () => {
        expect(
          mergeAriaIds(
            "alpha beta",
            undefined,
            " beta   gamma ",
            false,
            "alpha delta",
          ),
        ).toBe(
          "alpha beta gamma delta",
        );
      },
    );

    it(
      "returns undefined when no usable IDs exist",
      () => {
        expect(
          mergeAriaIds(
            undefined,
            null,
            false,
            "   ",
          ),
        ).toBeUndefined();
      },
    );
  },
);
