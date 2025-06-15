import { FitBoundsOptions, fitBounds } from '@math.gl/web-mercator'
import { useCallback, useMemo, useState } from 'react'

import useDetectScreen from '@/hooks/useDetectScreen'
import { fetchWaterings } from '@/hooks/useWateringsApi'
import { apiWaterings } from '@/lib/api/wateringsMock'
import { Watering } from '@/lib/types/entityTypes'
import useSettingsStore from '@/zustand/useSettingsStore'

const limitWateringsLength = (arr: Watering[], length: number) => {
  if (arr.length > length) {
    return arr.slice(0, length)
  }
  return arr
}

/** hook to use the waterings from a cached api request */
const useWaterings = () => {
  const markersCount = useSettingsStore(state => state.markersCount)
  const { viewportWidth, viewportHeight } = useDetectScreen()
  const [rawWaterings, setRawWaterings] = useState<Watering[]>()

  if (!rawWaterings) {
    fetchWaterings().then(result => setRawWaterings(result))
  }

  /** this mostly internally used memo contains the limiter - remove it in your application on demand */
  const markerData = useMemo(() => limitWateringsLength(apiWaterings, markersCount), [markersCount])

  /** get watering object by id input */
  const getWateringById = useCallback(
    (id: Watering['id']) => rawWaterings && rawWaterings.find(watering => watering.id === id),
    [rawWaterings],
  )

  const getWateringsBounds = useCallback(
    (waterings: Watering[], options?: FitBoundsOptions) => {
      if (!viewportWidth || !viewportHeight) return undefined

      const lat = waterings.map(p => p.latitude)
      const lng = waterings.map(p => p.longitude)

      const bounds: FitBoundsOptions['bounds'] = [
        [Math.min.apply(null, lng), Math.min.apply(null, lat)],
        [Math.max.apply(null, lng), Math.max.apply(null, lat)],
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
    rawWaterings,
    markerData,
    allWateringsBounds,
    currentBounds,
    getWateringById,
  } as const
}

export default useWaterings
