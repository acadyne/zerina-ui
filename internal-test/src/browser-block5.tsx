import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  Input,
  InputAdornment,
  InputGroup,
  PasswordInput,
  SearchInput,
  Select,
  Textarea,
} from "zerina-ui";

import "zerina-ui/styles.css";


type Block5Snapshot = {
  controlledClears: number;
  controlledValues:
    readonly string[];

  uncontrolledClears: number;
  uncontrolledValues:
    readonly string[];
};


type Block5Harness = {
  setStartWidth:
    (
      width: number,
    ) => void;

  setEndWidth:
    (
      width: number,
    ) => void;

  setSecondStartMounted:
    (
      mounted: boolean,
    ) => void;

  snapshot:
    () => Block5Snapshot;
};


declare global {
  interface Window {
    block5Harness:
      Block5Harness;
  }
}


const metrics = {
  controlledClears:
    0,

  controlledValues:
    [] as string[],

  uncontrolledClears:
    0,

  uncontrolledValues:
    [] as string[],
};


const unavailable = () => {
  throw new Error(
    "Block 5 harness is not mounted.",
  );
};


window.block5Harness = {
  setStartWidth:
    unavailable,

  setEndWidth:
    unavailable,

  setSecondStartMounted:
    unavailable,

  snapshot() {
    return {
      controlledClears:
        metrics.controlledClears,

      controlledValues:
        [
          ...metrics
            .controlledValues,
        ],

      uncontrolledClears:
        metrics.uncontrolledClears,

      uncontrolledValues:
        [
          ...metrics
            .uncontrolledValues,
        ],
    };
  },
};


const tokens = {
  "--ui-surface":
    "rgb(255, 255, 255)",

  "--ui-surface-hover":
    "rgb(238, 240, 245)",

  "--ui-text":
    "rgb(20, 20, 20)",

  "--ui-text-muted":
    "rgb(80, 80, 80)",

  "--ui-border":
    "rgb(110, 110, 110)",

  "--ui-primary":
    "rgb(20, 80, 180)",

  "--ui-danger":
    "rgb(190, 20, 20)",

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

  "--ui-control-padding-x-sm":
    "8px",

  "--ui-control-padding-x-md":
    "12px",

  "--ui-control-padding-x-lg":
    "16px",

  "--ui-duration-fast":
    "0ms",

  "--ui-duration-normal":
    "0ms",

  "--ui-ease-standard":
    "linear",
} as React.CSSProperties;


