import React from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  ZerinaProvider,
  useUIMotion,
  useUIViewport,
} from "zerina-ui";

import "zerina-ui/styles.css";


type HarnessDensity =
  | "comfortable"
  | "spacious";


function EnvironmentControls({
  setDensity,
}: {
  setDensity:
    React.Dispatch<
      React.SetStateAction<HarnessDensity>
    >;
}) {
  const motion =
    useUIMotion();

  const viewport =
    useUIViewport();


  return (
    <main>
      <output
        data-testid="motion-level"
      >
        {motion.effectiveLevel}
      </output>

      <output
        data-testid="density"
      >
        {viewport.density}
      </output>

      <button
        type="button"
        data-testid="motion-none"
        onClick={() => {
          motion.setLevel(
            "none",
          );
        }}
      >
        Disable motion
      </button>

      <button
        type="button"
        data-testid="density-spacious"
        onClick={() => {
          setDensity(
            "spacious",
          );
        }}
      >
        Spacious density
      </button>
    </main>
  );
}


function App() {
  const [
    density,
    setDensity,
  ] =
    React.useState<HarnessDensity>(
      "comfortable",
    );


  return (
    <ZerinaProvider
      motion={{
        defaultLevel:
          "subtle",

        respectReducedMotion:
          false,
      }}
      viewport={{
        densityMode:
          density,
      }}
      theme={{
        persist:
          false,
      }}
    >
      <EnvironmentControls
        setDensity={
          setDensity
        }
      />
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
