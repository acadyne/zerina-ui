import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  Button,
  FloatingActionButton,
  IconButton,
  List,
  Pressable,
} from "zerina-ui";

import "zerina-ui/styles.css";


type Block7Snapshot = {
  disabledPresses:
    number;

  loadingPresses:
    number;

  genericPresses:
    number;

  listPresses:
    number;
};


type Block7Harness = {
  setLoading:
    (
      loading: boolean,
    ) => void;

  snapshot:
    () => Block7Snapshot;
};


declare global {
  interface Window {
    block7Harness:
      Block7Harness;
  }
}


const metrics = {
  disabledPresses:
    0,

  loadingPresses:
    0,

  genericPresses:
    0,

  listPresses:
    0,
};


const unavailable = () => {
  throw new Error(
    "Block 7 harness is not mounted.",
  );
};


window.block7Harness = {
  setLoading:
    unavailable,

  snapshot() {
    return {
      ...metrics,
    };
  },
};


const tokens = {
  "--ui-bg":
    "rgb(255, 255, 255)",

  "--ui-surface":
    "rgb(255, 255, 255)",

  "--ui-surface-hover":
    "rgb(232, 236, 244)",

  "--ui-surface-3":
    "rgb(218, 224, 235)",

  "--ui-text":
    "rgb(20, 20, 20)",

  "--ui-text-muted":
    "rgb(75, 75, 75)",

  "--ui-border":
    "rgb(105, 105, 105)",

  "--ui-primary":
    "rgb(20, 80, 180)",

  "--ui-primary-hover":
    "rgb(14, 58, 145)",

  "--ui-primary-contrast":
    "rgb(255, 255, 255)",

  "--ui-secondary":
    "rgb(100, 35, 145)",

  "--ui-secondary-hover":
    "rgb(75, 22, 115)",

  "--ui-secondary-contrast":
    "rgb(255, 255, 255)",

  "--ui-danger":
    "rgb(165, 20, 20)",

  "--ui-danger-hover":
    "rgb(128, 12, 12)",

  "--ui-danger-contrast":
    "rgb(255, 255, 255)",

  "--ui-interaction-focus-ring-color":
    "rgb(20, 80, 180)",

  "--ui-interaction-focus-ring-width":
    "2px",

  "--ui-interaction-focus-ring-offset":
    "2px",

  "--ui-interaction-disabled-opacity":
    "0.45",

  "--ui-control-h-sm":
    "32px",

  "--ui-control-h-md":
    "40px",

  "--ui-control-h-lg":
    "48px",

  "--ui-control-height-sm":
    "32px",

  "--ui-control-height-md":
    "40px",

  "--ui-control-height-lg":
    "48px",

  "--ui-control-min-height-sm":
    "32px",

  "--ui-control-min-height-md":
    "40px",

  "--ui-control-min-height-lg":
    "48px",

  "--ui-control-padding-x-sm":
    "12px",

  "--ui-control-padding-x-md":
    "16px",

  "--ui-control-padding-x-lg":
    "20px",

  "--ui-control-padding-y-sm":
    "6px",

  "--ui-control-padding-y-md":
    "8px",

  "--ui-control-padding-y-lg":
    "10px",

  "--ui-font-size-sm":
    "14px",

  "--ui-font-size-md":
    "16px",

  "--ui-font-size-lg":
    "18px",

  "--ui-radius-sm":
    "6px",

  "--ui-radius-md":
    "8px",

  "--ui-radius-lg":
    "10px",

  "--ui-radius-full":
    "9999px",

  "--ui-shadow-action":
    "0 2px 4px rgba(0, 0, 0, 0.28)",

  "--ui-shadow-action-hover":
    "0 4px 8px rgba(0, 0, 0, 0.32)",

  "--ui-shadow-action-outline-hover":
    "0 2px 5px rgba(0, 0, 0, 0.24)",

  "--ui-shadow-action-subtle-hover":
    "0 2px 5px rgba(0, 0, 0, 0.2)",

  "--ui-shadow-control":
    "0 1px 3px rgba(0, 0, 0, 0.24)",

  "--ui-shadow-md":
    "0 4px 10px rgba(0, 0, 0, 0.3)",

  "--ui-shadow-lg":
    "0 8px 18px rgba(0, 0, 0, 0.34)",

  "--ui-duration-instant":
    "0ms",

  "--ui-duration-fast":
    "0ms",

  "--ui-duration-normal":
    "0ms",

  "--ui-ease-standard":
    "linear",
} as React.CSSProperties;


const sectionStyle:
  React.CSSProperties = {
    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-start",

    gap:
      "12px",

    padding:
      "16px",

    border:
      "1px solid var(--ui-border)",

    borderRadius:
      "10px",
  };


const rowStyle:
  React.CSSProperties = {
    display:
      "flex",

    alignItems:
      "center",

    flexWrap:
      "wrap",

    gap:
      "16px",
  };


