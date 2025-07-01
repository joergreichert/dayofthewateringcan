import type { LayerProps } from 'react-map-gl'

import tailwindConfig from '@/root/tailwind.config'

export const clusterLayer = (size: number, color: string): LayerProps => ({
  id: 'cluster-watering',
  type: 'circle',
  source: 'source-watering',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': color,
    'circle-radius': size / 2,
  },
})

export const clusterBelowLayer = (size: number, color: string): LayerProps => ({
  id: 'cluster-below-watering',
  type: 'circle',
  source: 'source-watering',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': color,
    'circle-opacity': 0.5,
    'circle-radius': size / 2 + 8,
  },
})

export const clusterCountLayer = (): LayerProps => ({
  id: `cluster-count-watering`,
  type: 'symbol',
  source: `source-watering`,
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Catamaran Bold', 'Arial Unicode MS Bold'],
    'text-size': 10,
    'text-allow-overlap': true,
  },
  paint: {
    'text-color': tailwindConfig.theme.colors.dark,
    'text-opacity': 0.95,
  },
})

export const clusterCountBadgeLayer = (size: number): LayerProps => ({
  id: 'cluster-badge-count-watering',
  type: 'circle',
  source: `source-watering`,
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': 'transparent',
    'circle-radius': size / 2 - 6,
    'circle-stroke-opacity': 0.5,
    // 'circle-translate': [0, -size / 2 / 1.4],
    'circle-stroke-width': 1, // Adjust the border width as needed
    'circle-stroke-color': tailwindConfig.theme.colors.white,
  },
})

export const markerLayer = (size: number, color: string): LayerProps => ({
  id: `marker-watering`,
  type: 'circle',
  source: `source-watering`,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': color,
    'circle-radius': size / 2,
  },
})

export const iconLayer = (size: number): LayerProps => ({
  id: `icon-layer-watering`,
  type: 'symbol',
  source: `source-watering`,
  layout: {
    'text-allow-overlap': true,
    'icon-image': `thumb-watering`,
    'icon-size': (size / 2) * 0.025,
    'text-ignore-placement': true,
    'text-optional': true,
  },
})
