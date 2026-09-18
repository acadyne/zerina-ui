import {
  expect,
  test,
} from "@playwright/test";


test.beforeEach(
  async ({
    page,
  }) => {
    await page.goto(
      "/browser-interaction-overlay.html",
    );
  },
);


test(
  "a rejected Menu keyboard request cannot leak its focus intent into a later programmatic open",
  async ({
    page,
  }) => {
    const trigger =
      page.getByTestId(
        "menu-trigger",
      );

    await trigger.focus();

    await page.keyboard.press(
      "ArrowUp",
    );

    await expect(
      page.getByTestId(
        "menu-first",
      ),
    ).toHaveCount(
      0,
    );

    await page
      .getByTestId(
        "menu-programmatic-open",
      )
      .click();

    await expect(
      page.getByTestId(
        "menu-first",
      ),
    ).toBeVisible();

    await expect(
      page.getByTestId(
        "menu-first",
      ),
    ).toBeFocused();

    await expect(
      page.getByTestId(
        "menu-last",
      ),
    ).not.toBeFocused();
  },
);


test(
  "Drawer shares modal focus/dismiss runtime and restores focus after Escape",
  async ({
    page,
  }) => {
    const opener =
      page.getByTestId(
        "drawer-open",
      );

    await opener.click();

    await expect(
      page.getByTestId(
        "drawer-input",
      ),
    ).toBeFocused();

    await expect(
      page.locator(
        "[data-ui-drawer-panel]",
      ),
    ).toHaveAttribute(
      "role",
      "dialog",
    );

    await page.keyboard.press(
      "Escape",
    );

    await expect(
      page.locator(
        "[data-ui-drawer-panel]",
      ),
    ).toHaveCount(
      0,
    );

    await expect(
      opener,
    ).toBeFocused();
  },
);


test(
  "BottomSheet shares modal outside-dismiss runtime without stealing focus back to the opener",
  async ({
    page,
  }) => {
    const opener =
      page.getByTestId(
        "sheet-open",
      );

    await opener.click();

    await expect(
      page.getByTestId(
        "sheet-input",
      ),
    ).toBeFocused();

    const backdrop =
      page.locator(
        "[data-ui-bottom-sheet-backdrop]",
      );

    await backdrop.click({
      position: {
        x: 10,
        y: 10,
      },
    });

    await expect(
      page.locator(
        "[data-ui-bottom-sheet-panel]",
      ),
    ).toHaveCount(
      0,
    );

    await expect(
      opener,
    ).not.toBeFocused();

    const focusedTestId =
      await page.evaluate(
        () =>
          document.activeElement
            ?.getAttribute(
              "data-testid",
            ) ??
          null,
      );

    expect(
      focusedTestId,
    ).not.toBe(
      "sheet-input",
    );
  },
);
