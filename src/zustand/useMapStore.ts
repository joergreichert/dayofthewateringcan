import { ViewState } from 'react-map-gl'
import { create } from 'zustand'

import { AppConfig } from '@/lib/AppConfig'
import { WaterType, Watering } from '@/lib/types/entityTypes'

interface MapStoreValues {
  viewportWidth?: number
  setViewportWidth: (payload: number | undefined) => void
  viewportHeight?: number
  setViewportHeight: (payload: number | undefined) => void
  selectedWaterType: WaterType | undefined
  setSelectedWaterType: (payload: WaterType | undefined) => void
  markerPopup?: number
  setMarkerPopup: (payload: number | undefined) => void
  viewState: ViewState | undefined
  setViewState: (payload: ViewState) => void
  throttledViewState: ViewState | undefined
  setThrottledViewState: (payload: ViewState) => void
  isAnimating: boolean
  setIsAnimating: (payload: boolean) => void
  isZoomOut: boolean
  setIsZoomOut: (payload: boolean) => void
  isMapGlLoaded?: boolean
  setIsMapGlLoaded: (payload: boolean) => void
  clusterRadius: number
  setClusterRadius: (payload: number) => void
  waterings: Watering[]
  setWaterings: (waterings: Watering[]) => void
}

/**
 * A custom hook that creates a Zustand store for managing map-related state.
 * @returns An object containing the store's state values and setter functions.
 */
const useMapStore = create<MapStoreValues>()(set => ({
  viewportWidth: undefined,
  setViewportWidth: payload => set(() => ({ viewportWidth: payload })),

  viewportHeight: undefined,
  setViewportHeight: payload => set(() => ({ viewportHeight: payload })),

  selectedWaterType: undefined,
  setSelectedWaterType: payload => set(() => ({ selectedWaterType: payload })),

  markerPopup: undefined,
  setMarkerPopup: payload => set(() => ({ markerPopup: payload })),

  viewState: undefined,
  setViewState: payload => set(() => ({ viewState: payload })),

  throttledViewState: undefined,
  setThrottledViewState: payload => set(() => ({ throttledViewState: payload })),

  isAnimating: false,
  setIsAnimating: payload => set(() => ({ isAnimating: payload })),

  isZoomOut: false,
  setIsZoomOut: payload => set(() => ({ isZoomOut: payload })),

  isMapGlLoaded: false,
  setIsMapGlLoaded: payload => set(() => ({ isMapGlLoaded: payload })),

  clusterRadius: AppConfig.defaultClusterRadius,
  setClusterRadius: payload => set(() => ({ clusterRadius: payload })),

  waterings: [],
  setWaterings: payload => set(() => ({ waterings: payload })),
}))

export default useMapStore
