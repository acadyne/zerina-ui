// src/patterns/scaffold/Scaffold.tsx

import React from "react";

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


function hasRenderableNode(
  node: React.ReactNode
): boolean {
  return (
    node !== null &&
    node !== undefined &&
    typeof node !== "boolean"
  );
}


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

        scrollable = false,

        scrollProps,
        screenProps,

        className = "",
        style,

        styles,
        slotProps,

        ...rest
      },
      ref
    ) => {
      const {
        className:
          screenClassName = "",

        style:
          screenStyle,

        ...resolvedScreenProps
      } = screenProps ?? {};


      const {
        className:
          scrollClassName = "",

        style:
          scrollStyle,

        ...resolvedScrollProps
      } = scrollProps ?? {};


      const rootSlot =
        resolveSlot<ScaffoldSlot>({
          slot: "root",

          styles,
          slotProps,

          className,
          style,

          baseProps: {
            className:
              screenClassName,

            style:
              screenStyle,
          },

          baseStyle: {
            height:
              viewport === "contained"
                ? "100%"
                : undefined,

            minHeight: 0,
          },
        });


      const appBarSlot =
        resolveSlot<ScaffoldSlot>({
          slot: "appBar",

          styles,
          slotProps,

          baseStyle: {
            width: "100%",
            minWidth: 0,
            flexShrink: 0,
          },
        });


      const bodySlot =
        resolveSlot<ScaffoldSlot>({
          slot: "body",

          styles,
          slotProps,

          baseStyle: {
            position: "relative",
          },
        });


      const scrollSlot =
        resolveSlot<ScaffoldSlot>({
          slot: "scroll",

          styles,
          slotProps,

          className:
            scrollClassName,

          style:
            scrollStyle,

          baseStyle: {
            minHeight: 0,
          },
        });


      const contentSlot =
        resolveSlot<ScaffoldSlot>({
          slot: "content",

          styles,
          slotProps,

          baseStyle: {
            width: "100%",

            height:
              scrollable
                ? undefined
                : "100%",

            minWidth: 0,
            minHeight: 0,

            overflow:
              scrollable
                ? undefined
                : "hidden",

            boxSizing:
              "border-box",
          },
        });


      const floatingSlot =
        resolveSlot<ScaffoldSlot>({
          slot: "floating",

          styles,
          slotProps,

          baseStyle: {
            position: "absolute",
            inset: 0,

            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",

            padding: "1rem",
            boxSizing: "border-box",

            pointerEvents: "none",

            zIndex:
              getScaffoldLocalZIndex(
                "floating"
              ),
          },
        });


      const footerSlot =
        resolveSlot<ScaffoldSlot>({
          slot: "footer",

          styles,
          slotProps,

          baseStyle: {
            width: "100%",
            minWidth: 0,
            flexShrink: 0,
          },
        });


      const hasAppBar =
        hasRenderableNode(appBar);

      const hasFloating =
        hasRenderableNode(floating);

      const hasFooter =
        hasRenderableNode(footer);


      return (
        <Screen
          {...resolvedScreenProps}
          {...rest}
          {...rootSlot}

          ref={ref}

          fullHeight={
            viewport === "window"
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
            {scrollable ? (
              <Screen.Scroll
                {...resolvedScrollProps}
                {...scrollSlot}
              >
                <Box
                  {...contentSlot}
                >
                  {children}
                </Box>
              </Screen.Scroll>
            ) : (
              <Box
                {...contentSlot}
              >
                {children}
              </Box>
            )}


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