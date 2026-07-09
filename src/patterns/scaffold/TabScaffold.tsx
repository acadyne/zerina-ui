// src/patterns/scaffold/TabScaffold.tsx
import React from "react";
import { Box } from "../../primitives/layout";
import { IconButton } from "../../primitives/forms";
import {
    BottomNavigation,
    type BottomNavigationProps,
} from "../../primitives/navigation/BottomNavigation";
import {
    NavigationStack,
    type NavigationStackAnimation,
    type NavigationStackEntry,
    type NavigationStackParams,
    type NavigationStackScreenRenderProps,
} from "../navigation-stack";
import {
    MobileScaffold,
    type MobileScaffoldProps,
    type ScaffoldViewport,
} from "./MobileScaffold";
import { TopAppBar, type TopAppBarProps } from "./TopAppBar";

export type TabScaffoldHeaderValue =
    | React.ReactNode
    | ((context: TabScaffoldRenderContext) => React.ReactNode);

export interface TabScaffoldScreen {
    name: string;

    title?: TabScaffoldHeaderValue;
    subtitle?: TabScaffoldHeaderValue;

    component?: React.ComponentType<NavigationStackScreenRenderProps<any>>;

    render?: (
        props: NavigationStackScreenRenderProps<any>
    ) => React.ReactNode;

    element?: React.ReactNode;
}

export interface TabScaffoldTab extends Omit<TabScaffoldScreen, "name"> {
    value: string;

    label?: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;

    disabled?: boolean;
}

export interface TabScaffoldContextValue {
    entries: NavigationStackEntry[];
    current: NavigationStackEntry | null;
    activeTab: string;
    canGoBack: boolean;

    setEntries: (entries: NavigationStackEntry[]) => void;

    push: (name: string, params?: NavigationStackParams) => void;
    replace: (name: string, params?: NavigationStackParams) => void;
    pop: () => void;
    popToRoot: () => void;
    reset: (name: string, params?: NavigationStackParams) => void;
    resetToTab: (tab: string) => void;
}

export interface TabScaffoldRenderContext extends TabScaffoldContextValue {
    tabs: TabScaffoldTab[];
}

export interface TabScaffoldProps
    extends Omit<
        MobileScaffoldProps,
        | "children"
        | "viewport"
        | "appBar"
        | "bottomBar"
        | "bottomNavigation"
        | "floating"
        | "title"
    > {
    tabs: TabScaffoldTab[];
    screens?: TabScaffoldScreen[];

    viewport?: ScaffoldViewport;

    initialTab?: string;
    initialParams?: NavigationStackParams;

    entries?: NavigationStackEntry[];
    onEntriesChange?: (entries: NavigationStackEntry[]) => void;

    animation?: NavigationStackAnimation;

    showAppBar?: boolean;
    showBottomNavigation?: boolean;

    title?: TabScaffoldHeaderValue;
    subtitle?: TabScaffoldHeaderValue;

    rootLeading?: React.ReactNode | ((context: TabScaffoldRenderContext) => React.ReactNode);
    actions?: React.ReactNode | ((context: TabScaffoldRenderContext) => React.ReactNode);
    floating?: React.ReactNode | ((context: TabScaffoldRenderContext) => React.ReactNode);

    backIcon?: React.ReactNode;
    backAriaLabel?: string;

    renderAppBar?: (context: TabScaffoldRenderContext) => React.ReactNode;
    renderBottomNavigation?: (context: TabScaffoldRenderContext) => React.ReactNode;

    topAppBarProps?: Omit<
        TopAppBarProps,
        "title" | "subtitle" | "leading" | "actions"
    >;

    bottomNavigationProps?: Omit<
        BottomNavigationProps,
        "children" | "value" | "defaultValue" | "onValueChange"
    >;

    onTabChange?: (tab: string) => void;

    fallback?: React.ReactNode;

    stackStyle?: React.CSSProperties;
    screenStyle?: React.CSSProperties;
}

const TabScaffoldContext =
    React.createContext<TabScaffoldContextValue | null>(null);

export function useTabScaffold(): TabScaffoldContextValue {
    const context = React.useContext(TabScaffoldContext);

    if (!context) {
        throw new Error("useTabScaffold must be used inside <TabScaffold />");
    }

    return context;
}

