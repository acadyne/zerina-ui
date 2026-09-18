import React from "react";

import {
    createRoot,
    type Root,
} from "react-dom/client";

import {
    UIThemeProvider,
    createThemeDefinition,
    useUITheme,
} from "zerina-ui";

import type {
    ThemeName,
} from "zerina-ui";


const themeDark =
    createThemeDefinition({
        name:
            "browser-dark",

        source:
            "custom",

        metadata: {
            label:
                "Browser Dark",

            colorScheme:
                "dark",
        },

        tokens: {
            color: {
                primary:
                    "#111111",

                primaryHover:
                    "#191919",

                primaryContrast:
                    "#ffffff",

                danger:
                    "#991b1b",

                dangerHover:
                    "#7f1d1d",

                dangerContrast:
                    "#ffffff",
            },
        },
    });


const themeNeutral =
    createThemeDefinition({
        name:
            "browser-neutral",

        source:
            "custom",

        extends:
            "browser-dark",

        metadata: {
            label:
                "Browser Neutral",

            colorScheme:
                "light",
        },

        tokens: {
            color: {
                primary:
                    "#222222",

                primaryHover:
                    "#292929",

                primaryContrast:
                    "#ffffff",
            },
        },
    });


const themeLight =
    createThemeDefinition({
        name:
            "browser-light",

        source:
            "custom",

        metadata: {
            label:
                "Browser Light",

            colorScheme:
                "light",
        },

        tokens: {
            color: {
                primary:
                    "#eeeeee",

                primaryHover:
                    "#dddddd",

                primaryContrast:
                    "#111111",

                danger:
                    "#e11d48",

                dangerHover:
                    "#be123c",

                dangerContrast:
                    "#ffffff",
            },
        },
    });


const themes = [
    themeDark,
    themeNeutral,
    themeLight,
] as const;


type SetTheme =
    (name: ThemeName) => void;


type MountOptions = {
    strictMode?: boolean;

    initialTheme?:
    ThemeName;
};


type ThemeOwnershipHarness = {
    mount(
        options?: MountOptions
    ): Promise<void>;

    setTheme(
        name: ThemeName
    ): Promise<void>;

    unmount(): Promise<void>;
};


declare global {
    interface Window {
        themeOwnershipHarness:
        ThemeOwnershipHarness;
    }
}


let reactRoot:
    Root | null = null;


let currentSetTheme:
    SetTheme | null = null;


function Controller() {
    const {
        setTheme,
    } = useUITheme();


    React.useLayoutEffect(() => {
        currentSetTheme =
            setTheme;


        return () => {
            currentSetTheme =
                null;
        };
    }, [
        setTheme,
    ]);


    return (
        <div
            data-testid="theme-controller"
        />
    );
}


function createProvider(
    initialTheme: ThemeName
) {
    return (
        <UIThemeProvider
            persist={false}
            initialTheme={
                initialTheme
            }
            themes={themes}
        >
            <Controller />
        </UIThemeProvider>
    );
}


async function nextFrame():
    Promise<void> {
    await new Promise<void>(
        (resolve) => {
            requestAnimationFrame(
                () => resolve()
            );
        }
    );
}


window.themeOwnershipHarness = {
    async mount(
        options = {}
    ) {
        if (reactRoot) {
            throw new Error(
                "Harness is already mounted."
            );
        }


        const container =
            document.getElementById(
                "root"
            );


        if (!container) {
            throw new Error(
                "Harness root was not found."
            );
        }


        reactRoot =
            createRoot(
                container
            );


        const provider =
            createProvider(
                options.initialTheme ??
                "browser-dark"
            );


        reactRoot.render(
            options.strictMode
                ? (
                    <React.StrictMode>
                        {provider}
                    </React.StrictMode>
                )
                : provider
        );


        await nextFrame();
        await nextFrame();
    },


    async setTheme(
        name
    ) {
        if (!currentSetTheme) {
            throw new Error(
                "Theme controller is not mounted."
            );
        }


        currentSetTheme(
            name
        );


        await nextFrame();
        await nextFrame();
    },


    async unmount() {
        if (!reactRoot) {
            return;
        }


        reactRoot.unmount();

        reactRoot =
            null;

        currentSetTheme =
            null;


        await nextFrame();
    },
};