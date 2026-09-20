import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


const PAGE_PATH =
  "/browser-adaptive-scaffold-layout.html";


type RectSnapshot = {
  top:
    number;

  bottom:
    number;

  height:
    number;
};


async function rect(
  locator:
    Locator,
): Promise<RectSnapshot> {
  return locator.evaluate(
    (
      element,
    ) => {
      const box =
        element
          .getBoundingClientRect();

      return {
        top:
          box.top,

        bottom:
          box.bottom,

        height:
          box.height,
      };
    },
  );
}


function expectNear(
  actual:
    number,
  expected:
    number,
  tolerance =
    1,
): void {
  expect(
    Math.abs(
      actual -
      expected,
    ),
  ).toBeLessThanOrEqual(
    tolerance,
  );
}


async function expectNoPageScroll(
  page:
    Page,
): Promise<void> {
  const overflow =
    await page.evaluate(
      () => ({
        document:
          document
            .documentElement
            .scrollHeight >
          document
            .documentElement
            .clientHeight,

        body:
          document
            .body
            .scrollHeight >
          document
            .body
            .clientHeight,
      }),
    );

  expect(
    overflow,
  ).toEqual({
    document:
      false,

    body:
      false,
  });
}


test(
  "desktop sidebar fills the shell below the app bar with short content",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width:
        1280,

      height:
        800,
    });

    await page.goto(
      `${PAGE_PATH}?mode=desktop&appBar=1&content=short`,
    );

    const root =
      await rect(
        page.getByTestId(
          "adaptive-root",
        ),
      );

    const body =
      await rect(
        page.getByTestId(
          "adaptive-body",
        ),
      );

    const sidebar =
      await rect(
        page.getByTestId(
          "adaptive-sidebar",
        ),
      );

    const content =
      await rect(
        page.getByTestId(
          "adaptive-content",
        ),
      );

    expect(
      body.top,
    ).toBeGreaterThan(
      root.top,
    );

    expectNear(
      body.bottom,
      root.bottom,
    );

    expectNear(
      sidebar.height,
      body.height,
    );

    expectNear(
      sidebar.bottom,
      body.bottom,
    );

    expectNear(
      content.height,
      body.height,
    );

    await expectNoPageScroll(
      page,
    );
  },
);


test(
  "desktop sidebar fills the viewport when the app bar is absent",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width:
        1280,

      height:
        800,
    });

    await page.goto(
      `${PAGE_PATH}?mode=desktop&appBar=0&content=short`,
    );

    const root =
      await rect(
        page.getByTestId(
          "adaptive-root",
        ),
      );

    const body =
      await rect(
        page.getByTestId(
          "adaptive-body",
        ),
      );

    const sidebar =
      await rect(
        page.getByTestId(
          "adaptive-sidebar",
        ),
      );

    expectNear(
      body.top,
      root.top,
    );

    expectNear(
      body.bottom,
      root.bottom,
    );

    expectNear(
      sidebar.height,
      body.height,
    );
  },
);


test(
  "desktop keeps tall content scrolling inside the content region without shrinking the sidebar",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width:
        1280,

      height:
        800,
    });

    await page.goto(
      `${PAGE_PATH}?mode=desktop&appBar=1&content=tall`,
    );

    const body =
      await rect(
        page.getByTestId(
          "adaptive-body",
        ),
      );

    const sidebar =
      await rect(
        page.getByTestId(
          "adaptive-sidebar",
        ),
      );

    const content =
      await rect(
        page.getByTestId(
          "adaptive-content",
        ),
      );

    expectNear(
      sidebar.height,
      body.height,
    );

    expectNear(
      content.height,
      body.height,
    );

    const contentFrame =
      await rect(
        page.locator(
          "[data-ui-adaptive-scaffold-content-frame]",
        ),
      );

    const screenContent =
      await rect(
        page.getByTestId(
          "screen-content",
        ),
      );

    expectNear(
      contentFrame.height,
      content.height,
    );

    expectNear(
      screenContent.height,
      contentFrame.height,
    );

    const scrollMetrics =
      await page
        .getByTestId(
          "screen-content",
        )
        .evaluate(
          (
            element,
          ) => ({
            clientHeight:
              element.clientHeight,

            scrollHeight:
              element.scrollHeight,

            overflowY:
              getComputedStyle(
                element,
              ).overflowY,
          }),
        );

    expect(
      scrollMetrics.scrollHeight,
    ).toBeGreaterThan(
      scrollMetrics.clientHeight,
    );

    expect(
      [
        "auto",
        "scroll",
      ],
    ).toContain(
      scrollMetrics.overflowY,
    );

    await expectNoPageScroll(
      page,
    );
  },
);


