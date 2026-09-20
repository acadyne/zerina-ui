// src/theme/index.ts

export {
  UIThemeProvider,
  useUITheme,
} from "./react/theme";

export type {
  UIThemeContextValue,
  UIThemeProviderProps,
} from "./react/theme";


export {
  createThemeDocumentState,
} from "./ssr/theme-document-state";

export type {
  CreateThemeDocumentStateOptions,
  ThemeDocumentCustomProperty,
  ThemeDocumentState,
  ThemeDocumentStyle,
} from "./ssr/theme-document-state";


export {
  ThemeSystem,
} from "./runtime/theme-system";

export type {
  RegisterThemeOptions,
  ResolvedTheme,
  ThemeSystemOptions,
} from "./runtime/theme-system";


export {
  createThemeDefinition,
} from "./definitions/theme-definition";

export type {
  CreateThemeDefinitionInput,
} from "./definitions/theme-definition";


export {
  validateThemeDefinition,
} from "./validation/theme-validation";


export {
  resolveThemeIcon,
} from "./icons";

export type {
  ThemeIconRegistry,
} from "./icons";


export {
  BUILT_IN_THEMES,
} from "./built-in";



export {
  UI_ELEVATIONS,
  UI_SHAPES,
  UI_SURFACE_ROLES,
  UI_TONES,
  UI_TYPOGRAPHY_ROLES,
} from "./contracts/visual-semantics";

export type {
  CSSFontWeight,
  UIElevation,
  UIShape,
  UISurfaceRole,
  UITone,
  UITypographyRole,
  ResolvedThemeTokens,
  ThemeBorderTokens,
  ThemeColorScheme,
  ThemeColorTokens,
  ThemeControlTokens,
  ThemeDensityTokens,
  ThemeElevationTokens,
  ThemeDefinition,
  ThemeExtensionPrimitive,
  ThemeExtensionTokens,
  ThemeExtensionValue,
  ThemeIconName,
  ThemeInteractionTokens,
  ThemeMetadata,
  ThemeName,
  ThemeRadiusTokens,
  ThemeSpacingTokens,
  ThemeSource,
  ThemeSurfaceTokens,
  ThemeTextTokens,
  ThemeTokenCSSVariable,
  ThemeTokens,
  ThemeTypographyTokens,
  ThemeValidationDiagnostic,
  ThemeValidationResult,
} from "./contracts/theme.types";