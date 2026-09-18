import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  NavigationStack,
  TabScaffold,
} from "zerina-ui";

import {
  useNavigationEntries,
} from "../../src/patterns/navigation-stack/useNavigationEntries";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


function UncontrolledHistory({
  initialName,
  onEntriesChange,
}: {
  initialName:
    string | null;

  onEntriesChange?: (
    entries:
      Array<{
        key:
          string;

        name:
          string;
      }>,

    direction:
      | "forward"
      | "back"
      | "replace",
  ) => void;
}) {
  const history =
    useNavigationEntries({
      initialName,
      onEntriesChange,
    });


  return (
    <>
      <output
        data-testid="entries"
      >
        {
          history.entries
            .map(
              (
                entry,
              ) =>
                entry.name,
            )
            .join(
              ">",
            )
        }
      </output>

      <output
        data-testid="direction"
      >
        {
          history
            .transitionDirection ??
          ""
        }
      </output>

      <button
        type="button"
        data-testid="push"
        onClick={() => {
          history.push(
            "detail",
          );
        }}
      >
        Push
      </button>

      <button
        type="button"
        data-testid="replace"
        onClick={() => {
          history.replace(
            "edit",
          );
        }}
      >
        Replace
      </button>

      <button
        type="button"
        data-testid="pop"
        onClick={
          history.pop
        }
      >
        Pop
      </button>

      <button
        type="button"
        data-testid="root"
        onClick={
          history.popToRoot
        }
      >
        Root
      </button>

      <button
        type="button"
        data-testid="reset"
        onClick={() => {
          history.reset(
            "reset",
          );
        }}
      >
        Reset
      </button>
    </>
  );
}


