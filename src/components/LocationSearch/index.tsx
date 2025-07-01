import { SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { GeocodingResult, useGeocoding } from '@/hooks/useGeocoding'
import { useSearchStore } from '@/hooks/useSearchStore'
import useMapContext from '@/src/map/useMapContext'

import { ClearIcon } from '../Icons/ClearIcon'

export const LocationSearch: React.FC = () => {
  const {
    setIsCurrentSearch,
    isPickedGeoSearchResult,
    setisPickedGeoSearchResult,
    isTextInSearchbar,
    setIsTextInSearchbar,
    clearSearch,
  } = useSearchStore()
  const [selectedGeocodingResultIndex, setSelectedGeocodingResultIndex] = useState(0)
  const [selectedGeocodingResult, setSelectedGeocodingResult] = useState<GeocodingResult>()

  const { map } = useMapContext()
  const { geocodingResults, clearGeocodingResults, fetchGeocodingResults } = useGeocoding()

  const clearSearchAndGeocodingResults = () => {
    clearSearch()
    setSelectedGeocodingResult(undefined)
    clearGeocodingResults()
  }

  map?.on('dragstart', () => {
    clearSearchAndGeocodingResults()
  })

  map?.on('click', () => {
    clearSearchAndGeocodingResults()
  })

  const onGeocodingResultClick = (geocodingResult: GeocodingResult) => {
    map?.easeTo({
      center: [geocodingResult.geometry.coordinates[0], geocodingResult.geometry.coordinates[1]],
      essential: true,
      duration: 1500,
      zoom: 13,
    })
    setSelectedGeocodingResult(geocodingResult)
    setisPickedGeoSearchResult(geocodingResult.place_name_de)
    setSelectedGeocodingResultIndex(0)
    clearGeocodingResults()
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setSelectedGeocodingResultIndex(
          Math.min(Math.max(0, geocodingResults.length - 1), selectedGeocodingResultIndex + 1),
        )
      } else if (event.key === 'ArrowUp') {
        setSelectedGeocodingResultIndex(Math.max(0, selectedGeocodingResultIndex - 1))
      } else if (event.key === 'Enter') {
        onGeocodingResultClick(geocodingResults[selectedGeocodingResultIndex])
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [geocodingResults, selectedGeocodingResultIndex])

  return (
    <div className="flex flex-row w-full justify-center sm:justify-between pointer-events-auto gap-2 ">
      <div className="flex flex-grow max-w-[80%] sm:max-w-[87%] h-fit flex-col pl-2 drop-shadow-md sm:pl-0">
        <form
          onSubmit={e => {
            e.preventDefault()
          }}
          className="flex flex-row items-center justify-center rounded-full bg-white"
        >
          <button type="button" className="pl-4 hover:text-gdk-light-gray">
            <SearchIcon />
          </button>
          <input
            className="w-full py-4 pl-2 focus:outline-none"
            type="text"
            value={selectedGeocodingResult?.place_name_de || isPickedGeoSearchResult}
            onKeyDown={e => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
              }
            }}
            onChange={e => {
              setIsCurrentSearch(e.target.value)
              setisPickedGeoSearchResult(e.target.value)
              setSelectedGeocodingResult(undefined)
              fetchGeocodingResults(e.target.value)
              setIsTextInSearchbar(true)
            }}
            placeholder="Suche nach deinem Ort..."
          />
          <button
            type="button"
            className={`${
              isTextInSearchbar ? 'opacity-100' : 'opacity-0'
            } px-4 hover:text-gdk-light-gray`}
            onClick={() => {
              clearSearchAndGeocodingResults()
            }}
          >
            <ClearIcon />
          </button>
        </form>

        {geocodingResults.length > 0 && (
          <div className="z-[1] absolute top-2/3 flex flex-col rounded-b-3xl bg-white pt-8">
            {geocodingResults.map((geocodingResult, idx) => (
              <button
                type="button"
                key={`geocoding-result-${geocodingResult.place_name_de}`}
                className={`truncate px-4 py-4 text-left hover:cursor-pointer hover:bg-gdk-lighter-blue ${
                  selectedGeocodingResultIndex === idx && 'bg-gdk-lighter-blue'
                }`}
                onClick={() => onGeocodingResultClick(geocodingResult)}
              >
                {geocodingResult.place_name_de}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
