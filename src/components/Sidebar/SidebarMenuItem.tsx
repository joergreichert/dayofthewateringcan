import Button from '@/components/Button'
import IconCircle from '@/components/IconCircle'
import { AppConfig } from '@/lib/AppConfig'
import { WATER_TYPE_ID } from '@/lib/constants'
import { WaterType } from '@/lib/types/entityTypes'
import tailwindConfig from '@/root/tailwind.config'
import useMapStore from '@/zustand/useMapStore'

interface SidebarMenuItemProps {
  handleClick: (categoryId?: WATER_TYPE_ID) => void
  selected: boolean
  category: WaterType
}

const SidebarMenuItem = ({ handleClick, selected, category }: SidebarMenuItemProps) => {
  const selectedWaterType = useMapStore(state => state.selectedWaterType)
  const { white } = tailwindConfig.theme.colors

  return (
    <Button
      key={category.id}
      className={`relative p-1 gap-2 md:p-2 w-full flex ${
        selectedWaterType ? 'text-white' : ''
      } justify-start`}
      noGutter
      style={{ ...(!selectedWaterType ? { color: category.color } : {}) }}
      onClick={() => handleClick(selected ? undefined : category.id)}
      noBorderRadius
    >
      <IconCircle
        path={category.iconPath}
        size={AppConfig.ui.markerIconSize}
        bgColor={selectedWaterType?.id === category.id ? white : category.color}
        invert={selectedWaterType?.id === category.id}
      />
      <div className={`md:text-lg ${selectedWaterType?.id === category.id ? 'underline' : ''}`}>
        {category.name}
      </div>
    </Button>
  )
}

export default SidebarMenuItem