test(
  "tablet rail stretches through the same available body height",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width:
        900,

      height:
        800,
    });

    await page.goto(
      `${PAGE_PATH}?mode=tablet&appBar=1&content=short`,
    );

    const body =
      await rect(
        page.getByTestId(
          "adaptive-body",
        ),
      );

    const railWrapper =
      await rect(
        page.getByTestId(
          "adaptive-rail",
        ),
      );

    const rail =
      await rect(
        page.locator(
          "[data-ui-navigation-rail]",
        ),
      );

    expectNear(
      railWrapper.height,
      body.height,
    );

    expectNear(
      rail.height,
      body.height,
    );
  },
);


test(
  "mobile content and bottom navigation preserve the shell height contract",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width:
        390,

      height:
        800,
    });

    await page.goto(
      `${PAGE_PATH}?mode=mobile&appBar=1&content=short`,
    );

    const root =
      await rect(
        page.getByTestId(
          "adaptive-root",
        ),
      );

    const content =
      await rect(
        page.getByTestId(
          "adaptive-content",
        ),
      );

    const scaffoldBody =
      await rect(
        page.locator(
          "[data-ui-scaffold] > main",
        ),
      );

    const scaffoldFooter =
      await rect(
        page.locator(
          "[data-ui-scaffold] > footer",
        ),
      );

    const bottomNavigation =
      await rect(
        page.getByTestId(
          "adaptive-mobile-navigation",
        ),
      );

    expectNear(
      content.height,
      scaffoldBody.height,
    );

    expectNear(
      content.bottom,
      scaffoldBody.bottom,
    );

    expectNear(
      scaffoldBody.bottom,
      scaffoldFooter.top,
    );

    expectNear(
      scaffoldFooter.bottom,
      root.bottom,
    );

    expect(
      bottomNavigation.top,
    ).toBeGreaterThanOrEqual(
      scaffoldFooter.top -
      1,
    );

    expect(
      bottomNavigation.bottom,
    ).toBeLessThanOrEqual(
      scaffoldFooter.bottom +
      1,
    );

    await expectNoPageScroll(
      page,
    );
  },
);


test(
  "contained desktop sidebar fills a defined parent height without viewport positioning",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width:
        1280,

      height:
        900,
    });

    await page.goto(
      `${PAGE_PATH}?mode=desktop&appBar=1&content=short&viewport=contained`,
    );

    const host =
      await rect(
        page.getByTestId(
          "contained-host",
        ),
      );

    const root =
      await rect(
        page.getByTestId(
          "adaptive-root",
        ),
      );

    const body =
      await rect(
        page.getByTestId(
          "adaptive-body",
        ),
      );

    const sidebar =
      await rect(
        page.getByTestId(
          "adaptive-sidebar",
        ),
      );

    expectNear(
      root.height,
      host.height,
    );

    expectNear(
      body.bottom,
      root.bottom,
    );

    expectNear(
      sidebar.height,
      body.height,
    );

    const sidebarPosition =
      await page
        .getByTestId(
          "adaptive-sidebar",
        )
        .evaluate(
          (
            element,
          ) =>
            getComputedStyle(
              element,
            ).position,
        );

    expect(
      sidebarPosition,
    ).not.toBe(
      "fixed",
    );
  },
);
