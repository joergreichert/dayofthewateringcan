import { useMemo, useState } from 'react'

import { AppConfig } from '../AppConfig'

export interface GeocodingResult {
  id: string
  place_name_de: string
  geometry: {
    coordinates: [number, number]
  }
}

export interface GeocodingResultState {
  geocodingResults: GeocodingResult[]
  clearGeocodingResults: () => void
  fetchGeocodingResults: (search: string) => void
}

export interface ReverseGeocodingResult {
  place_name_de: string
}

export interface ReverseGeocodingResultState {
  reverseGeocodingResults: ReverseGeocodingResult[]
  clearReverseGeocodingResults: () => void
  fetchReverseGeocodingResults: (latitude: number, longutude: number) => void
}

export function useGeocoding(): GeocodingResultState {
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>([])

  const clearGeocodingResults = () => {
    setGeocodingResults([])
  }

  const fetchGeocodingResults = async (search: string) => {
    if (search.trim().length < 2) {
      setGeocodingResults([])
      return
    }

    const features = async () => {
      try {
        const geocodingUrl = `${AppConfig.map.apiEndpoint}/geocoding/v5/mapbox.places/${search}.json?autocomplete=true&language=de&country=de&bbox=${AppConfig.map.boundingBox}&access_token=${AppConfig.map.apiKey}`
        const res = await fetch(geocodingUrl)
        if (!res.ok) {
          return []
        }
        const json = (await res.json()) as { features: GeocodingResult[] }
        return json.features
      } catch (_) {
        return []
      }
    }
    setGeocodingResults(await features())
  }

  return { geocodingResults, clearGeocodingResults, fetchGeocodingResults }
}

export function useReverseGeocoding(): ReverseGeocodingResultState {
  const [reverseGeocodingResults, setReverseGeocodingResults] = useState<ReverseGeocodingResult[]>(
    [],
  )

  const clearReverseGeocodingResults = () => {
    setReverseGeocodingResults([])
  }

  const fetchReverseGeocodingResults = async (latitude: number, longitude: number) => {
    const features = async () => {
      try {
        const reverseGeocodingUrl = `${AppConfig.map.apiEndpoint}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?language=de&country=de&access_token=${AppConfig.map.apiKey}`
        const res = await fetch(reverseGeocodingUrl)
        if (!res.ok) {
          return []
        }
        const json = (await res.json()) as { features: ReverseGeocodingResult[] }
        return json.features
      } catch (_) {
        return []
      }
    }
    setReverseGeocodingResults(await features())
  }

  return { reverseGeocodingResults, clearReverseGeocodingResults, fetchReverseGeocodingResults }
}
