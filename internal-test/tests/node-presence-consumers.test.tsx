import {
  describe,
  expect,
  it,
} from "vitest";

import {
  Alert,
  Button,
  Inline,
  Progress,
  Stack,
  Wrap,
} from "zerina-ui";

import {
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "ReactNode presence across consumers",
  () => {
    it(
      "keeps numeric zero as a Wrap child",
      () => {
        const container =
          renderDOM(
            <Wrap data-testid="wrap">
              {0}
              {false}
              {null}
              <span>A</span>
            </Wrap>,
          );

        const wrap =
          getByTestId(
            container,
            "wrap",
          );


        expect(
          wrap.textContent,
        ).toBe(
          "0A",
        );
      },
    );


    it(
      "treats numeric zero as an Inline divider and disables CSS gap ownership",
      () => {
        const container =
          renderDOM(
            <Inline
              data-testid="inline"
              divider={0}
              gap="24px"
            >
              <span>A</span>
              <span>B</span>
            </Inline>,
          );

        const inline =
          getByTestId<HTMLDivElement>(
            container,
            "inline",
          );


        expect(
          inline.textContent,
        ).toBe(
          "A0B",
        );

        expect(
          inline.style.gap,
        ).toBe(
          "",
        );
      },
    );


    it(
      "treats numeric zero as a Stack divider and disables spacing gap",
      () => {
        const container =
          renderDOM(
            <Stack
              data-testid="stack"
              divider={0}
              spacing="24px"
            >
              <span>A</span>
              <span>B</span>
            </Stack>,
          );

        const stack =
          getByTestId<HTMLDivElement>(
            container,
            "stack",
          );


        expect(
          stack.textContent,
        ).toBe(
          "A0B",
        );

        expect(
          stack.style.gap,
        ).toBe(
          "",
        );
      },
    );


    it(
      "keeps numeric zero as a Progress label and semantic label target",
      () => {
        const container =
          renderDOM(
            <Progress
              label={0}
              value={25}
              slotProps={{
                label: {
                  "data-testid":
                    "progress-label",
                },
              }}
              data-testid="progress"
            />,
          );

        const progress =
          getByTestId<HTMLDivElement>(
            container,
            "progress",
          );

        const label =
          getByTestId(
            container,
            "progress-label",
          );


        expect(
          label.textContent,
        ).toBe(
          "0",
        );

        expect(
          progress.getAttribute(
            "aria-labelledby",
          ),
        ).toBe(
          label.id,
        );
      },
    );


    it(
      "does not create an empty Progress label association for an empty string",
      () => {
        const container =
          renderDOM(
            <Progress
              label=""
              value={25}
              data-testid="progress"
            />,
          );

        const progress =
          getByTestId<HTMLDivElement>(
            container,
            "progress",
          );


        expect(
          progress.getAttribute(
            "aria-labelledby",
          ),
        ).toBeNull();
      },
    );


    it(
      "preserves numeric zero in adornment and feedback branches",
      () => {
        const container =
          renderDOM(
            <>
              <Button
                leftIcon={0}
                data-testid="button"
              >
                Action
              </Button>

              <Alert
                title={0}
                data-testid="alert"
                slotProps={{
                  children: {
                    "data-testid":
                      "alert-children",
                  },
                }}
              >
                Body
              </Alert>
            </>,
          );


        expect(
          getByTestId(
            container,
            "button",
          ).textContent,
        ).toContain(
          "0",
        );

        expect(
          getByTestId(
            container,
            "alert",
          ).textContent,
        ).toContain(
          "0",
        );

        expect(
          getByTestId<HTMLElement>(
            container,
            "alert-children",
          ).style.color,
        ).toBe(
          "var(--ui-text-muted)",
        );
      },
    );
  },
);
