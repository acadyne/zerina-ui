import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";

import {
  dirname,
  join,
  resolve,
} from "node:path";

import {
  tmpdir,
} from "node:os";

import {
  fileURLToPath,
} from "node:url";

import {
  spawnSync,
} from "node:child_process";


const root =
  resolve(
    dirname(
      fileURLToPath(
        import.meta.url,
      ),
    ),
    "..",
  );

const pnpm =
  process.platform === "win32"
    ? "pnpm.cmd"
    : "pnpm";

const node =
  process.execPath;

const tempRoot =
  mkdtempSync(
    join(
      tmpdir(),
      "zerina-ui-package-",
    ),
  );

const tarball =
  join(
    tempRoot,
    "zerina-ui.tgz",
  );


const REACT_CONSUMERS = [
  {
    label:
      "react-18",

    react:
      "18.3.1",

    reactDom:
      "18.3.1",

    reactTypes:
      "18.3.31",

    reactDomTypes:
      "18.3.7",
  },

  {
    label:
      "react-19",

    react:
      "19.0.0",

    reactDom:
      "19.0.0",

    reactTypes:
      "19.0.0",

    reactDomTypes:
      "19.0.0",
  },
];


function run(
  command,
  args,
  cwd,
  label,
) {
  process.stdout.write(
    `\n==> ${label}\n`,
  );

  const result =
    spawnSync(
      command,
      args,
      {
        cwd,
        stdio:
          "inherit",
        env:
          process.env,
      },
    );

  if (
    result.error
  ) {
    throw result.error;
  }

  if (
    result.status !== 0
  ) {
    throw new Error(
      `${label} failed with exit code ${result.status}.`,
    );
  }
}


function assert(
  condition,
  message,
) {
  if (!condition) {
    throw new Error(
      message,
    );
  }
}


