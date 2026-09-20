import type {
  NavigationLinkMeta,
  NavigationNode,
} from "zerina-ui";

import {
  RoutedAdaptiveScaffold,
} from "zerina-ui";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  clickElement,
  renderDOM,
} from "./react-dom-test-utils";


type RouteMeta =
  NavigationLinkMeta & {
    analyticsId:
      string;

    section:
      "primary" | "secondary";
  };


const items:
  NavigationNode<RouteMeta>[] = [
    {
      id:
        "home",

      label:
        "Home",

      meta: {
        href:
          "/home",

        analyticsId:
          "nav-home",

        section:
          "primary",
      },
    },

    {
      id:
        "reports",

      label:
        "Reports",

      meta: {
        href:
          "/reports",

        analyticsId:
          "nav-reports",

        section:
          "secondary",
      },
    },

    {
      id:
        "local",

      label:
        "Local",

      meta: {
        analyticsId:
          "nav-local",

        section:
          "secondary",
      },
    },
  ];


function getDestinationButton(
  container:
    ParentNode,
  label:
    string,
): HTMLButtonElement {
  const button =
    Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        "[data-ui-bottom-navigation-item]",
      ),
    ).find(
      (candidate) =>
        candidate.textContent?.includes(
          label,
        ),
    );

  if (!button) {
    throw new Error(
      `Navigation destination "${label}" was not found.`,
    );
  }

  return button;
}


describe(
  "Phase 5 RoutedAdaptiveScaffold metadata",
  () => {
    it(
      "forwards the exact typed navigation node to item-change and navigate",
      () => {
        const navigate =
          vi.fn();

        const onItemChange =
          vi.fn();

        const rendered =
          renderDOM(
            <RoutedAdaptiveScaffold<RouteMeta>
              mode="mobile"
              showAppBar={false}
              items={items}
              defaultActiveId="home"
              navigate={
                navigate
              }
              onItemChange={
                onItemChange
              }
            >
              Content
            </RoutedAdaptiveScaffold>,
          );

        clickElement(
          getDestinationButton(
            rendered,
            "Reports",
          ),
        );

        expect(
          onItemChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onItemChange.mock
            .calls[0]?.[0],
        ).toBe(
          items[1],
        );

        expect(
          navigate,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          navigate.mock
            .calls[0],
        ).toEqual([
          "/reports",
          items[1],
        ]);
      },
    );

    it(
      "still reports selection when the typed metadata has no href",
      () => {
        const navigate =
          vi.fn();

        const onItemChange =
          vi.fn();

        const rendered =
          renderDOM(
            <RoutedAdaptiveScaffold<RouteMeta>
              mode="mobile"
              showAppBar={false}
              items={items}
              defaultActiveId="home"
              navigate={
                navigate
              }
              onItemChange={
                onItemChange
              }
            >
              Content
            </RoutedAdaptiveScaffold>,
          );

        clickElement(
          getDestinationButton(
            rendered,
            "Local",
          ),
        );

        expect(
          onItemChange,
        ).toHaveBeenCalledWith(
          items[2],
        );

        expect(
          navigate,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
