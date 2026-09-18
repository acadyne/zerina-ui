import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


const PAGE_PATH =
  "/browser-forms.html";


async function readSnapshot(
  page:
    Page,
) {
  return page.evaluate(
    () =>
      window
        .formsHarness
        .snapshot(),
  );
}


test.beforeEach(
  async ({
    page,
  }) => {
    const browserErrors:
      string[] = [];


    page.on(
      "pageerror",
      (
        error,
      ) => {
        browserErrors.push(
          `pageerror: ${error.message}`,
        );
      },
    );


    page.on(
      "console",
      (
        message,
      ) => {
        if (
          message.type() ===
          "error"
        ) {
          browserErrors.push(
            `console: ${message.text()}`,
          );
        }
      },
    );


    page.on(
      "requestfailed",
      (
        request,
      ) => {
        browserErrors.push(
          [
            "requestfailed:",
            request.url(),
            request.failure()
              ?.errorText ??
            "unknown error",
          ].join(
            " ",
          ),
        );
      },
    );


    page.on(
      "response",
      (
        response,
      ) => {
        if (
          response.status() >=
          400
        ) {
          browserErrors.push(
            [
              "response:",
              response.status(),
              response.url(),
            ].join(
              " ",
            ),
          );
        }
      },
    );


    const response =
      await page.goto(
        PAGE_PATH,
        {
          waitUntil:
            "networkidle",
        },
      );


    expect(
      response?.status(),
      `No se pudo cargar ${PAGE_PATH}`,
    ).toBe(
      200,
    );


    await expect(
      page.locator(
        "#root",
      ),
    ).toBeAttached();


    await page
      .waitForFunction(
        () => {
          const root =
            document.getElementById(
              "root",
            );


          return Boolean(
            root &&
            root.childElementCount >
            0,
          );
        },
        undefined,
        {
          timeout:
            5_000,
        },
      )
      .catch(
        () => {
          // Las aserciones siguientes mostrarán
          // los errores capturados y el estado del root.
        },
      );


    expect(
      browserErrors,
      browserErrors.length >
        0
        ? browserErrors.join(
          "\n",
        )
        : "La aplicación no montó contenido en #root y el navegador no reportó un error.",
    ).toEqual([]);


    await expect(
      page.locator(
        "#root",
      ),
    ).not.toBeEmpty();
  },
);


test(
  "clicking a singular field label focuses its control",
  async ({
    page,
  }) => {
    const input =
      page.getByTestId(
        "label-control",
      );


    await page.locator(
      "#browser-email-field-label",
    ).click();


    await expect(
      input,
    ).toBeFocused();


    await expect(
      page.locator(
        "#browser-email-field-label",
      ),
    ).toHaveAttribute(
      "for",
      "browser-email",
    );
  },
);


test(
  "a RadioGroup is named by its field label and radios keep unique IDs",
  async ({
    page,
  }) => {
    const group =
      page.getByTestId(
        "labelled-group",
      );


    const label =
      page.locator(
        "#browser-plan-field-label",
      );


    await expect(
      group,
    ).toHaveAttribute(
      "role",
      "radiogroup",
    );


    await expect(
      group,
    ).toHaveAttribute(
      "aria-labelledby",
      "browser-plan-field-label",
    );


    await expect(
      group,
    ).toHaveAttribute(
      "aria-describedby",
      "browser-plan-field-help",
    );


    await expect(
      label,
    ).not.toHaveAttribute(
      "for",
      /.+/,
    );


    const firstId =
      await page
        .getByTestId(
          "labelled-basic",
        )
        .getAttribute(
          "id",
        );


    const secondId =
      await page
        .getByTestId(
          "labelled-pro",
        )
        .getAttribute(
          "id",
        );


    expect(
      firstId,
    ).toBeTruthy();


    expect(
      secondId,
    ).toBeTruthy();


    expect(
      firstId,
    ).not.toBe(
      secondId,
    );


    expect(
      firstId,
    ).not.toBe(
      "browser-plan-group",
    );


    expect(
      secondId,
    ).not.toBe(
      "browser-plan-group",
    );
  },
);


