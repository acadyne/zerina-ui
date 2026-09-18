import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


const PAGE_PATH =
  "/browser-block6.html";


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


function choiceRoot(
  page: Page,
  testId: string,
  ui:
    | "checkbox"
    | "radio"
    | "switch",
): Locator {
  return page
    .getByTestId(
      testId,
    )
    .locator(
      `xpath=ancestor::*[@data-ui='${ui}'][1]`,
    );
}


async function widthOf(
  locator: Locator,
): Promise<number> {
  const box =
    await locator.boundingBox();

  if (!box) {
    throw new Error(
      "Expected a visible element with a bounding box.",
    );
  }

  return box.width;
}


async function centerX(
  locator: Locator,
): Promise<number> {
  const box =
    await locator.boundingBox();

  if (!box) {
    throw new Error(
      "Expected a visible element with a bounding box.",
    );
  }

  return box.x + box.width / 2;
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
        "block6-focus-checkbox",
      ),
    ).toBeVisible();
  },
);


test(
  "Block 6: pointer focus does not create a keyboard ring",
  async ({
    page,
  }) => {
    const input =
      page.getByTestId(
        "block6-focus-checkbox",
      );

    const root =
      choiceRoot(
        page,
        "block6-focus-checkbox",
        "checkbox",
      );

    await input.click();

    await expect(
      input,
    ).toBeFocused();

    await expect(
      root,
    ).not.toHaveAttribute(
      "data-focus-visible",
      "true",
    );

    expect(
      (
        await computed(
          input,
          "box-shadow",
        )
      ).trim(),
    ).toBe(
      "none",
    );
  },
);


test(
  "Block 6: Tab creates the normal ring and invalid Tab creates the danger ring",
  async ({
    page,
  }) => {
    await page
      .getByTestId(
        "block6-focus-start",
      )
      .focus();

    await page.keyboard.press(
      "Tab",
    );

    const focusedInput =
      page.getByTestId(
        "block6-focus-checkbox",
      );

    const focusedRoot =
      choiceRoot(
        page,
        "block6-focus-checkbox",
        "checkbox",
      );

    await expect(
      focusedInput,
    ).toBeFocused();

    await expect(
      focusedRoot,
    ).toHaveAttribute(
      "data-focus-visible",
      "true",
    );

    const normalShadow =
      await computed(
        focusedInput,
        "box-shadow",
      );

    expect(
      normalShadow,
    ).toContain(
      "rgb(20, 80, 180)",
    );

    await page
      .getByTestId(
        "block6-invalid-start",
      )
      .focus();

    await page.keyboard.press(
      "Tab",
    );

    const invalidInput =
      page.getByTestId(
        "block6-invalid-checkbox",
      );

    const invalidRoot =
      choiceRoot(
        page,
        "block6-invalid-checkbox",
        "checkbox",
      );

    await expect(
      invalidInput,
    ).toBeFocused();

    await expect(
      invalidRoot,
    ).toHaveAttribute(
      "data-focus-visible",
      "true",
    );

    await expect(
      invalidRoot,
    ).toHaveAttribute(
      "data-invalid",
      "true",
    );

    const dangerShadow =
      await computed(
        invalidInput,
        "box-shadow",
      );

    expect(
      dangerShadow,
    ).toContain(
      "rgb(190, 20, 20)",
    );
  },
);


test(
  "Block 6: checked and indeterminate indicators are visible",
  async ({
    page,
  }) => {
    const checked =
      page.getByTestId(
        "block6-checked-checkbox",
      );

    const checkedRoot =
      choiceRoot(
        page,
        "block6-checked-checkbox",
        "checkbox",
      );

    await expect(
      checked,
    ).toBeChecked();

    await expect(
      checkedRoot,
    ).toHaveAttribute(
      "data-checked",
      "true",
    );

    expect(
      Number(
        await computed(
          page.getByTestId(
            "block6-checked-mark",
          ),
          "opacity",
        ),
      ),
    ).toBe(
      1,
    );

    const indeterminate =
      page.getByTestId(
        "block6-indeterminate-checkbox",
      );

    const indeterminateRoot =
      choiceRoot(
        page,
        "block6-indeterminate-checkbox",
        "checkbox",
      );

    await expect(
      indeterminate,
    ).toHaveAttribute(
      "aria-checked",
      "mixed",
    );

    await expect(
      indeterminateRoot,
    ).toHaveAttribute(
      "data-indeterminate",
      "true",
    );

    expect(
      Number(
        await computed(
          page.getByTestId(
            "block6-indeterminate-mark",
          ),
          "opacity",
        ),
      ),
    ).toBe(
      1,
    );

    const radio =
      page.getByTestId(
        "block6-checked-radio",
      );

    await expect(
      radio,
    ).toBeChecked();

    expect(
      Number(
        await computed(
          page.getByTestId(
            "block6-radio-dot",
          ),
          "opacity",
        ),
      ),
    ).toBe(
      1,
    );
  },
);


test(
  "Block 6: Switch thumb moves when checked",
  async ({
    page,
  }) => {
    const input =
      page.getByTestId(
        "block6-moving-switch",
      );

    const thumb =
      page.getByTestId(
        "block6-moving-thumb",
      );

    const before =
      await centerX(
        thumb,
      );

    await input.click();

    await expect(
      input,
    ).toBeChecked();

    await expect(
      choiceRoot(
        page,
        "block6-moving-switch",
        "switch",
      ),
    ).toHaveAttribute(
      "data-checked",
      "true",
    );

    const after =
      await centerX(
        thumb,
      );

    expect(
      after,
    ).toBeGreaterThan(
      before,
    );
  },
);


