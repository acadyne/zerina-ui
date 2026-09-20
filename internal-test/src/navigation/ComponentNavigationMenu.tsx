// internal-test/src/navigation/ComponentNavigationMenu.tsx

import {
  Box,
  NavigationMenu,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type NavigationMenuItemId,
} from "zerina-ui";

import {
  COMPONENT_CATALOG,
} from "../catalog/catalog.registry";


interface ComponentNavigationMenuItem {
  id: string;
  label: string;
}


export type ComponentNavigationMenuOverflowBehavior =
  | "truncate"
  | "scroll";


const NAVIGATION_ITEMS:
  readonly ComponentNavigationMenuItem[] =
  COMPONENT_CATALOG.map((entry) => ({
    id: entry.id,
    label: entry.title,
  }));


export interface ComponentNavigationMenuProps {
  value?: string;

  onChange?: (
    id: string
  ) => void;

  overflowBehavior?:
    ComponentNavigationMenuOverflowBehavior;

  showTooltip?: boolean;
}


// Modo scroll:
// overflowBehavior="scroll"

// Sin tooltip:
// showTooltip={false}


export function ComponentNavigationMenu({
  value,
  onChange,
  overflowBehavior = "scroll",
  showTooltip = false,
}: ComponentNavigationMenuProps) {
  const scrollable =
    overflowBehavior === "scroll";


  const renderLabel = (
    item: ComponentNavigationMenuItem
  ) => {
    const label = (
      <span
        style={{
          display: "block",

          width: "100%",
          minWidth: 0,

          overflow: "hidden",

          textOverflow:
            scrollable
              ? undefined
              : "ellipsis",

          whiteSpace: "nowrap",
        }}
      >
        {item.label}
      </span>
    );


    if (!showTooltip) {
      return label;
    }


    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {label}
        </TooltipTrigger>

        <TooltipContent>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };


  return (
    <Box
      style={{
        width: "100%",
        minWidth: 0,

        padding: "0.5rem",

        boxSizing: "border-box",

        borderTop:
          "1px solid var(--ui-border)",

        background:
          "var(--ui-surface)",
      }}
    >
      <NavigationMenu<ComponentNavigationMenuItem>
        items={NAVIGATION_ITEMS}

        getItemId={(item) =>
          item.id
        }

        getItemLabel={(item) =>
          item.label
        }

        getItemChildren={() =>
          undefined
        }

        isItemBranch={() =>
          false
        }

        orientation="horizontal"

        semantics="menubar"

        activeId={
          value as NavigationMenuItemId | undefined
        }

        onItemSelect={({
          itemId,
        }) => {
          onChange?.(
            String(itemId)
          );
        }}

        renderItemLabel={({ item }) =>
          renderLabel(item)
        }

        styles={{
          root: {
            width: "100%",
            minWidth: 0,
          },

          list: {
            width: "100%",
            minWidth: 0,

            display: "flex",

            flexWrap: "nowrap",

            overflowX:
              scrollable
                ? "auto"
                : "hidden",

            overflowY: "hidden",

            gap: "0.25rem",

            padding: "0.25rem",

            borderRadius:
              "var(--ui-radius-lg)",

            background:
              "var(--ui-surface-container)",
          },

          item: {
            minWidth: 0,

            flex:
              scrollable
                ? "0 0 auto"
                : "1 1 0",
          },

          trigger: {
            width:
              scrollable
                ? "auto"
                : "100%",

            minWidth: 0,

            maxWidth:
              scrollable
                ? "10rem"
                : undefined,

            overflow: "hidden",
          },

          triggerContent: {
            width: "100%",
            minWidth: 0,
          },

          label: {
            width: "100%",
            minWidth: 0,

            overflow: "hidden",

            textOverflow:
              scrollable
                ? undefined
                : "ellipsis",

            whiteSpace: "nowrap",
          },
        }}

        slotProps={{
          root: {
            "aria-label":
              "Navegación de componentes",
          },
        }}
      />
    </Box>
  );
}


ComponentNavigationMenu.displayName =
  "ComponentNavigationMenu";