import useAppTheme from '@/hooks/useTheme'
import useWaterTypes from '@/hooks/useWaterTypes'
import useMapStore from '@/zustand/useMapStore'

interface WaterTypeColorBgProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  outerClassName?: string
}

const WaterTypeColorBg = ({ children, outerClassName }: WaterTypeColorBgProps) => {
  const selectedWaterType = useMapStore(state => state.selectedWaterType)
  const { getWaterTypeById } = useWaterTypes()
  const theme = useAppTheme()

  return (
    <div className={`${outerClassName ?? ''}`}>
      <div
        style={{
          backgroundColor: selectedWaterType
            ? getWaterTypeById(selectedWaterType.id)?.color
            : (theme.color('mapBg') as string),
        }}
        className="absolute inset-0"
      />
      {children}
    </div>
  )
}

export default WaterTypeColorBg
