// src/theme/validation/theme-validation.ts

import type {
  ThemeDefinition,
  ThemeExtensionTokens,
  ThemeExtensionValue,
  ThemeMetadata,
  ThemeSource,
  ThemeTokens,
  ThemeValidationDiagnostic,
  ThemeValidationResult,
} from "../contracts/theme.types";

import type {
  ThemeTokenDescriptor,
  ThemeTokenManifestBranch,
  ThemeTokenManifestNode,
} from "../contracts/theme-token-contract";

import {
  isThemeTokenDescriptor,
  THEME_TOKEN_MANIFEST,
} from "../contracts/theme-token-contract";


type DataProperties =
  Map<string, unknown>;


/*
 * Tablas privadas de pertenencia: la validación puede consultarlas,
 * pero ninguna ruta de ejecución debe mutarlas.
 */
const VALID_SOURCES:
  ReadonlySet<ThemeSource> =
    new Set<ThemeSource>([
    "builtin",
    "custom",
    "generated",
  ]);


const VALID_COLOR_SCHEMES:
  ReadonlySet<string> =
    new Set([
    "light",
    "dark",
  ]);


const THEME_KEYS:
  ReadonlySet<string> =
    new Set([
    "name",
    "source",
    "metadata",
    "extends",
    "tokens",
  ]);


const METADATA_KEYS:
  ReadonlySet<string> =
    new Set([
    "label",
    "description",
    "icon",
    "colorScheme",
  ]);


function createDiagnostic(
  level:
    ThemeValidationDiagnostic["level"],
  code: string,
  message: string,
  path?: string
): ThemeValidationDiagnostic {
  return {
    level,
    code,
    message,
    path,
  };
}


function addDiagnostic(
  diagnostics:
    ThemeValidationDiagnostic[],
  code: string,
  message: string,
  path?: string
): void {
  diagnostics.push(
    createDiagnostic(
      "error",
      code,
      message,
      path
    )
  );
}


function inspectDataObject(
  value: unknown,
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[],
  allowedKeys?: ReadonlySet<string>
): DataProperties | null {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    addDiagnostic(
      diagnostics,
      "theme.value.invalid_type",
      `${path || "Theme definition"} must be a plain object.`,
      path || undefined
    );

    return null;
  }


  let prototype: object | null;


  try {
    prototype =
      Object.getPrototypeOf(value);
  } catch {
    addDiagnostic(
      diagnostics,
      "theme.value.uninspectable",
      `${path || "Theme definition"} could not be inspected safely.`,
      path || undefined
    );

    return null;
  }


  if (
    prototype !== Object.prototype &&
    prototype !== null
  ) {
    addDiagnostic(
      diagnostics,
      "theme.value.invalid_object",
      `${path || "Theme definition"} must be a plain object.`,
      path || undefined
    );

    return null;
  }


  let keys: readonly PropertyKey[];


  try {
    keys =
      Reflect.ownKeys(value);
  } catch {
    addDiagnostic(
      diagnostics,
      "theme.value.uninspectable",
      `${path || "Theme definition"} could not be inspected safely.`,
      path || undefined
    );

    return null;
  }


  const properties:
    DataProperties =
    new Map();


  for (const key of keys) {
    if (typeof key !== "string") {
      addDiagnostic(
        diagnostics,
        "theme.property.symbol",
        `${path || "Theme definition"} cannot contain symbol properties.`,
        path || undefined
      );

      continue;
    }


    const propertyPath =
      path
        ? `${path}.${key}`
        : key;


    if (
      allowedKeys &&
      !allowedKeys.has(key)
    ) {
      addDiagnostic(
        diagnostics,
        "theme.property.unknown",
        `Unknown theme property: ${propertyPath}.`,
        propertyPath
      );
    }


    let descriptor:
      PropertyDescriptor | undefined;


    try {
      descriptor =
        Object.getOwnPropertyDescriptor(
          value,
          key
        );
    } catch {
      addDiagnostic(
        diagnostics,
        "theme.property.uninspectable",
        `${propertyPath} could not be inspected safely.`,
        propertyPath
      );

      continue;
    }


    if (!descriptor) {
      addDiagnostic(
        diagnostics,
        "theme.property.uninspectable",
        `${propertyPath} could not be inspected safely.`,
        propertyPath
      );

      continue;
    }


    if (!("value" in descriptor)) {
      addDiagnostic(
        diagnostics,
        "theme.property.accessor",
        `${propertyPath} must be a data property and cannot use a getter or setter.`,
        propertyPath
      );

      continue;
    }


    if (!descriptor.enumerable) {
      addDiagnostic(
        diagnostics,
        "theme.property.non_enumerable",
        `${propertyPath} must be enumerable.`,
        propertyPath
      );

      continue;
    }


    properties.set(
      key,
      descriptor.value
    );
  }


  return properties;
}