function App() {
  const [
    startWidth,
    setStartWidth,
  ] = React.useState(
    24,
  );

  const [
    endWidth,
    setEndWidth,
  ] = React.useState(
    36,
  );

  const [
    secondStartMounted,
    setSecondStartMounted,
  ] = React.useState(
    true,
  );

  const [
    controlledSearch,
    setControlledSearch,
  ] = React.useState(
    "controlled query",
  );


  React.useEffect(() => {
    window.block5Harness = {
      setStartWidth,
      setEndWidth,
      setSecondStartMounted,

      snapshot() {
        return {
          controlledClears:
            metrics.controlledClears,

          controlledValues:
            [
              ...metrics
                .controlledValues,
            ],

          uncontrolledClears:
            metrics.uncontrolledClears,

          uncontrolledValues:
            [
              ...metrics
                .uncontrolledValues,
            ],
        };
      },
    };
  }, []);


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
          "720px",
      }}
    >
      <section>
        <InputGroup
          data-testid="block5-layout-group"
        >
          <InputAdornment
            data-testid="block5-start-1"
            position="start"
            width={`${startWidth}px`}
          >
            A
          </InputAdornment>

          {secondStartMounted ? (
            <InputAdornment
              data-testid="block5-start-2"
              position="start"
              width="30px"
            >
              B
            </InputAdornment>
          ) : null}

          <Input
            data-testid="block5-layout-input"
            aria-label="Layout input"
            size="md"
          />

          <InputAdornment
            data-testid="block5-end-1"
            position="end"
            width={`${endWidth}px`}
          >
            E1
          </InputAdornment>

          <InputAdornment
            data-testid="block5-end-2"
            position="end"
            width="18px"
          >
            E2
          </InputAdornment>
        </InputGroup>
      </section>

      <section>
        <InputGroup
          data-testid="block5-textarea-group"
        >
          <InputAdornment
            data-testid="block5-textarea-start"
            position="start"
            width="20px"
          >
            T
          </InputAdornment>

          <Textarea
            data-testid="block5-textarea"
            aria-label="Grouped textarea"
            size="md"
          />

          <InputAdornment
            data-testid="block5-textarea-end"
            position="end"
            width="22px"
          >
            E
          </InputAdornment>
        </InputGroup>
      </section>

      <section>
        <InputGroup
          data-testid="block5-select-group"
        >
          <InputAdornment
            data-testid="block5-select-start"
            position="start"
            width="20px"
          >
            S
          </InputAdornment>

          <Select
            data-testid="block5-select"
            aria-label="Grouped select"
            size="md"
            value="a"
            onChange={() => {}}
            options={[
              {
                label:
                  "Option A",

                value:
                  "a",
              },
            ]}
          />

          <InputAdornment
            data-testid="block5-select-end"
            position="end"
            width="28px"
          >
            E
          </InputAdornment>
        </InputGroup>
      </section>

      <button
        data-testid="block5-focus-start"
        type="button"
      >
        Focus start
      </button>

      <InputGroup
        data-testid="block5-focus-group"
      >
        <Input
          data-testid="block5-focus-input"
          aria-label="Focus input"
        />
      </InputGroup>

      <button
        data-testid="block5-invalid-start"
        type="button"
      >
        Invalid start
      </button>

      <InputGroup
        data-testid="block5-invalid-group"
        invalid
      >
        <Input
          data-testid="block5-invalid-input"
          aria-label="Invalid input"
        />
      </InputGroup>

      <PasswordInput
        data-testid="block5-disabled-password"
        disabled
        slotProps={{
          group: {
            "data-testid":
              "block5-disabled-group",
          },

          toggleButton: {
            "data-testid":
              "block5-disabled-toggle",
          },
        }}
      />

      <SearchInput
        data-testid="block5-controlled-search"
        value={controlledSearch}
        slotProps={{
          clearButton: {
            "data-testid":
              "block5-controlled-clear",
          },
        }}
        onClear={() => {
          metrics
            .controlledClears +=
            1;
        }}
        onValueChange={(
          nextValue,
        ) => {
          metrics
            .controlledValues
            .push(
              nextValue,
            );

          setControlledSearch(
            nextValue,
          );
        }}
      />

      <SearchInput
        data-testid="block5-uncontrolled-search"
        defaultValue="uncontrolled query"
        slotProps={{
          clearButton: {
            "data-testid":
              "block5-uncontrolled-clear",
          },
        }}
        onClear={() => {
          metrics
            .uncontrolledClears +=
            1;
        }}
        onValueChange={(
          nextValue,
        ) => {
          metrics
            .uncontrolledValues
            .push(
              nextValue,
            );
        }}
      />

      <PasswordInput
        data-testid="block5-pointer-password"
        defaultValue="secret"
        showLabel="Show pointer password"
        hideLabel="Hide pointer password"
        slotProps={{
          toggleButton: {
            "data-testid":
              "block5-pointer-toggle",
          },
        }}
      />

      <PasswordInput
        data-testid="block5-keyboard-password"
        defaultValue="secret"
        showLabel="Show keyboard password"
        hideLabel="Hide keyboard password"
        slotProps={{
          toggleButton: {
            "data-testid":
              "block5-keyboard-toggle",
          },
        }}
      />

      <PasswordInput
        data-testid="block5-readonly-password"
        defaultValue="secret"
        readOnly
        slotProps={{
          toggleButton: {
            "data-testid":
              "block5-readonly-toggle",
          },
        }}
      />
    </main>
  );
}


const container =
  document.getElementById(
    "root",
  );


if (!container) {
  throw new Error(
    "Block 5 browser root was not found.",
  );
}


createRoot(
  container,
).render(
  <App />,
);
