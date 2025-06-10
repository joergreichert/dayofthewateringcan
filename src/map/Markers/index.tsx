import { useCallback, useMemo } from 'react'

import useWaterTypes from '@/hooks/useWaterTypes'
import useWaterings from '@/hooks/useWaterings'
import { Watering } from '@/lib/types/entityTypes'
import useMapActions from '@/map/useMapActions'
import useMapContext from '@/map/useMapContext'
import WaterTypeMarkerCluster from '@/src/map/Markers/WaterTypeMarkerCluster'
import useMapStore from '@/zustand/useMapStore'

const MarkersContainer = () => {
  const { wateringsGroupedByWaterType } = useWaterings()
  const { map } = useMapContext()
  const markerPopup = useMapStore(state => state.markerPopup)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const clusterRadius = useMapStore(state => state.clusterRadius)

  const { getWateringById } = useWaterings()
  const { handleMapMove } = useMapActions()
  const { getWaterTypeById } = useWaterTypes()

  const mapBounds = useMemo(() => (map ? map.getMap().getBounds().toArray().flat() : []), [map])

  const handleMarkerClick = useCallback(
    (id: Watering['id']) => {
      const place = getWateringById(id)
      if (!place || !map || id === markerPopup) return

      setMarkerPopup(id)

      handleMapMove({
        latitude: place.latitude,
        longitude: place.longitude,
        zoom: map.getZoom(),
        offset: [0, -30],
        mouseUpOnceCallback: () => {
          setMarkerPopup(undefined)
        },
      })
    },
    [getWateringById, handleMapMove, map, markerPopup, setMarkerPopup],
  )

  return (
    wateringsGroupedByWaterType &&
    Object.entries(wateringsGroupedByWaterType).map(waterTypeGroup => {
      const [waterType, waterings] = waterTypeGroup

      return (
        <WaterTypeMarkerCluster
          handleMapMove={handleMapMove}
          handleMarkerClick={handleMarkerClick}
          key={waterType}
          mapBounds={mapBounds}
          map={map}
          waterings={waterings}
          clusterRadius={clusterRadius}
          waterType={getWaterTypeById(parseFloat(waterType))}
        />
      )
    })
  )
}

export default MarkersContainer