function defineValue(
  target: object,
  key: string,
  value: unknown
): void {
  Object.defineProperty(
    target,
    key,
    {
      value,
      enumerable: true,
      writable: true,
      configurable: true,
    }
  );
}


function readOptionalString(
  properties: DataProperties,
  key: string,
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[]
): string | undefined {
  if (!properties.has(key)) {
    return undefined;
  }


  const value =
    properties.get(key);


  if (value === undefined) {
    return undefined;
  }


  if (
    typeof value === "string" &&
    value.trim().length > 0
  ) {
    return value;
  }


  addDiagnostic(
    diagnostics,
    "theme.string.required",
    `${path} must be a non-empty string.`,
    path
  );


  return undefined;
}


function readRequiredString(
  properties: DataProperties,
  key: string,
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[]
): string | undefined {
  const value =
    readOptionalString(
      properties,
      key,
      path,
      diagnostics
    );


  if (
    value === undefined &&
    (
      !properties.has(key) ||
      properties.get(key) ===
      undefined
    )
  ) {
    addDiagnostic(
      diagnostics,
      "theme.string.required",
      `${path} must be a non-empty string.`,
      path
    );
  }


  return value;
}

function validateThemeIdentifier(
  value: string | undefined,
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[]
): string | undefined {
  if (value === undefined) {
    return undefined;
  }


  if (
    value !==
    value.trim()
  ) {
    addDiagnostic(
      diagnostics,
      "theme.identifier.whitespace",
      `${path} must not contain leading or trailing whitespace.`,
      path
    );

    return undefined;
  }


  return value;
}


function readOptionalThemeIdentifier(
  properties: DataProperties,
  key: string,
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[]
): string | undefined {
  return validateThemeIdentifier(
    readOptionalString(
      properties,
      key,
      path,
      diagnostics
    ),
    path,
    diagnostics
  );
}


function readRequiredThemeIdentifier(
  properties: DataProperties,
  key: string,
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[]
): string | undefined {
  return validateThemeIdentifier(
    readRequiredString(
      properties,
      key,
      path,
      diagnostics
    ),
    path,
    diagnostics
  );
}


function normalizeThemeTokenLeaf(
  value: unknown,
  path: string,
  descriptor:
    ThemeTokenDescriptor,
  diagnostics:
    ThemeValidationDiagnostic[]
): string | number | undefined {
  if (
    descriptor.kind ===
    "fontWeight"
  ) {
    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value;
    }


    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }


    addDiagnostic(
      diagnostics,
      "theme.typography.font_weight.invalid",
      `${path} must be a non-empty string or a finite number.`,
      path
    );


    return undefined;
  }


  if (
    typeof value === "string" &&
    value.trim().length > 0
  ) {
    return value;
  }


  addDiagnostic(
    diagnostics,
    "theme.token.invalid",
    `${path} must be a non-empty string.`,
    path
  );


  return undefined;
}


function normalizeThemeTokenNode(
  value: unknown,
  path: string,
  node:
    ThemeTokenManifestNode,
  diagnostics:
    ThemeValidationDiagnostic[]
): unknown {
  if (
    isThemeTokenDescriptor(
      node
    )
  ) {
    return normalizeThemeTokenLeaf(
      value,
      path,
      node,
      diagnostics
    );
  }


  return normalizeThemeTokenBranch(
    value,
    path,
    node,
    diagnostics
  );
}


