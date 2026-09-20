import {
  expect,
  test,
  type Page,
} from "@playwright/test";


type RootProjection = {
  motionEffective:
    string | null;

  density:
    string | null;

  durationFast:
    string;

  durationFastSource:
    string;

  durationNoneSource:
    string;

  distanceLg:
    string;

  distanceNoneSource:
    string;

  scaleExpressive:
    string;

  scaleStaticSource:
    string;

  densityControlHeight:
    string;

  comfortableControlHeight:
    string;

  spaciousControlHeight:
    string;
};


async function readRootProjection(
  page:
    Page,
): Promise<RootProjection> {
  return page.evaluate(
    () => {
      const root =
        document.documentElement;

      const style =
        getComputedStyle(
          root,
        );

      const read = (
        property:
          string,
      ) =>
        style
          .getPropertyValue(
            property,
          )
          .trim();


      return {
        motionEffective:
          root.getAttribute(
            "data-ui-motion-effective",
          ),

        density:
          root.getAttribute(
            "data-ui-density",
          ),

        durationFast:
          read(
            "--ui-duration-fast",
          ),

        durationFastSource:
          read(
            "--ui-motion-token-duration-fast",
          ),

        durationNoneSource:
          read(
            "--ui-motion-token-duration-none",
          ),

        distanceLg:
          read(
            "--ui-motion-distance-lg",
          ),

        distanceNoneSource:
          read(
            "--ui-motion-token-distance-none",
          ),

        scaleExpressive:
          read(
            "--ui-motion-scale-expressive",
          ),

        scaleStaticSource:
          read(
            "--ui-motion-token-scale-static",
          ),

        densityControlHeight:
          read(
            "--ui-density-control-height",
          ),

        comfortableControlHeight:
          read(
            "--ui-density-comfortable-control-height",
          ),

        spaciousControlHeight:
          read(
            "--ui-density-spacious-control-height",
          ),
      };
    },
  );
}


async function readDensityTargetHeights(
  page:
    Page,
) {
  return page.evaluate(
    () => {
      const readHeight = (
        testId:
          string,
      ) => {
        const element =
          document.querySelector(
            `[data-testid="${testId}"]`,
          );

        if (!(element instanceof HTMLElement)) {
          throw new Error(
            `Missing ${testId}`,
          );
        }

        return element
          .getBoundingClientRect()
          .height;
      };


      return {
        button:
          readHeight(
            "density-button",
          ),

        input:
          readHeight(
            "density-input",
          ),

        listItem:
          readHeight(
            "density-list-item",
          ),
      };
    },
  );
}


test(
  "projects motion and density through the existing document owners",
  async ({
    page,
  }) => {
    await page.goto(
      "/browser-environment.html",
    );


    const initial =
      await readRootProjection(
        page,
      );

    const initialHeights =
      await readDensityTargetHeights(
        page,
      );


    expect(
      initial.motionEffective,
    ).toBe(
      "subtle",
    );

    expect(
      initial.durationFast,
    ).toBe(
      initial.durationFastSource,
    );

    expect(
      initial.durationFastSource,
    ).toBe(
      "120ms",
    );

    expect(
      initial.density,
    ).toBe(
      "comfortable",
    );

    expect(
      initial.densityControlHeight,
    ).toBe(
      initial.comfortableControlHeight,
    );


    await page
      .getByTestId(
        "motion-none",
      )
      .click();


    const withoutMotion =
      await readRootProjection(
        page,
      );


    expect(
      withoutMotion.motionEffective,
    ).toBe(
      "none",
    );

    expect(
      withoutMotion.durationFast,
    ).toBe(
      withoutMotion.durationNoneSource,
    );

    expect(
      withoutMotion.durationFast,
    ).toBe(
      "0ms",
    );

    expect(
      withoutMotion.distanceLg,
    ).toBe(
      withoutMotion.distanceNoneSource,
    );

    expect(
      withoutMotion.scaleExpressive,
    ).toBe(
      withoutMotion.scaleStaticSource,
    );


    await page
      .getByTestId(
        "density-spacious",
      )
      .click();


    const spacious =
      await readRootProjection(
        page,
      );


    expect(
      spacious.density,
    ).toBe(
      "spacious",
    );

    expect(
      spacious.densityControlHeight,
    ).toBe(
      spacious.spaciousControlHeight,
    );

    expect(
      spacious.spaciousControlHeight,
    ).not.toBe(
      spacious.comfortableControlHeight,
    );


    const spaciousHeights =
      await readDensityTargetHeights(
        page,
      );


    expect(
      spaciousHeights.button,
    ).toBeGreaterThan(
      initialHeights.button,
    );

    expect(
      spaciousHeights.input,
    ).toBeGreaterThan(
      initialHeights.input,
    );

    expect(
      spaciousHeights.listItem,
    ).toBeGreaterThan(
      initialHeights.listItem,
    );
  },
);
