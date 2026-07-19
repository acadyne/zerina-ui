// src/patterns/scaffold/tab-scaffold/TabScaffold.tsx
import React from "react";
import { resolveSlot } from "../../../helpers/css";
import { Box } from "../../../primitives/layout";
import { BottomNavigation } from "../../../primitives/navigation/bottom-navigation";
import {
  NavigationStack,
  type NavigationStackEntry,
  type NavigationStackParams,
  type NavigationStackTransitionDirection,
} from "../../navigation-stack";
import { BackButton } from "../BackButton";
import { Scaffold } from "../Scaffold";
import { TopAppBar } from "../TopAppBar";
import { TabScaffoldContext } from "./TabScaffoldContext";
import type {
  TabScaffoldContextValue,
  TabScaffoldProps,
  TabScaffoldRenderContext,
} from "./tabScaffold.types";
import {
  createTabScaffoldEntry,
  getActiveTab,
  getInitialTab,
  getTabScaffoldScreenMeta,
  renderTabScaffoldFallback,
  resolveTabScaffoldHeaderValue,
  resolveTabScaffoldSlot,
} from "./tabScaffold.utils";

export function TabScaffold(
  props: TabScaffoldProps
) {
  const {
    tabs,
    screens,

    viewport = "window",

    initialTab: initialTabProp,
    initialParams,

    onEntriesChange,

    animation = "slide",

    showAppBar = true,
    showBottomNavigation = true,

    title,
    subtitle,

    rootLeading,
    actions,
    floating,

    backIcon = "‹",
    backAriaLabel = "Volver",
    backButtonProps,

    renderAppBar,
    renderBottomNavigation,

    topAppBarProps,
    bottomNavigationProps,

    onTabChange,

    fallback,

    scrollable = false,

    styles,
    slotProps,

    className = "",
    style,

    ...scaffoldProps
  } = props;

  const rootSlot = resolveSlot({
    slot: "root",
    styles,
    slotProps,
    className,
    style,
  });

  const appBarSlot = resolveSlot({
    slot: "appBar",
    styles,
    slotProps,
    baseStyle: {
      width: "100%",
      minWidth: 0,
      flexShrink: 0,
    },
  });

  const stackSlot = resolveSlot({
    slot: "stack",
    styles,
    slotProps,
    baseStyle: {
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      overflow: "hidden",
    },
  });

  const screenSlot = resolveSlot({
    slot: "screen",
    styles,
    slotProps,
  });

  const bottomNavigationSlot = resolveSlot({
    slot: "bottomNavigation",
    styles,
    slotProps,
    baseStyle: {
      width: "100%",
      minWidth: 0,
      flexShrink: 0,
    },
  });

  const floatingSlot = resolveSlot({
    slot: "floating",
    styles,
    slotProps,
    baseStyle: {
      display: "contents",
    },
  });

  const initialTab = React.useMemo(
    () => getInitialTab(tabs, initialTabProp),
    [tabs, initialTabProp]
  );

  const entryId = React.useId().replace(/:/g, "");
  const entrySequenceRef = React.useRef(1);

  const createEntry = React.useCallback(
    (
      name: string,
      params?: NavigationStackParams
    ): NavigationStackEntry => {
      const key =
        `${entryId}-${entrySequenceRef.current}`;

      entrySequenceRef.current += 1;

      return createTabScaffoldEntry(
        key,
        name,
        params
      );
    },
    [entryId]
  );

  const isControlled = props.entries !== undefined;

  const [internalEntries, setInternalEntries] = React.useState<
    NavigationStackEntry[]
  >(() => [
    createTabScaffoldEntry(
      `${entryId}-0`,
      initialTab,
      initialParams
    ),
  ]);

  const [
    internalTransitionDirection,
    setInternalTransitionDirection,
  ] = React.useState<NavigationStackTransitionDirection>("replace");

  const stackEntries =
    props.entries !== undefined
      ? props.entries
      : internalEntries;

  const stackTransitionDirection =
    props.entries !== undefined
      ? props.transitionDirection
      : internalTransitionDirection;

  const setEntries = React.useCallback(
    (
      nextEntries: NavigationStackEntry[],
      nextTransitionDirection: NavigationStackTransitionDirection
    ) => {
      const normalizedEntries =
        nextEntries.length > 0
          ? nextEntries
          : [
            createEntry(
              initialTab,
              initialParams
            ),
          ];

      if (!isControlled) {
        setInternalEntries(normalizedEntries);
        setInternalTransitionDirection(nextTransitionDirection);
      }

      onEntriesChange?.(
        normalizedEntries,
        nextTransitionDirection
      );
    },
    [
      initialParams,
      initialTab,
      isControlled,
      onEntriesChange,
    ]
  );

  const updateEntries = React.useCallback(
    (
      updater:
        | NavigationStackEntry[]
        | ((
          currentEntries: NavigationStackEntry[]
        ) => NavigationStackEntry[]),
      transitionDirection: NavigationStackTransitionDirection
    ) => {
      const nextEntries =
        typeof updater === "function"
          ? updater(stackEntries)
          : updater;

      setEntries(nextEntries, transitionDirection);
    },
    [setEntries, stackEntries]
  );

  const current =
    stackEntries[stackEntries.length - 1] ?? null;

  const activeTab = getActiveTab({
    entries: stackEntries,
    tabs,
    initialTab,
  });

  const canGoBack = stackEntries.length > 1;

  const contextValue = React.useMemo<TabScaffoldContextValue>(
    () => ({
      entries: stackEntries,
      current,
      activeTab,
      canGoBack,

      setEntries,

      push: (name, params) => {
        updateEntries(
          (currentEntries) => [
            ...currentEntries,
            createEntry(name, params),
          ],
          "forward"
        );
      },

      replace: (name, params) => {
        updateEntries(
          (currentEntries) => [
            ...currentEntries.slice(0, -1),
            createEntry(name, params),
          ],
          "replace"
        );
      },

      pop: () => {
        updateEntries(
          (currentEntries) => {
            if (currentEntries.length <= 1) {
              return currentEntries;
            }

            return currentEntries.slice(0, -1);
          },
          "back"
        );
      },

      popToRoot: () => {
        updateEntries(
          (currentEntries) => [
            currentEntries[0] ??
            createEntry(
              initialTab,
              initialParams
            ),
          ],
          "back"
        );
      },

      reset: (name, params) => {
        updateEntries(
          [createEntry(name, params)],
          "replace"
        );
      },

      resetToTab: (tab) => {
        const target = tabs.find(
          (item) => item.value === tab
        );

        if (!target || target.disabled) {
          return;
        }

        updateEntries(
          [createEntry(tab)],
          "replace"
        );

        onTabChange?.(tab);
      },
    }),
    [
      activeTab,
      canGoBack,
      createEntry,
      current,
      initialParams,
      initialTab,
      onTabChange,
      setEntries,
      stackEntries,
      tabs,
      updateEntries,
    ]
  );

  const renderContext =
    React.useMemo<TabScaffoldRenderContext>(
      () => ({
        ...contextValue,
        tabs,
      }),
      [contextValue, tabs]
    );

  const activeMeta = getTabScaffoldScreenMeta({
    currentName: current?.name,
    activeTab,
    screens,
  });

  const resolvedTitle =
    resolveTabScaffoldHeaderValue(title, renderContext) ??
    resolveTabScaffoldHeaderValue(
      activeMeta?.title,
      renderContext
    ) ??
    tabs.find((tab) => tab.value === activeTab)?.label ??
    activeTab;

  const resolvedSubtitle =
    resolveTabScaffoldHeaderValue(
      subtitle,
      renderContext
    ) ??
    resolveTabScaffoldHeaderValue(
      activeMeta?.subtitle,
      renderContext
    );

  const appBarNode = renderAppBar ? (
    renderAppBar(renderContext)
  ) : showAppBar ? (
    <TopAppBar
      title={resolvedTitle}
      subtitle={resolvedSubtitle}
      centerTitle
      variant="blur"
      leading={
        canGoBack ? (
          <BackButton
            ariaLabel={backAriaLabel}
            icon={backIcon}
            size="sm"
            variant="ghost"
            {...backButtonProps}
            onBack={contextValue.pop}
          />
        ) : (
          resolveTabScaffoldSlot(
            rootLeading,
            renderContext
          )
        )
      }
      actions={resolveTabScaffoldSlot(
        actions,
        renderContext
      )}
      {...topAppBarProps}
    />
  ) : null;

  const appBar = appBarNode ? (
    <Box
      {...appBarSlot}
      data-ui-tab-scaffold-app-bar=""
    >
      {appBarNode}
    </Box>
  ) : null;

  const bottomNavigationNode = renderBottomNavigation ? (
    renderBottomNavigation(renderContext)
  ) : showBottomNavigation ? (
    <BottomNavigation
      position="static"
      safeArea={false}
      variant="floating"
      indicator="pill"
      labelBehavior="active"
      density="comfortable"
      {...bottomNavigationProps}
      value={activeTab}
      onValueChange={(
        nextTab,
        _event,
        selection
      ) => {
        if (
          selection.reason ===
          "reselect"
        ) {
          contextValue.popToRoot();
          return;
        }

        contextValue.resetToTab(
          nextTab
        );
      }}
    >
      {tabs.map((tab) => (
        <BottomNavigation.Item
          key={tab.value}
          value={tab.value}
          icon={tab.icon}
          badge={tab.badge}
          disabled={tab.disabled}
        >
          {tab.label}
        </BottomNavigation.Item>
      ))}
    </BottomNavigation>
  ) : null;

  const bottomNavigation = bottomNavigationNode ? (
    <Box
      {...bottomNavigationSlot}
      data-ui-tab-scaffold-bottom-navigation=""
    >
      {bottomNavigationNode}
    </Box>
  ) : null;

  const floatingContent =
    resolveTabScaffoldSlot(
      floating,
      renderContext
    );

  const floatingNode = floatingContent ? (
    <Box
      {...floatingSlot}
      data-ui-tab-scaffold-floating=""
    >
      {floatingContent}
    </Box>
  ) : null;

  if (tabs.length === 0 || !initialTab) {
    return (
      <Scaffold
        viewport={viewport}

        scrollable={scrollable}

        appBar={appBar}

        footer={bottomNavigation}

        floating={floatingNode}

        {...rootSlot}

        data-ui-tab-scaffold=""
        data-ui-tab-scaffold-active-tab={activeTab}
        data-ui-tab-scaffold-can-go-back={
          canGoBack || undefined
        }

        {...scaffoldProps}
      >
        {fallback ?? renderTabScaffoldFallback()}
      </Scaffold>
    );
  }

  return (
    <TabScaffoldContext.Provider value={contextValue}>
      <Scaffold
        viewport={viewport}
        scrollable={scrollable}
        appBar={appBar}
        footer={bottomNavigation}
        floating={floatingNode}
        {...rootSlot}
        data-ui-tab-scaffold=""
        data-ui-tab-scaffold-active-tab={activeTab}
        data-ui-tab-scaffold-can-go-back={
          canGoBack || undefined
        }
        {...scaffoldProps}
      >
        <Box
          {...stackSlot}
          data-ui-tab-scaffold-stack=""
        >
          <NavigationStack
            initialName={initialTab}
            initialParams={initialParams}
            entries={stackEntries}
            transitionDirection={stackTransitionDirection}
            onEntriesChange={setEntries}
            animation={animation}
            fallback={fallback}
            style={{
              height: "100%",
              minHeight: 0,
              minWidth: 0,
            }}
            styles={{
              screen: screenSlot.style,
            }}
            slotProps={{
              screen: {
                className: screenSlot.className,
              },
            }}
          >
            {screens.map((screen) => (
              <NavigationStack.Screen
                key={screen.name}
                name={screen.name}
                component={screen.component}
                render={screen.render}
                element={screen.element}
              />
            ))}
          </NavigationStack>
        </Box>
      </Scaffold>
    </TabScaffoldContext.Provider>
  );
}

TabScaffold.displayName = "TabScaffold";