test(
  "read-only Select remains focusable and does not change",
  async ({
    page,
  }) => {
    const select =
      page.getByTestId(
        "readonly-select",
      );


    await select.focus();


    await expect(
      select,
    ).toBeFocused();


    await expect(
      select,
    ).not.toBeDisabled();


    await expect(
      select,
    ).toHaveAttribute(
      "aria-readonly",
      "true",
    );


    await select.selectOption(
      "b",
    );


    await expect(
      select,
    ).toHaveValue(
      "a",
    );


    expect(
      (
        await readSnapshot(
          page,
        )
      )
        .readOnlySelectChanges,
    ).toBe(
      0,
    );
  },
);


test(
  "read-only and disabled SearchInput suppress their clear actions",
  async ({
    page,
  }) => {
    const readOnly =
      page.getByTestId(
        "readonly-search",
      );


    await expect(
      readOnly,
    ).toHaveValue(
      "query",
    );


    await expect(
      readOnly,
    ).not.toBeDisabled();


    await expect(
      readOnly,
    ).toHaveAttribute(
      "readonly",
      "",
    );


    await readOnly.focus();


    await readOnly.pressSequentially(
      "changed",
    );


    await expect(
      readOnly,
    ).toHaveValue(
      "query",
    );


    await expect(
      page.locator(
        '[data-ui-search-input-clear-button]',
      ),
    ).toHaveCount(
      0,
    );


    const disabled =
      page.getByTestId(
        "disabled-search",
      );


    await expect(
      disabled,
    ).toBeDisabled();


    const snapshot =
      await readSnapshot(
        page,
      );


    expect(
      snapshot
        .readOnlySearchClears,
    ).toBe(
      0,
    );


    expect(
      snapshot
        .readOnlySearchValueChanges,
    ).toBe(
      0,
    );
  },
);


test(
  "read-only PasswordInput blocks edits but allows visibility changes",
  async ({
    page,
  }) => {
    const input =
      page.getByTestId(
        "readonly-password",
      );


    await expect(
      input,
    ).toHaveValue(
      "secret",
    );


    await input.focus();


    await input.pressSequentially(
      "changed",
    );


    await expect(
      input,
    ).toHaveValue(
      "secret",
    );


    await expect(
      input,
    ).toHaveAttribute(
      "type",
      "password",
    );


    await page.getByTestId(
      "readonly-password-toggle",
    ).click();


    await expect(
      input,
    ).toHaveAttribute(
      "type",
      "text",
    );


    expect(
      (
        await readSnapshot(
          page,
        )
      )
        .readOnlyPasswordChanges,
    ).toBe(
      0,
    );


    await expect(
      page.getByTestId(
        "disabled-password",
      ),
    ).toBeDisabled();


    await expect(
      page.getByTestId(
        "disabled-password-toggle",
      ),
    ).toBeDisabled();
  },
);


test(
  "read-only Checkbox and Switch remain focusable but cannot change",
  async ({
    page,
  }) => {
    const checkbox =
      page.getByTestId(
        "readonly-checkbox",
      );


    const switchControl =
      page.getByTestId(
        "readonly-switch",
      );


    await expect(
      checkbox,
    ).toBeChecked();


    await expect(
      checkbox,
    ).not.toBeDisabled();


    await checkbox.focus();


    await checkbox.press(
      "Space",
    );


    await expect(
      checkbox,
    ).toBeChecked();


    await expect(
      checkbox,
    ).toHaveAttribute(
      "aria-readonly",
      "true",
    );


    await expect(
      switchControl,
    ).toBeChecked();


    await expect(
      switchControl,
    ).not.toBeDisabled();


    await switchControl.focus();


    await switchControl.press(
      "Space",
    );


    await expect(
      switchControl,
    ).toBeChecked();


    await expect(
      switchControl,
    ).toHaveAttribute(
      "aria-readonly",
      "true",
    );


    const snapshot =
      await readSnapshot(
        page,
      );


    expect(
      snapshot
        .readOnlyCheckboxChanges,
    ).toBe(
      0,
    );


    expect(
      snapshot
        .readOnlySwitchChanges,
    ).toBe(
      0,
    );


    await expect(
      page.getByTestId(
        "disabled-checkbox",
      ),
    ).toBeDisabled();


    await expect(
      page.getByTestId(
        "disabled-switch",
      ),
    ).toBeDisabled();
  },
);