describe(
  "Phase D2 shared navigation entries behavior",
  () => {
    it(
      "owns the common push/replace/pop/popToRoot/reset algebra",
      () => {
        const onEntriesChange =
          vi.fn();


        const container =
          renderDOM(
            <UncontrolledHistory
              initialName="home"
              onEntriesChange={
                onEntriesChange
              }
            />,
          );


        const entries =
          getByTestId(
            container,
            "entries",
          );

        const direction =
          getByTestId(
            container,
            "direction",
          );


        expect(
          entries.textContent,
        ).toBe(
          "home",
        );

        expect(
          direction.textContent,
        ).toBe(
          "replace",
        );


        clickElement(
          getByTestId(
            container,
            "push",
          ),
        );

        expect(
          entries.textContent,
        ).toBe(
          "home>detail",
        );

        expect(
          direction.textContent,
        ).toBe(
          "forward",
        );


        clickElement(
          getByTestId(
            container,
            "replace",
          ),
        );

        expect(
          entries.textContent,
        ).toBe(
          "home>edit",
        );

        expect(
          direction.textContent,
        ).toBe(
          "replace",
        );


        clickElement(
          getByTestId(
            container,
            "pop",
          ),
        );

        expect(
          entries.textContent,
        ).toBe(
          "home",
        );

        expect(
          direction.textContent,
        ).toBe(
          "back",
        );


        clickElement(
          getByTestId(
            container,
            "push",
          ),
        );

        clickElement(
          getByTestId(
            container,
            "push",
          ),
        );

        expect(
          entries.textContent,
        ).toBe(
          "home>detail>detail",
        );


        clickElement(
          getByTestId(
            container,
            "root",
          ),
        );

        expect(
          entries.textContent,
        ).toBe(
          "home",
        );


        clickElement(
          getByTestId(
            container,
            "reset",
          ),
        );

        expect(
          entries.textContent,
        ).toBe(
          "reset",
        );

        expect(
          direction.textContent,
        ).toBe(
          "replace",
        );

        expect(
          onEntriesChange,
        ).toHaveBeenCalled();
      },
    );


    it(
      "uses null, not string truthiness, as the empty-history policy",
      () => {
        const withEmptyName =
          renderDOM(
            <UncontrolledHistory
              initialName=""
            />,
          );


        const withoutInitial =
          renderDOM(
            <UncontrolledHistory
              initialName={
                null
              }
            />,
          );


        expect(
          getByTestId(
            withEmptyName,
            "entries",
          ).textContent,
        ).toBe(
          "",
        );

        expect(
          withEmptyName.querySelectorAll(
            "output",
          )[0]
            ?.textContent,
        ).toBe(
          "",
        );


        clickElement(
          getByTestId(
            withEmptyName,
            "push",
          ),
        );

        expect(
          getByTestId(
            withEmptyName,
            "entries",
          ).textContent,
        ).toBe(
          ">detail",
        );


        expect(
          getByTestId(
            withoutInitial,
            "entries",
          ).textContent,
        ).toBe(
          "",
        );

        clickElement(
          getByTestId(
            withoutInitial,
            "push",
          ),
        );

        expect(
          getByTestId(
            withoutInitial,
            "entries",
          ).textContent,
        ).toBe(
          "detail",
        );
      },
    );


    it(
      "notifies controlled mutations without adopting rejected entries",
      () => {
        const onEntriesChange =
          vi.fn();

        const controlled = [
          {
            key:
              "external",

            name:
              "external",
          },
        ];


        function Harness() {
          const history =
            useNavigationEntries({
              initialName:
                "fallback",

              entries:
                controlled,

              transitionDirection:
                "back",

              onEntriesChange,
            });


          return (
            <>
              <output
                data-testid="entries"
              >
                {
                  history.entries
                    .map(
                      (
                        entry,
                      ) =>
                        entry.name,
                    )
                    .join(
                      ">",
                    )
                }
              </output>

              <output
                data-testid="direction"
              >
                {
                  history.transitionDirection
                }
              </output>

              <button
                type="button"
                data-testid="push"
                onClick={() => {
                  history.push(
                    "next",
                  );
                }}
              >
                Push
              </button>
            </>
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );


        clickElement(
          getByTestId(
            container,
            "push",
          ),
        );


        expect(
          getByTestId(
            container,
            "entries",
          ).textContent,
        ).toBe(
          "external",
        );

        expect(
          getByTestId(
            container,
            "direction",
          ).textContent,
        ).toBe(
          "back",
        );

        expect(
          onEntriesChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onEntriesChange
            .mock
            .calls[
              0
            ]?.[
              0
            ]
            .map(
              (
                entry:
                  {
                    name:
                      string;
                  },
              ) =>
                entry.name,
            ),
        ).toEqual(
          [
            "external",
            "next",
          ],
        );

        expect(
          onEntriesChange
            .mock
            .calls[
              0
            ]?.[
              1
            ],
        ).toBe(
          "forward",
        );
      },
    );


    it(
      "wires NavigationStack screens through the shared history actions",
      () => {
        const onEntriesChange =
          vi.fn();


        const container =
          renderDOM(
            <NavigationStack
              initialName="home"
              animation="none"

              entries={[
                {
                  key:
                    "controlled-home",

                  name:
                    "home",
                },
              ]}

              transitionDirection="replace"

              onEntriesChange={
                onEntriesChange
              }
            >
              <NavigationStack.Screen
                name="home"
                render={({
                  navigation,
                }) => (
                  <button
                    type="button"
                    data-testid="go"
                    onClick={() => {
                      navigation.push(
                        "detail",
                      );
                    }}
                  >
                    Home
                  </button>
                )}
              />

              <NavigationStack.Screen
                name="detail"
                element={
                  <span>
                    Detail
                  </span>
                }
              />
            </NavigationStack>,
          );


        clickElement(
          getByTestId(
            container,
            "go",
          ),
        );


        expect(
          onEntriesChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onEntriesChange
            .mock
            .calls[
              0
            ]?.[
              0
            ]
            .map(
              (
                entry:
                  {
                    name:
                      string;
                  },
              ) =>
                entry.name,
            ),
        ).toEqual(
          [
            "home",
            "detail",
          ],
        );

        expect(
          onEntriesChange
            .mock
            .calls[
              0
            ]?.[
              1
            ],
        ).toBe(
          "forward",
        );

        expect(
          container
            .querySelector(
              "[data-ui-navigation-stack]",
            )
            ?.getAttribute(
              "data-ui-navigation-stack-direction",
            ),
        ).toBe(
          "replace",
        );
      },
    );


    it(
      "keeps TabScaffold resetToTab policy outside the shared history owner",
      () => {
        const onTabChange =
          vi.fn();

        const onEntriesChange =
          vi.fn();


        const container =
          renderDOM(
            <TabScaffold
              animation="none"

              entries={[
                {
                  key:
                    "controlled-home",

                  name:
                    "home",
                },
              ]}

              transitionDirection="replace"

              onEntriesChange={
                onEntriesChange
              }

              tabs={[
                {
                  value:
                    "home",

                  label:
                    "Home",
                },

                {
                  value:
                    "settings",

                  label:
                    "Settings",
                },
              ]}

              screens={[
                {
                  name:
                    "home",

                  element:
                    <span>
                      Home
                    </span>,
                },

                {
                  name:
                    "settings",

                  element:
                    <span>
                      Settings
                    </span>,
                },
              ]}

              showBottomNavigation={
                false
              }

              renderAppBar={(
                context,
              ) => (
                <button
                  type="button"
                  data-testid="tab"
                  onClick={() => {
                    context.resetToTab(
                      "settings",
                    );
                  }}
                >
                  Tab
                </button>
              )}

              onTabChange={
                onTabChange
              }
            />,
          );


        clickElement(
          getByTestId(
            container,
            "tab",
          ),
        );


        expect(
          container
            .querySelector(
              "[data-ui-tab-scaffold]",
            )
            ?.getAttribute(
              "data-ui-tab-scaffold-active-tab",
            ),
        ).toBe(
          "home",
        );

        expect(
          onEntriesChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onEntriesChange
            .mock
            .calls[
              0
            ]?.[
              0
            ]
            .map(
              (
                entry:
                  {
                    name:
                      string;
                  },
              ) =>
                entry.name,
            ),
        ).toEqual(
          [
            "settings",
          ],
        );

        expect(
          onEntriesChange
            .mock
            .calls[
              0
            ]?.[
              1
            ],
        ).toBe(
          "replace",
        );

        expect(
          onTabChange,
        ).toHaveBeenCalledWith(
          "settings",
        );
      },
    );
  },
);
