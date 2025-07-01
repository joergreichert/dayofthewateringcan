// FIXME: naming and structure
export const AppConfig = {
  defaultLanguage: 'de',
  defaultMarkerCount: 500,
  defaultClusterRadius: 80,
  ui: {
    barHeight: 80,
    barIconSize: 32,
    bigIconSize: 48,
    markerIconSize: 32,
    twBorderRadius: 'rounded',
    mapIconSizeSmall: 28,
    mapIconSizeVerySmall: 16,
    mapIconSizeBig: 56,
  },
  map: {
    deadzone: 50,
    tileKey: process.env.NEXT_PUBLIC_MAPTILER_KEY,
    apiEndpoint: process.env.NEXT_PUBLIC_MAPBOX_API_ENDPOINT,
    boundingBox: process.env.NEXT_PUBLIC_MAP_BOUNDING_BOX,
    apiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
  },
  animationDuration: 500,
}

export enum NavVariant {
  INTRO = 'vertical',
  TOPNAV = 'horizontal',
}
