import {
  existsSync,
  readFileSync,
} from "node:fs";

import {
  dirname,
  resolve,
} from "node:path";

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

const git =
  process.platform === "win32"
    ? "git.exe"
    : "git";


function assertPinnedPnpmVersion() {
  const manifest =
    JSON.parse(
      readFileSync(
        resolve(
          root,
          "package.json",
        ),
        "utf8",
      ),
    );

  const packageManager =
    manifest.packageManager;

  if (
    typeof packageManager !==
      "string" ||
    !packageManager.startsWith(
      "pnpm@",
    )
  ) {
    throw new Error(
      "package.json must declare an exact pnpm packageManager version.",
    );
  }

  const expected =
    packageManager.slice(
      "pnpm@".length,
    );

  const result =
    spawnSync(
      pnpm,
      [
        "--version",
      ],
      {
        cwd:
          root,

        encoding:
          "utf8",
      },
    );

  if (
    result.error
  ) {
    throw result.error;
  }

  if (
    result.status !==
      0
  ) {
    process.exit(
      result.status ??
      1,
    );
  }

  const actual =
    result.stdout.trim();

  if (
    actual !==
      expected
  ) {
    throw new Error(
      `Expected pnpm ${expected} from packageManager, received ${actual}.`,
    );
  }

  process.stdout.write(
    `==> pnpm version\n${actual}\n`,
  );
}


function run(
  command,
  args,
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
        cwd:
          root,

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
    process.exit(
      result.status ??
      1,
    );
  }
}


assertPinnedPnpmVersion();


run(
  pnpm,
  [
    "install",
    "--frozen-lockfile",
  ],
  "workspace install",
);

run(
  pnpm,
  [
    "--filter",
    "zerina-ui-internal-test",
    "exec",
    "playwright",
    "install",
    "chromium",
  ],
  "Playwright Chromium",
);

run(
  pnpm,
  [
    "--filter",
    "zerina-ui-internal-test",
    "typecheck",
  ],
  "internal-test typecheck",
);

run(
  pnpm,
  [
    "--filter",
    "zerina-ui-internal-test",
    "test",
  ],
  "internal-test Vitest",
);

run(
  pnpm,
  [
    "--filter",
    "zerina-ui-internal-test",
    "build",
  ],
  "internal-test build",
);

run(
  pnpm,
  [
    "--filter",
    "zerina-ui-internal-test",
    "test:browser",
  ],
  "internal-test Chromium",
);

run(
  pnpm,
  [
    "typecheck",
  ],
  "package typecheck",
);

run(
  pnpm,
  [
    "package:verify",
  ],
  "package build / pack / clean-consumer verification",
);


if (
  existsSync(
    resolve(
      root,
      ".git",
    ),
  )
) {
  run(
    git,
    [
      "diff",
      "--check",
    ],
    "git whitespace check",
  );
} else {
  process.stdout.write(
    "\n==> git whitespace check\nSkipped: .git is not present in this snapshot.\n",
  );
}


process.stdout.write(
  "\nValidation complete.\n",
);
