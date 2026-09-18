import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ThemeSystem,
} from "../../src/theme";


function expectErrorMessage(
  action: () => void,
  expectedMessage: string,
): void {
  let thrown:
    unknown;


  try {
    action();
  } catch (error) {
    thrown =
      error;
  }


  expect(
    thrown,
  ).toBeInstanceOf(
    Error,
  );


  expect(
    (
      thrown as Error
    ).message,
  ).toBe(
    expectedMessage,
  );
}


describe(
  "ThemeSystem constructor",
  () => {
    it(
      "accepts a child before its parent in the initial batch",
      () => {
        const child = {
          name:
            "child-first",

          source:
            "custom" as const,

          extends:
            "parent-second",

          tokens: {
            color: {
              primary:
                "#222222",
            },
          },
        };


        const parent = {
          name:
            "parent-second",

          source:
            "custom" as const,

          metadata: {
            colorScheme:
              "light" as const,
          },

          tokens: {
            color: {
              secondary:
                "#111111",
            },
          },
        };


        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              child,
              parent,
            ],
          });


        const resolved =
          system.resolveTheme(
            "child-first",
          );


        expect(
          resolved.metadata.colorScheme,
        ).toBe(
          "light",
        );


        expect(
          resolved.tokens.color?.primary,
        ).toBe(
          "#222222",
        );


        expect(
          resolved.tokens.color?.secondary,
        ).toBe(
          "#111111",
        );
      },
    );


    it(
      "resolves a chain of four levels supplied in reverse order",
      () => {
        const levelFour = {
          name:
            "level-four",

          source:
            "custom" as const,

          extends:
            "level-three",

          tokens: {
            border: {
              border:
                "#level-four-border",
            },
          },
        };


        const levelThree = {
          name:
            "level-three",

          source:
            "custom" as const,

          extends:
            "level-two",

          tokens: {
            text: {
              text:
                "#level-three-text",
            },
          },
        };


        const levelTwo = {
          name:
            "level-two",

          source:
            "custom" as const,

          extends:
            "level-one",

          tokens: {
            surface: {
              surface:
                "#level-two-surface",
            },
          },
        };


        const levelOne = {
          name:
            "level-one",

          source:
            "custom" as const,

          metadata: {
            colorScheme:
              "dark" as const,
          },

          tokens: {
            color: {
              primary:
                "#level-one-primary",
            },
          },
        };


        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              levelFour,
              levelThree,
              levelTwo,
              levelOne,
            ],
          });


        const resolved =
          system.resolveTheme(
            "level-four",
          );


        expect(
          resolved.metadata.colorScheme,
        ).toBe(
          "dark",
        );


        expect(
          resolved.tokens.color?.primary,
        ).toBe(
          "#level-one-primary",
        );


        expect(
          resolved.tokens.surface?.surface,
        ).toBe(
          "#level-two-surface",
        );


        expect(
          resolved.tokens.text?.text,
        ).toBe(
          "#level-three-text",
        );


        expect(
          resolved.tokens.border?.border,
        ).toBe(
          "#level-four-border",
        );
      },
    );


    it(
      "rejects an unknown parent after loading the complete initial batch",
      () => {
        expectErrorMessage(
          () => {
            new ThemeSystem({
              persist:
                false,

              themes: [
                {
                  name:
                    "orphan",

                  source:
                    "custom",

                  extends:
                    "missing-parent",
                },

                {
                  name:
                    "valid-root",

                  source:
                    "custom",

                  metadata: {
                    colorScheme:
                      "light",
                  },
                },
              ],
            });
          },

          'Theme "orphan" extends unknown theme "missing-parent"',
        );
      },
    );


    it(
      "rejects circular inheritance in the initial batch",
      () => {
        expectErrorMessage(
          () => {
            new ThemeSystem({
              persist:
                false,

              themes: [
                {
                  name:
                    "cycle-a",

                  source:
                    "custom",

                  extends:
                    "cycle-b",
                },

                {
                  name:
                    "cycle-b",

                  source:
                    "custom",

                  extends:
                    "cycle-a",
                },
              ],
            });
          },

          'Circular theme inheritance detected: "cycle-a"',
        );
      },
    );


    it(
      "rejects an unknown explicit initialTheme",
      () => {
        expectErrorMessage(
          () => {
            new ThemeSystem({
              persist:
                false,

              initialTheme:
                "missing-theme",

              themes: [
                {
                  name:
                    "available-theme",

                  source:
                    "custom",

                  metadata: {
                    colorScheme:
                      "light",
                  },
                },
              ],
            });
          },

          'Initial theme "missing-theme" is not registered',
        );
      },
    );


    it(
      "selects a valid explicit initialTheme",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            initialTheme:
              "second-theme",

            themes: [
              {
                name:
                  "first-theme",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "light",
                },
              },

              {
                name:
                  "second-theme",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "dark",
                },
              },
            ],
          });


        expect(
          system
            .getActiveTheme()
            .name,
        ).toBe(
          "second-theme",
        );


        expect(
          system
            .resolveTheme(
              "second-theme",
            )
            .metadata
            .colorScheme,
        ).toBe(
          "dark",
        );
      },
    );


    it(
      'treats initialTheme: "" as an explicit invalid value',
      () => {
        expectErrorMessage(
          () => {
            new ThemeSystem({
              persist:
                false,

              initialTheme:
                "",

              themes: [
                {
                  name:
                    "available-theme",

                  source:
                    "custom",

                  metadata: {
                    colorScheme:
                      "light",
                  },
                },
              ],
            });
          },

          'Initial theme "" is not registered',
        );
      },
    );
  },
);


