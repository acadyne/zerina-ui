import type {
  NavigationMenuItemId,
} from "./navigationMenu.types";

export interface NavigationMenuIndexedItem<TItem> {
  item: TItem;
  itemId: NavigationMenuItemId;
  parentId: NavigationMenuItemId | null;
  depth: number;
  index: number;
}

export interface NavigationMenuLevel<TItem> {
  parentId: NavigationMenuItemId | null;
  depth: number;
  items: readonly NavigationMenuIndexedItem<TItem>[];
}

export interface BuildNavigationMenuIndexOptions<TItem> {
  items: readonly TItem[];

  getItemId: (
    item: TItem
  ) => NavigationMenuItemId;

  getItemChildren: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => readonly TItem[] | undefined;
}

export function createNavigationMenuOpenPath(
  values?: readonly NavigationMenuItemId[]
): NavigationMenuItemId[] {
  return values ? [...values] : [];
}

export function areNavigationMenuOpenPathsEqual(
  first: readonly NavigationMenuItemId[],
  second: readonly NavigationMenuItemId[]
): boolean {
  if (first === second) {
    return true;
  }

  if (first.length !== second.length) {
    return false;
  }

  return first.every(
    (itemId, index) => itemId === second[index]
  );
}

/**
 * Conserva los niveles anteriores y sustituye el elemento del nivel indicado.
 *
 * Ejemplo:
 *
 * ["projects", "clients", "europe"]
 * depth = 1
 * itemId = "settings"
 *
 * Resultado:
 * ["projects", "settings"]
 */
export function setNavigationMenuOpenItemAtDepth(
  openPath: readonly NavigationMenuItemId[],
  depth: number,
  itemId: NavigationMenuItemId
): NavigationMenuItemId[] {
  const safeDepth = Math.max(0, depth);
  const nextPath = openPath.slice(0, safeDepth);

  nextPath[safeDepth] = itemId;

  return nextPath;
}

/**
 * Elimina el elemento del nivel indicado y todos sus descendientes.
 */
export function closeNavigationMenuFromDepth(
  openPath: readonly NavigationMenuItemId[],
  depth: number
): NavigationMenuItemId[] {
  const safeDepth = Math.max(0, depth);

  return openPath.slice(0, safeDepth);
}

/**
 * Cierra únicamente los descendientes de un nivel, conservando el elemento
 * abierto en ese nivel.
 */
export function closeNavigationMenuAfterDepth(
  openPath: readonly NavigationMenuItemId[],
  depth: number
): NavigationMenuItemId[] {
  const safeDepth = Math.max(0, depth);

  return openPath.slice(0, safeDepth + 1);
}

export function isNavigationMenuItemOpen(
  openPath: readonly NavigationMenuItemId[],
  itemId: NavigationMenuItemId
): boolean {
  return openPath.includes(itemId);
}

export function getNavigationMenuOpenItemAtDepth(
  openPath: readonly NavigationMenuItemId[],
  depth: number
): NavigationMenuItemId | undefined {
  return openPath[depth];
}

export function getNavigationMenuItemDepthInOpenPath(
  openPath: readonly NavigationMenuItemId[],
  itemId: NavigationMenuItemId
): number {
  return openPath.indexOf(itemId);
}

export function buildNavigationMenuItemIndex<TItem>({
  items,
  getItemId,
  getItemChildren,
}: BuildNavigationMenuIndexOptions<TItem>): Map<
  NavigationMenuItemId,
  NavigationMenuIndexedItem<TItem>
> {
  const index = new Map<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >();

  const activePath = new Set<NavigationMenuItemId>();

  const visit = (
    currentItems: readonly TItem[],
    parentId: NavigationMenuItemId | null,
    depth: number
  ): void => {
    currentItems.forEach((item, itemIndex) => {
      const itemId = getItemId(item);

      if (activePath.has(itemId)) {
        return;
      }

      index.set(itemId, {
        item,
        itemId,
        parentId,
        depth,
        index: itemIndex,
      });

      const children = getItemChildren(item, itemId);

      if (!children || children.length === 0) {
        return;
      }

      activePath.add(itemId);
      visit(children, itemId, depth + 1);
      activePath.delete(itemId);
    });
  };

  visit(items, null, 0);

  return index;
}

export function getNavigationMenuItem<TItem>(
  index: ReadonlyMap<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >,
  itemId: NavigationMenuItemId
): NavigationMenuIndexedItem<TItem> | undefined {
  return index.get(itemId);
}

export function getNavigationMenuParentItem<TItem>(
  index: ReadonlyMap<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >,
  itemId: NavigationMenuItemId
): NavigationMenuIndexedItem<TItem> | undefined {
  const current = index.get(itemId);

  if (!current || current.parentId === null) {
    return undefined;
  }

  return index.get(current.parentId);
}

