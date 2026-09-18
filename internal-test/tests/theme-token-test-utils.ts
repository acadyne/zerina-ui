import type {
  ThemeTokenValueKind,
} from "../../src/theme/contracts/theme-token-contract";

import type {
  ThemeTokenCSSVariable,
} from "../../src/theme/contracts/theme-token-contract";


export interface ManifestLeaf {
  path:
    readonly string[];

  kind:
    ThemeTokenValueKind;

  cssVariable:
    ThemeTokenCSSVariable;
}


interface RuntimeDescriptor {
  kind:
    ThemeTokenValueKind;

  cssVariable:
    ThemeTokenCSSVariable;
}


function isDescriptor(
  value:
    unknown,
): value is RuntimeDescriptor {
  if (
    value === null ||
    typeof value !==
      "object" ||
    Array.isArray(
      value,
    )
  ) {
    return false;
  }


  const record =
    value as Record<
      string,
      unknown
    >;


  return (
    (
      record.kind ===
        "string" ||
      record.kind ===
        "fontWeight"
    ) &&
    typeof record.cssVariable ===
      "string"
  );
}


export function collectManifestLeaves(
  manifest:
    unknown,
  path:
    readonly string[] = [],
): ManifestLeaf[] {
  if (
    isDescriptor(
      manifest,
    )
  ) {
    return [
      {
        path,

        kind:
          manifest.kind,

        cssVariable:
          manifest.cssVariable,
      },
    ];
  }


  if (
    manifest === null ||
    typeof manifest !==
      "object" ||
    Array.isArray(
      manifest,
    )
  ) {
    throw new Error(
      `Invalid manifest branch at "${path.join(
        ".",
      )}".`,
    );
  }


  const leaves:
    ManifestLeaf[] = [];


  for (
    const [
      key,
      value,
    ] of Object.entries(
      manifest,
    )
  ) {
    leaves.push(
      ...collectManifestLeaves(
        value,
        [
          ...path,
          key,
        ],
      ),
    );
  }


  return leaves;
}


export function collectManifestBranchPaths(
  manifest:
    unknown,
  path:
    readonly string[] = [],
): readonly (
  readonly string[]
)[] {
  if (
    isDescriptor(
      manifest,
    )
  ) {
    return [];
  }


  if (
    manifest === null ||
    typeof manifest !==
      "object" ||
    Array.isArray(
      manifest,
    )
  ) {
    throw new Error(
      `Invalid manifest branch at "${path.join(
        ".",
      )}".`,
    );
  }


  const paths:
    Array<
      readonly string[]
    > = [
      path,
    ];


  for (
    const [
      key,
      value,
    ] of Object.entries(
      manifest,
    )
  ) {
    if (
      !isDescriptor(
        value,
      )
    ) {
      paths.push(
        ...collectManifestBranchPaths(
          value,
          [
            ...path,
            key,
          ],
        ),
      );
    }
  }


  return paths;
}


export function readPath(
  value:
    unknown,
  path:
    readonly string[],
): unknown {
  let current =
    value;


  for (
    const segment of path
  ) {
    if (
      current === null ||
      typeof current !==
        "object"
    ) {
      return undefined;
    }


    current =
      (
        current as Record<
          string,
          unknown
        >
      )[
        segment
      ];
  }


  return current;
}


export function createValueAtPath(
  path:
    readonly string[],
  value:
    unknown,
): Record<
  string,
  unknown
> {
  if (
    path.length ===
    0
  ) {
    throw new Error(
      "A token path is required.",
    );
  }


  const [
    first,
    ...rest
  ] =
    path;


  if (!first) {
    throw new Error(
      "A valid token path is required.",
    );
  }


  return {
    [first]:
      rest.length ===
      0
        ? value
        : createValueAtPath(
            rest,
            value,
          ),
  };
}


export function createValidManifestValue(
  manifest:
    unknown,
): unknown {
  if (
    isDescriptor(
      manifest,
    )
  ) {
    return manifest.kind ===
      "fontWeight"
      ? 500
      : "valid-token-value";
  }


  if (
    manifest === null ||
    typeof manifest !==
      "object" ||
    Array.isArray(
      manifest,
    )
  ) {
    throw new Error(
      "Invalid manifest structure.",
    );
  }


  const result:
    Record<
      string,
      unknown
    > = {};


  for (
    const [
      key,
      value,
    ] of Object.entries(
      manifest,
    )
  ) {
    result[
      key
    ] =
      createValidManifestValue(
        value,
      );
  }


  return result;
}


export function createValidationTheme(
  tokens:
    unknown,
) {
  return {
    name:
      "token-validation",

    source:
      "custom",

    metadata: {
      colorScheme:
        "light",
    },

    tokens,
  };
}