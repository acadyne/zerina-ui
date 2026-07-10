// src/patterns/navigation-stack/NavigationStack.tsx
import React from "react";
import { MotionSwitch } from "../../core/motion";
import { resolveSlot } from "../../helpers/css";
import { Box } from "../../primitives/layout";
import { NavigationStackContext } from "./NavigationStackContext";
import { NavigationStackScreen } from "./NavigationStackScreen";
import {
  getNavigationStackMotionPreset,
  inferNavigationStackTransitionDirection,
} from "./navigationStack.motion";
import type {
  NavigationStackComponent,
  NavigationStackContextValue,
  NavigationStackEntry,
  NavigationStackProps,
  NavigationStackScreenRenderProps,
} from "./navigationStack.types";
import {
  collectNavigationStackScreens,
  createNavigationStackEntry,
  renderMissingNavigationStackScreen,
} from "./navigationStack.utils";

const NavigationStackRoot = function NavigationStackRoot({
  children,
  initialName,
  initialParams,
  entries,
  onEntriesChange,
  animation = "slide",
  fallback,
  className = "",
  style,
  styles,
  slotProps,
}: NavigationStackProps) {
  const isControlled = entries !== undefined;

  const initialEntryRef = React.useRef<NavigationStackEntry>(
    createNavigationStackEntry(initialName, initialParams)
  );

  const [internalEntries, setInternalEntries] = React.useState<
    NavigationStackEntry[]
  >([initialEntryRef.current]);

  const stackEntries = isControlled ? entries : internalEntries;

  const previousEntriesRef = React.useRef<NavigationStackEntry[]>(stackEntries);

  const transitionDirection = inferNavigationStackTransitionDirection({
    previousEntries: previousEntriesRef.current,
    nextEntries: stackEntries,
  });

  React.useEffect(() => {
    previousEntriesRef.current = stackEntries;
  }, [stackEntries]);

  const screens = React.useMemo(
    () => collectNavigationStackScreens(children),
    [children]
  );

  const setEntries = React.useCallback(
    (nextEntries: NavigationStackEntry[]) => {
      const normalizedEntries =
        nextEntries.length > 0
          ? nextEntries
          : [createNavigationStackEntry(initialName)];

      if (!isControlled) {
        setInternalEntries(normalizedEntries);
      }

      onEntriesChange?.(normalizedEntries);
    },
    [initialName, isControlled, onEntriesChange]
  );

  const currentIndex = Math.max(0, stackEntries.length - 1);
  const current = stackEntries[currentIndex] ?? null;
  const canGoBack = stackEntries.length > 1;

  const navigation = React.useMemo<NavigationStackContextValue>(
    () => ({
      entries: stackEntries,
      current,
      index: currentIndex,
      canGoBack,

      push: (name, params) => {
        setEntries([...stackEntries, createNavigationStackEntry(name, params)]);
      },

      replace: (name, params) => {
        setEntries([
          ...stackEntries.slice(0, -1),
          createNavigationStackEntry(name, params),
        ]);
      },

      pop: () => {
        if (stackEntries.length <= 1) return;

        setEntries(stackEntries.slice(0, -1));
      },

      popToRoot: () => {
        setEntries([
          stackEntries[0] ?? createNavigationStackEntry(initialName),
        ]);
      },

      reset: (name, params) => {
        setEntries([createNavigationStackEntry(name, params)]);
      },
    }),
    [stackEntries, current, currentIndex, canGoBack, setEntries, initialName]
  );

  const activeScreen = current ? screens.get(current.name) : null;

  const rootSlot = resolveSlot({
    slot: "root",
    styles,
    slotProps,
    className,
    baseStyle: {
      position: "relative",
      width: "100%",
      height: "100%",
      minWidth: 0,
      minHeight: 0,
      overflow: "hidden",
      background: "var(--ui-bg)",
      color: "var(--ui-text)",
    },
  });

  const screenSlot = resolveSlot({
    slot: "screen",
    styles,
    slotProps,
    baseStyle: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      minWidth: 0,
      minHeight: 0,
      overflow: "hidden",
    },
  });

  const screenContent = React.useMemo(() => {
    if (!current) return null;

    if (!activeScreen) {
      return fallback ?? renderMissingNavigationStackScreen(current.name);
    }

    const props: NavigationStackScreenRenderProps = {
      navigation,
      route: current,
    };

    if (activeScreen.component) {
      const Component = activeScreen.component;
      return <Component {...props} />;
    }

    if (activeScreen.render) {
      return activeScreen.render(props);
    }

    return activeScreen.element ?? null;
  }, [activeScreen, current, fallback, navigation]);

  return (
    <NavigationStackContext.Provider value={navigation}>
      <Box
        {...rootSlot}
        data-ui-navigation-stack=""
        data-ui-navigation-stack-animation={animation}
        data-ui-navigation-stack-direction={transitionDirection}
        style={{
          ...rootSlot.style,
          ...style,
        }}
      >
        {current ? (
          <MotionSwitch
            motionKey={current.key}
            preset={getNavigationStackMotionPreset(animation)}
            direction={transitionDirection}
            mode="wait"
            initial={false}
            className={screenSlot.className}
            style={screenSlot.style}
          >
            {screenContent}
          </MotionSwitch>
        ) : null}
      </Box>
    </NavigationStackContext.Provider>
  );
};

export const NavigationStack = Object.assign(NavigationStackRoot, {
  Screen: NavigationStackScreen,
}) as NavigationStackComponent;

NavigationStack.displayName = "NavigationStack";
NavigationStack.Screen.displayName = "NavigationStack.Screen";