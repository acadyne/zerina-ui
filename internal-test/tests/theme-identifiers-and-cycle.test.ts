import {
    afterEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    ThemeSystem,
    validateThemeDefinition,
} from "../../src/theme";


const STORAGE_KEY =
    "theme-identifiers-cycle-test";


function createRootTheme(
    name: string,
    colorScheme:
        "light" | "dark" =
        "light",
) {
    return {
        name,

        source:
            "custom" as const,

        metadata: {
            colorScheme,
        },
    };
}


function expectErrorMessage(
    action:
        () => void,
    expectedMessage:
        string,
): void {
    let thrown:
        unknown;


    try {
        action();
    } catch (error) {
        thrown =
            error;
    }


    expect(
        thrown,
    ).toBeInstanceOf(
        Error,
    );


    expect(
        (
            thrown as Error
        ).message,
    ).toBe(
        expectedMessage,
    );
}


function getDiagnostics(
    definition:
        unknown,
) {
    return validateThemeDefinition(
        definition,
    ).diagnostics;
}


afterEach(() => {
    localStorage.removeItem(
        STORAGE_KEY,
    );
});


describe(
    "theme identifiers",
    () => {
        it(
            'rejects name: ""',
            () => {
                const diagnostics =
                    getDiagnostics({
                        name:
                            "",

                        source:
                            "custom",

                        metadata: {
                            colorScheme:
                                "light",
                        },
                    });


                expect(
                    diagnostics,
                ).toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.string.required",

                        path:
                            "name",
                    }),
                );
            },
        );


        it(
            "rejects a name containing only whitespace",
            () => {
                const diagnostics =
                    getDiagnostics({
                        name:
                            "   ",

                        source:
                            "custom",

                        metadata: {
                            colorScheme:
                                "light",
                        },
                    });


                expect(
                    diagnostics,
                ).toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.string.required",

                        path:
                            "name",
                    }),
                );
            },
        );


        it.each([
            " light ",
            "light ",
            " light",
        ])(
            'rejects name "%s" without normalizing it',
            (
                name,
            ) => {
                const result =
                    validateThemeDefinition({
                        name,

                        source:
                            "custom",

                        metadata: {
                            colorScheme:
                                "light",
                        },
                    });


                expect(
                    result.valid,
                ).toBe(
                    false,
                );


                expect(
                    result.diagnostics,
                ).toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.identifier.whitespace",

                        path:
                            "name",

                        message:
                            "name must not contain leading or trailing whitespace.",
                    }),
                );
            },
        );


        it(
            "accepts a name with internal whitespace",
            () => {
                const result =
                    validateThemeDefinition({
                        name:
                            "high contrast",

                        source:
                            "custom",

                        metadata: {
                            colorScheme:
                                "dark",
                        },
                    });


                expect(
                    result.valid,
                ).toBe(
                    true,
                );


                if (!result.valid) {
                    throw new Error(
                        "Expected theme definition to be valid",
                    );
                }


                expect(
                    result.value.name,
                ).toBe(
                    "high contrast",
                );
            },
        );


        it(
            'rejects extends: "" when declared',
            () => {
                const diagnostics =
                    getDiagnostics({
                        name:
                            "empty-parent-child",

                        source:
                            "custom",

                        extends:
                            "",
                    });


                expect(
                    diagnostics,
                ).toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.string.required",

                        path:
                            "extends",
                    }),
                );


                expect(
                    diagnostics,
                ).not.toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.metadata.color_scheme.required",
                    }),
                );
            },
        );


        it(
            "rejects extends containing only whitespace",
            () => {
                const diagnostics =
                    getDiagnostics({
                        name:
                            "whitespace-parent-child",

                        source:
                            "custom",

                        extends:
                            "   ",
                    });


                expect(
                    diagnostics,
                ).toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.string.required",

                        path:
                            "extends",
                    }),
                );


                expect(
                    diagnostics,
                ).not.toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.metadata.color_scheme.required",
                    }),
                );
            },
        );


        it(
            "rejects leading and trailing whitespace in extends without normalizing it",
            () => {
                const diagnostics =
                    getDiagnostics({
                        name:
                            "invalid-parent-child",

                        source:
                            "custom",

                        extends:
                            " parent ",
                    });


                expect(
                    diagnostics,
                ).toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.identifier.whitespace",

                        path:
                            "extends",

                        message:
                            "extends must not contain leading or trailing whitespace.",
                    }),
                );


                expect(
                    diagnostics,
                ).not.toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.metadata.color_scheme.required",
                    }),
                );
            },
        );


        it(
            'does not treat "light" and " light " as the same theme',
            () => {
                const validResult =
                    validateThemeDefinition(
                        createRootTheme(
                            "light",
                        ),
                    );


                const invalidResult =
                    validateThemeDefinition(
                        createRootTheme(
                            " light ",
                        ),
                    );


                expect(
                    validResult.valid,
                ).toBe(
                    true,
                );


                expect(
                    invalidResult.valid,
                ).toBe(
                    false,
                );


                expect(
                    invalidResult.diagnostics,
                ).toContainEqual(
                    expect.objectContaining({
                        code:
                            "theme.identifier.whitespace",

                        path:
                            "name",
                    }),
                );


                expectErrorMessage(
                    () => {
                        new ThemeSystem({
                            persist:
                                false,

                            themes: [
                                createRootTheme(
                                    "light",
                                ),

                                createRootTheme(
                                    " light ",
                                ),
                            ],
                        });
                    },

                    "name must not contain leading or trailing whitespace.",
                );
            },
        );


        it(
            'rejects initialTheme: " light " as unregistered',
            () => {
                expectErrorMessage(
                    () => {
                        new ThemeSystem({
                            persist:
                                false,

                            initialTheme:
                                " light ",

                            themes: [
                                createRootTheme(
                                    "light",
                                ),
                            ],
                        });
                    },

                    'Initial theme " light " is not registered',
                );
            },
        );


        it(
            'rejects setTheme(" light ") as unregistered',
            () => {
                const system =
                    new ThemeSystem({
                        persist:
                            false,

                        themes: [
                            createRootTheme(
                                "light",
                            ),
                        ],
                    });


                expectErrorMessage(
                    () => {
                        system.setTheme(
                            " light ",
                        );
                    },

                    'Theme " light " is not registered',
                );


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "light",
                );
            },
        );


        it(
            'rejects resolveTheme(" light ") as nonexistent',
            () => {
                const system =
                    new ThemeSystem({
                        persist:
                            false,

                        themes: [
                            createRootTheme(
                                "light",
                            ),
                        ],
                    });


                expectErrorMessage(
                    () => {
                        system.resolveTheme(
                            " light ",
                        );
                    },

                    'Theme " light " does not exist',
                );
            },
        );


        it(
            "ignores a persisted identifier containing whitespace",
            () => {
                localStorage.setItem(
                    STORAGE_KEY,
                    " dark ",
                );


                const system =
                    new ThemeSystem({
                        persist:
                            true,

                        storageKey:
                            STORAGE_KEY,

                        themes: [
                            createRootTheme(
                                "light",
                            ),

                            createRootTheme(
                                "dark",
                                "dark",
                            ),
                        ],
                    });


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "light",
                );


                expect(
                    localStorage.getItem(
                        STORAGE_KEY,
                    ),
                ).toBe(
                    " dark ",
                );
            },
        );
    },
);


