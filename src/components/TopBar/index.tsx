import CategoryColorBg from '@/components/CategoryColorBg'
import { AppConfig } from '@/lib/AppConfig'
import useMapStore from '@/zustand/useMapStore'

import { LocationSearch } from '../LocationSearch'

const TopBar = () => {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)

  return isMapGlLoaded ? (
    <div
      className="absolute left-0 top-0 w-full shadow-md"
      style={{ height: AppConfig.ui.barHeight }}
    >
      <CategoryColorBg className="absolute inset-0" />
      <div className="px-4 relative flex items-center justify-between h-full text-xl">
        Deutschland giesst am 4. Juli 2025, dem Tag der Gießkanne!
        <LocationSearch />
      </div>
    </div>
  ) : null
}

export default TopBar
