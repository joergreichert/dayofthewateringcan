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
  const markerSize = useSettingsStore(state => state.markerSize)
  const clusterRadius = useMapStore(state => state.clusterRadius)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const { map } = useMapContext()
  const { handleMapMove } = useMapActions()
  const { waterings, getWateringById } = useWaterings()

  const wateringCluster = useMemo(() => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = !waterings
      ? []
      : waterings.map(watering => ({
          type: 'Feature',
          properties: {
            id: watering.id,
          },
          geometry: {
            type: 'Point',
            coordinates: [watering.longitude, watering.latitude],
          },
        }))

    const collection: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: 'FeatureCollection',
      features,
    }

    const catColor = '#e2dc41'

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
  }, [clusterRadius, markerSize, waterings])

  const onClick = useCallback(
    (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      if (!map || !waterings) return
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
        } else {
          const markers = map.queryRenderedFeatures(event.point, { layers: ['marker-watering'] })
          const marker = markers[0]
          const markerId = marker?.properties?.id
          if (!markerId) return
          const watering = getWateringById(markerId)
          if (!watering) return

          setMarkerPopup(watering.id)

          handleMapMove({
            latitude: watering.latitude,
            longitude: watering.longitude,
            fly: false,
            zoom: map.getZoom(),
            offset: [0, -30],
            mouseUpOnceCallback: () => {
              setMarkerPopup(undefined)
            },
          })
        }
      })
    },
    [getWateringById, handleMapMove, map, setMarkerPopup, waterings],
  )

  useEffect(() => {
    if (map) {
      map.on('click', 'cluster-watering', e => onClick(e))
      map.on('click', 'marker-watering', e => onClick(e))
      map.on('mousemove', 'cluster-watering', _ => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'cluster-watering', _ => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mousemove', 'marker-watering', _ => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'marker-watering', _ => {
        map.getCanvas().style.cursor = ''
      })
      const catImage = '/icons/250701_icon-giesskanne.png'

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
  }, [map, waterings, onClick])

  return wateringCluster
}

export default Layers
