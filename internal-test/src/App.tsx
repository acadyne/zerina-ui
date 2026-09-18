// internal-test/src/App.tsx

import {
  ZerinaProvider,
} from "zerina-ui";

import {
  DocumentationHome,
} from "./documentation/DocumentationHome";


export function App() {
  return (
    <ZerinaProvider
      viewport={{
        densityMode: "auto",

        narrowBreakpoint: 480,
        wideBreakpoint: 1024,

        shortBreakpoint: 500,
        tallBreakpoint: 800,
      }}

      toast={{
        placement: "bottom-center",
        maxToasts: 3,
      }}
    >
      <DocumentationHome />
    </ZerinaProvider>
  );
}