import { useCallback, useMemo } from 'react'

import useWaterings from '@/hooks/useWaterings'
import { Watering } from '@/lib/types/entityTypes'
import useMapActions from '@/map/useMapActions'
import useMapContext from '@/map/useMapContext'
import WateringMarkerCluster from '@/src/map/Markers/WateringMarkerCluster'
import useMapStore from '@/zustand/useMapStore'

const MarkersContainer = async () => {
  const { rawWaterings, getWateringById } = await useWaterings()
  const { map } = useMapContext()
  const markerPopup = useMapStore(state => state.markerPopup)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const clusterRadius = useMapStore(state => state.clusterRadius)

  const { handleMapMove } = useMapActions()

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
    <WateringMarkerCluster
      handleMapMove={handleMapMove}
      handleMarkerClick={handleMarkerClick}
      key="watering"
      mapBounds={mapBounds}
      map={map}
      waterings={rawWaterings || []}
      clusterRadius={clusterRadius}
    />
  )
}

export default MarkersContainer
