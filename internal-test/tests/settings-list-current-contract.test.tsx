import React from "react";

import {
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from "vitest";

import {
  SettingsList,
  type SettingsListCheckboxProps,
  type SettingsListSwitchProps,
} from "zerina-ui";

import {
  clickElement,
  getByTestId,
  renderDOM,
} from "./react-dom-test-utils";


type SwitchChangeHandler =
  NonNullable<
    SettingsListSwitchProps[
      "onCheckedChange"
    ]
  >;

type CheckboxChangeHandler =
  NonNullable<
    SettingsListCheckboxProps[
      "onCheckedChange"
    ]
  >;


function getStaticRow(
  input: HTMLInputElement,
): HTMLElement {
  const row =
    input.closest<HTMLElement>(
      "[data-ui-list-item]",
    );

  if (!row) {
    throw new Error(
      "SettingsList static row was not found.",
    );
  }

  return row;
}


describe(
  "SettingsList current native-control contract",
  () => {
    it(
      "publishes native React change events for Switch and Checkbox",
      () => {
        expectTypeOf<
          Parameters<
            SwitchChangeHandler
          >[0]
        >().toEqualTypeOf<boolean>();

        expectTypeOf<
          Parameters<
            SwitchChangeHandler
          >[1]
        >().toEqualTypeOf<
          React.ChangeEvent<HTMLInputElement>
        >();

        expectTypeOf<
          Parameters<
            CheckboxChangeHandler
          >[0]
        >().toEqualTypeOf<boolean>();

        expectTypeOf<
          Parameters<
            CheckboxChangeHandler
          >[1]
        >().toEqualTypeOf<
          React.ChangeEvent<HTMLInputElement>
        >();
      },
    );


    it.each(
      [
        {
          kind:
            "switch",

          render:
            (
              onCheckedChange:
                SwitchChangeHandler,
            ) => (
              <SettingsList.Switch
                data-testid="control"
                label="Switch"
                defaultChecked={false}
                onCheckedChange={
                  onCheckedChange
                }
              />
            ),
        },
        {
          kind:
            "checkbox",

          render:
            (
              onCheckedChange:
                CheckboxChangeHandler,
            ) => (
              <SettingsList.Checkbox
                data-testid="control"
                label="Checkbox"
                defaultChecked={false}
                onCheckedChange={
                  onCheckedChange
                }
              />
            ),
        },
      ],
    )(
      "$kind changes only from its native input, not from the static row",
      ({
        render,
      }) => {
        const onCheckedChange =
          vi.fn();

        const container =
          renderDOM(
            <SettingsList>
              {render(
                onCheckedChange,
              )}
            </SettingsList>,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );

        const row =
          getStaticRow(
            input,
          );

        expect(
          row.getAttribute(
            "data-interactive",
          ),
        ).toBeNull();

        expect(
          row.getAttribute(
            "role",
          ),
        ).toBeNull();

        clickElement(
          row,
        );

        expect(
          input.checked,
        ).toBe(
          false,
        );

        expect(
          onCheckedChange,
        ).not.toHaveBeenCalled();

        clickElement(
          input,
        );

        expect(
          input.checked,
        ).toBe(
          true,
        );

        expect(
          onCheckedChange,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );


    it(
      "forwards native name, value and checked metadata",
      () => {
        const snapshots:
          Array<{
            next: boolean;
            name: string;
            value: string;
            checked: boolean;
            defaultPrevented: boolean;
          }> = [];

        const container =
          renderDOM(
            <SettingsList>
              <SettingsList.Switch
                data-testid="control"
                label="Metadata"
                name="notifications"
                value="enabled"
                defaultChecked={false}
                onCheckedChange={(
                  next,
                  event,
                ) => {
                  snapshots.push({
                    next,

                    name:
                      event
                        .currentTarget
                        .name,

                    value:
                      event
                        .currentTarget
                        .value,

                    checked:
                      event
                        .currentTarget
                        .checked,

                    defaultPrevented:
                      event
                        .defaultPrevented,
                  });
                }}
              />
            </SettingsList>,
          );

        clickElement(
          getByTestId(
            container,
            "control",
          ),
        );

        expect(
          snapshots,
        ).toEqual([
          {
            next:
              true,

            name:
              "notifications",

            value:
              "enabled",

            checked:
              true,

            defaultPrevented:
              false,
          },
        ]);
      },
    );


    it.each(
      [
        "switch",
        "checkbox",
      ] as const,
    )(
      "preventDefault keeps the uncontrolled %s state uncommitted",
      (
        kind,
      ) => {
        const onCheckedChange =
          vi.fn(
            (
              _next:
                boolean,
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
                data-testid="rerender"
                type="button"
                onClick={() => {
                  setRevision(
                    (
                      current,
                    ) =>
                      current +
                      1,
                  );
                }}
              >
                Rerender {revision}
              </button>

              <SettingsList>
                {kind ===
                  "switch" ? (
                    <SettingsList.Switch
                      data-testid="control"
                      label="Switch"
                      defaultChecked={false}
                      onCheckedChange={
                        onCheckedChange
                      }
                    />
                  ) : (
                    <SettingsList.Checkbox
                      data-testid="control"
                      label="Checkbox"
                      defaultChecked={false}
                      onCheckedChange={
                        onCheckedChange
                      }
                    />
                  )}
              </SettingsList>
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


        expect(
          onCheckedChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onCheckedChange.mock
            .calls[0]?.[1]
            .defaultPrevented,
        ).toBe(
          true,
        );


        /*
         * JSDOM no reproduce la reversión nativa inmediata del navegador.
         * El rerender demuestra que SettingsList no confirmó el estado.
         */
        clickElement(
          getByTestId(
            container,
            "rerender",
          ),
        );


        expect(
          input.checked,
        ).toBe(
          false,
        );
      },
    );


    it.each(
      [
        "switch",
        "checkbox",
      ] as const,
    )(
      "disabled %s does not change or emit",
      (
        kind,
      ) => {
        const onCheckedChange =
          vi.fn();

        const control =
          kind ===
            "switch" ? (
              <SettingsList.Switch
                data-testid="control"
                label="Switch"
                disabled
                defaultChecked={false}
                onCheckedChange={
                  onCheckedChange
                }
              />
            ) : (
              <SettingsList.Checkbox
                data-testid="control"
                label="Checkbox"
                disabled
                defaultChecked={false}
                onCheckedChange={
                  onCheckedChange
                }
              />
            );

        const container =
          renderDOM(
            <SettingsList>
              {control}
            </SettingsList>,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );

        expect(
          input.disabled,
        ).toBe(
          true,
        );

        clickElement(
          input,
        );

        expect(
          input.checked,
        ).toBe(
          false,
        );

        expect(
          onCheckedChange,
        ).not.toHaveBeenCalled();
      },
    );
  },
);

describe(
  "SettingsList native choice state ownership",
  () => {
    it.each(
      [
        "switch",
        "checkbox",
      ] as const,
    )(
      "lets the underlying native %s primitive own uncontrolled state",
      (
        kind,
      ) => {
        const control =
          kind ===
            "switch" ? (
              <SettingsList.Switch
                data-testid="control"
                label="Switch"
                defaultChecked={false}
              />
            ) : (
              <SettingsList.Checkbox
                data-testid="control"
                label="Checkbox"
                defaultChecked={false}
              />
            );

        const container =
          renderDOM(
            <SettingsList>
              {control}
            </SettingsList>,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );

        clickElement(
          input,
        );

        expect(
          input.checked,
        ).toBe(
          true,
        );
      },
    );


    it.each(
      [
        "switch",
        "checkbox",
      ] as const,
    )(
      "keeps controlled %s state owned by the consumer",
      (
        kind,
      ) => {
        const onCheckedChange =
          vi.fn();

        const control =
          kind ===
            "switch" ? (
              <SettingsList.Switch
                data-testid="control"
                label="Switch"
                checked={false}
                onCheckedChange={
                  onCheckedChange
                }
              />
            ) : (
              <SettingsList.Checkbox
                data-testid="control"
                label="Checkbox"
                checked={false}
                onCheckedChange={
                  onCheckedChange
                }
              />
            );

        const container =
          renderDOM(
            <SettingsList>
              {control}
            </SettingsList>,
          );

        const input =
          getByTestId<HTMLInputElement>(
            container,
            "control",
          );

        clickElement(
          input,
        );

        expect(
          onCheckedChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          onCheckedChange.mock
            .calls[0]?.[0],
        ).toBe(
          true,
        );

        expect(
          input.checked,
        ).toBe(
          false,
        );
      },
    );


    it.each(
      [
        "switch",
        "checkbox",
      ] as const,
    )(
      "lets the native input slot cancel the uncontrolled %s commit",
      (
        kind,
      ) => {
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

          const commonProps = {
            "data-testid":
              "control",

            defaultChecked:
              false,

            slotProps: {
              input: {
                onChange:
                  slotChange,
              },
            },
          } as const;


          return (
            <>
              <button
                data-testid="rerender"
                type="button"
                onClick={() => {
                  setRevision(
                    (
                      current,
                    ) =>
                      current +
                      1,
                  );
                }}
              >
                Rerender {revision}
              </button>

              <SettingsList>
                {kind ===
                  "switch" ? (
                    <SettingsList.Switch
                      {...commonProps}
                      label="Switch"
                    />
                  ) : (
                    <SettingsList.Checkbox
                      {...commonProps}
                      label="Checkbox"
                    />
                  )}
              </SettingsList>
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

        expect(
          slotChange,
        ).toHaveBeenCalledTimes(
          1,
        );

        /*
         * JSDOM can leave the native property toggled until a React render.
         * The rerender proves the underlying primitive never committed it.
         */
        clickElement(
          getByTestId(
            container,
            "rerender",
          ),
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

