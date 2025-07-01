import WaterTypeColorBg from '@/components/WaterTypeColorBg'
import { AppConfig } from '@/lib/AppConfig'
import useMapStore from '@/zustand/useMapStore'

import { LocationSearch } from '../LocationSearch'

const TopBar = () => {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)

  return isMapGlLoaded ? (
    <div className="h-35 xl:h-20 absolute left-0 top-0 w-full shadow-md">
      <WaterTypeColorBg className="absolute inset-0" />
      <div className="px-4 relative flex flex-col xl:flex-row items-center gap-2 justify-between h-full text-xl mb-3 xl:mb0">
        <span className="mt-3 xl:mt-0 xl:w-2/3">
          <div className="flex flex-col">
            <div className="text-2xl font-bold">
              Gieß mit am 4. Juli 2025, dem{' '}
              <a
                className="underline"
                target="_blank"
                href="https://stiftung-ecken-wecken.de/projekte/leipzig-giesst/tag-der-giesskanne"
                rel="noreferrer"
              >
                Tag der Gießkanne
              </a>
              !
            </div>
            <div>
              Ein Projekt des Netzwerks{' '}
              <a
                className="underline"
                target="_blank"
                href="https://stiftung-ecken-wecken.de/projekte/leipzig-giesst/deutschland-giesst"
                rel="noreferrer"
              >
                DEUTSCHLAND GIESST
              </a>
            </div>
          </div>
        </span>
        <LocationSearch />
      </div>
    </div>
  ) : null
}

export default TopBar
