import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  Checkbox,
  Radio,
  Switch,
} from "zerina-ui";

import "zerina-ui/styles.css";


type Block6Snapshot = {
  readOnlyChanges:
    number;
};


declare global {
  interface Window {
    block6Harness: {
      snapshot:
        () => Block6Snapshot;
    };
  }
}


const metrics = {
  readOnlyChanges:
    0,
};


window.block6Harness = {
  snapshot() {
    return {
      readOnlyChanges:
        metrics.readOnlyChanges,
    };
  },
};


const tokens = {
  "--ui-surface-canvas":
    "rgb(255, 255, 255)",

  "--ui-surface":
    "rgb(245, 246, 248)",

  "--ui-surface-hover":
    "rgb(235, 237, 242)",

  "--ui-text":
    "rgb(20, 20, 20)",

  "--ui-text-muted":
    "rgb(80, 80, 80)",

  "--ui-border":
    "rgb(110, 110, 110)",

  "--ui-primary":
    "rgb(20, 80, 180)",

  "--ui-primary-contrast":
    "rgb(255, 255, 255)",

  "--ui-secondary":
    "rgb(120, 50, 170)",

  "--ui-secondary-contrast":
    "rgb(255, 255, 255)",

  "--ui-danger":
    "rgb(190, 20, 20)",

  "--ui-danger-contrast":
    "rgb(255, 255, 255)",

  "--ui-interaction-focus-ring-color":
    "rgb(20, 80, 180)",

  "--ui-interaction-focus-ring-danger-color":
    "rgb(190, 20, 20)",

  "--ui-interaction-focus-ring-width":
    "2px",

  "--ui-interaction-focus-ring-offset":
    "1px",

  "--ui-interaction-disabled-opacity":
    "0.45",

  "--ui-duration-fast":
    "0ms",

  "--ui-duration-normal":
    "0ms",

  "--ui-ease-standard":
    "linear",

  "--ui-radius-sm":
    "4px",

  "--ui-radius-md":
    "8px",

  "--ui-radius-full":
    "9999px",
} as React.CSSProperties;


const sectionStyle:
  React.CSSProperties = {
    display:
      "flex",

    flexDirection:
      "column",

    gap:
      "12px",

    padding:
      "16px",

    border:
      "1px solid var(--ui-border)",

    borderRadius:
      "8px",
  };


const rowStyle:
  React.CSSProperties = {
    display:
      "flex",

    alignItems:
      "center",

    gap:
      "20px",

    flexWrap:
      "wrap",
  };


