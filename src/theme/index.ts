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

export {
  BUILT_IN_THEMES,
} from "./built-in";


export type {
  ThemeIconName,
} from "./icons";


export type {
  ThemeDefinition,
  ThemeMetadata,
  ThemeSource,
  ThemeTokens,
  ThemeValidationDiagnostic,
  ThemeValidationResult,
  ThemeName,
} from "./contracts/theme.types";