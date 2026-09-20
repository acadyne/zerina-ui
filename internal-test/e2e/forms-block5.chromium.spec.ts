import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


const PAGE_PATH =
  "/browser-block5.html";


async function computed(
  locator: Locator,
  property: string,
): Promise<string> {
  return locator.evaluate(
    (
      element,
      cssProperty,
    ) =>
      getComputedStyle(
        element,
      ).getPropertyValue(
        cssProperty,
      ),
    property,
  );
}


async function hasAttribute(
  locator: Locator,
  attribute: string,
): Promise<boolean> {
  return (
    await locator.getAttribute(
      attribute,
    )
  ) !== null;
}


async function layoutSnapshot(
  page: Page,
) {
  return page.evaluate(
    () => {
      const group =
        document.querySelector<HTMLElement>(
          '[data-testid="block5-layout-group"]',
        );

      const start1 =
        document.querySelector<HTMLElement>(
          '[data-testid="block5-start-1"]',
        );

      const start2 =
        document.querySelector<HTMLElement>(
          '[data-testid="block5-start-2"]',
        );

      const end1 =
        document.querySelector<HTMLElement>(
          '[data-testid="block5-end-1"]',
        );

      const end2 =
        document.querySelector<HTMLElement>(
          '[data-testid="block5-end-2"]',
        );


      if (
        !group ||
        !start1 ||
        !end1 ||
        !end2
      ) {
        throw new Error(
          "Block 5 layout fixture is incomplete.",
        );
      }


      const groupStyle =
        getComputedStyle(
          group,
        );


      return {
        startSize:
          Number.parseFloat(
            groupStyle
              .getPropertyValue(
                "--ui-input-group-start-size",
              ),
          ),

        endSize:
          Number.parseFloat(
            groupStyle
              .getPropertyValue(
                "--ui-input-group-end-size",
              ),
          ),

        start1Width:
          Math.ceil(
            start1
              .getBoundingClientRect()
              .width,
          ),

        start2Width:
          start2
            ? Math.ceil(
                start2
                  .getBoundingClientRect()
                  .width,
              )
            : 0,

        end1Width:
          Math.ceil(
            end1
              .getBoundingClientRect()
              .width,
          ),

        end2Width:
          Math.ceil(
            end2
              .getBoundingClientRect()
              .width,
          ),

        start1Offset:
          Number.parseFloat(
            getComputedStyle(
              start1,
            ).insetInlineStart,
          ),

        start2Offset:
          start2
            ? Number.parseFloat(
                getComputedStyle(
                  start2,
                ).insetInlineStart,
              )
            : null,

        end1Offset:
          Number.parseFloat(
            getComputedStyle(
              end1,
            ).insetInlineEnd,
          ),

        end2Offset:
          Number.parseFloat(
            getComputedStyle(
              end2,
            ).insetInlineEnd,
          ),
      };
    },
  );
}


test.beforeEach(
  async ({
    page,
  }) => {
    await page.goto(
      PAGE_PATH,
    );

    await expect(
      page.getByTestId(
        "block5-layout-group",
      ),
    ).toBeVisible();
  },
);


