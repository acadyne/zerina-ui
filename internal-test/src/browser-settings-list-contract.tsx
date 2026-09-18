import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  SettingsList,
} from "zerina-ui";

import "zerina-ui/styles.css";


type EventSnapshot = {
  calls:
    number;

  next:
    boolean | null;

  eventChecked:
    boolean | null;

  defaultPrevented:
    boolean;
};


declare global {
  interface Window {
    settingsListContract:
      {
        snapshot:
          () => {
            switchEvent:
              EventSnapshot;

            checkboxEvent:
              EventSnapshot;
          };
      };
  }
}


const switchEvent:
  EventSnapshot = {
    calls:
      0,

    next:
      null,

    eventChecked:
      null,

    defaultPrevented:
      false,
  };


const checkboxEvent:
  EventSnapshot = {
    calls:
      0,

    next:
      null,

    eventChecked:
      null,

    defaultPrevented:
      false,
  };


window.settingsListContract = {
  snapshot() {
    return {
      switchEvent: {
        ...switchEvent,
      },

      checkboxEvent: {
        ...checkboxEvent,
      },
    };
  },
};


function App() {
  const [
    revision,
    setRevision,
  ] = React.useState(
    0,
  );


  return (
    <main>
      <button
        data-testid="force-rerender"
        type="button"
        onClick={() => {
          setRevision(
            (
              current,
            ) =>
              current +
              1,
          );
        }}
      >
        Rerender {revision}
      </button>

      <SettingsList>
        <SettingsList.Switch
          data-testid="prevent-switch"
          label="Prevent switch"
          defaultChecked={false}
          onCheckedChange={(
            next,
            event,
          ) => {
            event.preventDefault();

            switchEvent.calls +=
              1;

            switchEvent.next =
              next;

            switchEvent.eventChecked =
              event.currentTarget
                .checked;

            switchEvent.defaultPrevented =
              event.defaultPrevented;
          }}
        />

        <SettingsList.Checkbox
          data-testid="prevent-checkbox"
          label="Prevent checkbox"
          defaultChecked={false}
          onCheckedChange={(
            next,
            event,
          ) => {
            event.preventDefault();

            checkboxEvent.calls +=
              1;

            checkboxEvent.next =
              next;

            checkboxEvent.eventChecked =
              event.currentTarget
                .checked;

            checkboxEvent.defaultPrevented =
              event.defaultPrevented;
          }}
        />
      </SettingsList>
    </main>
  );
}


const root =
  document.getElementById(
    "root",
  );


if (!root) {
  throw new Error(
    "SettingsList browser root was not found.",
  );
}


createRoot(
  root,
).render(
  <App />,
);