function writeConsumer({
  consumer,
  packageName,
  typescriptVersion,
  react,
  reactDom,
  reactTypes,
  reactDomTypes,
}) {
  mkdirSync(
    consumer,
    {
      recursive:
        true,
    },
  );

  copyFileSync(
    tarball,
    join(
      consumer,
      "zerina-ui.tgz",
    ),
  );

  writeFileSync(
    join(
      consumer,
      "package.json",
    ),
    JSON.stringify(
      {
        name:
          packageName,

        private:
          true,

        type:
          "module",

        dependencies: {
          "zerina-ui":
            "file:./zerina-ui.tgz",

          react,
          "react-dom":
            reactDom,
        },

        devDependencies: {
          "@types/react":
            reactTypes,

          "@types/react-dom":
            reactDomTypes,

          typescript:
            typescriptVersion,
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  writeFileSync(
    join(
      consumer,
      "tsconfig.json",
    ),
    JSON.stringify(
      {
        compilerOptions: {
          target:
            "ES2020",

          lib: [
            "DOM",
            "DOM.Iterable",
            "ES2020",
          ],

          module:
            "ESNext",

          moduleResolution:
            "Bundler",

          strict:
            true,

          jsx:
            "react-jsx",

          noEmit:
            true,

          skipLibCheck:
            false,
        },

        include: [
          "src",
        ],
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  mkdirSync(
    join(
      consumer,
      "src",
    ),
    {
      recursive:
        true,
    },
  );

  writeFileSync(
    join(
      consumer,
      "src/index.tsx",
    ),
    `import {
  Button,
  MotionPresence,
  UIMotionProvider,
  UIViewportProvider,
  ZerinaProvider,
  usePress,
} from "zerina-ui";

import type {
  ButtonProps,
  UIViewportKind,
} from "zerina-ui";


const buttonProps: ButtonProps = {
  children: "Consumer",
};

const viewportKind: UIViewportKind =
  "desktop";

void MotionPresence;
void UIMotionProvider;
void UIViewportProvider;
void usePress;
void viewportKind;


export function ConsumerExample() {
  return (
    <ZerinaProvider>
      <Button {...buttonProps} />
    </ZerinaProvider>
  );
}
`,
    "utf8",
  );

  writeFileSync(
    join(
      consumer,
      "smoke.mjs",
    ),
    `import {
  createRequire,
} from "node:module";

import * as esm from "zerina-ui";


for (
  const symbol
  of [
    "Button",
    "ZerinaProvider",
    "UIMotionProvider",
    "UIViewportProvider",
  ]
) {
  if (!(symbol in esm)) {
    throw new Error(
      \`Missing ESM export: \${symbol}\`,
    );
  }
}


const require =
  createRequire(
    import.meta.url,
  );

const cjs =
  require(
    "zerina-ui",
  );


for (
  const symbol
  of [
    "Button",
    "ZerinaProvider",
  ]
) {
  if (!(symbol in cjs)) {
    throw new Error(
      \`Missing CJS export: \${symbol}\`,
    );
  }
}


for (
  const entry
  of [
    "zerina-ui/styles.css",
    "zerina-ui/reset.css",
  ]
) {
  require.resolve(
    entry,
  );
}


console.log(
  "ESM, CJS and CSS entry points resolved.",
);
`,
    "utf8",
  );
}


function verifyInstalledPackage({
  consumer,
  rootPackage,
}) {
  const installed =
    join(
      consumer,
      "node_modules",
      "zerina-ui",
    );

  for (
    const relative
    of [
      "package.json",
      "README.md",
      "LICENSE",
      "dist/index.js",
      "dist/index.cjs",
      "dist/index.d.ts",
      "dist/index.d.cts",
      "dist/styles.css",
      "dist/reset.css",
    ]
  ) {
    assert(
      existsSync(
        join(
          installed,
          relative,
        ),
      ),
      `Packed package is missing ${relative}.`,
    );
  }

  for (
    const relative
    of [
      "src",
      "internal-test",
      "docs",
      "scripts",
      "BITACORA.md",
      "pnpm-lock.yaml",
    ]
  ) {
    assert(
      !existsSync(
        join(
          installed,
          relative,
        ),
      ),
      `Packed package unexpectedly contains ${relative}.`,
    );
  }

  const installedManifest =
    JSON.parse(
      readFileSync(
        join(
          installed,
          "package.json",
        ),
        "utf8",
      ),
    );

  assert(
    installedManifest.version ===
      rootPackage.version,
    "Packed version differs from the root package version.",
  );

  assert(
    JSON.stringify(
      Object.keys(
        installedManifest.exports,
      ).sort(),
    ) ===
      JSON.stringify([
        ".",
        "./reset.css",
        "./styles.css",
      ]),
    "Packed exports differ from the intended public entry points.",
  );
}


try {
  const rootPackage =
    JSON.parse(
      readFileSync(
        resolve(
          root,
          "package.json",
        ),
        "utf8",
      ),
    );

  const harnessPackage =
    JSON.parse(
      readFileSync(
        resolve(
          root,
          "internal-test/package.json",
        ),
        "utf8",
      ),
    );

  run(
    pnpm,
    [
      "pack",
      "--out",
      tarball,
    ],
    root,
    "pack zerina-ui",
  );

  assert(
    existsSync(
      tarball,
    ),
    "pnpm pack did not create the expected tarball.",
  );


  for (
    const matrix
    of REACT_CONSUMERS
  ) {
    const consumer =
      join(
        tempRoot,
        matrix.label,
      );

    writeConsumer({
      consumer,

      packageName:
        `zerina-ui-clean-consumer-${matrix.label}`,

      typescriptVersion:
        harnessPackage
          .devDependencies
          .typescript,

      ...matrix,
    });

    run(
      pnpm,
      [
        "install",
        "--ignore-scripts",
      ],
      consumer,
      `install clean consumer (${matrix.label})`,
    );

    verifyInstalledPackage({
      consumer,
      rootPackage,
    });

    run(
      pnpm,
      [
        "exec",
        "tsc",
        "--noEmit",
      ],
      consumer,
      `typecheck clean consumer (${matrix.label})`,
    );

    run(
      node,
      [
        "smoke.mjs",
      ],
      consumer,
      `runtime entry-point smoke (${matrix.label})`,
    );
  }


  process.stdout.write(
    "\nPackage verification complete for React 18 and React 19.\n",
  );
} finally {
  rmSync(
    tempRoot,
    {
      recursive:
        true,

      force:
        true,
    },
  );
}
