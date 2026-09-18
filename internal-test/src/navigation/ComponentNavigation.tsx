// internal-test/src/navigation/ComponentNavigation.tsx

import React from "react";

import {
  Box,
  Tree,
  type TreeNodeId,
} from "zerina-ui";

import {
  COMPONENT_CATALOG,
} from "../catalog/catalog.registry";


interface ComponentTreeNode {
  id: string;

  label: string;
}


const TREE_NODES: ComponentTreeNode[] =
  COMPONENT_CATALOG.map(
    (entry) => ({
      id: entry.id,
      label: entry.title,
    })
  );


export interface ComponentNavigationProps {
  value?: string;

  onChange?: (
    id: string
  ) => void;
}


export function ComponentNavigation({
  value,
  onChange,
}: ComponentNavigationProps) {
  const selectedIds =
    React.useMemo(
      () =>
        value
          ? new Set<TreeNodeId>([
              value,
            ])
          : new Set<TreeNodeId>(),
      [value]
    );


  return (
    <Box
      style={{
        padding: "0.75rem",

        borderRadius:
          "var(--ui-radius-xl)",

        border:
          "1px solid var(--ui-border)",

        background:
          "var(--ui-surface)",
      }}
    >
      <Tree<ComponentTreeNode>
        nodes={TREE_NODES}

        getNodeId={(node) =>
          node.id
        }

        getNodeLabel={(node) =>
          node.label
        }

        isNodeBranch={() =>
          false
        }

        selectedIds={selectedIds}

        selectionMode="single"

        onSelectedIdsChange={(ids) => {
          const next =
            Array.from(ids)[0];

          if (next !== undefined) {
            onChange?.(
              String(next)
            );
          }
        }}
      />
    </Box>
  );
}