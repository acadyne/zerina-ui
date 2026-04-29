// src/core/provider/ZerinaProvider.tsx
import React from "react";
import {
  OverlayProvider,
  type OverlayProviderProps,
} from "../overlay";
import {
  UIThemeProvider,
  type UIThemeProviderProps,
} from "../../theme/theme";
import {
  UILayoutProvider,
  type UILayoutProviderProps,
} from "../layout";
import {
  UIMotionProvider,
  type UIMotionProviderProps,
} from "../motion";
import {
  ToastProvider,
  type ToastProviderProps,
} from "../../components/feedback";


export interface ZerinaProviderProps {
  children: React.ReactNode;

  /**
   * Configuración del sistema de overlays.
   *
   * Si no se pasa, usa la configuración por defecto de OverlayProvider.
   */
  overlay?: Omit<OverlayProviderProps, "children">;

  /**
   * Configuración del sistema de temas.
   *
   * Si no se pasa, usa la configuración por defecto de UIThemeProvider.
   */
  theme?: Omit<UIThemeProviderProps, "children">;

  /**
   * Configuración del sistema de layout responsivo.
   *
   * Si no se pasa, usa la configuración por defecto de UILayoutProvider.
   */
  layout?: Omit<UILayoutProviderProps, "children">;

  /**
   * Configuración del sistema de motion.
   *
   * Si no se pasa, usa la configuración por defecto de UIMotionProvider.
   */
  motion?: Omit<UIMotionProviderProps, "children">;

  /**
   * Configuración del sistema de toast.
   *
   * Si no se pasa, usa la configuración por defecto de UIMotionProvider.
   */
   toast?: Omit<ToastProviderProps, "children">;

}

export const ZerinaProvider: React.FC<ZerinaProviderProps> = ({
  children,
  overlay,
  theme,
  layout,
  motion,
    toast,
}) => {
  return (
    <OverlayProvider {...overlay}>
      <UILayoutProvider {...layout}>
        <UIMotionProvider {...motion}>
          <UIThemeProvider {...theme}>
            <ToastProvider {...toast}>{children}</ToastProvider>
          </UIThemeProvider>
        </UIMotionProvider>
      </UILayoutProvider>
    </OverlayProvider>
  );
};

ZerinaProvider.displayName = "ZerinaProvider";