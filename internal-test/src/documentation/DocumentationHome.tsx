// internal-test/src/documentation/DocumentationHome.tsx

import React from "react";

import {
  DocumentationLayout,
} from "../app/DocumentationLayout";

import {
  COMPONENT_CATALOG,
} from "../catalog/catalog.registry";

import {
  DocumentationExplorer,
} from "./DocumentationExplorer";


export function DocumentationHome() {
  const [
    selectedId,
    setSelectedId,
  ] = React.useState(
    COMPONENT_CATALOG[0]?.id ?? ""
  );


  return (
    <DocumentationLayout
      value={selectedId}
      onChange={setSelectedId}
    >
      <DocumentationExplorer
        selectedId={selectedId}
      />
    </DocumentationLayout>
  );
}


DocumentationHome.displayName =
  "DocumentationHome";