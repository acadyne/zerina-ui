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
  BUILT_IN_THEMES,
} from "./built-in";


export type {
  ThemeDefinition,
  ThemeMetadata,
  ThemeSource,
  ThemeTokens,
  ThemeValidationDiagnostic,
  ThemeValidationResult,
  ThemeName,
} from "./contracts/theme.types";