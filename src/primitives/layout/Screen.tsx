// src/primitives/layout/Screen.tsx
import React from "react";
import { Box, type BoxProps } from "./Box";
import { ScrollArea, type ScrollAreaProps } from "./ScrollArea";

type SafeAreaEdges = {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
};

export type ScreenInset = number | string;

export interface ScreenProps extends BoxProps<"div"> {
    children?: React.ReactNode;

    /**
     * Si está activo, el Screen ocupa todo el viewport dinámico.
     */
    fullHeight?: boolean;

    /**
     * Aplica padding de safe-area usando las variables globales de Zerina UI.
     */
    safeArea?: boolean | SafeAreaEdges;

    /**
     * Espacio reservado arriba.
     *
     * Útil para headers externos o status bars custom.
     */
    topInset?: ScreenInset;

    /**
     * Espacio reservado abajo.
     *
     * Útil para bottom navigation, tab bars o barras nativas.
     */
    bottomInset?: ScreenInset;

    /**
     * Controla el overflow del root.
     *
     * En pantallas app-first normalmente debe ser hidden.
     */
    overflow?: React.CSSProperties["overflow"];
}

export interface ScreenHeaderProps extends BoxProps<"header"> {
    children?: React.ReactNode;
    sticky?: boolean;
}

export interface ScreenBodyProps extends BoxProps<"main"> {
    children?: React.ReactNode;
}

export interface ScreenFooterProps extends BoxProps<"footer"> {
    children?: React.ReactNode;
    sticky?: boolean;
}

export interface ScreenScrollProps extends ScrollAreaProps {
    children?: React.ReactNode;
}

type ScreenComponent = React.ForwardRefExoticComponent<
    ScreenProps & React.RefAttributes<HTMLDivElement>
> & {
    Header: React.ForwardRefExoticComponent<
        ScreenHeaderProps & React.RefAttributes<HTMLElement>
    >;
    Body: React.ForwardRefExoticComponent<
        ScreenBodyProps & React.RefAttributes<HTMLElement>
    >;
    Footer: React.ForwardRefExoticComponent<
        ScreenFooterProps & React.RefAttributes<HTMLElement>
    >;
    Scroll: React.ForwardRefExoticComponent<
        ScreenScrollProps & React.RefAttributes<HTMLDivElement>
    >;
};

function toCssSize(value: ScreenInset | undefined): string | number | undefined {
    if (value === undefined) return undefined;
    if (typeof value === "number") return `${value}px`;
    return value;
}

function resolveSafeAreaEdges(
    safeArea: ScreenProps["safeArea"]
): SafeAreaEdges {
    if (!safeArea) {
        return {
            top: false,
            right: false,
            bottom: false,
            left: false,
        };
    }

    if (safeArea === true) {
        return {
            top: true,
            right: true,
            bottom: true,
            left: true,
        };
    }

    return {
        top: safeArea.top ?? false,
        right: safeArea.right ?? false,
        bottom: safeArea.bottom ?? false,
        left: safeArea.left ?? false,
    };
}

function getSafeAreaPadding(edges: SafeAreaEdges): React.CSSProperties {
    return {
        paddingTop: edges.top ? "var(--safe-top-offset)" : undefined,
        paddingRight: edges.right ? "var(--safe-right-offset)" : undefined,
        paddingBottom: edges.bottom ? "var(--safe-bottom-offset)" : undefined,
        paddingLeft: edges.left ? "var(--safe-left-offset)" : undefined,
    };
}

const ScreenRoot = React.forwardRef<HTMLDivElement, ScreenProps>(
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
        const safeAreaEdges = resolveSafeAreaEdges(safeArea);

        return (
            <Box
                ref={ref}
                {...rest}
                style={{
                    position: "relative",
                    width: "100%",
                    minWidth: 0,
                    height: fullHeight ? "100dvh" : undefined,
                    minHeight: fullHeight ? "100dvh" : 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow,
                    boxSizing: "border-box",
                    background: "var(--ui-bg)",
                    color: "var(--ui-text)",
                    paddingTop: toCssSize(topInset),
                    paddingBottom: toCssSize(bottomInset),
                    ...getSafeAreaPadding(safeAreaEdges),
                    ...style,
                }}
            >
                {children}
            </Box>
        );
    }
);

ScreenRoot.displayName = "Screen";

const ScreenHeader = React.forwardRef<HTMLElement, ScreenHeaderProps>(
    ({ children, sticky = false, style, ...rest }, ref) => {
        return (
            <Box
                as="header"
                ref={ref}
                {...rest}
                style={{
                    flexShrink: 0,
                    minWidth: 0,
                    boxSizing: "border-box",
                    position: sticky ? "sticky" : undefined,
                    top: sticky ? 0 : undefined,
                    zIndex: sticky ? 1 : undefined,
                    ...style,
                }}
            >
                {children}
            </Box>
        );
    }
);

ScreenHeader.displayName = "Screen.Header";

const ScreenBody = React.forwardRef<HTMLElement, ScreenBodyProps>(
    ({ children, style, ...rest }, ref) => {
        return (
            <Box
                as="main"
                ref={ref}
                {...rest}
                style={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    overflow: "hidden",
                    boxSizing: "border-box",
                    ...style,
                }}
            >
                {children}
            </Box>
        );
    }
);

ScreenBody.displayName = "Screen.Body";

const ScreenFooter = React.forwardRef<HTMLElement, ScreenFooterProps>(
    ({ children, sticky = false, style, ...rest }, ref) => {
        return (
            <Box
                as="footer"
                ref={ref}
                {...rest}
                style={{
                    flexShrink: 0,
                    minWidth: 0,
                    boxSizing: "border-box",
                    position: sticky ? "sticky" : undefined,
                    bottom: sticky ? 0 : undefined,
                    zIndex: sticky ? 1 : undefined,
                    ...style,
                }}
            >
                {children}
            </Box>
        );
    }
);

ScreenFooter.displayName = "Screen.Footer";

const ScreenScroll = React.forwardRef<HTMLDivElement, ScreenScrollProps>(
    ({ children, style, ...rest }, ref) => {
        return (
            <ScrollArea
                ref={ref}
                axis="y"
                contain
                momentum
                {...rest}
                style={{
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                    minHeight: 0,
                    ...style,
                }}
            >
                {children}
            </ScrollArea>
        );
    }
);

ScreenScroll.displayName = "Screen.Scroll";

export const Screen = Object.assign(ScreenRoot, {
    Header: ScreenHeader,
    Body: ScreenBody,
    Footer: ScreenFooter,
    Scroll: ScreenScroll,
}) as ScreenComponent;

export {
    ScreenHeader,
    ScreenBody,
    ScreenFooter,
    ScreenScroll,
};