test(
  "standalone Radio synchronizes visual state and respects controlled, read-only and disabled modes",
  async ({
    page,
  }) => {
    const standalone =
      page.getByTestId(
        "standalone-radio",
      );


    await expect(
      standalone,
    ).not.toBeChecked();


    await standalone.click();


    await expect(
      standalone,
    ).toBeChecked();


    await expect(
      standalone.locator(
        "xpath=ancestor::*[@data-ui='radio'][1]",
      ),
    ).toHaveAttribute(
      "data-checked",
      "true",
    );


    const controlled =
      page.getByTestId(
        "controlled-radio",
      );


    await controlled.click();


    await expect(
      controlled,
    ).not.toBeChecked();


    const readOnly =
      page.getByTestId(
        "readonly-radio",
      );


    await readOnly.focus();


    await readOnly.press(
      "Space",
    );


    await expect(
      readOnly,
    ).not.toBeChecked();


    await expect(
      readOnly,
    ).not.toBeDisabled();


    await expect(
      page.getByTestId(
        "disabled-radio",
      ),
    ).toBeDisabled();


    const snapshot =
      await readSnapshot(
        page,
      );


    expect(
      snapshot
        .controlledRadioChanges,
    ).toBe(
      1,
    );


    expect(
      snapshot
        .readOnlyRadioChanges,
    ).toBe(
      0,
    );
  },
);


test(
  "RadioGroup changes one value, blocks read-only changes and propagates disabled natively",
  async ({
    page,
  }) => {
    const first =
      page.getByTestId(
        "group-a",
      );


    const second =
      page.getByTestId(
        "group-b",
      );


    await expect(
      first,
    ).toBeChecked();


    await expect(
      second,
    ).not.toBeChecked();


    await second.click();


    await expect(
      first,
    ).not.toBeChecked();


    await expect(
      second,
    ).toBeChecked();


    expect(
      (
        await readSnapshot(
          page,
        )
      ).groupChanges,
    ).toEqual([
      "b",
    ]);


    const readOnlyFirst =
      page.getByTestId(
        "readonly-group-a",
      );


    const readOnlySecond =
      page.getByTestId(
        "readonly-group-b",
      );


    await readOnlySecond.click();


    await expect(
      readOnlyFirst,
    ).toBeChecked();


    await expect(
      readOnlySecond,
    ).not.toBeChecked();


    expect(
      (
        await readSnapshot(
          page,
        )
      ).readOnlyGroupChanges,
    ).toEqual([]);


    const disabledGroup =
      page.getByTestId(
        "disabled-group",
      );


    await expect(
      disabledGroup,
    ).toHaveAttribute(
      "data-disabled",
      "true",
    );


    await expect(
      disabledGroup,
    ).toHaveAttribute(
      "aria-invalid",
      "true",
    );


    await expect(
      disabledGroup,
    ).toHaveAttribute(
      "aria-required",
      "true",
    );


    await expect(
      page.getByTestId(
        "disabled-group-a",
      ),
    ).toBeDisabled();


    await expect(
      page.getByTestId(
        "disabled-group-b",
      ),
    ).toBeDisabled();
  },
);


// BLOCK 4: TEXT CONTROL BROWSER CONTRACT

async function block4ComputedStyle(
  locator:
    Locator,
  property:
    keyof CSSStyleDeclaration,
): Promise<string> {
  return locator.evaluate(
    (
      element,
      propertyName,
    ) =>
      getComputedStyle(
        element,
      )[
        propertyName
      ] as string,
    property,
  );
}


