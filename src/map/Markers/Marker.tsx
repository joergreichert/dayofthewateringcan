import { memo, useCallback } from 'react'
import { Marker as ReactMapGLMarker } from 'react-map-gl'

import IconCircle from '@/components/IconCircle'
import { WaterType, Watering } from '@/lib/types/entityTypes'

const styledBadgeClassNames = `
  flex
  z-20
  flex-col
  absolute
  -top-2
  -right-2
  border-2
  border-white
  bg-error
  text-white
  rounded-full
  h-6
  w-6
  text-xs
  items-center
  pt-0.5
`

interface handleClusterClickProps {
  clusterId: number
  latitude: number
  longitude: number
}

interface MarkerProps {
  latitude: number
  longitude: number
  clusterId: number
  markerId?: Watering['id']
  markerSize: number
  handleClusterClick?: ({ clusterId, latitude, longitude }: handleClusterClickProps) => void
  handleMarkerClick?: (id: Watering['id']) => void
  pointCount?: number
  color?: string
}

const Marker = memo(
  ({
    latitude,
    longitude,
    markerId,
    clusterId,
    markerSize,
    handleClusterClick,
    handleMarkerClick,
    pointCount,
    color,
  }: MarkerProps) => {
    const handleClick = useCallback(() => {
      if (handleMarkerClick && markerId) {
        handleMarkerClick(markerId)
      }
      if (handleClusterClick) {
        handleClusterClick({ clusterId, latitude, longitude })
      }
    }, [clusterId, handleClusterClick, handleMarkerClick, latitude, longitude, markerId])

    return (
      <ReactMapGLMarker latitude={latitude} longitude={longitude} onClick={handleClick}>
        <div className="origin-bottom">
          {pointCount && (
            <span
              style={{ backgroundColor: 'blue' }}
              className="absolute -inset-2 bg-mapBg rounded-full opacity-40"
            />
          )}
          <div className="relative z-20">
            <IconCircle
              size={markerSize}
              path="/icons/watering-can.svg"
              color={color}
              bgColor="#708090"
            />
          </div>
          {pointCount && <span className={styledBadgeClassNames}>{pointCount}</span>}
        </div>
      </ReactMapGLMarker>
    )
  },
)

export default Marker
