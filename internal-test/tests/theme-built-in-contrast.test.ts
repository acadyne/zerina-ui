import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BUILT_IN_THEMES,
} from "../../src/theme/built-in";

import {
  ThemeSystem,
} from "../../src/theme/runtime/theme-system";


const CONTRAST_PAIRS = [
  {
    background:
      "primary",

    foreground:
      "primaryContrast",

    label:
      "primary/primaryContrast",
  },

  {
    background:
      "secondary",

    foreground:
      "secondaryContrast",

    label:
      "secondary/secondaryContrast",
  },

  {
    background:
      "info",

    foreground:
      "infoContrast",

    label:
      "info/infoContrast",
  },

  {
    background:
      "success",

    foreground:
      "successContrast",

    label:
      "success/successContrast",
  },

  {
    background:
      "warning",

    foreground:
      "warningContrast",

    label:
      "warning/warningContrast",
  },

  {
    background:
      "danger",

    foreground:
      "dangerContrast",

    label:
      "danger/dangerContrast",
  },
  {
    background:
      "primaryContainer",

    foreground:
      "onPrimaryContainer",

    label:
      "primaryContainer/onPrimaryContainer",
  },

  {
    background:
      "secondaryContainer",

    foreground:
      "onSecondaryContainer",

    label:
      "secondaryContainer/onSecondaryContainer",
  },

  {
    background:
      "neutralContainer",

    foreground:
      "onNeutralContainer",

    label:
      "neutralContainer/onNeutralContainer",
  },

  {
    background:
      "infoContainer",

    foreground:
      "onInfoContainer",

    label:
      "infoContainer/onInfoContainer",
  },

  {
    background:
      "successContainer",

    foreground:
      "onSuccessContainer",

    label:
      "successContainer/onSuccessContainer",
  },

  {
    background:
      "warningContainer",

    foreground:
      "onWarningContainer",

    label:
      "warningContainer/onWarningContainer",
  },

  {
    background:
      "dangerContainer",

    foreground:
      "onDangerContainer",

    label:
      "dangerContainer/onDangerContainer",
  },
] as const;


type RGB = readonly [
  number,
  number,
  number,
];


interface ContrastMeasurement {
  theme:
    string;

  pair:
    string;

  ratio:
    number;

  background:
    string;

  foreground:
    string;
}


function parseHexChannel(
  value:
    string,
): number {
  return Number.parseInt(
    value,
    16,
  ) / 255;
}


function parseHexColor(
  value:
    string,
  context:
    string,
): RGB {
  const normalized =
    value.trim();


  const shortMatch =
    /^#([0-9a-f]{3})$/i.exec(
      normalized,
    );


  if (
    shortMatch?.[
      1
    ]
  ) {
    const [
      red,
      green,
      blue,
    ] =
      shortMatch[
        1
      ].split(
        "",
      );


    if (
      red ===
        undefined ||
      green ===
        undefined ||
      blue ===
        undefined
    ) {
      throw new Error(
        `Could not parse color "${value}" for ${context}.`,
      );
    }


    return [
      parseHexChannel(
        `${red}${red}`,
      ),

      parseHexChannel(
        `${green}${green}`,
      ),

      parseHexChannel(
        `${blue}${blue}`,
      ),
    ];
  }


  const fullMatch =
    /^#([0-9a-f]{6})$/i.exec(
      normalized,
    );


  if (
    !fullMatch?.[
      1
    ]
  ) {
    throw new Error(
      `Expected a three- or six-digit hex color for ${context}, received "${value}".`,
    );
  }


  const hex =
    fullMatch[
      1
    ];


  return [
    parseHexChannel(
      hex.slice(
        0,
        2,
      ),
    ),

    parseHexChannel(
      hex.slice(
        2,
        4,
      ),
    ),

    parseHexChannel(
      hex.slice(
        4,
        6,
      ),
    ),
  ];
}


