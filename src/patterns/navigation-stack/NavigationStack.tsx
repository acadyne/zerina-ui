// src/patterns/navigation-stack/NavigationStack.tsx
import React from "react";
import { MotionSwitch } from "../../core/motion";
import {
  resolveSlot,
  toMotionSlotProps,
} from "../../helpers/css";
import { Box } from "../../primitives/layout";
import { NavigationStackContext } from "./NavigationStackContext";
import { NavigationStackScreen } from "./NavigationStackScreen";
import { getNavigationStackMotionPreset } from "./navigationStack.motion";
import type {
  NavigationStackComponent,
  NavigationStackContextValue,
  NavigationStackEntry,
  NavigationStackProps,
  NavigationStackScreenRenderProps,
  NavigationStackTransitionDirection,
} from "./navigationStack.types";
import {
  collectNavigationStackScreens,
  createNavigationStackEntry,
  renderMissingNavigationStackScreen,
} from "./navigationStack.utils";

const NavigationStackRoot = function NavigationStackRoot(
  props: NavigationStackProps
) {
  const {
    children,
    initialName,
    initialParams,
    onEntriesChange,
    animation = "slide",
    fallback,
    className = "",
    style,
    styles,
    slotProps,
  } = props;

  const isControlled = props.entries !== undefined;

  const initialEntryRef = React.useRef<NavigationStackEntry>(
    createNavigationStackEntry(initialName, initialParams)
  );

  const [internalEntries, setInternalEntries] = React.useState<
    NavigationStackEntry[]
  >([initialEntryRef.current]);

  const [
    internalTransitionDirection,
    setInternalTransitionDirection,
  ] = React.useState<NavigationStackTransitionDirection>("replace");

  const stackEntries =
    props.entries !== undefined
      ? props.entries
      : internalEntries;

  const transitionDirection =
    props.entries !== undefined
      ? props.transitionDirection
      : internalTransitionDirection;

  const screens = React.useMemo(
    () => collectNavigationStackScreens(children),
    [children]
  );

  const setEntries = React.useCallback(
    (
      nextEntries: NavigationStackEntry[],
      nextTransitionDirection: NavigationStackTransitionDirection
    ) => {
      const normalizedEntries =
        nextEntries.length > 0
          ? nextEntries
          : [createNavigationStackEntry(initialName)];

      if (!isControlled) {
        setInternalEntries(normalizedEntries);
        setInternalTransitionDirection(nextTransitionDirection);
      }

      onEntriesChange?.(
        normalizedEntries,
        nextTransitionDirection
      );
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
        setEntries(
          [
            ...stackEntries,
            createNavigationStackEntry(name, params),
          ],
          "forward"
        );
      },

      replace: (name, params) => {
        setEntries(
          [
            ...stackEntries.slice(0, -1),
            createNavigationStackEntry(name, params),
          ],
          "replace"
        );
      },

      pop: () => {
        if (stackEntries.length <= 1) {
          return;
        }

        setEntries(
          stackEntries.slice(0, -1),
          "back"
        );
      },

      popToRoot: () => {
        if (stackEntries.length <= 1) {
          return;
        }

        setEntries(
          [
            stackEntries[0] ??
              createNavigationStackEntry(initialName),
          ],
          "back"
        );
      },

      reset: (name, params) => {
        setEntries(
          [createNavigationStackEntry(name, params)],
          "replace"
        );
      },
    }),
    [
      stackEntries,
      current,
      currentIndex,
      canGoBack,
      setEntries,
      initialName,
    ]
  );

  const activeScreen =
    current
      ? screens.get(current.name)
      : null;

  const rootSlot = resolveSlot({
    slot: "root",
    styles,
    slotProps,
    className,
    style,
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
    if (!current) {
      return null;
    }

    if (!activeScreen) {
      return (
        fallback ??
        renderMissingNavigationStackScreen(current.name)
      );
    }

    const screenProps: NavigationStackScreenRenderProps = {
      navigation,
      route: current,
    };

    if (activeScreen.component) {
      const Component = activeScreen.component;
      return <Component {...screenProps} />;
    }

    if (activeScreen.render) {
      return activeScreen.render(screenProps);
    }

    return activeScreen.element ?? null;
  }, [
    activeScreen,
    current,
    fallback,
    navigation,
  ]);

  return (
    <NavigationStackContext.Provider value={navigation}>
      <Box
        {...rootSlot}
        data-ui-navigation-stack=""
        data-ui-navigation-stack-animation={animation}
        data-ui-navigation-stack-direction={transitionDirection}
      >
        {current ? (
          <MotionSwitch
            motionKey={current.key}
            preset={getNavigationStackMotionPreset(animation)}
            direction={transitionDirection}
            mode="wait"
            initial={false}
            {...toMotionSlotProps(screenSlot)}
          >
            {screenContent}
          </MotionSwitch>
        ) : null}
      </Box>
    </NavigationStackContext.Provider>
  );
};

export const NavigationStack = Object.assign(
  NavigationStackRoot,
  {
    Screen: NavigationStackScreen,
  }
) as NavigationStackComponent;

NavigationStack.displayName = "NavigationStack";
NavigationStack.Screen.displayName =
  "NavigationStack.Screen";