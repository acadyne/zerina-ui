// src/theme/internal/theme-object-utils.ts

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