test(
  "Block 5: adornments measure, accumulate and react to resize and unmount",
  async ({
    page,
  }) => {
    await expect
      .poll(
        async () => {
          const snapshot =
            await layoutSnapshot(
              page,
            );

          return {
            start:
              snapshot.startSize,

            expectedStart:
              snapshot.start1Width +
              snapshot.start2Width,

            end:
              snapshot.endSize,

            expectedEnd:
              snapshot.end1Width +
              snapshot.end2Width,
          };
        },
      )
      .toEqual(
        expect.objectContaining({
          start:
            expect.any(
              Number,
            ),

          expectedStart:
            expect.any(
              Number,
            ),

          end:
            expect.any(
              Number,
            ),

          expectedEnd:
            expect.any(
              Number,
            ),
        }),
      );


    const initial =
      await layoutSnapshot(
        page,
      );


    expect(
      Math.abs(
        initial.startSize -
        (
          initial.start1Width +
          initial.start2Width
        ),
      ),
    ).toBeLessThanOrEqual(
      1,
    );

    expect(
      Math.abs(
        initial.endSize -
        (
          initial.end1Width +
          initial.end2Width
        ),
      ),
    ).toBeLessThanOrEqual(
      1,
    );

    expect(
      initial.start1Offset,
    ).toBe(
      0,
    );

    expect(
      initial.start2Offset,
    ).toBe(
      initial.start1Width,
    );

    expect(
      initial.end2Offset,
    ).toBe(
      0,
    );

    expect(
      initial.end1Offset,
    ).toBe(
      initial.end2Width,
    );


    await page.evaluate(
      () => {
        window
          .block5Harness
          .setStartWidth(
            64,
          );

        window
          .block5Harness
          .setEndWidth(
            72,
          );
      },
    );


    await expect
      .poll(
        async () => {
          const snapshot =
            await layoutSnapshot(
              page,
            );

          return (
            Math.abs(
              snapshot.startSize -
              (
                snapshot.start1Width +
                snapshot.start2Width
              ),
            ) <= 1 &&
            Math.abs(
              snapshot.endSize -
              (
                snapshot.end1Width +
                snapshot.end2Width
              ),
            ) <= 1
          );
        },
      )
      .toBe(
        true,
      );


    await page.evaluate(
      () => {
        window
          .block5Harness
          .setSecondStartMounted(
            false,
          );
      },
    );


    await expect(
      page.getByTestId(
        "block5-start-2",
      ),
    ).toHaveCount(
      0,
    );


    await expect
      .poll(
        async () => {
          const snapshot =
            await layoutSnapshot(
              page,
            );

          return Math.abs(
            snapshot.startSize -
            snapshot.start1Width,
          );
        },
      )
      .toBeLessThanOrEqual(
        1,
      );
  },
);


test(
  "Block 5: grouped controls surrender frame ownership and receive measured padding",
  async ({
    page,
  }) => {
    for (
      const testId
      of [
        "block5-layout-input",
        "block5-textarea",
        "block5-select",
      ]
    ) {
      const control =
        page.getByTestId(
          testId,
        );


      expect(
        await computed(
          control,
          "background-color",
        ),
      ).toBe(
        "rgba(0, 0, 0, 0)",
      );

      expect(
        await computed(
          control,
          "border-top-style",
        ),
      ).toBe(
        "none",
      );

      expect(
        await computed(
          control,
          "border-top-left-radius",
        ),
      ).toBe(
        "0px",
      );

      expect(
        await computed(
          control,
          "box-shadow",
        ),
      ).toBe(
        "none",
      );

      expect(
        await computed(
          control,
          "opacity",
        ),
      ).toBe(
        "1",
      );
    }


    const input =
      page.getByTestId(
        "block5-layout-input",
      );

    const layoutGroup =
      page.getByTestId(
        "block5-layout-group",
      );


    const inputMetrics =
      await page.evaluate(
        () => {
          const group =
            document.querySelector<HTMLElement>(
              '[data-testid="block5-layout-group"]',
            );

          const input =
            document.querySelector<HTMLElement>(
              '[data-testid="block5-layout-input"]',
            );


          if (
            !group ||
            !input
          ) {
            throw new Error(
              "Input layout nodes are missing.",
            );
          }


          const groupStyle =
            getComputedStyle(
              group,
            );

          const inputStyle =
            getComputedStyle(
              input,
            );


          return {
            start:
              Number.parseFloat(
                groupStyle
                  .getPropertyValue(
                    "--ui-input-group-start-size",
                  ),
              ),

            end:
              Number.parseFloat(
                groupStyle
                  .getPropertyValue(
                    "--ui-input-group-end-size",
                  ),
              ),

            base:
              Number.parseFloat(
                inputStyle
                  .getPropertyValue(
                    "--ui-control-padding-x-md",
                  ),
              ),

            left:
              Number.parseFloat(
                inputStyle.paddingLeft,
              ),

            right:
              Number.parseFloat(
                inputStyle.paddingRight,
              ),
          };
        },
      );


    expect(
      Math.abs(
        inputMetrics.left -
        (
          inputMetrics.base +
          inputMetrics.start
        ),
      ),
    ).toBeLessThanOrEqual(
      1,
    );

    expect(
      Math.abs(
        inputMetrics.right -
        (
          inputMetrics.base +
          inputMetrics.end
        ),
      ),
    ).toBeLessThanOrEqual(
      1,
    );


    expect(
      await computed(
        layoutGroup,
        "border-top-style",
      ),
    ).toBe(
      "solid",
    );

    expect(
      await computed(
        layoutGroup,
        "background-color",
      ),
    ).toBe(
      "rgb(255, 255, 255)",
    );


    const selectGroup =
      page.getByTestId(
        "block5-select-group",
      );

    const indicator =
      selectGroup.locator(
        '[data-ui="select-indicator"]',
      );


    const indicatorMetrics =
      await page.evaluate(
        () => {
          const group =
            document.querySelector<HTMLElement>(
              '[data-testid="block5-select-group"]',
            );

          const indicator =
            group?.querySelector<HTMLElement>(
              '[data-ui="select-indicator"]',
            );


          if (
            !group ||
            !indicator
          ) {
            throw new Error(
              "Select indicator fixture is missing.",
            );
          }


          return {
            end:
              Number.parseFloat(
                getComputedStyle(
                  group,
                ).getPropertyValue(
                  "--ui-input-group-end-size",
                ),
              ),

            right:
              Number.parseFloat(
                getComputedStyle(
                  indicator,
                ).right,
              ),
          };
        },
      );


    expect(
      Math.abs(
        indicatorMetrics.right -
        (
          10 +
          indicatorMetrics.end
        ),
      ),
    ).toBeLessThanOrEqual(
      1,
    );

    await expect(
      indicator,
    ).toBeVisible();

    await expect(
      input,
    ).toHaveAttribute(
      "data-in-group",
      "true",
    );
  },
);


