import { FitBoundsOptions, fitBounds } from '@math.gl/web-mercator'
import { useCallback, useMemo } from 'react'

import useDetectScreen from '@/hooks/useDetectScreen'
import { Watering } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const limitWateringsLength = (arr: Watering[], length: number) => {
  if (arr.length > length) {
    return arr.slice(0, length)
  }
  return arr
}

export type ViewportProps = {
  latitude: number
  longitude: number
  zoom: number
}

type WateringResult = {
  waterings: Watering[] | undefined
  markerData: Watering[] | undefined
  allWateringsBounds: ViewportProps | undefined
  currentBounds: ViewportProps | undefined
  getWateringById: (id: number | undefined) => Watering | undefined
}

/** hook to use the waterings from a cached api request */
const useWaterings = (): WateringResult => {
  const markersCount = useSettingsStore(state => state.markersCount)
  const { viewportWidth, viewportHeight } = useDetectScreen()
  const waterings = useMapStore(state => state.waterings)

  /** this mostly internally used memo contains the limiter - remove it in your application on demand */
  const markerData = waterings && limitWateringsLength(waterings, markersCount)

  /** get watering object by id input */
  const getWateringById = useCallback(
    (id: Watering['id']) => waterings && waterings.find(watering => watering.id === id),
    [waterings],
  )

  const getWateringsBounds = useCallback(
    (input: Watering[], options?: FitBoundsOptions) => {
      if (!viewportWidth || !viewportHeight) return undefined

      const lat = input.map(p => p.latitude)
      const lng = input.map(p => p.longitude)

      /* const bounds: FitBoundsOptions['bounds'] = [
        [Math.min.apply(null, lng), Math.min.apply(null, lat)],
        [Math.max.apply(null, lng), Math.max.apply(null, lat)],
      ] */
      const bounds: FitBoundsOptions['bounds'] = [
        [5.8663149923, 47.270111618],
        [15.04193075, 55.0991611588],
      ]

      if (bounds[0][0] === Infinity || bounds[0][1] === Infinity) return undefined

      return fitBounds({
        bounds,
        width: viewportWidth,
        height: viewportHeight,
        padding: {
          bottom: 100,
          left: 50,
          right: 50,
          // Specifying the top padding, but getting the bottom one
          top: 150,
        },
        options,
      } as FitBoundsOptions)
    },
    [viewportHeight, viewportWidth],
  )

  // calc bounds of all selected waterType markers
  const allWateringsBounds = useMemo(() => {
    if (!markerData) return undefined

    return getWateringsBounds(markerData)
  }, [markerData, getWateringsBounds])

  const currentBounds = useMemo(
    () => allWateringsBounds,

    [allWateringsBounds],
  )

  return {
    waterings,
    markerData,
    allWateringsBounds,
    currentBounds,
    getWateringById,
  }
}

export default useWaterings
