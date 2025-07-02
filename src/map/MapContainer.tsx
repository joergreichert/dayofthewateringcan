import { throttle } from 'lodash'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ErrorEvent, MapLayerMouseEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl'
import Map from 'react-map-gl'

import { WateringModal } from '@/components/CreateDialog'
import useDetectScreen from '@/hooks/useDetectScreen'
import useEditableContext from '@/hooks/useEditableContext'
import { useReverseGeocoding } from '@/hooks/useGeocoding'
import useWaterings, { ViewportProps } from '@/hooks/useWaterings'
import { useFetchWaterings } from '@/hooks/useWateringsApi'
import { AppConfig } from '@/lib/AppConfig'
import { Watering } from '@/lib/types/entityTypes'
import MapContextProvider from '@/src/map/MapContextProvider'
import MapControls from '@/src/map/MapControls'
import useMapActions from '@/src/map/useMapActions'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const onMapError = (evt: ErrorEvent) => {
  const { error } = evt
  throw new Error(`Map error: ${error.message}`)
}

const Popups = dynamic(() => import('@/src/map/Popups'))
const Markers = dynamic(() => import('@/src/map/Markers'))
const Layers = dynamic(() => import('@/src/map/Layers'))
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
  const { data: wateringResult, error, isLoading, refetch } = useFetchWaterings()
  const setWaterings = useMapStore(state => state.setWaterings)
  const { allWateringsBounds } = useWaterings()

  const { handleMapMove } = useMapActions()
  const [submit, setSubmit] = useState<Watering | undefined>(undefined)
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [created, setCreated] = useState<ViewportProps | undefined>()

  const { editable, showModal, setShowModal } = useEditableContext()

  const throttledSetViewState = useMemo(
    () => throttle((state: ViewState) => setThrottledViewState(state), 50),
    [setThrottledViewState],
  )

  const onLoad = useCallback(() => {
    if (!wateringResult || isMapGlLoaded) return
    setWaterings(wateringResult)
    setIsMapGlLoaded(true)
  }, [isLoading, wateringResult, allWateringsBounds, isMapGlLoaded, setIsMapGlLoaded])

  const onMapMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      throttledSetViewState(evt.viewState)
      setViewState(evt.viewState)
    },
    [setViewState, throttledSetViewState],
  )

  const onClick = useCallback(
    (evt: MapLayerMouseEvent) => {
      if (editable) {
        setLatitude(evt.lngLat.lat)
        setLongitude(evt.lngLat.lng)
        setShowModal && setShowModal(true)
      }
    },
    [editable],
  )

  const [resolvedLocation, setResolvedLocation] = useState<string>()
  const { fetchReverseGeocodingResults, reverseGeocodingResults } = useReverseGeocoding()

  useEffect(() => {
    if (latitude && longitude) {
      fetchReverseGeocodingResults(latitude, longitude)
    }
  }, [latitude, longitude])

  useEffect(() => {
    if (reverseGeocodingResults.length > 0) {
      setResolvedLocation(reverseGeocodingResults[0].place_name_de)
    }
  }, [reverseGeocodingResults])

  useEffect(() => {
    if (!allWateringsBounds || !map) return undefined

    const timeout = setTimeout(() => {
      let boundsToUse: ViewportProps
      if (created) {
        boundsToUse = created
        setCreated(undefined)
      } else {
        boundsToUse = allWateringsBounds
      }
      handleMapMove({
        latitude: boundsToUse.latitude,
        longitude: boundsToUse.longitude,
        zoom: boundsToUse.zoom,
      })
    }, 30)

    return () => clearTimeout(timeout)
  }, [allWateringsBounds, handleMapMove, map])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (submit) {
        if (map) {
          setCreated({
            latitude: submit.latitude,
            longitude: submit.longitude,
            zoom: map.getZoom(),
          })
        }
        refetch().then(result => result.data && setWaterings(result.data))
        setSubmit(undefined)
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [submit])

  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [cursorStyle, setCursorStyle] = useState('hand')
  const [deviceType, setDeviceType] = useState('')

  const isTouchDevice = () => {
    try {
      document.createEvent('TouchEvent')
      setDeviceType('touch')
      return true
    } catch (e) {
      setDeviceType('mouse')
      return false
    }
  }

  const move = (e: any) => {
    const touchEvent = e.touches ? e.touches[0] : null
    const x = !isTouchDevice() ? e.clientX : touchEvent?.clientX || 0
    const y = !isTouchDevice() ? e.clientY : touchEvent?.clientY || 0

    setCursorX(x)
    setCursorY(y)

    const cursorBorder = document.getElementById('cursor-border')
    if (cursorBorder) {
      cursorBorder.style.left = `${x}px`
      cursorBorder.style.top = `${y}px`
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', move)
    document.addEventListener('touchmove', move)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('touchmove', move)
    }
  }, [])

  useEffect(() => {
    if (editable && !showModal) {
      setCursorStyle('crosshair')
    } else {
      setCursorStyle('hand')
    }
  }, [editable, showModal])

  return (
    <div className="absolute overflow-hidden inset-0 bg-mapBg" ref={viewportRef}>
      {!isLoading && wateringResult && (
        <Map
          {...throttledSetViewState}
          initialViewState={allWateringsBounds}
          ref={e => setMap && setMap(e || undefined)}
          onError={e => onMapError(e)}
          onClick={onClick}
          onLoad={onLoad}
          onMove={onMapMove}
          style={{ width: viewportWidth, height: viewportHeight }}
          mapStyle={`https://api.maptiler.com/maps/0197c666-6349-73cf-8f22-7d120f2e0d13/style.json?key=${AppConfig.map.tileKey}`}
          reuseMaps
          // disable map rotation since it's not correctly calculated into the bounds atm :')
          dragRotate={false}
        >
          <style>
            {`

              * {
                cursor: ${cursorStyle};
              }

              #cursor-border {
                  position: absolute;
                  width: 50px;
                  height: 50px;
                  background-color: transparent;
                  border: 3px solid #e2dc41;
                  border-radius: 50%;
                  transform: translate(-50%, -50%);
                  pointer-events: none;
                  transition: all 0.2s ease-out;
              }
          `}
          </style>
          <div id="cursor" style={{ left: `${cursorX}px`, top: `${cursorY}px` }} />
          {cursorStyle === 'crosshair' && <div id="cursor-border" />}
          <Popups />
          {markerJSXRendering ? <Markers /> : <Layers />}
          <MapControls />
          <SettingsBox />
          <TopBar />
          {showModal && (
            <WateringModal
              latitude={latitude}
              longitude={longitude}
              resolvedLocation={resolvedLocation}
              setSubmit={setSubmit}
            />
          )}
        </Map>
      )}
      {!isMapGlLoaded && (
        <div className="absolute inset-0 bg-mapBg flex justify-center items-center">
          Anwendung wird geladen...
        </div>
      )}
      {!!error && <div>{JSON.stringify(error, null, 2)}</div>}
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
