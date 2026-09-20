// @vitest-environment node

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  projectCompactNavigation,
} from "../../src/patterns/navigation/navigationProjection";

import type {
  NavigationNode,
} from "../../src/patterns/navigation/navigation.types";


const items:
  NavigationNode[] = [
    {
      id:
        "home",

      label:
        "Home",
    },

    {
      id:
        "workspace",

      label:
        "Workspace",

      children: [
        {
          id:
            "projects",

          label:
            "Projects",
        },

        {
          id:
            "reports",

          label:
            "Reports",
        },
      ],
    },

    {
      id:
        "settings",

      label:
        "Settings",
    },

    {
      id:
        "billing",

      label:
        "Billing",
    },

    {
      id:
        "help",

      label:
        "Help",
    },
  ];


describe(
  "Phase 3 navigation projection",
  () => {
    it(
      "flattens destinations once while preserving ancestry and excluding group-only nodes",
      () => {
        const projection =
          projectCompactNavigation({
            items,

            activeId:
              "reports",

            presentation:
              "bottom",

            policy: {
              maxVisible: {
                bottom:
                  3,
              },
            },
          });

        expect(
          projection
            .destinations
            .map(
              ({ node }) =>
                node.id,
            ),
        ).toEqual([
          "home",
          "projects",
          "reports",
          "settings",
          "billing",
          "help",
        ]);

        expect(
          projection
            .destinations
            .some(
              ({ node }) =>
                node.id ===
                "workspace",
            ),
        ).toBe(
          false,
        );

        expect(
          projection
            .activePath
            .map(
              (node) =>
                node.id,
            ),
        ).toEqual([
          "workspace",
          "reports",
        ]);
      },
    );



    it(
      "keeps selectable parents and disabled destinations without inventing overflow at the exact limit",
      () => {
        const projection =
          projectCompactNavigation({
            items: [
              {
                id:
                  "parent",

                label:
                  "Parent",

                selectable:
                  true,

                children: [
                  {
                    id:
                      "child",

                    label:
                      "Child",
                  },
                ],
              },

              {
                id:
                  "disabled",

                label:
                  "Disabled",

                disabled:
                  true,
              },
            ],

            activeId:
              "child",

            presentation:
              "rail",

            policy: {
              maxVisible: {
                rail:
                  3,
              },
            },
          });

        expect(
          projection
            .destinations
            .map(
              ({ node }) => [
                node.id,
                Boolean(
                  node.disabled,
                ),
              ],
            ),
        ).toEqual([
          [
            "parent",
            false,
          ],
          [
            "child",
            false,
          ],
          [
            "disabled",
            true,
          ],
        ]);

        expect(
          projection.hasOverflow,
        ).toBe(
          false,
        );

        expect(
          projection.visible,
        ).toHaveLength(
          3,
        );
      },
    );

    it(
      "reserves one compact slot for overflow and marks More active when the active destination is hidden",
      () => {
        const projection =
          projectCompactNavigation({
            items,

            activeId:
              "reports",

            presentation:
              "bottom",

            policy: {
              maxVisible: {
                bottom:
                  3,
              },
            },
          });

        expect(
          projection
            .visible
            .map(
              ({ node }) =>
                node.id,
            ),
        ).toEqual([
          "home",
          "projects",
        ]);

        expect(
          projection
            .overflow
            .map(
              ({ node }) =>
                node.id,
            ),
        ).toEqual([
          "reports",
          "settings",
          "billing",
          "help",
        ]);

        expect(
          projection
            .activeInOverflow,
        ).toBe(
          true,
        );

        expect(
          projection
            .hasOverflow,
        ).toBe(
          true,
        );
      },
    );
  },
);
