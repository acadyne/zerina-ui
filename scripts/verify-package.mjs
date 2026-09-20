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
  ActionDialog,
  AdaptiveScaffold,
  Button,
  ConfirmDialog,
  MotionPresence,
  NavigationPresenter,
  RoutedAdaptiveScaffold,
  UIMotionProvider,
  TargetFormDialog,
  UIViewportProvider,
  ZerinaProvider,
  usePress,
} from "zerina-ui";

import type {
  ActionDialogProps,
  AdaptiveScaffoldNavigation,
  AdaptiveScaffoldProps,
  AdaptiveScaffoldTabletNavigationPlacement,
  AvatarSize,
  BadgeColorScheme,
  BadgeVariant,
  ButtonProps,
  ConfirmDialogProps,
  ContainerSize,
  CreateThemeDefinitionInput,
  DialogSize,
  FloatingPlacement,
  InputSize,
  InputVariant,
  NavigationActiveBehavior,
  NavigationCompactPolicy,
  NavigationContentMeta,
  NavigationLinkMeta,
  NavigationNode,
  NavigationNodeId,
  NavigationPresentation,
  NavigationPresenterProps,
  NavigationSide,
  NavigationDestinationBadgeAnchor,
  NavigationDestinationBadgeOffset,
  NavigationDestinationBadgePlacement,
  NavigationDestinationDensity,
  NavigationDestinationIndicator,
  NavigationDestinationItemShape,
  NavigationDestinationLabelBehavior,
  NavigationSelectionContext,
  NavigationSelectionReason,
  NavigationSurfacePosition,
  NavigationSurfaceVariant,
  ModalState,
  PopoverPlacement,
  RatioValue,
  RoutedAdaptiveScaffoldProps,
  SafeAreaEdges,
  ScaffoldProps,
  SelectSize,
  SelectVariant,
  SetViewportModeAction,
  TabScaffoldProps,
  TagColorScheme,
  TagVariant,
  TargetDialogRender,
  TargetDialogRenderProps,
  TargetFormDialogProps,
  TextareaSize,
  TextareaVariant,
  UIThemeContextValue,
  UIViewportKind,
} from "zerina-ui";


type ConsumerNavigationMeta =
  NavigationLinkMeta & {
    analyticsId: string;
  };

const navigationId:
  NavigationNodeId =
  "dashboard";

const navigationItems:
  NavigationNode<ConsumerNavigationMeta>[] = [
    {
      id: navigationId,
      label: "Dashboard",
      meta: {
        href: "/dashboard",
        analyticsId: "dashboard",
      },
    },
  ];

const adaptiveItems:
  AdaptiveScaffoldProps<ConsumerNavigationMeta>["items"] =
  navigationItems;

const compactPolicy:
  NavigationCompactPolicy = {
    maxVisible: {
      bottom: 5,
      rail: 7,
    },
  };

const adaptiveNavigation:
  AdaptiveScaffoldNavigation<ConsumerNavigationMeta> = {
    mobile: {
      presentation: "bottom",
    },
    tablet: {
      presentation: "rail",
    },
    desktop: {
      presentation: "sidebar",
    },
    compact: compactPolicy,
  };


const routedAdaptiveProps:
  RoutedAdaptiveScaffoldProps<ConsumerNavigationMeta> = {
    items:
      navigationItems,

    mode:
      "mobile",

    navigation:
      adaptiveNavigation,

    navigate:
      (
        href,
        item,
      ) => {
        const analyticsId:
          string | undefined =
          item.meta?.analyticsId;

        void href;
        void analyticsId;
      },

    onItemChange:
      (item) => {
        const analyticsId:
          string | undefined =
          item.meta?.analyticsId;

        void analyticsId;
      },
  };

const tabletNavigationPlacement:
  AdaptiveScaffoldTabletNavigationPlacement =
  "bottom";

const navigationSurfacePosition:
  NavigationSurfacePosition =
  "static";

const navigationSurfaceVariant:
  NavigationSurfaceVariant =
  "surface";

const navigationLabelBehavior:
  NavigationDestinationLabelBehavior =
  "always";

const navigationIndicator:
  NavigationDestinationIndicator =
  "background";

const navigationDensity:
  NavigationDestinationDensity =
  "comfortable";

const navigationBadgeAnchor:
  NavigationDestinationBadgeAnchor =
  "icon";

const navigationBadgePlacement:
  NavigationDestinationBadgePlacement =
  "top-end";

const navigationItemShape:
  NavigationDestinationItemShape =
  "rounded";

const navigationBadgeOffset:
  NavigationDestinationBadgeOffset =
  {};

const navigationSelectionReason:
  NavigationSelectionReason =
  "change";

const navigationSelectionContext:
  NavigationSelectionContext = {
    value: "dashboard",
    previousValue: null,
    reason: navigationSelectionReason,
  };

const navigationContent:
  NavigationContentMeta = {};

const navigationActiveBehavior:
  NavigationActiveBehavior =
  "contains";

const navigationPresentation:
  NavigationPresentation =
  "bottom";

const navigationSide:
  NavigationSide =
  "end";

const navigationPresenterProps:
  NavigationPresenterProps<ConsumerNavigationMeta> = {
    items: navigationItems,
    presentation: "bottom",
    activeId: "dashboard",
    compactPolicy,
  };

type ConsumerDialogTarget = {
  id: string;
  label: string;
};

const dialogState:
  ModalState<ConsumerDialogTarget> = {
    isOpen: true,
    target: {
      id: "dialog-target",
      label: "Dialog target",
    },
  };

const renderDialogTarget:
  TargetDialogRender<ConsumerDialogTarget> =
  (target) =>
    target.label;

