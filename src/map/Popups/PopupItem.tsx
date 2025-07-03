import { Minimize2, X } from 'lucide-react'
import { Popup } from 'react-map-gl'

import Button from '@/components/Button/index'
import IconCircle from '@/components/IconCircle'
import useWaterTypes from '@/hooks/useWaterTypes'
import { AppConfig } from '@/lib/AppConfig'
import { Watering } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

interface PopupItemProps {
  watering: Watering
  handleBackToCluster: () => void
}

const PopupItem = ({ watering, handleBackToCluster }: PopupItemProps) => {
  const { getWaterTypeById } = useWaterTypes()
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const markerSize = useSettingsStore(state => state.markerSize)
  const currentCat = getWaterTypeById(watering.watertype)

  if (!currentCat) return null

  return (
    <Popup
      className="w-10/12"
      closeOnClick={false}
      closeButton={false}
      longitude={watering.longitude}
      latitude={watering.latitude}
      maxWidth="320px"
      anchor="top"
      offset={[0, -AppConfig.ui.markerIconSize] as never}
    >
      <div className="bg-mapBg text-dark shadow-md rounded-md p-2 -mt-3 relative">
        <div className="flex justify-center absolute w-full left-0 top-0 mt-4">
          <IconCircle path="/icons/watering-can.svg" size={markerSize} invert />
        </div>
        <Button
          className="absolute right-5 top-2 text-dark inline-block"
          onClick={() => setMarkerPopup(undefined)}
        >
          <X size={AppConfig.ui.mapIconSizeVerySmall} />
        </Button>
        <div className="flex flex-row justify-center pt-3">
          <div
            className="flex flex-col justify-center p-3 text-center w-full"
            style={{ marginTop: markerSize }}
          >
            <h3 className="text-lg font-bold leading-none m-0">{watering.name}</h3>
            {watering.date && (
              <p className="text-darkLight m-0  mt-2">
                {new Date(watering.date).toLocaleString('de-DE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
            <p className="text-darkLight m-0  mt-2">Gegossen: {watering.liter} Liter</p>
            {watering.watertype && watering.watertype !== 6 && (
              <p className="text-darkLight m-0  mt-2">
                verwendetes Wasser: {getWaterTypeById(watering.watertype)?.name}
              </p>
            )}
            <div className="min-w-full flex flex-col items-center">
              <Button className="gap-2" onClick={() => handleBackToCluster()}>
                <div className="flex flex-row mt-1 gap-3 rounded">
                  <Minimize2 size={AppConfig.ui.mapIconSizeSmall} />
                  <div className="mt-1">Herauszoomen</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default PopupItem
