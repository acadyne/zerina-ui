// src/theme/contracts/theme-token-contract.ts

export type CSSFontWeight =
  | string
  | number;

export type ThemeExtensionPrimitive =
  | string
  | number
  | boolean
  | null;

export type ThemeExtensionValue =
  | ThemeExtensionPrimitive
  | readonly ThemeExtensionValue[]
  | {
      readonly [key: string]:
        ThemeExtensionValue;
    };

export type ThemeExtensionTokens =
  Readonly<
    Record<
      string,
      ThemeExtensionValue
    >
  >;

export type ThemeTokenValueKind =
  | "string"
  | "fontWeight";

export interface ThemeTokenDescriptor<
  TKind extends
    ThemeTokenValueKind =
      ThemeTokenValueKind,
> {
  readonly kind: TKind;

  readonly cssVariable:
    `--ui-${string}`;
}

export interface ThemeTokenManifestBranch {
  readonly [key: string]:
    ThemeTokenManifestNode;
}

export type ThemeTokenManifestNode =
  | ThemeTokenDescriptor
  | ThemeTokenManifestBranch;

export function isThemeTokenDescriptor<
  TNode extends
    ThemeTokenManifestNode,
>(
  node: TNode
): node is Extract<
  TNode,
  ThemeTokenDescriptor
> {
  return (
    "kind" in node &&
    "cssVariable" in node
  );
}

function stringToken<
  TVariable extends
    `--ui-${string}`,
>(
  cssVariable:
    TVariable
): {
  readonly kind:
    "string";

  readonly cssVariable:
    TVariable;
} {
  return {
    kind:
      "string",

    cssVariable,
  };
}

function fontWeightToken<
  TVariable extends
    `--ui-${string}`,
>(
  cssVariable:
    TVariable
): {
  readonly kind:
    "fontWeight";

  readonly cssVariable:
    TVariable;
} {
  return {
    kind:
      "fontWeight",

    cssVariable,
  };
}


/**
 * Canonical token schema.
 *
 * Every public theme token, runtime CSS variable, SSR declaration and
 * validation path is derived from this manifest. Do not create parallel
 * token registries in component families.
 */
