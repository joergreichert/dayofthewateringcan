import { useCallback, useEffect, useMemo } from 'react'
import { GeoJSONSource, Layer, Source } from 'react-map-gl'

import useWaterings from '@/hooks/useWaterings'
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
  const { rawWaterings, getWateringById } = useWaterings()
  const markerSize = useSettingsStore(state => state.markerSize)
  const clusterRadius = useMapStore(state => state.clusterRadius)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const { map } = useMapContext()
  const { handleMapMove } = useMapActions()

  const wateringCluster = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = !rawWaterings
      ? []
      : rawWaterings.map(place => ({
          type: 'Feature',
          properties: {
            id: place.id,
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

    const catColor = '#708090'

    return (
      <Source
        key={`watering${clusterRadius}`}
        id="source-watering"
        type="geojson"
        data={collection}
        clusterMaxZoom={17}
        clusterRadius={clusterRadius}
        cluster
      >
        <Layer {...markerLayer(markerSize, catColor)} />
        <Layer {...clusterBelowLayer(markerSize, catColor)} />
        <Layer {...clusterLayer(markerSize, catColor)} />
        <Layer {...iconLayer(markerSize)} />
        <Layer {...clusterCountBadgeLayer(markerSize)} />
        <Layer {...clusterCountLayer()} />
      </Source>
    )
  }, [clusterRadius, markerSize, rawWaterings])

  const onClick = useCallback(
    (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      if (!map || !rawWaterings) return
      if (!map.loaded()) {
        return
      }
      event.preventDefault()

      setTimeout(() => {
        const clusters = map.queryRenderedFeatures(event.point, {
          layers: ['cluster-watering'],
        })
        if (clusters.length) {
          const clusterId = clusters[0]?.properties?.cluster_id
          const mapboxSource = map.getSource('source-watering') as GeoJSONSource
          mapboxSource.getClusterExpansionZoom(clusterId, (_err, zoom) => {
            // be save & return if zoom is undefined
            if (!zoom) return

            handleMapMove({
              latitude: event.lngLat.lat,
              longitude: event.lngLat.lng,
              zoom: zoom + 0.5,
            })
          })
        }
      })

      setTimeout(() => {
        const markers = map.queryRenderedFeatures(event.point, { layers: ['marker-watering'] })

        const markerId = markers[0]?.properties?.id
        if (!markerId) return
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
      }, 500)
    },
    [getWateringById, handleMapMove, map, setMarkerPopup, rawWaterings],
  )

  useEffect(() => {
    if (map) {
      map.on('click', 'cluster-watering', e => onClick(e))
      map.on('click', 'marker-watering', e => onClick(e))

      const catImage = '/icons/river-icon-clipart.png'

      map?.loadImage(`${catImage}`, (error, image) => {
        if (!map.hasImage('thumb-watering')) {
          if (!image || error) return
          map.addImage('thumb-watering', image)
        }
      })
    }

    return () => {
      if (map) {
        map.off('click', 'cluster-watering', e => onClick(e))
        map.off('click', 'marker-watering', e => onClick(e))
        if (map.hasImage('thumb-watering')) {
          map.removeImage('thumb-watering')
        }
      }
    }
  }, [map, rawWaterings, onClick])

  return wateringCluster
}

export default Layers
