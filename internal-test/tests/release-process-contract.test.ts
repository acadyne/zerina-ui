// @vitest-environment node

import {
  readFileSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

import {
  describe,
  expect,
  it,
} from "vitest";


const packageJson =
  JSON.parse(
    readFileSync(
      fileURLToPath(
        new URL(
          "../../package.json",
          import.meta.url,
        ),
      ),
      "utf8",
    ),
  ) as {
    version:
      string;

    packageManager:
      string;

    dependencies:
      Record<
        string,
        string
      >;

    peerDependencies:
      Record<
        string,
        string
      >;

    scripts:
      Record<
        string,
        string
      >;
  };


const verifyPackageSource =
  readFileSync(
    fileURLToPath(
      new URL(
        "../../scripts/verify-package.mjs",
        import.meta.url,
      ),
    ),
    "utf8",
  );


describe(
  "release process contract",
  () => {


    it(
      "targets the 0.5.1 patch release candidate exactly",
      () => {
        expect(
          packageJson.version,
        ).toBe(
          "0.5.1",
        );
      },
    );
    it(
      "builds before every pack and validates before publish",
      () => {
        expect(
          packageJson.scripts.prepack,
        ).toBe(
          "pnpm build",
        );

        expect(
          packageJson.scripts.prepublishOnly,
        ).toBe(
          "pnpm validate",
        );

        expect(
          packageJson.scripts[
            "package:verify"
          ],
        ).toBe(
          "node scripts/verify-package.mjs",
        );
      },
    );


    it(
      "pins pnpm exactly",
      () => {
        expect(
          packageJson.packageManager,
        ).toBe(
          "pnpm@10.34.5",
        );
      },
    );


    it(
      "uses the Lucide baseline validated for React 19 and CommonJS consumers",
      () => {
        expect(
          packageJson.dependencies[
            "lucide-react"
          ],
        ).toBe(
          "^0.507.0",
        );
      },
    );


    it(
      "keeps nested package verification real during npm publish --dry-run",
      () => {
        expect(
          verifyPackageSource,
        ).toContain(
          '"npm_config_dry_run"',
        );

        expect(
          verifyPackageSource,
        ).toContain(
          "verificationEnv",
        );

        expect(
          verifyPackageSource,
        ).not.toContain(
          "env:\n          process.env",
        );
      },
    );


    it(
      "tests both React majors declared by the peer range",
      () => {
        expect(
          packageJson.peerDependencies.react,
        ).toBe(
          ">=18 <20",
        );

        expect(
          packageJson.peerDependencies[
            "react-dom"
          ],
        ).toBe(
          ">=18 <20",
        );

        expect(
          verifyPackageSource,
        ).toContain(
          '"18.3.1"',
        );

        expect(
          verifyPackageSource,
        ).toContain(
          '"19.0.0"',
        );

        expect(
          verifyPackageSource,
        ).toContain(
          "Package verification complete for React 18 and React 19.",
        );
      },
    );
  },
);
