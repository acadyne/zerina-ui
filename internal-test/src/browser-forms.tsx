import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  Checkbox,
  Field,
  Input,
  PasswordInput,
  Radio,
  RadioGroup,
  SearchInput,
  Select,
  Switch,
  Textarea,
} from "zerina-ui";

import "zerina-ui/styles.css";


type FormBrowserSnapshot = {
  readOnlySelectChanges:
  number;

  readOnlySearchClears:
  number;

  readOnlySearchValueChanges:
  number;

  readOnlyPasswordChanges:
  number;

  readOnlyCheckboxChanges:
  number;

  readOnlySwitchChanges:
  number;

  controlledRadioChanges:
  number;

  readOnlyRadioChanges:
  number;

  groupChanges:
  readonly string[];

  readOnlyGroupChanges:
  readonly string[];
};


type FormBrowserHarness = {
  snapshot():
    FormBrowserSnapshot;
};


declare global {
  interface Window {
    formsHarness:
    FormBrowserHarness;
  }
}


const metrics = {
  readOnlySelectChanges:
    0,

  readOnlySearchClears:
    0,

  readOnlySearchValueChanges:
    0,

  readOnlyPasswordChanges:
    0,

  readOnlyCheckboxChanges:
    0,

  readOnlySwitchChanges:
    0,

  controlledRadioChanges:
    0,

  readOnlyRadioChanges:
    0,

  groupChanges:
    [] as string[],

  readOnlyGroupChanges:
    [] as string[],
};


window.formsHarness = {
  snapshot() {
    return {
      ...metrics,

      groupChanges:
        [
          ...metrics.groupChanges,
        ],

      readOnlyGroupChanges:
        [
          ...metrics
            .readOnlyGroupChanges,
        ],
    };
  },
};