test(
  "Block 5: InputGroup distinguishes pointer and keyboard focus",
  async ({
    page,
  }) => {
    const start =
      page.getByTestId(
        "block5-focus-start",
      );

    const group =
      page.getByTestId(
        "block5-focus-group",
      );

    const input =
      page.getByTestId(
        "block5-focus-input",
      );


    const baseline =
      await computed(
        group,
        "box-shadow",
      );


    await input.click();


    await expect(
      group,
    ).toHaveAttribute(
      "data-focused",
      "true",
    );

    expect(
      await hasAttribute(
        group,
        "data-focus-visible",
      ),
    ).toBe(
      false,
    );

    expect(
      await computed(
        group,
        "box-shadow",
      ),
    ).toBe(
      baseline,
    );


    await start.click();

    await page.keyboard.press(
      "Tab",
    );


    await expect(
      input,
    ).toBeFocused();

    await expect(
      group,
    ).toHaveAttribute(
      "data-focus-visible",
      "true",
    );

    await expect
      .poll(
        () =>
          computed(
            group,
            "box-shadow",
          ),
      )
      .not.toBe(
        "none",
      );

    expect(
      await computed(
        input,
        "box-shadow",
      ),
    ).toBe(
      "none",
    );
  },
);


test(
  "Block 5: invalid keyboard focus uses the danger ring",
  async ({
    page,
  }) => {
    const start =
      page.getByTestId(
        "block5-invalid-start",
      );

    const group =
      page.getByTestId(
        "block5-invalid-group",
      );

    const input =
      page.getByTestId(
        "block5-invalid-input",
      );


    await start.click();

    await page.keyboard.press(
      "Tab",
    );


    await expect(
      input,
    ).toBeFocused();

    expect(
      await hasAttribute(
        group,
        "data-invalid",
      ),
    ).toBe(
      true,
    );

    await expect(
      group,
    ).toHaveAttribute(
      "data-focus-visible",
      "true",
    );


    const shadow =
      await expect
        .poll(
          () =>
            computed(
              group,
              "box-shadow",
            ),
        )
        .not.toBe(
          "none",
        )
        .then(
          () =>
            computed(
              group,
              "box-shadow",
            ),
        );


    expect(
      shadow,
    ).toContain(
      "rgb(190, 20, 20)",
    );

    expect(
      await computed(
        input,
        "box-shadow",
      ),
    ).toBe(
      "none",
    );
  },
);


