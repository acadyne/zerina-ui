import {
  createRoot,
} from "react-dom/client";

import {
  Box,
  Heading,
  RoutedAdaptiveScaffold,
  ScreenContent,
  ZerinaProvider,
  type NavigationLinkMeta,
  type NavigationNode,
} from "zerina-ui";

import "zerina-ui/styles.css";


type FixtureMode =
  | "mobile"
  | "tablet"
  | "desktop";


const params =
  new URLSearchParams(
    window.location.search,
  );


const modeParam =
  params.get(
    "mode",
  );


const mode:
  FixtureMode =
  modeParam ===
    "mobile" ||
  modeParam ===
    "tablet" ||
  modeParam ===
    "desktop"
    ? modeParam
    : "desktop";


const showAppBar =
  params.get(
    "appBar",
  ) !==
  "0";


const tallContent =
  params.get(
    "content",
  ) ===
  "tall";


const contained =
  params.get(
    "viewport",
  ) ===
  "contained";


const items:
  NavigationNode<NavigationLinkMeta>[] = [
    {
      id:
        "home",

      label:
        "Inicio",

      meta: {
        href:
          "/home",
      },
    },

    {
      id:
        "reports",

      label:
        "Reportes",

      meta: {
        href:
          "/reports",
      },
    },
  ];


function Shell() {
  return (
    <RoutedAdaptiveScaffold
      viewport={
        contained
          ? "contained"
          : "window"
      }
      mode={mode}
      showAppBar={
        showAppBar
      }
      title="Layout shell"
      items={items}
      activeId="home"
      navigation={{
        mobile: {
          presentation:
            "bottom",

          placement:
            "bottom",
        },

        tablet: {
          presentation:
            "rail",

          placement:
            "start",
        },

        desktop: {
          presentation:
            "sidebar",

          placement:
            "start",
        },
      }}
      slotProps={{
        root: {
          "data-testid":
            "adaptive-root",
        },

        body: {
          "data-testid":
            "adaptive-body",
        },

        sidebar: {
          "data-testid":
            "adaptive-sidebar",
        },

        rail: {
          "data-testid":
            "adaptive-rail",
        },

        mobileNavigation: {
          "data-testid":
            "adaptive-mobile-navigation",
        },

        content: {
          "data-testid":
            "adaptive-content",
        },
      }}
    >
      <ScreenContent
        padded
        scrollable
        slotProps={{
          root: {
            "data-testid":
              "screen-content",
          },
        }}
      >
        <Heading
          size="sm"
        >
          Hola
        </Heading>

        {tallContent ? (
          <Box
            data-testid="tall-content"
            style={{
              height:
                1200,

              minHeight:
                1200,
            }}
          />
        ) : null}
      </ScreenContent>
    </RoutedAdaptiveScaffold>
  );
}


function App() {
  const shell =
    <Shell />;

  return (
    <ZerinaProvider
      theme={{
        persist:
          false,
      }}
    >
      {contained ? (
        <Box
          data-testid="contained-host"
          style={{
            width:
              "100%",

            height:
              640,

            minWidth:
              0,

            minHeight:
              0,
          }}
        >
          {shell}
        </Box>
      ) : shell}
    </ZerinaProvider>
  );
}


const container =
  document.getElementById(
    "root",
  );


if (!container) {
  throw new Error(
    "Missing #root",
  );
}


createRoot(
  container,
).render(
  <App />,
);