function createEntry(
    name: string,
    params?: NavigationStackParams
): NavigationStackEntry {
    return {
        key: `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        params,
    };
}

function resolveHeaderValue(
    value: TabScaffoldHeaderValue | undefined,
    context: TabScaffoldRenderContext
): React.ReactNode {
    if (typeof value === "function") {
        return value(context);
    }

    return value;
}

function resolveSlot(
    value:
        | React.ReactNode
        | ((context: TabScaffoldRenderContext) => React.ReactNode)
        | undefined,
    context: TabScaffoldRenderContext
): React.ReactNode {
    if (typeof value === "function") {
        return value(context);
    }

    return value;
}

function getInitialTab(tabs: TabScaffoldTab[], initialTab?: string): string {
    if (initialTab && tabs.some((tab) => tab.value === initialTab)) {
        return initialTab;
    }

    return tabs[0]?.value ?? "";
}

function getActiveTab({
    entries,
    tabs,
    initialTab,
}: {
    entries: NavigationStackEntry[];
    tabs: TabScaffoldTab[];
    initialTab: string;
}): string {
    const root = entries[0];

    if (root && tabs.some((tab) => tab.value === root.name)) {
        return root.name;
    }

    return initialTab;
}

function getScreenMeta({
    currentName,
    activeTab,
    tabs,
    screens,
}: {
    currentName?: string | null;
    activeTab: string;
    tabs: TabScaffoldTab[];
    screens: TabScaffoldScreen[];
}): TabScaffoldScreen | TabScaffoldTab | null {
    if (!currentName) return null;

    const tab = tabs.find((item) => item.value === currentName);
    if (tab) return tab;

    const screen = screens.find((item) => item.name === currentName);
    if (screen) return screen;

    return tabs.find((item) => item.value === activeTab) ?? null;
}

function renderFallback() {
    return (
        <Box
            style={{
                height: "100%",
                minHeight: 0,
                display: "grid",
                placeItems: "center",
                padding: "1rem",
                color: "var(--ui-text-muted)",
                textAlign: "center",
            }}
        >
            TabScaffold necesita al menos un tab.
        </Box>
    );
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

    ...mobileScaffoldProps
}: TabScaffoldProps) {
    const initialTab = React.useMemo(
        () => getInitialTab(tabs, initialTabProp),
        [tabs, initialTabProp]
    );

    const initialEntryRef = React.useRef<NavigationStackEntry>(
        createEntry(initialTab, initialParams)
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
                    : [createEntry(initialTab, initialParams)];

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
                    createEntry(name, params),
                ]);
            },

            replace: (name, params) => {
                updateEntries((currentEntries) => [
                    ...currentEntries.slice(0, -1),
                    createEntry(name, params),
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
                    currentEntries[0] ?? createEntry(initialTab, initialParams),
                ]);
            },

            reset: (name, params) => {
                updateEntries([createEntry(name, params)]);
            },

            resetToTab: (tab) => {
                const target = tabs.find((item) => item.value === tab);
                if (!target || target.disabled) return;

                updateEntries([createEntry(tab)]);
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

    const activeMeta = getScreenMeta({
        currentName: current?.name,
        activeTab,
        tabs,
        screens,
    });

    const resolvedTitle =
        resolveHeaderValue(title, renderContext) ??
        resolveHeaderValue(activeMeta?.title, renderContext) ??
        tabs.find((tab) => tab.value === activeTab)?.label ??
        activeTab;

    const resolvedSubtitle =
        resolveHeaderValue(subtitle, renderContext) ??
        resolveHeaderValue(activeMeta?.subtitle, renderContext);

    const appBar = renderAppBar ? (
        renderAppBar(renderContext)
    ) : showAppBar ? (
        <TopAppBar
            title={resolvedTitle}
            subtitle={resolvedSubtitle}
            centerTitle
            variant="blur"
            leading={
                canGoBack ? (
                    <IconButton
                        ariaLabel={backAriaLabel}
                        size="sm"
                        variant="ghost"
                        icon={backIcon}
                        onClick={contextValue.pop}
                    />
                ) : (
                    resolveSlot(rootLeading, renderContext)
                )
            }
            actions={resolveSlot(actions, renderContext)}
            {...topAppBarProps}
        />
    ) : null;

    const bottomNavigation = renderBottomNavigation ? (
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

    const floatingContent = resolveSlot(floating, renderContext);

    if (tabs.length === 0 || !initialTab) {
        return (
            <MobileScaffold
                viewport={viewport}
                scrollable={false}
                padded={false}
                {...mobileScaffoldProps}
            >
                {fallback ?? renderFallback()}
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
                floating={floatingContent}
                {...mobileScaffoldProps}
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
                        ...stackStyle,
                    }}
                    screenStyle={screenStyle}
                >
                    {tabs.map((tab) => (
                        <NavigationStack.Screen
                            key={tab.value}
                            name={tab.value}
                            component={tab.component}
                            render={tab.render}
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
            </MobileScaffold>
        </TabScaffoldContext.Provider>
    );
}

TabScaffold.displayName = "TabScaffold";