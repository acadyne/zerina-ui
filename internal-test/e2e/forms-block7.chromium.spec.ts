import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


const PAGE_PATH =
  "/browser-block7.html";

const CONTRAST_THRESHOLD =
  4.5;


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


async function dispatchPointer(
  locator: Locator,
  type: string,
  pointerType:
    | "mouse"
    | "touch"
    | "pen" =
      "mouse",
): Promise<void> {
  await locator.evaluate(
    (
      element,
      payload,
    ) => {
      element.dispatchEvent(
        new PointerEvent(
          payload.type,
          {
            bubbles:
              true,

            cancelable:
              true,

            composed:
              true,

            pointerId:
              payload.pointerType ===
                "mouse"
                ? 1
                : 2,

            pointerType:
              payload.pointerType,

            isPrimary:
              true,

            button:
              0,
          },
        ),
      );
    },
    {
      type,
      pointerType,
    },
  );
}


async function mouseCenter(
  locator: Locator,
): Promise<{
  x: number;
  y: number;
}> {
  const box =
    await locator.boundingBox();

  if (!box) {
    throw new Error(
      "Expected a visible element with a bounding box.",
    );
  }

  return {
    x:
      box.x +
      box.width / 2,

    y:
      box.y +
      box.height / 2,
  };
}


async function armPressedObserver(
  page: Page,
  testId: string,
): Promise<void> {
  await page.evaluate(
    (
      id,
    ) => {
      const state =
        window as Window & {
          __block7PressedSeen?:
            boolean;

          __block7PressedObserver?:
            MutationObserver;
        };

      state
        .__block7PressedObserver
        ?.disconnect();

      state.__block7PressedSeen =
        false;

      const element =
        document.querySelector(
          `[data-testid="${id}"]`,
        );

      if (!element) {
        throw new Error(
          `Missing pressed target ${id}.`,
        );
      }

      const observer =
        new MutationObserver(
          () => {
            if (
              element.hasAttribute(
                "data-pressed",
              )
            ) {
              state
                .__block7PressedSeen =
                true;
            }
          },
        );

      observer.observe(
        element,
        {
          attributes:
            true,

          attributeFilter: [
            "data-pressed",
          ],
        },
      );

      state
        .__block7PressedObserver =
        observer;
    },
    testId,
  );
}


async function pressedWasSeen(
  page: Page,
): Promise<boolean> {
  return page.evaluate(
    () =>
      Boolean(
        (
          window as Window & {
            __block7PressedSeen?:
              boolean;
          }
        ).__block7PressedSeen,
      ),
  );
}