function App() {
  const [
    loading,
    setLoading,
  ] = React.useState(
    true,
  );


  React.useEffect(
    () => {
      window.block7Harness = {
        setLoading,

        snapshot() {
          return {
            ...metrics,
          };
        },
      };
    },
    [],
  );


  return (
    <main
      style={{
        ...tokens,

        display:
          "flex",

        flexDirection:
          "column",

        gap:
          "20px",

        padding:
          "24px",

        maxWidth:
          "1100px",

        color:
          "var(--ui-text)",

        background:
          "var(--ui-bg)",
      }}
    >
      <section style={sectionStyle}>
        <div style={rowStyle}>
          <Button
            data-testid="block7-generic-button"
            onPress={() => {
              metrics.genericPresses +=
                1;
            }}
          >
            Generic button
          </Button>

          <IconButton
            data-testid="block7-generic-icon"
            ariaLabel="Generic icon"
            icon="I"
            onPress={() => {
              metrics.genericPresses +=
                1;
            }}
          />

          <Pressable
            data-testid="block7-generic-pressable"
            onPress={() => {
              metrics.genericPresses +=
                1;
            }}
          >
            Generic pressable
          </Pressable>
        </div>

        <div style={rowStyle}>
          <Pressable
            data-testid="block7-touch-target"
          >
            Touch target
          </Pressable>

          <Pressable
            data-testid="block7-pen-target"
          >
            Pen target
          </Pressable>
        </div>
      </section>

      <section style={sectionStyle}>
        <Button
          data-testid="block7-keyboard-button"
          onPress={() => {
            metrics.genericPresses +=
              1;
          }}
        >
          Keyboard pressed
        </Button>

        <Button
          data-testid="block7-disabled-button"
          disabled
          onPress={() => {
            metrics.disabledPresses +=
              1;
          }}
        >
          Disabled
        </Button>
      </section>

      <section style={sectionStyle}>
        <button
          data-testid="block7-focus-start"
          type="button"
        >
          Focus start
        </button>

        <Button
          data-testid="block7-keyboard-focus"
        >
          Keyboard focus
        </Button>

        <Button
          data-testid="block7-pointer-focus"
        >
          Pointer focus
        </Button>
      </section>

      <section style={sectionStyle}>
        <button
          data-testid="block7-shadow-start"
          type="button"
        >
          Shadow start
        </button>

        <Button
          data-testid="block7-custom-shadow"
          style={{
            boxShadow:
              "5px 6px 7px rgba(10, 20, 30, 0.8)",
          }}
        >
          Custom shadow
        </Button>
      </section>

      <section style={sectionStyle}>
        <Button
          data-testid="block7-loading-button"
          isLoading={loading}
          loadingText="Working"
          onPress={() => {
            metrics.loadingPresses +=
              1;
          }}
        >
          Ready
        </Button>
      </section>

      <section style={sectionStyle}>
        {(
          [
            "solid",
            "outline",
            "ghost",
          ] as const
        ).map(
          (
            variant,
          ) => (
            <div
              key={variant}
              style={rowStyle}
            >
              {(
                [
                  "primary",
                  "secondary",
                  "danger",
                ] as const
              ).map(
                (
                  colorScheme,
                ) => (
                  <Button
                    key={`${variant}-${colorScheme}`}
                    data-testid={`block7-contrast-${variant}-${colorScheme}`}
                    variant={variant}
                    colorScheme={colorScheme}
                  >
                    {variant} {colorScheme}
                  </Button>
                ),
              )}
            </div>
          ),
        )}
      </section>

      <section style={sectionStyle}>
        {(
          [
            "sm",
            "md",
            "lg",
          ] as const
        ).map(
          (
            size,
          ) => (
            <div
              key={size}
              style={rowStyle}
            >
              <Button
                data-testid={`block7-size-button-${size}`}
                size={size}
              >
                Button {size}
              </Button>

              <IconButton
                data-testid={`block7-size-icon-${size}`}
                ariaLabel={`Icon ${size}`}
                icon="I"
                size={size}
              />
            </div>
          ),
        )}
      </section>

      <section style={sectionStyle}>
        <button
          data-testid="block7-list-focus-start"
          type="button"
        >
          List focus start
        </button>

        <List>
          <List.Item
            data-testid="block7-list-item"
            onPress={() => {
              metrics.listPresses +=
                1;
            }}
          >
            Interactive list item
          </List.Item>
        </List>
      </section>

      <section style={sectionStyle}>
        <button
          data-testid="block7-fab-focus-start"
          type="button"
        >
          FAB focus start
        </button>

        <FloatingActionButton
          data-testid="block7-fab"
          icon="+"
          label="Create"
        />
      </section>
    </main>
  );
}


const container =
  document.getElementById(
    "root",
  );


if (!container) {
  throw new Error(
    "Block 7 browser root was not found.",
  );
}


createRoot(
  container,
).render(
  <App />,
);
