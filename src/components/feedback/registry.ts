// src/components/feedback/registry.ts

export const skeletonRegistry = {
  block: "block",
  card: "card",
  table: "table",
  text: "text",
  circle: "circle",
  userRow: "user-row",
  dashboard: "dashboard",
  sidebar: "sidebar",
} as const;

export type SkeletonKey = keyof typeof skeletonRegistry;
export type SkeletonName = (typeof skeletonRegistry)[SkeletonKey];