async function block4HasAttribute(
  locator:
    Locator,
  attribute:
    string,
): Promise<boolean> {
  return locator.evaluate(
    (
      element,
      attributeName,
    ) =>
      element.hasAttribute(
        attributeName,
      ),
    attribute,
  );
}


async function block4FocusByKeyboard(
  page:
    Page,
  startTestId:
    string,
  targetTestId:
    string,
): Promise<Locator> {
  const start =
    page.getByTestId(
      startTestId,
    );


  const target =
    page.getByTestId(
      targetTestId,
    );


  await start.focus();


  await page.keyboard.press(
    "Tab",
  );


  await expect(
    target,
  ).toBeFocused();


  return target;
}


test(
  "Block 4: keyboard focus shows rings and blur removes state",
  async ({
    page,
  }) => {
    const input =
      page.getByTestId(
        "block4-focus-input",
      );


    const textarea =
      page.getByTestId(
        "block4-focus-textarea",
      );


    const select =
      page.getByTestId(
        "block4-focus-select",
      );


    const inputBaseline =
      await block4ComputedStyle(
        input,
        "boxShadow",
      );


    await block4FocusByKeyboard(
      page,
      "block4-focus-start",
      "block4-focus-input",
    );


    expect(
      await block4HasAttribute(
        input,
        "data-focused",
      ),
    ).toBe(
      true,
    );


    expect(
      await block4HasAttribute(
        input,
        "data-focus-visible",
      ),
    ).toBe(
      true,
    );


    expect(
      await block4HasAttribute(
        input,
        "data-focus",
      ),
    ).toBe(
      false,
    );


    expect(
      await block4ComputedStyle(
        input,
        "boxShadow",
      ),
    ).not.toBe(
      inputBaseline,
    );


    await page.keyboard.press(
      "Tab",
    );


    await expect(
      textarea,
    ).toBeFocused();


    expect(
      await block4HasAttribute(
        input,
        "data-focused",
      ),
    ).toBe(
      false,
    );


    expect(
      await block4HasAttribute(
        textarea,
        "data-focus-visible",
      ),
    ).toBe(
      true,
    );


    expect(
      await block4ComputedStyle(
        textarea,
        "boxShadow",
      ),
    ).not.toBe(
      "none",
    );


    await page.keyboard.press(
      "Tab",
    );


    await expect(
      select,
    ).toBeFocused();


    expect(
      await block4HasAttribute(
        select,
        "data-focus-visible",
      ),
    ).toBe(
      true,
    );


    expect(
      await block4ComputedStyle(
        select,
        "boxShadow",
      ),
    ).not.toBe(
      "none",
    );


    await page.keyboard.press(
      "Tab",
    );


    expect(
      await block4HasAttribute(
        select,
        "data-focused",
      ),
    ).toBe(
      false,
    );


    expect(
      await block4HasAttribute(
        select,
        "data-focus-visible",
      ),
    ).toBe(
      false,
    );
  },
);


test(
  "Block 4: pointer focus has no keyboard ring",
  async ({
    page,
  }) => {
    for (
      const testId of [
        "block4-focus-input",
        "block4-focus-textarea",
        "block4-focus-select",
      ]
    ) {
      const control =
        page.getByTestId(
          testId,
        );


      const baseline =
        await block4ComputedStyle(
          control,
          "boxShadow",
        );


      await control.click();


      await expect(
        control,
      ).toBeFocused();


      expect(
        await block4HasAttribute(
          control,
          "data-focused",
        ),
      ).toBe(
        true,
      );


      expect(
        await block4HasAttribute(
          control,
          "data-focus-visible",
        ),
      ).toBe(
        false,
      );


      expect(
        await block4ComputedStyle(
          control,
          "boxShadow",
        ),
      ).toBe(
        baseline,
      );
    }
  },
);


