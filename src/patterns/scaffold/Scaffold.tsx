// src/patterns/scaffold/Scaffold.tsx

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


export function Scaffold({
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

}: ScaffoldProps) {

  const rootSlot =
    resolveSlot<ScaffoldSlot>({
      slot: "root",
      styles,
      slotProps,
      className,
      style,
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
    });


  const scrollSlot =
    resolveSlot<ScaffoldSlot>({
      slot: "scroll",
      styles,
      slotProps,
    });


  const contentSlot =
    resolveSlot<ScaffoldSlot>({
      slot: "content",
      styles,
      slotProps,
    });


  const floatingSlot =
    resolveSlot<ScaffoldSlot>({
      slot: "floating",
      styles,
      slotProps,
      baseStyle: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 30,
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


  return (
    <Screen
      {...screenProps}

      {...rest}

      className={
        rootSlot.className
      }

      style={rootSlot.style}

      fullHeight={
        viewport === "window"
      }
    >

      {
        appBar ? (
          <Screen.Header
            {...appBarSlot}
          >
            {appBar}
          </Screen.Header>
        ) : null
      }


      <Screen.Body
        {...bodySlot}
      >

        {
          scrollable ? (

            <Screen.Scroll
              {...scrollProps}
              {...scrollSlot}
              style={{
                minHeight: 0,
                ...scrollSlot.style,
              }}
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
              style={{
                minWidth: 0,
                minHeight: 0,
                ...contentSlot.style,
              }}
            >
              {children}
            </Box>

          )
        }

      </Screen.Body>


      {
        floating ? (
          <Box
            {...floatingSlot}
          >
            <Box
              style={{
                pointerEvents: "auto",
              }}
            >
              {floating}
            </Box>
          </Box>
        ) : null
      }


      {
        footer ? (
          <Screen.Footer
            {...footerSlot}
          >
            {footer}
          </Screen.Footer>
        ) : null
      }

    </Screen>
  );
}


Scaffold.displayName =
  "Scaffold";


export type {
  ScaffoldProps,
  ScaffoldSlot,
  ScaffoldStyles,
  ScaffoldSlotProps,
  ScaffoldViewport,
} from "./scaffold.types";