async function effectiveContrast(
  locator: Locator,
): Promise<number> {
  return locator.evaluate(
    (
      element,
    ) => {
      type Color = {
        r: number;
        g: number;
        b: number;
        a: number;
      };


      function parseColor(
        value: string,
      ): Color {
        const match =
          value.match(
            /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
          );

        if (!match) {
          throw new Error(
            `Unsupported computed color: ${value}`,
          );
        }

        return {
          r:
            Number(
              match[1],
            ),

          g:
            Number(
              match[2],
            ),

          b:
            Number(
              match[3],
            ),

          a:
            match[4] ===
              undefined
              ? 1
              : Number(
                  match[4],
                ),
        };
      }


      function composite(
        foreground: Color,
        background: Color,
      ): Color {
        const alpha =
          foreground.a +
          background.a *
            (
              1 -
              foreground.a
            );

        if (alpha === 0) {
          return {
            r:
              0,

            g:
              0,

            b:
              0,

            a:
              0,
          };
        }

        return {
          r:
            (
              foreground.r *
                foreground.a +
              background.r *
                background.a *
                (
                  1 -
                  foreground.a
                )
            ) /
            alpha,

          g:
            (
              foreground.g *
                foreground.a +
              background.g *
                background.a *
                (
                  1 -
                  foreground.a
                )
            ) /
            alpha,

          b:
            (
              foreground.b *
                foreground.a +
              background.b *
                background.a *
                (
                  1 -
                  foreground.a
                )
            ) /
            alpha,

          a:
            alpha,
        };
      }


      function luminance(
        color: Color,
      ): number {
        const channels = [
          color.r,
          color.g,
          color.b,
        ].map(
          (
            channel,
          ) => {
            const normalized =
              channel /
              255;

            return normalized <=
              0.04045
              ? normalized /
                  12.92
              : Math.pow(
                  (
                    normalized +
                    0.055
                  ) /
                    1.055,
                  2.4,
                );
          },
        );

        return (
          channels[0] *
            0.2126 +
          channels[1] *
            0.7152 +
          channels[2] *
            0.0722
        );
      }


      const chain:
        Element[] = [];

      let current:
        Element |
        null =
          element;

      while (current) {
        chain.push(
          current,
        );

        current =
          current.parentElement;
      }

      chain.reverse();

      let background:
        Color = {
          r:
            255,

          g:
            255,

          b:
            255,

          a:
            1,
        };

      for (
        const node of
        chain
      ) {
        background =
          composite(
            parseColor(
              getComputedStyle(
                node,
              ).backgroundColor,
            ),
            background,
          );
      }

      const foreground =
        composite(
          parseColor(
            getComputedStyle(
              element,
            ).color,
          ),
          background,
        );

      const foregroundLuminance =
        luminance(
          foreground,
        );

      const backgroundLuminance =
        luminance(
          background,
        );

      return (
        Math.max(
          foregroundLuminance,
          backgroundLuminance,
        ) +
        0.05
      ) /
        (
          Math.min(
            foregroundLuminance,
            backgroundLuminance,
          ) +
          0.05
        );
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
        "block7-generic-button",
      ),
    ).toBeVisible();
  },
);


test(
  "Block 7: shared interactive recipe projects rest, hover and pressed surfaces",
  async ({
    page,
  }) => {
    const target =
      page.getByTestId(
        "block7-generic-button",
      );


    const rest =
      (
        await computed(
          target,
          "background-color",
        )
      ).trim();


    await target.hover();

    await expect(
      target,
    ).toHaveAttribute(
      "data-hovered",
      "",
    );

    const hovered =
      (
        await computed(
          target,
          "background-color",
        )
      ).trim();


    const center =
      await mouseCenter(
        target,
      );

    await page.mouse.move(
      center.x,
      center.y,
    );

    await page.mouse.down();

    await expect(
      target,
    ).toHaveAttribute(
      "data-pressed",
      "",
    );

    const pressed =
      (
        await computed(
          target,
          "background-color",
        )
      ).trim();

    await page.mouse.up();


    expect(
      hovered,
    ).not.toBe(
      rest,
    );

    expect(
      pressed,
    ).not.toBe(
      hovered,
    );
  },
);


test(
  "Block 7: hover is exclusive to mouse input",
  async ({
    page,
  }) => {
    const mouse =
      page.getByTestId(
        "block7-generic-button",
      );

    await mouse.hover();

    await expect(
      mouse,
    ).toHaveAttribute(
      "data-hovered",
      "",
    );

    await expect(
      mouse,
    ).toHaveAttribute(
      "data-pointer-type",
      "mouse",
    );

    const touch =
      page.getByTestId(
        "block7-touch-target",
      );

    await dispatchPointer(
      touch,
      "pointerover",
      "touch",
    );

    await expect(
      touch,
    ).not.toHaveAttribute(
      "data-hovered",
      "",
    );

    await expect(
      touch,
    ).toHaveAttribute(
      "data-pointer-type",
      "touch",
    );

    const pen =
      page.getByTestId(
        "block7-pen-target",
      );

    await dispatchPointer(
      pen,
      "pointerover",
      "pen",
    );

    await expect(
      pen,
    ).not.toHaveAttribute(
      "data-hovered",
      "",
    );

    await expect(
      pen,
    ).toHaveAttribute(
      "data-pointer-type",
      "pen",
    );
  },
);


