import { describe, expect, it } from "vitest";

import {
  createThemeDefinition,
  ThemeSystem,
} from "../../src/theme";

describe("Theme value protection", () => {
  it("clones external values and isolates resolved themes", () => {
    const externalMetadata = {
      label: "Original",
      colorScheme: "light" as const,
    };

    const externalExtension = {
      density: "compact",
    };

    const externalTokens = {
      color: {
        primary: "#123456",
      },

      extensions: {
        application: externalExtension,
      },
    };

    const definition = createThemeDefinition({
      name: "independent",
      source: "custom",
      metadata: externalMetadata,
      tokens: externalTokens,
    });

    externalMetadata.label = "Mutated";
    externalTokens.color.primary = "#ffffff";
    externalExtension.density = "comfortable";

    expect(
      definition.metadata?.label,
    ).toBe("Original");

    expect(
      definition.tokens?.color?.primary,
    ).toBe("#123456");

    expect(
      definition.tokens?.extensions?.application,
    ).not.toBe(externalExtension);

    const prototypeValue = Object.defineProperty(
      {},
      "__proto__",
      {
        value: {
          safe: true,
        },

        enumerable: true,
        writable: true,
        configurable: true,
      },
    );

    const prototypeDefinition =
      createThemeDefinition({
        name:
          "prototype-key",

        source:
          "custom",

        metadata: {
          colorScheme:
            "light",
        },

        tokens: {
          extensions: {
            application:
              prototypeValue,
          },
        },
      });

    const clonedApplication =
      prototypeDefinition.tokens?.extensions?.application;

    expect(clonedApplication).not.toBeNull();
    expect(typeof clonedApplication).toBe("object");
    expect(Array.isArray(clonedApplication)).toBe(false);

    expect(
      Object.prototype.hasOwnProperty.call(
        clonedApplication,
        "__proto__",
      ),
    ).toBe(true);

    expect(
      Object.getPrototypeOf(clonedApplication),
    ).toBe(Object.prototype);

    expect(
      Object.prototype.hasOwnProperty.call(
        Object.prototype,
        "safe",
      ),
    ).toBe(false);

    const system = new ThemeSystem({
      persist: false,
      themes: [definition],
    });

    const firstResolved = system.resolveTheme("independent");
    const secondResolved = system.resolveTheme("independent");

    expect(firstResolved).not.toBe(secondResolved);
    expect(firstResolved.metadata).not.toBe(secondResolved.metadata);
    expect(firstResolved.tokens).not.toBe(secondResolved.tokens);
    expect(firstResolved.tokens.extensions).not.toBe(
      secondResolved.tokens.extensions,
    );

    firstResolved.metadata!.label = "Changed";
    firstResolved.tokens.color!.primary = "#000000";

    expect(
      secondResolved.metadata?.label,
    ).toBe("Original");

    expect(
      secondResolved.tokens.color?.primary,
    ).toBe("#123456");
  });
});