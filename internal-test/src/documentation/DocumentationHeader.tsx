// internal-test/src/documentation/DocumentationHeader.tsx

import {
  Box,
  Heading,
  Stack,
  ThemeSwitcher,
} from "zerina-ui";

import {
  DocumentationViewportSwitcher,
} from "./DocumentationViewportSwitcher";


export function DocumentationHeader() {
  return (
    <Box
      style={{
        marginBottom:
          "1rem",

        padding:
          "1rem",

        borderRadius:
          "var(--ui-radius-xl)",

        border:
          "1px solid var(--ui-border)",

        background:
          "var(--ui-surface)",

        boxShadow:
          "var(--ui-shadow-sm)",
      }}
    >
      <Stack spacing="0.75rem">

        <Box
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap:
              "1rem",

            flexWrap:
              "wrap",
          }}
        >

          <Box>
            <Heading>
              Zerina UI Documentation
            </Heading>


            <Box
              style={{
                marginTop:
                  "0.35rem",

                color:
                  "var(--ui-text-muted)",

                fontSize:
                  "var(--ui-font-size-sm)",
              }}
            >
              Catálogo interactivo de componentes,
              patrones y sistemas internos.
            </Box>
          </Box>


          <Stack
            direction="row"

            spacing="0.5rem"

            align="center"

            wrap="wrap"
          >
            <DocumentationViewportSwitcher />

            <ThemeSwitcher />
          </Stack>

        </Box>

      </Stack>
    </Box>
  );
}


DocumentationHeader.displayName =
  "DocumentationHeader";