test(
  "Block 5: disabled state propagates and opacity is applied once",
  async ({
    page,
  }) => {
    const group =
      page.getByTestId(
        "block5-disabled-group",
      );

    const input =
      page.getByTestId(
        "block5-disabled-password",
      );

    const toggle =
      page.getByTestId(
        "block5-disabled-toggle",
      );


    await expect(
      input,
    ).toBeDisabled();

    await expect(
      toggle,
    ).toBeDisabled();

    expect(
      await hasAttribute(
        group,
        "data-disabled",
      ),
    ).toBe(
      true,
    );

    expect(
      await computed(
        group,
        "opacity",
      ),
    ).toBe(
      "0.45",
    );

    expect(
      await computed(
        input,
        "opacity",
      ),
    ).toBe(
      "1",
    );

    expect(
      await computed(
        toggle,
        "opacity",
      ),
    ).toBe(
      "1",
    );
  },
);


test(
  "Block 5: SearchInput clear works with pointer and keyboard",
  async ({
    page,
  }) => {
    const controlled =
      page.getByTestId(
        "block5-controlled-search",
      );

    const controlledClear =
      page.getByTestId(
        "block5-controlled-clear",
      );


    await controlledClear.click();


    await expect(
      controlled,
    ).toHaveValue(
      "",
    );


    const afterPointer =
      await page.evaluate(
        () =>
          window
            .block5Harness
            .snapshot(),
      );


    expect(
      afterPointer
        .controlledClears,
    ).toBe(
      1,
    );

    expect(
      afterPointer
        .controlledValues,
    ).toContain(
      "",
    );


    const uncontrolled =
      page.getByTestId(
        "block5-uncontrolled-search",
      );

    const uncontrolledClear =
      page.getByTestId(
        "block5-uncontrolled-clear",
      );


    await uncontrolledClear.focus();

    await page.keyboard.press(
      "Enter",
    );


    await expect(
      uncontrolled,
    ).toHaveValue(
      "",
    );


    const afterKeyboard =
      await page.evaluate(
        () =>
          window
            .block5Harness
            .snapshot(),
      );


    expect(
      afterKeyboard
        .uncontrolledClears,
    ).toBe(
      1,
    );

    expect(
      afterKeyboard
        .uncontrolledValues,
    ).toContain(
      "",
    );
  },
);


test(
  "Block 5: PasswordInput toggles by pointer and keyboard with correct ARIA",
  async ({
    page,
  }) => {
    const pointerInput =
      page.getByTestId(
        "block5-pointer-password",
      );

    const pointerToggle =
      page.getByTestId(
        "block5-pointer-toggle",
      );


    await expect(
      pointerInput,
    ).toHaveAttribute(
      "type",
      "password",
    );

    await expect(
      pointerToggle,
    ).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await pointerToggle.click();


    await expect(
      pointerInput,
    ).toHaveAttribute(
      "type",
      "text",
    );

    await expect(
      pointerToggle,
    ).toHaveAttribute(
      "aria-label",
      "Hide pointer password",
    );

    await expect(
      pointerToggle,
    ).toHaveAttribute(
      "aria-pressed",
      "true",
    );


    const keyboardInput =
      page.getByTestId(
        "block5-keyboard-password",
      );

    const keyboardToggle =
      page.getByTestId(
        "block5-keyboard-toggle",
      );


    await keyboardToggle.focus();

    await page.keyboard.press(
      "Enter",
    );


    await expect(
      keyboardInput,
    ).toHaveAttribute(
      "type",
      "text",
    );

    await expect(
      keyboardToggle,
    ).toHaveAttribute(
      "aria-pressed",
      "true",
    );


    const readOnlyInput =
      page.getByTestId(
        "block5-readonly-password",
      );

    const readOnlyToggle =
      page.getByTestId(
        "block5-readonly-toggle",
      );


    await readOnlyToggle.focus();

    await page.keyboard.press(
      "Enter",
    );


    await expect(
      readOnlyInput,
    ).toHaveAttribute(
      "type",
      "text",
    );


    const disabledInput =
      page.getByTestId(
        "block5-disabled-password",
      );

    const disabledToggle =
      page.getByTestId(
        "block5-disabled-toggle",
      );


    await disabledToggle.evaluate(
      (
        element:
          HTMLButtonElement,
      ) => {
        element.click();
      },
    );


    await expect(
      disabledInput,
    ).toHaveAttribute(
      "type",
      "password",
    );
  },
);
