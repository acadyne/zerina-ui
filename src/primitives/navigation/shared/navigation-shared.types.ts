export type NavigationSurfacePosition =
  | "fixed"
  | "sticky"
  | "static";


export type NavigationSurfaceVariant =
  | "plain"
  | "surface"
  | "floating";


export type NavigationDestinationLabelBehavior =
  | "always"
  | "active"
  | "never";


export type NavigationDestinationIndicator =
  | "background"
  | "pill"
  | "dot"
  | "none";


export type NavigationDestinationDensity =
  | "compact"
  | "comfortable";


export type NavigationDestinationBadgeAnchor =
  | "icon"
  | "content"
  | "item";


export type NavigationDestinationBadgePlacement =
  | "top-end"
  | "top-center"
  | "inline-end";


export type NavigationDestinationItemShape =
  | "rounded"
  | "pill"
  | "circle"
  | "none";


export interface NavigationDestinationBadgeOffset {
  x?: number | string;
  y?: number | string;
}
