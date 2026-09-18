import {
  expect,
  test,
} from "@playwright/test";


test(
  "styles.css does not change application shell styles",
  async ({
    page,
  }) => {
    await page.goto(
      "/browser-styles-only.html",
      {
        waitUntil:
          "networkidle",
      },
    );


    const bodyStyles =
      await page.evaluate(() => {
        const styles =
          getComputedStyle(
            document.body,
          );


        return {
          marginTop:
            styles.marginTop,

          marginRight:
            styles.marginRight,

          marginBottom:
            styles.marginBottom,

          marginLeft:
            styles.marginLeft,

          fontFamily:
            styles.fontFamily,

          overflowX:
            styles.overflowX,
        };
      });


    expect(
      bodyStyles,
    ).toEqual({
      marginTop:
        "13px",

      marginRight:
        "13px",

      marginBottom:
        "13px",

      marginLeft:
        "13px",

      fontFamily:
        "serif",

      overflowX:
        "scroll",
    });
  },
);


test(
  "reset.css applies the global reset",
  async ({
    page,
  }) => {
    await page.goto(
      "/browser-reset.html",
      {
        waitUntil:
          "networkidle",
      },
    );


    const resetState =
      await page.evaluate(() => {
        const bodyStyles =
          getComputedStyle(
            document.body,
          );


        const rootStyles =
          getComputedStyle(
            document.documentElement,
          );


        return {
          bodyMarginTop:
            bodyStyles.marginTop,

          bodyMarginRight:
            bodyStyles.marginRight,

          bodyMarginBottom:
            bodyStyles.marginBottom,

          bodyMarginLeft:
            bodyStyles.marginLeft,

          rootBoxSizing:
            rootStyles.boxSizing,
        };
      });


    expect(
      resetState,
    ).toEqual({
      bodyMarginTop:
        "0px",

      bodyMarginRight:
        "0px",

      bodyMarginBottom:
        "0px",

      bodyMarginLeft:
        "0px",

      rootBoxSizing:
        "border-box",
    });
  },
);