const dialogRenderProps:
  TargetDialogRenderProps<ConsumerDialogTarget> = {
    renderDescription:
      (target) =>
        target.label,

    renderTargetLabel:
      (target) =>
        target.id,

    renderBody:
      renderDialogTarget,

    renderFooter:
      (target) =>
        target.id,
  };

const confirmDialogProps:
  ConfirmDialogProps<ConsumerDialogTarget> = {
    state: dialogState,
    title: "Confirm",
    onConfirm:
      (target) => {
        void target.id;
      },
    ...dialogRenderProps,
  };

const actionDialogProps:
  ActionDialogProps<ConsumerDialogTarget> = {
    state: dialogState,
    title: "Action",
    onAction:
      (target) => {
        void target.label;
      },
    ...dialogRenderProps,
  };

const targetFormDialogProps:
  TargetFormDialogProps<ConsumerDialogTarget> = {
    state: dialogState,
    title: "Form",
    onSubmit:
      (target, event) => {
        void target.id;
        void event.currentTarget;
      },
    ...dialogRenderProps,
  };

const themeDefinition:
  CreateThemeDefinitionInput = {
    name: "consumer-theme",
    source: "custom",
  };

const setViewportMode:
  SetViewportModeAction =
  (previousMode) =>
    previousMode;

const setTheme:
  UIThemeContextValue["setTheme"] =
  () => undefined;

const inputSize: InputSize = "md";
const inputVariant: InputVariant = "outline";
const selectSize: SelectSize = "md";
const selectVariant: SelectVariant = "outline";
const textareaSize: TextareaSize = "md";
const textareaVariant: TextareaVariant = "outline";
const dialogSize: DialogSize = "md";
const popoverPlacement: PopoverPlacement = "bottom-start";
const floatingPlacement: FloatingPlacement = "bottom-start";
const safeAreaEdges: SafeAreaEdges = { top: true };
const scaffoldProps: ScaffoldProps = {
  viewport: "contained",
  safeArea: safeAreaEdges,
};
const tabScaffoldProps: TabScaffoldProps = {
  tabs: [],
  screens: [],
  viewport: "contained",
  safeArea: true,
};
const containerSize: ContainerSize = "lg";
const avatarSize: AvatarSize = "md";
const ratioValue: RatioValue = "16/9";
const badgeVariant: BadgeVariant = "subtle";
const badgeColorScheme: BadgeColorScheme = "primary";
const tagVariant: TagVariant = "outline";
const tagColorScheme: TagColorScheme = "neutral";

const buttonProps: ButtonProps = {
  children: "Consumer",
};

const viewportKind: UIViewportKind =
  "desktop";

void ActionDialog;
void ConfirmDialog;
void TargetFormDialog;
void MotionPresence;
void UIMotionProvider;
void UIViewportProvider;
void usePress;
void adaptiveItems;
void adaptiveNavigation;
void compactPolicy;
void tabletNavigationPlacement;
void AdaptiveScaffold;
void NavigationPresenter;
void navigationContent;
void navigationActiveBehavior;
void navigationPresentation;
void navigationPresenterProps;
void navigationSide;
void dialogState;
void renderDialogTarget;
void dialogRenderProps;
void confirmDialogProps;
void actionDialogProps;
void targetFormDialogProps;
void themeDefinition;
void setViewportMode;
void setTheme;
void inputSize;
void inputVariant;
void selectSize;
void selectVariant;
void textareaSize;
void textareaVariant;
void dialogSize;
void popoverPlacement;
void floatingPlacement;
void safeAreaEdges;
void scaffoldProps;
void routedAdaptiveProps;
void tabScaffoldProps;
void containerSize;
void avatarSize;
void ratioValue;
void badgeVariant;
void badgeColorScheme;
void tagVariant;
void tagColorScheme;
void viewportKind;


export function ConsumerExample() {
  return (
    <ZerinaProvider>
      <Button {...buttonProps} />

      <NavigationPresenter
        items={navigationItems}
        presentation="bottom"
        activeId="dashboard"
        compactPolicy={compactPolicy}
      />

      <ConfirmDialog
        state={dialogState}
        title="Confirm"
        onConfirm={(target) => {
          void target.id;
        }}
        renderDescription={(target) =>
          target.label
        }
        renderBody={(target) =>
          target.id
        }
      />

      <ActionDialog
        state={dialogState}
        title="Action"
        onAction={(target) => {
          void target.label;
        }}
        renderTargetLabel={(target) =>
          target.id
        }
      />

      <TargetFormDialog
        state={dialogState}
        title="Form"
        onSubmit={(target, event) => {
          void target.id;
          void event.currentTarget;
        }}
        renderBody={(target) =>
          target.label
        }
      />

      <AdaptiveScaffold
        items={navigationItems}
        mode="mobile"
        navigation={adaptiveNavigation}
      />


      <RoutedAdaptiveScaffold
        items={navigationItems}
        mode="mobile"
        navigation={adaptiveNavigation}
        navigate={(href, item) => {
          const analyticsId:
            string | undefined =
            item.meta?.analyticsId;

          void href;
          void analyticsId;
        }}
        onItemChange={(item) => {
          const analyticsId:
            string | undefined =
            item.meta?.analyticsId;

          void analyticsId;
        }}
      />
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
    "ActionDialog",
    "AdaptiveScaffold",
    "Button",
    "ConfirmDialog",
    "NavigationPresenter",
    "RoutedAdaptiveScaffold",
    "TargetFormDialog",
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
    "ActionDialog",
    "Button",
    "ConfirmDialog",
    "NavigationPresenter",
    "RoutedAdaptiveScaffold",
    "TargetFormDialog",
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
