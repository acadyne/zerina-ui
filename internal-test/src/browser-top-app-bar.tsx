import {
  createRoot,
} from "react-dom/client";

import {
  Button,
  HStack,
  IconButton,
  TopAppBar,
  ZerinaProvider,
} from "zerina-ui";

import "zerina-ui/styles.css";


function App() {
  return (
    <ZerinaProvider
      theme={{
        persist:
          false,
      }}
    >
      <main
        data-testid="top-app-bar-layout-host"
        style={{
          width:
            "100%",

          minWidth:
            0,
        }}
      >
        <TopAppBar
          centerTitle
          title="Login"
          subtitle="Navigation Sandbox"
          leading={
            <IconButton
              ariaLabel="Volver"
              size="sm"
              variant="ghost"
              icon="‹"
            />
          }
          actions={
            <HStack
              spacing="0.25rem"
              align="center"
            >
              <Button
                size="sm"
                variant="outline"
              >
                Apariencia
              </Button>

              <IconButton
                ariaLabel="Más acciones"
                size="sm"
                variant="ghost"
                icon="⋯"
              />
            </HStack>
          }
          slotProps={{
            content: {
              "data-testid":
                "top-app-bar-content",
            },

            leading: {
              "data-testid":
                "top-app-bar-leading",
            },

            center: {
              "data-testid":
                "top-app-bar-center",
            },

            actions: {
              "data-testid":
                "top-app-bar-actions",
            },
          }}
        />
      </main>
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
