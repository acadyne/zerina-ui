// src/patterns/navigation-stack/NavigationStack.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOptionalUIMotion } from "../../core/motion";
import { Box } from "../../primitives/layout";

const NAVIGATION_STACK_SCREEN_MARKER = "__ZERINA_NAVIGATION_STACK_SCREEN__";

export type NavigationStackParams = Record<string, unknown>;

export type NavigationStackAnimation = "slide" | "fade" | "none";

export interface NavigationStackEntry<
  TParams extends NavigationStackParams = NavigationStackParams,
> {
  key: string;
  name: string;
  params?: TParams;
}

export interface NavigationStackState {
  entries: NavigationStackEntry[];
  current: NavigationStackEntry | null;
  index: number;
  canGoBack: boolean;
}

export interface NavigationStackContextValue extends NavigationStackState {
  push: (name: string, params?: NavigationStackParams) => void;
  replace: (name: string, params?: NavigationStackParams) => void;
  pop: () => void;
  popToRoot: () => void;
  reset: (name: string, params?: NavigationStackParams) => void;
}

export interface NavigationStackScreenRenderProps<
  TParams extends NavigationStackParams = NavigationStackParams,
> {
  navigation: NavigationStackContextValue;
  route: NavigationStackEntry<TParams>;
}

export interface NavigationStackScreenProps<
  TParams extends NavigationStackParams = NavigationStackParams,
> {
  name: string;

  /**
   * Título opcional para introspección o headers custom.
   */
  title?: React.ReactNode;

  /**
   * Componente que recibe navigation + route.
   */
  component?: React.ComponentType<NavigationStackScreenRenderProps<TParams>>;

  /**
   * Render prop que recibe navigation + route.
   */
  render?: (
    props: NavigationStackScreenRenderProps<TParams>
  ) => React.ReactNode;

  /**
   * Elemento directo. Útil para pantallas simples.
   */
  element?: React.ReactNode;
}

export interface NavigationStackProps {
  children?: React.ReactNode;

  /**
   * Pantalla inicial.
   */
  initialName: string;

  /**
   * Params iniciales.
   */
  initialParams?: NavigationStackParams;

  /**
   * Estado controlado opcional.
   */
  entries?: NavigationStackEntry[];

  /**
   * Cambio de stack cuando se usa controlado o no controlado.
   */
  onEntriesChange?: (entries: NavigationStackEntry[]) => void;

  /**
   * Animación entre pantallas.
   */
  animation?: NavigationStackAnimation;

  /**
   * Qué renderizar si no existe la pantalla actual.
   */
  fallback?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  screenStyle?: React.CSSProperties;
}

type RegisteredScreen = {
  name: string;
  title?: React.ReactNode;
  component?: React.ComponentType<any>;
  render?: (props: NavigationStackScreenRenderProps<any>) => React.ReactNode;
  element?: React.ReactNode;
};

type NavigationStackComponent = React.FC<NavigationStackProps> & {
  Screen: React.FC<NavigationStackScreenProps>;
};

export const NavigationStackContext =
  React.createContext<NavigationStackContextValue | null>(null);

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

function isNavigationStackScreenElement(
  child: React.ReactNode
): child is React.ReactElement<NavigationStackScreenProps> {
  return (
    React.isValidElement(child) &&
    Boolean((child.type as any)?.[NAVIGATION_STACK_SCREEN_MARKER])
  );
}

function collectScreens(children: React.ReactNode): Map<string, RegisteredScreen> {
  const screens = new Map<string, RegisteredScreen>();

  React.Children.forEach(children, (child) => {
    if (!isNavigationStackScreenElement(child)) return;

    const { name, title, component, render, element } = child.props;

    screens.set(name, {
      name,
      title,
      component,
      render,
      element,
    });
  });

  return screens;
}

function getVariants(animation: NavigationStackAnimation) {
  if (animation === "fade") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  if (animation === "none") {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    };
  }

  return {
    initial: { x: "100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-18%", opacity: 0.92 },
  };
}

function renderMissingScreen(name: string) {
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
      NavigationStack: no existe una pantalla registrada con name="{name}".
    </Box>
  );
}

export function useNavigationStack(): NavigationStackContextValue {
  const context = React.useContext(NavigationStackContext);

  if (!context) {
    throw new Error(
      "useNavigationStack must be used inside <NavigationStack />"
    );
  }

  return context;
}

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
  screenStyle,
}: NavigationStackProps) {
  const isControlled = entries !== undefined;

  const initialEntryRef = React.useRef<NavigationStackEntry>(
    createEntry(initialName, initialParams)
  );

  const [internalEntries, setInternalEntries] = React.useState<
    NavigationStackEntry[]
  >([initialEntryRef.current]);

  const stackEntries = isControlled ? entries : internalEntries;

  const screens = React.useMemo(() => collectScreens(children), [children]);

  const motionState = useOptionalUIMotion();
  const effectiveMotionLevel = motionState?.effectiveLevel ?? "subtle";
  const shouldAnimate =
    animation !== "none" && (motionState?.shouldAnimate ?? true);

  const transition = motionState?.getTransition(
    effectiveMotionLevel,
    animation === "fade" ? "fade" : "slide"
  );

  const setEntries = React.useCallback(
    (nextEntries: NavigationStackEntry[]) => {
      const normalizedEntries =
        nextEntries.length > 0 ? nextEntries : [createEntry(initialName)];

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
        setEntries([...stackEntries, createEntry(name, params)]);
      },

      replace: (name, params) => {
        setEntries([...stackEntries.slice(0, -1), createEntry(name, params)]);
      },

      pop: () => {
        if (stackEntries.length <= 1) return;
        setEntries(stackEntries.slice(0, -1));
      },

      popToRoot: () => {
        setEntries([stackEntries[0] ?? createEntry(initialName)]);
      },

      reset: (name, params) => {
        setEntries([createEntry(name, params)]);
      },
    }),
    [stackEntries, current, currentIndex, canGoBack, setEntries, initialName]
  );

  const activeScreen = current ? screens.get(current.name) : null;

  const screenContent = React.useMemo(() => {
    if (!current) return null;

    if (!activeScreen) {
      return fallback ?? renderMissingScreen(current.name);
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

  const variants = getVariants(shouldAnimate ? animation : "none");

  return (
    <NavigationStackContext.Provider value={navigation}>
      <Box
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
          background: "var(--ui-bg)",
          color: "var(--ui-text)",
          ...style,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {current ? (
            <motion.div
              key={current.key}
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={transition}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
                ...screenStyle,
              }}
            >
              {screenContent}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Box>
    </NavigationStackContext.Provider>
  );
};

const NavigationStackScreen = function NavigationStackScreen(
  _props: NavigationStackScreenProps
) {
  return null;
};

Object.defineProperty(NavigationStackScreen, NAVIGATION_STACK_SCREEN_MARKER, {
  value: true,
});

export const NavigationStack = Object.assign(NavigationStackRoot, {
  Screen: NavigationStackScreen,
}) as NavigationStackComponent;

NavigationStack.displayName = "NavigationStack";
NavigationStack.Screen.displayName = "NavigationStack.Screen";