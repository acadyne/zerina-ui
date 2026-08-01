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

export const THEME_TOKEN_MANIFEST = {
  color: {
    primary: {
      kind: "string",
      cssVariable: "--ui-primary",
    },

    primaryHover: {
      kind: "string",
      cssVariable: "--ui-primary-hover",
    },

    primaryContrast: {
      kind: "string",
      cssVariable: "--ui-primary-contrast",
    },

    secondary: {
      kind: "string",
      cssVariable: "--ui-secondary",
    },

    secondaryHover: {
      kind: "string",
      cssVariable: "--ui-secondary-hover",
    },

    secondaryContrast: {
      kind: "string",
      cssVariable: "--ui-secondary-contrast",
    },

    success: {
      kind: "string",
      cssVariable: "--ui-success",
    },

    successStrong: {
      kind: "string",
      cssVariable: "--ui-success-strong",
    },

    successContrast: {
      kind: "string",
      cssVariable: "--ui-success-contrast",
    },

    warning: {
      kind: "string",
      cssVariable: "--ui-warning",
    },

    warningStrong: {
      kind: "string",
      cssVariable: "--ui-warning-strong",
    },

    warningContrast: {
      kind: "string",
      cssVariable: "--ui-warning-contrast",
    },

    danger: {
      kind: "string",
      cssVariable: "--ui-danger",
    },

    dangerHover: {
      kind: "string",
      cssVariable: "--ui-danger-hover",
    },

    dangerContrast: {
      kind: "string",
      cssVariable: "--ui-danger-contrast",
    },
  },

  surface: {
    bg: {
      kind: "string",
      cssVariable: "--ui-bg",
    },

    surface: {
      kind: "string",
      cssVariable: "--ui-surface",
    },

    surface2: {
      kind: "string",
      cssVariable: "--ui-surface-2",
    },

    surface3: {
      kind: "string",
      cssVariable: "--ui-surface-3",
    },

    surfaceHover: {
      kind: "string",
      cssVariable: "--ui-surface-hover",
    },
  },

  text: {
    text: {
      kind: "string",
      cssVariable: "--ui-text",
    },

    textMuted: {
      kind: "string",
      cssVariable: "--ui-text-muted",
    },

    textSoft: {
      kind: "string",
      cssVariable: "--ui-text-soft",
    },

    textInverse: {
      kind: "string",
      cssVariable: "--ui-text-inverse",
    },
  },

  border: {
    border: {
      kind: "string",
      cssVariable: "--ui-border",
    },

    borderStrong: {
      kind: "string",
      cssVariable: "--ui-border-strong",
    },
  },

  radius: {
    sm: {
      kind: "string",
      cssVariable: "--ui-radius-sm",
    },

    md: {
      kind: "string",
      cssVariable: "--ui-radius-md",
    },

    lg: {
      kind: "string",
      cssVariable: "--ui-radius-lg",
    },

    xl: {
      kind: "string",
      cssVariable: "--ui-radius-xl",
    },

    full: {
      kind: "string",
      cssVariable: "--ui-radius-full",
    },
  },

  shadow: {
    sm: {
      kind: "string",
      cssVariable: "--ui-shadow-sm",
    },

    md: {
      kind: "string",
      cssVariable: "--ui-shadow-md",
    },

    lg: {
      kind: "string",
      cssVariable: "--ui-shadow-lg",
    },

    control: {
      kind: "string",
      cssVariable: "--ui-shadow-control",
    },

    action: {
      kind: "string",
      cssVariable: "--ui-shadow-action",
    },

    actionHover: {
      kind: "string",
      cssVariable: "--ui-shadow-action-hover",
    },

    actionSubtleHover: {
      kind: "string",
      cssVariable:
        "--ui-shadow-action-subtle-hover",
    },

    actionOutlineHover: {
      kind: "string",
      cssVariable:
        "--ui-shadow-action-outline-hover",
    },
  },

  typography: {
    fontSize: {
      xs: {
        kind: "string",
        cssVariable: "--ui-font-size-xs",
      },

      sm: {
        kind: "string",
        cssVariable: "--ui-font-size-sm",
      },

      md: {
        kind: "string",
        cssVariable: "--ui-font-size-md",
      },

      lg: {
        kind: "string",
        cssVariable: "--ui-font-size-lg",
      },

      xl: {
        kind: "string",
        cssVariable: "--ui-font-size-xl",
      },
    },

    headingFontSize: {
      sm: {
        kind: "string",
        cssVariable:
          "--ui-heading-font-size-sm",
      },

      md: {
        kind: "string",
        cssVariable:
          "--ui-heading-font-size-md",
      },

      lg: {
        kind: "string",
        cssVariable:
          "--ui-heading-font-size-lg",
      },

      xl: {
        kind: "string",
        cssVariable:
          "--ui-heading-font-size-xl",
      },

      "2xl": {
        kind: "string",
        cssVariable:
          "--ui-heading-font-size-2xl",
      },
    },

    fontWeight: {
      medium: {
        kind: "fontWeight",
        cssVariable:
          "--ui-font-weight-medium",
      },

      bold: {
        kind: "fontWeight",
        cssVariable:
          "--ui-font-weight-bold",
      },
    },
  },

  control: {
    height: {
      sm: {
        kind: "string",
        cssVariable: "--ui-control-h-sm",
      },

      md: {
        kind: "string",
        cssVariable: "--ui-control-h-md",
      },

      lg: {
        kind: "string",
        cssVariable: "--ui-control-h-lg",
      },
    },

    paddingX: {
      sm: {
        kind: "string",
        cssVariable:
          "--ui-control-padding-x-sm",
      },

      md: {
        kind: "string",
        cssVariable:
          "--ui-control-padding-x-md",
      },

      lg: {
        kind: "string",
        cssVariable:
          "--ui-control-padding-x-lg",
      },
    },

    paddingY: {
      sm: {
        kind: "string",
        cssVariable:
          "--ui-control-padding-y-sm",
      },

      md: {
        kind: "string",
        cssVariable:
          "--ui-control-padding-y-md",
      },

      lg: {
        kind: "string",
        cssVariable:
          "--ui-control-padding-y-lg",
      },
    },

    textareaMinHeight: {
      sm: {
        kind: "string",
        cssVariable:
          "--ui-control-textarea-min-height-sm",
      },

      md: {
        kind: "string",
        cssVariable:
          "--ui-control-textarea-min-height-md",
      },

      lg: {
        kind: "string",
        cssVariable:
          "--ui-control-textarea-min-height-lg",
      },
    },
  },

  interaction: {
    overlay: {
      kind: "string",
      cssVariable:
        "--ui-interaction-overlay",
    },

    focusRingColor: {
      kind: "string",
      cssVariable:
        "--ui-interaction-focus-ring-color",
    },

    focusRingDangerColor: {
      kind: "string",
      cssVariable:
        "--ui-interaction-focus-ring-danger-color",
    },

    focusRingWidth: {
      kind: "string",
      cssVariable:
        "--ui-interaction-focus-ring-width",
    },

    focusRingOffset: {
      kind: "string",
      cssVariable:
        "--ui-interaction-focus-ring-offset",
    },

    disabledOpacity: {
      kind: "string",
      cssVariable:
        "--ui-interaction-disabled-opacity",
    },
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

export type ThemeShadowTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.shadow
  >;

export type ThemeTypographyTokens =
  PartialThemeTokenTree<
    typeof THEME_TOKEN_MANIFEST.typography
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