test(
  "Block 4: invalid uses danger styling and keyboard-only ring",
  async ({
    page,
  }) => {
    const valid =
      page.getByTestId(
        "block4-valid-input",
      );


    const invalid =
      page.getByTestId(
        "block4-invalid-input",
      );


    const validBorder =
      await block4ComputedStyle(
        valid,
        "borderColor",
      );


    const invalidBorder =
      await block4ComputedStyle(
        invalid,
        "borderColor",
      );


    const invalidBaselineShadow =
      await block4ComputedStyle(
        invalid,
        "boxShadow",
      );


    expect(
      invalidBorder,
    ).not.toBe(
      validBorder,
    );


    await block4FocusByKeyboard(
      page,
      "block4-valid-start",
      "block4-valid-input",
    );


    const validKeyboardShadow =
      await block4ComputedStyle(
        valid,
        "boxShadow",
      );


    await block4FocusByKeyboard(
      page,
      "block4-invalid-start",
      "block4-invalid-input",
    );


    const invalidKeyboardShadow =
      await block4ComputedStyle(
        invalid,
        "boxShadow",
      );


    expect(
      invalidKeyboardShadow,
    ).not.toBe(
      invalidBaselineShadow,
    );


    expect(
      invalidKeyboardShadow,
    ).not.toBe(
      validKeyboardShadow,
    );


    await valid.click();


    await invalid.click();


    expect(
      await block4HasAttribute(
        invalid,
        "data-focus-visible",
      ),
    ).toBe(
      false,
    );


    expect(
      await block4ComputedStyle(
        invalid,
        "boxShadow",
      ),
    ).toBe(
      invalidBaselineShadow,
    );
  },
);


test(
  "Block 4: disabled uses one opacity and cannot focus",
  async ({
    page,
  }) => {
    for (
      const testId of [
        "block4-disabled-input",
        "block4-disabled-textarea",
        "block4-disabled-select",
      ]
    ) {
      const control =
        page.getByTestId(
          testId,
        );


      expect(
        await block4ComputedStyle(
          control,
          "opacity",
        ),
      ).toBe(
        "0.42",
      );


      expect(
        await block4ComputedStyle(
          control,
          "cursor",
        ),
      ).toBe(
        "not-allowed",
      );


      await control.evaluate(
        (
          element,
        ) => {
          (
            element as
              HTMLElement
          ).focus();
        },
      );


      await expect(
        control,
      ).not.toBeFocused();


      expect(
        await block4HasAttribute(
          control,
          "data-focus-visible",
        ),
      ).toBe(
        false,
      );
    }
  },
);


test(
  "Block 4: cursor semantics distinguish control types",
  async ({
    page,
  }) => {
    expect(
      await block4ComputedStyle(
        page.getByTestId(
          "block4-focus-input",
        ),
        "cursor",
      ),
    ).toBe(
      "text",
    );


    expect(
      await block4ComputedStyle(
        page.getByTestId(
          "block4-focus-textarea",
        ),
        "cursor",
      ),
    ).toBe(
      "text",
    );


    expect(
      await block4ComputedStyle(
        page.getByTestId(
          "block4-focus-select",
        ),
        "cursor",
      ),
    ).toBe(
      "pointer",
    );


    const readOnlyCursor =
      await block4ComputedStyle(
        page.getByTestId(
          "block4-readonly-select",
        ),
        "cursor",
      );


    expect(
      readOnlyCursor,
    ).not.toBe(
      "text",
    );


    expect(
      [
        "default",
        "not-allowed",
      ],
    ).toContain(
      readOnlyCursor,
    );


    expect(
      await block4ComputedStyle(
        page.getByTestId(
          "block4-disabled-select",
        ),
        "cursor",
      ),
    ).toBe(
      "not-allowed",
    );
  },
);


test(
  "Block 4: inline and slot overrides preserve precedence",
  async ({
    page,
  }) => {
    const inline =
      await block4FocusByKeyboard(
        page,
        "block4-inline-start",
        "block4-inline-input",
      );


    expect(
      await block4ComputedStyle(
        inline,
        "boxShadow",
      ),
    ).toContain(
      "rgb(1, 2, 3)",
    );


    expect(
      await block4ComputedStyle(
        inline,
        "borderTopWidth",
      ),
    ).toBe(
      "5px",
    );


    expect(
      await block4ComputedStyle(
        inline,
        "borderTopColor",
      ),
    ).toBe(
      "rgb(4, 5, 6)",
    );


    expect(
      await block4ComputedStyle(
        page.getByTestId(
          "block4-slot-style-input",
        ),
        "paddingLeft",
      ),
    ).toBe(
      "27px",
    );


    expect(
      await block4ComputedStyle(
        page.getByTestId(
          "block4-direct-style-input",
        ),
        "paddingLeft",
      ),
    ).toBe(
      "33px",
    );
  },
);