test(
  "Block 6: readOnly is focusable and immutable; disabled opacity is applied once",
  async ({
    page,
  }) => {
    await page
      .getByTestId(
        "block6-readonly-start",
      )
      .focus();

    await page.keyboard.press(
      "Tab",
    );

    const readOnly =
      page.getByTestId(
        "block6-readonly-checkbox",
      );

    await expect(
      readOnly,
    ).toBeFocused();

    await expect(
      readOnly,
    ).not.toBeDisabled();

    await expect(
      readOnly,
    ).not.toBeChecked();

    await page.keyboard.press(
      "Space",
    );

    await expect(
      readOnly,
    ).not.toBeChecked();

    expect(
      await page.evaluate(
        () =>
          window
            .block6Harness
            .snapshot(),
      ),
    ).toEqual({
      readOnlyChanges:
        0,
    });

    for (
      const [
        testId,
        ui,
      ] of [
        [
          "block6-disabled-checkbox",
          "checkbox",
        ],
        [
          "block6-disabled-radio",
          "radio",
        ],
        [
          "block6-disabled-switch",
          "switch",
        ],
      ] as const
    ) {
      const input =
        page.getByTestId(
          testId,
        );

      const root =
        choiceRoot(
          page,
          testId,
          ui,
        );

      await expect(
        input,
      ).toBeDisabled();

      expect(
        Number(
          await computed(
            root,
            "opacity",
          ),
        ),
      ).toBeCloseTo(
        0.45,
        4,
      );

      if (
        ui !== "switch"
      ) {
        expect(
          Number(
            await computed(
              input,
              "opacity",
            ),
          ),
        ).toBe(
          1,
        );
      }
    }

    /*
     * Switch oculta el input nativo; el track es su superficie
     * visible y no debe volver a aplicar la opacidad disabled.
     */
    expect(
      Number(
        await computed(
          page.getByTestId(
            "block6-disabled-switch-track",
          ),
          "opacity",
        ),
      ),
    ).toBe(
      1,
    );
  },
);


test(
  "Block 6: labelPlacement controls visual order for Checkbox, Radio and Switch",
  async ({
    page,
  }) => {
    for (
      const control of [
        "checkbox",
        "radio",
        "switch",
      ] as const
    ) {
      const startLabel =
        await centerX(
          page.getByTestId(
            `block6-${control}-start-label`,
          ),
        );

      const startControl =
        await centerX(
          page.getByTestId(
            `block6-${control}-start-control`,
          ),
        );

      const endLabel =
        await centerX(
          page.getByTestId(
            `block6-${control}-end-label`,
          ),
        );

      const endControl =
        await centerX(
          page.getByTestId(
            `block6-${control}-end-control`,
          ),
        );

      expect(
        startLabel,
      ).toBeLessThan(
        startControl,
      );

      expect(
        endLabel,
      ).toBeGreaterThan(
        endControl,
      );
    }
  },
);


test(
  "Block 6: sm, md and lg are geometrically distinct for every control",
  async ({
    page,
  }) => {
    const checkboxWidths =
      await Promise.all(
        [
          "sm",
          "md",
          "lg",
        ].map(
          (
            size,
          ) =>
            widthOf(
              page.getByTestId(
                `block6-checkbox-${size}`,
              ),
            ),
        ),
      );

    const radioWidths =
      await Promise.all(
        [
          "sm",
          "md",
          "lg",
        ].map(
          (
            size,
          ) =>
            widthOf(
              page.getByTestId(
                `block6-radio-${size}`,
              ),
            ),
        ),
      );

    const switchWidths =
      await Promise.all(
        [
          "sm",
          "md",
          "lg",
        ].map(
          (
            size,
          ) =>
            widthOf(
              page.getByTestId(
                `block6-switch-track-${size}`,
              ),
            ),
        ),
      );

    for (
      const widths of [
        checkboxWidths,
        radioWidths,
        switchWidths,
      ]
    ) {
      expect(
        widths[0],
      ).toBeLessThan(
        widths[1],
      );

      expect(
        widths[1],
      ).toBeLessThan(
        widths[2],
      );
    }
  },
);


test(
  "Block 6: color schemes resolve accents and legacy attributes are absent",
  async ({
    page,
  }) => {
    const expected = {
      primary:
        "rgb(20, 80, 180)",

      secondary:
        "rgb(120, 50, 170)",

      danger:
        "rgb(190, 20, 20)",
    } as const;

    for (
      const control of [
        "checkbox",
        "radio",
        "switch",
      ] as const
    ) {
      for (
        const scheme of [
          "primary",
          "secondary",
          "danger",
        ] as const
      ) {
        const root =
          choiceRoot(
            page,
            `block6-${control}-${scheme}`,
            control,
          );

        await expect(
          root,
        ).toHaveAttribute(
          "data-color-scheme",
          scheme,
        );

        expect(
          (
            await computed(
              root,
              "--ui-choice-accent",
            )
          ).trim(),
        ).toBe(
          expected[scheme],
        );
      }
    }

    for (
      const selector of [
        "[data-ui-checkbox]",
        "[data-ui-radio]",
        "[data-ui-radio-group]",
        "[data-ui-switch]",
        "[data-ui-checkbox-checked]",
        "[data-ui-radio-checked]",
        "[data-ui-switch-checked]",
        "[data-ui-radio-group-disabled]",
      ]
    ) {
      await expect(
        page.locator(
          selector,
        ),
      ).toHaveCount(
        0,
      );
    }
  },
);
