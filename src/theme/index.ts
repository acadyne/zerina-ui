// src/theme/index.ts

export {
  UIThemeProvider,
  useUITheme,
} from "./react/theme";

export type {
  UIThemeProviderProps,
} from "./react/theme";


export {
  ThemeSystem,
} from "./runtime/theme-system";

export type {
  ResolvedTheme,
  ThemeSystemOptions,
} from "./runtime/theme-system";


export {
  createThemeDefinition,
} from "./definitions/theme-definition";


export {
  validateThemeDefinition,
} from "./validation/theme-validation";


export {
  resolveThemeIcon,
  registerThemeIcon,
} from "./icons";

export type {
  RegisterThemeIconOptions,
} from "./icons";


export {
  BUILT_IN_THEMES,
} from "./built-in";


export type {
  CSSFontWeight,
  ThemeBorderTokens,
  ThemeColorScheme,
  ThemeColorTokens,
  ThemeControlTokens,
  ThemeDefinition,
  ThemeIconName,
  ThemeInteractionTokens,
  ThemeMetadata,
  ThemeName,
  ThemeRadiusTokens,
  ThemeShadowTokens,
  ThemeSource,
  ThemeSurfaceTokens,
  ThemeTextTokens,
  ThemeTokens,
  ThemeTypographyTokens,
  ThemeValidationDiagnostic,
  ThemeValidationResult,
} from "./contracts/theme.types";