function App() {
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
          "960px",

        color:
          "var(--ui-text)",

        background:
          "var(--ui-surface-canvas)",
      }}
    >
      <section style={sectionStyle}>
        <button
          type="button"
          data-testid="block6-focus-start"
        >
          Focus start
        </button>

        <Checkbox
          data-testid="block6-focus-checkbox"
          label="Keyboard focus"
        />

        <button
          type="button"
          data-testid="block6-invalid-start"
        >
          Invalid start
        </button>

        <Checkbox
          data-testid="block6-invalid-checkbox"
          label="Invalid keyboard focus"
          invalid
        />
      </section>

      <section style={sectionStyle}>
        <div style={rowStyle}>
          <Checkbox
            data-testid="block6-checked-checkbox"
            checked
            label="Checked checkbox"
            slotProps={{
              mark: {
                "data-testid":
                  "block6-checked-mark",
              },
            }}
          />

          <Checkbox
            data-testid="block6-indeterminate-checkbox"
            indeterminate
            label="Indeterminate checkbox"
            slotProps={{
              mark: {
                "data-testid":
                  "block6-indeterminate-mark",
              },
            }}
          />

          <Radio
            data-testid="block6-checked-radio"
            checked
            label="Checked radio"
            slotProps={{
              indicatorDot: {
                "data-testid":
                  "block6-radio-dot",
              },
            }}
          />
        </div>

        <Switch
          data-testid="block6-moving-switch"
          defaultChecked={false}
          label="Moving switch"
          slotProps={{
            track: {
              "data-testid":
                "block6-moving-track",
            },

            thumb: {
              "data-testid":
                "block6-moving-thumb",
            },
          }}
        />
      </section>

      <section style={sectionStyle}>
        <button
          type="button"
          data-testid="block6-readonly-start"
        >
          Read-only start
        </button>

        <Checkbox
          data-testid="block6-readonly-checkbox"
          checked={false}
          readOnly
          label="Read-only checkbox"
          onChange={() => {
            metrics.readOnlyChanges +=
              1;
          }}
        />

        <div style={rowStyle}>
          <Checkbox
            data-testid="block6-disabled-checkbox"
            disabled
            label="Disabled checkbox"
          />

          <Radio
            data-testid="block6-disabled-radio"
            disabled
            label="Disabled radio"
          />

          <Switch
            data-testid="block6-disabled-switch"
            disabled
            label="Disabled switch"
            slotProps={{
              track: {
                "data-testid":
                  "block6-disabled-switch-track",
              },
            }}
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <Checkbox
          data-testid="block6-checkbox-start"
          label="Checkbox start"
          labelPlacement="start"
          slotProps={{
            control: {
              "data-testid":
                "block6-checkbox-start-control",
            },

            label: {
              "data-testid":
                "block6-checkbox-start-label",
            },
          }}
        />

        <Checkbox
          data-testid="block6-checkbox-end"
          label="Checkbox end"
          labelPlacement="end"
          slotProps={{
            control: {
              "data-testid":
                "block6-checkbox-end-control",
            },

            label: {
              "data-testid":
                "block6-checkbox-end-label",
            },
          }}
        />

        <Radio
          data-testid="block6-radio-start"
          label="Radio start"
          labelPlacement="start"
          slotProps={{
            control: {
              "data-testid":
                "block6-radio-start-control",
            },

            label: {
              "data-testid":
                "block6-radio-start-label",
            },
          }}
        />

        <Radio
          data-testid="block6-radio-end"
          label="Radio end"
          labelPlacement="end"
          slotProps={{
            control: {
              "data-testid":
                "block6-radio-end-control",
            },

            label: {
              "data-testid":
                "block6-radio-end-label",
            },
          }}
        />

        <Switch
          data-testid="block6-switch-start"
          label="Switch start"
          labelPlacement="start"
          slotProps={{
            track: {
              "data-testid":
                "block6-switch-start-control",
            },

            label: {
              "data-testid":
                "block6-switch-start-label",
            },
          }}
        />

        <Switch
          data-testid="block6-switch-end"
          label="Switch end"
          labelPlacement="end"
          slotProps={{
            track: {
              "data-testid":
                "block6-switch-end-control",
            },

            label: {
              "data-testid":
                "block6-switch-end-label",
            },
          }}
        />
      </section>

      <section style={sectionStyle}>
        <div style={rowStyle}>
          <Checkbox
            data-testid="block6-checkbox-sm"
            size="sm"
          />

          <Checkbox
            data-testid="block6-checkbox-md"
            size="md"
          />

          <Checkbox
            data-testid="block6-checkbox-lg"
            size="lg"
          />
        </div>

        <div style={rowStyle}>
          <Radio
            data-testid="block6-radio-sm"
            size="sm"
          />

          <Radio
            data-testid="block6-radio-md"
            size="md"
          />

          <Radio
            data-testid="block6-radio-lg"
            size="lg"
          />
        </div>

        <div style={rowStyle}>
          <Switch
            data-testid="block6-switch-sm"
            size="sm"
            slotProps={{
              track: {
                "data-testid":
                  "block6-switch-track-sm",
              },
            }}
          />

          <Switch
            data-testid="block6-switch-md"
            size="md"
            slotProps={{
              track: {
                "data-testid":
                  "block6-switch-track-md",
              },
            }}
          />

          <Switch
            data-testid="block6-switch-lg"
            size="lg"
            slotProps={{
              track: {
                "data-testid":
                  "block6-switch-track-lg",
              },
            }}
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={rowStyle}>
          <Checkbox
            data-testid="block6-checkbox-primary"
            checked
            colorScheme="primary"
          />

          <Checkbox
            data-testid="block6-checkbox-secondary"
            checked
            colorScheme="secondary"
          />

          <Checkbox
            data-testid="block6-checkbox-danger"
            checked
            colorScheme="danger"
          />
        </div>

        <div style={rowStyle}>
          <Radio
            data-testid="block6-radio-primary"
            checked
            colorScheme="primary"
          />

          <Radio
            data-testid="block6-radio-secondary"
            checked
            colorScheme="secondary"
          />

          <Radio
            data-testid="block6-radio-danger"
            checked
            colorScheme="danger"
          />
        </div>

        <div style={rowStyle}>
          <Switch
            data-testid="block6-switch-primary"
            checked
            colorScheme="primary"
          />

          <Switch
            data-testid="block6-switch-secondary"
            checked
            colorScheme="secondary"
          />

          <Switch
            data-testid="block6-switch-danger"
            checked
            colorScheme="danger"
          />
        </div>
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
    "Block 6 browser root was not found.",
  );
}


createRoot(
  container,
).render(
  <App />,
);
