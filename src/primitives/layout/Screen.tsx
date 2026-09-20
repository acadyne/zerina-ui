// src/primitives/layout/Screen.tsx
import React from "react";
import {
  addSafeAreaOffset,
  resolveSafeAreaEdges,
  type SafeAreaEdges,
} from "../../helpers/safeArea";
import {
  Box,
  type BoxProps,
} from "./Box";

export type ScreenInset =
  number | string;

export interface ScreenProps
  extends BoxProps<"div"> {
  children?:
    React.ReactNode;

  /**
   * Si está activo, el Screen ocupa todo el viewport dinámico.
   */
  fullHeight?: boolean;

  /**
   * Aplica safe-area sobre el root estructural.
   *
   * Screen es el owner de los insets externos del shell.
   * Las regiones internas no deben volver a aplicar esos mismos edges.
   */
  safeArea?:
    boolean | SafeAreaEdges;

  /**
   * Espacio reservado arriba, sumado al safe-area correspondiente.
   */
  topInset?: ScreenInset;

  /**
   * Espacio reservado abajo, sumado al safe-area correspondiente.
   */
  bottomInset?: ScreenInset;

  /**
   * Controla el overflow del root.
   *
   * En pantallas app-first normalmente debe ser hidden.
   */
  overflow?:
    React.CSSProperties["overflow"];
}

export interface ScreenHeaderProps
  extends BoxProps<"header"> {
  children?:
    React.ReactNode;

  sticky?: boolean;
}

export interface ScreenBodyProps
  extends BoxProps<"main"> {
  children?:
    React.ReactNode;
}

export interface ScreenFooterProps
  extends BoxProps<"footer"> {
  children?:
    React.ReactNode;

  sticky?: boolean;
}

type ScreenComponent =
  React.ForwardRefExoticComponent<
    ScreenProps &
    React.RefAttributes<HTMLDivElement>
  > & {
    Header:
      React.ForwardRefExoticComponent<
        ScreenHeaderProps &
        React.RefAttributes<HTMLElement>
      >;

    Body:
      React.ForwardRefExoticComponent<
        ScreenBodyProps &
        React.RefAttributes<HTMLElement>
      >;

    Footer:
      React.ForwardRefExoticComponent<
        ScreenFooterProps &
        React.RefAttributes<HTMLElement>
      >;
  };

const ScreenRoot =
  React.forwardRef<
    HTMLDivElement,
    ScreenProps
  >(
    (
      {
        children,

        fullHeight = true,

        safeArea = false,
        topInset,
        bottomInset,

        overflow = "hidden",

        style,

        ...rest
      },
      ref
    ) => {
      const safeAreaEdges =
        resolveSafeAreaEdges(
          safeArea
        );

      return (
        <Box
          ref={ref}
          {...rest}
          style={{
            position:
              "relative",

            width:
              "100%",

            minWidth:
              0,

            height:
              fullHeight
                ? "100dvh"
                : undefined,

            minHeight:
              fullHeight
                ? "100dvh"
                : 0,

            display:
              "flex",

            flexDirection:
              "column",

            overflow,

            boxSizing:
              "border-box",

            background:
              "var(--ui-surface-canvas)",

            color:
              "var(--ui-text)",

            paddingTop:
              addSafeAreaOffset(
                topInset,
                "top",
                safeAreaEdges.top
              ),

            paddingRight:
              addSafeAreaOffset(
                undefined,
                "right",
                safeAreaEdges.right
              ),

            paddingBottom:
              addSafeAreaOffset(
                bottomInset,
                "bottom",
                safeAreaEdges.bottom
              ),

            paddingLeft:
              addSafeAreaOffset(
                undefined,
                "left",
                safeAreaEdges.left
              ),

            ...style,
          }}
        >
          {children}
        </Box>
      );
    }
  );

ScreenRoot.displayName =
  "Screen";

const ScreenHeader =
  React.forwardRef<
    HTMLElement,
    ScreenHeaderProps
  >(
    (
      {
        children,
        sticky = false,
        style,
        ...rest
      },
      ref
    ) => (
      <Box
        as="header"
        ref={ref}
        {...rest}
        style={{
          flexShrink:
            0,

          minWidth:
            0,

          boxSizing:
            "border-box",

          position:
            sticky
              ? "sticky"
              : undefined,

          top:
            sticky
              ? 0
              : undefined,

          zIndex:
            sticky
              ? 1
              : undefined,

          ...style,
        }}
      >
        {children}
      </Box>
    )
  );

ScreenHeader.displayName =
  "Screen.Header";

const ScreenBody =
  React.forwardRef<
    HTMLElement,
    ScreenBodyProps
  >(
    (
      {
        children,
        style,
        ...rest
      },
      ref
    ) => (
      <Box
        as="main"
        ref={ref}
        {...rest}
        style={{
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

          boxSizing:
            "border-box",

          ...style,
        }}
      >
        {children}
      </Box>
    )
  );

ScreenBody.displayName =
  "Screen.Body";

const ScreenFooter =
  React.forwardRef<
    HTMLElement,
    ScreenFooterProps
  >(
    (
      {
        children,
        sticky = false,
        style,
        ...rest
      },
      ref
    ) => (
      <Box
        as="footer"
        ref={ref}
        {...rest}
        style={{
          flexShrink:
            0,

          minWidth:
            0,

          boxSizing:
            "border-box",

          position:
            sticky
              ? "sticky"
              : undefined,

          bottom:
            sticky
              ? 0
              : undefined,

          zIndex:
            sticky
              ? 1
              : undefined,

          ...style,
        }}
      >
        {children}
      </Box>
    )
  );

ScreenFooter.displayName =
  "Screen.Footer";

export const Screen =
  Object.assign(
    ScreenRoot,
    {
      Header:
        ScreenHeader,

      Body:
        ScreenBody,

      Footer:
        ScreenFooter,
    }
  ) as ScreenComponent;

export {
  ScreenHeader,
  ScreenBody,
  ScreenFooter,
};
