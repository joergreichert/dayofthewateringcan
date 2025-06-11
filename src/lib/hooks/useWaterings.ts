import { FitBoundsOptions, fitBounds } from '@math.gl/web-mercator'
import { useCallback, useMemo, useRef } from 'react'

import useDetectScreen from '@/hooks/useDetectScreen'
import useWaterTypes from '@/hooks/useWaterTypes'
import { fetchWaterings } from '@/hooks/useWateringsApi'
import { apiWaterings } from '@/lib/api/wateringsMock'
import { WATER_TYPE_ID } from '@/lib/constants'
import { Watering } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const limitWateringsLength = (arr: Watering[], length: number) => {
  if (arr.length > length) {
    return arr.slice(0, length)
  }
  return arr
}

/** hook to use the waterings from a cached api request */
const useWaterings = () => {
  const selectedWaterType = useMapStore(state => state.selectedWaterType)
  const markersCount = useSettingsStore(state => state.markersCount)
  const { viewportWidth, viewportHeight } = useDetectScreen()
  const { waterTypes } = useWaterTypes()

  // use api call here
  const { current: rawWaterings } = useRef(apiWaterings)

  /** returns waterings by id input */
  const getCatWaterings = useCallback(
    (id: WATER_TYPE_ID) => rawWaterings.filter(watering => watering.watertype === id),
    [rawWaterings],
  )

  /** this mostly internally used memo contains the limiter - remove it in your application on demand */
  const markerData = useMemo(
    () =>
      limitWateringsLength(
        !selectedWaterType ? apiWaterings : getCatWaterings(selectedWaterType.id),
        markersCount,
      ),
    [getCatWaterings, markersCount, selectedWaterType],
  )

  /** get unique waterType ids for all markers */
  const markerWaterTypeIDs = useMemo(
    () => (markerData ? [...new Set(markerData.map(x => x.watertype))] : undefined),
    [markerData],
  )

  /** returns waterType objects for all markers */
  const markerWaterTypes = useMemo(
    () =>
      markerWaterTypeIDs
        ? markerWaterTypeIDs.map((key: WATER_TYPE_ID) => waterTypes[key])
        : undefined,
    [waterTypes, markerWaterTypeIDs],
  )

  /** returns waterings by selected waterType from store */
  const catWaterings = useMemo(
    () => markerData.filter(watering => watering.watertype === selectedWaterType?.id),

    [selectedWaterType, markerData],
  )

  /** record of waterings grouped by waterType ID */
  const wateringsGroupedByWaterType = useMemo(() => {
    // Initialize an empty object to store the grouped waterings
    const group: Record<WATER_TYPE_ID, Watering[]> = {} as Record<WATER_TYPE_ID, Watering[]>

    // Group the waterings by waterType
    markerData.forEach(watering => {
      const { watertype } = watering
      if (!group[watertype]) {
        group[watertype] = []
      }
      group[watertype].push(watering)
    })

    return group
  }, [markerData])

  /** get watering object by id input */
  const getWateringById = useCallback(
    (id: Watering['id']) => rawWaterings.find(watering => watering.id === id),
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

  // calc bounds of all input markers
  const catWateringsBounds = useMemo(() => {
    if (!viewportWidth || !viewportHeight || !selectedWaterType) return undefined

    return getWateringsBounds(catWaterings)
  }, [catWaterings, getWateringsBounds, selectedWaterType, viewportHeight, viewportWidth])

  // calc bounds of all selected waterType markers
  const allWateringsBounds = useMemo(() => {
    if (!markerData) return undefined

    return getWateringsBounds(markerData)
  }, [markerData, getWateringsBounds])

  const currentBounds = useMemo(
    () => (selectedWaterType ? catWateringsBounds : allWateringsBounds),

    [selectedWaterType, catWateringsBounds, allWateringsBounds],
  )

  return {
    rawWaterings,
    markerData,
    catWaterings,
    markerWaterTypeIDs,
    markerWaterTypes,
    allWateringsBounds,
    currentBounds,
    wateringsGroupedByWaterType,
    getCatWaterings,
    getWateringById,
  } as const
}

export default useWaterings