test(
  "Block 7: primary pointer exposes pressed until pointer up",
  async ({
    page,
  }) => {
    const target =
      page.getByTestId(
        "block7-generic-pressable",
      );

    const center =
      await mouseCenter(
        target,
      );

    await page.mouse.move(
      center.x,
      center.y,
    );

    await page.mouse.down();

    await expect(
      target,
    ).toHaveAttribute(
      "data-pressed",
      "",
    );

    await page.mouse.up();

    await expect(
      target,
    ).not.toHaveAttribute(
      "data-pressed",
      "",
    );
  },
);


test(
  "Block 7: Enter and Space both expose a pressed transition",
  async ({
    page,
  }) => {
    const target =
      page.getByTestId(
        "block7-keyboard-button",
      );

    await target.focus();

    for (
      const key of [
        "Enter",
        " ",
      ]
    ) {
      await armPressedObserver(
        page,
        "block7-keyboard-button",
      );

      await page.keyboard.down(
        key,
      );

      if (key === " ") {
        await expect(
          target,
        ).toHaveAttribute(
          "data-pressed",
          "",
        );
      }

      await page.keyboard.up(
        key,
      );

      await expect
        .poll(
          () =>
            pressedWasSeen(
              page,
            ),
        )
        .toBe(
          true,
        );

      await expect(
        target,
      ).not.toHaveAttribute(
        "data-pressed",
        "",
      );
    }
  },
);


test(
  "Block 7: disabled native Button cannot activate",
  async ({
    page,
  }) => {
    const target =
      page.getByTestId(
        "block7-disabled-button",
      );

    await expect(
      target,
    ).toBeDisabled();

    await expect(
      target,
    ).toHaveAttribute(
      "data-disabled",
      "",
    );

    await target.click({
      force:
        true,
    });

    await dispatchPointer(
      target,
      "pointerdown",
    );

    await expect(
      target,
    ).not.toHaveAttribute(
      "data-pressed",
      "",
    );

    const snapshot =
      await page.evaluate(
        () =>
          window
            .block7Harness
            .snapshot(),
      );

    expect(
      snapshot
        .disabledPresses,
    ).toBe(
      0,
    );
  },
);


test(
  "Block 7: keyboard navigation exposes focus-visible and blur clears it",
  async ({
    page,
  }) => {
    await page
      .getByTestId(
        "block7-focus-start",
      )
      .click();

    await page.keyboard.press(
      "Tab",
    );

    const target =
      page.getByTestId(
        "block7-keyboard-focus",
      );

    await expect(
      target,
    ).toBeFocused();

    await expect(
      target,
    ).toHaveAttribute(
      "data-focused",
      "",
    );

    await expect(
      target,
    ).toHaveAttribute(
      "data-focus-visible",
      "",
    );

    await page
      .getByTestId(
        "block7-focus-start",
      )
      .focus();

    await expect(
      target,
    ).not.toHaveAttribute(
      "data-focused",
      "",
    );

    await expect(
      target,
    ).not.toHaveAttribute(
      "data-focus-visible",
      "",
    );
  },
);


test(
  "Block 7: pointer-originated focus does not expose focus-visible",
  async ({
    page,
  }) => {
    const target =
      page.getByTestId(
        "block7-pointer-focus",
      );

    await target.click();

    await expect(
      target,
    ).toBeFocused();

    await expect(
      target,
    ).toHaveAttribute(
      "data-focused",
      "",
    );

    await expect(
      target,
    ).not.toHaveAttribute(
      "data-focus-visible",
      "",
    );
  },
);