test(
  "Block 4: unstyled controls never recover frame or ring",
  async ({
    page,
  }) => {
    const cases = [
      {
        start:
          "block4-unstyled-input-start",

        control:
          "block4-unstyled-input",
      },

      {
        start:
          "block4-unstyled-textarea-start",

        control:
          "block4-unstyled-textarea",
      },

      {
        start:
          "block4-unstyled-select-start",

        control:
          "block4-unstyled-select",
      },
    ] as const;


    for (
      const item of
      cases
    ) {
      const control =
        await block4FocusByKeyboard(
          page,
          item.start,
          item.control,
        );


      expect(
        await block4ComputedStyle(
          control,
          "borderTopWidth",
        ),
      ).toBe(
        "0px",
      );


      expect(
        await block4ComputedStyle(
          control,
          "boxShadow",
        ),
      ).toBe(
        "none",
      );


      expect(
        await block4HasAttribute(
          control,
          "data-focus-visible",
        ),
      ).toBe(
        true,
      );


      expect(
        await control.getAttribute(
          "aria-label",
        ),
      ).toBeTruthy();
    }


    await expect(
      page.getByTestId(
        "block4-unstyled-input",
      ),
    ).toHaveValue(
      "unstyled input",
    );


    await expect(
      page.getByTestId(
        "block4-unstyled-textarea",
      ),
    ).toHaveValue(
      "unstyled textarea",
    );


    await expect(
      page.getByTestId(
        "block4-unstyled-select",
      ),
    ).toHaveValue(
      "a",
    );
  },
);


test(
  "Block 4: sizes and paddings consume control variables",
  async ({
    page,
  }) => {
    const expectedHeights = {
      sm:
        "31px",

      md:
        "37px",

      lg:
        "43px",
    } as const;


    const expectedPaddingX = {
      sm:
        "7px",

      md:
        "11px",

      lg:
        "15px",
    } as const;


    const expectedPaddingY = {
      sm:
        "3px",

      md:
        "5px",

      lg:
        "7px",
    } as const;


    const expectedTextareaMinHeight = {
      sm:
        "71px",

      md:
        "83px",

      lg:
        "97px",
    } as const;


    for (
      const size of [
        "sm",
        "md",
        "lg",
      ] as const
    ) {
      expect(
        await block4ComputedStyle(
          page.getByTestId(
            `block4-input-${size}`,
          ),
          "minHeight",
        ),
      ).toBe(
        expectedHeights[
          size
        ],
      );


      expect(
        await block4ComputedStyle(
          page.getByTestId(
            `block4-select-${size}`,
          ),
          "minHeight",
        ),
      ).toBe(
        expectedHeights[
          size
        ],
      );


      expect(
        await block4ComputedStyle(
          page.getByTestId(
            `block4-padding-${size}`,
          ),
          "paddingLeft",
        ),
      ).toBe(
        expectedPaddingX[
          size
        ],
      );


      expect(
        await block4ComputedStyle(
          page.getByTestId(
            `block4-padding-${size}`,
          ),
          "paddingTop",
        ),
      ).toBe(
        expectedPaddingY[
          size
        ],
      );


      expect(
        await block4ComputedStyle(
          page.getByTestId(
            `block4-textarea-${size}`,
          ),
          "minHeight",
        ),
      ).toBe(
        expectedTextareaMinHeight[
          size
        ],
      );
    }


    expect(
      await block4ComputedStyle(
        page.getByTestId(
          "block4-textarea-override",
        ),
        "minHeight",
      ),
    ).toBe(
      "123px",
    );
  },
);

