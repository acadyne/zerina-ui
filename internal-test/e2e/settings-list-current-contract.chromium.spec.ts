import {
  expect,
  test,
} from "@playwright/test";


async function settle(): Promise<void> {
  await new Promise<void>(
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
  );
}


test(
  "SettingsList preventDefault immediately restores uncontrolled native controls",
  async ({
    page,
  }) => {
    await page.goto(
      "/browser-settings-list-contract.html",
    );

    const switchControl =
      page.getByTestId(
        "prevent-switch",
      );

    const checkbox =
      page.getByTestId(
        "prevent-checkbox",
      );


    await expect(
      switchControl,
    ).not.toBeChecked();

    await expect(
      checkbox,
    ).not.toBeChecked();


    await switchControl.click();
    await checkbox.click();

    await page.evaluate(
      settle,
    );


    await expect(
      switchControl,
    ).not.toBeChecked();

    await expect(
      checkbox,
    ).not.toBeChecked();


    const events =
      await page.evaluate(
        () =>
          window
            .settingsListContract
            .snapshot(),
      );


    expect(
      events.switchEvent,
    ).toEqual({
      calls:
        1,

      next:
        true,

      eventChecked:
        true,

      defaultPrevented:
        true,
    });

    expect(
      events.checkboxEvent,
    ).toEqual({
      calls:
        1,

      next:
        true,

      eventChecked:
        true,

      defaultPrevented:
        true,
    });


    await page
      .getByTestId(
        "force-rerender",
      )
      .click();

    await page.evaluate(
      settle,
    );


    await expect(
      switchControl,
    ).not.toBeChecked();

    await expect(
      checkbox,
    ).not.toBeChecked();
  },
);