test(
  "Block 7: focus-visible preserves a custom box shadow",
  async ({
    page,
  }) => {
    const target =
      page.getByTestId(
        "block7-custom-shadow",
      );

    const before =
      await computed(
        target,
        "box-shadow",
      );

    await page
      .getByTestId(
        "block7-shadow-start",
      )
      .click();

    await page.keyboard.press(
      "Tab",
    );

    await expect(
      target,
    ).toBeFocused();

    await expect(
      target,
    ).toHaveAttribute(
      "data-focus-visible",
      "",
    );

    const after =
      await computed(
        target,
        "box-shadow",
      );

    expect(
      before.trim(),
    ).not.toBe(
      "none",
    );

    expect(
      after,
    ).toBe(
      before,
    );

    expect(
      (
        await computed(
          target,
          "outline-style",
        )
      ).trim(),
    ).not.toBe(
      "none",
    );
  },
);


test(
  "Block 7: Button, IconButton and Pressable share generic state attributes",
  async ({
    page,
  }) => {
    const contracts = [
      {
        testId:
          "block7-generic-button",

        identity:
          "button",
      },
      {
        testId:
          "block7-generic-icon",

        identity:
          "icon-button",
      },
      {
        testId:
          "block7-generic-pressable",

        identity:
          "pressable",
      },
    ];

    for (
      const contract of
      contracts
    ) {
      const target =
        page.getByTestId(
          contract.testId,
        );

      await expect(
        target,
      ).toHaveAttribute(
        "data-ui",
        contract.identity,
      );

      await dispatchPointer(
        target,
        "pointerover",
      );

      await dispatchPointer(
        target,
        "pointerdown",
      );

      await expect(
        target,
      ).toHaveAttribute(
        "data-hovered",
        "",
      );

      await expect(
        target,
      ).toHaveAttribute(
        "data-pressed",
        "",
      );

      await expect(
        target,
      ).toHaveAttribute(
        "data-pointer-type",
        "mouse",
      );

      for (
        const legacy of [
          "data-ui-button",
          "data-ui-icon-button",
          "data-ui-pressable",
        ]
      ) {
        await expect(
          target,
        ).not.toHaveAttribute(
          legacy,
          "",
        );
      }

      await dispatchPointer(
        target,
        "pointerup",
      );
    }
  },
);


test(
  "Block 7: loading Button has complete semantics and restores activation",
  async ({
    page,
  }) => {
    const target =
      page.getByTestId(
        "block7-loading-button",
      );

    await expect(
      target,
    ).toHaveAttribute(
      "data-loading",
      "",
    );

    await expect(
      target,
    ).toHaveAttribute(
      "aria-busy",
      "true",
    );

    await expect(
      target,
    ).toBeDisabled();

    await expect(
      target.locator(
        '[data-ui="button-spinner"]',
      ),
    ).toHaveCount(
      1,
    );

    await expect(
      target,
    ).toContainText(
      "Working",
    );

    await target.click({
      force:
        true,
    });

    expect(
      (
        await page.evaluate(
          () =>
            window
              .block7Harness
              .snapshot(),
        )
      ).loadingPresses,
    ).toBe(
      0,
    );

    await page.evaluate(
      () => {
        window
          .block7Harness
          .setLoading(
            false,
          );
      },
    );

    await expect(
      target,
    ).not.toHaveAttribute(
      "data-loading",
      "",
    );

    await expect(
      target,
    ).not.toHaveAttribute(
      "aria-busy",
      "true",
    );

    await expect(
      target,
    ).toBeEnabled();

    await expect(
      target,
    ).toContainText(
      "Ready",
    );

    await target.click();

    expect(
      (
        await page.evaluate(
          () =>
            window
              .block7Harness
              .snapshot(),
        )
      ).loadingPresses,
    ).toBe(
      1,
    );
  },
);


test(
  "Block 7: all Button variant and scheme combinations meet 4.5:1 effective contrast",
  async ({
    page,
  }) => {
    for (
      const variant of [
        "solid",
        "outline",
        "ghost",
      ] as const
    ) {
      for (
        const scheme of [
          "primary",
          "secondary",
          "danger",
        ] as const
      ) {
        const target =
          page.getByTestId(
            `block7-contrast-${variant}-${scheme}`,
          );

        const ratio =
          await effectiveContrast(
            target,
          );

        expect(
          ratio,
          `${variant}/${scheme} contrast ratio`,
        ).toBeGreaterThanOrEqual(
          CONTRAST_THRESHOLD,
        );
      }
    }
  },
);


