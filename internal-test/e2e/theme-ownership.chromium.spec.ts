import {
  expect,
  test,
  type Page,
} from "@playwright/test";


const PAGE_PATH =
  "/browser-theme-ownership.html";


async function resetPage(
  page: Page
): Promise<void> {
  await page.goto(
    PAGE_PATH
  );


  await page.evaluate(() => {
    const root =
      document.documentElement;


    for (
      const property of [
        "--ui-primary",
        "--ui-primary-hover",
        "--ui-primary-contrast",
        "color-scheme",
      ]
    ) {
      root.style.removeProperty(
        property
      );
    }


    delete root.dataset.uiTheme;

    localStorage.clear();
  });
}


async function readStyleSnapshot(
  page: Page,
  property: string
): Promise<{
  value: string;
  priority: string;
}> {
  return page.evaluate(
    (propertyName) => {
      const style =
        document.documentElement.style;


      return {
        value:
          style.getPropertyValue(
            propertyName
          ),

        priority:
          style.getPropertyPriority(
            propertyName
          ),
      };
    },
    property
  );
}


test.beforeEach(
  async ({
    page,
  }) => {
    await resetPage(
      page
    );
  }
);


test(
  "restores a previous custom property with important priority",
  async ({
    page,
  }) => {
    const previousSnapshot =
      await page.evaluate(() => {
        const style =
          document.documentElement.style;


        style.setProperty(
          "--ui-primary",
          "external-primary",
          "important"
        );


        return {
          value:
            style.getPropertyValue(
              "--ui-primary"
            ),

          priority:
            style.getPropertyPriority(
              "--ui-primary"
            ),
        };
      });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount()
    );


    expect(
      await readStyleSnapshot(
        page,
        "--ui-primary"
      )
    ).toEqual({
      value:
        "#111111",

      priority:
        "",
    });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount()
    );


    expect(
      await readStyleSnapshot(
        page,
        "--ui-primary"
      )
    ).toEqual(
      previousSnapshot
    );
  }
);


test(
  "keeps ownership of a shared property while changing themes",
  async ({
    page,
  }) => {
    const previousSnapshot =
      await page.evaluate(() => {
        const style =
          document.documentElement.style;


        style.setProperty(
          "--ui-primary",
          "external-before-provider"
        );


        return {
          value:
            style.getPropertyValue(
              "--ui-primary"
            ),

          priority:
            style.getPropertyPriority(
              "--ui-primary"
            ),
        };
      });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount({
            initialTheme:
              "browser-dark",
          })
    );


    expect(
      (
        await readStyleSnapshot(
          page,
          "--ui-primary"
        )
      ).value
    ).toBe(
      "#111111"
    );


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .setTheme(
            "browser-light"
          )
    );


    expect(
      (
        await readStyleSnapshot(
          page,
          "--ui-primary"
        )
      ).value
    ).toBe(
      "#eeeeee"
    );


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount()
    );


    expect(
      await readStyleSnapshot(
        page,
        "--ui-primary"
      )
    ).toEqual(
      previousSnapshot
    );
  }
);


test(
  "preserves an external mutation made while a custom property is owned",
  async ({
    page,
  }) => {
    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount()
    );


    const externalMutation =
      await page.evaluate(() => {
        const style =
          document.documentElement.style;


        style.setProperty(
          "--ui-primary",
          "external-mutation",
          "important"
        );


        return {
          value:
            style.getPropertyValue(
              "--ui-primary"
            ),

          priority:
            style.getPropertyPriority(
              "--ui-primary"
            ),
        };
      });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount()
    );


    expect(
      await readStyleSnapshot(
        page,
        "--ui-primary"
      )
    ).toEqual(
      externalMutation
    );
  }
);


test(
  "updates color-scheme and restores its previous external value",
  async ({
    page,
  }) => {
    const previousSnapshot =
      await page.evaluate(() => {
        const style =
          document.documentElement.style;


        style.setProperty(
          "color-scheme",
          "only light",
          "important"
        );


        return {
          value:
            style.getPropertyValue(
              "color-scheme"
            ),

          priority:
            style.getPropertyPriority(
              "color-scheme"
            ),
        };
      });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount({
            initialTheme:
              "browser-dark",
          })
    );


    expect(
      await readStyleSnapshot(
        page,
        "color-scheme"
      )
    ).toEqual({
      value:
        "dark",

      priority:
        "",
    });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .setTheme(
            "browser-light"
          )
    );


    expect(
      await readStyleSnapshot(
        page,
        "color-scheme"
      )
    ).toEqual({
      value:
        "light",

      priority:
        "",
    });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount()
    );


    expect(
      await readStyleSnapshot(
        page,
        "color-scheme"
      )
    ).toEqual(
      previousSnapshot
    );
  }
);


test(
  "preserves an external color-scheme mutation on unmount",
  async ({
    page,
  }) => {
    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount({
            initialTheme:
              "browser-dark",
          })
    );


    const externalMutation =
      await page.evaluate(() => {
        const style =
          document.documentElement.style;


        style.setProperty(
          "color-scheme",
          "only dark",
          "important"
        );


        return {
          value:
            style.getPropertyValue(
              "color-scheme"
            ),

          priority:
            style.getPropertyPriority(
              "color-scheme"
            ),
        };
      });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount()
    );


    expect(
      await readStyleSnapshot(
        page,
        "color-scheme"
      )
    ).toEqual(
      externalMutation
    );
  }
);


test(
  "preserves snapshots through the StrictMode mount-cleanup-mount cycle",
  async ({
    page,
  }) => {
    const previousSnapshot =
      await page.evaluate(() => {
        const root =
          document.documentElement;


        root.style.setProperty(
          "--ui-primary",
          "strict-external",
          "important"
        );


        root.style.setProperty(
          "color-scheme",
          "only light"
        );


        root.dataset.uiTheme =
          "strict-previous";


        return {
          theme:
            root.dataset.uiTheme,

          primary:
            root.style.getPropertyValue(
              "--ui-primary"
            ),

          primaryPriority:
            root.style.getPropertyPriority(
              "--ui-primary"
            ),

          colorScheme:
            root.style.getPropertyValue(
              "color-scheme"
            ),

          colorSchemePriority:
            root.style.getPropertyPriority(
              "color-scheme"
            ),
        };
      });


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .mount({
            strictMode:
              true,

            initialTheme:
              "browser-dark",
          })
    );


    expect(
      await page.evaluate(
        () =>
          document
            .documentElement
            .dataset
            .uiTheme
      )
    ).toBe(
      "browser-dark"
    );


    expect(
      (
        await readStyleSnapshot(
          page,
          "--ui-primary"
        )
      ).value
    ).toBe(
      "#111111"
    );


    expect(
      (
        await readStyleSnapshot(
          page,
          "color-scheme"
        )
      ).value
    ).toBe(
      "dark"
    );


    await page.evaluate(
      () =>
        window
          .themeOwnershipHarness
          .unmount()
    );


    const restoredSnapshot =
      await page.evaluate(() => {
        const root =
          document.documentElement;


        return {
          theme:
            root.dataset.uiTheme,

          primary:
            root.style.getPropertyValue(
              "--ui-primary"
            ),

          primaryPriority:
            root.style.getPropertyPriority(
              "--ui-primary"
            ),

          colorScheme:
            root.style.getPropertyValue(
              "color-scheme"
            ),

          colorSchemePriority:
            root.style.getPropertyPriority(
              "color-scheme"
            ),
        };
      });


    expect(
      restoredSnapshot
    ).toEqual(
      previousSnapshot
    );
  }
);