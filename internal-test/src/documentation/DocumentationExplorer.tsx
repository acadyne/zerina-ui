// internal-test/src/documentation/DocumentationExplorer.tsx

import {
  Box,
} from "zerina-ui";

import {
  COMPONENT_CATALOG,
} from "../catalog/catalog.registry";

import {
  ComponentPage,
} from "./ComponentPage";


export interface DocumentationExplorerProps {
  selectedId?: string;
}


export function DocumentationExplorer({
  selectedId,
}: DocumentationExplorerProps) {
  const selectedEntry =
    COMPONENT_CATALOG.find(
      (entry) =>
        entry.id === selectedId
    );


  return (
    <Box
      style={{
        width: "100%",
        minWidth: 0,
        minHeight: 0,

        padding: "1rem",

        boxSizing: "border-box",

        overflow: "auto",
      }}
    >
      {
        selectedEntry ? (
          <ComponentPage
            entry={selectedEntry}
          />
        ) : null
      }
    </Box>
  );
}


DocumentationExplorer.displayName =
  "DocumentationExplorer";