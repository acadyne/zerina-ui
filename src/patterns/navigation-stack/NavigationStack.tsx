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
  NavigationStackProps,
  NavigationStackScreenRenderProps,
} from "./navigationStack.types";
import {
  collectNavigationStackScreens,
  renderMissingNavigationStackScreen,
} from "./navigationStack.utils";

import {
  useNavigationEntries,
} from "./useNavigationEntries";

const NavigationStackRoot =
  React.forwardRef<
    HTMLDivElement,
    NavigationStackProps
  >(
    (
      props,
      ref
    ) => {
  const {
    children,
    initialName,
    initialParams,

    entries: controlledEntries,
    transitionDirection:
      controlledTransitionDirection,

    onEntriesChange,
    animation = "slide",
    fallback,
    className = "",
    style,
    styles,
    slotProps,

    ...rest
  } = props;

  const history =
    useNavigationEntries({
      initialName,
      initialParams,

      entries:
        controlledEntries,

      transitionDirection:
        controlledTransitionDirection,

      onEntriesChange,
    });


  const {
    entries:
      stackEntries,

    transitionDirection,

    current,
    currentIndex,
    canGoBack,

    push,
    replace,
    pop,
    popToRoot,
    reset,
  } = history;


  const screens = React.useMemo(
    () => collectNavigationStackScreens(children),
    [children]
  );

  const navigation =
    React.useMemo<
      NavigationStackContextValue
    >(
      () => ({
        entries:
          stackEntries,

        current,

        index:
          currentIndex,

        canGoBack,

        push,
        replace,
        pop,
        popToRoot,
        reset,
      }),
      [
        stackEntries,
        current,
        currentIndex,
        canGoBack,
        push,
        replace,
        pop,
        popToRoot,
        reset,
      ],
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
        {...rest}
        {...rootSlot}
        ref={ref}
        data-ui-navigation-stack=""
        data-ui-navigation-stack-animation={
          animation
        }
        data-ui-navigation-stack-direction={
          transitionDirection
        }
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
    }
  );

NavigationStackRoot.displayName =
  "NavigationStack";

export const NavigationStack = Object.assign(
  NavigationStackRoot,
  {
    Screen: NavigationStackScreen,
  }
) as NavigationStackComponent;

NavigationStack.displayName = "NavigationStack";
NavigationStack.Screen.displayName =
  "NavigationStack.Screen";