function normalizeThemeTokenBranch(
  value: unknown,
  path: string,
  manifest:
    ThemeTokenManifestBranch,
  diagnostics:
    ThemeValidationDiagnostic[]
): Record<string, unknown> | undefined {
  if (value === undefined) {
    return undefined;
  }


  const allowedKeys =
    new Set(
      Object.keys(
        manifest
      )
    );


  const properties =
    inspectDataObject(
      value,
      path,
      diagnostics,
      allowedKeys
    );


  if (!properties) {
    return undefined;
  }


  const result:
    Record<string, unknown> = {};


  for (
    const [
      key,
      node,
    ] of Object.entries(
      manifest
    ) as Array<
      [
        string,
        ThemeTokenManifestNode,
      ]
    >
  ) {
    if (
      !properties.has(key)
    ) {
      continue;
    }


    const normalized =
      normalizeThemeTokenNode(
        properties.get(key),
        `${path}.${key}`,
        node,
        diagnostics
      );


    if (
      normalized !== undefined
    ) {
      defineValue(
        result,
        key,
        normalized
      );
    }
  }


  return result;
}


function isArrayIndex(
  key: string
): boolean {
  if (!/^(0|[1-9]\d*)$/.test(key)) {
    return false;
  }


  const index =
    Number(key);


  return (
    Number.isSafeInteger(index) &&
    index >= 0 &&
    index < 4_294_967_295
  );
}


function normalizeExtensionArray(
  value: unknown[],
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[],
  ancestors: WeakSet<object>
): readonly ThemeExtensionValue[] | undefined {
  let keys: readonly PropertyKey[];


  try {
    keys =
      Reflect.ownKeys(value);
  } catch {
    addDiagnostic(
      diagnostics,
      "theme.extensions.uninspectable",
      `${path} could not be inspected safely.`,
      path
    );

    return undefined;
  }


  let length: number;


  try {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        "length"
      );


    if (
      !descriptor ||
      !("value" in descriptor) ||
      typeof descriptor.value !==
      "number" ||
      !Number.isSafeInteger(
        descriptor.value
      ) ||
      descriptor.value < 0
    ) {
      throw new Error();
    }


    length =
      descriptor.value;
  } catch {
    addDiagnostic(
      diagnostics,
      "theme.extensions.uninspectable",
      `${path} has an invalid array structure.`,
      path
    );

    return undefined;
  }


  const indexKeys: string[] = [];


  for (const key of keys) {
    if (key === "length") {
      continue;
    }


    if (
      typeof key !== "string" ||
      !isArrayIndex(key)
    ) {
      addDiagnostic(
        diagnostics,
        "theme.extensions.array_property.invalid",
        `${path} contains an invalid array property.`,
        path
      );

      return undefined;
    }


    indexKeys.push(key);
  }


  if (indexKeys.length !== length) {
    addDiagnostic(
      diagnostics,
      "theme.extensions.array_sparse",
      `${path} must be a dense array without missing elements.`,
      path
    );

    return undefined;
  }


  const sortedIndexes =
    indexKeys
      .map(Number)
      .sort(
        (left, right) =>
          left - right
      );


  if (
    sortedIndexes.some(
      (index, position) =>
        index !== position
    )
  ) {
    addDiagnostic(
      diagnostics,
      "theme.extensions.array_sparse",
      `${path} must contain consecutive array indexes.`,
      path
    );

    return undefined;
  }


  const result:
    ThemeExtensionValue[] = [];


  for (const index of sortedIndexes) {
    const key =
      String(index);


    let descriptor:
      PropertyDescriptor | undefined;


    try {
      descriptor =
        Object.getOwnPropertyDescriptor(
          value,
          key
        );
    } catch {
      addDiagnostic(
        diagnostics,
        "theme.extensions.uninspectable",
        `${path}[${key}] could not be inspected safely.`,
        `${path}[${key}]`
      );

      return undefined;
    }


    if (
      !descriptor ||
      !("value" in descriptor) ||
      !descriptor.enumerable
    ) {
      addDiagnostic(
        diagnostics,
        "theme.extensions.array_property.invalid",
        `${path}[${key}] must be an enumerable data property.`,
        `${path}[${key}]`
      );

      return undefined;
    }


    const normalized =
      normalizeExtensionValue(
        descriptor.value,
        `${path}[${key}]`,
        diagnostics,
        ancestors
      );


    if (normalized === undefined) {
      return undefined;
    }


    result.push(normalized);
  }


  return result;
}


