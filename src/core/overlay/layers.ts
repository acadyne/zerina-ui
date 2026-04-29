// src/core/overlay/layers.ts

export const UI_LAYERS = {
  base: 0,
  dropdown: 1000,
  popover: 1100,
  sticky: 1200,
  modalBackdrop: 1400,
  modal: 1500,
  toast: 1600,
  tooltip: 1700,
} as const;

export type OverlayLayerName = keyof typeof UI_LAYERS;

export function getLayerZIndex(layer: OverlayLayerName): number {
  return UI_LAYERS[layer];
}