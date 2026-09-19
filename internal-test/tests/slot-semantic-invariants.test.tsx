import {
  describe,
  expect,
  it,
} from "vitest";

import {
  Progress,
  Radio,
  RadioGroup,
} from "zerina-ui";

import {
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "semantic slot invariants",
  () => {
    it(
      "keeps RadioGroup identity and ARIA state under component ownership",
      () => {
        const container =
          renderDOM(
            <>
              <span id="plan-label">
                Plan
              </span>

              <span id="plan-help">
                Choose a plan
              </span>

              <RadioGroup
                id="plan-group"
                name="plan"
                invalid
                required
                readOnly
                aria-labelledby="plan-label"
                aria-describedby="plan-help"
                slotProps={{
                  root: {
                    id:
                      "slot-group",

                    role:
                      "group",

                    "aria-invalid":
                      false,

                    "aria-required":
                      false,

                    "aria-readonly":
                      false,

                    "aria-labelledby":
                      "slot-label",

                    "aria-describedby":
                      "slot-help",
                  },
                }}
              >
                <Radio
                  value="basic"
                />
              </RadioGroup>
            </>,
          );


        const group =
          container.querySelector<HTMLElement>(
            '[role="radiogroup"]',
          );


        if (!group) {
          throw new Error(
            "RadioGroup root was not rendered.",
          );
        }


        expect(
          group.id,
        ).toBe(
          "plan-group",
        );

        expect(
          group.getAttribute(
            "aria-invalid",
          ),
        ).toBe(
          "true",
        );

        expect(
          group.getAttribute(
            "aria-required",
          ),
        ).toBe(
          "true",
        );

        expect(
          group.getAttribute(
            "aria-readonly",
          ),
        ).toBe(
          "true",
        );

        expect(
          group.getAttribute(
            "aria-labelledby",
          ),
        ).toBe(
          "plan-label",
        );

        expect(
          group.getAttribute(
            "aria-describedby",
          ),
        ).toBe(
          "plan-help",
        );
      },
    );


    it(
      "keeps Progress role, value state, and label linkage under component ownership",
      () => {
        const container =
          renderDOM(
            <Progress
              value={25}
              min={0}
              max={200}
              label="Upload"
              slotProps={{
                root: {
                  role:
                    "status",

                  "aria-valuemin":
                    999,

                  "aria-valuemax":
                    999,

                  "aria-valuenow":
                    999,

                  "aria-labelledby":
                    "slot-label",
                },

                label: {
                  id:
                    "slot-label",
                },
              }}
            />,
          );


        const progress =
          container.querySelector<HTMLElement>(
            '[role="progressbar"]',
          );


        if (!progress) {
          throw new Error(
            "Progress root was not rendered.",
          );
        }


        expect(
          progress.getAttribute(
            "aria-valuemin",
          ),
        ).toBe(
          "0",
        );

        expect(
          progress.getAttribute(
            "aria-valuemax",
          ),
        ).toBe(
          "200",
        );

        expect(
          progress.getAttribute(
            "aria-valuenow",
          ),
        ).toBe(
          "25",
        );


        const labelId =
          progress.getAttribute(
            "aria-labelledby",
          );


        expect(
          labelId,
        ).toBeTruthy();

        expect(
          labelId,
        ).not.toBe(
          "slot-label",
        );

        expect(
          container.ownerDocument
            .getElementById(
              labelId ?? "",
            )
            ?.textContent,
        ).toBe(
          "Upload",
        );
      },
    );


    it(
      "removes determinate value attributes from indeterminate Progress even when slots provide them",
      () => {
        const container =
          renderDOM(
            <Progress
              indeterminate
              slotProps={{
                root: {
                  "aria-valuemin":
                    1,

                  "aria-valuemax":
                    2,

                  "aria-valuenow":
                    1,
                },
              }}
            />,
          );


        const progress =
          container.querySelector<HTMLElement>(
            '[role="progressbar"]',
          );


        if (!progress) {
          throw new Error(
            "Progress root was not rendered.",
          );
        }


        expect(
          progress.hasAttribute(
            "aria-valuemin",
          ),
        ).toBe(
          false,
        );

        expect(
          progress.hasAttribute(
            "aria-valuemax",
          ),
        ).toBe(
          false,
        );

        expect(
          progress.hasAttribute(
            "aria-valuenow",
          ),
        ).toBe(
          false,
        );
      },
    );
  },
);
