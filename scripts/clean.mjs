import {
  rmSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

import {
  resolve,
} from "node:path";


const root =
  resolve(
    fileURLToPath(
      new URL(
        "..",
        import.meta.url,
      ),
    ),
  );


for (
  const directory
  of [
    "dist",
  ]
) {
  rmSync(
    resolve(
      root,
      directory,
    ),
    {
      recursive:
        true,

      force:
        true,
    },
  );
}
