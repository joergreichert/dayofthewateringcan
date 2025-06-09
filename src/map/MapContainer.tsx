import { throttle } from 'lodash'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ErrorEvent, MapLayerMouseEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl'
import Map from 'react-map-gl'

import { WateringModal } from '@/components/CreateDialog'
import useDetectScreen from '@/hooks/useDetectScreen'
import usePlaces from '@/hooks/usePlaces'
import { AppConfig } from '@/lib/AppConfig'
import MapContextProvider from '@/src/map/MapContextProvider'
import MapControls from '@/src/map/MapControls'
import useMapActions from '@/src/map/useMapActions'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

/** error handle */
const onMapError = (evt: ErrorEvent) => {
  const { error } = evt
  throw new Error(`Map error: ${error.message}`)
}

// bundle splitting
const Popups = dynamic(() => import('@/src/map/Popups'))
const Markers = dynamic(() => import('@/src/map/Markers'))
const Layers = dynamic(() => import('@/src/map/Layers'))
const Sidebar = dynamic(() => import('@/components/Sidebar'))
const SettingsBox = dynamic(() => import('@/components/SettingsBox'))
const TopBar = dynamic(() => import('@/components/TopBar'))

const MapInner = () => {
  const setViewState = useMapStore(state => state.setViewState)
  const setThrottledViewState = useMapStore(state => state.setThrottledViewState)
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const markerJSXRendering = useSettingsStore(state => state.markerJSXRendering)
  const setIsMapGlLoaded = useMapStore(state => state.setIsMapGlLoaded)
  const { setMap, map } = useMapContext()
  const { viewportWidth, viewportHeight, viewportRef } = useDetectScreen()
  const { allPlacesBounds } = usePlaces()

  const { handleMapMove, handleMapClick } = useMapActions()

  const [showModal, setShowModal] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()

  const throttledSetViewState = useMemo(
    () => throttle((state: ViewState) => setThrottledViewState(state), 50),
    [setThrottledViewState],
  )

  const onLoad = useCallback(() => {
    if (!allPlacesBounds || isMapGlLoaded) return
    setIsMapGlLoaded(true)
  }, [allPlacesBounds, isMapGlLoaded, setIsMapGlLoaded])

  const onMapMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      throttledSetViewState(evt.viewState)
      setViewState(evt.viewState)
    },
    [setViewState, throttledSetViewState],
  )

  const onClick = useCallback((evt: MapLayerMouseEvent) => {
    setLatitude(evt.lngLat.lat)
    setLongitude(evt.lngLat.lng)
    setShowModal(true)
  }, [])

  useEffect(() => {
    if (submit && latitude && longitude) {
      handleMapClick({ latitude, longitude })
      setSubmit(false)
    }
  }, [submit])

  // react on change of marker bounding -> usually when viewport changes
  // todo: find out why we need the timeout here
  useEffect(() => {
    if (!allPlacesBounds || !map) return undefined

    /**
     * Timeout ID returned by setTimeout function.
     */
    const timeout = setTimeout(() => {
      handleMapMove({
        latitude: allPlacesBounds.latitude,
        longitude: allPlacesBounds.longitude,
        zoom: allPlacesBounds.zoom,
      })
    }, 30)

    return () => clearTimeout(timeout)
  }, [allPlacesBounds, handleMapMove, map])

  return (
    <div className="absolute overflow-hidden inset-0 bg-mapBg" ref={viewportRef}>
      {allPlacesBounds && (
        <Map
          // {...throttledSetViewState}
          initialViewState={allPlacesBounds}
          ref={e => setMap && setMap(e || undefined)}
          onError={e => onMapError(e)}
          onClick={onClick}
          onLoad={onLoad}
          onMove={onMapMove}
          style={{ width: viewportWidth, height: viewportHeight }}
          mapStyle={`https://api.maptiler.com/maps/0197559a-e36a-7e42-aca7-9e63480bad16/style.json?key=${AppConfig.map.tileKey}`}
          reuseMaps
          // disable map rotation since it's not correctly calculated into the bounds atm :')
          dragRotate={false}
        >
          <Popups />
          {markerJSXRendering ? <Markers /> : <Layers />}
          <MapControls />
          <SettingsBox />
          <Sidebar />
          <TopBar />
          {showModal && (
            <WateringModal
              setShowModal={setShowModal}
              latitude={latitude}
              longitude={longitude}
              setSubmit={setSubmit}
            />
          )}
        </Map>
      )}
      {!isMapGlLoaded && (
        <div className="absolute inset-0 bg-mapBg flex justify-center items-center">
          Loading Map...
        </div>
      )}
    </div>
  )
}

// context pass through
const MapContainer = () => (
  <MapContextProvider>
    <MapInner />
  </MapContextProvider>
)

export default MapContainer