describe(
  "Theme registration",
  () => {
    it(
      "keeps public registration strict when the parent is not registered",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              {
                name:
                  "registered-root",

                source:
                  "custom",

                metadata: {
                  colorScheme:
                    "light",
                },
              },
            ],
          });


        expectErrorMessage(
          () => {
            system.registerTheme({
              name:
                "late-child",

              source:
                "custom",

              extends:
                "late-parent",
            });
          },

          'Theme "late-child" extends unknown theme "late-parent"',
        );


        expect(
          system
            .getThemes()
            .map(
              (
                theme,
              ) =>
                theme.name,
            ),
        ).toEqual([
          "registered-root",
        ]);
      },
    );


    it(
      "rejects duplicates, allows explicit replacement and rolls back invalid replacements",
      () => {
        const original = {
          name:
            "replaceable",

          source:
            "custom" as const,

          metadata: {
            label:
              "Original",

            colorScheme:
              "light" as const,
          },

          tokens: {
            color: {
              primary:
                "#111111",
            },
          },
        };


        const child = {
          name:
            "child",

          source:
            "custom" as const,

          extends:
            "replaceable",
        };


        const replacement = {
          name:
            "replaceable",

          source:
            "custom" as const,

          metadata: {
            label:
              "Replacement",

            colorScheme:
              "dark" as const,
          },

          tokens: {
            color: {
              primary:
                "#222222",
            },
          },
        };


        const system =
          new ThemeSystem({
            persist:
              false,

            themes: [
              original,
              child,
            ],
          });


        expectErrorMessage(
          () => {
            system.registerTheme(
              replacement,
            );
          },

          'Theme "replaceable" is already registered. Pass { replace: true } to replace it.',
        );


        expect(
          system
            .getActiveTheme()
            .metadata
            ?.label,
        ).toBe(
          "Original",
        );


        expect(
          system
            .resolveTheme(
              "replaceable",
            )
            .tokens
            .color
            ?.primary,
        ).toBe(
          "#111111",
        );


        system.registerTheme(
          replacement,
          {
            replace:
              true,
          },
        );


        expect(
          system
            .getActiveTheme()
            .metadata
            ?.label,
        ).toBe(
          "Replacement",
        );


        expect(
          system
            .resolveTheme(
              "replaceable",
            )
            .tokens
            .color
            ?.primary,
        ).toBe(
          "#222222",
        );


        expect(
          system
            .resolveTheme(
              "child",
            )
            .metadata
            .colorScheme,
        ).toBe(
          "dark",
        );


        const cyclicReplacement = {
          name:
            "replaceable",

          source:
            "custom" as const,

          extends:
            "child",

          metadata: {
            label:
              "Cyclic replacement",
          },
        };


        expectErrorMessage(
          () => {
            system.registerTheme(
              cyclicReplacement,
              {
                replace:
                  true,
              },
            );
          },

          'Circular theme inheritance detected: "replaceable"',
        );


        expect(
          system
            .getActiveTheme()
            .metadata
            ?.label,
        ).toBe(
          "Replacement",
        );


        expect(
          system
            .resolveTheme(
              "replaceable",
            )
            .tokens
            .color
            ?.primary,
        ).toBe(
          "#222222",
        );


        expect(
          system
            .resolveTheme(
              "replaceable",
            )
            .metadata
            .colorScheme,
        ).toBe(
          "dark",
        );


        expect(
          system
            .resolveTheme(
              "child",
            )
            .tokens
            .color
            ?.primary,
        ).toBe(
          "#222222",
        );


        expect(
          system
            .resolveTheme(
              "child",
            )
            .metadata
            .colorScheme,
        ).toBe(
          "dark",
        );


        expectErrorMessage(
          () => {
            new ThemeSystem({
              persist:
                false,

              themes: [
                original,
                replacement,
              ],
            });
          },

          'Theme "replaceable" is already registered. Pass { replace: true } to replace it.',
        );
      },
    );
  },
);