export function getNavigationMenuItemAncestors<TItem>(
  index: ReadonlyMap<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >,
  itemId: NavigationMenuItemId
): NavigationMenuIndexedItem<TItem>[] {
  const ancestors: NavigationMenuIndexedItem<TItem>[] = [];

  let current = index.get(itemId);

  while (current?.parentId !== null && current?.parentId !== undefined) {
    const parent = index.get(current.parentId);

    if (!parent) {
      break;
    }

    ancestors.unshift(parent);
    current = parent;
  }

  return ancestors;
}

export function createNavigationMenuPathToItem<TItem>(
  index: ReadonlyMap<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >,
  itemId: NavigationMenuItemId
): NavigationMenuItemId[] {
  const current = index.get(itemId);

  if (!current) {
    return [];
  }

  return [
    ...getNavigationMenuItemAncestors(index, itemId).map(
      (entry) => entry.itemId
    ),
    itemId,
  ];
}

export function getNavigationMenuLevelItems<TItem>(
  index: ReadonlyMap<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >,
  parentId: NavigationMenuItemId | null
): NavigationMenuIndexedItem<TItem>[] {
  return [...index.values()]
    .filter((entry) => entry.parentId === parentId)
    .sort((first, second) => first.index - second.index);
}

export function getFirstEnabledNavigationMenuItem<TItem>(
  items: readonly NavigationMenuIndexedItem<TItem>[],
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuIndexedItem<TItem> | undefined {
  return items.find(
    ({ item, itemId }) => !isDisabled(item, itemId)
  );
}

export function getLastEnabledNavigationMenuItem<TItem>(
  items: readonly NavigationMenuIndexedItem<TItem>[],
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuIndexedItem<TItem> | undefined {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const entry = items[index];

    if (!isDisabled(entry.item, entry.itemId)) {
      return entry;
    }
  }

  return undefined;
}

export function getNextEnabledNavigationMenuItem<TItem>(
  items: readonly NavigationMenuIndexedItem<TItem>[],
  currentId: NavigationMenuItemId,
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean,
  loop = true
): NavigationMenuIndexedItem<TItem> | undefined {
  if (items.length === 0) {
    return undefined;
  }

  const currentIndex = items.findIndex(
    (entry) => entry.itemId === currentId
  );

  if (currentIndex < 0) {
    return getFirstEnabledNavigationMenuItem(
      items,
      isDisabled
    );
  }

  for (let offset = 1; offset <= items.length; offset += 1) {
    const nextIndex = currentIndex + offset;

    if (!loop && nextIndex >= items.length) {
      return undefined;
    }

    const entry = items[nextIndex % items.length];

    if (!isDisabled(entry.item, entry.itemId)) {
      return entry;
    }
  }

  return undefined;
}

export function getPreviousEnabledNavigationMenuItem<TItem>(
  items: readonly NavigationMenuIndexedItem<TItem>[],
  currentId: NavigationMenuItemId,
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean,
  loop = true
): NavigationMenuIndexedItem<TItem> | undefined {
  if (items.length === 0) {
    return undefined;
  }

  const currentIndex = items.findIndex(
    (entry) => entry.itemId === currentId
  );

  if (currentIndex < 0) {
    return getLastEnabledNavigationMenuItem(
      items,
      isDisabled
    );
  }

  for (let offset = 1; offset <= items.length; offset += 1) {
    const previousIndex = currentIndex - offset;

    if (!loop && previousIndex < 0) {
      return undefined;
    }

    const wrappedIndex =
      (previousIndex + items.length) % items.length;

    const entry = items[wrappedIndex];

    if (!isDisabled(entry.item, entry.itemId)) {
      return entry;
    }
  }

  return undefined;
}

export function getFirstEnabledNavigationMenuChild<TItem>(
  index: ReadonlyMap<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >,
  parentId: NavigationMenuItemId,
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuIndexedItem<TItem> | undefined {
  return getFirstEnabledNavigationMenuItem(
    getNavigationMenuLevelItems(index, parentId),
    isDisabled
  );
}

export function getLastEnabledNavigationMenuChild<TItem>(
  index: ReadonlyMap<
    NavigationMenuItemId,
    NavigationMenuIndexedItem<TItem>
  >,
  parentId: NavigationMenuItemId,
  isDisabled: (
    item: TItem,
    itemId: NavigationMenuItemId
  ) => boolean
): NavigationMenuIndexedItem<TItem> | undefined {
  return getLastEnabledNavigationMenuItem(
    getNavigationMenuLevelItems(index, parentId),
    isDisabled
  );
}

export function getNavigationMenuErrorMessage(
  error: unknown,
  fallback = "No se pudieron cargar las opciones."
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}