// src/patterns/navigation-stack/navigationStack.utils.tsx
import React from "react";
import { Box } from "../../primitives/layout";
import type {
  NavigationStackEntry,
  NavigationStackParams,
  NavigationStackScreenProps,
  RegisteredNavigationStackScreen,
} from "./navigationStack.types";

export const NAVIGATION_STACK_SCREEN_MARKER =
  "__ZERINA_NAVIGATION_STACK_SCREEN__";

function hasNavigationStackScreenMarker(
  type: unknown
): boolean {
  if (
    type === null ||
    (
      typeof type !== "function" &&
      typeof type !== "object"
    )
  ) {
    return false;
  }

  return (
    Reflect.get(
      type,
      NAVIGATION_STACK_SCREEN_MARKER
    ) === true
  );
}

export function createNavigationStackEntry(
  key: string,
  name: string,
  params?: NavigationStackParams
): NavigationStackEntry {
  return {
    key,
    name,
    params,
  };
}

export function isNavigationStackScreenElement(
  child: React.ReactNode
): child is React.ReactElement<NavigationStackScreenProps> {
  return (
    React.isValidElement(child) &&
    hasNavigationStackScreenMarker(child.type)
  );
}

export function collectNavigationStackScreens(
  children: React.ReactNode
): Map<string, RegisteredNavigationStackScreen> {
  const screens =
    new Map<
      string,
      RegisteredNavigationStackScreen
    >();

  function visit(
    nextChildren: React.ReactNode
  ): void {
    React.Children.forEach(
      nextChildren,
      (child) => {
        if (!React.isValidElement(child)) {
          return;
        }

        if (
          child.type ===
          React.Fragment
        ) {
          visit(
            child.props.children
          );

          return;
        }

        if (
          !isNavigationStackScreenElement(
            child
          )
        ) {
          return;
        }

        const {
          name,
          component,
          render,
          element,
        } = child.props;

        screens.set(name, {
          name,
          component,
          render,
          element,
        });
      }
    );
  }

  visit(children);

  return screens;
}

export function renderMissingNavigationStackScreen(
  name: string
) {
  return (
    <Box
      style={{
        height: "100%",
        minHeight: 0,
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        color:
          "var(--ui-text-muted)",
        textAlign: "center",
      }}
    >
      NavigationStack: no existe una
      pantalla registrada con name="
      {name}".
    </Box>
  );
}