describe(
    "ThemeSystem cycle order",
    () => {
        it(
            "cycles themes using their initial array order",
            () => {
                const system =
                    new ThemeSystem({
                        persist:
                            false,

                        initialTheme:
                            "first",

                        themes: [
                            createRootTheme(
                                "first",
                            ),

                            createRootTheme(
                                "second",
                            ),

                            createRootTheme(
                                "third",
                            ),
                        ],
                    });


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "first",
                );


                system.cycleTheme();


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "second",
                );


                system.cycleTheme();


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "third",
                );
            },
        );


        it(
            "appends newly registered themes to the end of the cycle",
            () => {
                const system =
                    new ThemeSystem({
                        persist:
                            false,

                        initialTheme:
                            "first",

                        themes: [
                            createRootTheme(
                                "first",
                            ),

                            createRootTheme(
                                "second",
                            ),
                        ],
                    });


                system.registerTheme(
                    createRootTheme(
                        "third",
                    ),
                );


                expect(
                    system
                        .getThemes()
                        .map(
                            (
                                theme,
                            ) =>
                                theme.name,
                        ),
                ).toEqual([
                    "first",
                    "second",
                    "third",
                ]);


                system.cycleTheme();
                system.cycleTheme();


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "third",
                );
            },
        );


        it(
            "preserves the original cycle position when replacing a theme",
            () => {
                const system =
                    new ThemeSystem({
                        persist:
                            false,

                        initialTheme:
                            "first",

                        themes: [
                            createRootTheme(
                                "first",
                            ),

                            createRootTheme(
                                "second",
                            ),

                            createRootTheme(
                                "third",
                            ),
                        ],
                    });


                system.registerTheme(
                    {
                        ...createRootTheme(
                            "second",
                            "dark",
                        ),

                        metadata: {
                            label:
                                "Replacement",

                            colorScheme:
                                "dark",
                        },
                    },
                    {
                        replace:
                            true,
                    },
                );


                expect(
                    system
                        .getThemes()
                        .map(
                            (
                                theme,
                            ) =>
                                theme.name,
                        ),
                ).toEqual([
                    "first",
                    "second",
                    "third",
                ]);


                system.cycleTheme();


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "second",
                );


                expect(
                    system
                        .getActiveTheme()
                        .metadata
                        ?.label,
                ).toBe(
                    "Replacement",
                );
            },
        );


        it(
            "wraps from the last theme to the first",
            () => {
                const system =
                    new ThemeSystem({
                        persist:
                            false,

                        initialTheme:
                            "third",

                        themes: [
                            createRootTheme(
                                "first",
                            ),

                            createRootTheme(
                                "second",
                            ),

                            createRootTheme(
                                "third",
                            ),
                        ],
                    });


                system.cycleTheme();


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "first",
                );
            },
        );


        it(
            "persists the theme selected by cycleTheme",
            () => {
                const system =
                    new ThemeSystem({
                        persist:
                            true,

                        storageKey:
                            STORAGE_KEY,

                        initialTheme:
                            "first",

                        themes: [
                            createRootTheme(
                                "first",
                            ),

                            createRootTheme(
                                "second",
                            ),
                        ],
                    });


                expect(
                    localStorage.getItem(
                        STORAGE_KEY,
                    ),
                ).toBeNull();


                system.cycleTheme();


                expect(
                    system
                        .getActiveTheme()
                        .name,
                ).toBe(
                    "second",
                );


                expect(
                    localStorage.getItem(
                        STORAGE_KEY,
                    ),
                ).toBe(
                    "second",
                );
            },
        );
    },
);