import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AdaptiveScaffold,
  Scaffold,
  ScreenContent,
} from "zerina-ui";

import {
  renderDOM,
} from "./react-dom-test-utils";

const items = [
  {
    id: "home",
    label: "Home",
    icon: "H",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "S",
  },
];

describe(
  "Phase 2C scaffold ownership behavior",
  () => {
    it(
      "keeps Scaffold structural while ScreenContent owns content scroll",
      () => {
        const rendered =
          renderDOM(
            <Scaffold
              viewport="contained"
              id="direct-scaffold-root"
              data-testid="scaffold"
              appBar={
                <div>
                  Header
                </div>
              }
              footer={
                <div>
                  Footer
                </div>
              }
            >
              <ScreenContent
                scrollable
                data-testid="content-scroll"
              >
                Content
              </ScreenContent>
            </Scaffold>
          );

        const scaffold =
          rendered.querySelector<HTMLElement>(
            '[data-testid="scaffold"]'
          );

        const contentScroll =
          rendered.querySelector<HTMLElement>(
            '[data-testid="content-scroll"]'
          );

        expect(
          scaffold?.id
        ).toBe(
          "direct-scaffold-root"
        );

        expect(
          scaffold?.querySelectorAll(
            '[data-ui-screen-content-scrollable="true"]'
          ).length
        ).toBe(
          1
        );

        expect(
          contentScroll?.style.overflowY
        ).toBe(
          "auto"
        );

        expect(
          scaffold?.querySelector(
            "header"
          )
        ).not.toBeNull();

        expect(
          scaffold?.querySelector(
            "footer"
          )
        ).not.toBeNull();
      }
    );

    it(
      "lets custom tablet bottom navigation replace the built-in navigation",
      () => {
        const rendered =
          renderDOM(
            <AdaptiveScaffold
              mode="tablet"
              showAppBar={false}
              items={items}
              tabletNavigation="bottom"
              navigationSlots={{
                tablet: {
                  placement:
                    "bottom",

                  content: (
                    <div
                      data-testid="custom-tablet-navigation"
                    >
                      Custom
                    </div>
                  ),
                },
              }}
            >
              Content
            </AdaptiveScaffold>
          );

        expect(
          rendered.querySelectorAll(
            '[data-testid="custom-tablet-navigation"]'
          ).length
        ).toBe(
          1
        );

        expect(
          rendered.querySelector(
            "[data-ui-bottom-navigation]"
          )
        ).toBeNull();

        const customWrapper =
          rendered.querySelector<HTMLElement>(
            '[data-ui-adaptive-scaffold-custom-navigation][data-ui-adaptive-scaffold-navigation-placement="bottom"]'
          );

        expect(
          customWrapper?.closest(
            "footer"
          )
        ).not.toBeNull();
      }
    );

    it(
      "derives right rail semantics from end placement",
      () => {
        const rendered =
          renderDOM(
            <AdaptiveScaffold
              mode="tablet"
              showAppBar={false}
              items={items}
              tabletNavigation="rail"
              navigationSlots={{
                tablet: {
                  placement:
                    "end",
                },
              }}
            >
              Content
            </AdaptiveScaffold>
          );

        expect(
          rendered.querySelector(
            '[data-ui-navigation-rail-placement="right"]'
          )
        ).not.toBeNull();
      }
    );

    it(
      "keeps sidebar width and rail width as independent contracts",
      () => {
        const sidebar =
          renderDOM(
            <AdaptiveScaffold
              mode="desktop"
              showAppBar={false}
              items={items}
              desktopNavigation="sidebar"
              sidebarWidth={320}
            >
              Content
            </AdaptiveScaffold>
          );

        const rail =
          renderDOM(
            <AdaptiveScaffold
              mode="tablet"
              showAppBar={false}
              items={items}
              tabletNavigation="rail"
              navigationRailProps={{
                width:
                  104,
              }}
            >
              Content
            </AdaptiveScaffold>
          );

        expect(
          sidebar.querySelector<HTMLElement>(
            "[data-ui-adaptive-scaffold-sidebar]"
          )?.style.width
        ).toBe(
          "320px"
        );

        expect(
          rail.querySelector<HTMLElement>(
            "[data-ui-navigation-rail]"
          )?.style.width
        ).toBe(
          "104px"
        );
      }
    );
  }
);
