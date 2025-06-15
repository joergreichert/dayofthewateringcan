import WaterTypeColorBg from '@/components/WaterTypeColorBg'
import { AppConfig } from '@/lib/AppConfig'
import useMapStore from '@/zustand/useMapStore'

import { LocationSearch } from '../LocationSearch'

const TopBar = () => {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)

  return isMapGlLoaded ? (
    <div className="h-35 lg:h-20 absolute left-0 top-0 w-full shadow-md">
      <WaterTypeColorBg className="absolute inset-0" />
      <div className="px-4 relative flex flex-col lg:flex-row items-center gap-2 justify-between h-full text-xl mb-3 lg:mb0">
        <span className="mt-3 lg:mt-0 lg:w-2/3">
          Deutschland gießt am 4. Juli 2025, dem Tag der Gießkanne!
        </span>
        <LocationSearch />
      </div>
    </div>
  ) : null
}

export default TopBar