function normalizeExtensionValue(
  value: unknown,
  path: string,
  diagnostics:
    ThemeValidationDiagnostic[],
  ancestors: WeakSet<object>
): ThemeExtensionValue | undefined {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }


  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }


  if (
    value === null ||
    typeof value !== "object"
  ) {
    addDiagnostic(
      diagnostics,
      "theme.extensions.value.invalid",
      `${path} contains a value outside the structured extension contract.`,
      path
    );

    return undefined;
  }


  if (ancestors.has(value)) {
    addDiagnostic(
      diagnostics,
      "theme.extensions.circular",
      `${path} contains a circular reference.`,
      path
    );

    return undefined;
  }


  ancestors.add(value);


  try {
    if (Array.isArray(value)) {
      return normalizeExtensionArray(
        value,
        path,
        diagnostics,
        ancestors
      );
    }


    const properties =
      inspectDataObject(
        value,
        path,
        diagnostics
      );


    if (!properties) {
      return undefined;
    }


    const result:
      Record<
        string,
        ThemeExtensionValue
      > = {};


    for (
      const [
        key,
        item,
      ] of properties
    ) {
      const normalized =
        normalizeExtensionValue(
          item,
          `${path}.${key}`,
          diagnostics,
          ancestors
        );


      if (normalized !== undefined) {
        defineValue(
          result,
          key,
          normalized
        );
      }
    }


    return result;
  } finally {
    ancestors.delete(value);
  }
}


function normalizeExtensions(
  value: unknown,
  diagnostics:
    ThemeValidationDiagnostic[]
): ThemeExtensionTokens | undefined {
  if (value === undefined) {
    return undefined;
  }


  const path =
    "tokens.extensions";


  const properties =
    inspectDataObject(
      value,
      path,
      diagnostics
    );


  if (!properties) {
    return undefined;
  }


  const ancestors =
    new WeakSet<object>();


  ancestors.add(
    value as object
  );


  const result:
    Record<
      string,
      ThemeExtensionValue
    > = {};


  try {
    for (
      const [
        key,
        extensionValue,
      ] of properties
    ) {
      const normalized =
        normalizeExtensionValue(
          extensionValue,
          `${path}.${key}`,
          diagnostics,
          ancestors
        );


      if (normalized !== undefined) {
        defineValue(
          result,
          key,
          normalized
        );
      }
    }
  } finally {
    ancestors.delete(
      value as object
    );
  }


  return result;
}


function normalizeMetadata(
  value: unknown,
  diagnostics:
    ThemeValidationDiagnostic[]
): ThemeMetadata | undefined {
  if (value === undefined) {
    return undefined;
  }


  const path =
    "metadata";


  const properties =
    inspectDataObject(
      value,
      path,
      diagnostics,
      METADATA_KEYS
    );


  if (!properties) {
    return undefined;
  }


  const result:
    ThemeMetadata = {};


  const label =
    readOptionalString(
      properties,
      "label",
      `${path}.label`,
      diagnostics
    );


  const description =
    readOptionalString(
      properties,
      "description",
      `${path}.description`,
      diagnostics
    );


  const icon =
    readOptionalString(
      properties,
      "icon",
      `${path}.icon`,
      diagnostics
    );


  if (label !== undefined) {
    result.label = label;
  }


  if (description !== undefined) {
    result.description =
      description;
  }


  if (icon !== undefined) {
    result.icon = icon;
  }


  if (
    properties.has("colorScheme") &&
    properties.get("colorScheme") !==
    undefined
  ) {
    const colorScheme =
      properties.get("colorScheme");


    if (
      typeof colorScheme === "string" &&
      VALID_COLOR_SCHEMES.has(
        colorScheme
      )
    ) {
      result.colorScheme =
        colorScheme as
        ThemeMetadata["colorScheme"];
    } else {
      addDiagnostic(
        diagnostics,
        "theme.metadata.color_scheme.invalid",
        "metadata.colorScheme must be either \"light\" or \"dark\".",
        "metadata.colorScheme"
      );
    }
  }


  return result;
}


