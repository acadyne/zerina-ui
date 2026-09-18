// internal-test/src/ThemeOwnershipDebug.tsx

import React from "react";

import {
  createThemeDefinition,
  UIThemeProvider,
  useUITheme,
} from "zerina-ui";


function assert(
  condition: unknown,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}


const themeA =
  createThemeDefinition({
    name: "ownership-a",
    source: "custom",

    tokens: {
      color: {
        primary:
          "#111111",
      },
    },
  });


const themeB =
  createThemeDefinition({
    name: "ownership-b",
    source: "custom",

    tokens: {
      color: {
        primary:
          "#222222",
      },
    },
  });


function ThemeActions() {
  const {
    setTheme,
  } =
    useUITheme();


  React.useEffect(
    () => {
      const root =
        document.documentElement;


      assert(
        root.dataset.uiTheme ===
          "ownership-a",
        "Initial theme was not applied"
      );


      assert(
        root.style.getPropertyValue(
          "--ui-primary"
        ) ===
          "#111111",
        "Initial CSS variable was not applied"
      );


      setTheme(
        "ownership-b"
      );


      setTimeout(
        () => {
          assert(
            root.style.getPropertyValue(
              "--ui-primary"
            ) ===
              "#222222",
            "Theme change did not update CSS variable"
          );


          root.style.setProperty(
            "--ui-primary",
            "external-change"
          );


          console.log(
            "Theme ownership mounted checks passed."
          );
        },
        50
      );
    },
    [
      setTheme,
    ]
  );


  return null;
}


export function ThemeOwnershipDebug() {
  const [
    mounted,
    setMounted,
  ] =
    React.useState(
      true
    );


  React.useEffect(
    () => {
      const root =
        document.documentElement;


      if (!mounted) {
        assert(
          root.style.getPropertyValue(
            "--ui-primary"
          ) ===
            "external-change",
          "Cleanup overwrote external CSS changes"
        );


        console.log(
          "Theme ownership cleanup checks passed."
        );
      }
    },
    [
      mounted,
    ]
  );


  React.useEffect(
    () => {
      const timer =
        window.setTimeout(
          () => {
            setMounted(
              false
            );
          },
          200
        );


      return () => {
        window.clearTimeout(
          timer
        );
      };
    },
    []
  );


  if (!mounted) {
    return null;
  }


  return (
    <UIThemeProvider
      persist={false}
      initialTheme="ownership-a"
      themes={[
        themeA,
        themeB,
      ]}
    >
      <ThemeActions />
    </UIThemeProvider>
  );
}