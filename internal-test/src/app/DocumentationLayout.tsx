// internal-test/src/app/DocumentationLayout.tsx

import React from "react";

import {
  AdaptiveScaffold,
  Box,
  type AdaptiveScaffoldMobileNavigationPlacement,
  type AdaptiveScaffoldSideNavigationPlacement,
} from "zerina-ui";

import {
  COMPONENT_CATALOG,
} from "../catalog/catalog.registry";

import {
  DocumentationHeader,
} from "../documentation/DocumentationHeader";

import {
  ComponentNavigation,
} from "../navigation/ComponentNavigation";

import {
  ComponentNavigationMenu,
} from "../navigation/ComponentNavigationMenu";

import {
  useUIViewport,
} from "zerina-ui";
import { NavigationNode } from "zerina-ui/patterns/navigation";

// desktop start  → Tree izquierda
// desktop end    → Tree derecha
// tablet start   → Tree izquierda
// tablet end     → Tree derecha
// mobile top     → NavigationMenu arriba
// mobile bottom  → NavigationMenu abajo

const SCAFFOLD_ITEMS:
  NavigationNode[] =
  COMPONENT_CATALOG.map((entry) => ({
    id: entry.id,
    label: entry.title,
  }));


const DESKTOP_NAVIGATION_PLACEMENT:
  AdaptiveScaffoldSideNavigationPlacement =
  "end";

const TABLET_NAVIGATION_PLACEMENT:
  AdaptiveScaffoldSideNavigationPlacement =
  "start";

const MOBILE_NAVIGATION_PLACEMENT:
  AdaptiveScaffoldMobileNavigationPlacement =
  "top";


export interface DocumentationLayoutProps {
  children: React.ReactNode;

  value: string;

  onChange: (
    id: string
  ) => void;
}


export function DocumentationLayout({
  children,
  value,
  onChange,
}: DocumentationLayoutProps) {

  const viewport =
    useUIViewport();

  const treeNavigation = (
    <ComponentNavigation
      value={value}
      onChange={onChange}
    />
  );

  const menuNavigation = (
    <ComponentNavigationMenu
      value={value}
      onChange={onChange}
    />
  );


  return (
    <Box
      style={{
        width: "100%",
        minWidth: 0,

        minHeight: "100dvh",

        display: "flex",
        flexDirection: "column",

        padding:
          "max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left))",

        gap: "1rem",

        background:
          "var(--ui-bg)",

        color:
          "var(--ui-text)",

        boxSizing:
          "border-box",

        overflow: "visible",
      }}
    >
      <DocumentationHeader />

      <Box
        style={{
          flex: 1,

          width: "100%",
          minWidth: 0,
          minHeight: 0,

          overflow: "visible",

          border:
            "1px solid var(--ui-border)",

          borderRadius:
            "var(--ui-radius-xl)",

          background:
            "var(--ui-surface)",
        }}
      >
        <AdaptiveScaffold
          viewport="contained"

          items={SCAFFOLD_ITEMS}
          mode={
            viewport.mode
          }
          activeId={value}

          onActiveIdChange={(id) => {
            onChange(id);
          }}

          showAppBar={false}

          mobileNavigation="none"
          tabletNavigation="none"
          desktopNavigation="none"

          navigationSlots={{
            desktop: {
              content:
                treeNavigation,

              placement:
                DESKTOP_NAVIGATION_PLACEMENT,
            },

            tablet: {
              content:
                treeNavigation,

              placement:
                TABLET_NAVIGATION_PLACEMENT,
            },

            mobile: {
              content:
                menuNavigation,

              placement:
                MOBILE_NAVIGATION_PLACEMENT,
            },
          }}

          styles={{
            root: {
              width: "100%",
            },

            desktopNavigation: {
              padding: "0.75rem",
            },

            tabletNavigation: {
              padding: "0.75rem",
            },

            mobileNavigation: {
              width: "100%",
            },

            content: {
              minWidth: 0,
              minHeight: 0,
            },
          }}
        >
          {children}
        </AdaptiveScaffold>
      </Box>
    </Box>
  );
}


DocumentationLayout.displayName =
  "DocumentationLayout";