function normalizeTokens(
  value: unknown,
  diagnostics:
    ThemeValidationDiagnostic[]
): ThemeTokens | undefined {
  if (value === undefined) {
    return undefined;
  }


  const allowedKeys =
    new Set([
      ...Object.keys(
        THEME_TOKEN_MANIFEST
      ),

      "extensions",
    ]);


  const properties =
    inspectDataObject(
      value,
      "tokens",
      diagnostics,
      allowedKeys
    );


  if (!properties) {
    return undefined;
  }


  const result:
    ThemeTokens = {};


  for (
    const [
      key,
      node,
    ] of Object.entries(
      THEME_TOKEN_MANIFEST
    ) as Array<
      [
        string,
        ThemeTokenManifestNode,
      ]
    >
  ) {
    if (
      !properties.has(key)
    ) {
      continue;
    }


    const normalized =
      normalizeThemeTokenNode(
        properties.get(key),
        `tokens.${key}`,
        node,
        diagnostics
      );


    if (
      normalized !== undefined
    ) {
      defineValue(
        result,
        key,
        normalized
      );
    }
  }


  const extensions =
    normalizeExtensions(
      properties.get(
        "extensions"
      ),
      diagnostics
    );


  if (extensions) {
    result.extensions =
      extensions;
  }


  return result;
}


function normalizeThemeDefinition(
  value: unknown,
  diagnostics:
    ThemeValidationDiagnostic[]
): ThemeDefinition | undefined {
  const properties =
    inspectDataObject(
      value,
      "",
      diagnostics,
      THEME_KEYS
    );


  if (!properties) {
    return undefined;
  }


  const name =
    readRequiredThemeIdentifier(
      properties,
      "name",
      "name",
      diagnostics
    );


  const sourceValue =
    properties.get("source");


  let source:
    ThemeSource | undefined;


  if (
    typeof sourceValue === "string" &&
    VALID_SOURCES.has(
      sourceValue as ThemeSource
    )
  ) {
    source =
      sourceValue as ThemeSource;
  } else {
    addDiagnostic(
      diagnostics,
      "theme.source.invalid",
      "source must be \"builtin\", \"custom\", or \"generated\".",
      "source"
    );
  }


  const hasDeclaredExtends =
    properties.has(
      "extends"
    ) &&
    properties.get(
      "extends"
    ) !== undefined;


  const extendsName =
    readOptionalThemeIdentifier(
      properties,
      "extends",
      "extends",
      diagnostics
    );

  if (
    name !== undefined &&
    extendsName === name
  ) {
    addDiagnostic(
      diagnostics,
      "theme.inheritance.self_reference",
      "A theme cannot extend itself.",
      "extends"
    );
  }


  const metadata =
    normalizeMetadata(
      properties.get("metadata"),
      diagnostics
    );


  const tokens =
    normalizeTokens(
      properties.get("tokens"),
      diagnostics
    );

  /*
   * Root themes establish the color scheme inherited by descendants.
   * Derived themes may omit it and inherit the nearest explicit value.
   *
   * An invalid declared extends value is not treated as if inheritance
   * had never been declared. Its own validation diagnostic is sufficient.
   */
  if (
    !hasDeclaredExtends &&
    metadata?.colorScheme ===
    undefined
  ) {
    addDiagnostic(
      diagnostics,
      "theme.metadata.color_scheme.required",
      "A root theme must define metadata.colorScheme.",
      "metadata.colorScheme"
    );
  }



  if (
    name === undefined ||
    source === undefined
  ) {
    return undefined;
  }


  const result:
    ThemeDefinition = {
    name,
    source,
  };


  if (metadata !== undefined) {
    result.metadata =
      metadata;
  }


  if (extendsName !== undefined) {
    result.extends =
      extendsName;
  }


  if (tokens !== undefined) {
    result.tokens =
      tokens;
  }


  return result;
}


export function validateThemeDefinition(
  value: unknown
): ThemeValidationResult {
  const diagnostics:
    ThemeValidationDiagnostic[] = [];


  try {
    const normalized =
      normalizeThemeDefinition(
        value,
        diagnostics
      );


    if (
      !normalized ||
      diagnostics.some(
        (diagnostic) =>
          diagnostic.level ===
          "error"
      )
    ) {
      return {
        valid: false,
        diagnostics,
      };
    }


    return {
      valid: true,
      value: normalized,
      diagnostics,
    };
  } catch {
    return {
      valid: false,

      diagnostics: [
        ...diagnostics,

        createDiagnostic(
          "error",
          "theme.definition.uninspectable",
          "Theme definition could not be inspected safely."
        ),
      ],
    };
  }
}
