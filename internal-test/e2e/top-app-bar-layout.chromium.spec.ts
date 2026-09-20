import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


const PAGE_PATH =
  "/browser-top-app-bar.html";


type RectSnapshot = {
  left:
    number;

  right:
    number;

  top:
    number;

  bottom:
    number;

  width:
    number;
};


async function rect(
  locator:
    Locator,
): Promise<RectSnapshot> {
  const value =
    await locator
      .evaluate(
        (
          element,
        ) => {
          const box =
            element
              .getBoundingClientRect();

          return {
            left:
              box.left,

            right:
              box.right,

            top:
              box.top,

            bottom:
              box.bottom,

            width:
              box.width,
          };
        },
      );

  return value;
}


function overlaps(
  a:
    RectSnapshot,
  b:
    RectSnapshot,
): boolean {
  return !(
    a.right <=
      b.left ||
    a.left >=
      b.right ||
    a.bottom <=
      b.top ||
    a.top >=
      b.bottom
  );
}


async function assertLayoutInvariants(
  page:
    Page,
  width:
    number,
): Promise<void> {
  await page.setViewportSize({
    width,
    height:
      800,
  });

  await page.goto(
    PAGE_PATH,
  );

  const leading =
    page.getByTestId(
      "top-app-bar-leading",
    );

  const center =
    page.getByTestId(
      "top-app-bar-center",
    );

  const actions =
    page.getByTestId(
      "top-app-bar-actions",
    );

  await expect(
    center,
  ).toBeVisible();

  await expect(
    actions,
  ).toBeVisible();

  const [
    leadingRect,
    centerRect,
    actionsRect,
  ] =
    await Promise.all([
      rect(
        leading,
      ),

      rect(
        center,
      ),

      rect(
        actions,
      ),
    ]);

  expect(
    overlaps(
      leadingRect,
      centerRect,
    ),
  ).toBe(
    false,
  );

  expect(
    overlaps(
      centerRect,
      actionsRect,
    ),
  ).toBe(
    false,
  );

  expect(
    centerRect.width,
  ).toBeGreaterThan(
    0,
  );

  const overflow =
    await page.evaluate(
      () => ({
        document:
          document
            .documentElement
            .scrollWidth >
          document
            .documentElement
            .clientWidth,

        body:
          document
            .body
            .scrollWidth >
          document
            .body
            .clientWidth,
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


for (
  const width of [
    320,
    360,
    390,
    480,
    768,
  ] as const
) {
  test(
    `TopAppBar keeps zones separated at ${width}px`,
    async ({
      page,
    }) => {
      await assertLayoutInvariants(
        page,
        width,
      );
    },
  );
}