function App() {
  const [
    selectValue,
    setSelectValue,
  ] =
    React.useState(
      "a",
    );


  const [
    passwordValue,
    setPasswordValue,
  ] =
    React.useState(
      "secret",
    );


  return (
    <main>
      <Field
        id="browser-email-field"
        controlId="browser-email"
        label="Email address"
      >
        <SearchInput
          id="browser-email"
          data-testid="label-control"
        />
      </Field>

      <Field
        id="browser-plan-field"
        controlId="browser-plan-group"
        label="Plan group"
        helpText="Choose one plan"
        labelAssociation="group"
      >
        <RadioGroup
          data-testid="labelled-group"
          name="labelled-plan"
        >
          <Radio
            data-testid="labelled-basic"
            value="basic"
            label="Basic plan"
          />

          <Radio
            data-testid="labelled-pro"
            value="pro"
            label="Pro plan"
          />
        </RadioGroup>
      </Field>

      <Select
        data-testid="readonly-select"
        value={selectValue}
        readOnly
        onChange={(
          event,
        ) => {
          metrics
            .readOnlySelectChanges +=
            1;

          setSelectValue(
            event.currentTarget
              .value,
          );
        }}
        options={[
          {
            label:
              "Option A",

            value:
              "a",
          },

          {
            label:
              "Option B",

            value:
              "b",
          },
        ]}
      />

      <SearchInput
        data-testid="readonly-search"
        defaultValue="query"
        readOnly
        onClear={() => {
          metrics
            .readOnlySearchClears +=
            1;
        }}
        onValueChange={() => {
          metrics
            .readOnlySearchValueChanges +=
            1;
        }}
      />

      <SearchInput
        data-testid="disabled-search"
        defaultValue="disabled query"
        disabled
      />

      <PasswordInput
        data-testid="readonly-password"
        value={passwordValue}
        readOnly
        slotProps={{
          toggleButton: {
            "data-testid":
              "readonly-password-toggle",
          },
        }}
        onChange={(
          event,
        ) => {
          metrics
            .readOnlyPasswordChanges +=
            1;

          setPasswordValue(
            event.currentTarget
              .value,
          );
        }}
      />

      <PasswordInput
        data-testid="disabled-password"
        disabled
        slotProps={{
          toggleButton: {
            "data-testid":
              "disabled-password-toggle",
          },
        }}
      />

      <Checkbox
        data-testid="readonly-checkbox"
        defaultChecked
        readOnly
        aria-label="Read-only checkbox"
        onChange={() => {
          metrics
            .readOnlyCheckboxChanges +=
            1;
        }}
      />

      <Checkbox
        data-testid="disabled-checkbox"
        disabled
        aria-label="Disabled checkbox"
      />

      <Switch
        data-testid="readonly-switch"
        defaultChecked
        readOnly
        aria-label="Read-only switch"
        onChange={() => {
          metrics
            .readOnlySwitchChanges +=
            1;
        }}
      />

      <Switch
        data-testid="disabled-switch"
        disabled
        aria-label="Disabled switch"
      />

      <Radio
        data-testid="standalone-radio"
        defaultChecked={false}
        aria-label="Standalone radio"
      />

      <Radio
        data-testid="controlled-radio"
        checked={false}
        aria-label="Controlled radio"
        onChange={() => {
          metrics
            .controlledRadioChanges +=
            1;
        }}
      />

      <Radio
        data-testid="readonly-radio"
        defaultChecked={false}
        readOnly
        aria-label="Read-only radio"
        onChange={() => {
          metrics
            .readOnlyRadioChanges +=
            1;
        }}
      />

      <Radio
        data-testid="disabled-radio"
        disabled
        aria-label="Disabled radio"
      />

      <RadioGroup
        data-testid="uncontrolled-group"
        name="uncontrolled-plan"
        defaultValue="a"
        onValueChange={(
          value,
        ) => {
          metrics.groupChanges.push(
            value,
          );
        }}
      >
        <Radio
          data-testid="group-a"
          value="a"
          label="Group A"
        />

        <Radio
          data-testid="group-b"
          value="b"
          label="Group B"
        />
      </RadioGroup>

      <RadioGroup
        data-testid="readonly-group"
        name="readonly-plan"
        defaultValue="a"
        readOnly
        onValueChange={(
          value,
        ) => {
          metrics
            .readOnlyGroupChanges
            .push(
              value,
            );
        }}
      >
        <Radio
          data-testid="readonly-group-a"
          value="a"
          label="Read-only A"
        />

        <Radio
          data-testid="readonly-group-b"
          value="b"
          label="Read-only B"
        />
      </RadioGroup>

      <RadioGroup
        data-testid="disabled-group"
        name="disabled-plan"
        disabled
        invalid
        required
      >
        <Radio
          data-testid="disabled-group-a"
          value="a"
        />

        <Radio
          data-testid="disabled-group-b"
          value="b"
        />
      </RadioGroup>
    

      <section
        data-testid="block4-controls"
        style={{
          "--ui-interaction-disabled-opacity":
            "0.42",

          "--ui-primary":
            "rgb(20, 80, 180)",

          "--ui-danger":
            "rgb(190, 20, 40)",

          "--ui-border":
            "rgb(100, 100, 100)",

          "--ui-surface":
            "rgb(255, 255, 255)",

          "--ui-text":
            "rgb(20, 20, 20)",

          "--ui-interaction-focus-ring-color":
            "rgb(20, 80, 180)",

          "--ui-interaction-focus-ring-danger-color":
            "rgb(190, 20, 40)",

          "--ui-interaction-focus-ring-width":
            "2px",

          "--ui-interaction-focus-ring-offset":
            "1px",

          "--ui-duration-normal":
            "0ms",

          "--ui-ease-standard":
            "linear",

          "--ui-font-size-sm":
            "12px",

          "--ui-font-size-md":
            "14px",

          "--ui-font-size-lg":
            "16px",

          "--ui-radius-sm":
            "3px",

          "--ui-radius-md":
            "5px",

          "--ui-radius-lg":
            "7px",

          "--ui-control-h-sm":
            "31px",

          "--ui-control-h-md":
            "37px",

          "--ui-control-h-lg":
            "43px",

          "--ui-control-padding-x-sm":
            "7px",

          "--ui-control-padding-x-md":
            "11px",

          "--ui-control-padding-x-lg":
            "15px",

          "--ui-control-padding-y-sm":
            "3px",

          "--ui-control-padding-y-md":
            "5px",

          "--ui-control-padding-y-lg":
            "7px",

          "--ui-control-textarea-min-height-sm":
            "71px",

          "--ui-control-textarea-min-height-md":
            "83px",

          "--ui-control-textarea-min-height-lg":
            "97px",
        } as React.CSSProperties}
      >
        <button
          type="button"
          data-testid="block4-focus-start"
        >
          Focus start
        </button>

        <Input
          data-testid="block4-focus-input"
          aria-label="Block 4 focus input"
        />

        <Textarea
          data-testid="block4-focus-textarea"
          aria-label="Block 4 focus textarea"
        />

        <Select
          data-testid="block4-focus-select"
          aria-label="Block 4 focus select"
          value="a"
          onChange={() => {}}
          options={[
            {
              label:
                "Option A",

              value:
                "a",
            },

            {
              label:
                "Option B",

              value:
                "b",
            },
          ]}
        />

        <button
          type="button"
          data-testid="block4-valid-start"
        >
          Valid start
        </button>

        <Input
          data-testid="block4-valid-input"
          aria-label="Block 4 valid input"
        />

        <button
          type="button"
          data-testid="block4-invalid-start"
        >
          Invalid start
        </button>

        <Input
          data-testid="block4-invalid-input"
          aria-label="Block 4 invalid input"
          invalid
        />

        <Input
          data-testid="block4-disabled-input"
          aria-label="Block 4 disabled input"
          disabled
        />

        <Textarea
          data-testid="block4-disabled-textarea"
          aria-label="Block 4 disabled textarea"
          disabled
        />

        <Select
          data-testid="block4-disabled-select"
          aria-label="Block 4 disabled select"
          value="a"
          onChange={() => {}}
          disabled
          options={[
            {
              label:
                "Option A",

              value:
                "a",
            },
          ]}
        />

        <Select
          data-testid="block4-readonly-select"
          aria-label="Block 4 read-only select"
          value="a"
          onChange={() => {}}
          readOnly
          options={[
            {
              label:
                "Option A",

              value:
                "a",
            },
          ]}
        />

        <button
          type="button"
          data-testid="block4-inline-start"
        >
          Inline start
        </button>

        <Input
          data-testid="block4-inline-input"
          aria-label="Block 4 inline input"
          style={{
            boxShadow:
              "rgb(1, 2, 3) 0px 0px 0px 7px",

            border:
              "5px solid rgb(4, 5, 6)",
          }}
        />

        <Input
          data-testid="block4-slot-style-input"
          aria-label="Block 4 slot style input"
          leftPadding="9px"
          slotProps={{
            root: {
              style: {
                paddingLeft:
                  "27px",
              },
            },
          }}
        />

        <Input
          data-testid="block4-direct-style-input"
          aria-label="Block 4 direct style input"
          leftPadding="9px"
          slotProps={{
            root: {
              style: {
                paddingLeft:
                  "27px",
              },
            },
          }}
          style={{
            paddingLeft:
              "33px",
          }}
        />

        <button
          type="button"
          data-testid="block4-unstyled-input-start"
        >
          Unstyled input start
        </button>

        <Input
          data-testid="block4-unstyled-input"
          aria-label="Block 4 unstyled input"
          variant="unstyled"
          defaultValue="unstyled input"
        />

        <button
          type="button"
          data-testid="block4-unstyled-textarea-start"
        >
          Unstyled textarea start
        </button>

        <Textarea
          data-testid="block4-unstyled-textarea"
          aria-label="Block 4 unstyled textarea"
          variant="unstyled"
          defaultValue="unstyled textarea"
        />

        <button
          type="button"
          data-testid="block4-unstyled-select-start"
        >
          Unstyled select start
        </button>

        <Select
          data-testid="block4-unstyled-select"
          aria-label="Block 4 unstyled select"
          variant="unstyled"
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

        <Input
          data-testid="block4-input-sm"
          aria-label="Block 4 input small"
          size="sm"
        />

        <Input
          data-testid="block4-input-md"
          aria-label="Block 4 input medium"
          size="md"
        />

        <Input
          data-testid="block4-input-lg"
          aria-label="Block 4 input large"
          size="lg"
        />

        <Select
          data-testid="block4-select-sm"
          aria-label="Block 4 select small"
          size="sm"
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

        <Select
          data-testid="block4-select-md"
          aria-label="Block 4 select medium"
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

        <Select
          data-testid="block4-select-lg"
          aria-label="Block 4 select large"
          size="lg"
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

        <Input
          data-testid="block4-padding-sm"
          aria-label="Block 4 padding small"
          size="sm"
        />

        <Input
          data-testid="block4-padding-md"
          aria-label="Block 4 padding medium"
          size="md"
        />

        <Input
          data-testid="block4-padding-lg"
          aria-label="Block 4 padding large"
          size="lg"
        />

        <Textarea
          data-testid="block4-textarea-sm"
          aria-label="Block 4 textarea small"
          size="sm"
        />

        <Textarea
          data-testid="block4-textarea-md"
          aria-label="Block 4 textarea medium"
          size="md"
        />

        <Textarea
          data-testid="block4-textarea-lg"
          aria-label="Block 4 textarea large"
          size="lg"
        />

        <Textarea
          data-testid="block4-textarea-override"
          aria-label="Block 4 textarea override"
          size="sm"
          style={{
            minHeight:
              "123px",
          }}
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
    "Browser form root was not found.",
  );
}


createRoot(
  container,
).render(
  <App />,
);