test(
  "Block 7: Button and IconButton share coherent sm, md and lg metrics",
  async ({
    page,
  }) => {
    const heights:
      number[] = [];

    for (
      const size of [
        "sm",
        "md",
        "lg",
      ] as const
    ) {
      const button =
        page.getByTestId(
          `block7-size-button-${size}`,
        );

      const icon =
        page.getByTestId(
          `block7-size-icon-${size}`,
        );

      const buttonBox =
        await button.boundingBox();

      const iconBox =
        await icon.boundingBox();

      if (
        !buttonBox ||
        !iconBox
      ) {
        throw new Error(
          `Missing ${size} geometry.`,
        );
      }

      await expect(
        button,
      ).toHaveAttribute(
        "data-size",
        size,
      );

      await expect(
        icon,
      ).toHaveAttribute(
        "data-size",
        size,
      );

      expect(
        Math.abs(
          buttonBox.height -
          iconBox.height,
        ),
      ).toBeLessThanOrEqual(
        1,
      );

      expect(
        Math.abs(
          iconBox.width -
          iconBox.height,
        ),
      ).toBeLessThanOrEqual(
        1,
      );

      expect(
        buttonBox.width,
      ).toBeGreaterThanOrEqual(
        buttonBox.height,
      );

      heights.push(
        buttonBox.height,
      );
    }

    expect(
      heights[0],
    ).toBeLessThan(
      heights[1],
    );

    expect(
      heights[1],
    ).toBeLessThan(
      heights[2],
    );
  },
);


test(
  "Block 7: List.Item responds through generic hover, focus-visible and pressed attributes",
  async ({
    page,
  }) => {
    const item =
      page.getByTestId(
        "block7-list-item",
      );

    const initialBackground =
      await computed(
        item,
        "background-color",
      );

    await item.hover();

    await expect(
      item,
    ).toHaveAttribute(
      "data-hovered",
      "",
    );

    const hoverBackground =
      await computed(
        item,
        "background-color",
      );

    expect(
      hoverBackground,
    ).not.toBe(
      initialBackground,
    );

    await page
      .getByTestId(
        "block7-list-focus-start",
      )
      .click();

    await page.keyboard.press(
      "Tab",
    );

    await expect(
      item,
    ).toBeFocused();

    await expect(
      item,
    ).toHaveAttribute(
      "data-focus-visible",
      "",
    );

    const center =
      await mouseCenter(
        item,
      );

    await page.mouse.move(
      center.x,
      center.y,
    );

    await page.mouse.down();

    await expect(
      item,
    ).toHaveAttribute(
      "data-pressed",
      "",
    );

    const pressedBackground =
      await computed(
        item,
        "background-color",
      );

    expect(
      pressedBackground,
    ).not.toBe(
      hoverBackground,
    );

    await page.mouse.up();
  },
);


test(
  "Block 7: FloatingActionButton preserves its base shadow on focus-visible",
  async ({
    page,
  }) => {
    const fab =
      page.getByTestId(
        "block7-fab",
      );

    const before =
      await computed(
        fab,
        "box-shadow",
      );

    expect(
      before.trim(),
    ).not.toBe(
      "none",
    );

    await page
      .getByTestId(
        "block7-fab-focus-start",
      )
      .click();

    await page.keyboard.press(
      "Tab",
    );

    await expect(
      fab,
    ).toBeFocused();

    await expect(
      fab,
    ).toHaveAttribute(
      "data-focus-visible",
      "",
    );

    const after =
      await computed(
        fab,
        "box-shadow",
      );

    expect(
      after,
    ).toBe(
      before,
    );
  },
);
