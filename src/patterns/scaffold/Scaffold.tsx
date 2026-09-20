// src/patterns/scaffold/Scaffold.tsx
import React from "react";

import {
  hasRenderableNode,
} from "../../core/react/nodePresence";

import {
  resolveSlot,
} from "../../helpers/css";

import {
  Box,
  Screen,
} from "../../primitives/layout";

import type {
  ScaffoldProps,
  ScaffoldSlot,
} from "./scaffold.types";

import {
  getScaffoldLocalZIndex,
} from "./scaffoldLayers";

/**
 * Shell estructural de pantalla.
 *
 * Ownership:
 *
 * - Scaffold: regiones appBar/body/footer/floating.
 * - Screen: root físico + viewport/safe-area externo.
 * - ScreenContent: layout/scroll semántico del contenido.
 * - ScrollArea: mecánica de scroll.
 */
export const Scaffold =
  React.forwardRef<
    HTMLDivElement,
    ScaffoldProps
  >(
    (
      {
        children,

        viewport = "window",

        appBar,
        footer,
        floating,

        className = "",
        style,

        styles,
        slotProps,

        ...screenRootProps
      },
      ref
    ) => {
      const rootSlot =
        resolveSlot<ScaffoldSlot>({
          slot:
            "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            "data-ui-scaffold":
              "",

            "data-ui-scaffold-viewport":
              viewport,
          },

          baseStyle: {
            height:
              viewport ===
              "contained"
                ? "100%"
                : undefined,

            minHeight:
              0,
          },
        });

      const appBarSlot =
        resolveSlot<ScaffoldSlot>({
          slot:
            "appBar",

          styles,
          slotProps,

          baseStyle: {
            width:
              "100%",

            minWidth:
              0,

            flexShrink:
              0,
          },
        });

      const bodySlot =
        resolveSlot<ScaffoldSlot>({
          slot:
            "body",

          styles,
          slotProps,

          baseStyle: {
            position:
              "relative",

            flex:
              1,

            minWidth:
              0,

            minHeight:
              0,

            overflow:
              "hidden",
          },
        });

      const contentSlot =
        resolveSlot<ScaffoldSlot>({
          slot:
            "content",

          styles,
          slotProps,

          baseStyle: {
            width:
              "100%",

            height:
              "100%",

            minWidth:
              0,

            minHeight:
              0,

            overflow:
              "hidden",

            boxSizing:
              "border-box",
          },
        });

      const floatingSlot =
        resolveSlot<ScaffoldSlot>({
          slot:
            "floating",

          styles,
          slotProps,

          baseStyle: {
            position:
              "absolute",

            inset:
              0,

            display:
              "flex",

            alignItems:
              "flex-end",

            justifyContent:
              "flex-end",

            padding:
              "1rem",

            boxSizing:
              "border-box",

            pointerEvents:
              "none",

            zIndex:
              getScaffoldLocalZIndex(
                "floating"
              ),
          },
        });

      const footerSlot =
        resolveSlot<ScaffoldSlot>({
          slot:
            "footer",

          styles,
          slotProps,

          baseStyle: {
            width:
              "100%",

            minWidth:
              0,

            flexShrink:
              0,
          },
        });

      const hasAppBar =
        hasRenderableNode(
          appBar
        );

      const hasFloating =
        hasRenderableNode(
          floating
        );

      const hasFooter =
        hasRenderableNode(
          footer
        );

      return (
        <Screen
          {...rootSlot}
          {...screenRootProps}

          ref={ref}

          fullHeight={
            viewport ===
            "window"
          }
        >
          {hasAppBar ? (
            <Screen.Header
              {...appBarSlot}
            >
              {appBar}
            </Screen.Header>
          ) : null}

          <Screen.Body
            {...bodySlot}
          >
            <Box
              {...contentSlot}
            >
              {children}
            </Box>

            {hasFloating ? (
              <Box
                {...floatingSlot}
              >
                <Box
                  style={{
                    pointerEvents:
                      "auto",
                  }}
                >
                  {floating}
                </Box>
              </Box>
            ) : null}
          </Screen.Body>

          {hasFooter ? (
            <Screen.Footer
              {...footerSlot}
            >
              {footer}
            </Screen.Footer>
          ) : null}
        </Screen>
      );
    }
  );

Scaffold.displayName =
  "Scaffold";

export type {
  ScaffoldProps,
  ScaffoldSlot,
  ScaffoldStyles,
  ScaffoldSlotProps,
  ScaffoldViewport,
} from "./scaffold.types";
