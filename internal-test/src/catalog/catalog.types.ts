// internal-test/src/catalog/catalog.types.ts

import type React from "react";


export type CatalogCategory =
  | "core"
  | "components"
  | "patterns"
  | "primitives";


export interface CatalogEntry {
  id: string;

  title: string;

  category: CatalogCategory;

  description: string;

  component: React.ComponentType;
}