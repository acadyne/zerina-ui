import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


type ConsumerContract = {
  testId: string;
  focusedAttribute: string;
  focusVisibleAttribute: string;
  removedWhenDisabled?: boolean;
};


const consumers:
  ConsumerContract[] = [
    {
      testId:
        "press-button",

      focusedAttribute:
        "data-focused",

      focusVisibleAttribute:
        "data-focus-visible",
    },

    {
      testId:
        "press-icon-button",

      focusedAttribute:
        "data-focused",

      focusVisibleAttribute:
        "data-focus-visible",
    },

    {
      testId:
        "press-pressable",

      focusedAttribute:
        "data-focused",

      focusVisibleAttribute:
        "data-focus-visible",
    },

    {
      testId:
        "press-toast-close",

      focusedAttribute:
        "data-focused",

      focusVisibleAttribute:
        "data-focus-visible",

      removedWhenDisabled:
        true,
    },

    {
      testId:
        "press-tag-remove",

      focusedAttribute:
        "data-focused",

      focusVisibleAttribute:
        "data-focus-visible",
    },
  ];


async function expectFocusedState(
  locator: Locator,
  contract: ConsumerContract,
  focusVisible: boolean,
): Promise<void> {
  await expect(
    locator,
  ).toBeFocused();

  expect(
    await locator.getAttribute(
      contract.focusedAttribute,
    ),
  ).not.toBeNull();

  if (focusVisible) {
    expect(
      await locator.getAttribute(
        contract.focusVisibleAttribute,
      ),
    ).not.toBeNull();
  } else {
    expect(
      await locator.getAttribute(
        contract.focusVisibleAttribute,
      ),
    ).toBeNull();
  }
}


async function openPage(
  page: Page,
): Promise<void> {
  await page.goto(
    "/browser-use-press.html",
  );

  await expect(
    page.getByTestId(
      "press-focus-start",
    ),
  ).toBeVisible();
}


async function setConsumersDisabled(
  page: Page,
  disabled: boolean,
): Promise<void> {
  await page.evaluate(
    (
      nextDisabled,
    ) => {
      const setter =
        window
          .__setPressConsumersDisabled;


      if (!setter) {
        throw new Error(
          "The consumer disabled setter is unavailable.",
        );
      }


      setter(
        nextDisabled,
      );
    },
    disabled,
  );


  await page.evaluate(
    () =>
      new Promise<void>(
        (
          resolve,
        ) => {
          requestAnimationFrame(
            () => {
              requestAnimationFrame(
                () => {
                  resolve();
                },
              );
            },
          );
        },
      ),
  );
}


async function establishKeyboardModality(
  page: Page,
): Promise<void> {
  await page
    .getByTestId(
      "press-focus-start",
    )
    .click();


  await page.keyboard.press(
    "Tab",
  );
}


test.beforeEach(
  async ({
    page,
  }) => {
    await openPage(
      page,
    );
  },
);


test(
  "usePress consumers expose focus-visible after keyboard navigation",
  async ({
    page,
  }) => {
    await page
      .getByTestId(
        "press-focus-start",
      )
      .click();


    let previous:
      {
        locator: Locator;
        contract: ConsumerContract;
      }
      | undefined;


    for (
      const contract
      of consumers
    ) {
      await page.keyboard.press(
        "Tab",
      );

      const locator =
        page.getByTestId(
          contract.testId,
        );


      await expectFocusedState(
        locator,
        contract,
        true,
      );


      if (previous) {
        expect(
          await previous.locator.getAttribute(
            previous
              .contract
              .focusedAttribute,
          ),
        ).toBeNull();

        expect(
          await previous.locator.getAttribute(
            previous
              .contract
              .focusVisibleAttribute,
          ),
        ).toBeNull();
      }


      previous = {
        locator,
        contract,
      };
    }
  },
);


test(
  "usePress consumers suppress focus-visible after pointer focus",
  async ({
    page,
  }) => {
    for (
      const contract
      of consumers
    ) {
      const locator =
        page.getByTestId(
          contract.testId,
        );


      await locator.click();


      await expectFocusedState(
        locator,
        contract,
        false,
      );
    }
  },
);