export const THEME_TOKEN_MANIFEST = {
  color: {
    primary:
      stringToken(
        "--ui-primary"
      ),

    primaryHover:
      stringToken(
        "--ui-primary-hover"
      ),

    primaryContrast:
      stringToken(
        "--ui-primary-contrast"
      ),

    primaryContainer:
      stringToken(
        "--ui-primary-container"
      ),

    onPrimaryContainer:
      stringToken(
        "--ui-on-primary-container"
      ),


    secondary:
      stringToken(
        "--ui-secondary"
      ),

    secondaryHover:
      stringToken(
        "--ui-secondary-hover"
      ),

    secondaryContrast:
      stringToken(
        "--ui-secondary-contrast"
      ),

    secondaryContainer:
      stringToken(
        "--ui-secondary-container"
      ),

    onSecondaryContainer:
      stringToken(
        "--ui-on-secondary-container"
      ),


    neutralContainer:
      stringToken(
        "--ui-neutral-container"
      ),

    onNeutralContainer:
      stringToken(
        "--ui-on-neutral-container"
      ),


    info:
      stringToken(
        "--ui-info"
      ),

    infoStrong:
      stringToken(
        "--ui-info-strong"
      ),

    infoContrast:
      stringToken(
        "--ui-info-contrast"
      ),

    infoContainer:
      stringToken(
        "--ui-info-container"
      ),

    onInfoContainer:
      stringToken(
        "--ui-on-info-container"
      ),


    success:
      stringToken(
        "--ui-success"
      ),

    successStrong:
      stringToken(
        "--ui-success-strong"
      ),

    successContrast:
      stringToken(
        "--ui-success-contrast"
      ),

    successContainer:
      stringToken(
        "--ui-success-container"
      ),

    onSuccessContainer:
      stringToken(
        "--ui-on-success-container"
      ),


    warning:
      stringToken(
        "--ui-warning"
      ),

    warningStrong:
      stringToken(
        "--ui-warning-strong"
      ),

    warningContrast:
      stringToken(
        "--ui-warning-contrast"
      ),

    warningContainer:
      stringToken(
        "--ui-warning-container"
      ),

    onWarningContainer:
      stringToken(
        "--ui-on-warning-container"
      ),


    danger:
      stringToken(
        "--ui-danger"
      ),

    dangerHover:
      stringToken(
        "--ui-danger-hover"
      ),

    dangerContrast:
      stringToken(
        "--ui-danger-contrast"
      ),

    dangerContainer:
      stringToken(
        "--ui-danger-container"
      ),

    onDangerContainer:
      stringToken(
        "--ui-on-danger-container"
      ),
  },

  surface: {
    canvas:
      stringToken(
        "--ui-surface-canvas"
      ),

    surface:
      stringToken(
        "--ui-surface"
      ),

    containerLow:
      stringToken(
        "--ui-surface-container-low"
      ),

    container:
      stringToken(
        "--ui-surface-container"
      ),

    containerHigh:
      stringToken(
        "--ui-surface-container-high"
      ),

    surfaceHover:
      stringToken(
        "--ui-surface-hover"
      ),
  },

  text: {
    text:
      stringToken(
        "--ui-text"
      ),

    textMuted:
      stringToken(
        "--ui-text-muted"
      ),

    textSoft:
      stringToken(
        "--ui-text-soft"
      ),

    textInverse:
      stringToken(
        "--ui-text-inverse"
      ),
  },

  border: {
    border:
      stringToken(
        "--ui-border"
      ),

    borderStrong:
      stringToken(
        "--ui-border-strong"
      ),
  },

  radius: {
    sm:
      stringToken(
        "--ui-radius-sm"
      ),

    md:
      stringToken(
        "--ui-radius-md"
      ),

    lg:
      stringToken(
        "--ui-radius-lg"
      ),

    xl:
      stringToken(
        "--ui-radius-xl"
      ),

    full:
      stringToken(
        "--ui-radius-full"
      ),
  },

  elevation: {
    level0:
      stringToken(
        "--ui-elevation-0"
      ),

    level1:
      stringToken(
        "--ui-elevation-1"
      ),

    level2:
      stringToken(
        "--ui-elevation-2"
      ),

    level3:
      stringToken(
        "--ui-elevation-3"
      ),

    level4:
      stringToken(
        "--ui-elevation-4"
      ),

    level5:
      stringToken(
        "--ui-elevation-5"
      ),
  },

  typography: {
    fontFamily: {
      body:
        stringToken(
          "--ui-font-family-body"
        ),

      display:
        stringToken(
          "--ui-font-family-display"
        ),

      mono:
        stringToken(
          "--ui-font-family-mono"
        ),
    },

    fontSize: {
      xs:
        stringToken(
          "--ui-font-size-xs"
        ),

      sm:
        stringToken(
          "--ui-font-size-sm"
        ),

      md:
        stringToken(
          "--ui-font-size-md"
        ),

      lg:
        stringToken(
          "--ui-font-size-lg"
        ),

      xl:
        stringToken(
          "--ui-font-size-xl"
        ),
    },

    headingFontSize: {
      sm:
        stringToken(
          "--ui-heading-font-size-sm"
        ),

      md:
        stringToken(
          "--ui-heading-font-size-md"
        ),

      lg:
        stringToken(
          "--ui-heading-font-size-lg"
        ),

      xl:
        stringToken(
          "--ui-heading-font-size-xl"
        ),

      "2xl":
        stringToken(
          "--ui-heading-font-size-2xl"
        ),
    },

    fontWeight: {
      regular:
        fontWeightToken(
          "--ui-font-weight-regular"
        ),

      medium:
        fontWeightToken(
          "--ui-font-weight-medium"
        ),

      bold:
        fontWeightToken(
          "--ui-font-weight-bold"
        ),
    },

    role: {
      display: {
        fontFamily:
          stringToken(
            "--ui-type-display-font-family"
          ),

        fontSize:
          stringToken(
            "--ui-type-display-font-size"
          ),

        fontWeight:
          fontWeightToken(
            "--ui-type-display-font-weight"
          ),

        lineHeight:
          stringToken(
            "--ui-type-display-line-height"
          ),

        letterSpacing:
          stringToken(
            "--ui-type-display-letter-spacing"
          ),
      },

      headline: {
        fontFamily:
          stringToken(
            "--ui-type-headline-font-family"
          ),

        fontSize:
          stringToken(
            "--ui-type-headline-font-size"
          ),

        fontWeight:
          fontWeightToken(
            "--ui-type-headline-font-weight"
          ),

        lineHeight:
          stringToken(
            "--ui-type-headline-line-height"
          ),

        letterSpacing:
          stringToken(
            "--ui-type-headline-letter-spacing"
          ),
      },

      title: {
        fontFamily:
          stringToken(
            "--ui-type-title-font-family"
          ),

        fontSize:
          stringToken(
            "--ui-type-title-font-size"
          ),

        fontWeight:
          fontWeightToken(
            "--ui-type-title-font-weight"
          ),

        lineHeight:
          stringToken(
            "--ui-type-title-line-height"
          ),

        letterSpacing:
          stringToken(
            "--ui-type-title-letter-spacing"
          ),
      },

      body: {
        fontFamily:
          stringToken(
            "--ui-type-body-font-family"
          ),

        fontSize:
          stringToken(
            "--ui-type-body-font-size"
          ),

        fontWeight:
          fontWeightToken(
            "--ui-type-body-font-weight"
          ),

        lineHeight:
          stringToken(
            "--ui-type-body-line-height"
          ),

        letterSpacing:
          stringToken(
            "--ui-type-body-letter-spacing"
          ),
      },

      label: {
        fontFamily:
          stringToken(
            "--ui-type-label-font-family"
          ),

        fontSize:
          stringToken(
            "--ui-type-label-font-size"
          ),

        fontWeight:
          fontWeightToken(
            "--ui-type-label-font-weight"
          ),

        lineHeight:
          stringToken(
            "--ui-type-label-line-height"
          ),

        letterSpacing:
          stringToken(
            "--ui-type-label-letter-spacing"
          ),
      },

      caption: {
        fontFamily:
          stringToken(
            "--ui-type-caption-font-family"
          ),

        fontSize:
          stringToken(
            "--ui-type-caption-font-size"
          ),

        fontWeight:
          fontWeightToken(
            "--ui-type-caption-font-weight"
          ),

        lineHeight:
          stringToken(
            "--ui-type-caption-line-height"
          ),

        letterSpacing:
          stringToken(
            "--ui-type-caption-letter-spacing"
          ),
      },
    },
  },

  spacing: {
    zero:
      stringToken(
        "--ui-space-0"
      ),

    xs:
      stringToken(
        "--ui-space-xs"
      ),

    sm:
      stringToken(
        "--ui-space-sm"
      ),

    md:
      stringToken(
        "--ui-space-md"
      ),

    lg:
      stringToken(
        "--ui-space-lg"
      ),

    xl:
      stringToken(
        "--ui-space-xl"
      ),

    "2xl":
      stringToken(
        "--ui-space-2xl"
      ),

    "3xl":
      stringToken(
        "--ui-space-3xl"
      ),
  },

  density: {
    compact: {
      controlHeight:
        stringToken(
          "--ui-density-compact-control-height"
        ),

      itemMinHeight:
        stringToken(
          "--ui-density-compact-item-min-height"
        ),

      inlineGap:
        stringToken(
          "--ui-density-compact-inline-gap"
        ),

      blockGap:
        stringToken(
          "--ui-density-compact-block-gap"
        ),

      contentPadding:
        stringToken(
          "--ui-density-compact-content-padding"
        ),

      iconSize:
        stringToken(
          "--ui-density-compact-icon-size"
        ),
    },

    comfortable: {
      controlHeight:
        stringToken(
          "--ui-density-comfortable-control-height"
        ),

      itemMinHeight:
        stringToken(
          "--ui-density-comfortable-item-min-height"
        ),

      inlineGap:
        stringToken(
          "--ui-density-comfortable-inline-gap"
        ),

      blockGap:
        stringToken(
          "--ui-density-comfortable-block-gap"
        ),

      contentPadding:
        stringToken(
          "--ui-density-comfortable-content-padding"
        ),

      iconSize:
        stringToken(
          "--ui-density-comfortable-icon-size"
        ),
    },

    spacious: {
      controlHeight:
        stringToken(
          "--ui-density-spacious-control-height"
        ),

      itemMinHeight:
        stringToken(
          "--ui-density-spacious-item-min-height"
        ),

      inlineGap:
        stringToken(
          "--ui-density-spacious-inline-gap"
        ),

      blockGap:
        stringToken(
          "--ui-density-spacious-block-gap"
        ),

      contentPadding:
        stringToken(
          "--ui-density-spacious-content-padding"
        ),

      iconSize:
        stringToken(
          "--ui-density-spacious-icon-size"
        ),
    },
  },

  control: {
    height: {
      sm:
        stringToken(
          "--ui-control-h-sm"
        ),

      md:
        stringToken(
          "--ui-control-h-md"
        ),

      lg:
        stringToken(
          "--ui-control-h-lg"
        ),
    },

    paddingX: {
      sm:
        stringToken(
          "--ui-control-padding-x-sm"
        ),

      md:
        stringToken(
          "--ui-control-padding-x-md"
        ),

      lg:
        stringToken(
          "--ui-control-padding-x-lg"
        ),
    },

    paddingY: {
      sm:
        stringToken(
          "--ui-control-padding-y-sm"
        ),

      md:
        stringToken(
          "--ui-control-padding-y-md"
        ),

      lg:
        stringToken(
          "--ui-control-padding-y-lg"
        ),
    },

    textareaMinHeight: {
      sm:
        stringToken(
          "--ui-control-textarea-min-height-sm"
        ),

      md:
        stringToken(
          "--ui-control-textarea-min-height-md"
        ),

      lg:
        stringToken(
          "--ui-control-textarea-min-height-lg"
        ),
    },
  },

  interaction: {
    overlay:
      stringToken(
        "--ui-interaction-overlay"
      ),

    focusRingColor:
      stringToken(
        "--ui-interaction-focus-ring-color"
      ),

    focusRingDangerColor:
      stringToken(
        "--ui-interaction-focus-ring-danger-color"
      ),

    focusRingWidth:
      stringToken(
        "--ui-interaction-focus-ring-width"
      ),

    focusRingOffset:
      stringToken(
        "--ui-interaction-focus-ring-offset"
      ),

    disabledOpacity:
      stringToken(
        "--ui-interaction-disabled-opacity"
      ),
  },
} as const satisfies
  ThemeTokenManifestBranch;

