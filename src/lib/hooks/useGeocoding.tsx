import { useState } from 'react'

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

    const fetchData = async () => {
      try {
        const geocodingUrl = `${AppConfig.map.apiEndpoint}/geocoding/v5/mapbox.waterings/${search}.json?autocomplete=true&language=de&country=de&bbox=${AppConfig.map.boundingBox}&access_token=${AppConfig.map.apiKey}`
        const res = await fetch(geocodingUrl)
        if (!res.ok) {
          return
        }
        const json = (await res.json()) as { features: GeocodingResult[] }
        setGeocodingResults(json.features)
      } catch (_) {
        setGeocodingResults([])
      }
    }

    fetchData().catch(error => alert(error))
  }

  return { geocodingResults, clearGeocodingResults, fetchGeocodingResults }
}