test(
  "programmatic focus follows the latest input modality",
  async ({
    page,
  }) => {
    const start =
      page.getByTestId(
        "press-focus-start",
      );


    await establishKeyboardModality(
      page,
    );


    for (
      const contract
      of consumers
    ) {
      const locator =
        page.getByTestId(
          contract.testId,
        );


      await locator.focus();


      await expectFocusedState(
        locator,
        contract,
        true,
      );
    }


    for (
      const contract
      of consumers
    ) {
      const locator =
        page.getByTestId(
          contract.testId,
        );


      await start.focus();

      await locator.hover();

      await locator.focus();


      await expectFocusedState(
        locator,
        contract,
        false,
      );
    }
  },
);


test(
  "usePress consumers clear focused states on blur",
  async ({
    page,
  }) => {
    const start =
      page.getByTestId(
        "press-focus-start",
      );


    await establishKeyboardModality(
      page,
    );


    for (
      const contract
      of consumers
    ) {
      const locator =
        page.getByTestId(
          contract.testId,
        );


      await locator.focus();


      await expectFocusedState(
        locator,
        contract,
        true,
      );


      await start.focus();


      await expect(
        locator,
      ).not.toBeFocused();

      expect(
        await locator.getAttribute(
          contract.focusedAttribute,
        ),
      ).toBeNull();

      expect(
        await locator.getAttribute(
          contract.focusVisibleAttribute,
        ),
      ).toBeNull();
    }
  },
);


test(
  "usePress consumers clear focused states when disabled",
  async ({
    page,
  }) => {
    await setConsumersDisabled(
      page,
      false,
    );


    await establishKeyboardModality(
      page,
    );


    for (
      const contract
      of consumers
    ) {
      const locator =
        page.getByTestId(
          contract.testId,
        );


      await setConsumersDisabled(
        page,
        false,
      );

      await locator.focus();


      await expectFocusedState(
        locator,
        contract,
        true,
      );


      await setConsumersDisabled(
        page,
        true,
      );


      if (
        contract.removedWhenDisabled
      ) {
        await expect(
          locator,
        ).toHaveCount(
          0,
        );

        continue;
      }


      await expect(
        locator,
      ).toBeAttached();

      expect(
        await locator.getAttribute(
          contract.focusedAttribute,
        ),
      ).toBeNull();

      expect(
        await locator.getAttribute(
          contract.focusVisibleAttribute,
        ),
      ).toBeNull();
    }
  },
);


test(
  "MenuItem clears focus-visible on blur and disabled",
  async ({
    page,
  }) => {
    const trigger =
      page.getByTestId(
        "press-menu-trigger",
      );

    const item =
      page.getByTestId(
        "press-menu-item",
      );


    await setConsumersDisabled(
      page,
      false,
    );


    await trigger.focus();

    await page.keyboard.press(
      "ArrowDown",
    );


    await expect(
      item,
    ).toBeVisible();

    await expect(
      item,
    ).toBeFocused();

    expect(
      await item.getAttribute(
        "data-focus-visible",
      ),
    ).not.toBeNull();


    await trigger.focus();


    expect(
      await item.getAttribute(
        "data-focus-visible",
      ),
    ).toBeNull();


    await page.keyboard.press(
      "ArrowDown",
    );


    await expect(
      item,
    ).toBeVisible();

    await expect(
      item,
    ).toBeFocused();

    expect(
      await item.getAttribute(
        "data-focus-visible",
      ),
    ).not.toBeNull();


    await setConsumersDisabled(
      page,
      true,
    );


    expect(
      await item.getAttribute(
        "data-disabled",
      ),
    ).not.toBeNull();

    expect(
      await item.getAttribute(
        "data-focus-visible",
      ),
    ).toBeNull();
  },
);


test(
  "MenuItem distinguishes pointer and keyboard focus",
  async ({
    page,
  }) => {
    const trigger =
      page.getByTestId(
        "press-menu-trigger",
      );

    const item =
      page.getByTestId(
        "press-menu-item",
      );


    await trigger.click();


    await expect(
      item,
    ).toBeVisible();

    await expect(
      item,
    ).toBeFocused();

    expect(
      await item.getAttribute(
        "data-focused",
      ),
    ).not.toBeNull();

    expect(
      await item.getAttribute(
        "data-focus-visible",
      ),
    ).toBeNull();


    await trigger.click();

    await expect(
      item,
    ).toBeHidden();


    await trigger.focus();

    await page.keyboard.press(
      "ArrowDown",
    );


    await expect(
      item,
    ).toBeVisible();

    await expect(
      item,
    ).toBeFocused();

    await expect(
      item,
    ).toHaveAttribute(
      "data-focused",
      "",
    );

    expect(
      await item.getAttribute(
        "data-focus-visible",
      ),
    ).not.toBeNull();
  },
);
