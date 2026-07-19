// src/patterns/app-shell/useAppShellState.ts

import React from "react";

import {
  useOptionalUIViewport,
} from "../../core/viewport";

import type {
  AppShellMobileMode,
} from "./AppShell.types";


export interface UseAppShellStateOptions {

  collapsed?: boolean;

  defaultCollapsed?: boolean;

  onCollapsedChange?: (
    collapsed: boolean
  ) => void;


  mobileMode?: AppShellMobileMode;

  defaultMobileMode?: AppShellMobileMode;

  onMobileModeChange?: (
    mode: AppShellMobileMode
  ) => void;


  /**
   * IDs de nodos abiertos dentro del árbol
   * de navegación.
   *
   * No son rutas.
   *
   * Representan únicamente estado visual:
   *
   * NavigationNode
   *        |
   *        v
   * grupo expandido
   */
  openIds?: string[];

  defaultOpenIds?: string[];

  onOpenIdsChange?: (
    ids: string[]
  ) => void;


  /**
   * Nodo actualmente seleccionado.
   *
   * AppShell no conoce:
   *
   * - URL
   * - router
   * - path
   *
   * Solo mantiene identidad del nodo activo.
   */
  activeId?: string | null;

  defaultActiveId?: string | null;

  onActiveIdChange?: (
    id: string | null
  ) => void;
}


export interface UseAppShellStateResult {

  collapsed: boolean;

  setCollapsed: (
    collapsed: boolean
  ) => void;

  toggleCollapsed: () => void;


  mobileMode: AppShellMobileMode;

  setMobileMode: (
    mode: AppShellMobileMode
  ) => void;

  toggleMobileMode: () => void;


  isMobile: boolean;


  /**
   * Estado visual de expansión del árbol.
   */
  openIds: string[];

  setOpenIds: (
    ids: string[]
  ) => void;

  toggleOpenId: (
    id: string
  ) => void;


  /**
   * Nodo activo seleccionado.
   */
  activeId: string | null;

  setActiveId: (
    id: string | null
  ) => void;
}


function resolveIsMobile({
  mobileMode,
  viewportIsMobile,
}: {
  mobileMode: AppShellMobileMode;

  viewportIsMobile: boolean;
}): boolean {

  if (mobileMode === "mobile") {
    return true;
  }

  if (mobileMode === "desktop") {
    return false;
  }

  return viewportIsMobile;
}


export function useAppShellState(
  options: UseAppShellStateOptions = {}
): UseAppShellStateResult {

  const viewport =
    useOptionalUIViewport();


  const {
    collapsed: controlledCollapsed,

    defaultCollapsed = false,

    onCollapsedChange,


    mobileMode: controlledMobileMode,

    defaultMobileMode = "auto",

    onMobileModeChange,


    openIds: controlledOpenIds,

    defaultOpenIds = [],

    onOpenIdsChange,


    activeId: controlledActiveId,

    defaultActiveId = null,

    onActiveIdChange,

  } = options;


  const [
    internalCollapsed,
    setInternalCollapsed,
  ] =
    React.useState(
      defaultCollapsed
    );


  const [
    internalMobileMode,
    setInternalMobileMode,
  ] =
    React.useState<AppShellMobileMode>(
      defaultMobileMode
    );


  const [
    internalOpenIds,
    setInternalOpenIds,
  ] =
    React.useState<string[]>(
      defaultOpenIds
    );


  const [
    internalActiveId,
    setInternalActiveId,
  ] =
    React.useState<string | null>(
      defaultActiveId
    );


  const collapsed =
    controlledCollapsed ??
    internalCollapsed;


  const mobileMode =
    controlledMobileMode ??
    internalMobileMode;


  const openIds =
    controlledOpenIds ??
    internalOpenIds;


  const activeId =
    controlledActiveId ??
    internalActiveId;


  const isMobile =
    resolveIsMobile({
      mobileMode,

      viewportIsMobile:
        Boolean(
          viewport?.isMobile
        ),
    });


  const setCollapsed =
    React.useCallback(
      (
        next: boolean
      ) => {

        if (
          controlledCollapsed === undefined
        ) {
          setInternalCollapsed(
            next
          );
        }

        onCollapsedChange?.(
          next
        );

      },
      [
        controlledCollapsed,
        onCollapsedChange,
      ]
    );


  const toggleCollapsed =
    React.useCallback(
      () => {
        setCollapsed(
          !collapsed
        );
      },
      [
        collapsed,
        setCollapsed,
      ]
    );


  const setMobileMode =
    React.useCallback(
      (
        next: AppShellMobileMode
      ) => {

        if (
          controlledMobileMode === undefined
        ) {
          setInternalMobileMode(
            next
          );
        }

        onMobileModeChange?.(
          next
        );

      },
      [
        controlledMobileMode,
        onMobileModeChange,
      ]
    );


  const toggleMobileMode =
    React.useCallback(
      () => {
        setMobileMode(
          isMobile
            ? "desktop"
            : "mobile"
        );
      },
      [
        isMobile,
        setMobileMode,
      ]
    );


  const setOpenIds =
    React.useCallback(
      (
        next: string[]
      ) => {

        if (
          controlledOpenIds === undefined
        ) {
          setInternalOpenIds(
            next
          );
        }

        onOpenIdsChange?.(
          next
        );

      },
      [
        controlledOpenIds,
        onOpenIdsChange,
      ]
    );


  const toggleOpenId =
    React.useCallback(
      (
        id: string
      ) => {

        const next =
          openIds.includes(id)
            ? openIds.filter(
              (item) =>
                item !== id
            )
            : [
              ...openIds,
              id,
            ];


        setOpenIds(
          next
        );

      },
      [
        openIds,
        setOpenIds,
      ]
    );


  const setActiveId =
    React.useCallback(
      (
        next: string | null
      ) => {

        if (
          controlledActiveId === undefined
        ) {
          setInternalActiveId(
            next
          );
        }

        onActiveIdChange?.(
          next
        );

      },
      [
        controlledActiveId,
        onActiveIdChange,
      ]
    );


  return {

    collapsed,

    setCollapsed,

    toggleCollapsed,


    mobileMode,

    setMobileMode,

    toggleMobileMode,


    isMobile,


    openIds,

    setOpenIds,

    toggleOpenId,


    activeId,

    setActiveId,

  };
}