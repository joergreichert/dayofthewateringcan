import { useCallback } from 'react'

import SidebarMenuItem from '@/components/Sidebar/SidebarMenuItem'
import WaterTypeColorBg from '@/components/WaterTypeColorBg'
import useWaterTypes from '@/hooks/useWaterTypes'
import { WATER_TYPE_ID } from '@/lib/constants'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'

const styledSidebarClassNames = `
  absolute
  left-5
  bottom-5
  md:w-56
  z-30
`

const Sidebar = () => {
  const { map } = useMapContext()
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const isAnimating = useMapStore(state => state.isAnimating)
  const selectedWaterType = useMapStore(state => state.selectedWaterType)
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const setSelectedWaterType = useMapStore(state => state.setSelectedWaterType)
  const { waterTypes, getWaterTypeById } = useWaterTypes()

  // todo: split into smaller event handlers
  const handleClick = useCallback(
    (categoryId?: WATER_TYPE_ID) => {
      if (!map || isAnimating) return

      // reset popups
      setMarkerPopup(undefined)

      // set category
      if (categoryId && selectedWaterType?.id !== categoryId) {
        setSelectedWaterType(getWaterTypeById(categoryId))
      } else {
        setSelectedWaterType(undefined)
      }
    },
    [getWaterTypeById, isAnimating, map, selectedWaterType, setMarkerPopup, setSelectedWaterType],
  )

  return isMapGlLoaded ? (
    <div className={styledSidebarClassNames}>
      <WaterTypeColorBg outerClassName="p-2">
        <div className="w-full z-10 relative">
          {Object.values(waterTypes).map(category => (
            <SidebarMenuItem
              key={category.id}
              category={category}
              handleClick={handleClick}
              selected={category.id === selectedWaterType?.id}
            />
          ))}
        </div>
      </WaterTypeColorBg>
    </div>
  ) : null
}

export default Sidebar
