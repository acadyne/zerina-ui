// src/theme/internal/theme-object-utils.ts

export function cloneThemeValue<T>(
  value: T,
  seen = new WeakMap<object, unknown>()
): T {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }


  const existingClone =
    seen.get(value);


  if (existingClone) {
    return existingClone as T;
  }


  if (Array.isArray(value)) {
    const clone: unknown[] = [];


    seen.set(
      value,
      clone
    );


    for (const item of value) {
      clone.push(
        cloneThemeValue(
          item,
          seen
        )
      );
    }


    return clone as T;
  }


  const prototype =
    Object.getPrototypeOf(value);


  if (
    prototype !== Object.prototype &&
    prototype !== null
  ) {
    throw new TypeError(
      "Theme values must contain only arrays, plain objects, and primitives."
    );
  }


  const clone =
    Object.create(
      prototype
    ) as Record<string, unknown>;


  seen.set(
    value,
    clone
  );


  for (
    const key of Reflect.ownKeys(value)
  ) {
    if (typeof key !== "string") {
      throw new TypeError(
        "Theme values cannot contain symbol properties."
      );
    }


    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );


    if (
      !descriptor ||
      !("value" in descriptor) ||
      !descriptor.enumerable
    ) {
      throw new TypeError(
        "Theme values must contain only enumerable data properties."
      );
    }


    Object.defineProperty(
      clone,
      key,
      {
        value: cloneThemeValue(
          descriptor.value,
          seen
        ),

        enumerable: true,
        writable: true,
        configurable: true,
      }
    );
  }


  return clone as T;
}

export function deepFreeze<T>(
  value: T,
  visited = new WeakSet<object>()
): T {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }


  const objectValue =
    value as object;


  if (visited.has(objectValue)) {
    return value;
  }


  visited.add(objectValue);


  for (
    const key of Reflect.ownKeys(
      objectValue
    )
  ) {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        objectValue,
        key
      );


    if (
      descriptor &&
      "value" in descriptor
    ) {
      deepFreeze(
        descriptor.value,
        visited
      );
    }
  }


  return Object.freeze(value);
}