import { useCallback, useEffect, useMemo } from 'react'
import { GeoJSONSource, Layer, Source } from 'react-map-gl'

import useWaterTypes from '@/hooks/useWaterTypes'
import useWaterings from '@/hooks/useWaterings'
import { WATER_TYPE_ID } from '@/lib/constants'
import {
  clusterBelowLayer,
  clusterCountBadgeLayer,
  clusterCountLayer,
  clusterLayer,
  iconLayer,
  markerLayer,
} from '@/map/Layers/layers'
import useMapActions from '@/map/useMapActions'
import useMapContext from '@/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const Layers = () => {
  const { wateringsGroupedByWaterType, markerWaterTypeIDs, getWateringById } = useWaterings()
  const { getWaterTypeById } = useWaterTypes()
  const markerSize = useSettingsStore(state => state.markerSize)
  const clusterRadius = useMapStore(state => state.clusterRadius)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const { map } = useMapContext()
  const { handleMapMove } = useMapActions()

  const waterTypeCluster = useMemo(
    () =>
      Object.entries(wateringsGroupedByWaterType).map(catGroup => {
        const [waterType, waterings] = catGroup

        const features: GeoJSON.Feature<GeoJSON.Point>[] = waterings.map(place => ({
          type: 'Feature',
          properties: {
            id: place.id,
            waterType,
          },
          geometry: {
            type: 'Point',
            coordinates: [place.longitude, place.latitude],
          },
        }))

        const collection: GeoJSON.FeatureCollection<GeoJSON.Point> = {
          type: 'FeatureCollection',
          features,
        }

        const catColor = getWaterTypeById(parseFloat(waterType))?.color || 'red'

        return (
          <Source
            key={`${waterType}${clusterRadius}`}
            id={`source-${waterType}`}
            type="geojson"
            data={collection}
            clusterMaxZoom={17}
            clusterRadius={clusterRadius}
            cluster
          >
            <Layer {...markerLayer(waterType, markerSize, catColor)} />
            <Layer {...clusterBelowLayer(waterType, markerSize, catColor)} />
            <Layer {...clusterLayer(waterType, markerSize, catColor)} />
            <Layer {...iconLayer(waterType, markerSize)} />
            <Layer {...clusterCountBadgeLayer(waterType, markerSize)} />
            <Layer {...clusterCountLayer(waterType)} />
          </Source>
        )
      }),
    [clusterRadius, getWaterTypeById, markerSize, wateringsGroupedByWaterType],
  )

  const onClick = useCallback(
    (event: mapboxgl.MapMouseEvent & mapboxgl.EventData, waterType: WATER_TYPE_ID) => {
      if (!map || !wateringsGroupedByWaterType) return
      event.preventDefault()

      const clusters = map.queryRenderedFeatures(event.point, {
        layers: [`cluster-${waterType}`],
      })
      const markers = map.queryRenderedFeatures(event.point, {
        layers: [`marker-${waterType}`],
      })

      const mapboxSource = map.getSource(`source-${waterType}`) as GeoJSONSource

      if (clusters.length) {
        const clusterId = clusters[0]?.properties?.cluster_id
        mapboxSource.getClusterExpansionZoom(clusterId, (_err, zoom) => {
          // be save & return if zoom is undefined
          if (!zoom) return

          handleMapMove({
            latitude: event.lngLat.lat,
            longitude: event.lngLat.lng,
            zoom: zoom + 0.5,
          })
        })
        return
      }

      const markerId = markers[0]?.properties?.id
      const place = getWateringById(markerId)
      if (!place) return

      setMarkerPopup(place.id)

      handleMapMove({
        latitude: place.latitude,
        longitude: place.longitude,
        fly: false,
        zoom: map.getZoom(),
        offset: [0, -30],
        mouseUpOnceCallback: () => {
          setMarkerPopup(undefined)
        },
      })
    },
    [getWateringById, handleMapMove, map, setMarkerPopup, wateringsGroupedByWaterType],
  )

  useEffect(() => {
    map &&
      markerWaterTypeIDs?.forEach(waterType => {
        map.on('click', `cluster-${waterType}`, e => onClick(e, waterType))
        map.on('click', `marker-${waterType}`, e => onClick(e, waterType))

        const catImage = getWaterTypeById(waterType)?.iconPath || ''

        map?.loadImage(`${catImage}`, (error, image) => {
          if (!map.hasImage(`waterType-thumb-${waterType}`)) {
            if (!image || error) return
            map.addImage(`waterType-thumb-${waterType}`, image)
          }
        })
      })

    return () => {
      map &&
        markerWaterTypeIDs?.forEach(waterType => {
          map.off('click', `cluster-${waterType}`, e => onClick(e, waterType))
          map.off('click', `marker-${waterType}`, e => onClick(e, waterType))
          if (map.hasImage(`waterType-thumb-${waterType}`)) {
            map.removeImage(`waterType-thumb-${waterType}`)
          }
        })
    }
  }, [getWaterTypeById, map, markerWaterTypeIDs, onClick])

  return waterTypeCluster
}

export default Layers
