import React from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Checkbox,
  Radio,
  Switch,
} from "zerina-ui";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


describe(
  "Phase B2 choice-control runtime",
  () => {
    it.each([
      [
        "Checkbox",
        (
          <Checkbox
            data-testid="control"
            label={0}
          />
        ),
      ],

      [
        "Radio",
        (
          <Radio
            data-testid="control"
            label={0}
          />
        ),
      ],

      [
        "Switch",
        (
          <Switch
            data-testid="control"
            label={0}
          />
        ),
      ],
    ])(
      "%s preserves numeric labels",
      (
        _name,
        control,
      ) => {
        const container =
          renderDOM(
            control,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );

        const label =
          input.closest(
            "label",
          );

        expect(
          label,
        ).not.toBeNull();

        expect(
          label?.textContent,
        ).toBe(
          "0",
        );
      },
    );


    it(
      "applies progressive cancellation from public onChange to input slot and internal state",
      () => {
        const publicChange =
          vi.fn(
            (
              event:
                React.ChangeEvent<HTMLInputElement>,
            ) => {
              event.preventDefault();
            },
          );

        const slotChange =
          vi.fn();


        function Harness() {
          const [
            revision,
            setRevision,
          ] =
            React.useState(
              0,
            );

          return (
            <>
              <button
                type="button"
                data-testid="rerender"
                onClick={() => {
                  setRevision(
                    (
                      current,
                    ) =>
                      current + 1,
                  );
                }}
              >
                {revision}
              </button>

              <Checkbox
                data-testid="control"
                defaultChecked={
                  false
                }
                onChange={
                  publicChange
                }
                slotProps={{
                  input: {
                    onChange:
                      slotChange,
                  },
                }}
              />
            </>
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


        clickElement(
          input,
        );

        clickElement(
          getByTestId<HTMLButtonElement>(
            container,
            "rerender",
          ),
        );


        expect(
          publicChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotChange,
        ).not.toHaveBeenCalled();

        expect(
          input.checked,
        ).toBe(
          false,
        );
      },
    );


    it(
      "lets the input slot cancel the internal commit after the public layer",
      () => {
        const publicChange =
          vi.fn();

        const slotChange =
          vi.fn(
            (
              event:
                React.ChangeEvent<HTMLInputElement>,
            ) => {
              event.preventDefault();
            },
          );


        function Harness() {
          const [
            revision,
            setRevision,
          ] =
            React.useState(
              0,
            );

          return (
            <>
              <button
                type="button"
                data-testid="rerender"
                onClick={() => {
                  setRevision(
                    (
                      current,
                    ) =>
                      current + 1,
                  );
                }}
              >
                {revision}
              </button>

              <Switch
                data-testid="control"
                defaultChecked={
                  false
                }
                onChange={
                  publicChange
                }
                slotProps={{
                  input: {
                    onChange:
                      slotChange,
                  },
                }}
              />
            </>
          );
        }


        const container =
          renderDOM(
            <Harness />,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );


        clickElement(
          input,
        );

        clickElement(
          getByTestId<HTMLButtonElement>(
            container,
            "rerender",
          ),
        );


        expect(
          publicChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          slotChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          input.checked,
        ).toBe(
          false,
        );
      },
    );
  },
);
