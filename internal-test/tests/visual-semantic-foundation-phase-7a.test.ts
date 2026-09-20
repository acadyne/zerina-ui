// @vitest-environment node

import {
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";

import {
  UI_ELEVATIONS,
  UI_SHAPES,
  UI_SURFACE_ROLES,
  UI_TONES,
  UI_TYPOGRAPHY_ROLES,
} from "../../src/theme/contracts/visual-semantics";

import type {
  UIElevation,
  UIShape,
  UISurfaceRole,
  UITone,
  UITypographyRole,
} from "../../src/theme/contracts/visual-semantics";

import {
  THEME_TOKEN_MANIFEST,
} from "../../src/theme/contracts/theme-token-contract";

import {
  SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME,
} from "../../src/theme/runtime/system-default-tokens";

import {
  BUILT_IN_THEMES,
} from "../../src/theme/built-in";

import {
  ThemeSystem,
} from "../../src/theme/runtime/theme-system";


describe(
  "Phase 7A semantic visual foundation",
  () => {
    it(
      "defines one canonical semantic vocabulary",
      () => {
        expect(
          UI_TONES,
        ).toEqual([
          "neutral",
          "primary",
          "secondary",
          "info",
          "success",
          "warning",
          "danger",
        ]);

        expect(
          UI_SURFACE_ROLES,
        ).toEqual([
          "canvas",
          "surface",
          "containerLow",
          "container",
          "containerHigh",
        ]);

        expect(
          UI_ELEVATIONS,
        ).toEqual([
          0,
          1,
          2,
          3,
          4,
          5,
        ]);

        expect(
          UI_TYPOGRAPHY_ROLES,
        ).toEqual([
          "display",
          "headline",
          "title",
          "body",
          "label",
          "caption",
        ]);

        expect(
          UI_SHAPES,
        ).toEqual([
          "sm",
          "md",
          "lg",
          "xl",
          "full",
        ]);

        expectTypeOf<
          UITone
        >().toEqualTypeOf<
          (typeof UI_TONES)[number]
        >();

        expectTypeOf<
          UISurfaceRole
        >().toEqualTypeOf<
          (typeof UI_SURFACE_ROLES)[number]
        >();

        expectTypeOf<
          UIElevation
        >().toEqualTypeOf<
          (typeof UI_ELEVATIONS)[number]
        >();

        expectTypeOf<
          UITypographyRole
        >().toEqualTypeOf<
          (typeof UI_TYPOGRAPHY_ROLES)[number]
        >();

        expectTypeOf<
          UIShape
        >().toEqualTypeOf<
          (typeof UI_SHAPES)[number]
        >();
      },
    );

    it(
      "declares semantic container roles and info tone in the theme manifest",
      () => {
        expect(
          THEME_TOKEN_MANIFEST
            .color
            .primaryContainer
            .cssVariable,
        ).toBe(
          "--ui-primary-container",
        );

        expect(
          THEME_TOKEN_MANIFEST
            .color
            .onPrimaryContainer
            .cssVariable,
        ).toBe(
          "--ui-on-primary-container",
        );

        expect(
          THEME_TOKEN_MANIFEST
            .color
            .neutralContainer
            .cssVariable,
        ).toBe(
          "--ui-neutral-container",
        );

        expect(
          THEME_TOKEN_MANIFEST
            .color
            .info
            .cssVariable,
        ).toBe(
          "--ui-info",
        );

        expect(
          THEME_TOKEN_MANIFEST
            .color
            .infoContainer
            .cssVariable,
        ).toBe(
          "--ui-info-container",
        );

        expect(
          THEME_TOKEN_MANIFEST
            .color
            .onInfoContainer
            .cssVariable,
        ).toBe(
          "--ui-on-info-container",
        );
      },
    );

    it(
      "uses semantic surface roles and a six-level elevation scale",
      () => {
        expect(
          Object.keys(
            THEME_TOKEN_MANIFEST
              .surface,
          ),
        ).toEqual([
          "canvas",
          "surface",
          "containerLow",
          "container",
          "containerHigh",
          "surfaceHover",
        ]);

        expect(
          Object.keys(
            THEME_TOKEN_MANIFEST
              .elevation,
          ),
        ).toEqual([
          "level0",
          "level1",
          "level2",
          "level3",
          "level4",
          "level5",
        ]);

        for (
          const scheme of [
            "light",
            "dark",
          ] as const
        ) {
          const elevation =
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
              scheme
            ].elevation;

          expect(
            elevation.level0,
          ).toBe(
            "none",
          );

          for (
            const key of [
              "level1",
              "level2",
              "level3",
              "level4",
              "level5",
            ] as const
          ) {
            expect(
              elevation[key],
            ).not.toBe(
              "none",
            );
          }
        }
      },
    );

    it(
      "defines semantic typography, spacing and density metrics in defaults",
      () => {
        for (
          const scheme of [
            "light",
            "dark",
          ] as const
        ) {
          const tokens =
            SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME[
              scheme
            ];

          expect(
            Object.keys(
              tokens.typography
                .role,
            ),
          ).toEqual(
            UI_TYPOGRAPHY_ROLES,
          );

          expect(
            tokens.typography
              .role
              .body
              .fontFamily,
          ).toContain(
            "--ui-font-family-body",
          );

          expect(
            tokens.spacing,
          ).toEqual(
            expect.objectContaining({
              zero:
                "0",

              md:
                "0.75rem",

              "3xl":
                "3rem",
            }),
          );

          expect(
            tokens.density
              .compact
              .itemMinHeight,
          ).toBe(
            "2.5rem",
          );

          expect(
            tokens.density
              .comfortable
              .itemMinHeight,
          ).toBe(
            "3rem",
          );

          expect(
            tokens.density
              .spacious
              .itemMinHeight,
          ).toBe(
            "3.5rem",
          );
        }
      },
    );


    it(
      "lets expressive built-in themes change structure without component-specific branches",
      () => {
        const system =
          new ThemeSystem({
            persist:
              false,

            themes:
              BUILT_IN_THEMES,
          });

        const spring =
          system.resolveTheme(
            "spring",
          );

        const retro =
          system.resolveTheme(
            "retro-futurist",
          );

        const sepia =
          system.resolveTheme(
            "sepia-retro",
          );

        expect(
          spring.tokens
            .radius
            .lg,
        ).not.toBe(
          SYSTEM_DEFAULT_TOKENS_BY_COLOR_SCHEME
            .light
            .radius
            .lg,
        );

        expect(
          retro.tokens
            .elevation
            .level3,
        ).toContain(
          "rgba(255, 79, 216",
        );

        expect(
          retro.tokens
            .typography
            .fontFamily
            .display,
        ).toContain(
          "ui-monospace",
        );

        expect(
          sepia.tokens
            .typography
            .fontFamily
            .display,
        ).toContain(
          "Georgia",
        );
      },
    );
  },
);