type ThemeTokenValue<
  TDescriptor extends
    ThemeTokenDescriptor,
> =
  TDescriptor["kind"] extends
    "fontWeight"
    ? CSSFontWeight
    : string;

type PartialThemeTokenTree<TNode> =
  TNode extends ThemeTokenDescriptor
    ? ThemeTokenValue<TNode>
    : TNode extends
        ThemeTokenManifestBranch
      ? {
          -readonly [
            TKey in keyof TNode
          ]?: PartialThemeTokenTree<
            TNode[TKey]
          >;
        }
      : never;

type ResolvedThemeTokenTree<TNode> =
  TNode extends ThemeTokenDescriptor
    ? ThemeTokenValue<TNode>
    : TNode extends
        ThemeTokenManifestBranch
      ? {
          -readonly [
            TKey in keyof TNode
          ]: ResolvedThemeTokenTree<
            TNode[TKey]
          >;
        }
      : never;

type ThemeTokenCSSVariableTree<TNode> =
  TNode extends ThemeTokenDescriptor
    ? TNode["cssVariable"]
    : TNode extends
        ThemeTokenManifestBranch
      ? {
          [
            TKey in keyof TNode
          ]: ThemeTokenCSSVariableTree<
            TNode[TKey]
          >;
        }[keyof TNode]
      : never;

export type ThemeColorTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.color
  >;

export type ThemeSurfaceTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.surface
  >;

export type ThemeTextTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.text
  >;

export type ThemeBorderTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.border
  >;

export type ThemeRadiusTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.radius
  >;

export type ThemeElevationTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.elevation
  >;

export type ThemeTypographyTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.typography
  >;

export type ThemeSpacingTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.spacing
  >;

export type ThemeDensityTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.density
  >;

export type ThemeControlTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.control
  >;

export type ThemeInteractionTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.interaction
  >;

export type StandardThemeTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST
  >;

export type ResolvedStandardThemeTokens =
  ResolvedThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST
  >;

export type ThemeTokens =
  StandardThemeTokens & {
    extensions?: ThemeExtensionTokens;
  };

export type ResolvedThemeTokens =
  ResolvedStandardThemeTokens & {
    extensions: ThemeExtensionTokens;
  };

export type ThemeTokenCSSVariable =
  ThemeTokenCSSVariableTree<
    typeof THEME_TOKEN_MANIFEST
  >;
