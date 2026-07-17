// src/provider/ZerinaProvider.tsx
import React from "react";

import {
  OverlayProvider,
  type OverlayProviderProps,
} from "../core/overlay";

import {
  UIMotionProvider,
  type UIMotionProviderProps,
} from "../core/motion";

import {
  UIViewportProvider,
  type UIViewportProviderProps,
} from "../core/viewport";

import {
  UIThemeProvider,
  type UIThemeProviderProps,
} from "../theme";


import {
  ToastProvider,
  type ToastProviderProps,
} from "../components/feedback";

export interface ZerinaProviderProps {
  children: React.ReactNode;

  /**
   * Configuración del sistema de overlays.
   */
  overlay?: Omit<OverlayProviderProps, "children">;

  /**
   * Configuración del sistema de viewport.
   */
  viewport?: Omit<UIViewportProviderProps, "children">;

  /**
   * Configuración del sistema de motion.
   */
  motion?: Omit<UIMotionProviderProps, "children">;

  /**
   * Configuración del sistema de temas.
   */
  theme?: Omit<UIThemeProviderProps, "children">;

  /**
   * Configuración del sistema de toast.
   */
  toast?: Omit<ToastProviderProps, "children">;
}

export const ZerinaProvider: React.FC<ZerinaProviderProps> = ({
  children,
  overlay,
  viewport,
  motion,
  theme,
  toast,
}) => {
  return (
    <OverlayProvider {...overlay}>
      <UIViewportProvider {...viewport}>
        <UIMotionProvider {...motion}>
          <UIThemeProvider {...theme}>
            <ToastProvider {...toast}>{children}</ToastProvider>
          </UIThemeProvider>
        </UIMotionProvider>
      </UIViewportProvider>
    </OverlayProvider>
  );
};

ZerinaProvider.displayName = "ZerinaProvider";