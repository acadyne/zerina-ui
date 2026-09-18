// internal-test/src/ThemeDebug.tsx

import {
  Card,
  CardBody,
  Box,
  Heading,
  Stack,
  ThemeSwitcher,
  UIThemeProvider,
  BUILT_IN_THEMES,
  createThemeDefinition,
  resolveThemeIcon,
} from "zerina-ui";

import type {
  ThemeIconRegistry,
} from "zerina-ui";

import {
  Waves,
  Sunset,
} from "lucide-react";


const themeIcons = {
  waves:
    Waves,

  sunset:
    Sunset,
} satisfies ThemeIconRegistry;


const sunsetTheme =
  createThemeDefinition({
    name:
      "sunset",

    source:
      "custom",

    metadata: {
      label:
        "Sunset",

      icon:
        "sunset",

      colorScheme:
        "dark",
    },

    tokens: {
      color: {
        primary:
          "#f97316",

        primaryHover:
          "#ea580c",

        primaryContrast:
          "#ffffff",
      },

      surface: {
        bg:
          "#1c1917",

        surface:
          "#292524",
      },

      text: {
        text:
          "#ffedd5",
      },
    },
  });


const oceanTheme =
  createThemeDefinition({
    name:
      "ocean",

    source:
      "custom",

    metadata: {
      label:
        "Ocean",

      icon:
        "waves",

      colorScheme:
        "light",
    },

    tokens: {
      color: {
        primary:
          "#0891b2",

        primaryHover:
          "#0e7490",

        primaryContrast:
          "#ffffff",
      },

      surface: {
        bg:
          "#ecfeff",

        surface:
          "#ffffff",

        surfaceHover:
          "rgba(8,145,178,0.08)",
      },

      text: {
        text:
          "#164e63",
      },
    },
  });


function IconPreview({
  name,
  icons,
}: {
  name:
    string;

  icons?:
    ThemeIconRegistry;
}) {
  const Icon =
    resolveThemeIcon(
      name,
      icons,
    );


  return (
    <Box
      style={{
        display:
          "flex",

        alignItems:
          "center",

        gap:
          "0.5rem",
      }}
    >
      <Icon
        size={20}
      />

      <Box>
        {name}
      </Box>
    </Box>
  );
}


export function ThemeDebug() {
  return (
    <Card>
      <CardBody>
        <Stack
          spacing="0.75rem"
        >
          <Heading
            size="sm"
          >
            Theme System
          </Heading>


          <Box
            style={{
              color:
                "var(--ui-text-muted)",

              fontSize:
                "var(--ui-font-size-sm)",

              lineHeight:
                1.5,
            }}
          >
            Validación del sistema de temas,
            metadata declarativa, registros locales
            de iconos y themes personalizados.
          </Box>


          <Box
            style={{
              padding:
                "0.75rem",

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-md)",

              background:
                "var(--ui-surface)",
            }}
          >
            <strong>
              Built-in icons
            </strong>


            <Stack
              spacing="0.4rem"
            >
              {BUILT_IN_THEMES.map(
                (
                  theme,
                ) => (
                  <IconPreview
                    key={
                      theme.name
                    }
                    name={
                      theme.metadata
                        ?.icon ??
                      "missing"
                    }
                  />
                ),
              )}
            </Stack>
          </Box>


          <Box
            style={{
              padding:
                "0.75rem",

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-md)",

              background:
                "var(--ui-surface)",
            }}
          >
            <strong>
              Local icon registry
            </strong>


            <Stack
              spacing="0.4rem"
            >
              <IconPreview
                name="waves"
                icons={
                  themeIcons
                }
              />

              <IconPreview
                name="sunset"
                icons={
                  themeIcons
                }
              />

              <IconPreview
                name="unknown-icon"
                icons={
                  themeIcons
                }
              />
            </Stack>
          </Box>


          <Box
            style={{
              padding:
                "0.75rem",

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-md)",

              background:
                "var(--ui-surface)",
            }}
          >
            <strong>
              Custom Theme Provider
            </strong>


            <Box
              style={{
                marginTop:
                  "0.5rem",
              }}
            >
              <UIThemeProvider
                themes={[
                  ...BUILT_IN_THEMES,
                  oceanTheme,
                  sunsetTheme,
                ]}
              >
                <ThemeSwitcher
                  icons={
                    themeIcons
                  }
                />
              </UIThemeProvider>
            </Box>
          </Box>


          <Box
            style={{
              padding:
                "0.75rem",

              border:
                "1px solid var(--ui-border)",

              borderRadius:
                "var(--ui-radius-md)",

              background:
                "var(--ui-surface)",
            }}
          >
            <strong>
              Manual resolver
            </strong>


            <Stack
              spacing="0.4rem"
            >
              <IconPreview
                name="moon"
              />

              <IconPreview
                name="sparkles"
              />

              <IconPreview
                name="waves"
                icons={
                  themeIcons
                }
              />

              <IconPreview
                name="not-found"
              />
            </Stack>
          </Box>


          <Box
            style={{
              padding:
                "0.75rem",

              borderRadius:
                "var(--ui-radius-md)",

              border:
                "1px solid var(--ui-border)",

              background:
                "var(--ui-surface)",

              color:
                "var(--ui-text-muted)",

              fontSize:
                "var(--ui-font-size-sm)",
            }}
          >
            Checklist:

            <ul>
              <li>
                Built-in themes muestran iconos diferentes.
              </li>

              <li>
                Los registros de iconos son locales.
              </li>

              <li>
                Custom icon waves resuelve correctamente.
              </li>

              <li>
                Iconos desconocidos usan fallback.
              </li>

              <li>
                ThemeSwitcher recibe su registro mediante props.
              </li>

              <li>
                ThemeDefinition conserva metadata.icon.
              </li>
            </ul>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}


ThemeDebug.displayName =
  "ThemeDebug";