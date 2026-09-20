import type {
  ReactNode,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  AdaptiveScaffold,
  NavigationPresenter,
  OverlayProvider,
} from "zerina-ui";

import {
  clickElement,
  renderDOM,
} from "./react-dom-test-utils";


function renderWithOverlay(
  node:
    ReactNode,
) {
  return renderDOM(
    <OverlayProvider
      ownerDocument={
        document
      }
    >
      {node}
    </OverlayProvider>,
  );
}


const items = [
  {
    id:
      "home",

    label:
      "Home",

    icon:
      "H",
  },

  {
    id:
      "workspace",

    label:
      "Workspace",

    icon:
      "W",

    children: [
      {
        id:
          "projects",

        label:
          "Projects",

        icon:
          "P",
      },

      {
        id:
          "reports",

        label:
          "Reports",

        icon:
          "R",
      },
    ],
  },

  {
    id:
      "settings",

    label:
      "Settings",

    icon:
      "S",
  },

  {
    id:
      "billing",

    label:
      "Billing",

    icon:
      "B",
  },
];


describe(
  "Phase 3 NavigationPresenter behavior",
  () => {
    it(
      "projects nested destinations into bottom navigation and routes overflow through one More drawer",
      () => {
        const onSelect =
          vi.fn();

        const rendered =
          renderWithOverlay(
            <NavigationPresenter
              items={items}
              presentation="bottom"
              activeId="reports"
              onSelect={
                onSelect
              }
              compactPolicy={{
                maxVisible: {
                  bottom:
                    3,
                },
              }}
              drawerProps={{
                portalled:
                  false,

                autoFocus:
                  false,

                restoreFocus:
                  false,
              }}
            />,
          );

        const destinationButtons =
          rendered.querySelectorAll(
            "[data-ui-bottom-navigation-item]",
          );

        expect(
          destinationButtons
            .length,
        ).toBe(
          3,
        );

        expect(
          Array.from(
            rendered.querySelectorAll(
              "[data-ui-bottom-navigation-item-label]",
            ),
          ).map(
            (label) =>
              label.textContent,
          ),
        ).toEqual([
          "Home",
          "Projects",
          "Más",
        ]);

        const overflow =
          rendered.querySelector<HTMLButtonElement>(
            "[data-ui-navigation-presenter-overflow]",
          );

        if (!overflow) {
          throw new Error(
            "Overflow destination was not rendered.",
          );
        }

        expect(
          overflow.getAttribute(
            "aria-current",
          ),
        ).toBe(
          "page",
        );

        clickElement(
          overflow,
        );

        expect(
          rendered.querySelector(
            "[data-ui-drawer-navigation]",
          ),
        ).not.toBeNull();

        const reports =
          rendered.querySelector<HTMLButtonElement>(
            '[data-ui-navigation-list-item-id="reports"] button',
          );

        if (!reports) {
          throw new Error(
            "Overflow drawer did not expose the nested report destination.",
          );
        }

        clickElement(
          reports,
        );

        expect(
          onSelect,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onSelect.mock
            .calls[0]?.[0]?.id,
        ).toBe(
          "reports",
        );
      },
    );

    it(
      "uses the same hierarchical source for an explicit drawer presentation",
      () => {
        const rendered =
          renderWithOverlay(
            <NavigationPresenter
              items={items}
              presentation="drawer"
              activeId="projects"
              drawerOpen
              drawerProps={{
                portalled:
                  false,

                autoFocus:
                  false,

                restoreFocus:
                  false,
              }}
            />,
          );

        expect(
          rendered.querySelector(
            "[data-ui-drawer-navigation]",
          ),
        ).not.toBeNull();

        expect(
          rendered.querySelector(
            '[data-ui-navigation-list-item-id="workspace"]',
          ),
        ).not.toBeNull();

        expect(
          rendered.querySelector(
            '[data-ui-navigation-list-item-id="projects"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "uses the same presenter from AdaptiveScaffold across mobile and desktop hierarchy",
      () => {
        const mobile =
          renderWithOverlay(
            <AdaptiveScaffold
              mode="mobile"
              showAppBar={false}
              items={items}
              activeId="reports"
              navigation={{
                compact: {
                  maxVisible: {
                    bottom:
                      3,
                  },
                },

                drawer: {
                  portalled:
                    false,

                  autoFocus:
                    false,

                  restoreFocus:
                    false,
                },
              }}
            >
              Content
            </AdaptiveScaffold>,
          );

        expect(
          mobile.querySelector(
            "[data-ui-bottom-navigation]",
          ),
        ).not.toBeNull();

        expect(
          mobile.querySelector(
            "[data-ui-navigation-presenter-overflow]",
          ),
        ).not.toBeNull();

        const desktop =
          renderWithOverlay(
            <AdaptiveScaffold
              mode="desktop"
              showAppBar={false}
              items={items}
              activeId="reports"
            >
              Content
            </AdaptiveScaffold>,
          );

        const parent =
          desktop.querySelector<HTMLElement>(
            '[data-ui-navigation-list-item-id="workspace"]',
          );

        const activeChild =
          desktop.querySelector<HTMLElement>(
            '[data-ui-navigation-list-item-id="reports"]',
          );

        expect(
          parent?.getAttribute(
            "data-active",
          ),
        ).toBe(
          "true",
        );

        expect(
          activeChild?.getAttribute(
            "data-current",
          ),
        ).toBe(
          "true",
        );
      },
    );

    it(
      "keeps rail side semantics and projection under the same presenter",
      () => {
        const rendered =
          renderWithOverlay(
            <AdaptiveScaffold
              mode="tablet"
              showAppBar={false}
              items={items}
              activeId="settings"
              navigation={{
                tablet: {
                  presentation:
                    "rail",

                  placement:
                    "end",
                },

                compact: {
                  maxVisible: {
                    rail:
                      3,
                  },
                },

                drawer: {
                  portalled:
                    false,

                  autoFocus:
                    false,

                  restoreFocus:
                    false,
                },
              }}
            >
              Content
            </AdaptiveScaffold>,
          );

        expect(
          rendered.querySelector(
            '[data-ui-navigation-rail-placement="right"]',
          ),
        ).not.toBeNull();

        expect(
          rendered.querySelector(
            "[data-ui-navigation-presenter-overflow]",
          ),
        ).not.toBeNull();
      },
    );
  },
);
