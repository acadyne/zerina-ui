// src/patterns/app-shell/AppShell.tsx

import React from "react";

import {
  cssSize,
  resolveSlot,
} from "../../helpers/css";

import { Box } from "../../primitives/layout";

import type {
  AppShellCommonProps,
  AppShellSlot,
} from "./AppShell.types";

import type {
  NavigationLinkMeta,
  NavigationNode,
} from "../navigation";

import { useAppShellState } from "./useAppShellState";

import { AppShellHeader } from "./AppShellHeader";
import { AppShellSidebar } from "./AppShellSidebar";
import { AppShellMobileBar } from "./AppShellMobileBar";
import { AppShellContent } from "./AppShellContent";


export interface AppShellProps
  extends AppShellCommonProps {

  children?: React.ReactNode;


  /**
   * Se dispara cuando un nodo navegable
   * es seleccionado.
   *
   * AppShell no conoce routers.
   *
   * RoutedAppShell puede usar este evento
   * para comunicarse con un router externo.
   */
  onNavigate?: (
    node: NavigationNode<NavigationLinkMeta>
  ) => void;
}


export function AppShell({
  navigation,

  children,

  viewport = "window",


  brand,
  user,


  headerStart,
  headerCenter,
  headerEnd,


  activeId,


  collapsed,
  onCollapsedChange,


  mobileMode,
  onMobileModeChange,


  /**
   * Estado visual del árbol.
   *
   * Son nodos abiertos.
   *
   * No son rutas.
   */
  openIds,

  defaultOpenIds,

  onOpenIdsChange,


  sidebarExpandedWidth = 280,

  sidebarCollapsedWidth = 74,


  headerHeight = 64,

  mobileBarHeight = 68,


  defaultCollapsed = false,

  defaultMobileMode = "auto",


  showThemeButton = true,

  showMobileModeButton = true,

  showCollapseButton = true,

  showUserMenu = true,


  logoutLabel,

  onLogout,


  onNavigate,


  className = "",

  style,


  styles,

  slotProps,

}: AppShellProps) {


  const isContained =
    viewport === "contained";


  const shell =
    useAppShellState({

      collapsed,

      defaultCollapsed,

      onCollapsedChange,


      mobileMode,

      defaultMobileMode,

      onMobileModeChange,


      openIds,

      defaultOpenIds,

      onOpenIdsChange,


      activeId,

    });



  const sidebarWidth =
    shell.collapsed
      ? sidebarCollapsedWidth
      : sidebarExpandedWidth;



  const resolvedHeaderHeight =
    cssSize(headerHeight);


  const resolvedSidebarWidth =
    cssSize(sidebarWidth);



  const handleSidebarNodeSelect =
    React.useCallback(
      (
        node: NavigationNode<NavigationLinkMeta>
      ) => {

        onNavigate?.(
          node
        );

      },
      [
        onNavigate,
      ]
    );



  const rootSlot =
    resolveSlot<AppShellSlot>({
      slot: "root",

      styles,

      slotProps,

      className,

      style,

      baseProps: {
        "data-ui-app-shell": "",

        "data-ui-app-shell-viewport":
          viewport,

        "data-ui-app-shell-mobile":
          shell.isMobile || undefined,

        "data-ui-app-shell-collapsed":
          shell.collapsed || undefined,
      },

      baseStyle: {
        width: "100%",

        height:
          isContained
            ? "100%"
            : undefined,

        minHeight:
          isContained
            ? 0
            : "100dvh",

        minWidth: 0,

        position: "relative",

        overflow:
          isContained
            ? "hidden"
            : undefined,

        background:
          "var(--ui-bg)",

        color:
          "var(--ui-text)",
      },
    });



  const headerSlot =
    resolveSlot<AppShellSlot>({
      slot: "header",

      styles,

      slotProps,
    });



  const sidebarSlot =
    resolveSlot<AppShellSlot>({
      slot: "sidebar",

      styles,

      slotProps,
    });



  const contentSlot =
    resolveSlot<AppShellSlot>({
      slot: "content",

      styles,

      slotProps,
    });



  const contentPanelSlot =
    resolveSlot<AppShellSlot>({
      slot: "contentPanel",

      styles,

      slotProps,
    });



  const mobileBarSlot =
    resolveSlot<AppShellSlot>({
      slot: "mobileBar",

      styles,

      slotProps,
    });



  return (

    <Box {...rootSlot}>


      <AppShellHeader

        viewport={viewport}

        brand={brand}

        user={user}


        headerStart={headerStart}

        headerCenter={headerCenter}

        headerEnd={headerEnd}


        collapsed={shell.collapsed}

        isMobile={shell.isMobile}


        height={resolvedHeaderHeight}


        showCollapseButton={
          showCollapseButton
        }

        showMobileModeButton={
          showMobileModeButton
        }

        showThemeButton={
          showThemeButton
        }

        showUserMenu={
          showUserMenu
        }


        onToggleCollapsed={
          shell.toggleCollapsed
        }


        onToggleMobileMode={
          shell.toggleMobileMode
        }


        logoutLabel={logoutLabel}

        onLogout={onLogout}


        className={
          headerSlot.className
        }

        style={
          headerSlot.style
        }

      />



      {!shell.isMobile ? (

        <AppShellSidebar

          viewport={viewport}


          items={navigation}


          activeId={activeId}


          collapsed={
            shell.collapsed
          }


          sidebarExpandedWidth={
            sidebarExpandedWidth
          }


          sidebarCollapsedWidth={
            sidebarCollapsedWidth
          }


          headerHeight={
            resolvedHeaderHeight
          }


          openIds={
            openIds
          }


          onOpenIdsChange={
            onOpenIdsChange
          }


          onSelect={
            handleSidebarNodeSelect
          }


          className={
            sidebarSlot.className
          }


          style={
            sidebarSlot.style
          }

        />

      ) : null}



      <AppShellContent

        viewport={viewport}

        isMobile={shell.isMobile}


        headerHeight={
          resolvedHeaderHeight
        }


        mobileBarHeight={
          mobileBarHeight
        }


        sidebarWidth={
          shell.isMobile
            ? 0
            : resolvedSidebarWidth
        }


        className={
          contentSlot.className
        }


        style={
          contentSlot.style
        }


        styles={{
          panel:
            contentPanelSlot.style,
        }}


        slotProps={{
          panel: {
            className:
              contentPanelSlot.className,
          },
        }}

      >

        {children}

      </AppShellContent>



      {shell.isMobile ? (

        <AppShellMobileBar

          viewport={viewport}


          items={navigation}


          activeId={activeId}


          height={mobileBarHeight}


          onSelect={
            handleSidebarNodeSelect
          }


          className={
            mobileBarSlot.className
          }


          style={
            mobileBarSlot.style
          }

        />

      ) : null}


    </Box>

  );
}


AppShell.displayName =
  "AppShell";