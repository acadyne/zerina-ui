// src/patterns/scaffold/tab-scaffold/TabScaffold.tsx
import React from "react";
import {
  cx,
  getSlotProps,
  getSlotStyle,
  type SlotElementProps,
} from "../../../helpers/css";
import { Box } from "../../../primitives/layout";
import { BottomNavigation } from "../../../primitives/navigation/BottomNavigation";
import {
  NavigationStack,
  type NavigationStackEntry,
  type NavigationStackScreenRenderProps,
} from "../../navigation-stack";
import { BackButton } from "../BackButton";
import { MobileScaffold } from "../MobileScaffold";
import { TopAppBar } from "../TopAppBar";
import { TabScaffoldContext } from "./TabScaffoldContext";
import type {
  TabScaffoldContextValue,
  TabScaffoldProps,
  TabScaffoldRenderContext,
  TabScaffoldSlot,
  TabScaffoldSlotProps,
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

interface ResolvedSlotProps {
  className?: string;
  style?: React.CSSProperties;
  rest: Omit<SlotElementProps, "className" | "style">;
}

function resolveSlotProps(
  slotProps: TabScaffoldSlotProps | undefined,
  slot: TabScaffoldSlot
): ResolvedSlotProps {
  const { className, style, ...rest } = getSlotProps(slotProps, slot);

  return {
    className,
    style,
    rest,
  };
}

export function TabScaffold({
  tabs,
  screens = [],

  viewport = "window",

  initialTab: initialTabProp,
  initialParams,

  entries,
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

  stackStyle,
  screenStyle,

  scrollable = false,
  padded = false,

  styles,
  slotProps,

  className = "",
  style,

  ...mobileScaffoldProps
}: TabScaffoldProps) {
  const rootSlot = resolveSlotProps(slotProps, "root");
  const appBarSlot = resolveSlotProps(slotProps, "appBar");
  const stackSlot = resolveSlotProps(slotProps, "stack");
  const screenSlot = resolveSlotProps(slotProps, "screen");
  const bottomNavigationSlot = resolveSlotProps(slotProps, "bottomNavigation");
  const floatingSlot = resolveSlotProps(slotProps, "floating");

  const initialTab = React.useMemo(
    () => getInitialTab(tabs, initialTabProp),
    [tabs, initialTabProp]
  );

  const initialEntryRef = React.useRef<NavigationStackEntry>(
    createTabScaffoldEntry(initialTab, initialParams)
  );

  const isControlled = entries !== undefined;

  const [internalEntries, setInternalEntries] = React.useState<
    NavigationStackEntry[]
  >([initialEntryRef.current]);

  const stackEntries = isControlled ? entries : internalEntries;

  const setEntries = React.useCallback(
    (nextEntries: NavigationStackEntry[]) => {
      const normalizedEntries =
        nextEntries.length > 0
          ? nextEntries
          : [createTabScaffoldEntry(initialTab, initialParams)];

      if (!isControlled) {
        setInternalEntries(normalizedEntries);
      }

      onEntriesChange?.(normalizedEntries);
    },
    [initialParams, initialTab, isControlled, onEntriesChange]
  );

  const updateEntries = React.useCallback(
    (
      updater:
        | NavigationStackEntry[]
        | ((currentEntries: NavigationStackEntry[]) => NavigationStackEntry[])
    ) => {
      const nextEntries =
        typeof updater === "function" ? updater(stackEntries) : updater;

      setEntries(nextEntries);
    },
    [setEntries, stackEntries]
  );

  const current = stackEntries[stackEntries.length - 1] ?? null;

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
        updateEntries((currentEntries) => [
          ...currentEntries,
          createTabScaffoldEntry(name, params),
        ]);
      },

      replace: (name, params) => {
        updateEntries((currentEntries) => [
          ...currentEntries.slice(0, -1),
          createTabScaffoldEntry(name, params),
        ]);
      },

      pop: () => {
        updateEntries((currentEntries) => {
          if (currentEntries.length <= 1) return currentEntries;

          return currentEntries.slice(0, -1);
        });
      },

      popToRoot: () => {
        updateEntries((currentEntries) => [
          currentEntries[0] ?? createTabScaffoldEntry(initialTab, initialParams),
        ]);
      },

      reset: (name, params) => {
        updateEntries([createTabScaffoldEntry(name, params)]);
      },

      resetToTab: (tab) => {
        const target = tabs.find((item) => item.value === tab);
        if (!target || target.disabled) return;

        updateEntries([createTabScaffoldEntry(tab)]);
        onTabChange?.(tab);
      },
    }),
    [
      activeTab,
      canGoBack,
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

  const renderContext = React.useMemo<TabScaffoldRenderContext>(
    () => ({
      ...contextValue,
      tabs,
    }),
    [contextValue, tabs]
  );

  const activeMeta = getTabScaffoldScreenMeta({
    currentName: current?.name,
    activeTab,
    tabs,
    screens,
  });

  const resolvedTitle =
    resolveTabScaffoldHeaderValue(title, renderContext) ??
    resolveTabScaffoldHeaderValue(activeMeta?.title, renderContext) ??
    tabs.find((tab) => tab.value === activeTab)?.label ??
    activeTab;

  const resolvedSubtitle =
    resolveTabScaffoldHeaderValue(subtitle, renderContext) ??
    resolveTabScaffoldHeaderValue(activeMeta?.subtitle, renderContext);

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
          resolveTabScaffoldSlot(rootLeading, renderContext)
        )
      }
      actions={resolveTabScaffoldSlot(actions, renderContext)}
      {...topAppBarProps}
    />
  ) : null;

  const appBar = appBarNode ? (
    <Box
      className={appBarSlot.className}
      data-ui-tab-scaffold-app-bar=""
      {...appBarSlot.rest}
      style={{
        width: "100%",
        minWidth: 0,
        flexShrink: 0,
        ...getSlotStyle(styles, "appBar"),
        ...appBarSlot.style,
      }}
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
      onValueChange={(next) => {
        contextValue.resetToTab(next);
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
      className={bottomNavigationSlot.className}
      data-ui-tab-scaffold-bottom-navigation=""
      {...bottomNavigationSlot.rest}
      style={{
        width: "100%",
        minWidth: 0,
        flexShrink: 0,
        ...getSlotStyle(styles, "bottomNavigation"),
        ...bottomNavigationSlot.style,
      }}
    >
      {bottomNavigationNode}
    </Box>
  ) : null;

  const floatingContent = resolveTabScaffoldSlot(floating, renderContext);

  const floatingNode = floatingContent ? (
    <Box
      className={floatingSlot.className}
      data-ui-tab-scaffold-floating=""
      {...floatingSlot.rest}
      style={{
        display: "contents",
        ...getSlotStyle(styles, "floating"),
        ...floatingSlot.style,
      }}
    >
      {floatingContent}
    </Box>
  ) : null;

  if (tabs.length === 0 || !initialTab) {
    return (
      <MobileScaffold
        viewport={viewport}
        scrollable={false}
        padded={false}
        className={cx(className, rootSlot.className)}
        data-ui-tab-scaffold=""
        data-ui-tab-scaffold-empty=""
        {...rootSlot.rest}
        {...mobileScaffoldProps}
        style={{
          ...getSlotStyle(styles, "root"),
          ...rootSlot.style,
          ...style,
        }}
      >
        {fallback ?? renderTabScaffoldFallback()}
      </MobileScaffold>
    );
  }

  return (
    <TabScaffoldContext.Provider value={contextValue}>
      <MobileScaffold
        viewport={viewport}
        scrollable={scrollable}
        padded={padded}
        appBar={appBar}
        bottomNavigation={bottomNavigation}
        floating={floatingNode}
        className={cx(className, rootSlot.className)}
        data-ui-tab-scaffold=""
        data-ui-tab-scaffold-active-tab={activeTab}
        data-ui-tab-scaffold-can-go-back={canGoBack || undefined}
        {...rootSlot.rest}
        {...mobileScaffoldProps}
        style={{
          ...getSlotStyle(styles, "root"),
          ...rootSlot.style,
          ...style,
        }}
      >
        <Box
          className={stackSlot.className}
          data-ui-tab-scaffold-stack=""
          {...stackSlot.rest}
          style={{
            height: "100%",
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
            ...getSlotStyle(styles, "stack"),
            ...stackSlot.style,
            ...stackStyle,
          }}
        >
          <NavigationStack
            initialName={initialTab}
            initialParams={initialParams}
            entries={stackEntries}
            onEntriesChange={setEntries}
            animation={animation}
            fallback={fallback}
            style={{
              height: "100%",
              minHeight: 0,
              minWidth: 0,
            }}
            screenStyle={{
              ...getSlotStyle(styles, "screen"),
              ...screenSlot.style,
              ...screenStyle,
            }}
          >
            {tabs.map((tab) => (
              <NavigationStack.Screen
                key={tab.value}
                name={tab.value}
                component={tab.component}
                render={
                  tab.render as
                  | ((
                    props: NavigationStackScreenRenderProps<any>
                  ) => React.ReactNode)
                  | undefined
                }
                element={tab.element}
              />
            ))}

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
      </MobileScaffold>
    </TabScaffoldContext.Provider>
  );
}

TabScaffold.displayName = "TabScaffold";