function linearizeSRGBChannel(
  channel:
    number,
): number {
  if (
    channel <=
    0.04045
  ) {
    return channel /
      12.92;
  }


  return Math.pow(
    (
      channel +
      0.055
    ) /
      1.055,
    2.4,
  );
}


function relativeLuminance(
  value:
    string,
  context:
    string,
): number {
  const [
    red,
    green,
    blue,
  ] =
    parseHexColor(
      value,
      context,
    );


  return (
    0.2126 *
      linearizeSRGBChannel(
        red,
      ) +
    0.7152 *
      linearizeSRGBChannel(
        green,
      ) +
    0.0722 *
      linearizeSRGBChannel(
        blue,
      )
  );
}


function contrastRatio(
  first:
    string,
  second:
    string,
  context:
    string,
): number {
  const firstLuminance =
    relativeLuminance(
      first,
      context,
    );


  const secondLuminance =
    relativeLuminance(
      second,
      context,
    );


  const lighter =
    Math.max(
      firstLuminance,
      secondLuminance,
    );


  const darker =
    Math.min(
      firstLuminance,
      secondLuminance,
    );


  return (
    lighter +
    0.05
  ) / (
    darker +
    0.05
  );
}


describe(
  "WCAG built-in color contrast",
  () => {
    it(
      "uses relative sRGB luminance",
      () => {
        expect(
          contrastRatio(
            "#000000",
            "#ffffff",
            "black/white",
          ),
        ).toBeCloseTo(
          21,
          10,
        );


        expect(
          contrastRatio(
            "#777777",
            "#777777",
            "identical colors",
          ),
        ).toBeCloseTo(
          1,
          10,
        );
      },
    );


    it(
      "provides at least 4.5:1 for every built-in contrast pair",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes:
              BUILT_IN_THEMES,
          });


        const measurements:
          ContrastMeasurement[] = [];


        for (
          const theme of
          BUILT_IN_THEMES
        ) {
          const colors =
            system.resolveTheme(
              theme.name,
            ).tokens.color;


          for (
            const pair of
            CONTRAST_PAIRS
          ) {
            const background =
              colors[
                pair.background
              ];


            const foreground =
              colors[
                pair.foreground
              ];


            const ratio =
              contrastRatio(
                background,
                foreground,
                `theme="${theme.name}" pair="${pair.label}"`,
              );


            const measurement:
              ContrastMeasurement = {
              theme:
                theme.name,

              pair:
                pair.label,

              ratio,

              background,

              foreground,
            };


            measurements.push(
              measurement,
            );


            expect(
              ratio,
              [
                `theme="${theme.name}"`,
                `pair="${pair.label}"`,
                `background="${background}"`,
                `foreground="${foreground}"`,
                `ratio=${ratio.toFixed(
                  4,
                )}`,
              ].join(
                " ",
              ),
            ).toBeGreaterThanOrEqual(
              4.5,
            );
          }
        }


        const minimum =
          measurements.reduce(
            (
              current,
              measurement,
            ) =>
              measurement.ratio <
              current.ratio
                ? measurement
                : current,
          );


        const minimaByPair =
          CONTRAST_PAIRS.map(
            (
              pair,
            ) => {
              const pairMeasurements =
                measurements.filter(
                  (
                    measurement,
                  ) =>
                    measurement.pair ===
                    pair.label,
                );


              return pairMeasurements.reduce(
                (
                  current,
                  measurement,
                ) =>
                  measurement.ratio <
                  current.ratio
                    ? measurement
                    : current,
              );
            },
          );


        console.info(
          [
            "[theme-contrast]",

            `global=${minimum.ratio.toFixed(
              4,
            )}`,

            `theme=${minimum.theme}`,

            `pair=${minimum.pair}`,

            ...minimaByPair.map(
              (
                measurement,
              ) =>
                `${measurement.pair}=${measurement.ratio.toFixed(
                  4,
                )}@${measurement.theme}`,
            ),
          ].join(
            " ",
          ),
        );
      },
    );
  },
);