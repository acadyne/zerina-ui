// internal-test/src/documentation/ComponentPage.tsx

import {
  Box,
  Heading,
  Stack,
} from "zerina-ui";

import type {
  CatalogEntry,
} from "../catalog/catalog.types";


export interface ComponentPageProps {
  entry: CatalogEntry;
}


export function ComponentPage({
  entry,
}: ComponentPageProps) {
  const Example =
    entry.component;


  return (
    <Stack spacing="1rem">
      <Box
        style={{
          padding: "1rem",
          borderRadius:
            "var(--ui-radius-xl)",
          border:
            "1px solid var(--ui-border)",
          background:
            "var(--ui-surface)",
        }}
      >
        <Heading size="sm">
          {entry.title}
        </Heading>

        <Box
          style={{
            marginTop: "0.5rem",
            color:
              "var(--ui-text-muted)",
          }}
        >
          {entry.description}
        </Box>
      </Box>


      <Box>
        <Example />
      </Box>
    </Stack>
  );
}